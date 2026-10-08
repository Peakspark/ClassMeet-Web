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
    if (!videoRef.current || !stream) {
      return;
    }

    videoRef.current.srcObject = stream;

    // Make sure playback starts
    videoRef.current
      .play()
      .catch((error) => {
        console.log("Video autoplay:", error);
      });

  }, [stream, cameraOn]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-[#1F2937]">

      {/* VIDEO */}

      {stream && cameraOn ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          className="h-full w-full object-cover"
        />
      ) : (
        /* CAMERA OFF */

        <div className="flex h-full w-full items-center justify-center">

          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14B8A6] text-3xl font-bold text-white">
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>

        </div>
      )}

      {/* NAME */}

      <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium text-white">
        {name}

        {isLocal && " (You)"}
      </div>

      {/* MIC */}

      <div className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-2 text-sm">
        {micOn ? "🎙️" : "🔇"}
      </div>

    </div>
  );
}

export default VideoTile;