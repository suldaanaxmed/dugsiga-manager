import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { useAttendance } from '../context/AttendanceContext';
import { Check, X, Clock, Minus, CalendarPlus, Edit2 } from 'lucide-react';
import UpdateAttendanceModal from './UpdateAttendanceModal';

const AttendanceMatrix = ({ onTakeAttendance }) => {
    const { students } = useStudents();
    const { getStudentAttendance } = useAttendance();
    const [selectedClass, setSelectedClass] = useState('All');
    const [editingStudent, setEditingStudent] = useState(null);

    // Generate last 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i)); // -6 to 0 (today)
        return d.toISOString().slice(0, 10);
    });

    const filteredStudents = students.filter(
        (s) => selectedClass === 'All' || s.classId === selectedClass
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <Check className="w-4 h-4 text-green-500" />;
            case 'Absent': return <X className="w-4 h-4 text-red-500" />;
            case 'Late': return <Clock className="w-4 h-4 text-yellow-500" />;
            default: return <Minus className="w-3 h-3 text-gray-200" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Attendance Matrix</h1>
                    <p className="text-gray-500 mt-1">Weekly overview (Last 7 Days)</p>
                </div>
                <div className="flex gap-3">
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm outline-none text-gray-700 font-medium"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                    >
                        <option value="All">All Classes</option>
                        <option value="Class 1A">Class 1A</option>
                        <option value="Class 1B">Class 1B</option>
                        <option value="Class 2A">Class 2A</option>
                    </select>

                    <button
                        onClick={onTakeAttendance}
                        className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/30 font-medium"
                    >
                        <CalendarPlus className="w-5 h-5" />
                        <span>Take Today's Attendance</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 shadow-sm md:shadow-none">Student</th>
                            {dates.map(date => (
                                <th key={date} className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-16">
                                    <div className="flex flex-col">
                                        <span className="text-xs">{new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="text-gray-400 font-normal">{new Date(date).getDate()}</span>
                                    </div>
                                </th>
                            ))}
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-gray-50/50 z-10 border-r border-transparent md:border-none">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white">
                                            {student.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{student.fullName}</p>
                                            <p className="text-xs text-gray-400">{student.classId}</p>
                                        </div>
                                    </div>
                                </td>
                                {dates.map(date => {
                                    const record = getStudentAttendance(student.id, date);
                                    return (
                                        <td key={date} className="px-4 py-4 text-center">
                                            <div className="flex justify-center">
                                                {getStatusIcon(record?.status)}
                                            </div>
                                        </td>
                                    );
                                })}
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => setEditingStudent(student)}
                                        className="text-primary hover:text-blue-700 text-xs font-medium bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors flex items-center ml-auto"
                                    >
                                        <Edit2 className="w-3 h-3 mr-1" />
                                        Update
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredStudents.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No students found.
                    </div>
                )}
            </div>

            <UpdateAttendanceModal
                isOpen={!!editingStudent}
                onClose={() => setEditingStudent(null)}
                student={editingStudent}
                dates={dates}
            />
        </div>
    );
};

export default AttendanceMatrix;
