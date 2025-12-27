import React, { useState } from 'react';
import { useTimetable } from '../context/TimetableContext';
import { useSubjects } from '../context/SubjectContext'; // Assuming this exists or using dummy for now
import { Plus, Trash2, Calendar } from 'lucide-react';

const Timetable = () => {
    const { schedule, addScheduleEntry, removeScheduleEntry, getClassSchedule } = useTimetable();
    const { subjects } = useSubjects() || { subjects: [] }; // Fallback if context not fully wired

    const [selectedClass, setSelectedClass] = useState('Form 4');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEntry, setNewEntry] = useState({
        day: 'Saturday',
        period: 1,
        subject: '',
        teacher: ''
    });

    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const periods = [1, 2, 3, 4, 5, 6, 7];
    const classes = ['Form 1', 'Form 2', 'Form 3', 'Form 4'];

    const classSchedule = getClassSchedule(selectedClass);

    const handleAdd = (e) => {
        e.preventDefault();
        addScheduleEntry({ ...newEntry, classId: selectedClass });
        setIsModalOpen(false);
        setNewEntry({ day: 'Saturday', period: 1, subject: '', teacher: '' });
    };

    const getCellContent = (day, period) => {
        const entry = classSchedule.find(item => item.day === day && item.period === period);
        if (entry) {
            return (
                <div className="bg-indigo-50 p-2 rounded text-sm relative group h-full">
                    <div className="font-bold text-indigo-700">{entry.subject}</div>
                    <div className="text-gray-500 text-xs">{entry.teacher}</div>
                    <button
                        onClick={() => removeScheduleEntry(entry.id)}
                        className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            );
        }
        return <div className="text-gray-300 text-xs text-center py-4">-</div>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <Calendar className="text-indigo-600" /> Class Timetable
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                >
                    <Plus size={20} /> Add Class
                </button>
            </div>

            {/* Class Selector */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4">
                <span className="font-bold text-gray-700">Select Class:</span>
                <div className="flex gap-2">
                    {classes.map(cls => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedClass === cls
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timetable Matrix */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-24">Period / Day</th>
                                {days.map(day => (
                                    <th key={day} className="p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-l border-gray-100">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {periods.map(period => (
                                <tr key={period} className="hover:bg-gray-50/50">
                                    <td className="p-3 font-bold text-gray-700 border-r border-gray-100 text-center">
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className="text-lg">{period}</span>
                                            <span className="text-xs text-gray-400 font-normal">08:00 - 09:00</span>
                                        </div>
                                    </td>
                                    {days.map(day => (
                                        <td key={`${day}-${period}`} className="p-2 border-l border-gray-100 h-24 align-top">
                                            {getCellContent(day, period)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Add Schedule Entry</h2>
                        <form onSubmit={handleAdd}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                                    <input type="text" value={selectedClass} disabled className="shadow border rounded w-full py-2 px-3 text-gray-500 bg-gray-100" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Day</label>
                                    <select
                                        value={newEntry.day}
                                        onChange={e => setNewEntry({ ...newEntry, day: e.target.value })}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Period</label>
                                    <select
                                        value={newEntry.period}
                                        onChange={e => setNewEntry({ ...newEntry, period: Number(e.target.value) })}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                    >
                                        {periods.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="Subject Name"
                                        value={newEntry.subject}
                                        onChange={e => setNewEntry({ ...newEntry, subject: e.target.value })}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Teacher</label>
                                    <input
                                        type="text"
                                        placeholder="Teacher Name"
                                        value={newEntry.teacher}
                                        onChange={e => setNewEntry({ ...newEntry, teacher: e.target.value })}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Timetable;
