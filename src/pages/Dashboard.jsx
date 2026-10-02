import {
  CalendarDays,
  Clock,
  Video,
  MoreHorizontal,
  Users,
  CheckCircle2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
 import QuickActions from "../components/QuickActions";

function Dashboard() {
  const meetings = [
    {
      title: "Team Standup",
      type: "Daily Meeting",
      time: "10:00 AM",
      duration: "30 min",
      members: 8,
    },
    {
      title: "Frontend Development",
      type: "Project Meeting",
      time: "12:00 PM",
      duration: "60 min",
      members: 5,
    },
    {
      title: "Design Discussion",
      type: "Team Meeting",
      time: "03:00 PM",
      duration: "45 min",
      members: 6,
    },
  ];

  const activities = [
    {
      name: "Aman Kumar",
      action: "joined the meeting",
      time: "5 min ago",
    },
    {
      name: "Priya Mehta",
      action: "completed a task",
      time: "18 min ago",
    },
    {
      name: "Rahul Singh",
      action: "shared a file",
      time: "32 min ago",
    },
    {
      name: "Sneha Verma",
      action: "scheduled a meeting",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0FDFA]">

      <Sidebar />

      <main className="ml-64 min-h-screen">

        <Header />

        <div className="px-8 pb-10">

          {/* Quick Actions */}
          <QuickActions />

          {/* Main Dashboard */}
          <div className="mt-8 grid grid-cols-3 gap-6">

            {/* Upcoming Meetings */}
            <section className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold text-[#172033]">
                    Upcoming Meetings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your meetings scheduled for today
                  </p>
                </div>

                <button className="text-sm font-semibold text-[#0F766E] hover:underline">
                  View All
                </button>

              </div>

              <div className="space-y-3">

                {meetings.map((meeting) => (
                  <div
                    key={meeting.title}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-teal-100 hover:bg-[#F0FDFA]"
                  >

                    {/* Meeting Info */}
                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
                        <CalendarDays
                          size={20}
                          className="text-[#0F766E]"
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-[#172033]">
                          {meeting.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {meeting.type}
                        </p>
                      </div>

                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-6">

                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-[#172033]">
                          <Clock size={15} />
                          {meeting.time}
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          {meeting.duration}
                        </p>
                      </div>

                      {/* Members */}
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Users size={15} />
                        {meeting.members}
                      </div>

                      {/* Join */}
                      <button className="flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#134E4A]">
                        <Video size={15} />
                        Join
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            </section>

            {/* Today's Activity */}
            <section className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6 flex items-center justify-between">

                <div>
                  <h2 className="text-lg font-bold text-[#172033]">
                    Today's Activity
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Recent team activity
                  </p>
                </div>

                <button className="rounded-lg p-2 hover:bg-slate-50">
                  <MoreHorizontal
                    size={19}
                    className="text-slate-400"
                  />
                </button>

              </div>

              <div className="space-y-5">

                {activities.map((activity) => (
                  <div
                    key={`${activity.name}-${activity.time}`}
                    className="flex gap-3"
                  >

                    {/* Avatar */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-[#0F766E]">
                      {activity.name.charAt(0)}
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-[#172033]">
                        <span className="font-semibold">
                          {activity.name}
                        </span>{" "}
                        {activity.action}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {activity.time}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                <CheckCircle2 size={16} />
                View All Activity
              </button>

            </section>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;