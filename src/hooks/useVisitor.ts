'use client'

import { useEffect, useRef, useState } from 'react'

function getSessionId() {
  let id = sessionStorage.getItem('_sid')
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem('_sid', id)
  }
  return id
}

export function useVisitor() {
  const [liveViewers, setLiveViewers] = useState(1)
  const sessionId = useRef(getSessionId())
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    const sid = sessionId.current

    // Fire visit notification once per session
    const alreadyNotified = sessionStorage.getItem('_visited')
    if (!alreadyNotified) {
      sessionStorage.setItem('_visited', '1')

      fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'visit',
          sessionId: sid,
          page: window.location.pathname,
          referrer: document.referrer || 'Direct',
          device: navigator.userAgent,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      }).catch(() => {})
    }

    // Heartbeat every 25s
    const heartbeat = async () => {
      try {
        const res = await fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'heartbeat',
            sessionId: sid,
            page: window.location.pathname,
          }),
        })
        const data = await res.json()
        if (typeof data.viewers === 'number') setLiveViewers(data.viewers)
      } catch {}
    }

    heartbeat()
    const interval = setInterval(heartbeat, 25_000)

    const handleUnload = () => {
      navigator.sendBeacon(
        '/api/visitors',
        JSON.stringify({ type: 'leave', sessionId: sid }),
      )
    }
    window.addEventListener('beforeunload', handleUnload)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  return { liveViewers }
}
