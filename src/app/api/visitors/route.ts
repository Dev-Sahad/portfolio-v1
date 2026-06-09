import { NextRequest, NextResponse } from 'next/server'

const DISCORD_WEBHOOK =
  'https://discord.com/api/webhooks/1491857287097094258/qNW1r7kPV2Ke3pleScHVWHaC7Mx_50H6zKsdZ_eKYdoSdi3AlZFO_WwBXe-WT9XIGpB_'

// In-memory viewer tracking (resets on Vercel cold start — fine for this use case)
const viewers = new Map<string, { ts: number; page: string }>()

const IDLE_MS = 3 * 60 * 1000 // 3 min

function purgeIdle() {
  const cutoff = Date.now() - IDLE_MS
  for (const [id, v] of viewers.entries()) {
    if (v.ts < cutoff) viewers.delete(id)
  }
}

function liveCount() {
  purgeIdle()
  return viewers.size
}

// ─── Geo lookup via free ip-api.com ────────────────────────────────
async function getGeo(ip: string): Promise<{ country: string; city: string; org: string }> {
  if (!ip || ip === 'Unknown' || ip.startsWith('127') || ip.startsWith('::1')) {
    return { country: 'Local / Dev', city: '', org: '' }
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,org,status`, {
      signal: AbortSignal.timeout(2000),
    })
    const data = await res.json()
    if (data.status === 'success') {
      return { country: data.country || '—', city: data.city || '—', org: data.org || '—' }
    }
  } catch {}
  return { country: '—', city: '—', org: '—' }
}

// ─── Parse user agent ───────────────────────────────────────────────
function parseUA(ua: string) {
  const mobile = /mobile|android|iphone|ipad/i.test(ua)
  const tablet = /ipad|tablet/i.test(ua)
  const browser =
    ua.match(/(Edg|OPR|Chrome|Firefox|Safari)\//)?.[1]
      ?.replace('Edg', 'Edge')
      .replace('OPR', 'Opera') || 'Unknown'
  const os =
    ua.includes('Windows') ? 'Windows' :
    ua.includes('Mac OS')  ? 'macOS'   :
    ua.includes('Android') ? 'Android' :
    ua.includes('iPhone')  ? 'iOS'     :
    ua.includes('Linux')   ? 'Linux'   : 'Unknown'

  const device = tablet ? '📱 Tablet' : mobile ? '📱 Mobile' : '🖥️ Desktop'
  return { browser, os, device }
}

// ─── Send Discord embed ─────────────────────────────────────────────
async function sendDiscord(payload: object) {
  try {
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {}
}

// ─── POST ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, sessionId, page, referrer, timezone } = body

    // ── Visit notification ──────────────────────────────────────────
    if (type === 'visit') {
      const ip =
        req.headers.get('x-real-ip') ||
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        'Unknown'

      const ua = req.headers.get('user-agent') || ''
      const { browser, os, device } = parseUA(ua)
      const geo = await getGeo(ip)

      const now = new Date()
      const timeStr = now.toLocaleString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        day: '2-digit', month: 'short', year: 'numeric',
        timeZone: 'Asia/Kolkata',
      }) + ' IST'

      const currentViewers = liveCount()

      await sendDiscord({
        embeds: [{
          author: {
            name: '✦ Portfolio — New Visitor',
            icon_url: 'https://cdn.discordapp.com/emojis/1234567890.png',
          },
          color: 0x00e5ff,
          fields: [
            { name: '🌍 Location',  value: [geo.city, geo.country].filter(Boolean).join(', ') || '—', inline: true },
            { name: '📡 ISP / Org', value: geo.org || '—',    inline: true },
            { name: '🔒 IP',        value: `\`${ip}\``,        inline: true },
            { name: '🖥️ Device',    value: device,             inline: true },
            { name: '🌐 Browser',   value: `${browser} · ${os}`, inline: true },
            { name: '🕐 Time',      value: timeStr,            inline: true },
            { name: '📄 Page',      value: page || '/',        inline: true },
            { name: '🔗 Referrer',  value: referrer || 'Direct', inline: true },
            { name: '🌏 Timezone',  value: timezone || '—',    inline: true },
            { name: '👁️ Live Now',  value: `**${currentViewers + 1}** viewer${currentViewers + 1 !== 1 ? 's' : ''}`, inline: false },
          ],
          footer: { text: 'portfolio-v1-eta-nine.vercel.app  ·  Visitor Analytics' },
          timestamp: new Date().toISOString(),
        }],
      })

      return NextResponse.json({ ok: true })
    }

    // ── Heartbeat — keep viewer alive ───────────────────────────────
    if (type === 'heartbeat' && sessionId) {
      viewers.set(sessionId, { ts: Date.now(), page: page || '/' })
      purgeIdle()
      return NextResponse.json({ viewers: viewers.size })
    }

    // ── Leave ───────────────────────────────────────────────────────
    if (type === 'leave' && sessionId) {
      viewers.delete(sessionId)
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

// ─── GET — for dashboard polling ────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    viewers: liveCount(),
    sessions: Array.from(viewers.entries()).map(([id, v]) => ({
      id: id.slice(0, 8),
      page: v.page,
      since: v.ts,
    })),
  })
}
