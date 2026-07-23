"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/app/components/ui/input-otp"
import { Switch } from "@/app/components/ui/switch"
import {
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  Download,
  AlertTriangle,
  KeyRound,
  Loader2,
} from "lucide-react"

interface MfaSetupDialogProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
  className?: string
}

const MOCK_SECRET = "JBSWY3DPEB2GQZLSMUQQ"
const MOCK_BACKUP_CODES = [
  "A1B2-C3D4-E5F6",
  "G7H8-I9J0-K1L2",
  "M3N4-O5P6-Q7R8",
  "S9T0-U1V2-W3X4",
  "Y5Z6-AB7C-DE8F",
  "GH9I-JK0L-MN1O",
  "PQ2R-ST3U-VW4X",
  "YZ5A-BC6D-EF7G",
]

export function MfaSetupDialog({ isEnabled, onToggle, className }: MfaSetupDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"intro" | "scan" | "verify" | "backup" | "done">("intro")
  const [otpValue, setOtpValue] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const handleVerify = async () => {
    setVerifying(true)
    // Simulate TOTP verification
    await new Promise((r) => setTimeout(r, 1000))
    setVerifying(false)
    setVerified(true)
    setStep("backup")
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyAllCodes = () => {
    navigator.clipboard.writeText(MOCK_BACKUP_CODES.join("\n"))
    setCopied("all")
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDownloadBackupCodes = () => {
    const blob = new Blob(
      [
        "HomeComf - Two-Factor Authentication Backup Codes\n",
        "Generated: " + new Date().toLocaleDateString() + "\n",
        "".concat("━").repeat(40) + "\n\n",
        ...MOCK_BACKUP_CODES.map((c) => `  ${c}\n`),
        "\n".concat("━").repeat(40) + "\n",
        "Keep these codes in a secure place.\n",
        "Each code can be used only once.\n",
      ],
      { type: "text/plain" },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "nivaas-2fa-backup-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleEnable = () => {
    onToggle(true)
    setOpen(false)
    setStep("intro")
    setOtpValue("")
    setVerified(false)
  }

  const handleDisable = () => {
    onToggle(false)
    setOpen(false)
  }

  const resetDialog = () => {
    setStep("intro")
    setOtpValue("")
    setVerified(false)
    setVerifying(false)
    setBackupCodesRevealed(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) resetDialog()
      }}
    >
      <DialogTrigger asChild>
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all hover:border-orange-200 hover:bg-orange-50/30",
            isEnabled ? "border-emerald-200 bg-emerald-50/30" : "border-zinc-200",
            className,
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center",
                isEnabled ? "bg-emerald-100 text-emerald-600" : "bg-zinc-100 text-zinc-500",
              )}
            >
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-800">Two-Factor Authentication</p>
              <p className="text-xs text-zinc-500">
                {isEnabled ? "Enabled - Extra security layer active" : "Add an extra layer of security"}
              </p>
            </div>
          </div>
          <Switch checked={isEnabled} onCheckedChange={(checked) => (checked ? setOpen(true) : handleDisable())} />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md" showCloseButton={step === "done"}>
        {step === "intro" && (
          <>
            <DialogHeader>
              <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
              <DialogDescription>
                Protect your account with an additional layer of security using an authenticator app.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-zinc-200 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Step 1: Install an authenticator app</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Download Google Authenticator, Authy, or Microsoft Authenticator on your mobile device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                    <KeyRound className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Step 2: Scan the QR code</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Open your authenticator app and scan the QR code, or enter the setup key manually.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-800">Step 3: Verify the code</p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Enter the 6-digit verification code from your authenticator app to confirm setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setOpen(false)} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => setStep("scan")}
                className="flex-1 rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {step === "scan" && (
          <>
            <DialogHeader>
              <DialogTitle>Scan QR Code</DialogTitle>
              <DialogDescription>
                Scan the QR code below with your authenticator app, or enter the setup key manually.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-4 py-4">
              {/* Simulated QR code */}
              <div className="h-48 w-48 rounded-2xl bg-white border-2 border-zinc-200 p-3 shadow-md">
                <div className="h-full w-full bg-zinc-900 rounded-xl flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-4 w-4 rounded-sm",
                          Math.random() > 0.5 ? "bg-white" : "bg-zinc-800",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center space-y-1">
                <p className="text-xs font-medium text-zinc-500">Or enter the setup key manually:</p>
                <div className="flex items-center justify-center gap-2">
                  <code className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm font-mono font-bold text-zinc-700 tracking-wider select-all">
                    {MOCK_SECRET}
                  </code>
                  <button
                    onClick={() => handleCopyCode(MOCK_SECRET)}
                    className="h-8 w-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-all"
                    title="Copy secret key"
                  >
                    {copied === MOCK_SECRET ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("intro")} className="flex-1 rounded-xl">
                Back
              </Button>
              <Button
                onClick={() => setStep("verify")}
                className="flex-1 rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]"
              >
                I've scanned the code
              </Button>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <DialogHeader>
              <DialogTitle>Verify Setup</DialogTitle>
              <DialogDescription>
                Enter the 6-digit verification code from your authenticator app to confirm the setup.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center gap-6 py-6">
              <InputOTP
                maxLength={6}
                value={otpValue}
                onChange={(value) => setOtpValue(value)}
                disabled={verifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              {verified && (
                <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Check className="h-5 w-5" />
                  <span className="text-sm font-bold">Code verified successfully!</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("scan")} className="flex-1 rounded-xl">
                Back
              </Button>
              <Button
                onClick={handleVerify}
                disabled={otpValue.length !== 6 || verifying}
                className="flex-1 rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]"
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
          </>
        )}

        {step === "backup" && (
          <>
            <DialogHeader>
              <DialogTitle>Backup Codes</DialogTitle>
              <DialogDescription>
                Save these backup codes in a secure place. Each code can be used once if you lose access to your authenticator app.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-xs font-medium text-amber-700">
                  These codes will not be shown again. Download or copy them now.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {MOCK_BACKUP_CODES.map((code) => (
                  <div
                    key={code}
                    className="flex items-center justify-between rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-2"
                  >
                    <code className="text-xs font-mono font-bold text-zinc-700 tracking-wider">{code}</code>
                    <button
                      onClick={() => handleCopyCode(code)}
                      className="h-6 w-6 rounded hover:bg-zinc-200 flex items-center justify-center transition-all"
                    >
                      {copied === code ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-zinc-400" />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleCopyAllCodes}
                  className="flex-1 rounded-xl border-zinc-200"
                >
                  {copied === "all" ? (
                    <div className="flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Copied
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Copy className="h-4 w-4" /> Copy All
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadBackupCodes}
                  className="flex-1 rounded-xl border-zinc-200"
                >
                  <Download className="h-4 w-4 mr-1.5" /> Download
                </Button>
              </div>
            </div>

            <Button onClick={handleEnable} className="w-full rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]">
              Enable Two-Factor Authentication
            </Button>
          </>
        )}

        {step === "done" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
                2FA Enabled
              </DialogTitle>
              <DialogDescription>
                Two-factor authentication is now active on your account. You'll need a verification code from your
                authenticator app each time you sign in.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-emerald-800">Your account is now more secure</p>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    <li>• 2FA required for all new sign-ins from unrecognized devices</li>
                    <li>• Backup codes available for account recovery</li>
                    <li>• You can disable 2FA anytime from security settings</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={() => setOpen(false)} className="w-full rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]">
              Done
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
