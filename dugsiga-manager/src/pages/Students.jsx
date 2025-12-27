import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { Plus, Search, MoreVertical, Phone, User as UserIcon, Trash2, Edit2 } from 'lucide-react';
import StudentModal from '../components/StudentModal';

const Students = () => {
    const { students, deleteStudent } = useStudents();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null); // Track who we are editing
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);

    const filteredStudents = students.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.guardian.phone.includes(searchTerm)
    );

    const handleDelete = (id, e) => {
        // Stop propagation to prevent closing dropdown immediately or other side effects
        if (e) e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this student?')) {
            deleteStudent(id);
            setActiveDropdown(null);
        }
    };

    const handleEdit = (student, e) => {
        if (e) e.stopPropagation();
        setEditingStudent(student);
        setIsModalOpen(true);
        setActiveDropdown(null);
    };

    const handleAdd = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Students</h1>
                    <p className="text-gray-500 mt-1">Manage enrollments and profiles</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 font-medium"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Student</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Student List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredStudents.length === 0 ? (
                    <div className="p-16 text-center text-gray-500">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <UserIcon className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No students found</h3>
                        <p className="text-sm mt-1">Try adjusting your search or add a new student.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guardian</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                                                    {student.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{student.fullName}</p>
                                                    <p className="text-xs text-gray-500 font-mono">ID: {student.id.slice(0, 6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            <span className="bg-gray-100 px-2 py-1 rounded text-xs">{student.classId}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-900">{student.guardian.name}</p>
                                                <div className="flex items-center text-gray-500 mt-0.5">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {student.guardian.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === 'Active'
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                    }`}
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveDropdown(activeDropdown === student.id ? null : student.id)}
                                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>

                                            {activeDropdown === student.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-10 py-1 origin-top-right animate-in fade-in zoom-in-95 duration-100">
                                                    <button
                                                        onClick={(e) => handleEdit(student, e)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                                    >
                                                        <Edit2 className="w-4 h-4 mr-2" />
                                                        Edit Student
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDelete(student.id, e)}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Student
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <StudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                studentToEdit={editingStudent}
            />

            {/* Click outside to close dropdown */}
            {activeDropdown && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveDropdown(null)}
                ></div>
            )}
        </div>
    );
};

export default Students;
