#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 16: Middleware for route protection
git add middleware.ts
git commit -m "feat: add JWT-based middleware for role-protected routes"

# Commit 17: Auth server actions
git add lib/actions/auth-action.ts
git commit -m "feat: implement auth server actions with httpOnly cookie management"

# Commit 18: Login page
git add app/auth/login/page.tsx
git commit -m "feat: build login page with secure JWT token handling"

# Commit 19: Signup page
git add app/auth/signup/page.tsx
git commit -m "feat: build signup page with user registration flow"

# Commit 20: Forgot password page
git add app/auth/forgot-password/page.tsx
git commit -m "feat: add forgot password page with OTP email flow"

# Commit 21: Reset password page
git add app/auth/reset-password/page.tsx
git commit -m "feat: add reset password page with OTP verification"

echo "Phase 3 complete - Authentication system committed"
