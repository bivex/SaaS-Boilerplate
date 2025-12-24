/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-24T01:03:42
 * Last Updated: 2025-12-24T01:03:42
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // In a real application, you would:
    // 1. Validate the data more thoroughly
    // 2. Send an email using a service like SendGrid, Mailgun, etc.
    // 3. Store the contact form submission in a database
    // 4. Send a confirmation email to the user

    console.warn('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // For now, just return a success response
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
