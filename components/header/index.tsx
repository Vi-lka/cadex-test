import React from 'react'
import { ModeToggle } from './mode-toggle'

export default function Header() {
  return (
    <header className="sticky top-0 px-8 md:px-12 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur">
      <div className="container flex h-12 items-center justify-end mx-auto">
        <ModeToggle className="cursor-pointer" />
      </div>
    </header>
  )
}
