import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

      const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      await api.post("/auth/signup", formData);
      alert("Account created. Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Could not reach the server");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#F0FDFA] p-5">

      <div className="mx-auto flex min-h-[calc(100vh-40px)] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl">

        {/* LEFT SIDE */}
        <div className="hidden w-1/2 flex-col justify-between bg-[#134E4A] p-12 text-white lg:flex">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14B8A6]">
              <GraduationCap size={27} />
            </div>

            <h1 className="text-2xl font-bold">
              Class<span className="text-[#5EEAD4]">Meet</span>
            </h1>
          </div>

          {/* Main Content */}
          <div>

            <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm">
              🎓 Virtual Classroom Platform
            </div>

            <h2 className="max-w-lg text-5xl font-bold leading-tight">
              Learn.
              <br />
              Connect.
              <br />
              <span className="text-[#5EEAD4]">
                Grow Together.
              </span>
            </h2>

            <p className="mt-6 max-w-md leading-7 text-teal-100">
              Join your virtual classroom, attend live meetings,
              collaborate with classmates and stay connected
              with your teachers.
            </p>

          </div>

          {/* Bottom */}
          <div className="grid grid-cols-3 gap-3">

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">Live</p>
              <p className="mt-1 text-xs text-teal-100">
                Classes
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="mt-1 text-xs text-teal-100">
                Access
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-2xl font-bold">1</p>
              <p className="mt-1 text-xs text-teal-100">
                Platform
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-1/2">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#134E4A] text-white">
                <GraduationCap size={24} />
              </div>

              <h1 className="text-xl font-bold text-[#134E4A]">
                Class<span className="text-[#14B8A6]">Meet</span>
              </h1>
            </div>

            {/* Heading */}
            <div className="mb-8">

              <p className="mb-2 text-sm font-semibold text-[#14B8A6]">
                CREATE ACCOUNT
              </p>

              <h2 className="text-3xl font-bold text-[#172033]">
                Join ClassMeet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your account and start learning together.
              </p>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172033]">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#14B8A6] focus-within:ring-2 focus-within:ring-teal-100">

                  <User
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-slate-400"
                  />

                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172033]">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#14B8A6] focus-within:ring-2 focus-within:ring-teal-100">

                  <Mail
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-slate-400"
                  />

                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#172033]">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#14B8A6] focus-within:ring-2 focus-within:ring-teal-100">

                  <Lock
                    size={18}
                    className="text-slate-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="text-slate-400 hover:text-[#134E4A]"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">

                <input
                  type="checkbox"
                  required
                  className="mt-1 accent-[#14B8A6]"
                />

                <p className="text-xs leading-5 text-slate-500">
                  I agree to the ClassMeet terms and
                  privacy policy.
                </p>

              </div>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#134E4A] py-3.5 font-semibold text-white transition hover:bg-[#0F766E]"
              >
                Create Account
                <ArrowRight size={18} />
              </button>

            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-[#0F766E] hover:underline"
              >
                Login
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;