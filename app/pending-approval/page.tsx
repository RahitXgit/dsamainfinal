'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PendingApprovalPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [approvalStatus, setApprovalStatus] = useState<string>('pending')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }

        checkApprovalStatus()

        // Poll for status changes every 10 seconds
        const interval = setInterval(checkApprovalStatus, 10000)
        return () => clearInterval(interval)
    }, [user, router])

    async function checkApprovalStatus() {
        if (!user) return

        try {
            const response = await fetch('/api/user/status')
            if (response.status === 404) {
                console.log('No approval record found yet')
                return
            }

            const data = await response.json()
            if (!response.ok) throw new Error(data.error)

            setApprovalStatus(data.status)

            // Redirect if approved
            if (data.status === 'approved') {
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('Error checking approval status:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    if (approvalStatus === 'rejected') {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="glassmorphism p-12 max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
                    <p className="text-muted-foreground mb-6">
                        Your account request has been rejected by the administrator.
                    </p>
                    <p className="text-sm text-muted-foreground mb-8">
                        If you believe this is an error, please contact the administrator.
                    </p>
                    <button
                        onClick={signOut}
                        className="btn btn-secondary w-full"
                    >
                        Logout
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glassmorphism p-12 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-primary animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Waiting for Approval</h1>
                <p className="text-muted-foreground mb-6">
                    Your account is pending approval by the administrator.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-8">
                    <p className="text-sm font-semibold mb-2">Account Details:</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-8">
                    You'll receive access once your request is approved. This page will automatically refresh.
                </p>
                <button
                    onClick={signOut}
                    className="btn btn-secondary w-full"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}
