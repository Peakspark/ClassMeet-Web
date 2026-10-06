import { useState } from "react";
import { X, BarChart3, Plus, Trash2 } from "lucide-react";

function StartPollModal({ isOpen, onClose, onCreatePoll }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  if (!isOpen) {
    return null;
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      return;
    }

    setOptions(options.filter((_, i) => i !== index));
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();

    const validOptions = options.filter(
      (option) => option.trim() !== ""
    );

    if (!question.trim() || validOptions.length < 2) {
      return;
    }

    const newPoll = {
      id: Date.now(),
      question: question,
      options: validOptions,
      votes: validOptions.map(() => 0),
    };

    onCreatePoll(newPoll);

    setQuestion("");
    setOptions(["", ""]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#172033]">
              Start a Poll
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Ask your team a question
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
        <form onSubmit={handleCreatePoll} className="mt-6">

          {/* Question */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Poll Question
            </label>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Which technology should we use?"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Options */}
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-[#172033]">
              Options
            </label>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value)
                    }
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-teal-100"
                  />

                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="rounded-lg p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Option */}
            <button
              type="button"
              onClick={addOption}
              className="mt-3 flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#134E4A]"
            >
              <Plus size={17} />
              Add Option
            </button>
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
              <BarChart3 size={17} />
              Create Poll
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default StartPollModal;