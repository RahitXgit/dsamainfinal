const APP_NAME = 'DSA Tracker'

// Base email styles for consistent branding
const emailStyles = `
    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px 30px;
        text-align: center;
    }
    .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
    }
    .content {
        padding: 40px 30px;
    }
    .content h2 {
        color: #667eea;
        font-size: 24px;
        margin-top: 0;
    }
    .content p {
        margin: 16px 0;
        color: #555;
    }
    .button {
        display: inline-block;
        padding: 14px 32px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        margin: 20px 0;
        transition: transform 0.2s;
    }
    .button:hover {
        transform: translateY(-2px);
    }
    .info-box {
        background: #f8f9fa;
        border-left: 4px solid #667eea;
        padding: 16px;
        margin: 20px 0;
        border-radius: 4px;
    }
    .footer {
        background: #f8f9fa;
        padding: 30px;
        text-align: center;
        color: #777;
        font-size: 14px;
    }
    .footer a {
        color: #667eea;
        text-decoration: none;
    }
`

export function welcomeEmailTemplate(username: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ${APP_NAME}</title>
    <style>${emailStyles}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 ${APP_NAME}</h1>
        </div>
        <div class="content">
            <h2>Welcome, ${username}! 👋</h2>
            <p>Thank you for signing up for ${APP_NAME}! We're excited to have you join our community of dedicated problem solvers.</p>
            
            <div class="info-box">
                <strong>⏳ Your account is pending approval</strong>
                <p style="margin: 8px 0 0 0;">Our team will review your registration shortly. You'll receive another email once your account has been approved and you can start tracking your DSA journey!</p>
            </div>

            <p><strong>What happens next?</strong></p>
            <ul>
                <li>Our admin will review your registration</li>
                <li>You'll receive an approval email (usually within 24 hours)</li>
                <li>Once approved, you can login and start using ${APP_NAME}</li>
            </ul>

            <p>If you have any questions in the meantime, feel free to reach out to our support team.</p>

            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The ${APP_NAME} Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>This email was sent because you registered for ${APP_NAME}.</p>
            <p>If you didn't create this account, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
    `
}

export function approvalEmailTemplate(username: string, loginUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Approved - ${APP_NAME}</title>
    <style>${emailStyles}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ${APP_NAME}</h1>
        </div>
        <div class="content">
            <h2>Congratulations, ${username}! 🎊</h2>
            <p>Great news! Your ${APP_NAME} account has been approved and is now active.</p>
            
            <div class="info-box">
                <strong>✅ You're all set!</strong>
                <p style="margin: 8px 0 0 0;">You can now login and start tracking your DSA problem-solving journey.</p>
            </div>

            <p style="text-align: center;">
                <a href="${loginUrl}" class="button">Login to Your Account</a>
            </p>

            <p><strong>What you can do now:</strong></p>
            <ul>
                <li>📅 Plan your daily DSA problems</li>
                <li>📊 Track your progress and revision history</li>
                <li>🎯 Browse curated DSA patterns and problems</li>
                <li>📈 View your learning statistics</li>
            </ul>

            <p>We're thrilled to have you as part of our community. Happy coding!</p>

            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The ${APP_NAME} Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>Need help getting started? Check out our <a href="${loginUrl.replace('/login', '/dashboard')}">dashboard</a> after logging in.</p>
            <p>If you have any questions, don't hesitate to reach out!</p>
        </div>
    </div>
</body>
</html>
    `
}

export function passwordResetTemplate(resetUrl: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - ${APP_NAME}</title>
    <style>${emailStyles}</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 ${APP_NAME}</h1>
        </div>
        <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your ${APP_NAME} account.</p>
            
            <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
            </p>

            <div class="info-box">
                <strong>⚠️ Important Security Information</strong>
                <ul style="margin: 8px 0 0 0; padding-left: 20px;">
                    <li>This link will expire in <strong>1 hour</strong></li>
                    <li>The link can only be used <strong>once</strong></li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
            </div>

            <p>If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea; font-size: 12px;">${resetUrl}</p>

            <p style="margin-top: 30px; color: #777; font-size: 14px;">
                <strong>Didn't request a password reset?</strong><br>
                If you didn't make this request, your account is still secure. You can safely ignore this email.
            </p>

            <p style="margin-top: 30px;">
                Best regards,<br>
                <strong>The ${APP_NAME} Team</strong>
            </p>
        </div>
        <div class="footer">
            <p>For security reasons, we cannot reset your password without your confirmation.</p>
            <p>If you're having trouble, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
    `
}
