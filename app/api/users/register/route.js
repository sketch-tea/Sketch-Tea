import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }

        // 1. Ensure table exists
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_verified BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Check if user already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 400 });
        }

        // 3. Hash password and save user (is_verified set to true immediately)
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, is_verified) VALUES (?, ?, ?, TRUE)', 
            [name, email, hashedPassword]
        );

        return NextResponse.json({ 
            success: true, 
            message: 'Registration successful! You can now log in.' 
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}