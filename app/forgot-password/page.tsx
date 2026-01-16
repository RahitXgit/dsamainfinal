'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.error || 'Failed to send reset email')
                return
            }

            setSubmitted(true)
            toast.success('Password reset email sent!')
        } catch (error: any) {
            console.error('Forgot password error:', error)
            toast.error('An error occurred. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
                <div className="card max-w-md w-full">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Check Your Email</h1>
                        <p className="text-muted-foreground">
                            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>
                    </div>

                    <div className="info-box mb-6">
                        <p className="text-sm">
                            <strong>📧 Didn't receive the email?</strong>
                        </p>
                        <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                            <li>• Check your spam/junk folder</li>
                            <li>• Make sure you entered the correct email</li>
                            <li>• Wait a few minutes and try again</li>
                        </ul>
                    </div>

                    <Link href="/login" className="btn btn-primary w-full text-center">
                        Back to Login
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
            <div className="card max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
                    <p className="text-muted-foreground">
                        No worries! Enter your email and we'll send you a reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            disabled={loading}
                            className="w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        ← Back to Login
                    </Link>
                </div>

                <div className="info-box mt-6">
                    <p className="text-xs text-muted-foreground">
                        <strong>⚠️ Rate Limit:</strong> You can request a password reset maximum 3 times in 24 hours.
                    </p>
                </div>
            </div>
        </div>
    )
}
