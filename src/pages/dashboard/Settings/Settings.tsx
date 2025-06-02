import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CloudUpload } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Profile {
  id: string;
  role: string;
  first_name: string;
  hiring_date: string;
  department: string;
  email: string;
  bio?: string;
  profile_picture?: string;
}

interface FormData {
  company_name: string;
  tagline: string;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
}

interface UpdateData {
  bio?: string;
  profile_picture?: string;
}

// Update validation schema to match FormData interface
const schema = yup.object().shape({
  company_name: yup.string(),
}) as yup.ObjectSchema<FormData>;

function Settings() {
  // State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  // Supabase client
  const supabaseUrl = "https://jgqhkvlhqsxobscfsfkv.supabase.co";
  const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Form
  const { control, handleSubmit, watch, reset, ...rest } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: "",
    },
  });

  console.log(rest.formState.errors, "rest");

  const tagline = watch("tagline");
  const maxCharacters = 1500;

  // Fetch user role and profile
  useEffect(() => {
    const fetchRoleAndProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, role, first_name, hiring_date, department, email,  profile_pic_url"
        )
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setRole(data.role);
        setProfile(data as Profile);
      }
    };
    fetchRoleAndProfile();
  }, []);

  // File handlers
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setUploadedImgUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedImgUrl(URL.createObjectURL(file));
    }
  };

  // Form submit
  const onSubmit = async (data: FormData) => {
    try {
      console.log(role, "here");
      if (role === "employee") {
        // For employees, only update bio and profile picture if changed
        const updateData: UpdateData = {};
        console.log({ uploadedFile });
        // Handle profile picture upload if changed
        if (uploadedFile) {
          const fileExt = uploadedFile.name.split(".").pop();
          const fileName = `${profile?.id}-${Math.random()}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from("profiles")
            .upload(fileName, uploadedFile);

          console.log(uploadError);

          if (uploadError) throw uploadError;

          updateData.profile_pic_url = `${
            import.meta.env.VITE_SUPABASE_URL
          }/storage/v1/object/public/profiles//${fileName}`;
        }

        const { error } = await supabase
          .from("profiles")
          .update(updateData)
          .eq("id", profile?.id);

        if (error) throw error;
        toast.success("Profile updated successfully! 🎉", { duration: 2000 });
      } else {
        // Handle company settings update (existing code)
        const { company_name, tagline, twitter, facebook, linkedin } = data;
        const { error } = await supabase.from("settings").insert([
          {
            company_name,
            tagline,
            twitter,
            facebook,
            linkedin,
          },
        ]);
        if (!error) {
          toast.success("Save is done! 🎉", { duration: 2000 });
          reset();
        } else {
          toast.error("Error saving data: " + error.message, {
            duration: 2000,
          });
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile", { duration: 2000 });
    }
  };

  // Render
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative h-screen flex flex-col items-start px-8"
    >
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <div className="w-full flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium mb-1">
              {role === "employee" ? "Your profile" : "Company profile"}
            </p>
            <p className="text-gray-500 text-sm">
              {role === "employee"
                ? "Update your data here."
                : "Update your company photo and details here."}
            </p>
          </div>
          <div className="flex gap-4 ml-[50rem]">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">
              Cancel
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </div>
        <hr className="border-gray-300 " />

        {/* Company Name Section (replaces Public Profile Section) */}
        <div className="w-full">
          <p className="text-lg font-medium mb-1">
            {role === "employee" ? "Your profile" : "Company name"}
          </p>
          {role === "employee" ? (
            <div className="flex flex-col gap-2 ml-[10rem]">
              <div>
                <span className="font-semibold">Name: </span>
                <span>{profile.first_name || "-"}</span>
              </div>
              <div>
                <span className="font-semibold">Hiring Date: </span>
                <span>{profile.hiring_date || "-"}</span>
              </div>
              <div>
                <span className="font-semibold">Department: </span>
                <span>{profile.department || "-"}</span>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <span>{profile.email || "-"}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-sm">
                This will be displayed on your profile.
              </p>
              <Controller
                name="company_name"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      {...field}
                      type="text"
                      className="w-1/2 border border-gray-300 px-2 py-1 rounded ml-[10rem]"
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-sm ml-[10rem]">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          )}
        </div>
        <hr className="border-gray-300 " />

        {/* Tagline/Bio Section */}
        <div className="w-full">
          <p className="text-lg font-medium mb-1">
            {role === "employee" ? "Bio" : "Tagline"}
          </p>
          <div className="flex items-start gap-4 self-start">
            <p className="text-gray-500 text-sm">
              {role === "employee"
                ? "Write something about yourself"
                : "A quick snapshot of your company."}
            </p>
            <Controller
              name="tagline"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <textarea
                    {...field}
                    className="w-1/2 border border-gray-300 px-4 py-2 rounded ml-[11rem] h-39"
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm ml-[11rem]">
                      {fieldState.error.message}
                    </p>
                  )}
                </>
              )}
            />
          </div>
          <p className="text-gray-500 text-sm mt-1 ml-[25rem]">
            {maxCharacters - tagline?.length} characters left
          </p>
        </div>
        <hr className="border-gray-300 " />

        {/* Logo/Profile Pic Section */}
        <div className="w-full flex items-center gap-8">
          <div>
            <p className="text-lg font-medium mb-1">
              {role === "employee" ? "Your pic" : "Company logo"}
            </p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                {role === "employee" ? (
                  "Choose your profile pic"
                ) : (
                  <>
                    Update your company logo and then <br /> choose where you
                    want it to display.
                  </>
                )}
              </p>
              <img
                src={uploadedImgUrl || "path/to/logo.png"}
                alt={role === "employee" ? "Profile Pic" : "Company Logo"}
                className="w-32 h-auto mb-4 ml-[13rem]"
              />
            </div>
          </div>
          <div
            className={`flex items-center border border-gray-300 rounded px-4 py-6 w-1/2 justify-center transition-all duration-700 ease-in-out ${
              uploadedImgUrl
                ? "bg-gradient-to-r from-green-200 via-green-100 to-green-300 shadow-lg scale-105"
                : "bg-white"
            }`}
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="text-center">
              <CloudUpload className="h-10 w-10 text-gray-400 mb-2 ml-[5rem]" />
              <label className="text-purple-600 cursor-pointer">
                Click to upload
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-gray-500 text-sm">or drag and drop</p>
              <p className="text-gray-400 text-xs">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>
        <hr className="border-gray-300 " />

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-4 ml-[27rem]">
          <button
            type="button"
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default Settings;
