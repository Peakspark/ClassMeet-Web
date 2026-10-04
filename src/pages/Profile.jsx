import { useState } from "react";
function Profile() {

 const [isEditing, setIsEditing] = useState(false);

const [profile, setProfile] = useState({

  name: "Alex Johnson",
  email: "alex@example.com",
  role: "Student",
  phone: "+91 9876543210",
});
  return (
    <div className="min-h-screen bg-[#F0FDFA] p-6">

      {/* Page Header */}
      <div className="mb-6">        
        <h1 className="text-3xl font-bold text-slate-800">
          My Profile
        </h1>

        <p className="mt-1 text-slate-500">
          Manage your personal information and account details
        </p>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl rounded-2xl bg-white p-8 shadow-sm">

        {/* Profile Header */}
        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center">

          {/* Avatar */}
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-3xl font-bold text-teal-700">
            A
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800">
              {profile.name}    
            </h2>

            <p className="mt-1 text-slate-500">
              {profile.email}
            </p>

            <span className="mt-3 inline-block rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              {profile.role}
            </span>
          </div>

          {/* Edit Button */}
         <button
             onClick={() => setIsEditing(!isEditing)}
             className="rounded-lg bg-teal-600 px-5 py-2.5 font-medium text-white hover:bg-teal-700"
>
             {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Personal Information */}
        <div className="pt-8">

          <h3 className="mb-5 text-xl font-semibold text-slate-800">
            Personal Information
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">

            {/* Full Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Full Name
              </label>

              <input
             type="text"
             value={profile.name}
             disabled={!isEditing}
              onChange={(e) =>
            setProfile({
          ...profile,
          name: e.target.value,
    })
  }
  className="w-full rounded-lg border border-slate-200 px-4 py-3"
/>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Email
              </label>

              <input
  type="email"
  value={profile.email}
  disabled={!isEditing}
  onChange={(e) =>
    setProfile({
      ...profile,
      email: e.target.value,
    })
  }
  className="w-full rounded-lg border border-slate-200 px-4 py-3"
/>
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Role
              </label>

             <input
  type="text"
  value={profile.role}
  disabled={!isEditing}
  onChange={(e) =>
    setProfile({
      ...profile,
      role: e.target.value,
    })
  }
  className="w-full rounded-lg border border-slate-200 px-4 py-3"
/>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Phone
              </label>

              <input
  type="text"
  value={profile.phone}
  disabled={!isEditing}
  onChange={(e) =>
    setProfile({
      ...profile,
      phone: e.target.value,
    })
  }
  className="w-full rounded-lg border border-slate-200 px-4 py-3"
/>
            </div>

          </div>
        </div>

        {/* Account Stats */}
        {/* <div className="mt-8 border-t border-slate-200 pt-8">

          <h3 className="mb-5 text-xl font-semibold text-slate-800">
            Account Overview
          </h3>

          <div className="grid gap-4 sm:grid-cols-3"> */}

            {/* <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Meetings
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                24
              </p>
            </div> */}

            {/* <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Hours
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                18.5
              </p>
            </div> */}

            {/* <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Joined
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-800">
                2026
              </p>
            </div> */}

          {/* </div>
        </div> */}

      </div>
    </div>
  );
}

export default Profile;