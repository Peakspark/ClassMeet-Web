from openai import OpenAI
from dotenv import load_dotenv
from pathlib import Path
import os


env_path = Path(__file__).resolve().parent / ".env"


load_dotenv(dotenv_path=env_path)


api_key = os.getenv("OPENROUTER_API_KEY")


if not api_key:
    print("Error: OPENROUTER_API_KEY not found in .env file")
    exit()

print("API key loaded successfully!")

# OpenRouter client
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key
)


transcript = """
Riya will complete the AI chatbot by Monday.
Rehan will integrate the backend by Tuesday.
Arpit will test the meeting application on Wednesday.
The team will meet again on Thursday to review the project.
"""

print("\nAI Meeting Assistant")
print("Ask anything about the meeting.")
print("Type 'exit' to close the chatbot.\n")


while True:

    user_message = input("You: ")

    
    if user_message.lower() == "exit":
        print("Bot: Goodbye!")
        break

    prompt = f"""
You are an AI Meeting Assistant.

Use the following meeting transcript to answer the user's question.

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
- Generate follow-up messages

If the requested information is not present in the transcript,
say that it was not mentioned in the meeting.

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