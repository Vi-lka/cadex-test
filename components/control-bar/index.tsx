import React from 'react'
import { cn } from '@/lib/utils'
import ControlButtons from "./buttons";
import PrimitivesList from "./primitives-list";

interface ControlsProps {
  children: React.ReactNode
  className?: string
}

export default function ControlBar({
  children,
  className
}: ControlsProps) {
  return (
    <aside className={cn('min-h-screen flex flex-col justify-between gap-2 border-r border-border/40 p-4 pt-16', className)}>
      {children}
    </aside>
  )
}

export { 
  ControlButtons,
  PrimitivesList
}
