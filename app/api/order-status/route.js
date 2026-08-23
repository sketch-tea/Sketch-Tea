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
        
        // Updated query to also fetch contact_email and user_id for the order history dashboard
        const [rows] = await connection.query(
            'SELECT status, contact_email, user_id FROM service_orders WHERE reference_code = ?', 
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
            contact_email: order.contact_email, // <-- Added so the tracker knows which email's history to load
            user_id: order.user_id
        });

    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error' 
        }, { status: 500 });
    }
}