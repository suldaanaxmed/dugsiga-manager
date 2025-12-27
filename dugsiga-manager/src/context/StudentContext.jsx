import React, { createContext, useContext, useState, useEffect } from 'react';

const StudentContext = createContext();

export const useStudents = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error('useStudents must be used within a StudentProvider');
    }
    return context;
};

export const StudentProvider = ({ children }) => {
    const [students, setStudents] = useState(() => {
        const saved = localStorage.getItem('dugsiga_students');
        if (saved) return JSON.parse(saved);

        // Seed Data for Modern/Proffs look immediately
        return [
            {
                id: '1',
                fullName: 'Hamza Abdi',
                enrollmentDate: new Date().toISOString(),
                status: 'Active',
                classId: 'Class 1A',
                guardian: { name: 'Omar Abdi', phone: '+252615000000', relationship: 'Father' }
            },
            {
                id: '2',
                fullName: 'Amina Farah',
                enrollmentDate: new Date().toISOString(),
                status: 'Active',
                classId: 'Class 2A',
                guardian: { name: 'Halima', phone: '+252615111111', relationship: 'Mother' }
            },
            {
                id: '3',
                fullName: 'Khalid Hassan',
                enrollmentDate: new Date().toISOString(),
                status: 'Suspended',
                classId: 'Class 1B',
                guardian: { name: 'Hassan', phone: '+252615222222', relationship: 'Father' }
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem('dugsiga_students', JSON.stringify(students));
    }, [students]);

    const addStudent = (studentData) => {
        const newStudent = {
            id: crypto.randomUUID(),
            ...studentData,
            enrollmentDate: new Date().toISOString(),
            status: 'Active',
        };
        setStudents((prev) => [newStudent, ...prev]);
        return newStudent;
    };

    const updateStudent = (id, updatedData) => {
        setStudents((prev) =>
            prev.map((student) => (student.id === id ? { ...student, ...updatedData } : student))
        );
    };

    const deleteStudent = (id) => {
        setStudents((prev) => prev.filter((student) => student.id !== id));
    };

    return (
        <StudentContext.Provider value={{ students, addStudent, updateStudent, deleteStudent }}>
            {children}
        </StudentContext.Provider>
    );
};
