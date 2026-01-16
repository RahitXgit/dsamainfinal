'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/Navbar'

interface ApprovalRequest {
    id: string
    user_id: string
    email: string
    status: string
    requested_at: string
    reviewed_at: string | null
    reviewed_by: string | null
    notes: string | null
}

export default function AdminPage() {
    const { user, signOut } = useAuth()
    const router = useRouter()
    const [pendingRequests, setPendingRequests] = useState<ApprovalRequest[]>([])
    const [approvedRequests, setApprovedRequests] = useState<ApprovalRequest[]>([])
    const [rejectedRequests, setRejectedRequests] = useState<ApprovalRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')

    useEffect(() => {
        // Check if user is admin
        if (user && user.email !== 'rahitdhara.main@gmail.com') {
            toast.error('Access denied. Admin only.')
            router.push('/dashboard')
            return
        }

        if (user) {
            fetchApprovalRequests()
        }
    }, [user, router])

    async function fetchApprovalRequests() {
        try {
            setLoading(true)

            // Fetch from API
            const response = await fetch('/api/admin/approvals')
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to fetch requests')
            }

            const data = await response.json()
            console.log('Fetched approval data:', data)

            // Separate by status
            setPendingRequests(data.filter((r: ApprovalRequest) => r.status === 'pending'))
            setApprovedRequests(data.filter((r: ApprovalRequest) => r.status === 'approved'))
            setRejectedRequests(data.filter((r: ApprovalRequest) => r.status === 'rejected'))
        } catch (error: any) {
            console.error('Error fetching approval requests:', error)
            toast.error(`Failed to load approval requests: ${error.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    async function handleApprove(requestId: string, userEmail: string) {
        setProcessingId(requestId)

        // Use toast.promise for better UX
        const promise = fetch('/api/admin/approvals', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: requestId, status: 'approved' })
        }).then(async (response) => {
            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to approve')
            }
            // Refresh list
            await fetchApprovalRequests()
            return `Approved ${userEmail}`
        })

        toast.promise(promise, {
            loading: 'Approving...',
            success: (msg) => msg,
            error: (err) => `Error: ${err.message}`
        })

        try {
            await promise
        } catch (error) {
            console.error('Error approving user:', error)
        } finally {
            setProcessingId(null)
        }
    }

    async function handleReject(requestId: string, userEmail: string) {
        const reason = prompt(`Reject ${userEmail}? Enter reason (optional):`)
        if (reason === null) return // User cancelled

        setProcessingId(requestId)
        try {
            // Note: Currently API only accepts status, note handling can be added later or just update status for now
            const response = await fetch('/api/admin/approvals', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: requestId, status: 'rejected' })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Failed to reject')
            }

            toast.success(`Rejected ${userEmail}`)
            await fetchApprovalRequests()
        } catch (error: any) {
            console.error('Error rejecting user:', error)
            toast.error('Failed to reject user')
        } finally {
            setProcessingId(null)
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        )
    }

    if (user.email !== 'rahitdhara.main@gmail.com') {
        return null
    }

    const currentRequests = activeTab === 'pending' ? pendingRequests :
        activeTab === 'approved' ? approvedRequests : rejectedRequests

    return (
        <div className="min-h-screen">
            <Navbar user={user} signOut={signOut} />

            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="glassmorphism p-8 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                            <p className="text-muted-foreground mt-2">
                                Manage user access approvals
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'pending'
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary'
                            }`}
                    >
                        Pending ({pendingRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('approved')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'approved'
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary'
                            }`}
                    >
                        Approved ({approvedRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('rejected')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'rejected'
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary'
                            }`}
                    >
                        Rejected ({rejectedRequests.length})
                    </button>
                </div>

                {/* Requests List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner"></div>
                    </div>
                ) : currentRequests.length === 0 ? (
                    <div className="glassmorphism p-12 text-center">
                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No {activeTab} requests</h3>
                        <p className="text-muted-foreground">
                            {activeTab === 'pending' && 'All caught up! No pending approval requests.'}
                            {activeTab === 'approved' && 'No users have been approved yet.'}
                            {activeTab === 'rejected' && 'No users have been rejected.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {currentRequests.map((request) => (
                            <div key={request.id} className="card hover-lift">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                                                {request.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{request.email}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Requested: {new Date(request.requested_at).toLocaleString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {request.reviewed_at && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Reviewed: {new Date(request.reviewed_at).toLocaleString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                )}
                                                {request.notes && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Note: {request.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {activeTab === 'pending' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(request.id, request.email)}
                                                disabled={processingId === request.id}
                                                className="btn btn-success px-4 py-2 text-sm"
                                            >
                                                {processingId === request.id ? 'Processing...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id, request.email)}
                                                disabled={processingId === request.id}
                                                className="btn btn-danger px-4 py-2 text-sm"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}

                                    {activeTab === 'approved' && (
                                        <span className="badge badge-easy">Approved</span>
                                    )}

                                    {activeTab === 'rejected' && (
                                        <span className="badge badge-hard">Rejected</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
