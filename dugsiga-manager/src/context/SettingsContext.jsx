import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        schoolName: 'Dugsiga Sare',
        address: 'Mogadishu, Somalia',
        phone: '+252 61 555 5555',
        email: 'info@dugsiga.edu.so',
        currency: 'USD',
        logoUrl: '', // Could be a URL or data string
    });

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
