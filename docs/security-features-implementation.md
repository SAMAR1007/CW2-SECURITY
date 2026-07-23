# Security Features Implementation — HomeComf Platform

> **Project:** CW2-SECURITY — Web Application Security Coursework  
> **Application:** HomeComf (Nepal Travel & Hosting Platform)  
> **Date:** July 2026  
> **Repository:** https://github.com/SAMAR1007/CW2-SECURITY.git

---

## Table of Contents

1. [Overview](#1-overview)
2. [Password Strength Meter & Policy Enforcement](#2-password-strength-meter--policy-enforcement)
3. [Brute-Force Protection System](#3-brute-force-protection-system)
4. [Multi-Factor Authentication (MFA/2FA)](#4-multi-factor-authentication-mfa2fa)
5. [CAPTCHA Integration](#5-captcha-integration)
6. [Data Export & Import (Privacy Compliance)](#6-data-export--import-privacy-compliance)
7. [Enhanced Profile Security](#7-enhanced-profile-security)
8. [Security Architecture](#8-security-architecture)
9. [Files Modified & Created](#9-files-modified--created)
10. [How to Test](#10-how-to-test)

---

## 1. Overview

Six new security-focused components and three enhanced pages were implemented to address the coursework requirements for:

- **Robust password policy** with real-time strength feedback
- **Brute-force protection** with progressive delays and account lockout
- **Multi-Factor Authentication (MFA)** support via TOTP
- **CAPTCHA** verification after failed login attempts
- **Data export/import** aligned with GDPR/privacy principles
- **Secure profile personalization** with security settings management

All components are built using the existing shadcn/ui design system, Tailwind CSS, and follow the established project patterns.

---

## 2. Password Strength Meter & Policy Enforcement

### File: `app/components/ui/password-strength-meter.tsx`

### Features

| Feature | Description |
|---------|-------------|
| **Real-time scoring** | Evaluates password strength on a 0–5 scale as the user types |
| **Visual strength bar** | Color-coded progress bar (Red → Orange → Yellow → Lime → Emerald) |
| **Requirements checklist** | 7-point checklist showing met/unmet requirements |
| **Common password detection** | Blocks 50+ commonly used passwords (e.g., "password123", "qwerty") |
| **Personal info checking** | Detects if password contains user's name or email prefix |
| **Pattern detection** | Penalizes sequential characters ("123", "abc"), repeating chars ("aaa"), and keyboard patterns |
| **Weak password warning** | Shows friendly alert when strength is low |

### Scoring Algorithm

```typescript
function calculatePasswordScore(password: string, email: string, name: string): number
```

1. **Length bonuses**: +1 for ≥8 chars, +1 for ≥12 chars, +1 for ≥16 chars
2. **Complexity bonuses**: +1 for mixed case, +1 for letters+numbers, +1 for special chars
3. **Additional complexity**: +0.5 for each additional character type combination
4. **Variety bonus**: +1 for ≥10 unique characters, +0.5 for ≥15 unique
5. **Penalties**: -3 for common passwords, -1 for containing personal info, -0.5 for sequential/repeating patterns

### Requirements Checklist

- ✅ At least 8 characters
- ✅ Contains uppercase letter
- ✅ Contains lowercase letter
- ✅ Contains a number
- ✅ Contains a special character
- ✅ Not a commonly used password
- ✅ Doesn't contain your name or email

---

## 3. Brute-Force Protection System

### File: `app/components/ui/rate-limit-indicator.tsx`

### Components

| Component | Purpose |
|-----------|---------|
| `useBruteForceProtection` | React hook managing attempt counting, lockout state, and cooldown timers |
| `RateLimitIndicator` | Visual indicator showing failed attempts and remaining tries |
| `LockoutBanner` | Full-screen lockout notification with countdown timer |

### Progressive Delay Algorithm

| Failed Attempts | Cooldown Period |
|----------------|-----------------|
| 1 | None (no delay) |
| 2 | 2 seconds |
| 3 | 5 seconds |
| 4 | 15 seconds |
| 5 | 30 seconds |
| 6+ | Progressive up to 2 minutes |

### Lockout Policy

- **Max attempts before lockout:** 5 consecutive failures
- **Lockout duration:** 5 minutes
- **State persistence:** Attempts and lockout status stored in `localStorage`
- **State restoration:** On page reload, lockout state is restored from localStorage

### Visual Feedback

| Severity Level | Color | Icon | Message |
|---------------|-------|------|---------|
| Info (1-2 attempts) | Grey | ShieldAlert | "Failed attempt detected" |
| Warning (3-4 attempts) | Amber | AlertTriangle | "Multiple failed attempts" |
| Critical (5 attempts) | Red | Lock | "Account at risk" — shows lockout countdown |

### Usage in Login

The login page integrates brute-force protection through:

1. **`useBruteForceProtection()`** — hook tracks failed attempts
2. **`RateLimitIndicator`** — shown after any failed attempt
3. **CAPTCHA** — appears after 2 failed attempts
4. **`LockoutBanner`** — replaces the login form entirely after 5 failed attempts

---

## 4. Multi-Factor Authentication (MFA/2FA)

### File: `app/components/ui/mfa-setup-dialog.tsx`

### Setup Flow (5 Steps)

```
Step 1: Intro  →  Step 2: Scan QR Code  →  Step 3: Verify OTP  →  Step 4: Backup Codes  →  Step 5: Done
```

### Step Details

| Step | Description | UI Elements |
|------|-------------|-------------|
| **1. Intro** | Explains the 3-step setup process (install app → scan → verify) | Step cards with icons, "Continue" button |
| **2. Scan QR** | Displays simulated QR code + secret key for manual entry | QR code visualization, secret key with copy button |
| **3. Verify OTP** | 6-digit OTP input to confirm setup | InputOTP component (6 slots), "Verify" button |
| **4. Backup Codes** | 8 one-time backup codes with copy/download options | Grid of codes, "Copy All" and "Download" buttons |
| **5. Done** | Confirmation that 2FA is active | Success message, security checklist |

### Backup Code Management

- **8 one-time recovery codes** generated on setup
- **Copy individual codes** with per-code copy buttons
- **Copy All** button to copy all codes to clipboard
- **Download** button to save codes as a `.txt` file
- **Warning banner** informing users codes won't be shown again

### Integration

- Toggle switch in profile page to enable/disable 2FA
- Visual badge in profile sidebar showing "2FA Active" status
- `mfaEnabled` state persisted via user data from backend

---

## 5. CAPTCHA Integration

### File: `app/components/ui/math-captcha.tsx`

### Design

- **Math-based** CAPTCHA challenges (addition and multiplication)
- Randomly generated operands to prevent predictable answers
- Challenge refreshes on demand via refresh button

### Challenge Types

| Type | Example | Difficulty |
|------|---------|------------|
| Addition | `23 + 45 = ?` | Numbers 1–50 |
| Multiplication | `7 × 8 = ?` | Numbers 1–12 |

### Behavior

| State | Visual |
|-------|--------|
| **Unanswered** | Normal border, `?` placeholder |
| **Correct** | Green border + checkmark, input disabled |
| **Incorrect** | Red border + error message |
| **2+ failures** | Shows "N failed attempts" warning |
| **Refreshed** | New random challenge generated |

### Trigger Points

- Shown on login page **after 2 failed attempts**
- Must be verified before form submission is allowed
- Submit button disabled until CAPTCHA is verified
- Challenge resets on successful verification

---

## 6. Data Export & Import (Privacy Compliance)

### File: `app/components/ui/data-export-import.tsx`

### Data Export

| Feature | Description |
|---------|-------------|
| **GDPR-compliant** | Exports all user data in machine-readable JSON format |
| **Data included** | Profile info, booking history, wishlist, message metadata |
| **Progress feedback** | Loading spinner while data is being prepared |
| **Auto-download** | File downloads automatically as `nivaas-data-export-YYYY-MM-DD.json` |
| **Success confirmation** | Visual confirmation with privacy reminder |

### Export File Structure

```json
{
  "exportedAt": "2026-07-23T...",
  "platform": "HomeComf",
  "version": "1.0",
  "data": {
    "profile": { "name": "...", "email": "...", "phoneNumber": "...", "role": "..." },
    "bookings": [...],
    "savedPlaces": [...],
    "messageCount": 0,
    "notificationCount": 0
  }
}
```

### Data Import

| Feature | Description |
|---------|-------------|
| **File upload** | Drag-and-drop or click-to-upload interface |
| **Validation** | Checks file extension (`.json`) and data structure |
| **Preview** | Shows imported profile data, booking count, saved places |
| **Error handling** | Clear error messages for invalid files |
| **Privacy note** | "Data processed locally, not uploaded without confirmation" |

---

## 7. Enhanced Profile Security

### File: `app/user/profile/page.tsx`

### New Tabbed Interface

```
┌─────────────────────────────────────────────────────┐
│  [ General ]   [ 🔒 Security ]   [ Privacy ]       │
├─────────────────────────────────────────────────────┤
```

### General Tab (Enhanced)

- **Password strength meter** shown when changing password
- **Minimum length enforcement** (8 characters) before submission
- Real-time password match/mismatch indicator

### Security Tab (New)

| Section | Content |
|---------|---------|
| **MFA/2FA Setup** | Toggle to enable/disable two-factor authentication |
| **Password Policy** | Documentation of all password requirements |
| **Active Sessions** | Information about session duration (7-day expiry) |

### Privacy Tab (New)

| Section | Content |
|---------|---------|
| **Export My Data** | Download all personal data in JSON format |
| **Import Data** | Upload a previously exported data file |
| **Privacy Notice** | Information about data protection practices |

### Sidebar Enhancements

- **2FA Active badge** shown when MFA is enabled
- **Security Status** section showing MFA state
- **Role + Security indicators** at a glance

---

## 8. Security Architecture

### Component Relationship Diagram

```
Login Page
├── RateLimitIndicator (attempts tracking)
├── LockoutBanner (full lockout)
├── MathCaptcha (verification challenge)
└── useBruteForceProtection hook

Signup Page
└── PasswordStrengthMeter (validation)

Profile Page
├── PasswordStrengthMeter (password change)
├── MfaSetupDialog (2FA enrollment)
└── DataExportImport (privacy features)
```

### Data Flow

1. **Authentication**: Frontend collects credentials → sends to backend API → JWT token stored in httpOnly cookie
2. **Brute-force detection**: Failed attempts tracked client-side via `useBruteForceProtection` hook → stored in `localStorage` → progressive delays applied → full lockout at 5 attempts
3. **MFA flow**: User enables 2FA → scans QR code (simulated) → verifies with OTP → receives backup codes → status saved to user profile
4. **Data export**: User clicks "Export" → simulated data collection → JSON file downloaded to browser

---

## 9. Files Modified & Created

### New Files

| File | Lines | Purpose |
|------|-------|---------|
| `app/components/ui/password-strength-meter.tsx` | ~250 | Password strength analysis and visualization |
| `app/components/ui/math-captcha.tsx` | ~160 | Math-based CAPTCHA challenges |
| `app/components/ui/rate-limit-indicator.tsx` | ~280 | Brute-force protection hook and UI components |
| `app/components/ui/mfa-setup-dialog.tsx` | ~410 | Multi-factor authentication setup wizard |
| `app/components/ui/data-export-import.tsx` | ~310 | Data export/import with privacy compliance |
| `docs/security-features-implementation.md` | — | This documentation file |

### Modified Files

| File | Changes |
|------|---------|
| `app/auth/signup/page.tsx` | Password strength meter, mismatch validation, policy display |
| `app/auth/login/page.tsx` | CAPTCHA integration, brute-force indicators, lockout handling |
| `app/user/profile/page.tsx` | Tabbed interface (General/Security/Privacy), MFA, data export/import |

---

## 10. How to Test

### Password Strength Meter

1. Navigate to **Sign Up** page
2. Enter various passwords to see strength feedback:
   - "password" → Weak (commonly used)
   - "abc123" → Weak (too short, no uppercase/special)
   - "MyC@tJump3d0ver!" → Very Strong
3. Verify requirements checklist updates in real-time

### Brute-Force Protection

1. Navigate to **Log In** page
2. Enter incorrect credentials repeatedly:
   - After 1 failure → Rate limit indicator appears
   - After 2 failures → CAPTCHA appears
   - After 5 failures → Full lockout with countdown timer
3. Test that refreshing the page preserves lockout state

### MFA/2FA Setup

1. Navigate to **Profile → Security** tab
2. Toggle "Two-Factor Authentication" switch
3. Follow the wizard: Intro → QR Code → Verify → Backup Codes
4. Verify 2FA Active badge appears in sidebar

### Data Export

1. Navigate to **Profile → Privacy** tab
2. Click "Export" section → "Download My Data"
3. Verify JSON file downloads with profile information
4. Review exported data structure

### Data Import

1. Navigate to **Profile → Privacy** tab
2. Click "Import" section
3. Upload the previously exported JSON file
4. Verify preview shows correct data

---

## Appendix: Security Components API

### `PasswordStrengthMeter`

```tsx
<PasswordStrengthMeter
  password={string}
  email={string}        // optional, for personal info detection
  name={string}         // optional, for personal info detection
  showRequirements={boolean}  // optional, default true
  className={string}    // optional
/>
```

### `MathCaptcha`

```tsx
<MathCaptcha
  onVerify={(isValid: boolean) => void}
  disabled={boolean}     // optional
  className={string}     // optional
/>
```

### `useBruteForceProtection`

```tsx
const {
  failedAttempts,       // number
  isLockedOut,          // boolean
  cooldownRemaining,     // number (seconds)
  recordFailedAttempt,   // () => void
  resetAttempts,        // () => void
  isBlocked,            // () => boolean
} = useBruteForceProtection(maxAttempts?: number)
```

### `MfaSetupDialog`

```tsx
<MfaSetupDialog
  isEnabled={boolean}
  onToggle={(enabled: boolean) => void}
  className={string}    // optional
/>
```

### `DataExportImport`

```tsx
<DataExportImport
  userData={{
    profile: { name, email, phoneNumber, role, createdAt },
    bookings?: any[],
    wishlist?: string[],
    messages?: any[],
    notifications?: any[],
  }}
  className={string}    // optional
/>
```

---

*Documentation generated July 2026 — HomeComf Security Coursework Project*
