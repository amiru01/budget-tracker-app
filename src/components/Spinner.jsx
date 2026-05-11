import React from 'react'

export default function Spinner({ size = 'md', className = '' }) {
  const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }
  const cls = `${sizeMap[size] || sizeMap.md} rounded-full border-2 border-slate-700 border-t-emerald-500 animate-spin shadow-[0_0_20px_rgba(16,185,129,0.35)] ${className}`

  return <div aria-hidden="true" className={cls} />
}
