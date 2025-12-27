import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAttendance } from '../context/AttendanceContext';
import { useFees } from '../context/FeeContext';
import { useExams } from '../context/ExamContext';
import { useTimetable } from '../context/TimetableContext';
import { PieChart, DollarSign, Book, Calendar, Clock, Award } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    // Correct destructuring based on actual Context exports
    const { attendanceRecords } = useAttendance();
    const { feeRecords } = useFees();
    const { results } = useExams();
    const { getClassSchedule } = useTimetable();

    const [activeTab, setActiveTab] = useState('overview');

    // 1. Attendance Data - Filter locally
    // expected logic: find records for this student
    const myAttendance = attendanceRecords
        ? attendanceRecords.filter(r => r.studentId === user.studentId)
        : [];

    // Calculate stats
    const presentCount = myAttendance.filter(a => a.status === 'Present').length;
    // If no records, totalDays is 0 to avoid division by zero issues, handled in UI
    const totalDays = myAttendance.length;
    const attendancePercentage = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    // 2. Fee Data
    // feeRecords contain { studentId, payments: [] }
    const myFeeRecords = feeRecords.filter(r => r.studentId === user.studentId);

    // Aggregate payments from all fee records
    const myPayments = myFeeRecords.flatMap(r => r.payments || []);

    // Mock data for total fee since we don't have a rigid fee structure per student in context yet
    const totalFeeYearly = 500;
    const totalPaid = myPayments.reduce((acc, curr) => acc + Number(curr.amount), 0);
    const balance = totalFeeYearly - totalPaid;

    // 3. Exam Data
    // Filter results where the student ID matches
    const myResults = results.filter(r => r.studentId === user.studentId);
    const recentExams = myResults.slice(0, 5);

    // 4. Timetable Data
    const mySchedule = getClassSchedule ? getClassSchedule(user.classId || 'Form 4') : [];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-indigo-600 rounded-lg shadow-lg p-8 text-white">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
                <p className="opacity-90">Class: {user.classId} | Student ID: {user.studentId}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Attendance Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-200 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                            <Clock size={24} />
                        </div>
                        <span className={`text-2xl font-bold ${attendancePercentage >= 90 ? 'text-green-600' : 'text-orange-500'}`}>
                            {attendancePercentage}%
                        </span>
                    </div>
                    <h3 className="text-gray-600 font-medium">Attendance Rate</h3>
                    <p className="text-xs text-gray-400 mt-1">Present {presentCount} of {totalDays} days</p>
                </div>

                {/* Fees Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-200 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-100 rounded-full text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">${balance}</span>
                    </div>
                    <h3 className="text-gray-600 font-medium">Outstanding Fees</h3>
                    <p className="text-xs text-gray-400 mt-1">Paid ${totalPaid} of ${totalFeeYearly}</p>
                </div>

                {/* Exams Card */}
                <div className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-200 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <Award size={24} />
                        </div>
                        <span className="text-2xl font-bold text-gray-800">{myResults.length}</span>
                    </div>
                    <h3 className="text-gray-600 font-medium">Exams Taken</h3>
                    <p className="text-xs text-gray-400 mt-1">View results below</p>
                </div>
            </div>

            {/* Tabs / Detailed Sections */}
            <div className="bg-white rounded-lg shadow-md min-h-[400px]">
                <div className="border-b border-gray-200 flex">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-4 font-medium text-sm focus:outline-none ${activeTab === 'overview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`px-6 py-4 font-medium text-sm focus:outline-none ${activeTab === 'schedule' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        My Schedule
                    </button>
                    <button
                        onClick={() => setActiveTab('exams')}
                        className={`px-6 py-4 font-medium text-sm focus:outline-none ${activeTab === 'exams' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Exam Results
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-gray-800 text-lg">Recent Activity</h3>
                            <div className="border rounded-lg divide-y">
                                {myPayments.slice(0, 3).map(pay => (
                                    <div key={pay.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="font-bold text-gray-800">Fee Payment</p>
                                            <p className="text-sm text-gray-500">{pay.date}</p>
                                        </div>
                                        <span className="text-green-600 font-bold">+${pay.amount}</span>
                                    </div>
                                ))}
                                {recentExams.map(exam => (
                                    <div key={exam.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                        <div>
                                            <p className="font-bold text-gray-800">Exam Result: {exam.subject}</p>
                                            <p className="text-sm text-gray-500">{exam.examType}</p>
                                        </div>
                                        <span className="text-indigo-600 font-bold">{exam.score}/100</span>
                                    </div>
                                ))}
                                {myPayments.length === 0 && recentExams.length === 0 && (
                                    <div className="p-8 text-center text-gray-500">No recent activity to show.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg mb-4">Class Timetable ({user.classId})</h3>
                            {mySchedule.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {mySchedule.map(item => (
                                        <div key={item.id} className="border p-4 rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-bold">{item.day}</span>
                                                <span className="text-gray-500 text-sm">Period {item.period}</span>
                                            </div>
                                            <h4 className="font-bold text-lg">{item.subject}</h4>
                                            <p className="text-gray-500 text-sm">{item.teacher}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No schedule available for your class.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'exams' && (
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg mb-4">My Academic Record</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 border-b">
                                            <th className="p-3 font-semibold text-gray-600">Subject</th>
                                            <th className="p-3 font-semibold text-gray-600">Exam Type</th>
                                            <th className="p-3 font-semibold text-gray-600">Score</th>
                                            <th className="p-3 font-semibold text-gray-600">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {myResults.map(res => (
                                            <tr key={res.id}>
                                                <td className="p-3">{res.subject}</td>
                                                <td className="p-3 text-gray-500">{res.examType}</td>
                                                <td className="p-3 font-bold text-gray-800">{res.score}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${res.score >= 80 ? 'bg-green-100 text-green-700' :
                                                        res.score >= 60 ? 'bg-blue-100 text-blue-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                        {res.score >= 90 ? 'A' : res.score >= 80 ? 'B' : res.score >= 60 ? 'C' : 'F'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {myResults.length === 0 && <p className="p-4 text-gray-500">No exam results found.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
