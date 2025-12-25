# Email Setup Guide

This application requires a backend API endpoint to send emails using the configured SMTP settings.

## Required API Endpoint

You need to create a backend API endpoint at `/api/send-email` that accepts POST requests with the following structure:

### Request Format

```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "html": "<html>Email HTML content</html>",
  "text": "Plain text version (optional)",
  "config": {
    "host": "smtp.gmail.com",
    "port": 587,
    "secure": false,
    "username": "your-email@gmail.com",
    "password": "your-app-password",
    "fromEmail": "noreply@example.com",
    "fromName": "WordPress Quiz"
  }
}
```

### Response Format

- **Success (200)**: Empty response or `{ "success": true }`
- **Error (400/500)**: Error message string

## Implementation Options

### Option 1: Supabase Edge Function

Create a Supabase Edge Function at `supabase/functions/send-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createTransport } from "https://deno.land/x/nodemailer@1.0.0/mod.ts"

serve(async (req) => {
  const { to, subject, html, text, config } = await req.json()

  const transporter = createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  })

  await transporter.sendMail({
    from: `"${config.fromName}" <${config.fromEmail}>`,
    to,
    subject,
    html,
    text,
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

### Option 2: Node.js/Express Backend

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html, text, config } = req.body;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject,
      html,
      text,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Option 3: Vercel Serverless Function

Create `api/send-email.js`:

```javascript
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html, text, config } = req.body;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.username,
      pass: config.password,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject,
      html,
      text,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Gmail SMTP Setup

1. Enable 2-Step Verification on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use these settings in the admin panel:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Secure: `false` (or `true` for port 465)
   - Username: Your Gmail address
   - Password: The generated app password

## Features Enabled

Once the email API is configured:

1. **Email Confirmation**: Users receive confirmation emails when they sign up
2. **Block Notifications**: Users receive email notifications when they are blocked for cheating
3. **Test Email**: Admin can test SMTP configuration from the admin panel

## Security Notes

- Never expose SMTP credentials in client-side code
- Always use environment variables for sensitive data
- Consider using a dedicated email service (SendGrid, Resend, etc.) for production
- Implement rate limiting on the email endpoint

