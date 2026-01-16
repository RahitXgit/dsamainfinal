import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json()

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and new password are required' },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            )
        }

        // Find and validate token
        const { data: resetToken, error: tokenError } = await supabaseAdmin
            .from('password_reset_tokens')
            .select('*')
            .eq('token', token)
            .single()

        if (tokenError || !resetToken) {
            return NextResponse.json(
                { error: 'Invalid or expired reset link' },
                { status: 400 }
            )
        }

        // Check if token is already used
        if (resetToken.used) {
            return NextResponse.json(
                { error: 'This reset link has already been used. Please request a new one.' },
                { status: 400 }
            )
        }

        // Check if token is expired
        const now = new Date()
        const expiresAt = new Date(resetToken.expires_at)
        if (now > expiresAt) {
            return NextResponse.json(
                { error: 'Reset link has expired. Please request a new one.' },
                { status: 400 }
            )
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 10)

        // Update user password
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ password: passwordHash })
            .eq('id', resetToken.user_id)

        if (updateError) {
            console.error('Failed to update password:', updateError)
            return NextResponse.json(
                { error: 'Failed to reset password' },
                { status: 500 }
            )
        }

        // Mark token as used
        const { error: markUsedError } = await supabaseAdmin
            .from('password_reset_tokens')
            .update({ used: true })
            .eq('id', resetToken.id)

        if (markUsedError) {
            console.error('Failed to mark token as used:', markUsedError)
            // Don't fail the request, password was already updated
        }

        console.log('Password reset successful for user:', resetToken.user_id)

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully. You can now login with your new password.'
        })
    } catch (error: any) {
        console.error('Reset password error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        )
    }
}
