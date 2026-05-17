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

    return (
        <div className="fixed left-6 top-0 flex flex-col items-center w-24 h-screen z-50">
            <div
                className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl flex items-center justify-center p-2 mt-4 cursor-pointer border border-gray-100 dark:border-gray-700"
                onClick={() => navigate('/admin/dashboard')}
            >
                <img src={logo} alt="Logo" className="w-full h-full rounded-full object-cover" />
            </div>

            <div className="flex flex-col justify-center w-[75px] h-[600px] bg-[#f9d9e3] dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-sm dark:shadow-md py-8 gap-6 mt-12 border border-gray-100 dark:border-gray-700">
                <nav className="flex flex-col justify-center gap-8 w-full items-center">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                title={item.label}
                                className={`flex flex-col items-center gap-1 w-[58px] py-2 rounded-2xl transition-all duration-200 relative
                                    ${isActive
                                        ? 'bg-[#FFA669] dark:bg-orange-700 text-white shadow-sm dark:shadow-md'
                                        : 'text-gray-700 dark:text-gray-200 hover:text-white hover:bg-[#f8ba90] dark:hover:bg-orange-800/80'}
                                `}
                            >
                                <item.icon size={26} strokeWidth={2} />
                                <span className="text-[10px] font-semibold leading-none tracking-tight">
                                    {item.label}
                                </span>
                                {isActive && (
                                    <div className="absolute -right-1 top-1 w-2 h-2 bg-[#FFA669] dark:bg-orange-500 rounded-full" />
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