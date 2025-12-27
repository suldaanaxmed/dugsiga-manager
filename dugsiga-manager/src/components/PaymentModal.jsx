import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useFees } from '../context/FeeContext';

const PaymentModal = ({ isOpen, onClose, student }) => {
    const { recordPayment } = useFees();
    const [amount, setAmount] = useState('15');
    const [method, setMethod] = useState('EVC Plus');
    const [reference, setReference] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    // Reset or initialize when modal opens with a new student
    useEffect(() => {
        if (isOpen) {
            setAmount('15');
            setReference('');
            setMethod('EVC Plus');
            setMonth(new Date().toISOString().slice(0, 7));
        }
    }, [isOpen, student]);

    if (!isOpen || !student) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        recordPayment(student.id, amount, method, reference, month);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gradient-to-r from-primary to-blue-600 p-6 flex justify-between items-start">
                    <div className="text-white">
                        <h2 className="text-xl font-bold">Record Payment</h2>
                        <p className="text-sm text-blue-100 mt-1 opacity-90">
                            For student: <span className="font-semibold text-white">{student.fullName}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-blue-100 hover:text-white hover:bg-white/10 rounded-full p-1 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Month Selection */}
                    <div className="space-y-1">
                        <label className="text-sm font-semibold text-gray-700">Month</label>
                        <input
                            type="month"
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Amount ($)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full pl-8 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-bold text-gray-900"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Method</label>
                            <select
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white"
                                value={method}
                                onChange={(e) => setMethod(e.target.value)}
                            >
                                <option value="EVC Plus">EVC Plus</option>
                                <option value="Zaad">Zaad</option>
                                <option value="Sahal">Sahal</option>
                                <option value="Cash">Cash</option>
                            </select>
                        </div>
                    </div>

                    {(method !== 'Cash') && (
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-700">Reference / Phone</label>
                            <input
                                type="text"
                                placeholder="Transaction ID or Phone"
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                                value={reference}
                                onChange={(e) => setReference(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                        >
                            <Check className="w-5 h-5" />
                            <span>Confirm Payment</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
