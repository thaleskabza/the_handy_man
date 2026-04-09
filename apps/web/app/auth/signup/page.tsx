'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupEmailSchema, type SignupEmailInput } from '@handy-man/shared/validators'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { apiFetch } from '@/lib/auth'

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupEmailInput>({
    resolver: zodResolver(signupEmailSchema),
    defaultValues: {
      acceptedTerms: undefined,
      acceptedPrivacy: undefined,
      marketingOptIn: false,
    },
  })

  const onSubmit = async (data: SignupEmailInput) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await apiFetch('/auth/signup/email', {
        method: 'POST',
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: 'success', text: 'Check your email to verify your account!' })
      } else {
        setMessage({ type: 'error', text: result.error || 'Registration failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

          {message && (
            <div
              className={`p-3 rounded-md mb-4 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input {...register('firstName')} placeholder="John" />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input {...register('lastName')} placeholder="Doe" />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input {...register('email')} type="email" placeholder="john@example.com" />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input {...register('password')} type="password" placeholder="••••••••" />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('acceptedTerms')} className="rounded" />
                <span className="text-sm">
                  I accept the <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
                </span>
              </label>
              {errors.acceptedTerms && (
                <p className="text-red-500 text-xs">{errors.acceptedTerms.message}</p>
              )}

              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('acceptedPrivacy')} className="rounded" />
                <span className="text-sm">
                  I accept the <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
                </span>
              </label>
              {errors.acceptedPrivacy && (
                <p className="text-red-500 text-xs">{errors.acceptedPrivacy.message}</p>
              )}

              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('marketingOptIn')} className="rounded" />
                <span className="text-sm text-gray-600">Send me updates and promotions</span>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
