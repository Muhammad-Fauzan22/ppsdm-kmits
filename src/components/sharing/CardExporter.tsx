'use client'

import { useState, type RefObject } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface CardExporterProps {
  cardRef: RefObject<HTMLDivElement | null>
  filename?: string
}

export function CardExporter({ cardRef, filename = 'progress-card' }: CardExporterProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!cardRef.current) return

    setIsExporting(true)
    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default

      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Error exporting card:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PNG
        </>
      )}
    </button>
  )
}
