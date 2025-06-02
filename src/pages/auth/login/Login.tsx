import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import { supabase } from "../../../supabase/SupaBase";
import AuthBanner from "../../../assets/authimg.png";
import "./index.css";
import { toast } from "sonner";
import { useAuthContext } from "../../../context";
import { useState } from "react";

// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  const onSubmit = async (data: any) => {
    const { email, password } = data;
    // const { error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    const { error } = await login(email, password);

    if (error) {
      // Show error message (keep Ant Design for error)
      message.open({
        type: "error",
        content: "Login failed: " + error.message,
        icon: <FrownOutlined style={{ color: "red" }} />,
        duration: 2,
      });
    } else {
      // Show cool toast with Sonner for success
      toast.success("Login successful! ✨ Welcome back!", {
        duration: 2000,
      });
      localStorage.setItem("userEmail", email);
      // Optionally, navigate after a short delay
      setTimeout(() => navigate("/home"), 1000);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center w-screen min-h-screen">
      {/* Left: Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <h1
            className="text-5xl md:text-7xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:from-pink-500 hover:to-blue-400 cursor-pointer animate-pulse"
          >
            Log in
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Email Field */}
            <div>
              <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent transition-all duration-300 hover:from-pink-500 hover:to-blue-400">
                Email*
              </label>
              <input
                {...register("email")}
                placeholder="Enter your email"
                className="w-full p-3 rounded-xl border-2 border-blue-300 focus:border-pink-400 focus:ring-2 focus:ring-purple-300 outline-none transition-all duration-300 shadow-md bg-white/80 hover:bg-blue-50 placeholder:text-gray-400 text-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-lg font-semibold mb-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-500 hover:to-purple-500">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter your password"
                  className="w-full p-3 rounded-xl border-2 border-purple-300 focus:border-blue-400 focus:ring-2 focus:ring-pink-300 outline-none transition-all duration-300 shadow-md bg-white/80 hover:bg-purple-50 placeholder:text-gray-400 text-lg"
                />
                <button
                  type="button"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-300
                    bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-100 hover:text-black focus:outline-none`}
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.233.938-4.675M6.343 6.343A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.233-.336 4.675-.938M17.657 17.657A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.233.336-4.675.938M3 3l18 18" />
                      </svg>
                      Hide
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Show
                    </>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer select-none">
                <input type="checkbox" className="mr-2 accent-purple-500 scale-125 transition-all duration-300" />
                <span className="text-sm font-medium text-gray-700 hover:text-blue-500 transition-colors duration-300">Remember for 30 days</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent hover:from-pink-500 hover:to-blue-400 transition-all duration-300"
              >
                Forgot password?
              </a>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-3 rounded-xl font-bold text-lg shadow-lg hover:from-pink-500 hover:to-blue-400 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200"
            >
              Sign in
            </button>
          </form>
          {/* Google Sign In */}
          <div className="mt-6 text-center">
            <button className="flex items-center justify-center w-full bg-white border-2 border-gray-300 p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 group">
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="font-semibold text-gray-700 group-hover:text-blue-500 transition-colors duration-300">Sign in with Google</span>
            </button>
          </div>
          {/* Sign Up Link */}
          <p className="mt-6 text-center text-md text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent hover:from-pink-500 hover:to-blue-400 transition-all duration-300">
              Sign up
            </a>
          </p>
          {/* Social Links - further down with translate effect */}
          <div className="flex flex-row items-center justify-center gap-8 mt-14">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl transition-all duration-300 group hover:scale-125 hover:-translate-y-2 hover:from-blue-500 hover:to-blue-700"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-125 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 5.92c-.8.36-1.67.6-2.58.71a4.48 4.48 0 0 0 1.97-2.48 8.93 8.93 0 0 1-2.83 1.08A4.48 4.48 0 0 0 11.1 9.03c0 .35.04.7.11 1.03C7.72 9.91 4.8 8.13 2.92 5.5a4.48 4.48 0 0 0-.61 2.25c0 1.55.79 2.92 2 3.72a4.48 4.48 0 0 1-2.03-.56v.06a4.48 4.48 0 0 0 3.6 4.4c-.2.05-.41.08-.62.08-.15 0-.3-.01-.45-.04a4.48 4.48 0 0 0 4.19 3.12A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.19 0-.39-.01-.58A9.1 9.1 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.7z" />
              </svg>
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl transition-all duration-300 group hover:scale-125 hover:-translate-y-2 hover:from-blue-700 hover:to-blue-900"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-125 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl transition-all duration-300 group hover:scale-125 hover:-translate-y-2 hover:from-blue-600 hover:to-blue-800"
            >
              <svg
                className="w-6 h-6 text-white group-hover:scale-125 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75c.97 0 1.75.79 1.75 1.75s-.78 1.75-1.75 1.75zm15.25 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.37-1.56 2.82-1.56 3.01 0 3.57 1.98 3.57 4.56v4.77z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Right: Banner */}
      <div className="flex-1 relative min-h-screen">
        <img
          src={AuthBanner}
          alt="Auth Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-center leading-tight mb-4 group"
          >
            <span
              className="block bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg transition-all duration-500
                animate-bounce group-hover:animate-none group-hover:scale-110 group-hover:-translate-y-2 group-hover:from-pink-500 group-hover:to-blue-400"
            >
              Good to see you again.
            </span>
            <span
              className="block mt-2 text-white/90 text-2xl md:text-3xl font-semibold transition-all duration-500
                animate-pulse group-hover:animate-none group-hover:text-blue-200 group-hover:scale-105 group-hover:translate-x-2"
            >
              Stay connected with your team and track your progress.
            </span>
            <span
              className="block mt-2 text-yellow-300 text-xl md:text-2xl font-medium italic transition-all duration-500
                animate-[wiggle_1.5s_ease-in-out_infinite] group-hover:animate-none group-hover:text-yellow-400 group-hover:scale-110 group-hover:-translate-x-2"
              style={{
                // Custom keyframes for wiggle if not in Tailwind config
                animationName:
                  "wiggle, bounce",
                animationDuration: "1.5s, 1s",
                animationIterationCount: "infinite, 1",
                animationTimingFunction: "ease-in-out, ease",
              }}
            >
              Your growth continues here.
            </span>
          </h1>
        </div>
        <div className="absolute bottom-20 flex items-center justify-center w-full z-10">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-purple-300 rounded-full"></span>
            <span className="w-6 h-6 bg-gray-400 rounded-full"></span>
            <span className="w-6 h-6 bg-yellow-400 rounded-full"></span>
            <span className="w-6 h-6 bg-blue-300 rounded-full"></span>
          </div>
          <p className="ml-4 text-white text-lg font-semibold">
            Join 40,000+ users
          </p>
        </div>
        {/* Social Links removed from here */}
      </div>
    </div>
  );
}
