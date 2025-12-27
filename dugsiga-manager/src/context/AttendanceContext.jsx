import React, { createContext, useContext, useState, useEffect } from 'react';

const AttendanceContext = createContext();

export const useAttendance = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendance must be used within an AttendanceProvider');
    }
    return context;
};

export const AttendanceProvider = ({ children }) => {
    const [attendanceRecords, setAttendanceRecords] = useState(() => {
        const saved = localStorage.getItem('dugsiga_attendance');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('dugsiga_attendance', JSON.stringify(attendanceRecords));
    }, [attendanceRecords]);

    // Helper to find a record for a specific date and student
    const getStudentAttendance = (studentId, date) => {
        // Records are stored as flat list of daily entries or grouped by date?
        // Let's use a flat structure for simplicity: { date, studentId, status }
        return attendanceRecords.find(
            (r) => r.studentId === studentId && r.date === date
        );
    };

    const markAttendance = (studentId, date, status) => {
        setAttendanceRecords((prev) => {
            const existingIndex = prev.findIndex(
                (r) => r.studentId === studentId && r.date === date
            );

            if (existingIndex >= 0) {
                // Update existing
                const newRecords = [...prev];
                newRecords[existingIndex] = { ...newRecords[existingIndex], status };
                return newRecords;
            } else {
                // Create new
                return [
                    ...prev,
                    { id: crypto.randomUUID(), studentId, date, status },
                ];
            }
        });
    };

    const getStatsForDate = (date) => {
        const records = attendanceRecords.filter((r) => r.date === date);
        return {
            present: records.filter((r) => r.status === 'Present').length,
            absent: records.filter((r) => r.status === 'Absent').length,
            late: records.filter((r) => r.status === 'Late').length,
        };
    };

    return (
        <AttendanceContext.Provider value={{ attendanceRecords, getStudentAttendance, markAttendance, getStatsForDate }}>
            {children}
        </AttendanceContext.Provider>
    );
};
