import React, { createContext, useContext, useState, useEffect } from 'react';

const HomeworkContext = createContext();

export const useHomework = () => {
    const context = useContext(HomeworkContext);
    if (!context) {
        throw new Error('useHomework must be used within a HomeworkProvider');
    }
    return context;
};

export const HomeworkProvider = ({ children }) => {
    const [assignments, setAssignments] = useState(() => {
        const saved = localStorage.getItem('dugsiga_homework');
        return saved ? JSON.parse(saved) : [
            { id: 1, classId: 'Form 4', subject: 'Math', title: 'Calculus Worksheet', dueDate: '2025-12-30', description: 'Complete all problems on page 45.', status: 'Pending' },
            { id: 2, classId: 'Form 4', subject: 'Physics', title: 'Lab Report', dueDate: '2025-12-28', description: 'Submit the report for the Pendulum experiment.', status: 'Submitted' },
            { id: 3, classId: 'Form 3', subject: 'English', title: 'Essay on Hamlet', dueDate: '2025-12-29', description: 'Write a 1000-word essay on the themes of Hamlet.', status: 'Pending' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('dugsiga_homework', JSON.stringify(assignments));
    }, [assignments]);

    const addAssignment = (assignment) => {
        setAssignments(prev => [...prev, { ...assignment, id: Date.now() }]);
    };

    const updateAssignmentStatus = (id, status) => {
        setAssignments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    return (
        <HomeworkContext.Provider value={{ assignments, addAssignment, updateAssignmentStatus }}>
            {children}
        </HomeworkContext.Provider>
    );
};
