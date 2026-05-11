import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

interface AuditLogEntry {
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  ip_address?: string
  status: string
  details?: Record<string, any>
}

export async function logAuditEvent(entry: AuditLogEntry, request?: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    )

    const ipAddress = request?.headers.get('x-forwarded-for') || 
                     request?.headers.get('x-real-ip') || 
                     'unknown'

    const { error } = await supabase
      .from('security_audit_logs')
      .insert({
        user_id: entry.user_id,
        action: entry.action,
        resource_type: entry.resource_type,
        resource_id: entry.resource_id,
        ip_address: ipAddress,
        status: entry.status,
        details: entry.details || {},
      })

    if (error) {
      console.error('[v0] Failed to log audit event:', error)
    }
  } catch (error) {
    console.error('[v0] Audit logging error:', error)
  }
}

export async function logSecurityEvent(
  action: string,
  status: string,
  details?: Record<string, any>,
  request?: NextRequest
) {
  await logAuditEvent(
    {
      action,
      status,
      details,
    },
    request
  )
}
