import {
  Video,
  Plus,
  CalendarDays,
  ClipboardList,
  BarChart3,
} from "lucide-react";

function QuickActions() {
  const actions = [
    {
      title: "Join Meeting",
      description: "Enter a meeting room",
      icon: Video,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Create Room",
      description: "Set up a new room",
      icon: Plus,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Schedule Meeting",
      description: "Plan a future meeting",
      icon: CalendarDays,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "New Task",
      description: "Create a team task",
      icon: ClipboardList,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Start Poll",
      description: "Ask your team",
      icon: BarChart3,
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600",
    },
  ];

  return (
    <section className="px-8">

      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#0B1930]">
          Quick Actions
        </h2>

        <p className="text-sm text-slate-500">
          Get things done quickly
        </p>
      </div>

      <div className="grid grid-cols-5 gap-4">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="group rounded-2xl bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >

              <div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${action.iconBg}`}
              >
                <Icon
                  size={21}
                  className={action.iconColor}
                />
              </div>

              <h3 className="text-sm font-bold text-[#0B1930]">
                {action.title}
              </h3>

              <p className="mt-1 text-xs text-slate-400">
                {action.description}
              </p>

            </button>
          );
        })}

      </div>

    </section>
  );
}

export default QuickActions;