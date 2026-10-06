from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
from transcribe import get_transcript
import os

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENROUTER_API_KEY")

if not api_key:
    print("Error: OPENROUTER_API_KEY not found in .env file")
    exit()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)


audio_path = input("Enter meeting audio file path: ").strip()


audio_path = audio_path.strip('"')

if not os.path.exists(audio_path):
    print("Error: Audio file not found.")
    exit()

print("\nGenerating meeting transcript...\n")

try:
    transcript = get_transcript(audio_path)

except Exception as e:
    print("Error while generating transcript:", e)
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

Use only the following meeting transcript to answer the user's question.

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

If the requested information is not present in the transcript,
say that it was not mentioned in the meeting.

Do not make up information.

Give a short and clear answer.
"""

    try:

        response = client.chat.completions.create(
            model="nvidia/nemotron-3-ultra-550b-a55b:free",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        bot_reply = response.choices[0].message.content

        print("Bot:", bot_reply)
        print()

    except Exception as e:

        print("Bot: API error:", e)
        print()