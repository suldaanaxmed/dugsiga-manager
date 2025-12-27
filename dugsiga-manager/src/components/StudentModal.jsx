import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useStudents } from '../context/StudentContext';

const StudentModal = ({ isOpen, onClose, studentToEdit }) => {
    const { addStudent, updateStudent } = useStudents();
    const isEditMode = !!studentToEdit;

    const [formData, setFormData] = useState({
        fullName: '',
        classId: '',
        guardianName: '',
        guardianPhone: '',
        guardianRelationship: 'Mother',
    });

    // Populate form if editing
    useEffect(() => {
        if (isOpen && studentToEdit) {
            setFormData({
                fullName: studentToEdit.fullName,
                classId: studentToEdit.classId,
                guardianName: studentToEdit.guardian.name,
                guardianPhone: studentToEdit.guardian.phone,
                guardianRelationship: studentToEdit.guardian.relationship,
            });
        } else if (isOpen && !studentToEdit) {
            // Reset for add mode
            setFormData({
                fullName: '',
                classId: '',
                guardianName: '',
                guardianPhone: '',
                guardianRelationship: 'Mother',
            });
        }
    }, [isOpen, studentToEdit]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const studentData = {
            fullName: formData.fullName,
            classId: formData.classId,
            guardian: {
                name: formData.guardianName,
                phone: formData.guardianPhone,
                relationship: formData.guardianRelationship,
            },
        };

        if (isEditMode) {
            updateStudent(studentToEdit.id, studentData);
        } else {
            addStudent(studentData);
        }

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Student' : 'Add New Student'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="e.g. Ahmed Omar"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class / Grade</label>
                        <select
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={formData.classId}
                            onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                        >
                            <option value="">Select Class...</option>
                            <option value="Class 1A">Class 1A</option>
                            <option value="Class 1B">Class 1B</option>
                            <option value="Class 2A">Class 2A</option>
                            <option value="Class 3A">Class 3A</option>
                        </select>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                            Guardian Information
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Guardian Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Parent/Guardian Name"
                                    value={formData.guardianName}
                                    onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="+252..."
                                        value={formData.guardianPhone}
                                        onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Relationship
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.guardianRelationship}
                                        onChange={(e) =>
                                            setFormData({ ...formData, guardianRelationship: e.target.value })
                                        }
                                    >
                                        <option value="Mother">Mother</option>
                                        <option value="Father">Father</option>
                                        <option value="Relative">Relative</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/30"
                        >
                            {isEditMode ? 'Update Student' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;
