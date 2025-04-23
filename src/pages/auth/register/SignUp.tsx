import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../../supabase/SupaBase";
import "./index.css";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignUp() {
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
          },
        },
      });

      if (error) {
        console.error("Error signing up:", error.message);
        return false; // Return false if there is an error
      } else {
        console.log("Sign-up successful!");
        return true; // Return true if sign-up is successful
      }
    } catch (err) {
      console.error("Unexpected error during sign-up:", err);
      return false; // Return false if there is an unexpected error
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign up</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name*
            </label>
            <input
              id="name"
              {...register("name")}
              placeholder="Enter your name"
              className="w-full p-2 border rounded-lg"
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
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email*
            </label>
            <input
              id="email"
              {...register("email")}
              placeholder="Enter your email"
              className="w-full p-2 border rounded-lg"
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
              className="block text-sm font-medium mb-1"
            >
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                placeholder="Create a password"
                className="w-full p-2 border rounded-lg"
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby="password-error"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
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
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button className="flex items-center justify-center w-full bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50">
            <img
              src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Sign up with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-500">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry’s standard.
        </p>
        <p className="mt-4 text-gray-700 font-semibold">Join 40,000+ users</p>
      </div>
    </div>
  );
}
