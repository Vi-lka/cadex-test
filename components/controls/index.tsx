import { cn } from '@/lib/utils'
import React from 'react'

export default function Controls({
  className,
}: {
  className?: string
}) {
  return (
    <aside className={cn('min-h-screen border-r shadow-inner', className)}>
      Controls
    </aside>
  )
}
