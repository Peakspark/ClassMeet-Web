import {
  CalendarDays,
  Clock,
  MoreHorizontal,
  Users,
  CheckCircle2,
  ClipboardList,
  BarChart3,
} from "lucide-react";

import QuickActions from "../components/QuickActions";
import JoinMeetingModal from "../components/JoinMeetingModal";
import CreateRoomModal from "../components/CreateRoomModal";
import ScheduleMeetingModal from "../components/ScheduleMeetingModal";
import NewTaskModal from "../components/NewTaskModal";
import StartPollModal from "../components/StartPollModal";

import { useNavigate } from "react-router-dom";
import API_URL from "../api/api";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // USER
  // =========================

  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // =========================
  // MEETINGS
  // =========================

  const [meetings, setMeetings] = useState([]);

  // =========================
  // MODALS
  // =========================

  const [showJoinModal, setShowJoinModal] =
    useState(false);

  const [showCreateRoom, setShowCreateRoom] =
    useState(false);

  const [showScheduleMeeting, setShowScheduleMeeting] =
    useState(false);

  const [showNewTask, setShowNewTask] =
    useState(false);

  const [showStartPoll, setShowStartPoll] =
    useState(false);

  // =========================
  // TASKS
  // =========================

  const [tasks, setTasks] = useState([]);

  // =========================
  // POLLS
  // =========================

  const [polls, setPolls] = useState([]);

  // =========================
  // ACTIVITIES
  // =========================

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

  // =========================
  // FETCH USER
  // =========================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/auth/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        console.log("Logged in user:", data);

        if (!response.ok) {
          navigate("/login");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error(
          "Error fetching user:",
          error
        );
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // =========================
  // FETCH MEETINGS
  // =========================

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/meetings`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        console.log(
          "Meetings from backend:",
          data
        );

        if (!response.ok) {
          console.error(
            data.message ||
              "Failed to fetch meetings"
          );

          return;
        }

        setMeetings(
          Array.isArray(data.meetings)
            ? data.meetings
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching meetings:",
          error
        );
      }
    };

    fetchMeetings();
  }, []);

  // =========================
  // JOIN MEETING
  // =========================

  const handleJoinMeeting = (meeting) => {
    console.log(
      "Joining meeting:",
      meeting
    );

    const meetingToken =
      meeting?.meetingLink ||
      meeting?.roomId ||
      meeting?._id;

    if (!meetingToken) {
      alert(
        "This meeting does not have a valid meeting ID."
      );
      return;
    }

    navigate(
      `/meeting/${meetingToken}`
    );
  };

  // =========================
  // VOTE
  // =========================

  const handleVote = (
    pollId,
    optionIndex
  ) => {
    setPolls((prevPolls) =>
      prevPolls.map((poll) => {
        if (poll.id !== pollId) {
          return poll;
        }

        const updatedVotes = [
          ...poll.votes,
        ];

        updatedVotes[optionIndex] += 1;

        return {
          ...poll,
          votes: updatedVotes,
        };
      })
    );
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-[#F0FDFA]">

      <div className="px-8 pb-10">

        {/* =========================
            QUICK ACTIONS
        ========================= */}

        <QuickActions
          onJoinMeeting={() =>
            setShowJoinModal(true)
          }
          onCreateRoom={() =>
            setShowCreateRoom(true)
          }
          onScheduleMeeting={() =>
            setShowScheduleMeeting(true)
          }
          onNewTask={() =>
            setShowNewTask(true)
          }
          onStartPoll={() =>
            setShowStartPoll(true)
          }
        />

        {/* =========================
            WELCOME
        ========================= */}

        <div className="mt-6 mb-4">

          {loadingUser ? (
            <h1 className="text-2xl font-bold text-[#172033]">
              Loading...
            </h1>
          ) : user ? (
            <h1 className="text-2xl font-bold text-[#172033]">
              Welcome, {user.name} 👋
            </h1>
          ) : (
            <h1 className="text-2xl font-bold text-[#172033]">
              Welcome 👋
            </h1>
          )}

          <p className="mt-1 text-gray-500">
            Here's what's happening in your
            ClassMeet workspace.
          </p>

        </div>

        {/* =========================
            MAIN GRID
        ========================= */}

        <div className="mt-8 grid grid-cols-3 gap-6">

          {/* =========================
              UPCOMING MEETINGS
          ========================= */}

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

              {meetings.length === 0 ? (

                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-8">

                  <CalendarDays
                    size={32}
                    className="text-slate-300"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    No meetings yet
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Create or schedule a meeting
                    to get started
                  </p>

                </div>

              ) : (

                meetings.map((meeting) => {

                  const meetingToken =
                    meeting?.meetingLink ||
                    meeting?.roomId ||
                    meeting?._id;

                  return (
                    <div
                      key={
                        meeting._id ||
                        meeting.id ||
                        meetingToken
                      }
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-teal-100 hover:bg-[#F0FDFA]"
                    >

                      {/* MEETING INFO */}

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">

                          <CalendarDays
                            size={20}
                            className="text-[#0F766E]"
                          />

                        </div>

                        <div>

                          <h3 className="text-sm font-semibold text-[#172033]">
                            {meeting.title ||
                              "ClassMeet Meeting"}
                          </h3>

                          <p className="mt-1 text-xs text-slate-400">
                            {meeting.type ||
                              "Meeting"}
                          </p>

                        </div>

                      </div>

                      {/* TIME / MEMBERS / JOIN */}

                      <div className="flex items-center gap-6">

                        {/* TIME */}

                        <div>

                          <div className="flex items-center gap-2 text-sm font-medium text-[#172033]">

                            <Clock size={15} />

                            {meeting.time ||
                              (
                                meeting.scheduledAt
                                  ? new Date(
                                      meeting.scheduledAt
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )
                                  : "Time not set"
                              )}

                          </div>

                          <p className="mt-1 text-xs text-slate-400">
                            {meeting.duration ||
                              "Meeting"}
                          </p>

                        </div>

                        {/* MEMBERS */}

                        <div className="flex items-center gap-1 text-xs text-slate-500">

                          <Users size={15} />

                          {meeting.members ||
                            meeting.participants
                              ?.length ||
                            1}

                        </div>

                        {/* JOIN */}

                        <button
                          type="button"
                          onClick={() =>
                            handleJoinMeeting(
                              meeting
                            )
                          }
                          className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#134E4A]"
                        >
                          Join
                        </button>

                      </div>

                    </div>
                  );
                })

              )}

            </div>

          </section>

          {/* =========================
              MY TASKS
          ========================= */}

          <section className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-[#172033]">
                  My Tasks
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Tasks created by you
                </p>

              </div>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0F766E]">
                {tasks.length} Tasks
              </span>

            </div>

            {tasks.length === 0 ? (

              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-8">

                <ClipboardList
                  size={32}
                  className="text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  No tasks created yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Click "New Task" to create one
                </p>

              </div>

            ) : (

              <div className="space-y-3">

                {tasks.map((task) => (

                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                  >

                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">

                        <ClipboardList
                          size={20}
                          className="text-[#0F766E]"
                        />

                      </div>

                      <div>

                        <h3 className="text-sm font-semibold text-[#172033]">
                          {task.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Due: {task.dueDate}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-3">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          task.priority ===
                          "High"
                            ? "bg-red-50 text-red-600"
                            : task.priority ===
                              "Medium"
                            ? "bg-orange-50 text-orange-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {task.priority}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {task.status}
                      </span>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =========================
              ACTIVE POLLS
          ========================= */}

          <section className="col-span-2 rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-bold text-[#172033]">
                  Active Polls
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Ask and collect responses
                  from your team
                </p>

              </div>

              <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-[#0F766E]">
                {polls.length} Polls
              </span>

            </div>

            {polls.length === 0 ? (

              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-8">

                <BarChart3
                  size={32}
                  className="text-slate-300"
                />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  No active polls
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Click "Start Poll" to create one
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {polls.map((poll) => (

                  <div
                    key={poll.id}
                    className="rounded-xl border border-slate-100 p-4"
                  >

                    <div className="flex items-start gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">

                        <BarChart3
                          size={19}
                          className="text-[#0F766E]"
                        />

                      </div>

                      <div>

                        <h3 className="text-sm font-semibold text-[#172033]">
                          {poll.question}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          Choose one option
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 space-y-2">

                      {poll.options.map(
                        (option, index) => (

                          <button
                            key={option}
                            onClick={() =>
                              handleVote(
                                poll.id,
                                index
                              )
                            }
                            className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm text-slate-600 hover:border-[#0F766E] hover:bg-teal-50"
                          >

                            <span>
                              {option}
                            </span>

                            <span className="text-xs text-slate-400">
                              {
                                poll.votes[
                                  index
                                ]
                              }{" "}
                              votes
                            </span>

                          </button>

                        )
                      )}

                    </div>

                  </div>

                ))}

              </div>

            )}

          </section>

          {/* =========================
              TODAY'S ACTIVITY
          ========================= */}

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

              {activities.map(
                (activity) => (

                  <div
                    key={`${activity.name}-${activity.time}`}
                    className="flex gap-3"
                  >

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-[#0F766E]">
                      {activity.name.charAt(
                        0
                      )}
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

                )
              )}

            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">

              <CheckCircle2
                size={16}
              />

              View All Activity

            </button>

          </section>

        </div>

      </div>

      {/* =========================
          JOIN MEETING MODAL
      ========================= */}

      <JoinMeetingModal
        isOpen={showJoinModal}
        onClose={() =>
          setShowJoinModal(false)
        }
        onJoinMeeting={(meetingId) => {

          console.log(
            "Join meeting:",
            meetingId
          );

          setShowJoinModal(false);

          if (!meetingId) {
            alert(
              "Please enter a meeting ID or link."
            );
            return;
          }

          navigate(
            `/meeting/${meetingId}`
          );
        }}
      />

      {/* =========================
          CREATE ROOM
      ========================= */}

      <CreateRoomModal
        isOpen={showCreateRoom}
        onClose={() =>
          setShowCreateRoom(false)
        }
        onCreateRoom={(newRoom) => {

          console.log(
            "Created room:",
            newRoom
          );

          setShowCreateRoom(false);

          const roomId =
            newRoom?.meetingLink ||
            newRoom?.roomId ||
            newRoom?.id;

          if (!roomId) {
            alert(
              "Room was created but no meeting ID was returned."
            );
            return;
          }

          navigate(
            `/meeting/${roomId}`
          );
        }}
      />

      {/* =========================
          SCHEDULE MEETING
      ========================= */}

      <ScheduleMeetingModal
        isOpen={showScheduleMeeting}
        onClose={() =>
          setShowScheduleMeeting(false)
        }
        onSchedule={(newMeeting) => {

          setMeetings((prev) => [
            ...prev,
            newMeeting,
          ]);

          setShowScheduleMeeting(
            false
          );
        }}
      />

      {/* =========================
          NEW TASK
      ========================= */}

      <NewTaskModal
        isOpen={showNewTask}
        onClose={() =>
          setShowNewTask(false)
        }
        onCreateTask={(newTask) => {

          setTasks((prev) => [
            ...prev,
            newTask,
          ]);

          setShowNewTask(false);
        }}
      />

      {/* =========================
          START POLL
      ========================= */}

      <StartPollModal
        isOpen={showStartPoll}
        onClose={() =>
          setShowStartPoll(false)
        }
        onCreatePoll={(newPoll) => {

          setPolls((prev) => [
            ...prev,
            newPoll,
          ]);

          setShowStartPoll(false);
        }}
      />

    </div>
  );
}

export default Dashboard;