import { useState } from "react";
import { X, Video, Copy } from "lucide-react";

function JoinMeetingModal({
  isOpen,
  onClose,
  onJoinMeeting,
}) {
  const [meetingId, setMeetingId] = useState("");
  const [copied, setCopied] = useState(false);

  if (!isOpen) {
    return null;
  }

  // =========================
  // EXTRACT MEETING TOKEN
  // =========================

  const getMeetingToken = (value) => {
    let input = value.trim();

    if (!input) {
      return "";
    }

    // If user pasted a full URL
    if (
      input.startsWith("http://") ||
      input.startsWith("https://")
    ) {
      try {
        const url = new URL(input);

        const parts = url.pathname
          .split("/")
          .filter(Boolean);

        // Example:
        // /meeting/classmeet-1791450055939
        //
        // Result:
        // classmeet-1791450055939

        return parts[parts.length - 1] || "";
      } catch (error) {
        console.error(
          "Invalid meeting URL:",
          error
        );

        return "";
      }
    }

    // If user entered only the meeting ID/token
    return input;
  };

  // =========================
  // JOIN MEETING
  // =========================

  const handleJoin = (e) => {
    e.preventDefault();

    if (!meetingId.trim()) {
      alert(
        "Please enter a meeting ID or meeting link."
      );
      return;
    }

    const meetingToken =
      getMeetingToken(meetingId);

    if (!meetingToken) {
      alert("Invalid meeting link.");
      return;
    }

    console.log(
      "Joining meeting:",
      meetingToken
    );

    // Close modal
    onClose();

    // Navigate to:
    // /meeting/<meetingToken>
    onJoinMeeting(meetingToken);

    setMeetingId("");
  };

  // =========================
  // COPY MEETING LINK
  // =========================

  const copyCurrentLink = async () => {
    if (!meetingId.trim()) {
      alert(
        "Enter a meeting ID first."
      );
      return;
    }

    const meetingToken =
      getMeetingToken(meetingId);

    if (!meetingToken) {
      alert("Invalid meeting ID or link.");
      return;
    }

    const link =
      `${window.location.origin}/meeting/${meetingToken}`;

    try {
      await navigator.clipboard.writeText(link);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Failed to copy meeting link:",
        error
      );
    }
  };

  // =========================
  // DISPLAY LINK
  // =========================

  const displayMeetingLink = () => {
    if (!meetingId.trim()) {
      return "";
    }

    const meetingToken =
      getMeetingToken(meetingId);

    if (!meetingToken) {
      return "";
    }

    return `${window.location.origin}/meeting/${meetingToken}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#172033]">
              Join Meeting
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter a meeting ID or paste a meeting link
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* =========================
            FORM
        ========================= */}

        <form onSubmit={handleJoin}>

          {/* MEETING ID */}

          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Meeting ID or Link
            </label>

            <input
              type="text"
              value={meetingId}
              onChange={(e) =>
                setMeetingId(e.target.value)
              }
              placeholder="e.g. classmeet-1791450055939"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              autoFocus
            />

          </div>

          {/* SHARE LINK */}

          <div className="mt-4">

            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Meeting Link
            </label>

            <div className="flex items-center gap-2">

              <input
                type="text"
                value={displayMeetingLink()}
                placeholder="Meeting link will appear here"
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />

              <button
                type="button"
                onClick={copyCurrentLink}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
                title="Copy meeting link"
              >
                <Copy size={17} />
              </button>

            </div>

            {copied && (
              <p className="mt-2 text-xs font-medium text-[#0F766E]">
                Meeting link copied!
              </p>
            )}

          </div>

          {/* JOIN BUTTON */}

          <button
            type="submit"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#134E4A]"
          >
            <Video size={18} />

            Join Meeting
          </button>

        </form>

      </div>

    </div>
  );
}

export default JoinMeetingModal;