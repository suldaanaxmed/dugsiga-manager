import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useFees } from '../context/FeeContext';

const UpdateFeeModal = ({ isOpen, onClose, student, month }) => {
    const { getFeeRecord, updateFeeRecord } = useFees();
    const [amountDue, setAmountDue] = useState('15');
    const [amountPaid, setAmountPaid] = useState('0');

    useEffect(() => {
        if (isOpen && student && month) {
            const record = getFeeRecord(student.id, month);
            setAmountDue(record.amountDue.toString());
            setAmountPaid(record.amountPaid.toString());
        }
    }, [isOpen, student, month, getFeeRecord]);

    if (!isOpen || !student) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        updateFeeRecord(student.id, month, {
            amountDue: parseFloat(amountDue),
            amountPaid: parseFloat(amountPaid),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-900">Update Fee Data</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-sm text-gray-500 mb-2">
                        Updating for <span className="font-semibold text-gray-900">{student.fullName}</span> ({month})
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Amount Due ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 font-medium"
                            value={amountDue}
                            onChange={(e) => setAmountDue(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Amount Paid ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-gray-900 font-medium"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Adjusting this manually overrides calculated totals.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-sm"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateFeeModal;
