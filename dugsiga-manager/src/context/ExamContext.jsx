import React, { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext();

export const useExams = () => {
    return useContext(ExamContext);
};

export const ExamProvider = ({ children }) => {
    // Exams: { id, name, date, term }
    const [exams, setExams] = useState(() => {
        const saved = localStorage.getItem('dugsiga_exams');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Term 1 Midterm', date: '2025-03-15', term: 'Term 1' },
            { id: 2, name: 'Term 1 Final', date: '2025-06-20', term: 'Term 1' }
        ];
    });

    // Results: { id, examId, studentId, subjectId, score }
    const [results, setResults] = useState(() => {
        const saved = localStorage.getItem('dugsiga_results');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('dugsiga_exams', JSON.stringify(exams));
    }, [exams]);

    useEffect(() => {
        localStorage.setItem('dugsiga_results', JSON.stringify(results));
    }, [results]);

    const addExam = (newExam) => {
        const exam = { ...newExam, id: Date.now() };
        setExams([...exams, exam]);
    };

    const deleteExam = (id) => {
        setExams(exams.filter(e => e.id !== id));
        // Cleanup associated results
        setResults(results.filter(r => r.examId !== id));
    };

    const recordGrade = (examId, studentId, subjectId, score) => {
        setResults(prev => {
            // Remove existing record if exists
            const filtered = prev.filter(r => !(r.examId === examId && r.studentId === studentId && r.subjectId === subjectId));
            // Add new record
            return [...filtered, { id: Date.now(), examId, studentId, subjectId, score: Number(score) }];
        });
    };

    const getGrade = (examId, studentId, subjectId) => {
        const result = results.find(r => r.examId === examId && r.studentId === studentId && r.subjectId === subjectId);
        return result ? result.score : '';
    };

    return (
        <ExamContext.Provider value={{ exams, results, addExam, deleteExam, recordGrade, getGrade }}>
            {children}
        </ExamContext.Provider>
    );
};
