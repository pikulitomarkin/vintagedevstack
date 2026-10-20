/**
 * Sala de videochamada embutida no site Vintage.
 * Provider padrão: Jitsi Meet (estável, sem API key).
 * Opcional: JITSI_DOMAIN (default meet.jit.si)
 */

export function jitsiDomain() {
  return (process.env.JITSI_DOMAIN || 'meet.jit.si').replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function publicSiteUrl() {
  return (process.env.PUBLIC_SITE_URL || 'https://www.vintagedevstack.com.br').replace(/\/$/, '')
}

/** Gera room id estável e URLs (página Vintage + room Jitsi) */
export function buildMeetingForBooking(bookingId) {
  const short = String(bookingId).replace(/-/g, '').slice(0, 12)
  const room = `VintageDevStack-${short}`
  const domain = jitsiDomain()
  const site = publicSiteUrl()
  return {
    meeting_room: room,
    meeting_url: `${site}/call/${bookingId}`,
    jitsi_url: `https://${domain}/${room}`,
  }
}
