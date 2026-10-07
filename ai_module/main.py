import os
import asyncio
import tempfile

from google import genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from transcribe import transcribe_audio



load_dotenv()


client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)

app = FastAPI(title="AI Module")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AskRequest(BaseModel):
    message: str
    transcript: str = ""




@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):

    temp_path = None

    try:

       
        suffix = os.path.splitext(file.filename)[1]

        
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:

            content = await file.read()

            temp_file.write(content)

            temp_path = temp_file.name


        
        transcript = transcribe_audio(temp_path)

        return {
            "transcript": transcript
        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    finally:

        # Temporary file delete kar do
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)



@app.post("/ask")
async def ask(req: AskRequest):
    prompt = f"""
You are an AI Meeting Assistant.

Meeting Transcript:
{req.transcript}

User Question:
{req.message}

Answer based on the transcript only.
"""

    models = [
        "gemini-3.8-flash",
        "gemini-3.5-flash-lite"
    ]

    last_error = ""

    for model_name in models:
        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=model_name,
                    contents=prompt
                ),
                timeout=30
            )

            return {
                "reply": response.text,
                "model_used": model_name
            }

        except Exception as e:
            last_error = str(e)
            print(f"{model_name} failed: {last_error}")

    raise HTTPException(
        status_code=503,
        detail=f"Gemini models unavailable. Last error: {last_error}"
    )