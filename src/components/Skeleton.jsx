import React from 'react'

export default function Skeleton({ className = 'h-4 bg-surface-secondary rounded-xl', style = {} }) {
  return <div aria-hidden="true" className={`animate-pulse ${className}`} style={style} />
}
