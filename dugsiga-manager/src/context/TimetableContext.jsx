import React, { createContext, useContext, useState } from 'react';

const TimetableContext = createContext();

export const useTimetable = () => useContext(TimetableContext);

export const TimetableProvider = ({ children }) => {
    // Initial dummy data
    const [schedule, setSchedule] = useState([
        { id: 1, classId: 'Form 4', day: 'Saturday', period: 1, subject: 'Math', teacher: 'Mr. Abdi' },
        { id: 2, classId: 'Form 4', day: 'Saturday', period: 2, subject: 'Physics', teacher: 'Mr. Hassan' },
        { id: 3, classId: 'Form 4', day: 'Sunday', period: 1, subject: 'English', teacher: 'Ms. Sarah' },
    ]);

    const addScheduleEntry = (entry) => {
        // Generate a simple ID
        const newEntry = { ...entry, id: Date.now() };
        setSchedule(prev => [...prev, newEntry]);
    };

    const removeScheduleEntry = (id) => {
        setSchedule(prev => prev.filter(item => item.id !== id));
    };

    const getClassSchedule = (classId) => {
        return schedule.filter(item => item.classId === classId);
    };

    return (
        <TimetableContext.Provider value={{ schedule, addScheduleEntry, removeScheduleEntry, getClassSchedule }}>
            {children}
        </TimetableContext.Provider>
    );
};
