import { useEffect, useRef } from "react";

function VideoTile({
  stream,
  name,
  muted = false,
  micOn = true,
  cameraOn = true,
  isLocal = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !stream) {
      return;
    }

    video.srcObject = stream;

    const startVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.log("Video play waiting:", error);
      }
    };

    startVideo();

    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [stream, cameraOn]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#1F2937]">

      {stream && cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14B8A6] text-3xl font-bold text-white">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white">
        {name}
        {isLocal && " (You)"}
      </div>

      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-2 text-sm">
        {micOn ? "🎙️" : "🔇"}
      </div>

    </div>
  );
}

export default VideoTile;