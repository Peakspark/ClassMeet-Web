import {
  House,
  Video,
  MessageSquare,
  FolderKanban,
  BarChart3,
  Users,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    { name: "Office", icon: House },
    { name: "Meetings", icon: Video, active: true },
    { name: "Messages", icon: MessageSquare },
    { name: "Projects", icon: FolderKanban },
    { name: "Analytics", icon: BarChart3 },
    { name: "Community", icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#0B1930] text-white">

      {/* Logo */}
      <div className="flex items-center gap-3 px-7 py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <GraduationCap size={25} />
        </div>

        <h1 className="text-2xl font-bold">
          Class<span className="text-blue-400">Meet</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-1 flex-col gap-2 px-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-left transition ${
                item.active
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={20} />

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </button>
          );
        })}

      </nav>

      {/* User */}
      <div className="border-t border-white/10 p-5">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 font-semibold">
            A
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold">
              Amit Kumar
            </p>

            <p className="text-xs text-slate-400">
              Team Member
            </p>
          </div>

          <Settings size={18} className="text-slate-400" />
        </div>

        <button className="flex items-center gap-3 text-sm text-slate-400 hover:text-white">
          <LogOut size={18} />
          Log out
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;