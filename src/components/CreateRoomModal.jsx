import { useState } from "react";
import { X, Plus } from "lucide-react";

function CreateRoomModal({ isOpen, onClose }) {
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("Team Meeting");
  const [description, setDescription] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleCreate = (e) => {
    e.preventDefault();

    if (!roomName.trim()) {
      return;
    }

    console.log("Room Created:", {
      roomName,
      roomType,
      description,
    });

    setRoomName("");
    setRoomType("Team Meeting");
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
              Create New Room
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Set up a new meeting room
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleCreate} className="mt-6">

          {/* Room Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Room Name
            </label>

            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Frontend Team"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Room Type */}
          <div className="mt-4">

            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Room Type
            </label>

            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            >
              <option>Team Meeting</option>
              <option>Classroom</option>
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
              placeholder="What is this room for?"
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
              <Plus size={17} />
              Create Room
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateRoomModal;