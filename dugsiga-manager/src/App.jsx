import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudentDashboard from './pages/StudentDashboard';
import Students from './pages/Students';
import Fees from './pages/Fees';
import Attendance from './pages/Attendance';
import Subjects from './pages/Subjects';
import Exams from './pages/Exams';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Timetable from './pages/Timetable';
import Communication from './pages/Communication';
import Login from './pages/Login';

import { StudentProvider } from './context/StudentContext';
import { FeeProvider } from './context/FeeContext';
import { AttendanceProvider } from './context/AttendanceContext';
import { SubjectProvider } from './context/SubjectContext';
import { ExamProvider } from './context/ExamContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { TimetableProvider } from './context/TimetableContext';
import { CommunicationProvider } from './context/CommunicationContext';
import { HomeworkProvider } from './context/HomeworkContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  return allowedRoles.includes(user?.role) ? children : <Navigate to="/" />;
};

// Wrapper for the index route to decide which dashboard to show
const SmartDashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'student') {
    return <StudentDashboard />;
  }
  return <Dashboard />;
};

function App() {
  return (
    <StudentProvider>
      <FeeProvider>
        <AttendanceProvider>
          <SubjectProvider>
            <ExamProvider>
              <SettingsProvider>
                <TimetableProvider>
                  <CommunicationProvider>
                    <AuthProvider>
                      <HomeworkProvider>
                        <BrowserRouter>
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={
                              <ProtectedRoute>
                                <Layout />
                              </ProtectedRoute>
                            }>
                              {/* Smart Dashboard Routing */}
                              <Route index element={
                                <RoleRoute allowedRoles={['admin', 'teacher', 'student']}>
                                  <SmartDashboard />
                                </RoleRoute>
                              } />

                              {/* Admin Only Routes */}
                              <Route path="students" element={
                                <RoleRoute allowedRoles={['admin']}>
                                  <Students />
                                </RoleRoute>
                              } />
                              <Route path="fees" element={
                                <RoleRoute allowedRoles={['admin']}>
                                  <Fees />
                                </RoleRoute>
                              } />
                              <Route path="subjects" element={
                                <RoleRoute allowedRoles={['admin']}>
                                  <Subjects />
                                </RoleRoute>
                              } />
                              <Route path="settings" element={
                                <RoleRoute allowedRoles={['admin']}>
                                  <Settings />
                                </RoleRoute>
                              } />
                              <Route path="communication" element={
                                <RoleRoute allowedRoles={['admin']}>
                                  <Communication />
                                </RoleRoute>
                              } />

                              {/* Shared Routes */}
                              <Route path="attendance" element={<Attendance />} />
                              <Route path="exams" element={<Exams />} />
                              <Route path="reports" element={<Reports />} />
                              <Route path="timetable" element={
                                <RoleRoute allowedRoles={['admin', 'teacher', 'student']}>
                                  <Timetable />
                                </RoleRoute>
                              } />
                            </Route>
                          </Routes>
                        </BrowserRouter>
                      </HomeworkProvider>
                    </AuthProvider>
                  </CommunicationProvider>
                </TimetableProvider>
              </SettingsProvider>
            </ExamProvider>
          </SubjectProvider>
        </AttendanceProvider>
      </FeeProvider>
    </StudentProvider>
  );
}

export default App;
