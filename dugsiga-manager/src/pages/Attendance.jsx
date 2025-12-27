import React, { useState } from 'react';
import AttendanceMatrix from '../components/AttendanceMatrix';
import DailyAttendance from '../components/DailyAttendance';

const Attendance = () => {
    const [view, setView] = useState('matrix'); // 'matrix' | 'daily'

    return (
        <>
            {view === 'matrix' ? (
                <AttendanceMatrix onTakeAttendance={() => setView('daily')} />
            ) : (
                <DailyAttendance onBack={() => setView('matrix')} />
            )}
        </>
    );
};

export default Attendance;
