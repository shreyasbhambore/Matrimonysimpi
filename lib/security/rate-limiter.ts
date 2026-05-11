import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number // milliseconds
}

const defaultConfig: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
}

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }

  return async (request: NextRequest) => {
    const identifier = getIdentifier(request)
    const now = Date.now()

    // Get or create rate limit record
    let record = rateLimitStore.get(identifier)

    if (!record || now > record.resetTime) {
      // Create new window
      record = {
        count: 1,
        resetTime: now + finalConfig.windowMs,
      }
    } else {
      record.count++
    }

    rateLimitStore.set(identifier, record)

    // Check if exceeded limit
    if (record.count > finalConfig.maxRequests) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
          },
        }
      )
    }

    return null // Allow request to proceed
  }
}

function getIdentifier(request: NextRequest): string {
  // Use combination of IP address and user agent for identification
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}:${userAgent}`
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 1000) // Clean up every minute
