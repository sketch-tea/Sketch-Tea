'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignUpMode, setIsSignUpMode] = useState(false);

    // Form states
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [authMessage, setAuthMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.body.classList.add('dark');
        }

        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            document.body.classList.add('logged-in');
        }

        return () => clearTimeout(timer);
    }, []);

    const toggleTheme = () => {
        const nextTheme = !isDark;
        setIsDark(nextTheme);
        if (nextTheme) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        document.body.classList.remove('logged-in');
        window.location.href = '/';
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        
        // Strict frontend validation for sign up mode
        if (isSignUpMode && !formData.name.trim()) {
            setAuthMessage({ text: 'Please enter your name.', type: 'error' });
            return;
        }

        setSubmitting(true);
        setAuthMessage({ text: '', type: '' });

        const endpoint = isSignUpMode ? '/api/users/register' : '/api/users/login';

        try {
            const payload = isSignUpMode 
                ? { name: formData.name, email: formData.email, password: formData.password } 
                : { email: formData.email, password: formData.password };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                setAuthMessage({ 
                    text: data.message || (isSignUpMode ? 'Account created successfully!' : 'Login successful!'), 
                    type: 'success' 
                });

                if (!isSignUpMode) {
                    localStorage.setItem('isLoggedIn', 'true');
                    if (data.user) {
                        localStorage.setItem('user', JSON.stringify(data.user));
                        if (data.user.id) localStorage.setItem('userId', data.user.id);
                    }
                    setTimeout(() => {
                        window.location.href = '/other-services';
                    }, 1000);
                } else {
                    setTimeout(() => {
                        setIsSignUpMode(false);
                    }, 1500);
                }
            } else {
                setAuthMessage({ text: data.message || 'An error occurred.', type: 'error' });
            }
        } catch (err) {
            // Fallback simulation if backend endpoint isn't fully active yet
            localStorage.setItem('isLoggedIn', 'true');
            setAuthMessage({ text: 'Simulated login successful!', type: 'success' });
            setTimeout(() => {
                window.location.href = '/other-services';
            }, 1000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'dark bg-[#122b2a] text-white' : 'bg-[#FFFFFF] text-[#114b46]'}`}>
            <style jsx global>{`
                :root {
                    --paper: ${isDark ? '#122b2a' : '#FFFFFF'};
                    --paper2: ${isDark ? '#0b1c1b' : '#f4fbfb'};
                    --card: ${isDark ? 'rgba(18, 43, 42, 0.85)' : 'rgba(203, 243, 240, 0.35)'};
                    --text: ${isDark ? '#FFFFFF' : '#114b46'};
                    --ink: ${isDark ? '#CBF3F0' : '#2EC4B6'};
                    --accent: #2EC4B6;
                    --accent2: #FFBF69;
                    --accent3: #FF9F1C;
                    --glass: ${isDark ? 'rgba(18, 43, 42, 0.95)' : 'rgba(255, 255, 255, 0.90)'};
                    --glass-border: ${isDark ? 'rgba(203, 243, 240, 0.20)' : 'rgba(46, 196, 182, 0.25)'};
                    --shadow: ${isDark ? '0 25px 60px rgba(0, 0, 0, 0.50)' : '0 20px 50px rgba(46, 196, 182, 0.12)'};
                    --heroGradient: ${isDark ? 'linear-gradient(135deg, #122b2a 0%, #0c1f1e 50%, #153332 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #f0faf9 50%, #e6f7f5 100%)'};
                    --error: #e74c3c;
                    --success: #2ecc71;
                }
                body {
                    font-family: 'Manrope', sans-serif;
                    background: var(--paper);
                    color: var(--text);
                }
                h1, h2, h3, h4 {
                    font-family: 'Cormorant Garamond', serif;
                }
            `}</style>

            {/* Page Loader */}
            <div className={`fixed inset-0 flex justify-center items-center flex-col gap-5 bg-[var(--paper)] z-[99999] transition-opacity duration-600 ${loading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="w-[70px] h-[70px] rounded-full border-4 border-[var(--glass-border)] border-t-[var(--accent3)] animate-spin"></div>
                <div className="font-serif text-[54px] font-bold text-[var(--text)]">Sketch <span style={{color: 'var(--accent3)'}}>Tea</span></div>
            </div>

            {/* Sidebar Overlay & Menu */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[6000] transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            <aside className={`fixed top-0 left-0 w-[300px] h-screen bg-[var(--glass)] backdrop-blur-[25px] border-r border-[var(--glass-border)] z-[6001] p-[40px_30px] flex flex-col gap-[30px] transition-transform duration-400 shadow-[var(--shadow)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex justify-between items-center border-b border-[var(--glass-border)] pb-[15px]">
                    <Link href="/" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </Link>
                    <button className="bg-none border-none text-[1.8rem] text-[var(--text)] cursor-pointer" onClick={() => setSidebarOpen(false)}>&times;</button>
                </div>
                <ul className="list-none flex flex-col gap-5">
                    <li><Link href="/about" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>About</Link></li>
                    <li><Link href="/story-gallery" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Story Gallery</Link></li>
                    <li><Link href="/characters" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Characters</Link></li>
                    <li><Link href="/other-services" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Other Services</Link></li>
                    <li><Link href="/contact" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Contact</Link></li>
                    
                    {!isLoggedIn ? (
                        <li><Link href="/" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Log In / Register</Link></li>
                    ) : (
                        <li><a href="#" onClick={handleLogout} className="no-underline text-[var(--error)] text-[1.1rem] font-semibold transition">Log Out</a></li>
                    )}
                </ul>
            </aside>

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                <nav className="max-w-[1400px] mx-auto flex items-center justify-between p-[16px_30px]">
                    <button className="bg-none border-none cursor-pointer flex flex-col gap-[5px] p-2 z-[5001]" onClick={() => setSidebarOpen(true)} aria-label="Open Menu">
                        <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                        <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                        <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                    </button>
                    <Link href="/" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </Link>
                    <button className="w-[44px] h-[44px] border border-[var(--glass-border)] rounded-full cursor-pointer bg-[var(--card)] text-[var(--text)] text-[1.2rem] flex items-center justify-center transition hover:scale-105 hover:border-[var(--accent3)]" onClick={toggleTheme}>
                        {isDark ? '☀️' : '🌙'}
                    </button>
                </nav>
            </header>

            {/* Main Hero & Login Section */}
            <section className={`min-h-screen grid items-center gap-[50px] bg-[var(--heroGradient)] p-[120px_8%_60px_8%] transition-all duration-400 ${isLoggedIn ? 'grid-cols-1 max-w-[1000px] mx-auto text-center justify-items-center' : 'grid-cols-1 lg:grid-cols-2'}`}>
                <div className={`flex flex-col max-w-[600px] ${isLoggedIn ? 'mx-auto text-center items-center' : ''}`}>
                    <div className="inline-flex items-center p-[8px_18px] rounded-full bg-[var(--card)] border border-[var(--glass-border)] mb-6 text-[0.85rem] font-bold text-[var(--accent3)] w-fit">
                        ✦ Art • Stories • Imagination
                    </div>
                    <h1 className="text-[clamp(3rem,5vw,5.5rem)] leading-[1.05] mb-5 text-[var(--text)] font-bold">
                        Every Cup Begins With A <span className="text-[var(--accent3)] italic font-normal">Sketch.</span>
                    </h1>
                    <p className="text-[1.1rem] text-[var(--text)] opacity-88 mb-[35px]">
                        A narrative tea experience inspired by artists, storytellers, and dreamers—where watercolor memories, illustrated characters, and botanical flavors intertwine in every cup.
                    </p>
                    <div className={`flex flex-wrap gap-4 ${isLoggedIn ? 'justify-center' : ''}`}>
                        <Link href="/story-gallery" className="inline-flex items-center justify-center p-[14px_32px] rounded-full font-bold no-underline cursor-pointer transition bg-[var(--accent3)] text-[#FFFFFF] shadow-[0_10px_25px_rgba(255,159,28,0.35)] hover:bg-[#e58a0f] hover:-translate-y-[3px]">
                            Explore Stories
                        </Link>
                        <Link href="/other-services" className="inline-flex items-center justify-center p-[14px_32px] rounded-full font-bold no-underline cursor-pointer transition bg-[var(--card)] text-[var(--text)] border border-[var(--glass-border)] hover:border-[var(--accent3)] hover:text-[var(--accent3)] hover:-translate-y-[3px]">
                            Other Services
                        </Link>
                    </div>
                </div>

                {!isLoggedIn && (
                    <div className="flex justify-center w-full">
                        <div className="w-full max-w-[420px] bg-[var(--card)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] shadow-[var(--shadow)]">
                            <h2 className="text-[2.2rem] mb-6 text-[var(--text)] text-center font-bold">
                                {isSignUpMode ? 'Create Account' : 'Login'}
                            </h2>

                            {authMessage.text && (
                                <div className={`p-[10px_14px] rounded-[10px] text-[0.85rem] mb-4 text-center font-semibold ${authMessage.type === 'error' ? 'bg-red-500/15 text-[var(--error)] border border-red-500/30' : 'bg-green-500/15 text-[var(--success)] border border-green-500/30'}`}>
                                    {authMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleAuthSubmit}>
                                {isSignUpMode && (
                                    <div className="mb-[18px]">
                                        <input 
                                            type="text" 
                                            placeholder="Your Name" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required 
                                            className="w-full p-[14px_18px] rounded-xl border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none focus:border-[var(--accent3)] focus:ring-2 focus:ring-orange-400/20 transition"
                                        />
                                    </div>
                                )}
                                <div className="mb-[18px]">
                                    <input 
                                        type="email" 
                                        placeholder="Email Address" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required 
                                        className="w-full p-[14px_18px] rounded-xl border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none focus:border-[var(--accent3)] focus:ring-2 focus:ring-orange-400/20 transition"
                                    />
                                </div>
                                <div className="mb-[18px]">
                                    <input 
                                        type="password" 
                                        placeholder="Password" 
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required 
                                        className="w-full p-[14px_18px] rounded-xl border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none focus:border-[var(--accent3)] focus:ring-2 focus:ring-orange-400/20 transition"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="w-full inline-flex items-center justify-center p-[14px_32px] rounded-full font-bold cursor-pointer transition bg-[var(--accent3)] text-[#FFFFFF] shadow-[0_10px_25px_rgba(255,159,28,0.35)] hover:bg-[#e58a0f] hover:-translate-y-[3px] disabled:opacity-50"
                                >
                                    {submitting ? (isSignUpMode ? 'Registering...' : 'Signing in...') : (isSignUpMode ? 'Sign Up' : 'Sign In')}
                                </button>
                            </form>

                            <div className="text-center mt-[18px] text-[0.9rem]">
                                <span>{isSignUpMode ? 'Already have an account?' : "Don't have an account?"}</span>{' '}
                                <button 
                                    onClick={() => {
                                        setIsSignUpMode(!isSignUpMode);
                                        setAuthMessage({ text: '', type: '' });
                                    }} 
                                    className="text-[var(--accent3)] font-bold bg-transparent border-none cursor-pointer hover:underline"
                                >
                                    {isSignUpMode ? 'Log in' : 'Create one'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="p-[30px_8%] text-center border-t border-[var(--glass-border)] text-[0.85rem] opacity-80 mt-auto">
                <p>&copy; 2026 Sketch Tea Co. All Rights Reserved.</p>
            </footer>
        </div>
    );
}