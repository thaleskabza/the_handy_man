/**
 * Twilio SMS Client
 * Service for sending verification SMS
 */

import twilio from 'twilio'

let twilioClient: twilio.Twilio | null = null

function getTwilioClient(): twilio.Twilio {
  if (!twilioClient) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    if (!accountSid || !authToken) {
      throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set')
    }

    twilioClient = twilio(accountSid, authToken)
  }

  return twilioClient
}

interface SendVerificationSmsParams {
  to: string
  code: string
}

export async function sendVerificationSms(
  params: SendVerificationSmsParams
): Promise<{ success: boolean; error?: string }> {
  const { to, code } = params
  const fromPhone = process.env.TWILIO_PHONE_NUMBER

  if (!fromPhone) {
    console.warn('TWILIO_PHONE_NUMBER not set, skipping SMS')
    return { success: true } // Fail open in development
  }

  try {
    const client = getTwilioClient()

    await client.messages.create({
      body: `Your Handy Man verification code is: ${code}. Valid for 10 minutes.`,
      from: fromPhone,
      to,
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to send verification SMS:', error)
    return { success: false, error: 'Failed to send SMS' }
  }
}
