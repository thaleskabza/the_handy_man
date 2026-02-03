/**
 * Resend Email Client
 * Service for sending verification emails
 */

import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }

    resendClient = new Resend(apiKey)
  }

  return resendClient
}

interface SendVerificationEmailParams {
  to: string
  firstName: string
  verificationUrl: string
}

export async function sendVerificationEmail(
  params: SendVerificationEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { to, firstName, verificationUrl } = params
  const fromEmail = process.env.FROM_EMAIL || 'noreply@handyman.co.za'

  try {
    const client = getResendClient()

    await client.emails.send({
      from: `Handy Man <${fromEmail}>`,
      to: [to],
      subject: 'Verify your email address',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome to Handy Man, ${firstName}!</h1>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}"
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px;
                    text-decoration: none; border-radius: 6px; margin: 16px 0;">
            Verify Email
          </a>
          <p>Or copy this link: ${verificationUrl}</p>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create an account, you can ignore this email.</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send verification email:', error)
    return { success: false, error: 'Failed to send email' }
  }
}
