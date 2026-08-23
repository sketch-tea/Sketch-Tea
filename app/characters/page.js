'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CharactersPage() {
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [referenceCode, setReferenceCode] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.body.classList.add('dark');
        }

        if (localStorage.getItem('isLoggedIn') === 'true') {
            setIsLoggedIn(true);
        }

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
        window.location.href = '/';
    };

    const handleLogoClick = (e) => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            e.preventDefault();
            window.location.href = '/about';
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
                    <Link href={isLoggedIn ? '/about' : '/'} onClick={handleLogoClick} className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </Link>
                    <button className="bg-none border-none text-[1.8rem] text-[var(--text)] cursor-pointer" onClick={() => setSidebarOpen(false)}>&times;</button>
                </div>
                <ul className="list-none flex flex-col gap-5">
                    <li><Link href="/about" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>About</Link></li>
                    <li><Link href="/story-gallery" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Story Gallery</Link></li>
                    <li><Link href="/characters" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Characters</Link></li>
                    <li><Link href="/other-services" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Other Services</Link></li>
                    
                    {/* Track Order Link in Menu */}
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
                    
                    <Link href={isLoggedIn ? '/about' : '/'} onClick={handleLogoClick} className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
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

                        <button className="w-[44px] h-[44px] border border-[var(--glass-border)] rounded-full cursor-pointer bg-[var(--card)] text-[var(--text)] text-[1.2rem] flex items-center justify-center transition hover:scale-105 hover:border-[var(--accent3)]" onClick={toggleTheme}>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="max-w-[1200px] mx-auto p-[140px_30px_80px_30px] flex-1">
                <div className="text-center mb-[60px]">
                    <h1 className="text-[clamp(2.8rem,4vw,4rem)] font-bold mb-3">Meet the Characters</h1>
                    <p className="max-w-[600px] mx-auto opacity-85 text-[1.1rem]">
                        Discover the artists, alchemists, and dreamers who craft our tea blends and bring our illustrated worlds to life.
                    </p>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[30px]">
                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[24px] p-[30px] text-center backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-2 hover:shadow-[var(--shadow)]">
                        <div className="w-[120px] h-[120px] mx-auto mb-5 rounded-full bg-[var(--paper2)] border-2 border-[var(--accent3)] flex items-center justify-center text-[3.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                            🧙‍♀️
                        </div>
                        <h3 className="text-[2rem] font-bold mb-[6px]">Aria</h3>
                        <div className="text-[0.85rem] font-bold text-[var(--accent3)] uppercase tracking-[0.05em] mb-[14px]">Master Alchemist</div>
                        <p className="text-[0.95rem] opacity-85">Specializes in herbal infusions and botanical steeps. She spends her hours gathering rare mountain blossoms under full moons.</p>
                    </div>

                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[24px] p-[30px] text-center backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-2 hover:shadow-[var(--shadow)]">
                        <div className="w-[120px] h-[120px] mx-auto mb-5 rounded-full bg-[var(--paper2)] border-2 border-[var(--accent3)] flex items-center justify-center text-[3.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                            🎨
                        </div>
                        <h3 className="text-[2rem] font-bold mb-[6px]">Kaelen</h3>
                        <div className="text-[0.85rem] font-bold text-[var(--accent3)] uppercase tracking-[0.05em] mb-[14px]">The Lead Illustrator</div>
                        <p className="text-[0.95rem] opacity-85">Translates every flavor profile into detailed watercolor brushstrokes, capturing the spirit of each cup onto parchment.</p>
                    </div>

                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[24px] p-[30px] text-center backdrop-blur-[10px] transition-transform duration-350 hover:-translate-y-2 hover:shadow-[var(--shadow)]">
                        <div className="w-[120px] h-[120px] mx-auto mb-5 rounded-full bg-[var(--paper2)] border-2 border-[var(--accent3)] flex items-center justify-center text-[3.5rem] shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                            🦊
                        </div>
                        <h3 className="text-[2rem] font-bold mb-[6px]">Milo</h3>
                        <div className="text-[0.85rem] font-bold text-[var(--accent3)] uppercase tracking-[0.05em] mb-[14px]">The Tea Scout</div>
                        <p className="text-[0.95rem] opacity-85">A restless wanderer who journeys through distant valleys in search of heirloom tea leaves and forgotten harvesting secrets.</p>
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