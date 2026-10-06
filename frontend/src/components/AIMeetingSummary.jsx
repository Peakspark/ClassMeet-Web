import { useState } from "react";
import {Sparkles,X,FileText,CheckCircle2,ListChecks,Loader2,} from "lucide-react";

function AIMeetingSummary({ isOpen, onClose }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState(null);

  if (!isOpen) {
    return null;
  }

  const generateSummary = () => {
    setIsGenerating(true);

    setTimeout(() => {
      setSummary({
        overview:
          "The team discussed the current project progress, pending development work, and the next steps for completing the platform.",
        keyPoints: [
          "Dashboard and meeting room development is in progress.",
          "Responsive design needs to be completed.",
          "Backend integration will be handled after the frontend is finalized.",
          "The team agreed to test the application before final deployment.",
        ],
        actionItems: [
          "Complete responsive design",
          "Connect backend APIs",
          "Test meeting features",
          "Prepare final deployment",
        ],
      });

      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
              <Sparkles
                size={22}
                className="text-[#0F766E]"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#172033]">
                AI Meeting Summary
              </h2>

              <p className="text-sm text-slate-500">
                Get an AI-generated summary of your meeting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {!summary ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 px-6 py-14 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                <Sparkles
                  size={30}
                  className="text-[#0F766E]"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#172033]">
                Generate Meeting Summary
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                AI will analyze the meeting conversation and generate
                key points, an overview, and actionable tasks.
              </p>

              <button
                onClick={generateSummary}
                disabled={isGenerating}
                className="mt-6 flex items-center gap-2 rounded-xl bg-[#0F766E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#134E4A] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isGenerating ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Summary
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Overview */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <FileText
                    size={19}
                    className="text-[#0F766E]"
                  />

                  <h3 className="font-semibold text-[#172033]">
                    Meeting Overview
                  </h3>
                </div>

                <div className="rounded-xl bg-[#F0FDFA] p-4 text-sm leading-6 text-slate-600">
                  {summary.overview}
                </div>
              </section>

              {/* Key Points */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <ListChecks
                    size={19}
                    className="text-[#0F766E]"
                  />

                  <h3 className="font-semibold text-[#172033]">
                    Key Points
                  </h3>
                </div>

                <div className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-[#0F766E]">
                        {index + 1}
                      </span>

                      <p className="text-sm leading-6 text-slate-600">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Items */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2
                    size={19}
                    className="text-[#0F766E]"
                  />

                  <h3 className="font-semibold text-[#172033]">
                    Action Items
                  </h3>
                </div>

                <div className="space-y-2">
                  {summary.actionItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#0F766E]"
                      />

                      <span className="text-sm text-slate-600">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Generate Again */}
              <button
                onClick={generateSummary}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Sparkles size={17} />
                Generate Again
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIMeetingSummary;