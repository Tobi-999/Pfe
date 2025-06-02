import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../../supabase/SupaBase";
import "./index.css";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Import the reset function from useForm
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    console.log(data);
    const success = await testOne(data); // Pass the form data to the testOne function
    if (success) {
      toast.success("Account created successfully! 🎉 Welcome aboard!", {
        duration: 2500,
      });
      reset(); // Reset the form fields if sign-up is successful
    }
  };

  async function testOne(data: any) {
    const { email, password, name } = data; // Destructure the form data

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name,
            last_name: "Doe",
          },
        },
      });

      if (error) {
        console.error("Error signing up:", error.message);
        return false;
      } else {
        console.log("Sign-up successful!");
        return navigate("/login"); // Return true if sign-up is successful
      }
    } catch (err) {
      console.error("Unexpected error during sign-up:", err);
      return false; // Return false if there is an unexpected error
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg transition-all duration-500 hover:scale-105 hover:from-pink-500 hover:to-blue-400 cursor-pointer">
          Sign up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent transition-all duration-300 hover:from-pink-500 hover:to-blue-400"
            >
              Name*
            </label>
            <input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full p-3 rounded-xl border-2 border-blue-300 focus:border-pink-400 focus:ring-2 focus:ring-purple-300 outline-none transition-all duration-300 shadow-md bg-white/80 hover:bg-blue-50 placeholder:text-gray-400 text-lg"
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby="name-error"
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-semibold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-500 hover:to-purple-500"
            >
              Email*
            </label>
            <input
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl border-2 border-purple-300 focus:border-pink-400 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-300 shadow-md bg-white/80 hover:bg-purple-50 placeholder:text-gray-400 text-lg"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-lg font-semibold mb-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent transition-all duration-300 hover:from-blue-500 hover:to-purple-500"
            >
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                placeholder="Create a password"
                className="w-full p-3 rounded-xl border-2 border-pink-300 focus:border-blue-400 focus:ring-2 focus:ring-pink-300 outline-none transition-all duration-300 shadow-md bg-white/80 hover:bg-pink-50 placeholder:text-gray-400 text-lg"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-error"
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
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Must be at least 8 characters.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-3 rounded-xl font-bold text-lg shadow-lg hover:from-pink-500 hover:to-blue-400 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="flex items-center justify-center w-full bg-white border-2 border-gray-300 p-3 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 group">
            <img
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-semibold text-gray-700 group-hover:text-blue-500 transition-colors duration-300">
              Sign up with Google
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-md text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent hover:from-pink-500 hover:to-blue-400 transition-all duration-300"
          >
            Log in
          </a>
        </p>
      </div>

      <div className="mt-10 text-center">
        
        <p className="mt-4 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
          Join 40,000+ users
        </p>
      </div>
    </div>
  );
}
