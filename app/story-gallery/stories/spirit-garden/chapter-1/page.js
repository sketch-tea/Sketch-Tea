'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SpiritGardenChapter1() {
    const router = useRouter();
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
        router.push('/');
    };

    const handleLogoClick = (e) => {
        e.preventDefault();
        if (localStorage.getItem('isLoggedIn') === 'true') {
            router.push('/about');
        } else {
            router.push('/');
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
                    <a href="#" onClick={handleLogoClick} className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </a>
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
                    
                    <a href="#" onClick={handleLogoClick} className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                        Sketch <span className="text-[var(--accent3)]">Tea</span>
                    </a>

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

            {/* Main Content / Chapter Reader */}
            <main className="max-w-[800px] mx-auto p-[140px_30px_80px_30px] flex-1">
                <div className="mb-8">
                    <Link href="/story-gallery/stories/spirit-garden" className="no-underline text-[var(--accent3)] font-semibold text-[0.9rem] flex items-center gap-2 mb-4">
                        ← Back to Spirit Garden Overview
                    </Link>
                    <span className="block font-bold text-[0.75rem] uppercase text-[var(--accent3)] mb-2 tracking-[0.05em]">Chapter I • Botanical Realm</span>
                    <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-bold mb-4 leading-tight">The Awakening Seedling</h1>
                    <p className="text-sm opacity-70 italic">Setting: The Mist-Veiled Greenhouse at Dawn</p>
                </div>

                <hr className="border-0 h-[1px] bg-[var(--glass-border)] mb-8" />

                {/* Creative Story Prose */}
                <div className="flex flex-col gap-6 text-[1.15rem] leading-relaxed opacity-95 font-serif">
                    <p className="first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[var(--accent3)]">
                        Dawn does not merely arrive in the high-altitude glasshouses; it unfurls like a wet watercolor wash across gray linen. At four hundred meters above the valley floor, the world was still choked in a quiet, mother-of-pearl fog that tasted faintly of crushed pine needles and damp slate.
                    </p>

                    <p>
                        Master Julian sat motionless at his scarred cedar workbench, his fingers curled around a porcelain cup of yesterday&apos;s cooling white tea. Before him sat a single, unassuming terracotta pot filled with rich forest loam. For three weeks, it had held nothing save for the phantom scent of morning dew and his own quiet doubts.
                    </p>

                    <p>
                        Then, the soil sighed.
                    </p>

                    <p>
                        It wasn&apos;t a sound heard with the ears, but a low, rhythmic thrum felt deep within the marrow of the wrists—a vibration akin to a cello string plucked in an empty cathedral. 
                    </p>

                    <blockquote className="border-l-2 border-[var(--accent3)] pl-4 my-4 italic text-base opacity-85">
                        &ldquo;Slowly now,&rdquo; Julian whispered into the steam of his cup, his charcoal pencil hovering above the cream-colored pages of his journal like a dragonfly over a pond.
                    </blockquote>

                    <p>
                        A single shoot fractured the crust of the earth. But it did not burst forth in ordinary shades of chlorophyll green. Instead, it rose clad in a shimmering, translucent amber—a filament of liquid light that seemed to drink the shadows straight out of the corners of the room. As the first sharp needle of golden sunlight pierced the frosted glass above, hitting the tip of the tiny stem, the leaves blossomed outward in a silent cascade of crystal petals.
                    </p>

                    <p>
                        A scent bloomed instantly on the air: sweet white peach, frost-bitten mint, and something ancient—the rich, untamed breath of a forest that had never known an axe. The seedling wasn&apos;t just growing; it was singing its first note.
                    </p>

                    <p>
                        Julian dipped his brush into the inkwell, his heart keeping time with the plant&apos;s quiet pulse. The garden was waking up, and the harvest of dreams had officially begun.
                    </p>
                </div>

                {/* Footer Navigation within the Chapter */}
                <div className="mt-16 pt-8 border-t border-[var(--glass-border)] flex justify-between items-center">
                    <Link href="/story-gallery/stories/spirit-garden" className="no-underline text-[var(--text)] opacity-80 hover:opacity-100 font-semibold text-[0.9rem]">
                        ← Series Overview
                    </Link>
                    
                    {/* Added Chapter 2 Link */}
                    <Link href="/story-gallery/stories/spirit-garden/chapter-2" className="no-underline text-[var(--accent3)] font-semibold text-[0.95rem] flex items-center gap-2 hover:opacity-85 transition">
                        Chapter II: The Resonance of Leaves →
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