from faster_whisper import WhisperModel


# Model ek baar load hoga
model = WhisperModel(
    "base",
    device="cpu",
    compute_type="int8"
)


def transcribe_audio(file_path):

    segments, info = model.transcribe(
        file_path,
        beam_size=5
    )

    transcript = ""

    for segment in segments:
        transcript += segment.text + " "

    return transcript.strip()