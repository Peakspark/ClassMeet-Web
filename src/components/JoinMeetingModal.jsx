import { X, Video, Copy } from "lucide-react";

function JoinMeetingModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#172033]">
              Join Meeting
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the meeting details
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* Meeting ID */}
        <div className="mt-6">

          <label className="mb-2 block text-sm font-medium text-[#172033]">
            Meeting ID
          </label>

          <input
            type="text"
            placeholder="Enter meeting ID"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
          />

        </div>

        {/* Meeting Link */}
        <div className="mt-4">

          <label className="mb-2 block text-sm font-medium text-[#172033]">
            Meeting Link
          </label>

          <div className="flex items-center gap-2">

            <input
              type="text"
              value="classmeet.com/meet/abc123"
              readOnly
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
            />

            <button
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50"
              title="Copy link"
            >
              <Copy size={17} />
            </button>

          </div>

        </div>

        {/* Join Button */}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 font-semibold text-white transition hover:bg-[#134E4A]">

          <Video size={18} />

          Join Meeting

        </button>

      </div>

    </div>
  );
}

export default JoinMeetingModal;
