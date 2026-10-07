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

    for attempt in range(3):
        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt
                ),
                timeout=30
            )

            return {"reply": response.text}

        except asyncio.TimeoutError:
            print(f"Gemini timeout - attempt {attempt + 1}/3")

            if attempt < 2:
                await asyncio.sleep(3)
                continue

            raise HTTPException(
                status_code=504,
                detail="Gemini response timeout. Please try again."
            )

        except Exception as e:
            error_str = str(e)
            print("Gemini error:", error_str)

            if "503" in error_str:
                wait = (attempt + 1) * 3
                print(f"503 - attempt {attempt + 1}/3, {wait}s wait...")
                await asyncio.sleep(wait)
                continue

            raise HTTPException(
                status_code=500,
                detail=error_str
            )

    raise HTTPException(
        status_code=503,
        detail="Gemini busy hai, thodi der baad try karo."
    )