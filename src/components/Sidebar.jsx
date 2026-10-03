import { House,Video, MessageSquare, FolderKanban, BarChart3, Users, Settings, LogOut, GraduationCap,} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      icon: House,
      path: "/",
    },
    {
      name: "Meetings",
      icon: Video,
      path:"/meetings",
    },
    {
      name: "Messages",
      icon: MessageSquare,
       path: "/messages",
    },
    {
      name: "Projects",
      icon: FolderKanban,
       path: "/projects",
    },
    {
      name: "Analytics",
      icon: BarChart3,
    },
    {
      name: "Community",
      icon: Users,
    },
  ];
const navigate = useNavigate();
const location = useLocation();
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#134E4A] text-white">

      {/* Logo */}
      <div className="flex items-center gap-3 px-7 py-7">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14B8A6]">
          <GraduationCap size={24} />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          Class<span className="text-[#5EEAD4]">Meet</span>
        </h1>

      </div>

      {/* Navigation */}
      <nav className="mt-5 flex flex-1 flex-col gap-2 px-4">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
               onClick={() => {
    if (item.path ) {
      navigate(item.path);
    }
  }}
              className={`group flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-[#0F766E] text-white shadow-lg shadow-black/10"
                  : "text-teal-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon
                size={20}
                className={`transition ${
                 location.pathname === item.path
                    ? "text-white"
                    : "text-teal-200 group-hover:text-white"
                }`}
              />

              <span className="text-sm font-medium">
                {item.name}
              </span>
            </button>
          );
        })}

      </nav>

      {/* User Section */}
      <div className="border-t border-white/10 p-5">

        <div className="mb-5 flex items-center gap-3">

          {/* Avatar */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] font-semibold text-white">
            A
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              Amit Kumar
            </p>

            <p className="text-xs text-teal-200">
              Team Member
            </p>
          </div>

          <button className="rounded-lg p-1.5 transition hover:bg-white/10">
            <Settings
              size={18}
              className="text-teal-200"
            />
          </button>

        </div>

        {/* Logout */}
        <button className="flex items-center gap-3 rounded-lg px-1 text-sm text-teal-200 transition hover:text-white">

          <LogOut size={18} />

          <span>Log out</span>

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;