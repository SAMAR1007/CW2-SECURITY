#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 51: Password strength meter component
git add app/components/ui/password-strength-meter.tsx
git commit -m "feat: add password strength meter with real-time scoring and requirements checklist"

# Commit 52: Math CAPTCHA component
git add app/components/ui/math-captcha.tsx
git commit -m "feat: add math-based CAPTCHA for brute-force attack prevention"

# Commit 53: Brute-force protection system
git add app/components/ui/rate-limit-indicator.tsx
git commit -m "feat: implement brute-force protection with progressive delays and account lockout"

# Commit 54: MFA/2FA setup dialog
git add app/components/ui/mfa-setup-dialog.tsx
git commit -m "feat: add multi-factor authentication wizard with TOTP and backup codes"

# Commit 55: Data export/import component
git add app/components/ui/data-export-import.tsx
git commit -m "feat: implement GDPR-compliant data export and import functionality"

# Commit 56: Update login with CAPTCHA and brute-force protection
git add app/auth/login/page.tsx
git commit -m "security: enhance login page with CAPTCHA, rate limiting, and lockout"

# Commit 57: Update signup with password validation
git add app/auth/signup/page.tsx
git commit -m "security: enhance signup with password strength meter and mismatch validation"

# Commit 58: Update profile with security and privacy tabs
git add app/user/profile/page.tsx
git commit -m "feat: redesign profile page with security and privacy settings tabs"

# Commit 59: Security documentation
git add docs/security-features-implementation.md scripts/
git commit -m "docs: add comprehensive security features implementation documentation"

# Commit 60: Any remaining untracked files
git add -A
if git diff --cached --quiet; then
  echo "No remaining files to commit"
else
  git commit -m "chore: finalize project with remaining configuration files"
fi

echo "Phase 7 complete - All files committed"
echo ""
echo "=== Total commit count ==="
git log --oneline | wc -l
