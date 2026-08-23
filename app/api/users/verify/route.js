import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ success: false, message: 'Invalid verification token.' }, { status: 400 });
    }

    try {
        // Find user by token
        const [users] = await db.query('SELECT id FROM users WHERE verification_token = ?', [token]);

        if (users.length === 0) {
            return NextResponse.json({ success: false, message: 'Invalid or expired verification link.' }, { status: 400 });
        }

        const userId = users[0].id;

        // Update user to verified and clear the token
        await db.query(
            'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = ?',
            [userId]
        );

        // Redirect user to login page with a success query param (or a dedicated success page)
        return NextResponse.redirect(new URL('/?verified=true', request.url));

    } catch (error) {
        console.error('Error verifying email:', error);
        return NextResponse.json({ success: false, message: 'Server error during verification.' }, { status: 500 });
    }
}