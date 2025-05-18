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


// Validation schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = async (data: any) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
      // setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center w-screen min-h-screen">
      {/* Left: Login Form */}
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Log in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                {...register("email")}
                placeholder="Enter your email"
                className="w-full p-2 border rounded-lg"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password*
              </label>
              <input
                type="password"
                {...register("password")}
                placeholder="Enter your password"
                className="w-full p-2 border rounded-lg"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">Remember for 30 days</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot password?
              </a>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Sign in
            </button>
          </form>
          {/* Google Sign In */}
          <div className="mt-6 text-center">
            <button className="flex items-center justify-center w-full bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50">
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          </div>
          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
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
          <h1 className="text-6xl font-bold text-white text-center leading-tight">
            Lorem Ipsum is <br /> simply dummy text
          </h1>
          <p className="text-lg text-white text-center mt-4 max-w-2xl">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard.
          </p>
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
        {/* Social Links - right half, floating, animated */}
        <div className="absolute right-10 bottom-10 flex flex-col items-end gap-6 z-20">
          <a
            href="https://twitter.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl transition-all duration-300 group hover:scale-110 hover:from-blue-500 hover:to-blue-700 hover:-translate-y-2 animate-bounce"
            style={{ animationDelay: "0.1s" }}
          >
            <svg className="w-7 h-7 text-white group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 5.92c-.8.36-1.67.6-2.58.71a4.48 4.48 0 0 0 1.97-2.48 8.93 8.93 0 0 1-2.83 1.08A4.48 4.48 0 0 0 11.1 9.03c0 .35.04.7.11 1.03C7.72 9.91 4.8 8.13 2.92 5.5a4.48 4.48 0 0 0-.61 2.25c0 1.55.79 2.92 2 3.72a4.48 4.48 0 0 1-2.03-.56v.06a4.48 4.48 0 0 0 3.6 4.4c-.2.05-.41.08-.62.08-.15 0-.3-.01-.45-.04a4.48 4.48 0 0 0 4.19 3.12A8.98 8.98 0 0 1 2 19.54a12.7 12.7 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.78 0-.19 0-.39-.01-.58A9.1 9.1 0 0 0 24 4.59a8.93 8.93 0 0 1-2.54.7z"/>
            </svg>
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl transition-all duration-300 group hover:scale-110 hover:from-blue-700 hover:to-blue-900 hover:-translate-y-2 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          >
            <svg className="w-7 h-7 text-white group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.312h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
            </svg>
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl transition-all duration-300 group hover:scale-110 hover:from-blue-600 hover:to-blue-800 hover:-translate-y-2 animate-bounce"
            style={{ animationDelay: "0.3s" }}
          >
            <svg className="w-7 h-7 text-white group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-9h3v9zm-1.5-10.29c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75c.97 0 1.75.79 1.75 1.75s-.78 1.75-1.75 1.75zm15.25 10.29h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.37-1.56 2.82-1.56 3.01 0 3.57 1.98 3.57 4.56v4.77z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
