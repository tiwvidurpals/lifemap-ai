// Email templates for LifeMap verification system

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export function createVerificationCodeTemplate(code: string, email: string): EmailTemplate {
  return {
    subject: 'Your LifeMap Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LifeMap Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">LifeMap</h1>
            <p style="color: #E0E7FF; margin: 8px 0 0 0; font-size: 16px;">Your personal roadmap to achieving life goals</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="color: #1F2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Verification Code Required</h2>
            <p style="color: #4B5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">
              Hello,
            </p>
            <p style="color: #4B5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">
              For security reasons, we need to verify your email address. Please use the verification code below to continue:
            </p>
            
            <!-- Verification Code Box -->
            <div style="background-color: #F3F4F6; border: 2px dashed #D1D5DB; padding: 24px; text-align: center; margin: 24px 0; border-radius: 8px;">
              <div style="color: #1F2937; font-size: 36px; font-weight: 700; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${code}</div>
            </div>
            
            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #92400E; margin: 0; font-size: 14px; font-weight: 600;">
                ⏰ This code will expire in 10 minutes
              </p>
            </div>
            
            <p style="color: #6B7280; margin: 24px 0 0 0; font-size: 14px; line-height: 1.5;">
              If you didn't request this verification, please ignore this email. Your account remains secure.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0; font-size: 12px;">
              This email was sent by LifeMap for security verification purposes.
            </p>
            <p style="color: #9CA3AF; margin: 8px 0 0 0; font-size: 12px;">
              © 2024 LifeMap. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
LifeMap Verification Code

Hello,

For security reasons, we need to verify your email address. Please use the verification code below to continue:

Verification Code: ${code}

This code will expire in 10 minutes.

If you didn't request this verification, please ignore this email. Your account remains secure.

---
This email was sent by LifeMap for security verification purposes.
© 2024 LifeMap. All rights reserved.
    `
  };
}

export function createPasswordResetTemplate(resetUrl: string, email: string): EmailTemplate {
  return {
    subject: 'Reset Your LifeMap Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LifeMap Password Reset</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); padding: 32px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">LifeMap</h1>
            <p style="color: #E0E7FF; margin: 8px 0 0 0; font-size: 16px;">Your personal roadmap to achieving life goals</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <h2 style="color: #1F2937; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">Password Reset Request</h2>
            <p style="color: #4B5563; margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">
              Hello,
            </p>
            <p style="color: #4B5563; margin: 0 0 24px 0; font-size: 16px; line-height: 1.5;">
              You've requested to reset your password for your LifeMap account. Click the button below to set a new password:
            </p>
            
            <!-- Reset Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="background-color: #3B82F6; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block;">
                Reset My Password
              </a>
            </div>
            
            <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px; margin: 24px 0; border-radius: 4px;">
              <p style="color: #92400E; margin: 0; font-size: 14px; font-weight: 600;">
                ⏰ This link will expire in 1 hour
              </p>
            </div>
            
            <p style="color: #6B7280; margin: 24px 0 0 0; font-size: 14px; line-height: 1.5;">
              If you didn't request this password reset, please ignore this email. Your account remains secure.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #F9FAFB; padding: 24px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; margin: 0; font-size: 12px;">
              This email was sent by LifeMap for security purposes.
            </p>
            <p style="color: #9CA3AF; margin: 8px 0 0 0; font-size: 12px;">
              © 2024 LifeMap. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
LifeMap Password Reset

Hello,

You've requested to reset your password for your LifeMap account. Click the link below to set a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request this password reset, please ignore this email. Your account remains secure.

---
This email was sent by LifeMap for security purposes.
© 2024 LifeMap. All rights reserved.
    `
  };
}
