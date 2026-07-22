/* =========================================================
   VINTAGE DEVSTACK — APP JS
   Boot sequence, terminal, easter eggs, sounds, tweaks
   ========================================================= */

/*EDITMODE-BEGIN*/const TWEAK_DEFAULTS = {
  "theme": "light",
  "sound": false
}/*EDITMODE-END*/;

const STATE = {
  theme: TWEAK_DEFAULTS.theme,
  sound: TWEAK_DEFAULTS.sound,
  konami: [],
  audioCtx: null
};

const KONAMI_SEQ = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

/* ----------------------- THEME ----------------------- */
function applyTheme(t) {
  STATE.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  // sync tweaks UI
  document.querySelectorAll('[data-twk-theme]').forEach(b => {
    b.classList.toggle('on', b.dataset.twkTheme === t);
  });
  persist({ theme: t });
}

function setSound(on) {
  STATE.sound = on;
  document.querySelectorAll('[data-twk-sound]').forEach(b => {
    b.classList.toggle('on', (b.dataset.twkSound === 'on') === on);
  });
  document.getElementById('sound-icon').textContent = on ? '♪' : '·';
  persist({ sound: on });
  if (on) beep(660, 0.04, 'square', 0.05);
}

function persist(edits) {
  try {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*');
  } catch (e) {}
}

/* ----------------------- SOUND ----------------------- */
function getAudio() {
  if (!STATE.audioCtx) {
    try {
      STATE.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) { return null; }
  }
  return STATE.audioCtx;
}

function beep(freq = 440, dur = 0.06, type = 'square', vol = 0.08) {
  if (!STATE.sound) return;
  const ctx = getAudio();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + dur);
}

function click() { beep(820, 0.025, 'square', 0.04); }
function type() { beep(1200 + Math.random()*300, 0.012, 'square', 0.02); }
function chord(notes, dur = 0.08) {
  notes.forEach((n, i) => setTimeout(() => beep(n, dur, 'triangle', 0.07), i * 80));
}

/* ----------------------- BOOT SEQUENCE (inside CRT) ----------------------- */
const BOOT_LINES = [
  { t: "VINTAGE DEVSTACK BIOS v8.7.3", c: "" , d: 220},
  { t: "(C) 1987–2026 PADILHA SYSTEMS", c: "dim", d: 120},
  { t: "", d: 80 },
  { t: "MEMORY TEST .......... 640K OK", c: "ok", d: 160 },
  { t: "DETECTING DEVICES ....", d: 140 },
  { t: "  > KEYBOARD ......... OK", c: "ok", d: 90 },
  { t: "  > MODEM 28.8K ...... OK", c: "ok", d: 90 },
  { t: "  > FLOPPY DRIVE ..... OK", c: "ok", d: 90 },
  { t: "  > NEURAL NET ....... OK", c: "ok", d: 90 },
  { t: "", d: 60 },
  { t: "LOADING SERVICES.SYS .", d: 200 },
  { t: "  [■■■■■■■■■■] 100%", c: "ok", d: 280 },
  { t: "", d: 80 },
  { t: "> READY.", c: "", d: 320 },
  { t: "> _", c: "", d: 0, blink: true }
];

