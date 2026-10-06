import { useState } from "react";
import { X, CalendarDays } from "lucide-react";

function ScheduleMeetingModal({ isOpen, onClose ,onSchedule }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingType, setMeetingType] = useState("Team Meeting");
  const [description, setDescription] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSchedule = (e) => {
    e.preventDefault();

    if (!title.trim() || !date || !time) {
      return;
    }

    
    const newMeeting = {

   id: Date.now(),
  roomId: `classmeet-${Date.now()}`,
  title: title,
  type: meetingType,
  time: time,
  duration: "60 min",
  members: 0,
};

onSchedule(newMeeting);

    setTitle("");
    setDate("");
    setTime("");
    setMeetingType("Team Meeting");
    setDescription("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-[#172033]">
              Schedule Meeting
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Plan a meeting for your team
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSchedule} className="mt-6">

          {/* Meeting Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Meeting Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Team Meeting"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Date + Time */}
          <div className="mt-4 grid grid-cols-2 gap-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172033]">
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172033]">
                Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Meeting Type */}
          <div className="mt-4">

            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Meeting Type
            </label>

            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            >
              <option>Team Meeting</option>
              <option>Class Meeting</option>
              <option>Project Discussion</option>
              <option>General Meeting</option>
            </select>

          </div>

          {/* Description */}
          <div className="mt-4">

            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add meeting details..."
              rows="3"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />

          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 text-sm font-semibold text-white transition hover:bg-[#134E4A]"
            >
              <CalendarDays size={17} />
              Schedule Meeting
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ScheduleMeetingModal;