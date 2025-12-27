import React, { useState } from 'react';
import { useExams } from '../context/ExamContext';
import { useStudents } from '../context/StudentContext';
import { useSubjects } from '../context/SubjectContext';
import { FileText, Plus, ChevronRight, Save, ArrowLeft, Trash2 } from 'lucide-react';

const Exams = () => {
    const { exams, addExam, deleteExam, recordGrade, getGrade } = useExams();
    const { students } = useStudents();
    const { subjects } = useSubjects();

    const [view, setView] = useState('list'); // 'list' | 'grading'
    const [selectedExam, setSelectedExam] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(subjects[0]?.id || '');

    // Add Exam Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExamData, setNewExamData] = useState({ name: '', date: '', term: '' });

    // Grading State
    // We'll track local edits for the grading sheet before saving/committing if needed, 
    // but context updates are fast enough to be direct usually. 
    // For smoother UX, we'll write directly to context on blur or change.

    const handleAddExam = (e) => {
        e.preventDefault();
        addExam(newExamData);
        setIsModalOpen(false);
        setNewExamData({ name: '', date: '', term: '' });
    };

    const openGrading = (exam) => {
        setSelectedExam(exam);
        setSelectedSubject(subjects[0]?.id || '');
        setView('grading');
    };

    const handleGradeChange = (studentId, score) => {
        if (score === '' || (score >= 0 && score <= 100)) {
            recordGrade(selectedExam.id, studentId, Number(selectedSubject), score);
        }
    };

    const handleDeleteExam = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Delete this exam and all its grades?')) {
            deleteExam(id);
        }
    }

    if (view === 'grading') {
        const currentSubject = subjects.find(s => s.id === Number(selectedSubject));

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setView('list')}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{selectedExam?.name}</h1>
                        <p className="text-gray-500">Grading Sheet • {selectedExam?.term}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Subject:</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                        >
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name} ({sub.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="text-sm text-gray-500">
                        Recording grades for <span className="font-bold text-gray-900">{currentSubject?.name}</span>
                    </div>
                </div>

                {/* Grading Table */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                    <th className="p-4">Student Name</th>
                                    <th className="p-4 w-48">Score (0-100)</th>
                                    <th className="p-4 w-48">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student) => {
                                    const score = getGrade(selectedExam.id, student.id, Number(selectedSubject));
                                    let grade = '-';
                                    if (score !== '') {
                                        if (score >= 90) grade = 'A';
                                        else if (score >= 80) grade = 'B';
                                        else if (score >= 70) grade = 'C';
                                        else if (score >= 60) grade = 'D';
                                        else grade = 'F';
                                    }

                                    return (
                                        <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-4 font-medium text-gray-900">{student.fullName}</td>
                                            <td className="p-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={score}
                                                    onChange={(e) => handleGradeChange(student.id, e.target.value)}
                                                    className={`w-full p-2 border rounded-lg focus:ring-2 outline-none transition-all text-center font-mono ${score !== '' ? 'border-blue-200 bg-blue-50 focus:ring-blue-500' : 'border-gray-200 focus:ring-gray-300'}`}
                                                    placeholder="-"
                                                />
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${grade === 'A' ? 'bg-green-100 text-green-700' :
                                                        grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                            grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                                grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {grade}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Default: List View
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Exams</h1>
                    <p className="text-gray-500 mt-1">Manage exam schedules and student grades.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Exam
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((exam) => (
                    <div
                        key={exam.id}
                        onClick={() => openGrading(exam)}
                        className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <FileText className="w-24 h-24 text-blue-600" />
                        </div>

                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-purple-100 p-3 rounded-xl text-purple-600 group-hover:scale-110 transition-transform duration-300">
                                <FileText className="w-6 h-6" />
                            </div>
                            <button
                                onClick={(e) => handleDeleteExam(e, exam.id)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{exam.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{exam.term}</p>

                        <div className="mt-6 flex items-center justify-between text-sm">
                            <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                                {new Date(exam.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                                Open Gradebook <ChevronRight className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* New Exam Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-bold mb-4">Create New Exam</h2>
                        <form onSubmit={handleAddExam} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    value={newExamData.name}
                                    onChange={(e) => setNewExamData({ ...newExamData, name: e.target.value })}
                                    placeholder="e.g. Term 2 Final"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    value={newExamData.date}
                                    onChange={(e) => setNewExamData({ ...newExamData, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                                <select
                                    required
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    value={newExamData.term}
                                    onChange={(e) => setNewExamData({ ...newExamData, term: e.target.value })}
                                >
                                    <option value="">Select Term</option>
                                    <option value="Term 1">Term 1</option>
                                    <option value="Term 2">Term 2</option>
                                    <option value="Term 3">Term 3</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Exam
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exams;
