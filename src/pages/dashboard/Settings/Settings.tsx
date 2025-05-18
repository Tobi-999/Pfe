import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CloudUpload } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

// Validation schema
const schema = yup.object().shape({
  company_name: yup.string().required('Company name is required'),
  tagline: yup
    .string()
    .max(1500, 'Tagline must be at most 1500 characters')
    .required('Tagline is required'),
  twitter: yup.string().url('Must be a valid URL').nullable(),
  facebook: yup.string().url('Must be a valid URL').nullable(),
  linkedin: yup.string().url('Must be a valid URL').nullable(),
});

function Settings() {
  // State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Supabase client
  const supabaseUrl = 'https://jgqhkvlhqsxobscfsfkv.supabase.co';
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncWhrdmxocXN4b2JzY2ZzZmt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyOTA1NjQsImV4cCI6MjA1Nzg2NjU2NH0.TX0xSmGL5tArOgwLq24UlBQit3AYNMxyCGb8B7AvRmw";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Form
  const { control, handleSubmit, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      company_name: '',
      tagline: '',
      twitter: '',
      facebook: '',
      linkedin: '',
    },
  });

  const tagline = watch('tagline');
  const maxCharacters = 1500;

  // Fetch user role and profile
  useEffect(() => {
    const fetchRoleAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role, first_name, hiring_date, department, email')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setRole(data.role);
        setProfile(data);
      }
    };
    fetchRoleAndProfile();
  }, []);

  // File handlers
  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile(file);
      setUploadedImgUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      setUploadedImgUrl(URL.createObjectURL(file));
    }
  };

  // Form submit
  const onSubmit = async (data) => {
    if (role !== 'employee') {
      const { company_name, tagline, twitter, facebook, linkedin } = data;
      const { error } = await supabase.from('settings').insert([
        {
          company_name,
          tagline,
          twitter,
          facebook,
          linkedin,
        }
      ]);
      if (!error) {
        toast.success('Save is done! 🎉', { duration: 2000 });
        reset();
      } else {
        toast.error('Error saving data: ' + error.message, { duration: 2000 });
      }
    }
    console.log('Form Data:', data);
  };

  // Render
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative h-screen flex flex-col items-start px-8">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>
      <div className="w-full flex flex-col gap-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-medium mb-1">
              {role === 'employee' ? 'Your profile' : 'Company profile'}
            </p>
            <p className="text-gray-500 text-sm">
              {role === 'employee'
                ? 'Update your data here.'
                : 'Update your company photo and details here.'}
            </p>
          </div>
          <div className="flex gap-4 ml-[50rem]">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">Cancel</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded">Save</button>
          </div>
        </div>
        <hr className="border-gray-300 " />

        {/* Company Name Section (replaces Public Profile Section) */}
        <div className="w-full">
          <p className="text-lg font-medium mb-1">
            {role === 'employee' ? 'Your profile' : 'Company name'}
          </p>
          {role === 'employee' && profile ? (
            <div className="flex flex-col gap-2 ml-[10rem]">
              <div>
                <span className="font-semibold">Name: </span>
                <span>{profile.first_name || '-'}</span>
              </div>
              <div>
                <span className="font-semibold">Hiring Date: </span>
                <span>{profile.hiring_date || '-'}</span>
              </div>
              <div>
                <span className="font-semibold">Department: </span>
                <span>{profile.department || '-'}</span>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <span>{profile.email || '-'}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <p className="text-gray-500 text-sm">This will be displayed on your profile.</p>
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
                      <p className="text-red-500 text-sm ml-[10rem]">{fieldState.error.message}</p>
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
            {role === 'employee' ? 'Bio' : 'Tagline'}
          </p>
          <div className="flex items-start gap-4 self-start">
            <p className="text-gray-500 text-sm">
              {role === 'employee' ? 'Write something about yourself' : 'A quick snapshot of your company.'}
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
                    <p className="text-red-500 text-sm ml-[11rem]">{fieldState.error.message}</p>
                  )}
                </>
              )}
            />
          </div>
          <p className="text-gray-500 text-sm mt-1 ml-[25rem]">
            {maxCharacters - tagline.length} characters left
          </p>
        </div>
        <hr className="border-gray-300 " />

        {/* Logo/Profile Pic Section */}
        <div className="w-full flex items-center gap-8">
          <div>
            <p className="text-lg font-medium mb-1">
              {role === 'employee' ? 'Your pic' : 'Company logo'}
            </p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                {role === 'employee'
                  ? 'Choose your profile pic'
                  : <>Update your company logo and then <br /> choose where you want it to display.</>}
              </p>
              <img
                src={uploadedImgUrl || "path/to/logo.png"}
                alt={role === 'employee' ? 'Profile Pic' : 'Company Logo'}
                className="w-32 h-auto mb-4 ml-[13rem]"
              />
            </div>
          </div>
          <div
            className={`flex items-center border border-gray-300 rounded px-4 py-6 w-1/2 justify-center transition-all duration-700 ease-in-out ${
              uploadedImgUrl
                ? 'bg-gradient-to-r from-green-200 via-green-100 to-green-300 shadow-lg scale-105'
                : 'bg-white'
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
              <p className="text-gray-400 text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
          </div>
        </div>
        <hr className="border-gray-300 " />

        {/* Social Profiles Section */}
        <div className="w-3/4 p-6 rounded-lg shadow-sm">
          <p className="text-lg font-medium mb-4">Social profiles</p>
          <Controller
            name="twitter"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex items-center gap-2 mb-4 border border-gray-300 rounded-lg px-4 py-2 w-2/3 ml-[27rem]">
                <span className="text-gray-500 text-sm w-1/4 text-right">twitter.com/</span>
                <hr className="h-6 border-l border-gray-300 mx-2" />
                <input {...field} type="text" className="w-2/4 border-none focus:ring-0 focus:outline-none" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm ml-4">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="facebook"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex items-center gap-2 mb-4 border border-gray-300 rounded-lg px-4 py-2 w-2/3 ml-[27rem]">
                <span className="text-gray-500 text-sm w-1/4 text-right">facebook.com/</span>
                <hr className="h-6 border-l border-gray-300 mx-2" />
                <input {...field} type="text" className="w-2/4 border-none focus:ring-0 focus:outline-none" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm ml-4">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
          <Controller
            name="linkedin"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 w-2/3 ml-[27rem]">
                <span className="text-gray-500 text-sm w-1/4 text-right">linkedin.com/company/</span>
                <hr className="h-6 border-l border-gray-300 mx-2" />
                <input {...field} type="text" className="w-2/4 border-none focus:ring-0 focus:outline-none" />
                {fieldState.error && (
                  <p className="text-red-500 text-sm ml-4">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <hr className="border-gray-300 " />

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-4 ml-[27rem]">
          <button type="button" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default Settings;