async function runBoot(target) {
  for (const line of BOOT_LINES) {
    const div = document.createElement('div');
    div.className = 'crt-line';
    if (line.c) {
      div.innerHTML = `<span class="${line.c}">${escapeHtml(line.t)}</span>`;
    } else if (line.blink) {
      div.innerHTML = `<span>&gt; </span><span class="crt-cursor"></span>`;
    } else {
      div.textContent = line.t;
    }
    target.appendChild(div);
    target.parentElement.scrollTop = target.parentElement.scrollHeight;
    if (STATE.sound && line.t) type();
    await sleep(line.d || 100);
  }
  // after boot, run idle loop: oscilloscope-ish ASCII waveform
  const wfDiv = document.createElement('div');
  wfDiv.className = 'crt-line dim';
  wfDiv.style.marginTop = '10px';
  target.appendChild(wfDiv);
  let phase = 0;
  setInterval(() => {
    let s = '';
    for (let i = 0; i < 30; i++) {
      const y = Math.sin((i + phase) * 0.42) * 0.5 + 0.5;
      const ch = y > 0.66 ? '▔' : y > 0.33 ? '─' : '▁';
      s += ch;
    }
    wfDiv.textContent = '  SIG: ' + s;
    phase += 0.6;
  }, 90);
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ----------------------- TERMINAL ----------------------- */
const COMMANDS = {
  help: () => [
    "Available commands:",
    "  help          — this list",
    "  about         — about Vintage DevStack",
    "  services      — list services",
    "  contact       — contact channels",
    "  whoami        — current operator",
    "  date          — system time",
    "  theme [n|a]   — switch theme (neon / amber)",
    "  sound [on|off]— toggle audio",
    "  matrix        — easter egg",
    "  cv            — abrir currículo / portfolio",
    "  clear         — clear screen",
    "  exit          — close terminal"
  ],
  about: () => [
    "VINTAGE DEVSTACK — Engenharia de software de precisão",
    "Fundimos a robustez de máquinas dos anos 80 com",
    "tecnologias modernas: IA, automação, cloud-native, SaaS.",
    "33 projetos entregues · 5.0★ avaliação · Top 11 BR"
  ],
  services: () => [
    "[01] Automação Logística    — rotas, frotas, APIs",
    "[02] Agentes de IA          — WhatsApp, Telegram, NLP",
    "[03] Desenvolvimento SaaS   — cloud-native, microsvc",
    "[04] Consultoria Eng. Soft. — arquitetura, code review",
    "[05] Stack: Python · TS/Node · C#/.NET · React · Next · NestJS · Blazor · Flutter · PGSQL · Docker · Supabase · LLMs"
  ],
  contact: () => [
    "WhatsApp ......... +55 (11) 9 ____-____",
    "Email ............ marcos.padilha@vintagedevstack.com.br",
    "LinkedIn ......... /in/marcos-padilha",
    "GitHub ........... @marcospadilha",
    "Workana .......... HERO level · ranked #11 BR"
  ],
  whoami: () => ["marcos@padilha-systems  ·  cientista da computação  ·  CEO"],
  date: () => [new Date().toString()],
  clear: () => 'CLEAR',
  exit: () => 'EXIT',
  matrix: () => 'MATRIX',
  theme: (arg) => {
    const a = (arg || '').toLowerCase();
    if (a === 'a' || a === 'amber' || a === 'd' || a === 'dark') { applyTheme('dark'); return ["theme → amber"]; }
    if (a === 'n' || a === 'neon' || a === 'l' || a === 'light') { applyTheme('light'); return ["theme → neon"]; }
    if (a === '' || a === 'toggle') {
      const next = STATE.theme === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return [`theme → ${next === 'light' ? 'neon' : 'amber'}`];
    }
    return ["usage: theme [neon|amber]   (or just `theme` to toggle)"];
  },
  sound: (arg) => {
    if (arg === 'on') { setSound(true); return ["sound → ON"]; }
    if (arg === 'off') { setSound(false); return ["sound → OFF"]; }
    return ["usage: sound [on|off]"];
  },
  ls: () => ["hero/  serviços/  sobre/  contato/  ./README.md"],
  cat: (arg) => arg === 'README.md' ? [
    "# Vintage DevStack",
    "Cada linha de código tratada como uma peça de engenharia.",
    "Boa noite, hacker — agora digite `services`."
  ] : [`cat: ${arg || '?'}: arquivo não encontrado`],
  echo: (arg) => [arg || ""],
  hello: () => ["hi 👋 — quer marcar uma call? digite `contact`"],
  cv: () => 'CV',
  curriculo: () => 'CV',
  curícuro: () => 'CV',
  konami: () => ["↑ ↑ ↓ ↓ ← → ← → B A   — tente!"],
};

const TERM_BODY_ID = 'term-body';
const TERM_INPUT_ID = 'term-input';

function termPrint(text, cls = 'p') {
  const body = document.getElementById(TERM_BODY_ID);
  const line = document.createElement('div');
  line.className = 'term-line';
  line.innerHTML = `<span class="${cls}">${typeof text === 'string' ? text : escapeHtml(String(text))}</span>`;
  body.insertBefore(line, body.lastElementChild);
  body.scrollTop = body.scrollHeight;
}

function termPrintHtml(html, cls = 'p') {
  const body = document.getElementById(TERM_BODY_ID);
  const line = document.createElement('div');
  line.className = 'term-line';
  line.innerHTML = `<span class="${cls}">${html}</span>`;
  body.insertBefore(line, body.lastElementChild);
  body.scrollTop = body.scrollHeight;
}

function clearTerm() {
  const body = document.getElementById(TERM_BODY_ID);
  // keep only input line
  [...body.children].forEach(c => {
    if (!c.classList.contains('term-input-line')) c.remove();
  });
}

function execCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;
  termPrint(`marcos@vintage:~$ ${escapeHtml(trimmed)}`, 'p');
  const [cmd, ...rest] = trimmed.split(/\s+/);
  const arg = rest.join(' ');
  const handler = COMMANDS[cmd.toLowerCase()];
  if (!handler) {
    termPrint(`command not found: ${escapeHtml(cmd)}  ·  try \`help\``, 'err');
    beep(200, 0.08, 'sawtooth', 0.05);
    return;
  }
  const out = handler(arg);
  if (out === 'CLEAR') { clearTerm(); return; }
  if (out === 'EXIT') {
    document.getElementById('terminal').classList.remove('open');
    document.getElementById('term-bar-label').textContent = 'TERMINAL';
    return;
  }
  if (out === 'MATRIX') { runMatrix(); return; }
  if (out === 'CV') { openCV(); return; }
  if (Array.isArray(out)) {
    out.forEach(l => termPrint(l, cmd === 'about' || cmd === 'services' ? 'p' : 'p'));
  }
  chord([520, 660]);
}

