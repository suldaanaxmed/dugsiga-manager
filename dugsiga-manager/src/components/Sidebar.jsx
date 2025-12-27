import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CreditCard, Calendar, BookOpen, FileText, BarChart2, School, LogOut, Settings, MessageSquare, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { settings } = useSettings();

    const allNavItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'teacher', 'student'] },
        { path: '/students', icon: Users, label: 'Students', roles: ['admin'] },
        { path: '/fees', icon: CreditCard, label: 'Fees', roles: ['admin'] },
        { path: '/attendance', icon: Calendar, label: 'Attendance', roles: ['admin', 'teacher'] },
        { path: '/subjects', icon: BookOpen, label: 'Subjects', roles: ['admin'] },
        { path: '/timetable', icon: Clock, label: 'Timetable', roles: ['admin', 'teacher', 'student'] }, // Added student
        { path: '/exams', icon: FileText, label: 'Exams', roles: ['admin', 'teacher', 'student'] }, // Added student
        { path: '/reports', icon: BarChart2, label: 'Reports', roles: ['admin', 'teacher'] },
        { path: '/communication', icon: MessageSquare, label: 'Communication', roles: ['admin'] },
        { path: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
    ];

    const navItems = allNavItems.filter(item => item.roles.includes(user?.role));

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col shadow-sm hidden md:flex">
            <div className="p-6 flex items-center space-x-3 border-b border-gray-100">
                <School className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-gray-800">{settings?.schoolName || 'Dugsiga'}</span>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role || 'Guest'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
