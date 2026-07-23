"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import {
  Download,
  Upload,
  FileJson,
  Check,
  AlertTriangle,
  Loader2,
  Shield,
  Database,
  Trash2,
  Info,
} from "lucide-react"

interface UserData {
  profile: {
    name: string
    email: string
    phoneNumber: string
    role: string
    createdAt?: string
  }
  bookings?: any[]
  wishlist?: string[]
  messages?: any[]
  notifications?: any[]
}

interface DataExportImportProps {
  userData: UserData
  className?: string
}

export function DataExportImport({ userData, className }: DataExportImportProps) {
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportDone, setExportDone] = useState(false)
  const [importedData, setImportedData] = useState<UserData | null>(null)
  const [importError, setImportError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    setExporting(true)

    // Simulate data collection delay
    await new Promise((r) => setTimeout(r, 1500))

    const exportData = {
      exportedAt: new Date().toISOString(),
      platform: "HomeComf",
      version: "1.0",
      data: {
        profile: userData.profile,
        bookings: userData.bookings || [],
        savedPlaces: userData.wishlist || [],
        messageCount: userData.messages?.length || 0,
        notificationCount: userData.notifications?.length || 0,
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `nivaas-data-export-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    setExporting(false)
    setExportDone(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError("")

    if (!file.name.endsWith(".json")) {
      setImportError("Please select a valid JSON file exported from HomeComf.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        // Validate structure
        if (!data.data || !data.data.profile) {
          setImportError("Invalid file format. Please use a HomeComf data export file.")
          return
        }

        setImportedData(data.data)
      } catch {
        setImportError("Could not parse the file. Please ensure it's a valid JSON file.")
      }
    }
    reader.readAsText(file)
  }

  const handleImportConfirm = () => {
    // In a real app, this would send the data to the backend
    alert("Import functionality: In a production environment, this would import the selected data fields into your account after confirmation.")
    setImportDialogOpen(false)
    setImportedData(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const resetExport = () => {
    setExportDone(false)
    setExportDialogOpen(false)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Export Section */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 cursor-pointer transition-all hover:border-blue-200 hover:bg-blue-50/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800">Export My Data</p>
                <p className="text-xs text-zinc-500">
                  Download all your personal data in JSON format (GDPR compliant)
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              Export Your Data
            </DialogTitle>
            <DialogDescription>
              Download a copy of your personal data stored on HomeComf. This is compliant with data privacy regulations.
            </DialogDescription>
          </DialogHeader>

          {exportDone ? (
            <div className="space-y-4 py-4">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-emerald-800">Data exported successfully!</p>
                <p className="text-xs text-emerald-600 mt-1">
                  Your data file has been downloaded. It contains all the information associated with your account.
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">
                  This file contains your personal information. Keep it secure and delete it when no longer needed.
                </p>
              </div>

              <Button onClick={resetExport} className="w-full rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]">
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="rounded-xl border border-zinc-200 divide-y divide-zinc-100">
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm text-zinc-600">Profile information</span>
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm text-zinc-600">Booking history</span>
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm text-zinc-600">Saved places (wishlist)</span>
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-3">
                  <span className="text-sm text-zinc-600">Messages and conversations</span>
                  <span className="text-xs text-zinc-400">Metadata only</span>
                </div>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2">
                <Shield className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Your data is exported in a machine-readable JSON format. You can import it to another service or keep it
                  for your records.
                </p>
              </div>

              <Button
                onClick={handleExport}
                disabled={exporting}
                className="w-full rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]"
              >
                {exporting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Preparing your data...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download My Data
                  </div>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Import Section */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 cursor-pointer transition-all hover:border-purple-200 hover:bg-purple-50/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800">Import Data</p>
                <p className="text-xs text-zinc-500">
                  Restore data from a previous export or migrate from another service
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="rounded-lg text-purple-600 hover:text-purple-700 hover:bg-purple-50">
              <Upload className="h-4 w-4 mr-1" /> Import
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-600" />
              Import Data
            </DialogTitle>
            <DialogDescription>
              Upload a previously exported HomeComf data file to restore your information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!importedData ? (
              <>
                <div
                  className="rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-10 w-10 mx-auto text-zinc-400 mb-3" />
                  <p className="text-sm font-bold text-zinc-700">Click to upload a JSON file</p>
                  <p className="text-xs text-zinc-500 mt-1">Only HomeComf export files are supported</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {importError && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-xs font-medium text-red-600">{importError}</p>
                  </div>
                )}

                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Privacy Note</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Your imported data is processed locally in your browser and is not uploaded to any server without your
                    explicit confirmation.
                  </p>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start gap-2">
                  <FileJson className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-emerald-800">File loaded successfully</p>
                    <p className="text-[11px] text-emerald-600">
                      Found data for: {importedData.profile?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 divide-y divide-zinc-100">
                  {importedData.profile && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-zinc-600">Profile data</span>
                      <span className="text-xs text-emerald-600 font-medium">Available</span>
                    </div>
                  )}
                  {importedData.bookings && importedData.bookings.length > 0 && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-zinc-600">Bookings</span>
                      <span className="text-xs text-zinc-500">{importedData.bookings.length} items</span>
                    </div>
                  )}
                  {importedData.wishlist && importedData.wishlist.length > 0 && (
                    <div className="flex items-center justify-between p-3">
                      <span className="text-sm text-zinc-600">Saved places</span>
                      <span className="text-xs text-zinc-500">{importedData.wishlist.length} items</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setImportedData(null)
                      setImportError("")
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                    className="flex-1 rounded-xl"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Clear
                  </Button>
                  <Button
                    onClick={handleImportConfirm}
                    className="flex-1 rounded-xl bg-[#FF5A1F] hover:bg-[#e44e1a]"
                  >
                    <Upload className="h-4 w-4 mr-1" /> Import
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
