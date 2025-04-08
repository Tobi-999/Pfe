import React, { useState } from 'react';
import { CloudUpload } from 'lucide-react';

function Settings() {
  const [tagline, setTagline] = useState("Softy Education is the project, startup, or freelance designer.");
  const [uploadedFile, setUploadedFile] = useState(null);
  const maxCharacters = 1500;

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="relative h-screen flex flex-col items-start px-8">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <div className="w-full flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium mb-1">Company profile</p>
            <p className="text-gray-500 text-sm">Update your company photo and details here.</p>
          </div>
          <div className="flex gap-4 ml-[50rem]">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
        <hr className="border-gray-300 " />
        <div className="w-full">
          <p className="text-lg font-medium mb-1">Public profile</p>
          <div className="flex items-center gap-4">
            <p className="text-gray-500 text-sm">This will be displayed on your profile.</p>
            <input
              type="text"
              className="w-1/2 border border-gray-300 px-2 py-1 rounded ml-[10rem]"
              defaultValue="Softy Education"
            />
          </div>
        </div>
        <hr className="border-gray-300 " />
        <div className="w-full">
          <p className="text-lg font-medium mb-1">Tagline</p>
          <div className="flex items-start gap-4 self-start">
            <p className="text-gray-500 text-sm">A quick snapshot of your company.</p>
            <textarea
              className="w-1/2 border border-gray-300 px-4 py-2 rounded ml-[11rem] h-39"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>
          <p className="text-gray-500 text-sm mt-1 ml-[25rem]">
            {maxCharacters - tagline.length} characters left
          </p>
        </div>
        <hr className="border-gray-300 " />
        <div className="w-full flex items-center gap-8">
          <div>
            <p className="text-lg font-medium mb-1">Company logo</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">Update your company logo and then <br /> choose where you want it to display.</p>
              <img src="path/to/logo.png" alt="Company Logo" className="w-32 h-auto mb-4 ml-[13rem]" />
            </div>
          </div>
          <div
            className="flex items-center border border-gray-300 rounded px-4 py-6 w-1/2 justify-center"
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
              <p className="text-gray-400 text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>
        <hr className="border-gray-300 " />
        <div className="w-full flex justify-between items-start">
          <div>
            <p className="text-lg font-medium mb-1">Branding</p>
            <p className="text-gray-500 text-sm">Add your logo to reports and emails.</p>
            <p className="text-purple-600 text-sm cursor-pointer">View examples</p>
          </div>
          <div className="flex flex-col gap-4 mr-[36rem]">
            <label className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="appearance-none h-5 w-5 border-2 border-purple-600 rounded-md checked:bg-purple-500 checked:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <span className="text-gray-500 text-sm font-bold">Reports</span>
              </div>
              <span className="text-gray-400 text-xs ml-6">Include my logo in summary reports.</span>
            </label>
            <label className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="appearance-none h-5 w-5 border-2 border-purple-600 rounded-md checked:bg-purple-500 checked:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <span className="text-gray-500 text-sm font-bold">Emails</span>
              </div>
              <span className="text-gray-400 text-xs ml-6">Include my logo in customer emails.</span>
            </label>
          </div>
        </div>
        <hr className="border-gray-300 " />
        <div className="w-3/4 p-6 rounded-lg shadow-sm">
          <p className="text-lg font-medium mb-4">Social profiles</p>
          <div className="flex items-center gap-2 mb-4 border border-gray-300 rounded-lg px-4 py-2 w-2/3 ml-[27rem]">
            <span className="text-gray-500 text-sm w-1/4 text-right">twitter.com/</span>
            <hr className="h-6 border-l border-gray-300 mx-2" />
            <input
              type="text"
              className="w-2/4 border-none focus:ring-0 focus:outline-none"
              defaultValue="Softy Education"
            />
          </div>
          <div className="flex items-center gap-2 mb-4 border border-gray-300 rounded-lg px-4 py-2 w-2/3 ml-[27rem]">
            <span className="text-gray-500 text-sm w-1/4 text-right">facebook.com/</span>
            <hr className="h-6 border-l border-gray-300 mx-2" />
            <input
              type="text"
              className="w-2/4 border-none focus:ring-0 focus:outline-none"
              defaultValue="Softy Education"
            />
          </div>
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-2/3 ml-[27rem]">
            <span className="text-gray-500 text-sm w-1/4 text-right">linkedin.com/company/</span>
            <hr className="h-6 border-l border-gray-300 mx-2" />
            <input
              type="text"
              className="w-2/4 border-none focus:ring-0 focus:outline-none"
              defaultValue="Softy Education"
            />
          </div>
       
        </div>
        <hr className="border-gray-300 " />
        <div className="flex justify-end gap-4 mt-4 ml-[27rem]">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
          </div>
          <br />
          <br />
          <br />
          <br />
        
         
      </div>
    </div>
  );
}

export default Settings;