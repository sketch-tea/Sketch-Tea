'use client';

import Link from 'next/link';

export default function PaymentSuccessPage() {
    return (
        <div className="font-['Manrope',sans-serif] bg-[#122b2a] text-white min-h-screen flex flex-col items-center justify-center p-[40px_20px]">
            <div className="w-full max-w-[650px] bg-[rgba(18,43,42,0.85)] backdrop-blur-[20px] border border-[rgba(203,243,240,0.20)] rounded-[28px] p-[40px_32px] shadow-[0_25px_60px_rgba(0,0,0,0.50)] text-center">
                
                {/* Success Icon */}
                <div className="w-[80px] h-[80px] bg-[rgba(46,204,113,0.15)] text-[#2ecc71] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-[2.5rem] font-bold mb-4 font-serif text-[#FF9F1C]">Order Received!</h1>
                <p className="text-[1.05rem] mb-8 opacity-90">
                    Your order has been successfully saved. To complete your purchase and begin production, please send your payment using the Wise Bank details below.
                </p>

                {/* Bank Details Card */}
                <div className="bg-[#0b1c1b] border border-[rgba(203,243,240,0.20)] rounded-[16px] p-[24px] text-left mb-8 shadow-inner">
                    <h3 className="text-[1.2rem] font-bold mb-4 text-[#FF9F1C] border-b border-[rgba(203,243,240,0.20)] pb-2">
                        Wise Bank Transfer Details
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-[0.85rem] opacity-70 mb-1">Total Amount to Pay</p>
                            <p className="text-[1.1rem] font-semibold">[Amount Here]</p>
                        </div>
                        <div>
                            <p className="text-[0.85rem] opacity-70 mb-1">Account Name</p>
                            <p className="text-[1.1rem] font-semibold">[BLANK MUNA]</p>
                        </div>
                        <div>
                            <p className="text-[0.85rem] opacity-70 mb-1">Bank Name</p>
                            <p className="text-[1.1rem] font-semibold">[BLANK MUNA]</p>
                        </div>
                        <div>
                            <p className="text-[0.85rem] opacity-70 mb-1">Account Number / IBAN</p>
                            <p className="text-[1.1rem] font-semibold">[BLANK MUNA]</p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-[rgba(255,159,28,0.1)] border border-[rgba(255,159,28,0.2)] rounded-[12px] p-4 text-left mb-8">
                    <p className="font-semibold text-[#FF9F1C] mb-2">Next Steps:</p>
                    <ol className="list-decimal list-inside space-y-2 opacity-90 text-[0.95rem]">
                        <li>Transfer the exact amount to the account above.</li>
                        <li>Take a screenshot of your successful transfer receipt.</li>
                        <li>Check your email for your order confirmation and reply to it with your screenshot attached.</li>
                    </ol>
                </div>

                <Link href="/" className="inline-block p-[14px_32px] rounded-full font-bold bg-white text-[#122b2a] transition duration-300 hover:bg-[#FF9F1C] hover:text-white">
                    Return to Home
                </Link>
            </div>
        </div>
    );
}