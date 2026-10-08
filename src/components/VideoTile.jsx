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
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-black aspect-video">

      {stream && cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#172033]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14B8A6] text-2xl font-bold">
            {name?.charAt(0)?.toUpperCase()}
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-sm">
        {name}
        {isLocal && " (You)"}
      </div>

      <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2 py-1">
        {micOn ? "🎙️" : "🔇"}
      </div>

    </div>
  );
}

export default VideoTile;