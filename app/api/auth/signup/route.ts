import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(req: Request) {
    try {
        const { email, username, password } = await req.json()

        if (!email || !username || !password) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if email already exists in user_approvals
        const { data: existingApproval } = await supabaseAdmin
            .from('user_approvals')
            .select('status')
            .eq('email', email)
            .maybeSingle()

        if (existingApproval) {
            if (existingApproval.status === 'pending') {
                return NextResponse.json(
                    { error: 'PENDING_APPROVAL' },
                    { status: 400 }
                )
            } else if (existingApproval.status === 'approved') {
                return NextResponse.json(
                    { error: 'This email is already registered. Please login instead.' },
                    { status: 400 }
                )
            } else if (existingApproval.status === 'rejected') {
                return NextResponse.json(
                    { error: 'This email was previously rejected. Please contact the administrator.' },
                    { status: 400 }
                )
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user
        const { data: newUser, error: userError } = await supabaseAdmin
            .from('users')
            .insert({
                email,
                username,
                password: passwordHash
            })
            .select()
            .single()

        if (userError) {
            console.error('User creation error:', userError)
            return NextResponse.json(
                { error: 'Failed to create user account' },
                { status: 500 }
            )
        }

        // Create approval request
        // Auto-approve if it's the admin email
        const status = email === 'rahitdhara.main@gmail.com' ? 'approved' : 'pending'

        const { error: approvalError } = await supabaseAdmin
            .from('user_approvals')
            .insert({
                user_id: newUser.id,
                email,
                status
            })

        if (approvalError) {
            console.error('Approval creation error:', approvalError)
            // Rollback user creation? Ideal but complex. For now just error.
            return NextResponse.json(
                { error: 'Failed to create approval request' },
                { status: 500 }
            )
        }

        // Send welcome email (non-blocking - don't fail signup if email fails)
        try {
            const { sendWelcomeEmail } = await import('@/lib/email')
            await sendWelcomeEmail(email, username)
            console.log('Welcome email sent to:', email)
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            // Don't fail the signup if email fails
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
