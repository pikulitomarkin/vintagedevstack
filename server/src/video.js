/**
 * Sala de videochamada Vintage — WebRTC nativo (P2P) no próprio site.
 * Sinalização: WebSocket /api/rtc na API local. Sem Jitsi / SaaS externo.
 */

export function publicSiteUrl() {
  return (process.env.PUBLIC_SITE_URL || 'https://www.vintagedevstack.com.br').replace(/\/$/, '')
}

/** Room id estável + URL da página Vintage */
export function buildMeetingForBooking(bookingId) {
  const short = String(bookingId).replace(/-/g, '').slice(0, 12)
  const room = `VintageDevStack-${short}`
  const site = publicSiteUrl()
  return {
    meeting_room: room,
    meeting_url: `${site}/call/${bookingId}`,
  }
}
