import { Mail, Globe, FileText, FolderOpen, MoreHorizontal, ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DesignerProfile() {
  const navigate = useNavigate();
  const countryCode = "au";
  const countryName = "Melbourne, Australia";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 text-sm">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/registrations')} // Navigate to the registrations page
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center gap-4">
          <img
            src="https://i.pravatar.cc/300?img=56"
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-black">Irma Hane</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" /> Farouk@gmail.com
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-auto">
          <button 
            onClick={() => navigate('/portfolio')} // Navigate to the portfolio page
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-white" />
            View portfolio
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-lg">Experience</h2>
        <p className="text-gray-600 mt-1">
          I specialise in UX/UI design, brand strategy, and Webflow development.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="font-semibold text-lg mb-2 text-indigo-600">About me</h2>
          <p className="text-gray-700">
            I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development. 
            I'm always striving to grow and learn something new and I don't take myself too seriously.
          </p>
          <p className="text-gray-700 mt-2">
            I'm passionate about helping startups grow, improve their customer experience, and to raise venture capital through good design.
          </p>
          <button className="text-purple-600 mt-2 hover:underline">Read more</button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Location</p>
            <div className="flex items-center gap-2 mt-1">
              <img
                src={`https://flagcdn.com/w40/${countryCode}.png`}
                width={20}
                height={14}
                alt={`${countryName} flag`}
                className="rounded-sm"
              />
              <p className="text-gray-700">{countryName}</p>
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Website</p>
            <a
              href="https://oliviarhye.com"
              target="_blank"
              className="text-purple-600 font-medium flex items-center gap-1"
            >
              oliviarhye.com <span className="text-xs">↗</span>
            </a>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Portfolio</p>
            <a
              href="https://oliviarhye.com"
              target="_blank"
              className="text-purple-600 font-medium flex items-center gap-1"
            >
              @oliviarhye <span className="text-xs">↗</span>
            </a>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <a
              href="mailto:hello@oliviarhye.com"
              className="text-purple-600 font-medium flex items-center gap-1"
            >
              hello@oliviarhye.com <span className="text-xs">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="hover:bg-gray-100 transition-colors duration-300 p-4 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Motivational letter</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <FileText className="text-purple-600 w-6 h-6" />
            <div>
              <p className="font-medium">Tech design requirements.pdf</p>
              <p className="text-gray-500 text-sm">200 KB – 100% uploaded</p>
            </div>
          </div>
        </div>
        <div className="hover:bg-gray-100 transition-colors duration-300 p-4 rounded-xl">
          <h2 className="font-semibold text-lg mb-4">Resume</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-300">
            <FileText className="text-purple-600 w-6 h-6" />
            <div>
              <p className="font-medium">Tech design requirements.pdf</p>
              <p className="text-gray-500 text-sm">200 KB – 100% uploaded</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[{
          title: "Lead Product Designer",
          company: "Layers",
          date: "May 2020 – Present",
        }, {
          title: "Product Designer",
          company: "Sisyphus",
          date: "Jan 2018 – May 2020",
        }, {
          title: "UX Designer",
          company: "Catalog",
          date: "Mar 2017 – Jan 2018",
        }].map((job, i) => (
          <div 
            key={i} 
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300 flex flex-col"
          >
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
              <p className="text-gray-500 text-sm">{job.company}</p>
              <p className="text-gray-500 text-sm mt-2">{job.date}</p>
            </div>
            <hr className="my-4 border-gray-200" />
            <button className="bg-white text-purple-600 text-sm font-medium hover:bg-purple-100 hover:text-purple-800 transition-colors duration-300 mt-auto self-end">
              View project
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
