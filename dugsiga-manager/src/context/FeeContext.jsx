import React, { createContext, useContext, useState, useEffect } from 'react';

const FeeContext = createContext();

export const useFees = () => {
    const context = useContext(FeeContext);
    if (!context) {
        throw new Error('useFees must be used within a FeeProvider');
    }
    return context;
};

export const FeeProvider = ({ children }) => {
    const [feeRecords, setFeeRecords] = useState(() => {
        const saved = localStorage.getItem('dugsiga_fees');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('dugsiga_fees', JSON.stringify(feeRecords));
    }, [feeRecords]);

    // Helper to generate a unique ID
    const generateId = () => crypto.randomUUID();

    // Get or Create a Fee Record for a student for a specific month
    const getFeeRecord = (studentId, monthStr) => {
        let record = feeRecords.find(
            (r) => r.studentId === studentId && r.month === monthStr
        );

        if (!record) {
            // Initialize default record
            record = {
                id: generateId(),
                studentId,
                month: monthStr,
                amountDue: 15, // Default monthly fee
                amountPaid: 0,
                status: 'Unpaid', // Unpaid | Partial | Paid
                payments: [],
            };
            // We don't set state here directly to avoid loops during render, 
            // but usually this is called when viewing data. 
            // For simplicity in this non-backend app, we'll return the phantom record
            // and only save it when a payment is actually made or explicitly initialized.
        }
        return record;
    };

    const recordPayment = (studentId, amount, method, reference, monthStr) => {
        setFeeRecords((prevRecords) => {
            const existingRecordIndex = prevRecords.findIndex(
                (r) => r.studentId === studentId && r.month === monthStr
            );

            let record;
            if (existingRecordIndex >= 0) {
                record = { ...prevRecords[existingRecordIndex] };
            } else {
                // Create new record if it didn't exist
                record = {
                    id: generateId(),
                    studentId,
                    month: monthStr,
                    amountDue: 15, // Default
                    amountPaid: 0,
                    status: 'Unpaid',
                    payments: [],
                };
            }

            // Add Payment
            const newPayment = {
                id: generateId(),
                date: new Date().toISOString(),
                amount: parseFloat(amount),
                method,
                reference,
            };

            record.payments = [...record.payments, newPayment];
            record.amountPaid += parseFloat(amount);

            // Update Status
            if (record.amountPaid >= record.amountDue) {
                record.status = 'Paid';
            } else if (record.amountPaid > 0) {
                record.status = 'Partial';
            } else {
                record.status = 'Unpaid';
            }

            if (existingRecordIndex >= 0) {
                const newRecords = [...prevRecords];
                newRecords[existingRecordIndex] = record;
                return newRecords;
            } else {
                return [...prevRecords, record];
            }
        });
    };

    const updateFeeRecord = (studentId, monthStr, updates) => {
        setFeeRecords((prevRecords) => {
            const index = prevRecords.findIndex(
                (r) => r.studentId === studentId && r.month === monthStr
            );

            if (index >= 0) {
                const newRecords = [...prevRecords];
                const updatedRecord = { ...newRecords[index], ...updates };

                // Auto-calculate status if amountPaid/Due changed
                if (updatedRecord.amountPaid >= updatedRecord.amountDue) {
                    updatedRecord.status = 'Paid';
                } else if (updatedRecord.amountPaid > 0) {
                    updatedRecord.status = 'Partial';
                } else {
                    updatedRecord.status = 'Unpaid';
                }

                newRecords[index] = updatedRecord;
                return newRecords;
            } else {
                // Determine status for new record
                let status = 'Unpaid';
                const paid = updates.amountPaid || 0;
                const due = updates.amountDue || 15;
                if (paid >= due) status = 'Paid';
                else if (paid > 0) status = 'Partial';

                // Create if doesn't exist (unlikely but safe)
                const newRecord = {
                    id: generateId(),
                    studentId,
                    month: monthStr,
                    amountDue: 15,
                    amountPaid: 0,
                    payments: [],
                    ...updates,
                    status
                };
                return [...prevRecords, newRecord];
            }
        });
    };

    return (
        <FeeContext.Provider value={{ feeRecords, getFeeRecord, recordPayment, updateFeeRecord }}>
            {children}
        </FeeContext.Provider>
    );
};
