import { cn } from '@/lib/utils'
import React from 'react'

export default function Controls({
  className,
}: {
  className?: string
}) {
  return (
    <aside className={cn('min-h-screen border-r border-border/40', className)}>
      Controls
    </aside>
  )
}
