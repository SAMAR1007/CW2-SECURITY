"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { cn } from "@/lib/utils"
import { ShieldAlert, Clock, AlertTriangle, Lock } from "lucide-react"

interface RateLimitIndicatorProps {
  /** Number of consecutive failed attempts */
  failedAttempts: number
  /** Maximum allowed attempts before lockout */
  maxAttempts?: number
  className?: string
}

function calculateCooldown(attempts: number): number {
  // Progressive delay: 2s, 5s, 15s, 30s, 60s, 120s...
  if (attempts <= 1) return 0
  if (attempts === 2) return 2
  if (attempts === 3) return 5
  if (attempts === 4) return 15
  if (attempts === 5) return 30
  return Math.min(60 * 2, Math.pow(2, attempts - 4) * 15) // Max 2 min
}

export function useBruteForceProtection(maxAttempts = 5) {
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [cooldownRemaining, setCooldownRemaining] = useState(0)
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const recordFailedAttempt = useCallback(() => {
    setFailedAttempts((prev) => {
      const newCount = prev + 1

      // Check if max attempts reached
      if (newCount >= maxAttempts) {
        setIsLockedOut(true)
        // Lockout for 5 minutes
        const lockoutEnd = Date.now() + 5 * 60 * 1000
        setCooldownEnd(lockoutEnd)
        setCooldownRemaining(5 * 60)

        if (typeof window !== "undefined") {
          localStorage.setItem("nivaas:lockoutEnd", String(lockoutEnd))
        }
      } else if (newCount > 1) {
        // Apply progressive cooldown
        const delay = calculateCooldown(newCount)
        const cooldownUntil = Date.now() + delay * 1000
        setCooldownEnd(cooldownUntil)
        setCooldownRemaining(delay)
      }

      return newCount
    })
  }, [maxAttempts])

  const resetAttempts = useCallback(() => {
    setFailedAttempts(0)
    setIsLockedOut(false)
    setCooldownRemaining(0)
    setCooldownEnd(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("nivaas:attempts")
      localStorage.removeItem("nivaas:lockoutEnd")
    }
  }, [])

  const isBlocked = useCallback((): boolean => {
    if (isLockedOut) return true
    if (cooldownEnd && Date.now() < cooldownEnd) return true
    return false
  }, [isLockedOut, cooldownEnd])

  // Restore state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAttempts = localStorage.getItem("nivaas:attempts")
        const savedLockout = localStorage.getItem("nivaas:lockoutEnd")

        if (savedLockout) {
          const lockoutTime = Number.parseInt(savedLockout, 10)
          if (Date.now() < lockoutTime) {
            setIsLockedOut(true)
            setCooldownEnd(lockoutTime)
            setCooldownRemaining(Math.ceil((lockoutTime - Date.now()) / 1000))
          } else {
            localStorage.removeItem("nivaas:lockoutEnd")
          }
        }

        if (savedAttempts) {
          const attempts = Number.parseInt(savedAttempts, 10)
          if (attempts > 0 && !savedLockout) {
            setFailedAttempts(attempts)
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [])

  // Save attempts to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && failedAttempts > 0) {
      localStorage.setItem("nivaas:attempts", String(failedAttempts))
    }
  }, [failedAttempts])

  // Cooldown timer
  useEffect(() => {
    if (cooldownEnd && Date.now() < cooldownEnd) {
      timerRef.current = setInterval(() => {
        const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000)
        if (remaining <= 0) {
          setCooldownRemaining(0)
          setCooldownEnd(null)
          if (!isLockedOut) {
            setFailedAttempts(0)
          }
          if (timerRef.current) clearInterval(timerRef.current)
        } else {
          setCooldownRemaining(remaining)
        }
      }, 1000)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [cooldownEnd, isLockedOut])

  return {
    failedAttempts,
    isLockedOut,
    cooldownRemaining,
    recordFailedAttempt,
    resetAttempts,
    isBlocked,
  }
}

export function RateLimitIndicator({
  failedAttempts,
  maxAttempts = 5,
  className,
}: RateLimitIndicatorProps) {
  if (failedAttempts === 0) return null

  const remaining = maxAttempts - failedAttempts
  const severity = remaining <= 1 ? "critical" : remaining <= 2 ? "warning" : "info"

  return (
    <div
      className={cn(
        "rounded-xl border p-3 space-y-2 transition-all animate-in fade-in slide-in-from-top-2 duration-300",
        severity === "critical" && "bg-red-50 border-red-200",
        severity === "warning" && "bg-amber-50 border-amber-200",
        severity === "info" && "bg-zinc-50 border-zinc-200",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {severity === "critical" ? (
            <Lock className="h-4 w-4 text-red-500" />
          ) : severity === "warning" ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          ) : (
            <ShieldAlert className="h-4 w-4 text-zinc-500" />
          )}
          <span
            className={cn(
              "text-xs font-bold uppercase tracking-wider",
              severity === "critical" && "text-red-700",
              severity === "warning" && "text-amber-700",
              severity === "info" && "text-zinc-600",
            )}
          >
            {severity === "critical"
              ? "Account at risk"
              : severity === "warning"
                ? "Multiple failed attempts"
                : "Failed attempt detected"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 rounded-full bg-zinc-200 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              severity === "critical" ? "bg-red-500" : severity === "warning" ? "bg-amber-500" : "bg-zinc-400",
            )}
            style={{ width: `${(failedAttempts / maxAttempts) * 100}%` }}
          />
        </div>
        <span
          className={cn(
            "text-[10px] font-bold",
            severity === "critical" && "text-red-600",
            severity === "warning" && "text-amber-600",
            "text-zinc-500",
          )}
        >
          {remaining}/{maxAttempts} attempts left
        </span>
      </div>

      {severity === "critical" && (
        <p className="text-xs font-medium text-red-600">
          Too many failed attempts will temporarily lock your account for security.
        </p>
      )}
    </div>
  )
}

export function LockoutBanner({
  cooldownRemaining,
  onRetry,
  className,
}: {
  cooldownRemaining: number
  onRetry?: () => void
  className?: string
}) {
  const minutes = Math.floor(cooldownRemaining / 60)
  const seconds = cooldownRemaining % 60

  return (
    <div
      className={cn(
        "rounded-2xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-6 text-center space-y-4",
        className,
      )}
    >
      <div className="mx-auto h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
        <Lock className="h-7 w-7 text-red-600" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-red-900">Account Temporarily Locked</h3>
        <p className="text-sm text-red-700">
          Too many failed login attempts. For your security, please wait before trying again.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-red-600">
        <Clock className="h-5 w-5" />
        <span className="text-2xl font-black tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </span>
      </div>

      <p className="text-xs text-red-500">
        This is a security measure to protect your account from unauthorized access.
      </p>

      {onRetry && cooldownRemaining <= 0 && (
        <button
          onClick={onRetry}
          className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-all active:scale-[0.98]"
        >
          Try again
        </button>
      )}
    </div>
  )
}
