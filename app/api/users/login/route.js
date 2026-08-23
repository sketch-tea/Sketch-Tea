import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // 1. Input Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Please provide both email and password.' },
                { status: 400 }
            );
        }

        // 2. Find user by email
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        const user = rows[0];

        // 3. Password verification using bcrypt
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password.' },
                { status: 401 }
            );
        }

        // 4. CHECK EMAIL VERIFICATION (NEW)
        // If the user's is_verified column is false/0, block the login
        if (!user.is_verified) {
            return NextResponse.json(
                { success: false, message: 'Please verify your email address before logging in. Check your inbox.' },
                { status: 403 } 
            );
        }

        // 5. Login successful
        return NextResponse.json({
            success: true,
            message: 'Login successful!',
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            }
        });

    } catch (error) {
        console.error('❌ Login Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error during login.' }, 
            { status: 500 }
        );
    }
}