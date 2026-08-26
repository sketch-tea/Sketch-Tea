import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Adjust this path if your database connection file is located elsewhere

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
        return NextResponse.json({ 
            success: false, 
            message: 'Reference code is required' 
        }, { status: 400 });
    }

    try {
        // Handle both promise-based and standard connection pools
        const connection = typeof db.query === 'function' ? db : (db.promise ? db.promise() : db);
        
        // Updated query to fetch status, contact_email, user_id, AND full_name (change 'full_name' if your column is named differently like 'name' or 'customer_name')
        const [rows] = await connection.query(
            'SELECT status, contact_email, user_id, full_name FROM service_orders WHERE reference_code = ?', 
            [ref]
        );
        
        const order = rows[0];

        // If the order isn't found in the database yet, default safely to pending
        if (!order) {
            return NextResponse.json({
                success: true,
                status: 'Payment Pending Verification'
            });
        }

        return NextResponse.json({
            success: true,
            status: order.status,
            contact_email: order.contact_email,
            user_id: order.user_id,
            customerName: order.full_name // <-- Passed correctly to the frontend
        });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error' 
        }, { status: 500 });
    }
}