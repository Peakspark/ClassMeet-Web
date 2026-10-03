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

prompt = f"""
You are an AI Meeting Assistant.

Analyze the following meeting transcript.

Extract:
1. Person responsible
2. Task assigned
3. Deadline
4. A short follow-up message

If a deadline is not mentioned, write "Not specified".

Meeting Transcript:
{transcript}
"""

response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=prompt
)

print(response.text)