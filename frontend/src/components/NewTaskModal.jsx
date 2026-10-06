import { useState } from "react";
import { X, ClipboardList } from "lucide-react";

function NewTaskModal({ isOpen, onClose, onCreateTask }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!title.trim() || !dueDate) {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      priority: priority,
      dueDate: dueDate,
      description: description,
      status: "Pending",
    };

    onCreateTask(newTask);

    setTitle("");
    setPriority("Medium");
    setDueDate("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#172033]">
              Create New Task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add a task for your team
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleCreateTask} className="mt-6">

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Task Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete React project"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Priority + Date */}
          <div className="mt-4 grid grid-cols-2 gap-3">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172033]">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#0F766E]"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#172033]">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#0F766E]"
              />
            </div>

          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add task details..."
              rows="3"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Buttons */}
          <div className="mt-6 flex gap-3">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0F766E] py-3 text-sm font-semibold text-white hover:bg-[#134E4A]"
            >
              <ClipboardList size={17} />
              Create Task
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default NewTaskModal;