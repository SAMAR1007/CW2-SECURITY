"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { RefreshCw, HelpCircle } from "lucide-react"

interface MathCaptchaProps {
  onVerify: (isValid: boolean) => void
  className?: string
  disabled?: boolean
}

function generateChallenge(): { a: number; b: number; operator: "+" | "×"; answer: number; display: string } {
  const operators: ("+" | "×")[] = ["+", "×"]
  const operator = operators[Math.floor(Math.random() * operators.length)]
  let a: number, b: number, answer: number

  if (operator === "+") {
    a = Math.floor(Math.random() * 50) + 1
    b = Math.floor(Math.random() * 50) + 1
    answer = a + b
  } else {
    a = Math.floor(Math.random() * 12) + 1
    b = Math.floor(Math.random() * 12) + 1
    answer = a * b
  }

  const display = `${a} ${operator} ${b}`
  return { a, b, operator, answer, display }
}

export function MathCaptcha({ onVerify, className, disabled = false }: MathCaptchaProps) {
  const [challenge, setChallenge] = useState<ReturnType<typeof generateChallenge> | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    setChallenge(generateChallenge())
  }, [])

  const refresh = useCallback(() => {
    setChallenge(generateChallenge())
    setUserAnswer("")
    setIsVerified(false)
    setError(false)
  }, [])

  const handleChange = (value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return
    setUserAnswer(value)
    setError(false)

    if (challenge && value !== "") {
      const numValue = Number.parseInt(value, 10)
      if (numValue === challenge.answer) {
        setIsVerified(true)
        setError(false)
        onVerify(true)
      } else {
        setIsVerified(false)
        onVerify(false)
        if (value.length >= challenge.answer.toString().length) {
          setError(true)
          setAttempts((prev) => prev + 1)
        }
      }
    } else {
      setIsVerified(false)
      onVerify(false)
    }
  }

  if (!challenge) return null

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-500">
          <HelpCircle className="h-3.5 w-3.5" />
          Security Check
        </label>
        {attempts >= 2 && (
          <span className="text-[10px] text-amber-600 font-medium">
            {attempts} failed attempt{attempts > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="relative">
            <div
              className={cn(
                "flex items-center rounded-xl border px-4 py-3 bg-zinc-50",
                isVerified
                  ? "border-emerald-300 bg-emerald-50/50"
                  : error
                    ? "border-red-300 bg-red-50/50"
                    : "border-zinc-200",
                disabled && "opacity-50 pointer-events-none",
              )}
            >
              <span className="text-base font-bold text-zinc-800 mr-3 min-w-[90px]">
                {challenge.display}
              </span>
              <span className="text-base font-bold text-zinc-400 mr-2">=</span>
              <input
                type="text"
                inputMode="numeric"
                value={userAnswer}
                onChange={(e) => handleChange(e.target.value)}
                disabled={disabled || isVerified}
                placeholder="?"
                maxLength={4}
                className={cn(
                  "w-16 bg-transparent text-center text-lg font-bold outline-none",
                  isVerified ? "text-emerald-600" : error ? "text-red-500" : "text-zinc-800",
                  disabled && "cursor-not-allowed",
                )}
                autoComplete="off"
              />
              {isVerified && (
                <span className="ml-2 text-xs font-bold text-emerald-600">✓</span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={disabled}
          className={cn(
            "h-[46px] w-[46px] shrink-0 rounded-xl border border-zinc-200 flex items-center justify-center transition-all hover:bg-zinc-50 active:scale-95",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          title="Generate new challenge"
        >
          <RefreshCw className="h-4 w-4 text-zinc-500" />
        </button>
      </div>

      {error && (
        <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          Incorrect answer. Try again or refresh the challenge.
        </p>
      )}
      {isVerified && (
        <p className="text-xs font-medium text-emerald-600 animate-in fade-in slide-in-from-top-1 duration-200">
          Security check passed ✓
        </p>
      )}
    </div>
  )
}
