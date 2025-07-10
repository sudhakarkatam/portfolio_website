"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page views with enhanced data
    const trackPageView = async () => {
      try {
        const analyticsData = {
          event: "page_view",
          page: pathname,
          data: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language,
            searchParams: searchParams.toString(),
            sessionId: getOrCreateSessionId(),
          },
        }

        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(analyticsData),
        })

        // Also send to console for real-time monitoring
        console.log("📊 Analytics:", analyticsData)
      } catch (error) {
        console.error("Analytics tracking error:", error)
      }
    }

    trackPageView()
  }, [pathname, searchParams])

  // Track user interactions in real-time
  useEffect(() => {
    const trackInteraction = (event: Event) => {
      const target = event.target as HTMLElement

      // Track clicks on important elements
      if (target.matches('a[href*="amazon"], a[href*="flipkart"], a[href*="affiliate"]')) {
        sendAnalytics("affiliate_click", {
          link: (target as HTMLAnchorElement).href,
          text: target.textContent,
          page: pathname,
        })
      }

      // Track product card clicks
      if (target.closest("[data-product-id]")) {
        const productId = target.closest("[data-product-id]")?.getAttribute("data-product-id")
        sendAnalytics("product_click", {
          productId,
          page: pathname,
        })
      }

      // Track search usage
      if (target.matches('input[placeholder*="Search"], input[placeholder*="వెతకండి"]')) {
        sendAnalytics("search_focus", {
          page: pathname,
        })
      }
    }

    const trackScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)

      // Track significant scroll milestones
      if (scrollPercent > 0 && scrollPercent % 25 === 0) {
        sendAnalytics("scroll_milestone", {
          scrollPercent,
          page: pathname,
        })
      }
    }

    // Track time spent on page
    const startTime = Date.now()
    const trackTimeSpent = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      sendAnalytics("time_on_page", {
        timeSpent,
        page: pathname,
      })
    }

    document.addEventListener("click", trackInteraction)
    document.addEventListener("scroll", trackScroll)
    window.addEventListener("beforeunload", trackTimeSpent)

    return () => {
      document.removeEventListener("click", trackInteraction)
      document.removeEventListener("scroll", trackScroll)
      window.removeEventListener("beforeunload", trackTimeSpent)
    }
  }, [pathname])

  return null
}

// Helper functions
function getOrCreateSessionId() {
  let sessionId = sessionStorage.getItem("analytics_session_id")
  if (!sessionId) {
    sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    sessionStorage.setItem("analytics_session_id", sessionId)
  }
  return sessionId
}

async function sendAnalytics(event: string, data: any) {
  try {
    const analyticsData = {
      event,
      page: window.location.pathname,
      data: {
        ...data,
        timestamp: new Date().toISOString(),
        sessionId: getOrCreateSessionId(),
      },
    }

    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analyticsData),
    })

    // Real-time console logging
    console.log("🔥 Real-time Analytics:", analyticsData)
  } catch (error) {
    console.error("Analytics error:", error)
  }
}
