'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AboutPage() {
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [referenceCode, setReferenceCode] = useState('');

    useEffect(() => {
        // Hide loader after mount
        const timer = setTimeout(() => setLoading(false), 800);

        // Check theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.body.classList.add('dark');
        }

        // Check authentication
        if (localStorage.getItem('isLoggedIn') === 'true' || localStorage.getItem('user')) {
            setIsLoggedIn(true);
        }

        // Get saved reference code for order tracking if available
        const savedRef = localStorage.getItem('generatedReferenceCode');
        if (savedRef) {
            setReferenceCode(savedRef);
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
        window.location.href = '/login';
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'dark bg-[#122b2a] text-white' : 'bg-[#FFFFFF] text-[#114b46]'}`}>
            <style jsx global>{`
                :root {
                    --paper: ${isDark ? '#122b2a' : '#FFFFFF'};
                    --paper2: ${isDark ? '#0b1c1b' : '#f4fbfb'};
                    --card: ${isDark ? 'rgba(18, 43, 42, 0.85)' : 'rgba(203, 243, 240, 0.35)'};
                    --text: ${isDark ? '#FFFFFF' : '#114b46'};
                    --accent: #2EC4B6;
                    --accent2: #FFBF69;
                    --accent3: #FF9F1C;
                    --glass: ${isDark ? 'rgba(18, 43, 42, 0.95)' : 'rgba(255, 255, 255, 0.90)'};
                    --glass-border: ${isDark ? 'rgba(203, 243, 240, 0.20)' : 'rgba(46, 196, 182, 0.25)'};
                    --shadow: ${isDark ? '0 25px 60px rgba(0, 0, 0, 0.50)' : '0 20px 50px rgba(46, 196, 182, 0.12)'};
                    --error: #e74c3c;
                }
                body {
                    font-family: 'Manrope', sans-serif;
                    background: var(--paper);
                    color: var(--text);
                }
                h1, h2, h3 {
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
                    <Link href="/about" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </Link>
                    <button className="bg-none border-none text-[1.8rem] text-[var(--text)] cursor-pointer" onClick={() => setSidebarOpen(false)}>&times;</button>
                </div>
                <ul className="list-none flex flex-col gap-5">
                    <li><Link href="/about" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>About</Link></li>
                    <li><Link href="/story-gallery" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Story Gallery</Link></li>
                    <li><Link href="/characters" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Characters</Link></li>
                    <li><Link href="/other-services" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Other Services</Link></li>
                    
                    {/* Track Order Link in Menu (Safely handled) */}
                    <li>
                        {referenceCode ? (
                            <Link 
                                href={`/order-status/${referenceCode}`} 
                                className="no-underline text-[var(--accent3)] text-[1.1rem] font-semibold hover:opacity-80 transition flex items-center gap-2" 
                                onClick={() => setSidebarOpen(false)}
                            >
                                Track Order
                            </Link>
                        ) : (
                            <span 
                                className="no-underline opacity-40 text-[1.1rem] font-semibold flex items-center gap-2 cursor-not-allowed select-none" 
                                title="No active order to track"
                            >
                                Track Order
                            </span>
                        )}
                    </li>

                    <li><Link href="/contact" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Contact</Link></li>
                    
                    {!isLoggedIn ? (
                        <li><Link href="/login" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Log In / Register</Link></li>
                    ) : (
                        <li><a href="#" onClick={handleLogout} className="no-underline text-[var(--error)] text-[1.1rem] font-semibold transition">Log Out</a></li>
                    )}
                </ul>
            </aside>

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                <nav className="max-w-[1400px] mx-auto flex items-center justify-between p-[16px_30px]">
                    <div className="flex items-center gap-4">
                        <button className="bg-none border-none cursor-pointer flex flex-col gap-[5px] p-2 z-[5001]" onClick={() => setSidebarOpen(true)} aria-label="Open Menu">
                            <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                            <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                            <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                        </button>
                    </div>
                    
                    <Link href="/about" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </Link>

                    {/* Right Action Icons (Track Order & Theme Toggle) */}
                    <div className="flex items-center gap-3">
                        {referenceCode ? (
                            <Link 
                                href={`/order-status/${referenceCode}`} 
                                title="Track Order"
                                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--card)] text-[var(--text)] text-[0.85rem] font-semibold transition hover:border-[var(--accent3)] no-underline"
                            >
                                📦 Track
                            </Link>
                        ) : (
                            <span 
                                title="No active order to track"
                                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--card)] opacity-40 text-[var(--text)] text-[0.85rem] font-semibold cursor-not-allowed select-none"
                            >
                                📦 Track
                            </span>
                        )}

                        <button 
                            onClick={toggleTheme}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className="w-[44px] h-[44px] rounded-full border border-[var(--glass-border)] bg-[var(--card)] text-[var(--accent3)] text-[1.1rem] flex items-center justify-center transition transform hover:scale-110 shadow-md cursor-pointer"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Section */}
            <main className="max-w-[1400px] mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] items-center gap-[60px] p-[140px_30px_80px_30px]">
                <div className="flex flex-col gap-6">
                    <div className="inline-flex items-center gap-2 p-[8px_18px] bg-[var(--card)] border border-[var(--glass-border)] rounded-full text-[0.85rem] font-semibold w-fit text-[var(--accent3)]">
                        <span>✦ Art • Stories • Imagination</span>
                    </div>
                    <h1 className="text-[clamp(3rem,5.5vw,5.2rem)] font-bold leading-[1.1] tracking-tight">
                        Every Cup Begins With A <span className="italic font-normal text-[var(--accent3)]"> Sketch </span>
                    </h1>
                    <p className="text-[1.15rem] opacity-85 max-w-[580px]">
                        A narrative tea experience inspired by artists, storytellers, and dreamers—where watercolor memories, illustrated characters, and botanical flavors intertwine in every cup.
                    </p>
                    <div className="flex gap-4 flex-wrap mt-2">
                        <Link href="/story-gallery" className="p-[14px_28px] bg-[var(--accent3)] text-[#FFFFFF] rounded-full font-bold no-underline transition shadow-[0_10px_25px_rgba(255,159,28,0.35)] hover:bg-[#e58a0f] hover:-translate-y-[2px]">
                            Explore Stories
                        </Link>
                        <Link href="/other-services" className="p-[14px_28px] bg-[var(--card)] border border-[var(--glass-border)] text-[var(--text)] rounded-full font-bold no-underline transition hover:border-[var(--accent3)] hover:-translate-y-[2px]">
                            Other Services
                        </Link>
                    </div>
                </div>

                <div className="hidden lg:flex justify-center items-center relative">
                    <div className="relative flex justify-center items-center p-5">
                        <div className="absolute w-[280px] h-[280px] bg-[radial-gradient(circle,rgba(46,196,182,0.22)_0%,rgba(255,159,28,0.12)_60%,transparent_80%)] rounded-full z-0 animate-pulse"></div>
                        <img src="/sketchtea-logo.png" alt="Sketch Tea Logo" className="w-full max-w-[550px] h-auto object-contain relative z-1 drop-shadow-[0_20px_40px_rgba(17,75,70,0.2)]" />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center p-[30px] border-t border-[var(--glass-border)] text-[0.85rem] opacity-80 mt-auto">
                <p>&copy; 2026 Sketch Tea Co. All Rights Reserved.</p>
            </footer>
        </div>
    );
}