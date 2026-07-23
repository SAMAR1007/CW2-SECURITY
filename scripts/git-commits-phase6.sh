#!/bin/bash
set -e
cd /c/SAMAR/FINALSEC

# Commit 43: Admin dashboard
git add app/admin/page.tsx
git commit -m "feat: build admin dashboard with system stats and quick actions"

# Commit 44: Admin user management
git add app/admin/users/page.tsx app/admin/users/create/page.tsx app/admin/users/\[id\]/page.tsx app/admin/users/\[id\]/edit/page.tsx
git commit -m "feat: add admin user CRUD with pagination and search"

# Commit 45: Admin host approval
git add app/admin/hosts/page.tsx
git commit -m "feat: build admin host approval workflow with ID verification"

# Commit 46: Admin reports management
git add app/admin/reports/page.tsx
git commit -m "feat: add admin reports management with status tracking"

# Commit 47: Geocode API route
git add app/api/geocode/route.ts
git commit -m "feat: add geocode API route for location search and reverse lookup"

# Commit 48: User profile page
git add app/user/profile/page.tsx
git commit -m "feat: build user profile with avatar upload and account settings"

# Commit 49: Search and host legacy pages
git add app/components/search-page.tsx app/components/signup-page.tsx app/components/login-page.tsx
git commit -m "feat: add legacy search, signup and login components"

# Commit 50: Tests and E2E
git add __tests__/ e2e/homecomf.spec.ts e2e/tsconfig.json
git commit -m "test: add unit tests and Playwright E2E test suite"

echo "Phase 6 complete - Admin features committed"
