from google import genai
from google.genai import errors
from dotenv import load_dotenv
from pathlib import Path
from transcribe import get_transcript
import os
import time


env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("Error: GEMINI_API_KEY not found in .env file")
    exit()


client = genai.Client(api_key=api_key)

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

            print(f"Gemini server busy. Retrying in {wait}s...")

            time.sleep(wait)




audio_path = input(
    "Enter meeting audio file path: "
).strip()

audio_path = audio_path.strip('"')


if not os.path.exists(audio_path):

    print("Error: Audio file not found.")
    exit()

print("\nGenerating meeting transcript...\n")


try:

    transcript = get_transcript(audio_path)


except Exception as e:

    print("Transcription Error:", e)
    exit()


if not transcript:

    print("Error: No transcript was generated.")
    exit()


print("Meeting Transcript:")
print(transcript)
print()


print("AI Meeting Assistant")
print("Ask anything about the meeting.")
print("Type 'exit' to close the chatbot.\n")


while True:

    user_message = input("You: ").strip()


    if user_message.lower() == "exit":

        print("Bot: Goodbye!")
        break


    if not user_message:
        continue


    prompt = f"""
You are an AI Meeting Assistant.

Use ONLY the following meeting transcript
to answer the user's question.

Meeting Transcript:
{transcript}

User Question:
{user_message}

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

        response = generate_with_retry(prompt)

        bot_reply = response.text


        if not bot_reply:

            print("Bot: Gemini returned no answer.")
            continue


        print("Bot:", bot_reply)
        print()


    except errors.ClientError as e:

        print("Bot: Gemini API error:", e)
        print()


    except errors.ServerError:

        print("Bot: Gemini server is currently busy.")
        print()


    except Exception as e:

        print("Bot: Error:", e)
        print()