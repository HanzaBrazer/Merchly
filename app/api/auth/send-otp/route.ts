import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, name, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    // If SMTP credentials are provided in .env.local, dispatch real email
    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"Merchly Platform" <${smtpUser}>`,
        to: email,
        subject: `${otp} is your Merchly verification code`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border-radius: 16px; border: 1px solid #E8E8E8;">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 24px; font-weight: bold; color: #CE3627;">Merchly</span>
            </div>
            <h2 style="color: #000000; font-size: 20px; font-weight: 600; margin-bottom: 8px; text-align: center;">Verify Your Email Address</h2>
            <p style="color: #666666; font-size: 14px; line-height: 1.5; text-align: center; margin-bottom: 24px;">
              Hi ${name || 'there'}, thank you for signing up with Merchly. Use the verification code below to complete your registration:
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <span style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #CE3627; background-color: #FEF1ED; padding: 12px 28px; border-radius: 12px; border: 1px dashed #F7D7D1;">
                ${otp}
              </span>
            </div>
            <p style="color: #888888; font-size: 12px; text-align: center; margin-top: 24px; line-height: 1.4;">
              This code is valid for 10 minutes. If you did not request this email, please safely ignore it.
            </p>
            <hr style="border: none; border-top: 1px solid #EEEEEE; margin: 24px 0;" />
            <p style="color: #A0A0A0; font-size: 11px; text-align: center;">
              &copy; ${new Date().getFullYear()} Merchly E-Commerce Retail Platform. All rights reserved.
            </p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      return NextResponse.json({ success: true, method: 'smtp', message: 'Email dispatched via SMTP' });
    }

    // Fallback if SMTP not yet configured in .env.local
    return NextResponse.json({
      success: true,
      method: 'simulation',
      otp,
      smtpConfigured: false,
      message: 'SMTP not configured in .env.local. Configure Gmail App Password to send real emails.',
    });
  } catch (error: any) {
    console.error('Error dispatching OTP email:', error);
    return NextResponse.json({ error: error?.message || 'Failed to send email' }, { status: 500 });
  }
}
