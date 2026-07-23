"use client"

import { useMemo } from "react"
import { cn } from "@/lib/utils"
import { Check, X, AlertTriangle } from "lucide-react"

interface PasswordStrengthMeterProps {
  password: string
  email?: string
  name?: string
  showRequirements?: boolean
  className?: string
}

interface PasswordRequirement {
  label: string
  met: boolean
}

function getStrengthColor(score: number): string {
  if (score <= 1) return "bg-red-500"
  if (score <= 2) return "bg-orange-500"
  if (score <= 3) return "bg-yellow-500"
  if (score <= 4) return "bg-lime-500"
  return "bg-emerald-500"
}

function getStrengthLabel(score: number): string {
  if (score <= 1) return "Weak"
  if (score <= 2) return "Fair"
  if (score <= 3) return "Good"
  if (score <= 4) return "Strong"
  return "Very Strong"
}

function getStrengthTextColor(score: number): string {
  if (score <= 1) return "text-red-600"
  if (score <= 2) return "text-orange-600"
  if (score <= 3) return "text-yellow-600"
  if (score <= 4) return "text-lime-600"
  return "text-emerald-600"
}

function getStrengthBgColor(score: number): string {
  if (score <= 1) return "bg-red-50 border-red-200"
  if (score <= 2) return "bg-orange-50 border-orange-200"
  if (score <= 3) return "bg-yellow-50 border-yellow-200"
  if (score <= 4) return "bg-lime-50 border-lime-200"
  return "bg-emerald-50 border-emerald-200"
}

const COMMON_PASSWORDS = new Set([
  "password", "password123", "123456", "12345678", "123456789",
  "qwerty", "qwerty123", "abc123", "letmein", "welcome",
  "monkey", "dragon", "master", "admin", "login",
  "password1", "1234567890", "123123", "iloveyou", "trustno1",
  "sunshine", "princess", "football", "baseball", "welcome123",
])

export function calculatePasswordScore(password: string, email = "", name = ""): number {
  if (!password) return 0

  let score = 0

  // Length scoring
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1

  // Complexity scoring
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/[a-z]/.test(password) && /[0-9]/.test(password)) score += 1
  if (/[a-z]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1

  // Additional complexity
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score += 0.5
  if (/[A-Z]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 0.5
  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 0.5

  // Variety bonus
  const uniqueChars = new Set(password).size
  if (uniqueChars >= 10) score += 1
  if (uniqueChars >= 15) score += 0.5

  // Check for common patterns
  const lowerPass = password.toLowerCase()
  if (COMMON_PASSWORDS.has(lowerPass)) score = Math.max(0, score - 3)

  // Check if contains personal info
  if (email) {
    const emailPrefix = email.split("@")[0].toLowerCase()
    if (lowerPass.includes(emailPrefix) || emailPrefix.includes(lowerPass)) score -= 1
  }
  if (name) {
    const nameLower = name.toLowerCase().split(" ")[0]
    if (lowerPass.includes(nameLower)) score -= 1
  }

  // Sequential/repeating character penalty
  if (/(.)\1{2,}/.test(password)) score -= 0.5
  if (/123|234|345|456|567|678|789|987|876|765|654|543|432|321/.test(password)) score -= 0.5
  if (/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(password)) score -= 0.5

  return Math.max(0, Math.min(5, score))
}

export function getPasswordRequirements(password: string, email = "", name = ""): PasswordRequirement[] {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /[0-9]/.test(password) },
    { label: "Contains a special character", met: /[^a-zA-Z0-9]/.test(password) },
    { label: "Not a commonly used password", met: !COMMON_PASSWORDS.has(password.toLowerCase()) && password.length >= 1 },
    { label: "Doesn't contain your name or email", met: !email || !name ? true : !password.toLowerCase().includes(email.split("@")[0].toLowerCase()) && !password.toLowerCase().includes(name.toLowerCase().split(" ")[0]) },
  ]
}

export function PasswordStrengthMeter({
  password,
  email = "",
  name = "",
  showRequirements = true,
  className,
}: PasswordStrengthMeterProps) {
  const score = useMemo(
    () => calculatePasswordScore(password, email, name),
    [password, email, name],
  )

  const requirements = useMemo(
    () => getPasswordRequirements(password, email, name),
    [password, email, name],
  )

  const percentage = (score / 5) * 100
  const strengthColor = getStrengthColor(score)
  const strengthLabel = getStrengthLabel(score)
  const textColor = getStrengthTextColor(score)
  const bgColor = getStrengthBgColor(score)

  if (!password) return null

  return (
    <div className={cn("space-y-3", className)}>
      {/* Strength bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className={cn("text-xs font-bold uppercase tracking-wider", textColor)}>
            {strengthLabel}
          </span>
          <span className="text-[10px] font-medium text-zinc-400">
            {password.length} char{password.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className={cn("h-full rounded-full transition-all duration-500 ease-out", strengthColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className={cn("rounded-xl border p-3 space-y-1.5 transition-colors", bgColor)}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
            Password requirements
          </p>
          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              {req.met ? (
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
              )}
              <span
                className={cn(
                  "text-xs transition-colors",
                  req.met ? "text-zinc-700 font-medium" : "text-zinc-400",
                )}
              >
                {req.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Toggle password visibility hint */}
      {score <= 2 && password.length >= 1 && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs font-medium text-amber-700">
            This password is too weak. Consider adding more variety with uppercase letters, numbers, and symbols.
          </p>
        </div>
      )}
    </div>
  )
}
