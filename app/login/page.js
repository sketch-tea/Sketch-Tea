'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });
        setIsSubmitting(true);
        setStatus({ type: '', text: 'Logging in...' });

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setStatus({ type: 'success', text: 'Login successful! Redirecting...' });
                localStorage.setItem('user', JSON.stringify(result.user));
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } else {
                setStatus({ type: 'error', text: result.message || 'Invalid email or password.' });
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            setStatus({ type: 'error', text: 'Network error. Please check your connection.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`font-['Manrope',sans-serif] min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-[#122b2a] text-white' : 'bg-[#f4f9f9] text-[#122b2a]'}`}>
            
            {/* Top Navigation Bar */}
            <header className={`w-full flex items-center justify-between p-[20px_40px] border-b ${isDarkMode ? 'border-[rgba(203,243,240,0.1)]' : 'border-[rgba(18,43,42,0.1)]'}`}>
                {/* Top Left: Back Home / Menu */}
                <div className="flex items-center gap-4">
                    <Link href="/" className={`p-[10px_18px] rounded-xl border text-[0.9rem] font-semibold transition hover:scale-105 ${isDarkMode ? 'border-[rgba(203,243,240,0.2)] bg-[rgba(18,43,42,0.5)] text-[#CBF3F0]' : 'border-[rgba(18,43,42,0.2)] bg-white text-[#122b2a]'}`}>
                        ← Home
                    </Link>
                </div>

                {/* Center: Brand Name */}
                <Link href="/" className="text-[1.6rem] font-bold font-serif tracking-wide text-[#FF9F1C]">
                    Sketch Tea
                </Link>

                {/* Top Right: Circular Theme Toggle Icon */}
                <button 
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className={`w-[48px] h-[48px] rounded-full border flex items-center justify-center text-[1.2rem] transition transform hover:scale-110 shadow-md ${
                        isDarkMode 
                            ? 'border-[rgba(203,243,240,0.3)] bg-[rgba(18,43,42,0.8)] text-[#FF9F1C]' 
                            : 'border-[rgba(18,43,42,0.2)] bg-white text-[#FF9F1C]'
                    }`}
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-[40px_20px]">
                <div className={`w-full max-w-[450px] backdrop-blur-[20px] border rounded-[28px] p-[40px_32px] shadow-[0_25px_60px_rgba(0,0,0,0.30)] ${isDarkMode ? 'bg-[rgba(18,43,42,0.85)] border-[rgba(203,243,240,0.20)]' : 'bg-white border-[rgba(18,43,42,0.1)]'}`}>
                    <h2 className="text-[2.2rem] font-bold mb-5 text-center font-serif text-[#FF9F1C]">Welcome Back</h2>
                    
                    {status.text && (
                        <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-5 text-center font-semibold border ${
                            status.type === 'success' 
                                ? 'bg-[rgba(46,204,113,0.15)] text-[#2ecc71] border-[rgba(46,204,113,0.3)]' 
                                : status.type === 'error'
                                ? 'bg-[rgba(231,76,60,0.15)] text-[#e74c3c] border-[rgba(231,76,60,0.3)]'
                                : 'bg-[rgba(255,159,28,0.15)] text-[#FF9F1C] border-[rgba(255,159,28,0.3)]'
                        }`}>
                            {status.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-[18px]">
                            <label className="block mb-[6px] text-[0.9rem] font-semibold">Email Address</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-[14px_18px] rounded-[12px] border outline-none focus:border-[#FF9F1C] focus:ring-[3px] focus:ring-[rgba(255,159,28,0.2)] ${isDarkMode ? 'border-[rgba(203,243,240,0.20)] bg-[#0b1c1b] text-white' : 'border-gray-300 bg-gray-50 text-black'}`}
                            />
                        </div>
                        <div className="mb-[24px]">
                            <label className="block mb-[6px] text-[0.9rem] font-semibold">Password</label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password} 
                                onChange={handleChange} 
                                required 
                                className={`w-full p-[14px_18px] rounded-[12px] border outline-none focus:border-[#FF9F1C] focus:ring-[3px] focus:ring-[rgba(255,159,28,0.2)] ${isDarkMode ? 'border-[rgba(203,243,240,0.20)] bg-[#0b1c1b] text-white' : 'border-gray-300 bg-gray-50 text-black'}`}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full p-[14px_32px] rounded-full font-bold cursor-pointer transition duration-350 bg-[#FF9F1C] text-white hover:bg-[#e58a0f] hover:-translate-y-[3px] disabled:opacity-70"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[0.9rem] opacity-80">
                        Don't have an account? <Link href="/register" className="text-[#FF9F1C] underline font-semibold">Sign up</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}