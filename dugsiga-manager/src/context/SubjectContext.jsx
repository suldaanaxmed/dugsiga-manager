import React, { createContext, useContext, useState, useEffect } from 'react';

const SubjectContext = createContext();

export const useSubjects = () => {
    return useContext(SubjectContext);
};

export const SubjectProvider = ({ children }) => {
    const [subjects, setSubjects] = useState(() => {
        const saved = localStorage.getItem('dugsiga_subjects');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Mathematics', code: 'MATH', teacher: 'Mr. Ahmed' },
            { id: 2, name: 'Somali', code: 'SOM', teacher: 'Ms. Fadumo' },
            { id: 3, name: 'English', code: 'ENG', teacher: 'Mr. James' },
            { id: 4, name: 'Science', code: 'SCI', teacher: 'Dr. Hassan' },
            { id: 5, name: 'Islamic Studies', code: 'ISL', teacher: 'Sh. Mohamed' },
        ];
    });

    useEffect(() => {
        localStorage.setItem('dugsiga_subjects', JSON.stringify(subjects));
    }, [subjects]);

    const addSubject = (newSubject) => {
        const subject = { ...newSubject, id: Date.now() };
        setSubjects([...subjects, subject]);
    };

    const updateSubject = (id, updatedData) => {
        setSubjects(subjects.map(sub => sub.id === id ? { ...sub, ...updatedData } : sub));
    };

    const deleteSubject = (id) => {
        setSubjects(subjects.filter(sub => sub.id !== id));
    };

    return (
        <SubjectContext.Provider value={{ subjects, addSubject, updateSubject, deleteSubject }}>
            {children}
        </SubjectContext.Provider>
    );
};
