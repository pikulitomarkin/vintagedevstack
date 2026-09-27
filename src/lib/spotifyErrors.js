/** Mensagens legíveis para erros comuns da Spotify Web API / SDK */

export function formatSpotifyError(err) {
  const raw = (err && (err.message || err.error_description || err.error || err)) || ''
  const msg = String(raw)
  const lower = msg.toLowerCase()

  if (/premium|account_error|requires premium/i.test(msg)) {
    return 'Conta sem Spotify Premium — o player SDK precisa de Premium. Usando Embed.'
  }
  if (/forbidden|403/.test(lower)) {
    return 'Spotify recusou (403). Em geral: precisa Premium para tocar no browser, ou a playlist não permite leitura. Usando Embed.'
  }
  if (/not.?found|404/.test(lower)) {
    return 'Recurso Spotify não encontrado.'
  }
  if (/rate.?limit|429/.test(lower)) {
    return 'Muitas requisições ao Spotify — aguarde um instante.'
  }
  if (/token|unauthorized|401|expired/i.test(msg)) {
    return 'Sessão Spotify expirada — conecte novamente.'
  }
  return msg || 'Erro Spotify'
}

export function isForbiddenError(err) {
  return /forbidden|403|premium|account_error/i.test(String(err?.message || err || ''))
}

export function isPremiumAccount(me) {
  const product = String(me?.product || '').toLowerCase()
  return product === 'premium'
}
