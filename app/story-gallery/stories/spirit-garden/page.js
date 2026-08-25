'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SpiritGardenOverview() {
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
                            <span className="text-[var(--text)] text-[1.1rem] font-semibold opacity-40 cursor-not-allowed flex items-center gap-2">
                                Track Order <span className="text-[0.75rem] font-normal">(No active order)</span>
                            </span>
                        )}
                    </li>

                    <li><Link href="/contact" className="no-underline text-[var(--text)] text-[1.1rem] font-semibold hover:text-[var(--accent3)] transition" onClick={() => setSidebarOpen(false)}>Contact</Link></li>
                    
                    {isLoggedIn && (
                        <li><a href="#" onClick={handleLogout} className="no-underline text-[var(--error)] text-[1.1rem] font-semibold transition">Log Out</a></li>
                    )}
                </ul>
            </aside>

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                <nav className="max-w-[1400px] mx-auto flex items-center justify-between p-[16px_30px]">
                    <button className="bg-none border-none cursor-pointer flex flex-col gap-[5px] p-2 z-[5001]" onClick={() => setSidebarOpen(true)} aria-label="Open Navigation Menu">
                        <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                        <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                        <span className="block w-[28px] h-[3px] bg-[var(--text)] rounded-[3px]"></span>
                    </button>
                    
                    <Link href={isLoggedIn ? '/about' : '/'} onClick={handleLogoClick} className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </Link>

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
                                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--card)] text-[var(--text)] text-[0.85rem] font-semibold opacity-40 cursor-not-allowed select-none"
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

            {/* Main Content / Overview */}
            <main className="max-w-[900px] mx-auto p-[140px_30px_80px_30px] flex-1">
                <div className="mb-6">
                    <Link href="/story-gallery" className="no-underline text-[var(--accent3)] font-semibold text-[0.9rem] flex items-center gap-2 mb-4">
                        ← Back to Story Gallery
                    </Link>
                    <span className="block font-bold text-[0.75rem] uppercase text-[var(--accent3)] mb-2 tracking-[0.05em]">Series Overview</span>
                    <h1 className="text-[clamp(2.8rem,4.5vw,4rem)] font-bold mb-4 leading-tight">The Spirit Garden</h1>
                    <p className="text-[1.2rem] opacity-80 leading-relaxed font-serif">
                        High above the valley floor in mist-veiled glasshouses, botanical realms pulse with ancient energies, crystal flora, and whispered secrets waiting to be drawn.
                    </p>
                </div>

                <hr className="border-0 h-[1px] bg-[var(--glass-border)] mb-10" />

                {/* Synopsis / Details */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] flex flex-col justify-between">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-2">Setting</span>
                            <h3 className="text-xl font-bold mb-2">High-Altitude Glasshouses</h3>
                            <p className="text-sm opacity-80">A sanctuary wrapped in pine scents, damp slate, and frost-bitten morning air.</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] flex flex-col justify-between">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-2">Core Theme</span>
                            <h3 className="text-xl font-bold mb-2">Awakening & Creation</h3>
                            <p className="text-sm opacity-80">Exploring the fragile boundary between botanical science and living magic.</p>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] flex flex-col justify-between">
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-2">Format</span>
                            <h3 className="text-xl font-bold mb-2">Episodic Chapters</h3>
                            <p className="text-sm opacity-80">Read through illustrated narrative entries crafted with charcoal and ink aesthetics.</p>
                        </div>
                    </div>
                </div>

                {/* Chapters Section */}
                <h2 className="text-2xl font-bold mb-6">Available Chapters</h2>
                <div className="flex flex-col gap-4">
                    <Link 
                        href="/story-gallery/stories/spirit-garden/chapter-1" 
                        className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] hover:border-[var(--accent3)] transition flex items-center justify-between no-underline text-[var(--text)] group"
                    >
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-1">Chapter I</span>
                            <h3 className="text-2xl font-bold group-hover:text-[var(--accent3)] transition">The Awakening Seedling</h3>
                            <p className="text-sm opacity-70 mt-1">Master Julian sits at his cedar workbench as a mysterious amber shoot breaks through the forest loam.</p>
                        </div>
                        <span className="text-xl font-bold text-[var(--accent3)]">Read →</span>
                    </Link>

                    <Link 
                        href="/story-gallery/stories/spirit-garden/chapter-2" 
                        className="p-6 rounded-2xl bg-[var(--card)] border border-[var(--glass-border)] hover:border-[var(--accent3)] transition flex items-center justify-between no-underline text-[var(--text)] group"
                    >
                        <div>
                            <span className="text-xs uppercase tracking-widest text-[var(--accent3)] font-bold block mb-1">Chapter II</span>
                            <h3 className="text-2xl font-bold group-hover:text-[var(--accent3)] transition">The Resonance of Leaves</h3>
                            <p className="text-sm opacity-70 mt-1">Master Julian and Elena harvest the first amber leaf as it hums with bioluminescent energy.</p>
                        </div>
                        <span className="text-xl font-bold text-[var(--accent3)]">Read →</span>
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-center p-[30px] border-t border-[var(--glass-border)] text-[0.85rem] opacity-80 mt-auto">
                <p>&copy; 2026 Sketch Tea Co. All Rights Reserved.</p>
            </footer>
        </div>
    );
}