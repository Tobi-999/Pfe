import React from "react";
import { Link } from "react-router-dom";

// Floating particles component
const FloatingParticles: React.FC<{ count?: number }> = ({ count = 18 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <span
        key={i}
        style={{
          position: "absolute",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${8 + Math.random() * 12}px`,
          height: `${8 + Math.random() * 12}px`,
          background: "rgba(255,255,255,0.25)",
          borderRadius: "50%",
          filter: "blur(1.5px)",
          animation: `particleFloat ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    ))}
  </>
);

const NotFound: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      }}
    >
      {/* Background floating particles */}
      <FloatingParticles />

      {/* Main card */}
      <div
        className="text-center rounded-3xl p-12 shadow-2xl relative z-10 border-4 border-transparent"
        style={{
          background: "rgba(255,255,255,0.25)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          borderImage: "linear-gradient(120deg, #a18cd1 0%, #fbc2eb 100%) 1",
          animation: "glowBorder 2.5s linear infinite",
        }}
      >
        {/* 404 Title */}
        <h1
          className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 drop-shadow-lg mb-2"
          style={{
            textShadow: "0 4px 32px rgba(156,39,176,0.4)",
            animation: "float 2.5s ease-in-out infinite",
          }}
        >
          404
        </h1>
        {/* Subtitle */}
        <h2 className="text-3xl font-semibold mt-4 mb-6 text-gray-800 drop-shadow">
          Page Not Found
        </h2>
        {/* Description */}
        <p className="text-lg text-gray-700 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        {/* Go Back Button */}
        <Link
          to="/login"
          className="px-8 py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-400 text-white font-bold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 shimmer"
          style={{
            position: "relative",
            overflow: "hidden",
            display: "inline-block",
          }}
        >
          <span className="relative z-10">Go Back Home</span>
          <span
            className="shimmer-effect"
            style={{
              position: "absolute",
              top: 0,
              left: "-75%",
              width: "50%",
              height: "100%",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.2) 100%)",
              transform: "skewX(-20deg)",
              animation: "shimmer 2s infinite",
              zIndex: 1,
            }}
          />
        </Link>
      </div>
      {/* Styles */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px);}
            50% { transform: translateY(-20px);}
            100% { transform: translateY(0px);}
          }
          @keyframes glowBorder {
            0% { box-shadow: 0 0 24px 0 #a18cd1, 0 8px 32px 0 rgba(31,38,135,0.37);}
            50% { box-shadow: 0 0 48px 8px #fbc2eb, 0 8px 32px 0 rgba(31,38,135,0.37);}
            100% { box-shadow: 0 0 24px 0 #a18cd1, 0 8px 32px 0 rgba(31,38,135,0.37);}
          }
          @keyframes shimmer {
            0% { left: -75%; }
            100% { left: 125%; }
          }
          @keyframes particleFloat {
            0% { transform: translateY(0px) scale(1);}
            100% { transform: translateY(-40px) scale(1.2);}
          }
          @keyframes giftBounce {
            0%, 100% { transform: translateY(0);}
            50% { transform: translateY(-12px);}
          }
          .animate-gift-bounce {
            animation: giftBounce 1.6s cubic-bezier(.68,-0.55,.27,1.55) infinite;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
