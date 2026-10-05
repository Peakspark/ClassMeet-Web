from faster_whisper import WhisperModel
import os

model = None


def get_whisper_model():

    global model

    if model is None:

        model_name = os.getenv(
            "WHISPER_MODEL",
            "tiny"
        )

        model = WhisperModel(
            model_name,
            device="cpu",
            compute_type="int8"
        )

    return model


def get_transcript(audio_path):

    whisper_model = get_whisper_model()

    segments, info = whisper_model.transcribe(
        audio_path,
        beam_size=5,
        vad_filter=True
    )

    transcript_parts = []

    for segment in segments:

        text = segment.text.strip()

        if text:
            transcript_parts.append(text)

    transcript = " ".join(transcript_parts)

    return transcript.strip()