import {
  DoorOpen,
  Code2,
  Users,
  Coffee,
  Gamepad2,
  Plus,
} from "lucide-react";

function VirtualOffice() {
  const rooms = [
    {
      name: "Lobby",
      description: "Welcome & general discussion",
      icon: DoorOpen,
      members: 12,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Development Room",
      description: "Development team",
      icon: Code2,
      members: 8,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Meeting Hall",
      description: "Live meetings & classes",
      icon: Users,
      members: 24,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Social Lounge",
      description: "Casual conversations",
      icon: Coffee,
      members: 6,
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Gaming Zone",
      description: "Relax & have fun",
      icon: Gamepad2,
      members: 4,
      color: "bg-pink-100 text-pink-600",
    },
  ];

  return (
    <section className="px-8 py-8">

      {/* Section Header */}
      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-[#0B1930]">
            Virtual Office
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Move between rooms and connect with your team
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-[#0B1930] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
          <Plus size={17} />
          Create Room
        </button>

      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-5 gap-4">

        {rooms.map((room) => {

          const Icon = room.icon;

          return (
            <button
              key={room.name}
              className="group rounded-2xl bg-white p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Icon */}
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${room.color}`}
              >
                <Icon size={22} />
              </div>

              {/* Room Name */}
              <h3 className="font-bold text-[#0B1930]">
                {room.name}
              </h3>

              {/* Description */}
              <p className="mt-1 text-xs leading-5 text-slate-400">
                {room.description}
              </p>

              {/* Members */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <Users size={15} />
                <span>{room.members} people</span>
              </div>

            </button>
          );
        })}

      </div>

    </section>
  );
}

export default VirtualOffice;