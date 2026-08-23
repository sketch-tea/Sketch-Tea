import { NextResponse } from 'next/server';
import db from '@/lib/db'; 
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req) {
    try {
        const formData = await req.formData();
        const email = formData.get('email');
        const ideas = formData.get('ideas');
        const userId = formData.get('userId');
        const fullName = formData.get('fullName') || 'Valued Customer';
        const file = formData.get('reference_file');
        
        // Grab the exact sequential reference code from the frontend
        const clientProvidedRef = formData.get('referenceCode'); 

        let filePath = null;

        // Handle file upload if present
        if (file && typeof file === 'object' && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.name)}`;
            filePath = `/uploads/${filename}`;
            
            await writeFile(path.join(process.cwd(), 'public', filePath), buffer);
        }

        // Fallback safety logic using the same multi-part name rule if frontend reference is missing
        let referenceCode = '';
        if (clientProvidedRef && clientProvidedRef.trim() !== '') {
            referenceCode = clientProvidedRef.trim();
        } else {
            const nameParts = fullName.trim().split(/\s+/);
            let shortName = nameParts[0];
            if (nameParts.length > 1) {
                const lastName = nameParts[nameParts.length - 1];
                shortName = `${nameParts[0]}-${lastName}`;
            }
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            referenceCode = `ST-${shortName.toUpperCase()} - ${randomNum}`;
        }

        const connection = typeof db.query === 'function' ? db : (db.promise ? db.promise() : db);

        // Save into MySQL database
        const query = `INSERT INTO service_orders (reference_code, user_id, contact_email, design_ideas, reference_file_path, status) VALUES (?, ?, ?, ?, ?, 'Payment Pending Verification')`;
        const [result] = await connection.query(query, [referenceCode, userId || null, email, ideas, filePath]);
        const orderId = result.insertId;

        console.log("Order saved successfully without SMTP timeout!");

        return NextResponse.json({
            success: true,
            message: 'Order submitted successfully!',
            referenceCode: referenceCode,
            orderId: orderId
        });

    } catch (err) {
        console.error('Error processing service order:', err);
        return NextResponse.json({
            success: false,
            message: 'Failed to complete order request.',
            error: err.message
        }, { status: 500 });
    }
}