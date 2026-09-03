"use client"

import { useEffect, useState } from "react"

export function useIsMobile(breakpoint = 767) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)

    const update = () => setIsMobile(mediaQuery.matches)
    update()

    mediaQuery.addEventListener("change", update)
    return () => mediaQuery.removeEventListener("change", update)
  }, [breakpoint])

  return isMobile
}
