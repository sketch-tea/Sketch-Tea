import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { password } = await request.json();
        
        // Change 'your_secure_password_here' to whatever strong password you want
        const ADMIN_PASSWORD = 'LawZatArc_080426***';

        if (password === ADMIN_PASSWORD) {
            return NextResponse.json({ success: true, message: 'Authenticated successfully' });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}