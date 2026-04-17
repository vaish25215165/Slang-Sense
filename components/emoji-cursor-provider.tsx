'use client'

import { useEffect, useState, type PropsWithChildren } from 'react'
import { EmojiCursor } from '@cursorify/cursors'
import { CursorifyProvider } from '@cursorify/react'

export function EmojiCursorProvider({ children }: PropsWithChildren) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)')
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    const updateEnabled = () => {
      setEnabled(!coarsePointer.matches && !prefersReducedMotion.matches)
    }

    updateEnabled()
    coarsePointer.addEventListener('change', updateEnabled)
    prefersReducedMotion.addEventListener('change', updateEnabled)

    return () => {
      coarsePointer.removeEventListener('change', updateEnabled)
      prefersReducedMotion.removeEventListener('change', updateEnabled)
    }
  }, [])

  return (
    <CursorifyProvider
      cursor={<EmojiCursor />}
      defaultCursorVisible={false}
      delay={2}
      opacity={1}
      breakpoint={768}
      enabled={enabled}
    >
      {children}
    </CursorifyProvider>
  )
}
