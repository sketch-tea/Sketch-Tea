import { NextResponse } from 'next/server';
import db from '@/lib/db'; 

// GET: Fetch all service orders from MySQL
export async function GET() {
    try {
        const connection = typeof db.query === 'function' ? db : (db.promise ? db.promise() : db);
        const [rows] = await connection.query('SELECT * FROM service_orders ORDER BY id DESC');
        return NextResponse.json({ success: true, orders: rows });
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
    }
}

// POST: Update order status to paid
export async function POST(request) {
    try {
        const { orderId } = await request.json();
        
        if (!orderId) {
            return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
        }

        const connection = typeof db.query === 'function' ? db : (db.promise ? db.promise() : db);
        await connection.query('UPDATE service_orders SET status = ? WHERE id = ?', ['paid', orderId]);

        return NextResponse.json({ success: true, message: 'Order marked as paid' });
    } catch (error) {
        console.error('Failed to update order:', error);
        return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
    }
}