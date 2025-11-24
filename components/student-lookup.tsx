'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface StudentLookupProps {
  onSearch: (controlNumber: string) => void
  isLoading?: boolean
}

export default function StudentLookup({ onSearch, isLoading = false }: StudentLookupProps) {
  const [controlNumber, setControlNumber] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (controlNumber.trim()) {
      onSearch(controlNumber.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative group">
        <input
          type="text"
          value={controlNumber}
          onChange={(e) => setControlNumber(e.target.value)}
          placeholder="00000000"
          className="w-full bg-transparent border-b-2 border-primary/20 py-4 text-3xl md:text-4xl font-serif placeholder:text-primary/10 focus:outline-none focus:border-primary transition-colors duration-500 font-medium tracking-tight"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !controlNumber.trim()}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-primary opacity-0 group-focus-within:opacity-100 disabled:opacity-0 transition-all duration-500 hover:translate-x-1"
        >
          <ArrowRight className="w-8 h-8" />
        </button>
        <label className="absolute left-0 -top-3 text-[10px] font-mono uppercase tracking-widest text-primary/40 pointer-events-none transition-all duration-300 group-focus-within:text-primary">
          Número de Control
        </label>
      </div>
    </form>
  )
}
// RPTR Studios 2025