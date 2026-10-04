from faster_whisper import WhisperModel
from pathlib import Path

def get_transcript():
    audio_path = Path(__file__).resolve().parent / "audio3.mp3"

    model = WhisperModel(
        "base",
        device="cpu",
        compute_type="int8"
    )

    segments, info = model.transcribe(
        str(audio_path),
        beam_size=5
    )

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()


if __name__ == "__main__":
    transcript = get_transcript()

    print("\nMeeting Transcript:")
    print(transcript)