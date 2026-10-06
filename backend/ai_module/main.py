from google import genai
from dotenv import load_dotenv

load_dotenv()

client = genai.Client()

transcript = """
Riya will complete the AI chatbot by Monday.
Rehan will integrate the backend by Tuesday.
Arpit will test the meeting application on Wednesday.
The team will meet again on Thursday to review the project.
"""

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

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt
    )

    print("Bot:", response.text)
    print()