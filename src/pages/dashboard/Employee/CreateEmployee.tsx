import React, { useState } from "react";
import countries from "world-countries"; // Ensure this package is installed or use a similar dataset
import Flag from "react-world-flags"; // Ensure react-world-flags is installed
import * as Yup from "yup"; // Ensure Yup is imported
import * as XLSX from "xlsx"; // Import xlsx for Excel export
import { toast } from "sonner"; // Import Sonner for notifications
import { Clock, Mail } from "lucide-react"; // Import the Clock and Mail icons from lucide-react
import { createClient } from "@supabase/supabase-js"; // Import Supabase client
import { useParams } from "react-router-dom";
import { useAuthContext } from "../../../context";

const generateValidationSchema = (fields: typeof formData) => {
  const schema: Record<string, Yup.AnySchema> = {};

  Object.keys(fields).forEach((key) => {
    if (typeof fields[key] === "string") {
      schema[key] = Yup.string()
        .required(`${key} is required`)
        .matches(/^[A-Z]/, `${key} must start with a capital letter`);
    } else if (fields[key] === null) {
      schema[key] = Yup.mixed().nullable();
    }
  });

  return Yup.object().shape(schema);
};

// Initialize Supabase client
const supabase = createClient(
  "https://jgqhkvlhqsxobscfsfkv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw"
);

export default function CreateEmployee() {
  const { id: jobId } = useParams(); // Get job ID from URL
  const { user } = useAuthContext(); // Get user from auth context

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    country: "",
    timezone: "",
    bio: "",
    resume: null as File | null,
    motivationalLetter: null as File | null,
    countryFlag: "", // Field to store the selected country's flag code
    image: null as File | null, // Field to store the selected image file
  });

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = generateValidationSchema(formData); // Generate schema dynamically

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      country: "",
      timezone: "",
      bio: "",
      resume: null,
      motivationalLetter: null,
      countryFlag: "",
      image: null,
    });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      await validationSchema.validate(formData, { abortEarly: false });
      setErrors({});

      // Prepare employee data
      const employeeData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        role: formData.role,
        country: formData.country,
        timezone: formData.timezone,
        bio: formData.bio,
        resume: formData.resume ? formData.resume.name : null, // Replace with actual file URL if uploaded
        motivational_letter: formData.motivationalLetter
          ? formData.motivationalLetter.name
          : null, // Replace with actual file URL if uploaded
        country_flag: formData.countryFlag,
        image: formData.image ? formData.image.name : null, // Replace with actual file URL if uploaded
        job_id: jobId, // Add job ID from URL
        profile_id: user?.id, // Add employee ID from auth context
      };

      // Insert data into the employees table
      const { data, error } = await supabase
        .from("employees")
        .insert([employeeData]);

      if (error) {
        throw error;
      }

      console.log("Employee created:", data);
      toast.success("Employee created successfully!");
      resetForm(); // Reset the form after successful submission
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errorMessages[err.path] = err.message;
          }
        });
        setErrors(errorMessages);
      } else {
        toast.error("Failed to create employee. Please try again.");
        console.error("Error creating employee:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = () => {
    const dataToExport = [formData]; // Convert form data to an array for export
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Data");
    XLSX.writeFile(workbook, "EmployeeData.xlsx"); // Save as Excel file
  };

  return (
    <div className="pt-4 px-8 bg-white-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create</h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg shadow-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300"
          >
            Export
          </button>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg space-y-6"
      >
        <div>
          <h2 className="text-lg font-semibold mb-2">Personal info</h2>
          <p className="text-sm text-gray-500 mb-4">
            Update your photo and personal details here.
          </p>
          <hr className="border-gray-300 mb-4" />
          <div className="flex items-center gap-6">
            <label className="text-sm font-medium w-1/5 text-left">Name</label>
            <div className="flex gap-4" style={{ width: "655px" }}>
              {" "}
              {/* Updated layout */}
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-1/2 border rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:border-transparent focus:shadow-lg"
                placeholder="Enter your first name"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-1/2 border rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:border-transparent focus:shadow-lg"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>
          )}
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>
          )}
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">
            Email Address
          </label>
          <div style={{ width: "655px" }} className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 pl-10 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:border-transparent focus:shadow-lg"
              placeholder="Enter your email"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">
            Upload Image
          </label>
          <div className="w-1/2">
            {" "}
            {/* Increased width */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-600 shadow-inner shrink-0 overflow-hidden">
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-100 transition-all duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 16l4-4m0 0l4 4m-4-4v12M21 12h-6m0 0l-4-4m4 4l4 4"
                  />
                </svg>
                <span className="text-sm text-blue-600 font-medium">
                  Click to upload
                </span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  or drag and drop
                  <br />
                  SVG, PNG, JPG or GIF (max. 800×400px)
                </span>
                <input
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">Role</label>
          <div style={{ width: "655px" }}>
            {" "}
            {/* Updated width */}
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:border-transparent focus:shadow-lg"
              placeholder="Enter your role"
              required
            />
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">Country</label>
          <div className="w-1/4 relative">
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="w-full border rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center"
            >
              {formData.countryFlag && (
                <Flag
                  code={formData.countryFlag}
                  style={{ width: "20px", marginRight: "8px" }}
                />
              )}
              {formData.country || "Select a country"}
            </button>
            {isCountryDropdownOpen && (
              <div className="absolute inset-x-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-10">
                {countries.map((country) => (
                  <div
                    key={country.cca2}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        country: country.name.common,
                        countryFlag: country.cca2,
                      });
                      setIsCountryDropdownOpen(false);
                    }}
                  >
                    <Flag
                      code={country.cca2}
                      style={{ width: "20px", marginRight: "8px" }}
                    />
                    <span>{country.name.common}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">
            Timezone
          </label>
          <div style={{ width: "655px" }} className="relative">
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 pl-10 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:border-transparent focus:shadow-lg"
              required
            >
              <option value="" disabled>
                Select your timezone
              </option>
              <option value="UTC-12:00">UTC-12:00</option>
              <option value="UTC-11:00">UTC-11:00</option>
              <option value="UTC-10:00">UTC-10:00</option>
              <option value="UTC-09:00">UTC-09:00</option>
              <option value="UTC-08:00">UTC-08:00</option>
              <option value="UTC-07:00">UTC-07:00</option>
              <option value="UTC-06:00">UTC-06:00</option>
              <option value="UTC-05:00">UTC-05:00</option>
              <option value="UTC-04:00">UTC-04:00</option>
              <option value="UTC-03:00">UTC-03:00</option>
              <option value="UTC-02:00">UTC-02:00</option>
              <option value="UTC-01:00">UTC-01:00</option>
              <option value="UTC+00:00">UTC+00:00</option>
              <option value="UTC+01:00">UTC+01:00</option>
              <option value="UTC+02:00">UTC+02:00</option>
              <option value="UTC+03:00">UTC+03:00</option>
              <option value="UTC+04:00">UTC+04:00</option>
              <option value="UTC+05:00">UTC+05:00</option>
              <option value="UTC+06:00">UTC+06:00</option>
              <option value="UTC+07:00">UTC+07:00</option>
              <option value="UTC+08:00">UTC+08:00</option>
              <option value="UTC+09:00">UTC+09:00</option>
              <option value="UTC+10:00">UTC+10:00</option>
              <option value="UTC+11:00">UTC+11:00</option>
              <option value="UTC+12:00">UTC+12:00</option>
            </select>
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            {errors.timezone && (
              <p className="text-red-500 text-sm">{errors.timezone}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">Bio</label>
          <div style={{ width: "655px" }}>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={(e) => {
                if (e.target.value.length <= 1000) {
                  handleChange(e);
                }
              }}
              className="w-full border rounded-lg px-4 py-2 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 hover:border-blue-500 transition-all duration-300 focus:outline-none focus:border-transparent focus:shadow-lg"
              rows={4}
              placeholder="Write a short introduction..."
            />
            <p
              className={`text-sm mt-1 ${
                formData.bio.length >= 1000 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {1000 - formData.bio.length} characters left
            </p>
            {formData.bio.length >= 1000 && (
              <p className="text-red-500 text-sm mt-1">
                You have reached the maximum character limit.
              </p>
            )}
            {errors.bio && <p className="text-red-500 text-sm">{errors.bio}</p>}
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">
            Upload Resume
          </label>
          <div style={{ width: "655px" }}>
            <div
              className={`border-dashed border-2 rounded-lg p-4 text-center ${
                formData.resume
                  ? "bg-green-100 border-green-500"
                  : "border-gray-300"
              }`}
            >
              <input
                type="file"
                name="resume"
                onChange={handleFileChange}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer text-blue-500"
              >
                Click to upload or drag and drop
              </label>
              <p className="text-sm text-gray-500">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 mt-6">
          <label className="text-sm font-medium w-1/5 text-left">
            Motivational Letter
          </label>
          <div style={{ width: "655px" }}>
            <div
              className={`border-dashed border-2 rounded-lg p-4 text-center ${
                formData.motivationalLetter
                  ? "bg-green-100 border-green-500"
                  : "border-gray-300"
              }`}
            >
              <input
                type="file"
                name="motivationalLetter"
                onChange={handleFileChange}
                className="hidden"
                id="motivational-letter-upload"
              />
              <label
                htmlFor="motivational-letter-upload"
                className="cursor-pointer text-blue-500"
              >
                Click to upload or drag and drop
              </label>
              <p className="text-sm text-gray-500">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={resetForm} // Call resetForm to clear all inputs
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`py-2 px-4 rounded-lg text-white shadow-lg ${
              isSubmitting
                ? "bg-gradient-to-r from-purple-400 to-blue-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            }`}
            disabled={isSubmitting}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
