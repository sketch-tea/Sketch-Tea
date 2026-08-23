import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const userId = searchParams.get('userId');

        // Check if at least an email or user ID is provided
        if (!email && !userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Email or User ID is required to fetch orders.' 
            }, { status: 400 });
        }

        const connection = typeof db.query === 'function' ? db : (db.promise ? db.promise() : db);

        let query = '';
        let queryParams = [];

        // Build a strict query based on what is actually provided to avoid cross-contamination
        if (email && userId) {
            query = `
                SELECT * FROM service_orders 
                WHERE contact_email = ? OR user_id = ? 
                ORDER BY id DESC
            `;
            queryParams = [email, userId];
        } else if (email) {
            query = `
                SELECT * FROM service_orders 
                WHERE contact_email = ? 
                ORDER BY id DESC
            `;
            queryParams = [email];
        } else {
            query = `
                SELECT * FROM service_orders 
                WHERE user_id = ? 
                ORDER BY id DESC
            `;
            queryParams = [userId];
        }
        
        const [orders] = await connection.query(query, queryParams);

        return NextResponse.json({
            success: true,
            orders: orders
        });

    } catch (err) {
        console.error('Error fetching user orders:', err);
        return NextResponse.json({ 
            success: false, 
            message: 'Failed to fetch order history.', 
            error: err.message 
        }, { status: 500 });
    }
}