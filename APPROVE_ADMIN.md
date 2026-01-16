-- Manually approve the admin user
UPDATE user_approvals 
SET status = 'approved', 
    reviewed_at = NOW(), 
    reviewed_by = (SELECT id FROM users WHERE email = 'rahitdhara.main@gmail.com')
WHERE email = 'rahitdhara.main@gmail.com';
