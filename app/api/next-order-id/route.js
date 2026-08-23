import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        // Count total rows to safely get the next sequential number
        const [rows] = await db.query('SELECT COUNT(*) as total FROM service_orders');
        const nextId = (rows[0].total || 0) + 1;

        return NextResponse.json({ success: true, nextId });
    } catch (error) {
        console.error('Error fetching next order ID:', error);
        return NextResponse.json({ success: false, nextId: 1 }, { status: 500 });
    }
}