function openCV() {
  termPrint("opening curriculo.html ...", 'ok');
  termPrintHtml('<a href="curriculo.html" target="_blank">[ click here if it doesn’t open automatically ]</a>', 'p');
  chord([523, 659, 784, 1047], 0.1);
  setTimeout(() => { window.open('curriculo.html', '_blank'); }, 500);
}

function runMatrix() {
  termPrint("entering the construct...", 'ok');
  const chars = '01アイウエオカキクケコサシスセソタチツテト'.split('');
  let count = 0;
  const interval = setInterval(() => {
    let s = '';
    for (let i = 0; i < 36; i++) s += chars[Math.floor(Math.random()*chars.length)];
    termPrint(s, 'ok');
    if (++count > 12) {
      clearInterval(interval);
      termPrint("wake up, marcos.", 'ok');
      termPrint("the vintage devstack has you.", 'ok');
    }
  }, 90);
}

function openTerm() {
  const t = document.getElementById('terminal');
  t.classList.add('open');
  setTimeout(() => document.getElementById(TERM_INPUT_ID).focus(), 250);
  click();
}
function toggleTerm() {
  const t = document.getElementById('terminal');
  t.classList.toggle('open');
  if (t.classList.contains('open')) {
    setTimeout(() => document.getElementById(TERM_INPUT_ID).focus(), 250);
  }
  click();
}

/* ----------------------- TWEAKS PANEL ----------------------- */
function buildTweaksPanel() {
  // tweaks UI is in HTML; just wire up handlers
  document.querySelectorAll('[data-twk-theme]').forEach(b => {
    b.addEventListener('click', () => { applyTheme(b.dataset.twkTheme); click(); });
  });
  document.querySelectorAll('[data-twk-sound]').forEach(b => {
    b.addEventListener('click', () => { setSound(b.dataset.twkSound === 'on'); });
  });
  document.getElementById('tweaks-close').addEventListener('click', () => {
    document.getElementById('tweaks-panel').classList.remove('show');
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  });
}

/* Edit-mode protocol */
function wireEditMode() {
  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') {
      document.getElementById('tweaks-panel').classList.add('show');
    } else if (t === '__deactivate_edit_mode') {
      document.getElementById('tweaks-panel').classList.remove('show');
    }
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
}

