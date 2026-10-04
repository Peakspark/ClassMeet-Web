from google import genai
from google.genai import errors
from dotenv import load_dotenv
import time

load_dotenv()

client = genai.Client()

transcript = """
Riya will complete the AI chatbot by Monday.
Rehan will integrate the backend by Tuesday.
Arpit will test the meeting application on Wednesday.
The team will meet again on Thursday to review the project.
"""


def generate_with_retry(client, prompt, retries=5):

    for i in range(retries):

        try:
            return client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt
            )

        except errors.ServerError as e:

            if i == retries - 1:
                raise

            wait = 2 ** i

            print(f"Server busy, retrying in {wait}s...")

            time.sleep(wait)


print("AI Meeting Assistant")
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

        response = generate_with_retry(client, prompt)

        print("Bot:", response.text)
        print()

    except errors.ServerError:

        print("Bot: Gemini server is currently busy. Please try again later.")
        print()

    except errors.ClientError as e:

        print("Bot: API request error:", e)
        print()