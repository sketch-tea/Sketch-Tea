import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
        }

        // 1. Ensure table exists with verification columns
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. Check if user already exists
        const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 400 });
        }

        // 3. Generate a secure random token for email verification
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 4. Hash password and save user (is_verified defaults to false)
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, verification_token, is_verified) VALUES (?, ?, ?, ?, false)', 
            [name, email, hashedPassword, verificationToken]
        );

        // 5. Send verification email via Resend
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/users/verify?token=${verificationToken}`;

        await resend.emails.send({
            from: 'Sketch Tea <onboarding@resend.dev>', // Change to your verified domain email later
            to: email,
            subject: 'Verify your email address - Sketch Tea',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #114b46;">
                    <h2>Welcome to Sketch Tea, ${name}!</h2>
                    <p>Please click the button below to verify your email address and activate your account:</p>
                    <a href="${verificationUrl}" style="background-color: #FF9F1C; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-top: 15px;">Verify Email</a>
                    <p style="margin-top: 20px; font-size: 0.9rem; color: #666;">If you didn't request this, you can safely ignore this email.</p>
                </div>
            `
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Registration successful! Please check your email to verify your account.' 
        });

    } catch (error) {
        console.error('Error during user registration:', error);
        return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
    }
}