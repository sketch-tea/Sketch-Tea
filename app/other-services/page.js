'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function OtherServicesPage() {
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [referenceCode, setReferenceCode] = useState('');

    // Form States
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [ideas, setIdeas] = useState('');
    const [fileName, setFileName] = useState('');
    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
    const [submitting, setSubmitting] = useState(false);

    const submittingRef = useRef(false);
    const fileInputRef = useRef(null);

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

        const pendingData = localStorage.getItem('pendingOrderData');
        const savedUser = localStorage.getItem('user');

        if (pendingData) {
            try {
                const data = JSON.parse(pendingData);
                if (data.fullName) setFullName(data.fullName);
                if (data.email) setEmail(data.email);
                if (data.ideas) setIdeas(data.ideas);
            } catch (e) {}
        } else if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.email) setEmail(userData.email);
                if (userData.name) setFullName(userData.name);
            } catch (e) {}
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

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setFileName(`Selected: ${e.target.files.length} file(s)`);
        } else {
            setFileName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (submittingRef.current) return;
        submittingRef.current = true;

        setStatusMessage({ text: '', type: '' });

        const authStatus = localStorage.getItem('isLoggedIn');

        if (authStatus !== 'true') {
            const formDataObj = { fullName, email, ideas };
            localStorage.setItem('pendingOrderData', JSON.stringify(formDataObj));

            setStatusMessage({
                text: "Please sign in first. Your order draft has been saved!",
                type: "error"
            });

            setTimeout(() => {
                window.location.href = '/?redirect=other-services';
            }, 1200);
            return;
        }

        setSubmitting(true);

        try {
            const orderData = {
                fullName: fullName.trim(),
                email: email.trim(),
                ideas: ideas.trim(),
            };
            localStorage.setItem('pendingOrderData', JSON.stringify(orderData));

            if (fileInputRef.current && fileInputRef.current.files.length > 0) {
                const files = fileInputRef.current.files;
                const fileReaders = [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    fileReaders.push(new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (uploadEvent) => {
                            resolve({
                                name: file.name,
                                type: file.type,
                                data: uploadEvent.target.result
                            });
                        };
                        reader.readAsDataURL(file);
                    }));
                }

                const base64Files = await Promise.all(fileReaders);
                localStorage.setItem('pendingReferenceFiles', JSON.stringify(base64Files));
            } else {
                localStorage.removeItem('pendingReferenceFiles');
            }

            setStatusMessage({
                text: "Details saved! Redirecting to payment options...",
                type: "success"
            });

            setTimeout(() => {
                window.location.href = '/payment-methods?service=other-services';
            }, 1000);

        } catch (err) {
            console.error('Submission error:', err);
            setStatusMessage({
                text: err.message || "Failed to process. Please try again.",
                type: "error"
            });
            submittingRef.current = false;
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
                    --accent3: #FF9F1C;
                    --glass: ${isDark ? 'rgba(18, 43, 42, 0.95)' : 'rgba(255, 255, 255, 0.90)'};
                    --glass-border: ${isDark ? 'rgba(203, 243, 240, 0.20)' : 'rgba(46, 196, 182, 0.25)'};
                    --shadow: ${isDark ? '0 25px 60px rgba(0, 0, 0, 0.50)' : '0 20px 50px rgba(46, 196, 182, 0.12)'};
                    --hero-gradient: ${isDark ? 'linear-gradient(135deg, #122b2a 0%, #0c1f1e 50%, #153332 100%)' : 'linear-gradient(135deg, #FFFFFF 0%, #f0faf9 50%, #e6f7f5 100%)'};
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
                    
                    {/* Track Order Link in Mobile Menu */}
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

                    {/* Right Actions (Track Order & Theme Toggle) */}
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

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col bg-[image:var(--hero-gradient)]">
                <main className="max-w-[700px] mx-auto w-full p-[140px_30px_80px_30px] flex-1">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center p-[8px_18px] rounded-full bg-[var(--card)] border border-[var(--glass-border)] mb-[18px] text-[0.85rem] font-bold text-[var(--accent3)]">
                            ✦ Custom Branding Services
                        </div>
                        <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold mb-3">Logo Design Request</h1>
                        <p className="opacity-85 text-[1.05rem]">Describe your brand vision below to order custom artwork and bespoke logo designs.</p>
                    </div>

                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] backdrop-blur-[20px] shadow-[var(--shadow)]">
                        {statusMessage.text && (
                            <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-5 text-center font-semibold ${statusMessage.type === 'error' ? 'bg-[rgba(231,76,60,0.15)] text-[var(--error)] border border-[rgba(231,76,60,0.3)]' : 'bg-[rgba(46,204,113,0.15)] text-[var(--success)] border border-[rgba(46,204,113,0.3)]'}`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-[22px]">
                                <label htmlFor="fullName" className="block font-semibold mb-2 text-[0.95rem]">Full Name</label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required 
                                    placeholder="John Doe"
                                    className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                                />
                            </div>

                            <div className="mb-[22px]">
                                <label htmlFor="email" className="block font-semibold mb-2 text-[0.95rem]">Gmail Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                    placeholder="your.email@gmail.com"
                                    className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)]"
                                />
                            </div>

                            <div className="mb-[22px]">
                                <label htmlFor="ideas" className="block font-semibold mb-2 text-[0.95rem]">Design Ideas & Details</label>
                                <textarea 
                                    id="ideas" 
                                    name="ideas" 
                                    rows="5" 
                                    value={ideas}
                                    onChange={(e) => setIdeas(e.target.value)}
                                    required 
                                    placeholder="Describe your brand concepts, color preferences, and artistic style..."
                                    className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none transition focus:border-[var(--accent3)] focus:ring-2 focus:ring-[rgba(255,159,28,0.2)] resize-y"
                                ></textarea>
                            </div>

                            <div className="mb-[22px]">
                                <label className="block font-semibold mb-2 text-[0.95rem]">Reference Pictures (Optional)</label>
                                <label 
                                    htmlFor="reference_file"
                                    className="relative flex flex-col items-center justify-center border-2 border-dashed border-[var(--glass-border)] rounded-[16px] p-6 text-center bg-[var(--paper2)] cursor-pointer transition hover:border-[var(--accent3)] hover:bg-[var(--card)] block w-full"
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        id="reference_file" 
                                        name="reference_file" 
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="sr-only"
                                    />
                                    <div className="text-[0.9rem] opacity-80 pointer-events-none">📷 Drag & drop images here or click anywhere to browse (multiple files allowed)</div>
                                    {fileName && <div className="mt-2 text-[0.85rem] font-bold text-[var(--accent3)] pointer-events-none">{fileName}</div>}
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full p-4 rounded-full border-none bg-[var(--accent3)] text-white text-[1rem] font-bold cursor-pointer transition hover:bg-[#e58a0f] hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(255,159,28,0.35)] mt-[10px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {submitting ? 'Saving...' : 'Proceed to Payment Options'}
                            </button>
                        </form>
                    </div>
                </main>

                <footer className="text-center p-[30px] border-t border-[var(--glass-border)] text-[0.85rem] opacity-80 mt-auto">
                    <p>&copy; 2026 Sketch Tea Co. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
}