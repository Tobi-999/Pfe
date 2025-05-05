import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UploadCloud, DownloadCloud, Search } from "lucide-react";
import { supabase } from "../../../supabase/SupaBase";
import { message } from "antd";
import { toast } from "sonner";

// todo add field called department (select either it business or desing)
// todo add fied called ends_at (date)

const schema = yup.object().shape({
  jobName: yup.string().required("Job name is required"),
  description: yup
    .string()
    .max(275, "Description must be at most 275 characters")
    .required("Description is required"),
  openSeats: yup
    .number()
    .typeError("Open seats must be a number")
    .min(1, "Open seats must be at least 1")
    .required("Number of open seats is required"),
  avatar: yup
    .mixed()
    .test("fileSize", "File size is too large", (value) =>
      value?.[0] ? value[0].size <= 800 * 400 : true
    )
    .test("fileType", "Unsupported file format", (value) =>
      value?.[0]
        ? ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
            value[0].type
          )
        : true
    ),
  previewUrl: yup.string().nullable(),
  department: yup
    .string()
    .oneOf(["it", "business", "design"], "Invalid department")
    .required("Department is required"),
  ends_at: yup.date().required("End date is required"),
});

export default function CreateJobForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      jobName: "",
      description: "",
      openSeats: 1,
      avatar: null,
      previewUrl: null,
      department: "",
      ends_at: "",
    },
  });

  const previewUrl = watch("previewUrl");
  const onSubmit = async (data: any) => {
    try {
      // Upload image to storage bucket if provided
      let imageUrl = null;
      if (data.avatar?.[0]) {
        const file = data.avatar[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("job-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/job-images/${fileName}`;
      }

      // Insert job data into jobs table
      const { error: jobError } = await supabase.from("jobs").insert([
        {
          title: data.jobName,
          description: data.description,
          number_of_seats: data.openSeats,
          picture: imageUrl,
          created_at: new Date(),
          department: data.department,
          ends_at: data.ends_at,
        },
      ]);

      if (jobError) throw jobError;

      toast.success("✅ Job created successfully!");

      // Reset form after successful submission
      setValue("jobName", "");
      setValue("description", "");
      setValue("openSeats", 1);
      setValue("avatar", undefined);
      setValue("previewUrl", undefined);
      setValue("department", "");
      setValue("ends_at", "");
    } catch (error) {
      console.error("Error creating job:", error);
      message.error("Failed to create job");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 mx-auto max-w-full w-full relative">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center mb-8 relative">
        <h1 className="text-3xl font-bold text-gray-900">Create</h1>
        <div className="absolute right-0 mr-6 flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          <button className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
            <DownloadCloud className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Personal info
            </h2>
            <p className="text-sm text-gray-500">
              Update your photo and personal details here.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md">
              Cancel
            </button>
            <button
              form="jobForm"
              type="submit"
              className="px-6 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md"
            >
              Save
            </button>
          </div>
        </div>

        <form
          id="jobForm"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Job Name Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Job Name
            </label>
            <input
              {...register("jobName")}
              type="text"
              className="text-base font-medium text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.jobName && (
              <p className="text-sm text-red-500">{errors.jobName.message}</p>
            )}
          </div>

          {/* Description Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Write a short description..."
              className="text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Choose Job Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-600 shadow-inner shrink-0 overflow-hidden">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-purple-600 font-medium">
                  Click to upload
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  or drag and drop
                  <br />
                  SVG, PNG, JPG or GIF (max. 800×400px)
                </span>
                <input
                  {...register("avatar")}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      setValue("avatar", file);
                      // Create preview URL
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        if (reader.result) {
                          setValue("previewUrl", reader.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
            {errors.avatar && (
              <p className="text-sm text-red-500">{errors.avatar.message}</p>
            )}
          </div>

          {/* Open Seats Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Number of Open Seats
            </label>
            <input
              {...register("openSeats")}
              type="number"
              className="text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min=" "
            />
            {errors.openSeats && (
              <p className="text-sm text-red-500">{errors.openSeats.message}</p>
            )}
          </div>

          {/* Department Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              {...register("department")}
              className="text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select department</option>
              <option value="it">IT</option>
              <option value="business">Business</option>
              <option value="design">Design</option>
            </select>
            {errors.department && (
              <p className="text-sm text-red-500">{errors.department.message}</p>
            )}
          </div>

          {/* End Date Section */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              {...register("ends_at")}
              type="date"
              className="text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {errors.ends_at && (
              <p className="text-sm text-red-500">{errors.ends_at.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-8">
            <button
              type="button"
              onClick={() => console.log("Cancel clicked")}
              className="px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
