import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { useAttendance } from '../context/AttendanceContext';
import { Calendar, Check, X, Clock } from 'lucide-react';

const DailyAttendance = ({ onBack }) => {
    const { students } = useStudents();
    const { markAttendance, getStudentAttendance, getStatsForDate } = useAttendance();
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [selectedClass, setSelectedClass] = useState('All');

    const stats = getStatsForDate(date);

    const filteredStudents = students.filter(
        (s) => selectedClass === 'All' || s.classId === selectedClass
    );

    const handleStatusChange = (studentId, status) => {
        markAttendance(studentId, date, status);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <button
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2"
            >
                ← Back to Matrix
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Take Attendance</h2>
                    <p className="text-gray-500 text-sm">Marking for {new Date(date).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                            type="date"
                            className="outline-none text-gray-700 font-medium bg-transparent text-sm"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <select
                        className="bg-white border border-gray-200 rounded-xl p-2.5 shadow-sm outline-none text-gray-700 font-medium text-sm"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="All">All Classes</option>
                        <option value="Class 1A">Class 1A</option>
                        <option value="Class 1B">Class 1B</option>
                        <option value="Class 2A">Class 2A</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                    <p className="text-xs text-green-700 uppercase tracking-wider font-semibold">Present</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
                    <p className="text-xs text-red-700 uppercase tracking-wider font-semibold">Absent</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                    <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                    <p className="text-xs text-yellow-700 uppercase tracking-wider font-semibold">Late</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Mark Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((student) => {
                            const record = getStudentAttendance(student.id, date);
                            const status = record ? record.status : null;

                            return (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{student.fullName}</p>
                                        <p className="text-xs text-gray-500">{student.classId}</p>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center space-x-2">
                                        <button
                                            onClick={() => handleStatusChange(student.id, 'Present')}
                                            className={`p-2 rounded-lg transition-all ${status === 'Present'
                                                    ? 'bg-green-500 text-white shadow-md ring-2 ring-green-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                                                }`}
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(student.id, 'Absent')}
                                            className={`p-2 rounded-lg transition-all ${status === 'Absent'
                                                    ? 'bg-red-500 text-white shadow-md ring-2 ring-red-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-500'
                                                }`}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(student.id, 'Late')}
                                            className={`p-2 rounded-lg transition-all ${status === 'Late'
                                                    ? 'bg-yellow-500 text-white shadow-md ring-2 ring-yellow-200'
                                                    : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-500'
                                                }`}
                                        >
                                            <Clock className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DailyAttendance;
