import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../../SupaBase";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AuthBanner from "../../../assets/authimg.png";
import "./index.css";
import { message } from "antd"; // Import Ant Design's message component
import { SmileOutlined, FrownOutlined } from "@ant-design/icons"; // Import icons

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

  const onSubmit = async (data: any) => {
    const { email, password } = data;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Error signing in:", error.message);
      message.open({
        type: "error",
        content: "Login failed: " + error.message,
        icon: <FrownOutlined style={{ color: "red" }} />, 
        duration: 3, // Display for 3 seconds
      });
    } else {
      console.log("Login successful!");
      message.open({
        type: "success",
        content: "Login successful!",
        icon: <SmileOutlined style={{ color: "green" }} />, 
        duration: 3, // Display for 3 seconds
      });
      message.open({
        type: "info",
        content: "✨ Welcome back! ✨",
        icon: <SmileOutlined style={{ color: "blue" }} />, 
        duration: 3, // Display for 3 seconds
      });
      localStorage.setItem("userEmail", email); 
      navigate("/dashboard");
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center w-screen min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Log in</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Sign in
            </button>
          </form>
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
          <p className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
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
      </div>
    </div>
  );
}
