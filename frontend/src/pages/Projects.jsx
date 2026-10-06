import {
  FolderKanban,
  Users,
  CalendarDays,
  MoreVertical,
  Plus,
} from "lucide-react";

function Projects() {
  const projects = [
    {
      id: 1,
      name: "Team Collaboration",
      description: "Manage team meetings, tasks and communication.",
      progress: 75,
      members: 6,
      deadline: "Oct 15, 2026",
      status: "In Progress",
    },
    {
      id: 2,
      name: "Learning Platform",
      description: "Build an interactive platform for online learning.",
      progress: 60,
      members: 4,
      deadline: "Oct 20, 2026",
      status: "In Progress",
    },
    {
      id: 3,
      name: "Meeting Scheduler",
      description: "Create and manage meetings with team members.",
      progress: 90,
      members: 5,
      deadline: "Oct 8, 2026",
      status: "Almost Done",
    },
    {
      id: 4,
      name: "Task Management",
      description: "Track tasks, deadlines and project progress.",
      progress: 100,
      members: 3,
      deadline: "Sep 30, 2026",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[#F0FDFA] px-8 pb-8">

      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#172033]">
            Projects
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage projects and track team progress
          </p>
        </div>

        <button
          className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#134E4A]"
        >
          <Plus size={18} />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
          >

            {/* Project Header */}
            <div className="flex items-start justify-between">

              <div className="flex items-center gap-4">

                {/* Project Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100">
                  <FolderKanban
                    size={23}
                    className="text-[#0F766E]"
                  />
                </div>

                {/* Project Name */}
                <div>
                  <h3 className="font-semibold text-[#172033]">
                    {project.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {project.description}
                  </p>
                </div>

              </div>

              {/* More Button */}
              <button
                className="rounded-lg p-2 transition hover:bg-slate-100"
              >
                <MoreVertical
                  size={19}
                  className="text-slate-500"
                />
              </button>

            </div>

            {/* Status + Percentage */}
            <div className="mt-6 flex items-center justify-between">

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  project.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : project.status === "Almost Done"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {project.status}
              </span>

              <span className="text-sm font-semibold text-[#172033]">
                {project.progress}%
              </span>

            </div>

            {/* Progress Bar */}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#14B8A6] transition-all"
                style={{
                  width: `${project.progress}%`,
                }}
              />
            </div>

            {/* Project Details */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">

              {/* Members */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users size={17} />
                <span>
                  {project.members} members
                </span>
              </div>

              {/* Deadline */}
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={17} />
                <span>
                  {project.deadline}
                </span>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default Projects;