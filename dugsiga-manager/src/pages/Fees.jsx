import React, { useState } from 'react';
import { useStudents } from '../context/StudentContext';
import { useFees } from '../context/FeeContext';
import { Search, ChevronLeft, ChevronRight, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import UpdateFeeModal from '../components/UpdateFeeModal';

const Fees = () => {
    const { students } = useStudents();
    const { getFeeRecord } = useFees();

    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null); // For Payment Modal
    const [editingFeeStudent, setEditingFeeStudent] = useState(null); // For Update Modal

    const filteredStudents = students.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.classId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fee Management</h1>
                    <p className="text-gray-500 text-sm">Track payments and outstanding balances</p>
                </div>

                {/* Month Selector */}
                <div className="flex items-center bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border-none outline-none text-gray-700 font-medium px-2 py-1"
                    />
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search student..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status ({selectedMonth})</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid / Due</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents.map((student) => {
                            const feeRecord = getFeeRecord(student.id, selectedMonth);
                            // Use default styling based on status
                            const statusStyles = {
                                Paid: 'bg-green-100 text-green-700',
                                Partial: 'bg-yellow-100 text-yellow-700',
                                Unpaid: 'bg-red-100 text-red-700',
                            };

                            return (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.fullName}</td>
                                    <td className="px-6 py-4 text-gray-600">{student.classId}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center w-fit gap-1 ${statusStyles[feeRecord.status]}`}>
                                            {feeRecord.status === 'Paid' && <CheckCircle className="w-3 h-3" />}
                                            {feeRecord.status === 'Unpaid' && <AlertCircle className="w-3 h-3" />}
                                            {feeRecord.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="font-semibold text-gray-900">${feeRecord.amountPaid}</span>
                                        <span className="text-gray-400"> / ${feeRecord.amountDue}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedStudent(student)}
                                            className="text-primary hover:text-blue-700 font-medium text-sm flex items-center justify-end gap-1 ml-auto"
                                        >
                                            <DollarSign className="w-4 h-4" />
                                            Record Payment
                                        </button>
                                        <button
                                            onClick={() => setEditingFeeStudent(student)}
                                            className="text-gray-400 hover:text-gray-600 font-medium text-xs underline ml-3"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredStudents.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No students found.
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                student={selectedStudent}
            />

            <UpdateFeeModal
                isOpen={!!editingFeeStudent}
                onClose={() => setEditingFeeStudent(null)}
                student={editingFeeStudent}
                month={selectedMonth}
            />
        </div>
    );
};

export default Fees;
