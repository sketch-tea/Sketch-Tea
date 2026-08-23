'use client';

import { useState } from 'react';

export default function PaymentPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        address: '',
        paymentMethod: 'wise'
    });
    const [status, setStatus] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', text: '' });
        setIsSubmitting(true);
        setStatus({ type: '', text: 'Processing Order & Generating Instructions...' });

        try {
            // Retrieve previous order info stored locally from the previous page
            const pendingOrder = JSON.parse(localStorage.getItem('pendingOrder') || '{}');
            
            // Combine form data with saved order data
            const finalOrderData = {
                ...pendingOrder,
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                address: formData.address.trim(),
                paymentMethod: formData.paymentMethod
            };

            // Send data to your backend API endpoint which saves the order and triggers the email
            const response = await fetch('/api/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finalOrderData)
            });

            const result = await response.json();

            if (response.ok && result.success && result.url) {
                setStatus({
                    type: 'success',
                    text: 'Order placed successfully! Redirecting...'
                });

                // Clear local temporary cache
                localStorage.removeItem('pendingOrder');

                // Redirect the user straight to the success page containing the bank details
                window.location.href = result.url;
            } else {
                setStatus({
                    type: 'error',
                    text: result.message || 'Could not process order. Please try again.'
                });
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Payment processing error:', err);
            setStatus({
                type: 'error',
                text: 'Network error connecting to server. Please check your connection.'
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="font-['Manrope',sans-serif] bg-[#122b2a] text-white min-h-screen flex flex-col items-center justify-center p-[40px_20px]">
            <style jsx global>{`
                :root {
                    --paper: #122b2a;
                    --card: rgba(18, 43, 42, 0.85);
                    --text: #FFFFFF;
                    --accent3: #FF9F1C;
                    --glass-border: rgba(203, 243, 240, 0.20);
                    --shadow: 0 25px 60px rgba(0, 0, 0, 0.50);
                    --paper2: #0b1c1b;
                    --error: #e74c3c;
                    --success: #2ecc71;
                }
                h1, h2 {
                    font-family: 'Cormorant Garamond', serif;
                }
            `}</style>

            <div className="w-full max-w-[550px] bg-[var(--card)] backdrop-blur-[20px] border border-[var(--glass-border)] rounded-[28px] p-[40px_32px] shadow-[var(--shadow)]">
                <h2 className="text-[2.2rem] font-bold mb-5 text-center font-serif">Complete Your Order</h2>
                
                {status.text && (
                    <div className={`p-[12px_16px] rounded-[12px] text-[0.9rem] mb-5 text-center font-semibold border ${
                        status.type === 'success' 
                            ? 'bg-[rgba(46,204,113,0.15)] text-[var(--success)] border-[rgba(46,204,113,0.3)]' 
                            : status.type === 'error'
                            ? 'bg-[rgba(231,76,60,0.15)] text-[var(--error)] border-[rgba(231,76,60,0.3)]'
                            : 'bg-[rgba(255,159,28,0.15)] text-[var(--accent3)] border-[rgba(255,159,28,0.3)]'
                    }`}>
                        {status.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-[18px]">
                        <label htmlFor="fullName" className="block mb-[6px] text-[0.9rem] font-semibold">Full Name</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name" 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none focus:border-[var(--accent3)] focus:ring-[3px] focus:ring-[rgba(255,159,28,0.2)] transition"
                        />
                    </div>

                    <div className="mb-[18px]">
                        <label htmlFor="email" className="block mb-[6px] text-[0.9rem] font-semibold">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com" 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none focus:border-[var(--accent3)] focus:ring-[3px] focus:ring-[rgba(255,159,28,0.2)] transition"
                        />
                    </div>

                    <div className="mb-[18px]">
                        <label htmlFor="address" className="block mb-[6px] text-[0.9rem] font-semibold">Where You Live (Billing / Shipping Address)</label>
                        <input 
                            type="text" 
                            id="address" 
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Street, City, Country" 
                            required 
                            className="w-full p-[14px_18px] rounded-[12px] border border-[var(--glass-border)] bg-[var(--paper2)] text-[var(--text)] text-[0.95rem] outline-none focus:border-[var(--accent3)] focus:ring-[3px] focus:ring-[rgba(255,159,28,0.2)] transition"
                        />
                    </div>

                    <div className="mb-[18px]">
                        <label className="block mb-[6px] text-[0.9rem] font-semibold">Choose Payment Option</label>
                        <div className="grid grid-cols-1 gap-3 mb-5">
                            <label className="border border-[var(--accent3)] rounded-[12px] p-[14px] text-center cursor-pointer bg-[rgba(255,159,28,0.05)] transition">
                                <input 
                                    type="radio" 
                                    name="paymentMethod" 
                                    value="wise" 
                                    checked={formData.paymentMethod === 'wise'}
                                    onChange={handleChange}
                                    className="mb-2 accent-[var(--accent3)]"
                                />
                                <div>Manual Bank Transfer (Wise)</div>
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center w-full p-[14px_32px] rounded-full font-bold cursor-pointer transition duration-350 border-none text-[0.95rem] bg-[var(--accent3)] text-white shadow-[0_10px_25px_rgba(255,159,28,0.35)] hover:bg-[#e58a0f] hover:-translate-y-[3px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSubmitting ? 'Processing Order...' : 'Place Order & View Bank Details'}
                    </button>
                </form>
            </div>
        </div>
    );
}