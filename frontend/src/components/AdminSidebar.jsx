import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, Trophy, UserPlus } from 'lucide-react';
import logo from '../assets/images/logo.png';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, path: '/admin/dashboard', label: 'Dashboard' },
        { icon: Users, path: '/admin/users', label: 'Users' },
        { icon: AlertTriangle, path: '/admin/reports', label: 'Reports' },
        { icon: Trophy, path: '/admin/challenges', label: 'Challenges' },
        { icon: UserPlus, path: '/admin/groups', label: 'Groups' },
    ];

    const handleLogoClick = () => {
        navigate('/admin/dashboard');
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

            {/* Navigation container */}
            <div className="flex flex-col justify-center w-[75px] h-[600px] bg-[#f9d9e3] backdrop-blur-sm rounded-full shadow-sm py-8 gap-6 mt-12">
                <nav className="flex flex-col justify-center gap-8 w-full items-center">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`p-3 rounded-full transition-all duration-200 group relative ${isActive
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

export default AdminSidebar;