// import React from 'react';
// import { Home, BookOpen, CheckSquare, Target, BarChart2, Users } from 'lucide-react';

// const Sidebar = () => {
//   const navItems = [
//     { icon: Home, active: true },
//     { icon: BookOpen, active: false },
//     { icon: CheckSquare, active: false },
//     { icon: Target, active: false },
//     { icon: BarChart2, active: false },
//     { icon: Users, active: false },
//   ];

//   return (
//     <div className="flex flex-col items-center py-8 w-20 bg-white/80 backdrop-blur-sm rounded-full shadow-sm h-fit min-h-[600px]">
//       {/* Logo Placeholder */}
//       <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-12 text-[10px] font-bold text-gray-400 tracking-widest">
//         LOGO
//       </div>

//       {/* Navigation */}
//       <nav className="flex flex-col gap-8 w-full items-center">
//         {navItems.map((Item, index) => (
//           <button
//             key={index}
//             className={`p-3 rounded-full transition-all duration-200 group relative ${
//               Item.active 
//                 ? 'bg-purple-100 text-purple-600 shadow-sm' 
//                 : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Item.icon size={22} strokeWidth={2} />
//             {Item.active && (
//               <div className="absolute -right-1 top-1 w-2 h-2 bg-purple-500 rounded-full" />
//             )}
//           </button>
//         ))}
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
// import React from 'react';
// import { Home, BookOpen, CheckSquare, Target, BarChart2, Users } from 'lucide-react';
// import logo from '../assets/images/logo.png'; // Import your logo here

// const Sidebar = () => {
//   const navItems = [
//     { icon: Home, active: true },
//     { icon: BookOpen, active: false },
//     { icon: CheckSquare, active: false },
//     { icon: Target, active: false },
//     { icon: BarChart2, active: false },
//     { icon: Users, active: false },
//   ];

//   return (
//     <div className="flex flex-col items-center min-h-screen py-8">
//       {/* Logo - Separate from cylinder */}
//       <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center p-2">
//         <img 
//           src={logo} 
//           alt="Logo" 
//           className="w-full h-full rounded-full object-cover"
//         />
//       </div>

//       {/* Spacer to push cylinder down */}
//       <div className="flex-1"></div>

//       {/* Navigation Cylinder - Centered */}
//       <div className="flex flex-col items-center py-8 w-20 bg-white/80 backdrop-blur-sm rounded-full shadow-sm h-fit min-h-[500px]">
//         <nav className="flex-1 flex flex-col justify-center gap-6 w-full items-center">
//           {navItems.map((Item, index) => (
//             <button
//               key={index}
//               className={`p-3 rounded-full transition-all duration-200 group relative ${
//                 Item.active 
//                   ? 'bg-purple-100 text-purple-600 shadow-sm' 
//                   : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
//               }`}
//             >
//               <Item.icon size={22} strokeWidth={2} />
//               {Item.active && (
//                 <div className="absolute -right-1 top-1 w-2 h-2 bg-purple-500 rounded-full" />
//               )}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Spacer to balance bottom */}
//       <div className="flex-1"></div>
//     </div>
//   );
// };

// export default Sidebar;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Target, BarChart2, Users } from 'lucide-react';
import logo from '../assets/images/logo.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/dashboard', label: 'Dashboard' },
    { icon: BookOpen, path: '/journal', label: 'Journal' },
    { icon: CheckSquare, path: '/tasks', label: 'Habits' },
    { icon: Target, path: '/goals', label: 'Goals' },
    { icon: BarChart2, path: '/analytics', label: 'Analytics' },
    { icon: Users, path: '/community', label: 'Community' },
  ];

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  return (
    <div className="fixed left-6 top-0 flex flex-col items-center w-24 h-screen z-50">
      {/* Logo at the top */}
      <div 
        className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center p-2 mt-4 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img 
          src={logo} 
          alt="Logo" 
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Navigation container that grows and centers its content */}
      <div className="flex flex-col justify-center w-[75px] h-[600px] bg-[#f9d9e3] backdrop-blur-sm rounded-full shadow-sm py-8 gap-6 mt-12">
        <nav className="flex flex-col justify-center gap-8 w-full items-center">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`p-3 rounded-full transition-all duration-200 group relative ${
                  isActive 
                    ? 'bg-[#FFA669] text-white-800 shadow-sm' 
                      : 'text-grey hover:text-[white] hover:bg-[#f8ba90]'
                }`}
                title={item.label}
              >
                <item.icon size={25} strokeWidth={2} />
                {isActive && (
                  <div className="absolute -right-1 top-1 w-2 h-2 bg-[#FFA669] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// export default Sidebar;


export default Sidebar;
