from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import errors
from dotenv import load_dotenv
from pathlib import Path
from transcribe import get_transcript
import tempfile
import os
import time


BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")


app = FastAPI(
    title="ClassMeet AI Module",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is not set"
    )


client = genai.Client(
    api_key=api_key
)

AI_MODEL = "gemini-2.5-flash"


def generate_with_retry(prompt, retries=3):

    for attempt in range(retries):

        try:

            return client.models.generate_content(
                model=AI_MODEL,
                contents=prompt
            )

        except errors.ServerError:

            if attempt == retries - 1:
                raise

            wait = 2 ** attempt

            time.sleep(wait)

class AskRequest(BaseModel):

    transcript: str
    question: str
@app.get("/")
def home():

    return {
        "message": "ClassMeet AI Module is running"
    }

@app.get("/health")
def health():

    return {
        "status": "ok"
    }

@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...)
):

    suffix = Path(
        audio.filename
    ).suffix.lower()


    allowed_extensions = {

        ".mp3",
        ".wav",
        ".m4a",
        ".mp4",
        ".webm",
        ".ogg"

    }


    if suffix not in allowed_extensions:

        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format"
        )


    temp_path = None


    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            temp_path = temp_file.name

            content = await audio.read()

            temp_file.write(content)


        transcript = get_transcript(
            temp_path
        )


        if not transcript:

            raise HTTPException(
                status_code=400,
                detail="No speech detected"
            )


        return {

            "success": True,
            "transcript": transcript

        }


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            os.remove(temp_path)

@app.post("/ask")
def ask_question(
    data: AskRequest
):

    transcript = data.transcript.strip()

    question = data.question.strip()


    if not transcript:

        raise HTTPException(
            status_code=400,
            detail="Transcript is required"
        )


    if not question:

        raise HTTPException(
            status_code=400,
            detail="Question is required"
        )


    prompt = f"""
You are an AI Meeting Assistant.

Use ONLY the following meeting transcript
to answer the user's question.

Meeting Transcript:
{transcript}

User Question:
{question}

You can:
- Answer questions about the meeting
- Summarize the meeting
- Identify assigned tasks
- Identify responsible persons
- Identify deadlines
- Identify future meetings
- Generate short follow-up messages

If the requested information is not present
in the transcript, say that it was not
mentioned in the meeting.

Do not make up information.

Give a short and clear answer.
"""


    try:

        response = generate_with_retry(
            prompt
        )


        answer = response.text


        if not answer:

            raise HTTPException(
                status_code=503,
                detail="Gemini returned an empty response."
            )


        return {

            "success": True,
            "answer": answer

        }


    except errors.ClientError as e:

        raise HTTPException(
            status_code=400,
            detail=f"Gemini API error: {str(e)}"
        )


    except errors.ServerError:

        raise HTTPException(
            status_code=503,
            detail="Gemini server is currently busy."
        )


    except HTTPException:

        raise


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )