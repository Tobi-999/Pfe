import { useState, useCallback, ChangeEvent } from "react";
import { UploadCloud, DownloadCloud, Search } from "lucide-react";

export default function CreateJobForm() {
  const [formData, setFormData] = useState({
    jobName: "UI/UX design",
    description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum. Lorem Ipsum Lorem Ipsum Lorem Ipsum.",
    openSeats: 23,
    avatar: null,
    isEditing: false
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const maxDescriptionLength = 275;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, avatar: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleEdit = () => {
    setFormData(prev => ({ ...prev, isEditing: !prev.isEditing }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData(prev => ({ ...prev, isEditing: false }));
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
            <h2 className="text-xl font-semibold text-gray-800">Personal info</h2>
            <p className="text-sm text-gray-500">
              Update your photo and personal details here.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2 text-sm text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-md">
              Cancel
            </button>
            <button className="px-6 py-2 text-sm text-white bg-purple-600 hover:bg-purple-700 rounded-md">
              Save
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Name Section */}
          <div className="flex items-center gap-9">
            <h2>job Name</h2>
            <input
              name="jobName"
              type="text"
              value={formData.jobName}
              onChange={handleInputChange}
              className="flex-1 text-base font-medium text-gray-900 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description Section */}
          <div className="flex items-center gap-6">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write a short description..."
              className="flex-1 text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="flex items-center gap-6">
            <label className="text-sm font-medium text-gray-700">Choose Job Picture</label>
            <div className="flex-1 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-600 shadow-inner shrink-0 overflow-hidden">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
                <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                <span className="text-sm text-purple-600 font-medium">Click to upload</span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  or drag and drop<br />SVG, PNG, JPG or GIF (max. 800×400px)
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Open Seats Section */}
          <div className="flex items-center gap-6">
            <label className="text-sm font-medium text-gray-700">Number of Open Seats</label>
            <input
              name="openSeats"
              type="number"
              value={formData.openSeats}
              onChange={handleInputChange}
              className="flex-1 text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-8">
            <button
              type="button"
              onClick={toggleEdit}
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
