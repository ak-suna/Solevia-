// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Welcome = () => {
//   const navigate = useNavigate();

//   return (
//     <div style={styles.container}>
//       <h1>Welcome to Growth Companion</h1>
//       <p>Your personal growth journey starts here!</p>
//       <div>
//         <button style={styles.button} onClick={() => navigate("/login")}>
//           Login
//         </button>
//         <button style={styles.button} onClick={() => navigate("/signup")}>
//           Signup
//         </button>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     height: "100vh",
//     backgroundColor: "#f0f4f8",
//     textAlign: "center",
//   },
//   button: {
//     margin: "10px",
//     padding: "12px 24px",
//     backgroundColor: "#4f46e5",
//     color: "white",
//     border: "none",
//     borderRadius: "8px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
// };

// export default Welcome;
// src/pages/Welcome.js
// import React from 'react';

// const Welcome = () => {
//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background Image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: 'url(/public/images/welcome.png")',
//           zIndex: -1
//         }}
//       />
      
//       {/* Overlay for better text readability (optional) */}
//       <div className="absolute inset-0 bg-black bg-opacity-20" style={{ zIndex: -1 }} />
      
//       {/* Content */}
//       <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
//         <div className="text-center max-w-2xl">
//           <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
//             HEY THERE,
//           </h1>
//           <h2 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-8">
//             BRIGHT SOUL
//           </h2>
//           <p className="text-xl md:text-2xl text-white mb-12">
//             Every small step counts. Let's start yours today
//           </p>
//           <button 
//             onClick={() => window.location.href = '/signup'}
//             className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold text-xl px-12 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
//           >
//             JOIN US
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Welcome;
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Welcome = () => {
//   const navigate = useNavigate();

//   const handleJoinClick = () => {
//     navigate("/signup"); // change route as needed
//   };

//   return (
//     <div
//       className="flex items-center justify-center h-screen bg-cover bg-center"
//       style={{ backgroundImage: "url('/images/welcome.png')" }}
//     >
//       <div className="text-center px-6 md:px-12">
//         <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
//           HEY THERE,{" "}
//           <span className="text-yellow-400">BRIGHT SOUL</span>
//         </h1>
//         <p className="text-white mt-4 text-base md:text-lg">
//           Every small step counts. Let’s start yours today
//         </p>

//         <button
//           onClick={handleJoinClick}
//           className="mt-6 bg-yellow-400 text-white font-bold py-3 px-8 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
//         >
//           JOIN US
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Welcome;
// import React from 'react';
// import './welcome.css';

// const Welcome = () => {
//   return (
//     <div className="welcome-container">
//       <div className="welcome-left">
//         <img src="/images/welcome.png" alt="Welcome" className="welcome-image" />
//       </div>
//       <div className="welcome-right">
//         <h1>HEY THERE, <span className="highlight"><br></br>BRIGHT SOUL</span></h1>
//         <p>Every small step counts. Let's start yours today</p>
//         <button className="join-btn">JOIN US</button>
//       </div>
//     </div>
//   );
// };

// export default Welcome;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

const Welcome = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/signup');
  };

  return (
    <div className="welcome-container">
      <div className="welcome-left">
        <img src="/images/welcome.png" alt="Welcome" className="welcome-image" />
      </div>
      <div className="welcome-right">
        <h1>HEY THERE, <span className="highlight"><br></br>BRIGHT SOUL</span></h1>
        <p>Every small step counts. Let's start yours today</p>
        <button className="join-btn" onClick={handleJoinClick}>JOIN US</button>
        <p style={{ marginTop: '20px' }}>
          Already have an account? <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
