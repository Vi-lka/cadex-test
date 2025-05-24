import React from 'react'
import { cn } from '@/lib/utils'
import ControlButtons from "./buttons";

interface ControlsProps {
  children: React.ReactNode
  className?: string
}

export default function ControlBar({
  children,
  className
}: ControlsProps) {
  return (
    <aside className={cn('min-h-screen border-r border-border/40 p-4 mt-12', className)}>
      {children}
    </aside>
  )
}

export { 
  ControlButtons
}
