'use client';

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Check session on load
    useEffect(() => {
        const auth = sessionStorage.getItem('isAdminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
            fetchOrders();
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: passwordInput }),
        });
        const data = await res.json();

        if (data.success) {
            setIsAuthenticated(true);
            sessionStorage.setItem('isAdminAuth', 'true');
            fetchOrders();
        } else {
            alert('Incorrect Password');
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        const res = await fetch('/api/admin-orders');
        const data = await res.json();
        if (data.success) {
            setOrders(data.orders);
        }
        setLoading(false);
    };

    const handleApprove = async (orderId) => {
        const res = await fetch('/api/admin-orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId }),
        });
        const data = await res.json();
        if (data.success) {
            // Refresh order list after approval
            fetchOrders();
        } else {
            alert('Failed to update status');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122b2a] text-white">
                <form onSubmit={handleLogin} className="p-8 bg-[rgba(18,43,42,0.85)] border border-[rgba(203,243,240,0.2)] rounded-2xl shadow-xl flex flex-col gap-4 w-[320px]">
                    <h1 className="text-xl font-bold text-center text-[#FF9F1C]">Admin Access</h1>
                    <input 
                        type="password" 
                        placeholder="Enter Admin Password" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="p-3 rounded-xl bg-black/30 border border-white/20 text-white outline-none focus:border-[#FF9F1C]"
                    />
                    <button type="submit" className="py-3 bg-[#FF9F1C] text-white font-bold rounded-xl hover:opacity-90 transition">
                        Login
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-[#122b2a] text-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-serif text-[#FF9F1C]">Service Orders Dashboard</h1>
                    <button 
                        onClick={() => { sessionStorage.removeItem('isAdminAuth'); setIsAuthenticated(false); }}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold hover:bg-red-500/30 transition"
                    >
                        Logout
                    </button>
                </div>

                {loading ? (
                    <p>Loading orders...</p>
                ) : (
                    <div className="overflow-x-auto bg-[rgba(18,43,42,0.85)] border border-[rgba(203,243,240,0.2)] rounded-2xl p-4 shadow-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[#FF9F1C]">
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Reference Code</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-4 text-center opacity-60">No orders found.</td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="border-b border-white/5 text-sm">
                                            <td className="p-3 font-mono">#{order.id}</td>
                                            <td className="p-3">{order.contact_email}</td>
                                            <td className="p-3 font-semibold text-[#FF9F1C]">{order.reference_code || 'N/A'}</td>
                                            <td className="p-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {order.status !== 'paid' && (
                                                    <button 
                                                        onClick={() => handleApprove(order.id)}
                                                        className="px-3 py-1.5 bg-[#FF9F1C] text-white font-bold rounded-lg text-xs hover:opacity-90 transition"
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}