import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Save, Building, Phone, Mail, DollarSign, Image as ImageIcon } from 'lucide-react';

const Settings = () => {
    const { settings, updateSettings } = useSettings();
    const [formData, setFormData] = useState(settings);
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        setMsg('Settings saved successfully!');
        setTimeout(() => setMsg(''), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">School Settings</h1>

            {msg && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* School Name */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="schoolName">
                            <div className="flex items-center gap-2">
                                <Building size={18} /> School Name
                            </div>
                        </label>
                        <input
                            type="text"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            <div className="flex items-center gap-2">
                                <Phone size={18} /> Phone
                            </div>
                        </label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            <div className="flex items-center gap-2">
                                <Mail size={18} /> Email
                            </div>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Currency */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currency">
                            <div className="flex items-center gap-2">
                                <DollarSign size={18} /> Currency Symbol
                            </div>
                        </label>
                        <input
                            type="text"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Logo URL */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="logoUrl">
                            <div className="flex items-center gap-2">
                                <ImageIcon size={18} /> Logo URL (Optional)
                            </div>
                        </label>
                        <input
                            type="text"
                            name="logoUrl"
                            placeholder="https://example.com/logo.png"
                            value={formData.logoUrl}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Provide a direct link to your school's logo image.</p>
                    </div>

                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors"
                    >
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
