'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { GA_MEASUREMENT_ID, pageview } from '../lib/gtag'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only track if GA_MEASUREMENT_ID is configured
    if (!GA_MEASUREMENT_ID) {
      return
    }

    // Construct URL properly
    const searchParamsString = searchParams.toString()
    const url = searchParamsString ? `${pathname}?${searchParamsString}` : pathname
    
    // Track page view
    pageview(url)
  }, [pathname, searchParams])

  return null
} 