import { useEffect, useRef } from "react";
import { Mic, MicOff,VideoOff } from "lucide-react";

function VideoTile({
  stream,
  screenStream = null,
  name = "Participant",
  muted = false,
  micOn = true,
  cameraOn = true,
  isLocal = false,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

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
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#14B8A6] text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
    
      
{!cameraOn &&( 

   <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
              <VideoOff size={16} />
              Camera Off
            </div>
          )}
        </div>
  )}
      <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-3 py-1.5 text-sm">
        {name}
        {isLocal && " (You)"}
      </div>

      <div
        className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full ${
          micOn ? "bg-black/50" : "bg-red-500"
        }`}
      >
        {micOn ? <Mic size={15} /> : <MicOff size={15} />}
      </div> 

    </div>
  );
}

export default VideoTile;