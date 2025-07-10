import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo (use a real database in production)
let analyticsData: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { event, page, data } = await request.json()

    const analyticsEvent = {
      id: Date.now().toString(),
      event,
      page,
      data,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
      ip: request.ip || "unknown",
    }

    // Store in memory (replace with database in production)
    analyticsData.push(analyticsEvent)

    // Keep only last 1000 events to prevent memory overflow
    if (analyticsData.length > 1000) {
      analyticsData = analyticsData.slice(-1000)
    }

    // Log for real-time monitoring
    console.log("📊 Real-time Analytics Event:", {
      event,
      page,
      timestamp: analyticsEvent.timestamp,
      userAgent: request.headers.get("user-agent")?.substring(0, 50) + "...",
    })

    return NextResponse.json({
      success: true,
      message: "Analytics event recorded",
      totalEvents: analyticsData.length,
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to log event" }, { status: 500 })
  }
}

// GET endpoint to view analytics data
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "50")

    const recentEvents = analyticsData.slice(-limit).reverse()

    // Generate summary statistics
    const summary = {
      totalEvents: analyticsData.length,
      eventTypes: analyticsData.reduce(
        (acc, event) => {
          acc[event.event] = (acc[event.event] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      popularPages: analyticsData.reduce(
        (acc, event) => {
          acc[event.page] = (acc[event.page] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    return NextResponse.json({
      summary,
      recentEvents,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
