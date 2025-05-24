import React from 'react'
import { ModeToggle } from './mode-toggle'

export default function Header() {
  return (
    <header className="absolute top-0 px-8 md:px-12 z-50 w-full border-b border-border/40 bg-background/10 backdrop-blur-xs">
      <div className="container flex h-12 items-center justify-between mx-auto">
        <div className=''></div>
        <ModeToggle className="cursor-pointer" />
      </div>
    </header>
  )
}
