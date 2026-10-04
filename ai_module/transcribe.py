from faster_whisper import WhisperModel
from pathlib import Path

audio_path = Path(__file__).resolve().parent / "audio3.mp3"

model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)

segments, info = model.transcribe(
    str(audio_path),
    beam_size=5,
    initial_prompt="Names that may appear in this meeting: Aashi, Riya, Arpit."
)

transcript = ""

for segment in segments:
    transcript += segment.text + " "

print("\nMeeting Transcript:")
print(transcript.strip())