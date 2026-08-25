import { NextResponse } from 'next/server';
import db from '@/lib/db'; 
import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
    try {
        const formData = await req.formData();
        const email = formData.get('email');
        const ideas = formData.get('ideas');
        const userId = formData.get('userId');
        const fullName = formData.get('fullName') || 'Valued Customer';
        const file = formData.get('reference_file');
        const clientProvidedRef = formData.get('referenceCode');

        let filePath = null;
        let attachments = [];

        // Handle file upload entirely in memory (No disk writing!)
        if (file && typeof file === 'object' && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            filePath = `[In-Memory File: ${file.name}]`; // Optional label for database tracking

            // Add file directly as an in-memory attachment for Resend
            attachments.push({
                filename: file.name || 'attachment.png',
                content: buffer
            });
        }

        let referenceCode = clientProvidedRef;
        if (!referenceCode) {
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            referenceCode = `ST-GAB - ${randomNum}`;
        }

        const connection = typeof db.query === 'function' ? db : (db.promise ? db.promise() : db);

        // Save into MySQL database (saving filePath as null or a text label since we aren't using local disk)
        const query = `INSERT INTO service_orders (reference_code, user_id, contact_email, design_ideas, reference_file_path, status) VALUES (?, ?, ?, ?, ?, 'Payment Pending Verification')`;
        const [result] = await connection.query(query, [referenceCode, userId || null, email, ideas, filePath]);
        const orderId = result.insertId;

        // Dynamically get the base URL for the tracker link
        const host = req.headers.get('host') || 'localhost:3000';
        const protocol = host.includes('localhost') ? 'http' : 'https';
        const trackerUrl = `${protocol}://${host}/order-status/${referenceCode}`;

        // 1. Send Email to Customer using Resend
        console.log("Attempting to send customer email via Resend to:", email);
        await resend.emails.send({
            from: 'Sketch Tea <onboarding@resend.dev>',
            to: email,
            subject: `Thank you for your order, ${fullName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
                    <p style="font-size: 18px; font-weight: bold;">Thank you for your order, ${fullName}!</p>
                    
                    <p>We have received your order details (Reference ID: <strong>${referenceCode}</strong>). To complete your purchase, please send your payment manually using Wise. <span style="color: #e74c3c; font-weight: bold;">(ignore if already paid)</span></p>
                    
                    <p style="font-weight: bold; margin-top: 20px;"><span style="color: #FF9F1C;">Sketch Tea's</span> Wise Bank Details:</p>
                    <ul style="list-style-type: disc; padding-left: 20px; margin-top: 5px;">
                        <li><strong>Account Name:</strong> [BLANK]</li>
                        <li><strong>Account/Routing Number:</strong> [BLANK]</li>
                        <li><strong>Bank Name:</strong> [BLANK]</li>
                    </ul>
                    
                    <p style="margin-top: 20px;">Reference Code: <strong style="color: #FF9F1C;">${referenceCode}</strong></p>
                    
                    <br>
                    <p>You can track your real-time order and payment verification status anytime using your dedicated live tracker link below:</p>
                    <p style="margin-top: 15px;"><a href="${trackerUrl}" style="background-color: #FF9F1C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Live Order Tracker</a></p>
                    
                    <p style="margin-top: 25px; font-style: italic; color: #555;">Thank you for trusting our service, we hope for your continued support!</p>
                </div>
            `
        });

        // 2. Send Email to Admin using Resend (includes the attached image from memory)
        const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER; 
        if (adminEmail) {
            console.log("Attempting to send admin notification via Resend...");
            await resend.emails.send({
                from: 'Sketch Tea <onboarding@resend.dev>',
                to: adminEmail,
                subject: `🔔 New Service Order #${orderId}!`,
                html: `
                    <h2>New Order Submitted</h2>
                    <p><strong>Order ID:</strong> #${orderId}</p>
                    <p><strong>Customer Email:</strong> ${email}</p>
                    <p><strong>Reference Code:</strong> <span style="color: #FF9F1C; font-weight: bold;">${referenceCode}</span></p>
                    <p><strong>Design Ideas:</strong> ${ideas}</p>
                `,
                attachments: attachments
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Order submitted and emails sent successfully!',
            referenceCode: referenceCode,
            orderId: orderId
        });

    } catch (err) {
        console.error('Error processing service order & emails:', err);
        return NextResponse.json({
            success: false,
            message: 'Failed to complete order request.',
            error: err.message
        }, { status: 500 });
    }
}