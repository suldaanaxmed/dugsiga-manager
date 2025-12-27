import React, { createContext, useContext, useState } from 'react';

const CommunicationContext = createContext();

export const useCommunication = () => useContext(CommunicationContext);

export const CommunicationProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        { id: 1, recipient: 'All Parents', message: 'School will be closed tomorrow due to heavy rain.', date: '2023-10-25', status: 'Delivered', method: 'SMS' },
        { id: 2, recipient: 'Form 4 Parents', message: 'Exam results are now available.', date: '2023-11-01', status: 'Delivered', method: 'WhatsApp' },
    ]);

    const sendMessage = (recipient, message, method) => {
        const newMessage = {
            id: Date.now(),
            recipient,
            message,
            method,
            date: new Date().toISOString().split('T')[0],
            status: 'Sent' // Mocking immediate success
        };
        setMessages(prev => [newMessage, ...prev]);
        return true;
    };

    return (
        <CommunicationContext.Provider value={{ messages, sendMessage }}>
            {children}
        </CommunicationContext.Provider>
    );
};
