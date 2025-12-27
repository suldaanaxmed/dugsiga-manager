import React, { useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { useFees } from '../context/FeeContext';
import { useAttendance } from '../context/AttendanceContext';
import {
    Users, DollarSign, Calendar, TrendingUp,
    ArrowRight, Activity, Wallet, UserPlus, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { students } = useStudents();
    const { feeRecords } = useFees();
    const { getStatsForDate } = useAttendance();

    // -- Derived Data --

    // 1. Total Students
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'Active').length;

    // 2. Financials (Current Month)
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

    const financialStats = useMemo(() => {
        const records = feeRecords.filter(r => r.month === currentMonth);
        const collected = records.reduce((sum, r) => sum + r.amountPaid, 0);
        const expected = records.reduce((sum, r) => sum + r.amountDue, 0) || (totalStudents * 15); // Fallback estimate

        return { collected, expected, progress: expected ? (collected / expected) * 100 : 0 };
    }, [feeRecords, currentMonth, totalStudents]);

    // 3. Attendance (Today)
    const todayStr = new Date().toISOString().slice(0, 10);
    const attendanceStats = getStatsForDate(todayStr);
    const attendanceRate = totalStudents ? Math.round((attendanceStats.present / totalStudents) * 100) : 0;

    // 4. Recent Activity (Flattening payments)
    const recentActivity = useMemo(() => {
        const allPayments = feeRecords.flatMap(r =>
            r.payments.map(p => ({
                type: 'payment',
                date: p.date,
                amount: p.amount,
                studentId: r.studentId,
                details: `Paid $${p.amount}`
            }))
        );

        const newStudents = students.map(s => ({
            type: 'enrollment',
            date: s.enrollmentDate,
            studentId: s.id,
            details: `Enrolled ${s.fullName}`
        }));

        // Combine and sort by date descending
        return [...allPayments, ...newStudents]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5) // Top 5
            .map(item => {
                const student = students.find(s => s.id === item.studentId);
                return { ...item, studentName: student ? student.fullName : 'Unknown Student' };
            });
    }, [feeRecords, students]);


    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Welcome back! Here's what's happening today, <span className="font-medium text-gray-900">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link to="/attendance" className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
                        Mark Attendance
                    </Link>
                    <Link to="/fees" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-500/30">
                        Record Payment
                    </Link>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: Students */}
                <div className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col justify-between h-40 relative overflow-hidden group hover:bg-white/50 transition-all duration-300">
                    <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users className="w-24 h-24 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Students</p>
                        <h3 className="text-4xl font-bold text-gray-900 mt-2">{totalStudents}</h3>
                    </div>
                    <div className="flex items-center text-sm text-green-700 bg-green-100/50 px-2 py-1 rounded-full w-fit backdrop-blur-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span className="font-medium">{activeStudents} Active</span>
                    </div>
                </div>

                {/* Card 2: Revenue */}
                <div className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col justify-between h-40 hover:bg-white/50 transition-all duration-300">
                    <div>
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Revenue ({new Date().toLocaleString('default', { month: 'short' })})</p>
                            <div className="bg-blue-100/50 p-2 rounded-lg text-primary backdrop-blur-sm">
                                <DollarSign className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">${financialStats.collected.toFixed(2)}</h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-500">
                            <span>{financialStats.progress.toFixed(0)}% of goal</span>
                            <span>${financialStats.expected.toFixed(0)}</span>
                        </div>
                        <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{ width: `${Math.min(financialStats.progress, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Card 3: Attendance */}
                <div className="bg-white/40 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/50 flex flex-col justify-between h-40 hover:bg-white/50 transition-all duration-300">
                    <div>
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Avg. Attendance</p>
                            <div className={`p-2 rounded-lg backdrop-blur-sm ${attendanceRate > 80 ? 'bg-green-100/50 text-green-700' : 'bg-orange-100/50 text-orange-700'}`}>
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">{attendanceRate}%</h3>
                    </div>
                    <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{attendanceStats.present}</span> Present Today
                    </p>
                </div>
            </div>

            {/* Content Split: 2/3 Main Activity, 1/3 Quick Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        <div className="p-6 border-b border-white/20 flex justify-between items-center bg-white/20">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-primary" />
                                Recent Activity
                            </h3>
                            <button className="text-sm text-primary font-medium hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-gray-100/50">
                            {recentActivity.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">No recent activity</div>
                            ) : (
                                recentActivity.map((item, idx) => (
                                    <div key={idx} className="p-4 hover:bg-white/30 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${item.type === 'payment' ? 'bg-green-100 text-green-600 group-hover:bg-green-200' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-200'} transition-colors`}>
                                                {item.type === 'payment' ? <DollarSign className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{item.studentName}</p>
                                                <p className="text-xs text-gray-500">{item.details}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-gray-500">
                                                {new Date(item.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quick Links & Summary */}
                <div className="space-y-6">
                    {/* Quick Actions Panel */}
                    <div className="bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-6 shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/students" className="bg-white/40 hover:bg-white/60 p-4 rounded-xl transition-all flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/50 shadow-sm group">
                                <div className="bg-blue-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <UserPlus className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-800">Add Student</span>
                            </Link>
                            <Link to="/fees" className="bg-white/40 hover:bg-white/60 p-4 rounded-xl transition-all flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/50 shadow-sm group">
                                <div className="bg-green-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <Wallet className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-800">Check Fees</span>
                            </Link>
                            <Link to="/attendance" className="bg-white/40 hover:bg-white/60 p-4 rounded-xl transition-all flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/50 shadow-sm group">
                                <div className="bg-purple-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-800">Attendance</span>
                            </Link>
                            <button className="bg-white/40 hover:bg-white/60 p-4 rounded-xl transition-all flex flex-col items-center justify-center text-center backdrop-blur-sm border border-white/50 shadow-sm group">
                                <div className="bg-orange-100 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                                    <FileText className="w-5 h-5 text-orange-600" />
                                </div>
                                <span className="text-xs font-bold text-gray-800">Reports</span>
                            </button>
                        </div>
                    </div>

                    {/* Simple Calendar Widget or Notification Placeholder */}
                    <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">System Status</h4>
                        <div className="flex items-center space-x-3 text-sm text-gray-700">
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgb(34,197,94)]"></div>
                            <span className="font-semibold">System Operational</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200/50">
                            <p className="text-xs text-gray-500">Inventory Status: Good</p>
                            <p className="text-xs text-gray-500 mt-1">Next Backup: 12:00 AM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
