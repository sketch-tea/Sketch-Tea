'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PaymentMethodsPage() {
    const [isDark, setIsDark] = useState(true);
    const [copied, setCopied] = useState(false);
    const [referenceCode, setReferenceCode] = useState('LOADING...');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            setIsDark(false);
            document.body.classList.remove('dark');
        } else {
            setIsDark(true);
            document.body.classList.add('dark');
        }

        async function fetchOrderReference() {
            const userStored = localStorage.getItem('user');

            if (!userStored) {
                setReferenceCode('LOGIN-REQUIRED');
                return;
            }

            let userName = 'USER';
            try {
                if (userStored.startsWith('{')) {
                    const parsed = JSON.parse(userStored);
                    userName = parsed.name || parsed.username || 'USER';
                } else {
                    userName = userStored;
                }
            } catch (e) {
                userName = userStored;
            }

            // Clean the name, split into words, and grab first/last name to prevent giant codes
            const nameParts = userName.trim().split(/\s+/);
            let shortName = nameParts[0];
            if (nameParts.length > 1) {
                const lastName = nameParts[nameParts.length - 1];
                shortName = `${nameParts[0]}-${lastName}`;
            }

            let finalCode = '';
            try {
                const res = await fetch('/api/next-order-id');
                const data = await res.json();
                const nextId = data.success ? data.nextId : 1;
                
                const paddedNum = String(nextId).padStart(4, '0');
                finalCode = `ST-${shortName.toUpperCase()} - ${paddedNum}`;
            } catch (err) {
                finalCode = `ST-${shortName.toUpperCase()} - 0001`;
            }

            setReferenceCode(finalCode);

            // Automatically sync reference code to localStorage for the submit page
            localStorage.setItem('generatedReferenceCode', finalCode);

            let existingPending = {};
            try {
                existingPending = JSON.parse(localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder') || '{}');
            } catch (e) {}

            const updatedPending = {
                ...existingPending,
                referenceCode: finalCode,
                refCode: finalCode
            };

            localStorage.setItem('pendingOrderData', JSON.stringify(updatedPending));
        }

        fetchOrderReference();
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

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDark ? 'dark bg-[#122b2a] text-white' : 'bg-[#FFFFFF] text-[#114b46]'}`}>
            <style jsx global>{`
                :root {
                    --paper: ${isDark ? '#122b2a' : '#FFFFFF'};
                    --card: ${isDark ? 'rgba(18, 43, 42, 0.85)' : 'rgba(203, 243, 240, 0.35)'};
                    --text: ${isDark ? '#FFFFFF' : '#114b46'};
                    --accent3: #FF9F1C;
                    --glass: ${isDark ? 'rgba(18, 43, 42, 0.95)' : 'rgba(255, 255, 255, 0.90)'};
                    --glass-border: ${isDark ? 'rgba(203, 243, 240, 0.20)' : 'rgba(46, 196, 182, 0.25)'};
                    --shadow: ${isDark ? '0 25px 60px rgba(0, 0, 0, 0.50)' : '0 20px 50px rgba(46, 196, 182, 0.12)'};
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

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                <nav className="max-w-[1400px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center p-[16px_30px]">
                    <div className="flex justify-start">
                        <Link href="/" className="p-[10px_18px] rounded-xl border border-[var(--glass-border)] bg-[var(--card)] text-[0.9rem] font-semibold transition hover:scale-105 no-underline">
                            ← Home
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <Link href="/" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                            Sketch <span className="text-[var(--accent3)]">Tea</span>
                        </Link>
                    </div>
                    <div className="flex justify-end">
                        <button 
                            className="w-[44px] h-[44px] border border-[var(--glass-border)] rounded-full cursor-pointer bg-[var(--card)] text-[var(--text)] text-[1.2rem] flex items-center justify-center transition hover:scale-105 hover:border-[var(--accent3)]" 
                            onClick={toggleTheme}
                            aria-label="Toggle Theme"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-[140px_20px_60px_20px]">
                <div className={`w-full max-w-[620px] backdrop-blur-[20px] border rounded-[28px] p-[40px_32px] shadow-[var(--shadow)] bg-[var(--card)] border-[var(--glass-border)]`}>
                    
                    <div className="text-center mb-8">
                        <div className="inline-block px-5 py-2 bg-[var(--accent3)] text-white font-bold rounded-full text-base mb-4 shadow-lg">
                            💳 Amount Due: $5.00 USD
                        </div>
                        <h1 className="text-[2.6rem] font-bold font-serif text-[var(--accent3)] leading-tight">Wise Bank Transfer</h1>
                        <p className="text-sm opacity-90 mt-2">Transfer your **$5.00** directly and include your unique reference code in your transfer note.</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="p-4 rounded-xl border-2 border-[var(--accent3)] bg-[var(--paper)]">
                            <span className="block text-xs uppercase tracking-wider text-[var(--accent3)] font-bold mb-1">
                                ⚠️ Your Unique Reference Code (Must include in transfer note)
                            </span>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-mono font-bold text-xl tracking-wider text-[var(--accent3)]">{referenceCode}</span>
                                <button 
                                    onClick={() => handleCopy(referenceCode)}
                                    className="text-xs px-3.5 py-2 rounded-lg bg-[var(--accent3)] text-white font-bold hover:opacity-90 transition shadow"
                                >
                                    Copy Code
                                </button>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--paper)]">
                            <span className="block text-xs uppercase tracking-wider opacity-60 mb-1">Wise Email / Account Number</span>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-base">[ Enter Wise Email or Account # ]</span>
                                <button 
                                    onClick={() => handleCopy("YOUR_ACCOUNT_INFO_HERE")}
                                    className="text-xs px-3.5 py-2 rounded-lg bg-[var(--glass-border)] text-[var(--text)] font-bold hover:opacity-90 transition"
                                >
                                    Copy Account
                                </button>
                            </div>
                        </div>
                    </div>

                    {copied && (
                        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 text-green-400 text-center rounded-xl text-sm font-semibold">
                            Copied to clipboard!
                        </div>
                    )}

                    <div className="p-4 mb-6 rounded-xl bg-[var(--accent3)]/10 border border-[var(--accent3)]/30 text-center">
                        <p className="text-xs font-semibold leading-relaxed text-[var(--text)]">
                            📌 <span className="text-[var(--accent3)] font-bold">Once you complete the $5.00 payment</span> via Wise using your reference code, proceed to the next page where your reference code will already be filled in automatically.
                        </p>
                    </div>

                    <div className="text-center">
                        <Link href="/other-services/submit" className="inline-block w-full py-4 px-6 rounded-full font-bold text-lg bg-[var(--accent3)] text-white hover:opacity-90 transition shadow-xl no-underline">
                            I Have Sent the $5.00 Payment (Proceed to Order Services)
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}