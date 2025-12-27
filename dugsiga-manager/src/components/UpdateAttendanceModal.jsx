import React from 'react';
import { X, Check, Clock, Minus } from 'lucide-react';
import { useAttendance } from '../context/AttendanceContext';

const UpdateAttendanceModal = ({ isOpen, onClose, student, dates }) => {
    const { getStudentAttendance, markAttendance } = useAttendance();

    if (!isOpen || !student) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-blue-50 to-white p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Update Attendance</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {student.fullName} • {student.classId}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        {dates.map((date) => {
                            const record = getStudentAttendance(student.id, date);
                            const status = record ? record.status : null;

                            const displayDate = new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric'
                            });

                            return (
                                <div key={date} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="font-medium text-gray-700">{displayDate}</span>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => markAttendance(student.id, date, 'Present')}
                                            className={`p-2 rounded-lg transition-all ${status === 'Present'
                                                    ? 'bg-green-500 text-white shadow-sm'
                                                    : 'bg-white text-gray-400 hover:text-green-500 hover:bg-green-50 border border-gray-200'
                                                }`}
                                            title="Mark Present"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, date, 'Absent')}
                                            className={`p-2 rounded-lg transition-all ${status === 'Absent'
                                                    ? 'bg-red-500 text-white shadow-sm'
                                                    : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 border border-gray-200'
                                                }`}
                                            title="Mark Absent"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => markAttendance(student.id, date, 'Late')}
                                            className={`p-2 rounded-lg transition-all ${status === 'Late'
                                                    ? 'bg-yellow-500 text-white shadow-sm'
                                                    : 'bg-white text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 border border-gray-200'
                                                }`}
                                            title="Mark Late"
                                        >
                                            <Clock className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateAttendanceModal;
