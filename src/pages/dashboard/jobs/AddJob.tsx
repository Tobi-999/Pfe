import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UploadCloud, DownloadCloud, Search } from "lucide-react";
import { supabase } from "../../../supabase/SupaBase";
import { message } from "antd";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface JobFormData {
  jobName: string;
  description: string;
  openSeats: number;
  avatar: FileList | null;
  previewUrl: string | null;
  department: "it" | "business" | "design";
  ends_at: string;
}

interface JobData {
  id: string;
  title: string;
  description: string;
  number_of_seats: number;
  picture: string | null;
  department: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
}

const schema = yup.object().shape({
  jobName: yup.string().required("Job name is required"),
  description: yup
    .string()
    .max(500, "Description must be at most 500 characters")
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
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<JobData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<JobFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      jobName: "",
      description: "",
      openSeats: 1,
      avatar: null,
      previewUrl: null,
      department: "" as "it" | "business" | "design",
      ends_at: "",
    },
  });

  const previewUrl = watch("previewUrl");

  // Fetch job data if editing
  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("No job found");

        setJobData(data);
        setValue("jobName", data.title || "");
        setValue("description", data.description || "");
        setValue("openSeats", data.number_of_seats || 1);
        setValue("department", data.department as "it" | "business" | "design");
        setValue("ends_at", data.ends_at ? data.ends_at.slice(0, 10) : "");
        setValue("avatar", null);
        setValue("previewUrl", data.picture || null);
      } catch (error) {
        console.error("Error fetching job:", error);
        message.error("Failed to fetch job data");
        navigate("/jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: JobFormData) => {
    try {
      setLoading(true);
      let imageUrl = data.previewUrl || null;

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

      if (id) {
        const { error: updateError } = await supabase
          .from("jobs")
          .update({
            title: data.jobName,
            description: data.description,
            number_of_seats: data.openSeats,
            picture: imageUrl,
            department: data.department,
            ends_at: data.ends_at,
          })
          .eq("id", id);

        if (updateError) throw updateError;
        toast.success("✅ Job updated successfully!");
      } else {
        // Insert new job
        const { error: jobError } = await supabase.from("jobs").insert([
          {
            title: data.jobName,
            description: data.description,
            number_of_seats: data.openSeats,
            picture: imageUrl,
            // created_at: new Date().toISOString(),
            department: data.department,
            ends_at: data.ends_at,
          },
        ]);
        if (jobError) throw jobError;
        toast.success("✅ Job created successfully!");
      }

      if (!id) {
        reset();
      }
      navigate("/jobs");
    } catch (error) {
      console.error("Error creating/updating job:", error);
      message.error("Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 mx-auto max-w-full w-full relative">
      {/* Header with Export Button */}
      <div className="flex justify-between items-center mb-8 relative">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? "Edit" : "Create"}
        </h1>
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
              Personal Job info
            </h2>
            <p className="text-sm text-gray-500">
              Update your Job photo and personal job details here.
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
              <p className="text-sm text-red-500">
                {errors.department.message}
              </p>
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
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