/* ----------------------- KONAMI ----------------------- */
function wireKonami() {
  document.addEventListener('keydown', (e) => {
    // ignore when typing in terminal/inputs
    if (document.activeElement && ['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
    const expected = KONAMI_SEQ[STATE.konami.length];
    if (e.key === expected) {
      STATE.konami.push(e.key);
      if (STATE.konami.length === KONAMI_SEQ.length) {
        triggerKonami();
        STATE.konami = [];
      }
    } else {
      STATE.konami = e.key === KONAMI_SEQ[0] ? [e.key] : [];
    }
  });
}

function triggerKonami() {
  // flip theme + rain confetti + terminal pop
  applyTheme(STATE.theme === 'light' ? 'dark' : 'light');
  chord([523, 659, 784, 1047], 0.12);
  openTerm();
  termPrint("⚡ konami unlocked — welcome, hacker.", 'ok');
  termPrint("here's a secret: try `matrix`", 'dim');
  // glitch effect on h1
  const h1 = document.querySelector('.hero h1');
  if (h1) {
    h1.style.transition = 'transform .15s';
    let i = 0;
    const id = setInterval(() => {
      h1.style.transform = `translate(${(Math.random()-0.5)*6}px, ${(Math.random()-0.5)*4}px)`;
      if (++i > 12) { clearInterval(id); h1.style.transform = ''; }
    }, 60);
  }
}

/* ----------------------- STATUS BAR CLOCK ----------------------- */
function tickClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const update = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const ss = String(d.getSeconds()).padStart(2,'0');
    el.textContent = `${hh}:${mm}:${ss}`;
  };
  update();
  setInterval(update, 1000);
}

/* ----------------------- TYPED HERO ROTATOR ----------------------- */
const HERO_ROTATE = [
  "engenharia de software",
  "automação de IA",
  "agentes multicanal",
  "sistemas que duram"
];

async function rotateHero() {
  const el = document.getElementById('rot');
  if (!el) return;
  let idx = 0;
  while (true) {
    const word = HERO_ROTATE[idx];
    // type
    for (let i = 0; i <= word.length; i++) {
      el.textContent = word.slice(0, i);
      if (STATE.sound && i < word.length) type();
      await sleep(55);
    }
    await sleep(1800);
    // delete
    for (let i = word.length; i >= 0; i--) {
      el.textContent = word.slice(0, i);
      await sleep(28);
    }
    await sleep(220);
    idx = (idx + 1) % HERO_ROTATE.length;
  }
}

/* ----------------------- SUBTLE PARALLAX ----------------------- */
function wireParallax() {
  const crt = document.querySelector('.crt');
  if (!crt) return;
  const wrap = crt.parentElement;
  wrap.addEventListener('mousemove', (e) => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    crt.style.transform = `perspective(1200px) rotateX(${-y*3 + 0.5}deg) rotateY(${x*4}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    crt.style.transform = `perspective(1200px) rotateX(0.5deg)`;
  });
}

/* ----------------------- BUTTON SOUND ----------------------- */
function wireButtonSounds() {
  document.querySelectorAll('.btn, .channel, .nav a').forEach(b => {
    b.addEventListener('click', () => click());
    b.addEventListener('mouseenter', () => beep(900, 0.012, 'square', 0.015));
  });
}

/* ----------------------- INIT ----------------------- */
function init() {
  // apply persisted defaults
  applyTheme(STATE.theme);
  setSound(STATE.sound);

  // boot inside CRT
  const scroll = document.getElementById('crt-scroll');
  if (scroll) runBoot(scroll);

  // terminal bar toggle
  document.getElementById('term-bar').addEventListener('click', toggleTerm);
  const input = document.getElementById(TERM_INPUT_ID);
  // print welcome
  termPrint("welcome to vintage_devstack — type `help` for commands.", 'ok');
  termPrintHtml('try: <span class="dim">about · services · contact · matrix · theme</span>', 'p');
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      execCommand(val);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const cands = Object.keys(COMMANDS).filter(c => c.startsWith(input.value.trim()));
      if (cands.length === 1) input.value = cands[0];
    }
  });

  // CTAs that open terminal
  document.querySelectorAll('[data-open-term]').forEach(b => {
    b.addEventListener('click', (e) => { e.preventDefault(); openTerm(); });
  });

  // Slash key to open terminal
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      openTerm();
    }
    if (e.key === 'Escape') {
      document.getElementById('terminal').classList.remove('open');
    }
  });

  buildTweaksPanel();
  wireEditMode();
  wireKonami();
  wireParallax();
  wireButtonSounds();
  tickClock();
  rotateHero();

  // form fake submit
  const form = document.getElementById('brief-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.textContent = '✓ TRANSMITTED';
      btn.disabled = true;
      chord([523, 659, 784]);
      setTimeout(() => {
        btn.textContent = '↑ ENVIAR BRIEFING';
        btn.disabled = false;
        form.reset();
      }, 2400);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
