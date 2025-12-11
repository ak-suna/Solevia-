// import React from "react";
// import { Link } from "react-router-dom";
// import "./CSS/Welcome.css";
// import landingBG from "../assets/images/welcomePage.png";  // correct path

// const Welcome = () => {
//   return (
//     <div
//       className="welcome-container"
//       style={{ backgroundImage: `url(${landingBG})` }}
//     >
//       <div className="welcome-content">
//         <h1 className="welcome-title">
//           Welcome To <span className="accent">Solevia</span>
//         </h1>

//         <p className="welcome-text1">
//           Your journey to better wellbeing starts today.🍀
//         </p>

//         <p className="welcome-text2">
//           Track your habits, boost your mindset, and take small daily steps toward a happier, healthier life.
//         </p>

//         <div className="btn-group">
//           <Link to="/signup" className="btn-primary">Sign Up</Link>
//           <Link to="/login" className="btn-outline">Log In</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Welcome;
import React from "react";
import { Link } from "react-router-dom";
import landingBG from "../assets/images/gbb.png";
// import logoImage from "../assets/images/logo.png"; // Add your logo path

const Welcome = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-centre  bg-no-repeat flex items-center justify-center relative"
      style={{ backgroundImage: `url(${landingBG})` }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Logo Animation */}
        {/* Logo Text Animation */}
<div className="mb-12 flex justify-center animate-slide-from-right">
  <h1 
className="text-[90px] md:text-[150px] lg:text-[200px] text-white drop-shadow-2xl leading-none text-logo-glow"
    style={{ fontFamily: "Brasika" }}
  >
    Solevia
  </h1>
</div>


        {/* Title Animation */}
        {/* <h1 className="text-4xl md:text-6xl font-light text-white mb-4 animate-fade-in-up animation-delay-200">
          Welcome To <span className="font-medium text-purple-300">Solevia</span>
        </h1> */}

        {/* Subtitle Animation */}
        <p className="text-xl md:text-2xl text-white/90 mb-4 font-light animate-fade-in-up animation-delay-400"
        style={{ fontFamily: "Brasika" }}
        >
          Your journey to better wellbeing starts today.🍀
        </p>

        {/* Description Animation */}
<p className="text-xl md:text-2xl text-white/80 mb-10 font-light leading-relaxed max-w-2xl mx-auto animate-fade-in-up animation-delay-600">
          Track your habits, boost your mindset, and take small daily steps toward a happier, healthier life.
        </p>

        {/* Buttons Animation */}
        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center animate-fade-in-up animation-delay-800">
          <Link 
            to="/signup" 
    className="px-10 py-4 text-xl bg-[#f096b3] text-white rounded-full font-semibold hover:bg-[#f8ba90] transition-all duration-300 hover:scale-105 shadow-xl min-w-[200px]"
          >
            Sign Up
          </Link>
          <Link 
            to="/login" 
    className="px-10 py-4 text-xl bg-transparent text-white border-2 border-[#f096b3] rounded-full font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg min-w-[200px]"
          >
            Log In
          </Link>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slideFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-from-right {
          animation: slideFromRight 1s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </div>
  );
};

export default Welcome;