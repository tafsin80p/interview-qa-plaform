import { supabase } from '@/integrations/supabase/client';

interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName: string;
}

export const getSMTPConfig = async (): Promise<SMTPConfig | null> => {
  try {
    const settings = await supabase
      .from('quiz_settings')
      .select('setting_key, setting_value')
      .in('setting_key', [
        'smtp_host',
        'smtp_port',
        'smtp_secure',
        'smtp_username',
        'smtp_password',
        'smtp_from_email',
        'smtp_from_name'
      ]);

    if (settings.error || !settings.data) {
      return null;
    }

    const configMap = new Map(settings.data.map(s => [s.setting_key, s.setting_value]));
    
    const host = configMap.get('smtp_host');
    const port = configMap.get('smtp_port');
    const secure = configMap.get('smtp_secure') === 'true';
    const username = configMap.get('smtp_username');
    const password = configMap.get('smtp_password');
    const fromEmail = configMap.get('smtp_from_email');
    const fromName = configMap.get('smtp_from_name');

    if (!host || !port || !username || !password || !fromEmail) {
      return null;
    }

    return {
      host,
      port: parseInt(port),
      secure,
      username,
      password,
      fromEmail,
      fromName: fromName || 'WordPress Quiz'
    };
  } catch (error) {
    console.error('Error fetching SMTP config:', error);
    return null;
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const config = await getSMTPConfig();
    
    if (!config) {
      return { success: false, error: 'SMTP not configured' };
    }

    // Use Supabase Edge Function or direct API call to send email
    // For now, we'll use a serverless function approach
    // In production, you'd want to use a service like Resend, SendGrid, or a backend API
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html,
        text,
        config
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: String(error) };
  }
};

export const sendConfirmationEmail = async (email: string, confirmationLink: string): Promise<{ success: boolean; error?: string }> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #00AB0D; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; padding: 12px 24px; background: #00AB0D; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>WordPress Developer Quiz</h1>
        </div>
        <div class="content">
          <h2>Email Confirmation Required</h2>
          <p>Thank you for signing up! Please confirm your email address to complete your registration.</p>
          <p>Click the button below to verify your email:</p>
          <a href="${confirmationLink}" class="button">Confirm Email</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${confirmationLink}</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WordPress Developer Quiz. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    WordPress Developer Quiz - Email Confirmation
    
    Thank you for signing up! Please confirm your email address by clicking the link below:
    
    ${confirmationLink}
    
    If you didn't create an account, you can safely ignore this email.
  `;

  return sendEmail(email, 'Confirm Your Email - WordPress Quiz', html, text);
};

export const sendBlockedNotificationEmail = async (email: string, reason: string): Promise<{ success: boolean; error?: string }> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .warning { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Account Blocked</h1>
        </div>
        <div class="content">
          <h2>Your Account Has Been Blocked</h2>
          <div class="warning">
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
          <p>Your account has been temporarily blocked due to a violation of our quiz rules.</p>
          <p>If you believe this is an error, please contact the administrator.</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} WordPress Developer Quiz. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
    Account Blocked - WordPress Developer Quiz
    
    Your account has been blocked.
    
    Reason: ${reason}
    
    If you believe this is an error, please contact the administrator.
  `;

  return sendEmail(email, 'Account Blocked - WordPress Quiz', html, text);
};

