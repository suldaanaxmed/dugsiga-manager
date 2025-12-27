import React, { useState } from 'react';
import { useCommunication } from '../context/CommunicationContext';
import { Send, MessageSquare, Phone, Users as UsersIcon } from 'lucide-react';

const Communication = () => {
    const { messages, sendMessage } = useCommunication();
    const [recipient, setRecipient] = useState('All Parents');
    const [method, setMethod] = useState('SMS');
    const [text, setText] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        sendMessage(recipient, text, method);
        setText('');
        setStatusMsg(`Message sent to ${recipient} via ${method}!`);
        setTimeout(() => setStatusMsg(''), 3000);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <MessageSquare className="text-indigo-600" /> Communication Center
            </h1>

            {statusMsg && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {statusMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Compose Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 h-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Send size={20} /> Compose Message
                        </h2>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Recipient Group</label>
                                <div className="relative">
                                    <select
                                        value={recipient}
                                        onChange={(e) => setRecipient(e.target.value)}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option>All Parents</option>
                                        <option>Form 1 Parents</option>
                                        <option>Form 2 Parents</option>
                                        <option>Form 3 Parents</option>
                                        <option>Form 4 Parents</option>
                                        <option>Teachers</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <UsersIcon size={16} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Method</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded cursor-pointer transition-colors ${method === 'SMS' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                        <input
                                            type="radio"
                                            name="method"
                                            value="SMS"
                                            checked={method === 'SMS'}
                                            onChange={() => setMethod('SMS')}
                                            className="hidden"
                                        />
                                        <Phone size={18} /> SMS
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 border rounded cursor-pointer transition-colors ${method === 'WhatsApp' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                                        <input
                                            type="radio"
                                            name="method"
                                            value="WhatsApp"
                                            checked={method === 'WhatsApp'}
                                            onChange={() => setMethod('WhatsApp')}
                                            className="hidden"
                                        />
                                        <MessageSquare size={18} /> WhatsApp
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Type your message here..."
                                    maxLength={160}
                                ></textarea>
                                <div className="text-right text-xs text-gray-500 mt-1">
                                    {text.length}/160 characters
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!text.trim()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center gap-2 transition-colors"
                            >
                                <Send size={18} /> Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 h-full">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Message History</h2>
                        <div className="overflow-auto max-h-[500px]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase">
                                        <th className="p-3 font-semibold">Date</th>
                                        <th className="p-3 font-semibold">Recipient</th>
                                        <th className="p-3 font-semibold">Message</th>
                                        <th className="p-3 font-semibold">Via</th>
                                        <th className="p-3 font-semibold text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {messages.map((msg) => (
                                        <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-3 text-gray-600 w-24 whitespace-nowrap">{msg.date}</td>
                                            <td className="p-3 font-medium text-gray-800 w-32">{msg.recipient}</td>
                                            <td className="p-3 text-gray-600 truncate max-w-xs" title={msg.message}>
                                                {msg.message}
                                            </td>
                                            <td className="p-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${msg.method === 'WhatsApp' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {msg.method === 'WhatsApp' ? <MessageSquare size={12} /> : <Phone size={12} />}
                                                    {msg.method}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right">
                                                <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    {msg.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {messages.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-400">No messages sent yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Communication;
