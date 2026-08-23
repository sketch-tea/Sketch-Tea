'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function SubmitOrderPage() {
    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [referenceCode, setReferenceCode] = useState('');
    const [paymentFileName, setPaymentFileName] = useState('');
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

        // Grab email from profile or pending order
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.email) setEmail(userData.email);
            } catch (e) {}
        }

        const pendingOrder = localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder');
        let parsedOrder = {};
        if (pendingOrder) {
            try {
                parsedOrder = JSON.parse(pendingOrder);
                if (parsedOrder.email && !email) setEmail(parsedOrder.email);
            } catch (e) {}
        }

        // Capture reference code if generated ahead of time, or let the backend generate it
        const exactGeneratedRef = localStorage.getItem('generatedReferenceCode');
        const generatedRef = exactGeneratedRef || parsedOrder.referenceCode || parsedOrder.refCode || '';
        setReferenceCode(generatedRef);

        return () => clearTimeout(timer);
    }, [email]);

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

    const handleLogoClick = (e) => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            e.preventDefault();
            window.location.href = '/about';
        }
    };

    const handlePaymentFileChange = (e) => {
        if (e.target.files.length > 0) {
            setPaymentFileName(`Selected: ${e.target.files[0].name}`);
        } else {
            setPaymentFileName('');
        }
    };

    const dataURLtoFile = (dataurl, filename) => {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        } catch (e) {
            return null;
        }
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        if (submittingRef.current) return;
        submittingRef.current = true;

        setStatusMessage({ text: '', type: '' });
        setSubmitting(true);

        const pendingOrderData = JSON.parse(localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder') || '{}');

        try {
            const formData = new FormData();
            formData.append('email', email);
            if (referenceCode) {
                formData.append('referenceCode', referenceCode);
            }
            formData.append('ideas', pendingOrderData.ideas || pendingOrderData.details || '');
            formData.append('fullName', pendingOrderData.fullName || 'Valued Customer');
            formData.append('address', pendingOrderData.address || 'N/A');

            if (fileInputRef.current && fileInputRef.current.files.length > 0) {
                formData.append('reference_file', fileInputRef.current.files[0]);
            }

            const savedRefFiles = localStorage.getItem('pendingReferenceFiles');
            if (savedRefFiles) {
                try {
                    const parsedFiles = JSON.parse(savedRefFiles);
                    parsedFiles.forEach((fileObj, idx) => {
                        const convertedFile = dataURLtoFile(fileObj.data, fileObj.name || `reference-pic-${idx + 1}.png`);
                        if (convertedFile) {
                            formData.append('reference_file', convertedFile);
                        }
                    });
                } catch (err) {
                    console.error('Error parsing saved reference files:', err);
                }
            }

            // Updated to match your backend POST route path (e.g., /api/order-service)
            const response = await fetch('/api/order-service', {  
                method: 'POST',  
                body: formData  
            });

            const result = await response.json();

            if (result.success) {
                const finalRefCode = result.referenceCode || referenceCode;
                
                setStatusMessage({
                    text: "Order successfully submitted! Redirecting to your live tracker...",
                    type: "success"
                });

                setTimeout(() => {
                    localStorage.removeItem('pendingOrder');
                    localStorage.removeItem('pendingOrderData');
                    localStorage.removeItem('pendingReferenceFiles');
                    localStorage.setItem('generatedReferenceCode', finalRefCode);
                    
                    // Redirect directly to the live tracker page using the reference code
                    window.location.href = `/order-status/${finalRefCode}`;
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to submit order.');
            }

        } catch (err) {
            setStatusMessage({
                text: err.message || 'Something went wrong. Please try again.',
                type: 'error'
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

            <div className={`fixed inset-0 flex justify-center items-center flex-col gap-5 bg-[var(--paper)] z-[99999] transition-opacity duration-600 ${loading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                <div className="w-[70px] h-[70px] rounded-full border-4 border-[var(--glass-border)] border-t-[var(--accent3)] animate-spin"></div>
                <div className="font-serif text-[54px] font-bold text-[var(--text)]">Sketch <span style={{color: 'var(--accent3)'}}>Tea</span></div>
            </div>

            <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                <nav className="max-w-[1400px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center p-[16px_30px]">
                    <div className="flex justify-start">
                        <Link href="/payment-methods?service=other-services" className="p-[10px_18px] rounded-xl border border-[var(--glass-border)] bg-[var(--card)] text-[0.9rem] font-semibold text-[var(--text)] transition hover:scale-105 hover:border-[var(--accent3)] no-underline">
                            ← Back
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <Link href={isLoggedIn ? '/about' : '/'} onClick={handleLogoClick} className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                            Sketch <span className="text-[var(--accent3)]">Tea</span>
                        </Link>
                    </div>
                    <div className="flex justify-end">
                        <button className="w-[44px] h-[44px] border border-[var(--glass-border)] rounded-full cursor-pointer bg-[var(--card)] text-[var(--text)] text-[1.2rem] flex items-center justify-center transition hover:scale-105 hover:border-[var(--accent3)]" onClick={toggleTheme}>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            <div className="flex-1 flex flex-col bg-[image:var(--hero-gradient)]">
                <main className="max-w-[700px] mx-auto w-full p-[140px_30px_80px_30px] flex-1">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center p-[8px_18px] rounded-full bg-[var(--card)] border border-[var(--glass-border)] mb-[18px] text-[0.85rem] font-bold text-[var(--accent3)]">
                            ✦ Payment & Verification
                        </div>
                        <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold mb-3">Submit Order</h1>
                        <p className="opacity-85 text-[1.05rem]">Your payment reference code is auto-attached. You can optionally upload your Wise payment screenshot below.</p>
                    </div>

                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] backdrop-blur-[20px] shadow-[var(--shadow)]">
                        {statusMessage.text && (
                            <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-5 text-center font-semibold ${statusMessage.type === 'error' ? 'bg-[rgba(231,76,60,0.15)] text-[var(--error)] border border-[rgba(231,76,60,0.3)]' : 'bg-[rgba(46,204,113,0.15)] text-[var(--success)] border border-[rgba(46,204,113,0.3)]'}`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmitOrder}>
                            <div className="mb-[22px]">
                                <label htmlFor="email" className="block font-semibold mb-2 text-[0.95rem]">Gmail Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email} 
                                    disabled 
                                    className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] opacity-70 text-[var(--text)] text-[0.95rem] cursor-not-allowed"
                                />
                            </div>

                            <div className="mb-[22px]">
                                <label htmlFor="referenceCode" className="block font-semibold mb-2 text-[0.95rem]">Generated Payment Reference Code</label>
                                <input 
                                    type="text" 
                                    id="referenceCode" 
                                    value={referenceCode} 
                                    disabled 
                                    className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] font-mono font-bold text-[var(--accent3)] text-[1rem] opacity-90 cursor-not-allowed"
                                />
                            </div>

                            <div className="mb-[22px]">
                                <label className="block font-semibold mb-2 text-[0.95rem]">
                                    Wise Payment Proof Screenshot <span className="opacity-60 text-xs font-normal">(Optional)</span>
                                </label>
                                <div className="relative border-2 border-dashed border-[var(--glass-border)] rounded-[16px] p-6 text-center bg-[var(--paper2)] cursor-pointer transition hover:border-[var(--accent3)]">
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handlePaymentFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                    <div className="text-[0.9rem] opacity-80">📷 Upload your Wise transfer receipt screenshot here (Optional)</div>
                                    {paymentFileName && <div className="mt-2 text-[0.85rem] font-bold text-[var(--accent3)]">{paymentFileName}</div>}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                className="w-full p-4 rounded-full border-none bg-[var(--accent3)] text-white text-[1rem] font-bold cursor-pointer transition hover:bg-[#e58a0f] hover:-translate-y-0.5 shadow-[0_10px_25px_rgba(255,159,28,0.35)] mt-[10px] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Submitting Order...' : 'Submit Order'}
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