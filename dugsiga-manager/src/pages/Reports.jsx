import React, { useState, useMemo } from 'react';
import { useStudents } from '../context/StudentContext';
import { useExams } from '../context/ExamContext';
import { useSubjects } from '../context/SubjectContext';
import { FileBarChart, Filter, Award, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reports = () => {
    const { students } = useStudents();
    const { exams, getGrade } = useExams();
    const { subjects } = useSubjects();

    const [selectedTerm, setSelectedTerm] = useState('Term 1');
    const [selectedClass, setSelectedClass] = useState('All');

    // Get unique classes
    const classes = useMemo(() => {
        const unique = [...new Set(students.map(s => s.classId).filter(Boolean))];
        return ['All', ...unique.sort()];
    }, [students]);

    // -- Calculation Logic --
    const reportData = useMemo(() => {
        // 1. Get exams for this term
        const termExams = exams.filter(e => e.term === selectedTerm);

        if (termExams.length === 0) return [];

        // 2. Filter students by class
        const filteredStudents = selectedClass === 'All'
            ? students
            : students.filter(s => s.classId === selectedClass);

        // 3. For each student, calculate stats
        const data = filteredStudents.map(student => {
            const subjectStats = subjects.map(subject => {
                // Get all scores for this subject in the specific term
                const scores = termExams.map(exam => {
                    const score = getGrade(exam.id, student.id, subject.id);
                    return score === '' ? null : Number(score);
                }).filter(s => s !== null);

                // Calculate Subject Average
                const average = scores.length > 0
                    ? scores.reduce((a, b) => a + b, 0) / scores.length
                    : null;

                return {
                    subjectId: subject.id,
                    average
                };
            });

            // Calculate Overall Average
            const validSubjectAvgs = subjectStats
                .map(s => s.average)
                .filter(a => a !== null);

            const overallAverage = validSubjectAvgs.length > 0
                ? validSubjectAvgs.reduce((a, b) => a + b, 0) / validSubjectAvgs.length
                : 0;

            return {
                ...student,
                subjectStats,
                overallAverage
            };
        });

        // 3. Rank students
        return data.sort((a, b) => b.overallAverage - a.overallAverage).map((student, index) => ({
            ...student,
            rank: index + 1
        }));

    }, [students, exams, subjects, selectedTerm, selectedClass, getGrade]);

    const getLetterGrade = (score) => {
        if (!score && score !== 0) return '-';
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(`Academic Report - ${selectedTerm}`, 14, 20);

        doc.setFontSize(12);
        doc.text(`Class: ${selectedClass === 'All' ? 'All Classes' : selectedClass}`, 14, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 36);

        // Columns
        const tableColumn = ["Rank", "Student Name", ...subjects.map(s => s.code), "Total Avg", "Grade"];

        // Rows
        const tableRows = reportData.map(student => {
            const subjectGrades = student.subjectStats.map(stat =>
                stat.average !== null ? stat.average.toFixed(0) : '-'
            );

            return [
                student.rank,
                student.fullName,
                ...subjectGrades,
                `${student.overallAverage.toFixed(1)}%`,
                getLetterGrade(student.overallAverage)
            ];
        });

        // Generate Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Blue header
            styles: { fontSize: 10, cellPadding: 3 },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        // Save
        doc.save(`Report_${selectedTerm.replace(' ', '')}_${selectedClass}.pdf`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Academic Reports</h1>
                    <p className="text-gray-500 mt-1">Consolidated grades and class rankings for {selectedTerm}.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleExportPDF}
                        className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl flex items-center hover:bg-gray-50 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                    </button>
                    <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm font-medium"
                    >
                        {classes.map(cls => (
                            <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
                        ))}
                    </select>

                    <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="bg-primary text-white border-0 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-lg shadow-blue-500/30 font-medium"
                    >
                        <option value="Term 1">Term 1</option>
                        <option value="Term 2">Term 2</option>
                        <option value="Term 3">Term 3</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards (Mini) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Top Student</p>
                        <p className="font-bold text-gray-900 mt-1">{reportData[0]?.fullName || '-'}</p>
                    </div>
                    <div className="bg-yellow-100 p-2 rounded-full text-yellow-600">
                        <Award className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Class Average</p>
                        <p className="font-bold text-gray-900 mt-1">
                            {(reportData.reduce((acc, curr) => acc + curr.overallAverage, 0) / (reportData.length || 1)).toFixed(1)}%
                        </p>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                        <FileBarChart className="w-5 h-5" />
                    </div>
                </div>
                <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-4 rounded-xl shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Total Students</p>
                        <p className="font-bold text-gray-900 mt-1">{reportData.length}</p>
                    </div>
                    <div className="bg-green-100 p-2 rounded-full text-green-600">
                        <Filter className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Big Data Table */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="p-4 w-16">Rank</th>
                                <th className="p-4">Student</th>
                                {subjects.map(sub => (
                                    <th key={sub.id} className="p-4 text-center border-l border-gray-100">
                                        {sub.code} <br />
                                        <span className="text-[10px] font-normal lowercase">avg</span>
                                    </th>
                                ))}
                                <th className="p-4 text-center border-l border-gray-100 bg-blue-50/30">Total Avg</th>
                                <th className="p-4 text-center bg-blue-50/30">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {reportData.map((student) => (
                                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                            student.rank === 2 ? 'bg-gray-200 text-gray-700' :
                                                student.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                    'text-gray-500'
                                            }`}>
                                            {student.rank}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{student.fullName}</td>

                                    {/* Subject Columns */}
                                    {student.subjectStats.map(stat => (
                                        <td key={stat.subjectId} className="p-4 text-center border-l border-gray-100 font-mono text-sm">
                                            {stat.average !== null ? (
                                                <div className="flex flex-col items-center">
                                                    <span className={stat.average >= 50 ? 'text-gray-900' : 'text-red-500 font-bold'}>
                                                        {stat.average.toFixed(0)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    ))}

                                    {/* Finals */}
                                    <td className="p-4 text-center border-l border-gray-100 font-bold text-gray-900 bg-blue-50/30">
                                        {student.overallAverage.toFixed(1)}%
                                    </td>
                                    <td className="p-4 text-center bg-blue-50/30">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${getLetterGrade(student.overallAverage) === 'A' ? 'bg-green-100 text-green-700' :
                                            getLetterGrade(student.overallAverage) === 'F' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {getLetterGrade(student.overallAverage)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {reportData.length === 0 && (
                                <tr>
                                    <td colSpan={subjects.length + 4} className="p-8 text-center text-gray-500">
                                        No exams found for {selectedTerm}. Go to Exams to create records.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
