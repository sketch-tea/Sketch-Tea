'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderStatusPage() {
    const params = useParams();
    
    // Safely extract from Next.js catch-all route array or string format
    const rawParam = params?.referenceCode;
    const rawRefCode = Array.isArray(rawParam) ? rawParam[0] : (rawParam || 'N/A');
    const referenceCode = decodeURIComponent(rawRefCode);

    const [loading, setLoading] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [customerName, setCustomerName] = useState('Valued Customer');
    
    // Order status states
    const [orderStatus, setOrderStatus] = useState('Payment Pending Verification');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Complete order history list state
    const [userOrders, setUserOrders] = useState([]);

    // Reusable fetch function to check the backend API for specific single status & complete history
    const fetchOrderStatus = useCallback(async (isManual = false) => {
        if (!referenceCode || referenceCode === 'N/A') return;
        
        if (isManual) setIsRefreshing(true);

        try {
            // 1. Fetch current single order status
            const res = await fetch(`/api/order-status?ref=${encodeURIComponent(referenceCode)}`);
            const contentType = res.headers.get("content-type");
            
            let fetchedEmail = '';
            let fetchedUserId = '';

            if (contentType && contentType.includes("application/json")) {
                const data = await res.json();
                if (data.success && data.status) {
                    setOrderStatus(data.status);
                    setLastUpdated(new Date().toLocaleTimeString());
                    if (data.contact_email) fetchedEmail = data.contact_email;
                    if (data.user_id) fetchedUserId = data.user_id;
                }
            }

            // 2. Fallback to localStorage email if API didn't return it
            if (!fetchedEmail) {
                const pendingOrder = localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder');
                if (pendingOrder) {
                    try {
                        const parsed = JSON.parse(pendingOrder);
                        if (parsed.email) fetchedEmail = parsed.email;
                    } catch (e) {}
                }
            }

            // 3. Fetch all orders strictly for this specific user/email using the correct singular endpoint
            if (fetchedEmail || fetchedUserId) {
                const queryParam = fetchedEmail ? `email=${encodeURIComponent(fetchedEmail)}` : `userId=${encodeURIComponent(fetchedUserId)}`;
                const historyRes = await fetch(`/api/user-orders?${queryParam}`);
                const historyContentType = historyRes.headers.get("content-type");

                if (historyContentType && historyContentType.includes("application/json")) {
                    const historyData = await historyRes.json();
                    if (historyData.success && historyData.orders) {
                        setUserOrders(historyData.orders);
                    }
                }
            }
        } catch (err) {
            console.error("Failed to sync order status and history:", err);
        } finally {
            if (isManual) {
                setTimeout(() => setIsRefreshing(false), 500);
            }
        }
    }, [referenceCode]);

    // Initial load: theme, customer name, and saved status
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
            document.body.classList.add('dark');
        }

        // Safely check localStorage for customer name and order details
        let nameToSet = 'Valued Customer';
        const pendingOrder = localStorage.getItem('pendingOrderData') || localStorage.getItem('pendingOrder');
        if (pendingOrder) {
            try {
                const parsed = JSON.parse(pendingOrder);
                if (parsed.fullName) {
                    nameToSet = parsed.fullName;
                }
                if (parsed.status) {
                    setOrderStatus(parsed.status);
                }
            } catch (e) {}
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser && nameToSet === 'Valued Customer') {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.name || userData.fullName) {
                    nameToSet = userData.name || userData.fullName;
                }
            } catch (e) {}
        }

        setCustomerName(nameToSet);

        // Fetch status right away and poll every 10 seconds
        fetchOrderStatus();
        const interval = setInterval(() => {
            fetchOrderStatus(false);
        }, 10000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [fetchOrderStatus]);

    // Manual refresh handler
    const handleManualRefresh = () => {
        fetchOrderStatus(true);
    };

    // Handler to clean state and start a new order
    const handleNewOrder = () => {
        localStorage.removeItem('generatedReferenceCode');
        localStorage.removeItem('pendingOrder');
        localStorage.removeItem('pendingOrderData');
        localStorage.removeItem('pendingReferenceFiles');
        
        window.location.href = '/other-services';
    };

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

    const isPaid = orderStatus.toLowerCase().includes('paid') || orderStatus.toLowerCase().includes('approved') || orderStatus.toLowerCase().includes('completed');

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

            <header className="fixed top-0 left-0 w-full z-[5000] backdrop-blur-[18px] bg-[var(--glass)] border-b border-[var(--glass-border)] shadow-[var(--shadow)]">
                <nav className="max-w-[1400px] mx-auto grid grid-cols-[1fr_auto_1fr] items-center p-[16px_30px]">
                    <div className="flex justify-start gap-3">
                        <Link href="/about" className="p-[10px_18px] rounded-xl border border-[var(--glass-border)] bg-[var(--card)] text-[0.9rem] font-semibold text-[var(--text)] transition hover:scale-105 hover:border-[var(--accent3)] no-underline">
                            ← Home
                        </Link>
                    </div>
                    <div className="flex justify-center">
                        <Link href="/about" className="font-serif text-[2.2rem] font-bold text-[var(--text)] no-underline">
                            Sketch <span className="text-[var(--accent3)]">Tea</span>
                        </Link>
                    </div>
                    <div className="flex justify-end items-center gap-3">
                        <button className="w-[44px] h-[44px] border border-[var(--glass-border)] rounded-full cursor-pointer bg-[var(--card)] text-[var(--text)] text-[1.2rem] flex items-center justify-center transition hover:scale-105 hover:border-[var(--accent3)]" onClick={toggleTheme}>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                    </div>
                </nav>
            </header>

            <div className="flex-1 flex flex-col bg-[image:var(--hero-gradient)]">
                <main className="max-w-[750px] mx-auto w-full p-[140px_30px_80px_30px] flex-1">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center p-[8px_18px] rounded-full bg-[rgba(46,204,113,0.15)] border border-[rgba(46,204,113,0.3)] mb-[18px] text-[0.85rem] font-bold text-[var(--success)]">
                            ✓ Order Submitted Successfully
                        </div>
                        <h1 className="text-[clamp(2.5rem,4vw,3.8rem)] font-bold mb-3">Live Order Tracker</h1>
                        <p className="opacity-85 text-[1.05rem]">Bookmark this page or check your email for updates. View your current selection and entire order history below.</p>
                    </div>

                    {/* Current Selected Reference Card */}
                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] backdrop-blur-[20px] shadow-[var(--shadow)] mb-10">
                        <div className="mb-6 p-4 rounded-2xl bg-[var(--paper2)] border border-[var(--glass-border)] text-center">
                            <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Active Reference Code</div>
                            <div className="font-mono font-bold text-[1.4rem] text-[var(--accent3)]">{referenceCode}</div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between items-center pb-3 border-b border-[var(--glass-border)]">
                                <span className="opacity-75">Current Status</span>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${isPaid ? 'bg-[rgba(46,204,113,0.15)] text-[var(--success)]' : 'bg-[rgba(255,159,28,0.15)] text-[var(--accent3)]'}`}>
                                        {orderStatus}
                                    </span>
                                    <button
                                        onClick={handleManualRefresh}
                                        disabled={isRefreshing}
                                        className="text-xs px-2.5 py-1 rounded-lg border border-[var(--glass-border)] bg-[var(--paper)] hover:border-[var(--accent3)] transition flex items-center gap-1 cursor-pointer"
                                        title="Check for updates"
                                    >
                                        <span className={`inline-block ${isRefreshing ? 'animate-spin' : ''}`}>
                                            🔄
                                        </span>
                                        {isRefreshing ? '...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-[var(--glass-border)]">
                                <span className="opacity-75">Customer Name</span>
                                <span className="font-semibold">{customerName}</span>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-[var(--glass-border)]">
                                <span className="opacity-75">Order Details</span>
                                <span className="font-semibold truncate max-w-[250px]">Custom Request</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-[var(--paper2)] border border-[var(--glass-border)] text-[0.85rem] opacity-85 leading-relaxed">
                            💡 <strong>What happens next?</strong> An email confirmation has been dispatched to your inbox containing this direct tracker link. You can bookmark this URL to check back here anytime!
                            {lastUpdated && <span className="block text-[10px] opacity-40 mt-2">Last checked: {lastUpdated}</span>}
                        </div>
                    </div>

                    {/* Complete Order History Section */}
                    <div className="bg-[var(--card)] border border-[var(--glass-border)] rounded-[28px] p-[35px_32px] backdrop-blur-[20px] shadow-[var(--shadow)]">
                        <h3 className="text-[1.8rem] font-bold mb-4">Your Complete Order History</h3>
                        <p className="text-[0.95rem] opacity-75 mb-6">Here are all your previous and active orders linked to your profile:</p>

                        {userOrders.length === 0 ? (
                            <p className="text-sm opacity-60 italic">Loading or no other orders found...</p>
                        ) : (
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                {userOrders.map((order) => {
                                    const isThisOrderActive = order.reference_code === referenceCode;
                                    const orderIsPaid = order.status.toLowerCase().includes('paid') || order.status.toLowerCase().includes('approved') || order.status.toLowerCase().includes('completed');
                                    
                                    return (
                                        <div 
                                            key={order.id} 
                                            className={`p-4 rounded-xl border transition-all ${isThisOrderActive ? 'border-[var(--accent3)] bg-[var(--paper2)]' : 'border-[var(--glass-border)] bg-[var(--paper)]'}`}
                                        >
                                            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                                                <span className="font-mono font-bold text-[var(--accent3)]">{order.reference_code}</span>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${orderIsPaid ? 'bg-[rgba(46,204,113,0.15)] text-[var(--success)]' : 'bg-[rgba(255,159,28,0.15)] text-[var(--accent3)]'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-xs opacity-80 mb-2 line-clamp-1"><strong>Ideas:</strong> {order.design_ideas || 'Custom design request'}</p>
                                            <div className="flex justify-between items-center text-[11px] opacity-50 pt-2 border-t border-[var(--glass-border)]">
                                                <span>Placed: {order.created_at ? new Date(order.created_at).toLocaleString() : 'Recent'}</span>
                                                <a 
                                                    href={`/order-status/${order.reference_code}`} 
                                                    className="font-bold text-[var(--accent3)] hover:underline"
                                                >
                                                    View Details →
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Make a New Order Action Section */}
                    <div className="mt-8 text-center">
                        <p className="text-[0.95rem] opacity-85 mb-4">Done tracking or ready for another project?</p>
                        <button 
                            onClick={handleNewOrder}
                            className="px-6 py-3 bg-[var(--accent3)] text-white font-bold rounded-xl shadow-[0_8px_20px_rgba(255,159,28,0.3)] transition-all hover:scale-105 hover:bg-[#e58a0f] cursor-pointer"
                        >
                            ✨ Make a New Order?
                        </button>
                    </div>
                </main>

                <footer className="text-center p-[30px] border-t border-[var(--glass-border)] text-[0.85rem] opacity-80 mt-auto">
                    <p>&copy; 2026 Sketch Tea Co. All Rights Reserved.</p>
                </footer>
            </div>
        </div>
    );
}