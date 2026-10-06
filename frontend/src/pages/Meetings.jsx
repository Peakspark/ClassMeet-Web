import {CalendarDays, Clock,Users,Video,Search,} from "lucide-react";

function Meetings() {
  const meetings = [
    {
      title: "Team Standup",
      type: "Daily Meeting",
      date: "Today",
      time: "10:00 AM",
      duration: "30 min",
      members: 8,
    },
    {
      title: "Frontend Development",
      type: "Project Meeting",
      date: "Today",
      time: "12:00 PM",
      duration: "60 min",
      members: 5,
    },
    {
      title: "Design Discussion",
      type: "Team Meeting",
      date: "Today",
      time: "03:00 PM",
      duration: "45 min",
      members: 6,
    },
    {
      title: "Backend Integration",
      type: "Development Meeting",
      date: "Tomorrow",
      time: "11:00 AM",
      duration: "60 min",
      members: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0FDFA]">

      {/* Header */}
     

      {/* Content */}
      <div className="px-8 py-6">

        {/* Search + Filters */}
        <div className="mb-6 flex items-center justify-between">

          <div className="flex w-80 items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search meetings..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex gap-2">

            <button className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white">
              All
            </button>

            <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50">
              Today
            </button>

            <button className="rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50">
              Upcoming
            </button>

          </div>

        </div>

        {/* Meeting List */}
        <div className="space-y-4">

          {meetings.map((meeting) => (
            <div
              key={meeting.title}
              className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                {/* Meeting Info */}
                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                    <CalendarDays
                      size={22}
                      className="text-[#0F766E]"
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#172033]">
                      {meeting.title}
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      {meeting.type}
                    </p>
                  </div>

                </div>

                {/* Meeting Details */}
                <div className="flex items-center gap-8">

                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-[#172033]">
                      <CalendarDays size={15} />
                      {meeting.date}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                      <Clock size={14} />
                      {meeting.time}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    {meeting.duration}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Users size={16} />
                    {meeting.members}
                  </div>

                  <button className="flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#134E4A]">
                    <Video size={15} />
                    Join
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Meetings;