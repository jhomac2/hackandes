/* ============================================================
   HackAndes · Aplicación principal
   Todo se guarda en ESTE navegador (localStorage). No hay servidor.
   ============================================================ */
(function () {
  'use strict';
  const HA = window.HA;
  const DB_KEY = 'hackandes:v1';
  const SES_KEY = 'hackandes:sesion';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = window.escHTML;
  HA.$ = $; HA.$$ = $$; HA.esc = esc;

  // ---------- Utilidades ----------
  const dkey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const ayer = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dkey(d); };
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const randStr = (n, abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') => { const b = new Uint8Array(n); crypto.getRandomValues(b); return Array.from(b, x => abc[x % abc.length]).join(''); };
  const normaliza = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:"]/g, '').replace(/\s+/g, ' ').trim();
  Object.assign(HA, { dkey, shuffle, randStr, normaliza });

  // ---------- Sonidos (sin archivos: se generan con el navegador) ----------
  let actx = null;
  function tono(notas, tipo = 'sine', dur = 0.12, vol = 0.12) {
    const p = perfil(); if (p && p.ajustes && p.ajustes.sonido === false) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      let t = actx.currentTime;
      notas.forEach(f => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = tipo; o.frequency.value = f; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur); t += dur * 0.8;
      });
    } catch (e) { /* sin audio */ }
  }
  HA.sonido = {
    bien: () => tono([660, 880, 1320], 'triangle', 0.11),
    mal: () => tono([220, 160], 'sawtooth', 0.16, 0.07),
    tecla: () => tono([1200], 'square', 0.02, 0.02),
    fin: () => tono([523, 659, 784, 1046, 1318], 'triangle', 0.14),
    evo: () => tono([392, 523, 659, 784, 1046, 1318, 1568], 'triangle', 0.18, 0.14),
    logro: () => tono([784, 988, 1318], 'sine', 0.15)
  };

  // ---------- Confeti ----------
  HA.confeti = function (n = 140) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const c = document.createElement('canvas'); c.className = 'confeti'; document.body.appendChild(c);
    const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#6C3CE1', '#B794FF', '#F5B82E', '#FFD43B', '#FF6B4A'];
    const ps = Array.from({ length: n }, () => ({ x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5, vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, w: 6 + Math.random() * 6, h: 8 + Math.random() * 8, col: cols[Math.floor(Math.random() * cols.length)] }));
    let f = 0;
    (function loop() {
      ctx.clearRect(0, 0, c.width, c.height);
      ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore(); });
      if (++f < 200) requestAnimationFrame(loop); else c.remove();
    })();
  };

  // ---------- Avisos y ventanas ----------
  HA.toast = function (msg, tipo = '') {
    let z = $('.toast-zona'); if (!z) { z = document.createElement('div'); z.className = 'toast-zona'; z.setAttribute('role', 'status'); document.body.appendChild(z); }
    const t = document.createElement('div'); t.className = 'toast ' + tipo; t.innerHTML = msg; z.appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, tipo === 'logro' ? 3800 : 2600);
  };
  HA.modal = function (html, opts = {}) {
    HA.cerrarModal();
    const f = document.createElement('div'); f.className = 'modal-fondo'; f.id = 'modal';
    f.innerHTML = `<div class="modal ${opts.cls || ''}" role="dialog" aria-modal="true">${html}</div>`;
    if (!opts.fijo) f.addEventListener('click', e => { if (e.target === f) HA.cerrarModal(); });
    document.body.appendChild(f);
    const first = f.querySelector('input, button'); if (first && !opts.noFocus) setTimeout(() => first.focus(), 30);
    return f;
  };
  HA.cerrarModal = () => { const m = $('#modal'); if (m) m.remove(); };
  HA.confirmar = (titulo, texto, si = 'Sí', no = 'Cancelar', peligro = false) => new Promise(res => {
    const m = HA.modal(`<h2>${titulo}</h2><p class="muted">${texto}</p><div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn blanco mini" data-r="0">${no}</button><button class="btn mini ${peligro ? 'tomate' : ''}" data-r="1">${si}</button></div>`);
    m.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { HA.cerrarModal(); res(b.dataset.r === '1'); });
  });
  HA.pedirClave = (titulo, texto) => new Promise(res => {
    const m = HA.modal(`<h2>${titulo}</h2><p class="muted">${texto}</p><div class="campo"><label for="pc">Contraseña</label><input id="pc" type="password" autocomplete="current-password"></div><div class="error-txt" id="pce"></div><div class="row" style="justify-content:flex-end"><button class="btn blanco mini" data-r="0">Cancelar</button><button class="btn mini" data-r="1">Confirmar</button></div>`);
    const ok = () => { const v = $('#pc').value; HA.cerrarModal(); res(v); };
    m.querySelector('[data-r="0"]').onclick = () => { HA.cerrarModal(); res(null); };
    m.querySelector('[data-r="1"]').onclick = ok;
    $('#pc').addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
  });

  // ---------- Base de datos local ----------
  let db;
  function cargarDB() {
    try { db = JSON.parse(localStorage.getItem(DB_KEY)) || null; } catch (e) { db = null; }
    if (!db || typeof db !== 'object') db = { perfiles: {}, ui: {} };
    db.perfiles = db.perfiles || {}; db.ui = db.ui || {};
  }
  function guardar() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
    catch (e) { HA.toast('⚠️ No se pudo guardar. ¿El navegador está en modo privado o sin espacio?'); }
  }
  HA.guardar = guardar;
  HA.db = () => db;
  let sesionId = null;
  function perfil() { return sesionId && db ? db.perfiles[sesionId] : null; }
  HA.perfil = perfil;

  // ---------- Curso: índice ----------
  const IDX = { lecciones: [], porId: {}, unidades: [], unidadPorId: {}, glosario: [], tips: [] };
  HA.IDX = IDX;
  function indexar() {
    IDX.lecciones = []; IDX.porId = {}; IDX.unidades = []; IDX.unidadPorId = {}; IDX.glosario = []; IDX.tips = [];
    HA.levels.forEach((lv, li) => {
      lv.idx = li;
      lv.units.forEach((u, ui) => {
        u.id = u.id || `${lv.id}-u${ui + 1}`; u.nivel = lv; u.num = IDX.unidades.length + 1;
        IDX.unidades.push(u); IDX.unidadPorId[u.id] = u;
        u.lessons.forEach((l, k) => {
          l.id = l.id || `${u.id}-l${k + 1}`; l.unidad = u; l.nivel = lv; l.k = k;
          IDX.lecciones.push(l); IDX.porId[l.id] = l;
        });
      });
      (lv.glosario || []).forEach(g => IDX.glosario.push({ t: g[0], d: g[1], n: lv.n }));
      (lv.tips || []).forEach(t => IDX.tips.push(t));
    });
    IDX.glosario.sort((a, b) => a.t.localeCompare(b.t, 'es'));
  }

  // ---------- Progreso ----------
  const hecha = (p, lid) => !!(p.hechas && p.hechas[lid]);
  const unidadHecha = (p, u) => u.lessons.every(l => hecha(p, l.id));
  const nivelHecho = (p, lv) => lv.units.every(u => unidadHecha(p, u));
  function nivelAbierto(p, lv) {
    if (lv.idx === 0) return true;
    if (p.desbloqueos && p.desbloqueos[lv.id]) return true;
    return nivelHecho(p, HA.levels[lv.idx - 1]);
  }
  function leccionAbierta(p, l) {
    if (hecha(p, l.id)) return true;
    if (!nivelAbierto(p, l.nivel)) return false;
    const u = l.unidad, lv = l.nivel;
    if (l.k > 0) return hecha(p, u.lessons[l.k - 1].id);
    const ui = lv.units.indexOf(u);
    if (ui === 0) return true;
    return unidadHecha(p, lv.units[ui - 1]);
  }
  function siguienteLeccion(p) { return IDX.lecciones.find(l => !hecha(p, l.id) && leccionAbierta(p, l)) || null; }
  const UMBRALES = [0, 0, 2, 5, 10, 19]; // unidades completas para cada etapa de la mascota
  function unidadesHechas(p) { return IDX.unidades.filter(u => unidadHecha(p, u)).length; }
  function etapa(p) {
    const n = unidadesHechas(p);
    let s = 1;
    for (let k = 2; k <= 5; k++) if (n >= UMBRALES[k]) s = k;
    if (s === 5 && !HA.levels.every(lv => nivelHecho(p, lv))) s = 4;
    return s;
  }
  function xpHoy(p) { return (p.xpLog && p.xpLog[dkey()]) || 0; }
  function rachaActual(p) { const r = p.racha || {}; return (r.ultima === dkey() || r.ultima === ayer()) ? (r.n || 0) : 0; }
  Object.assign(HA, { hecha, unidadHecha, nivelHecho, nivelAbierto, leccionAbierta, siguienteLeccion, etapa, unidadesHechas, xpHoy, rachaActual, UMBRALES });

  // ---------- Fuerza de contraseñas (se usa en el registro y en el laboratorio) ----------
  const COMUNES = ['123456', '12345678', '123456789', 'password', 'contraseña', 'contrasena', 'qwerty', '111111', 'abc123', 'ecuador', 'ecuador123', 'admin', 'iloveyou', 'teamo', 'princesa', 'barcelona', 'emelec', 'ldu', 'quito', 'latacunga', 'hackandes', '000000', '1234', 'password1', 'dragon', 'futbol', 'espe'];
  HA.fuerza = function (pw) {
    const r = { len: pw.length >= 8, len12: pw.length >= 12, may: /[A-ZÁÉÍÓÚÑ]/.test(pw), min: /[a-záéíóúñ]/.test(pw), num: /\d/.test(pw), sim: /[^A-Za-z0-9ÁÉÍÓÚÑáéíóúñ]/.test(pw) };
    const base = pw.toLowerCase().replace(/[^a-z0-9ñ]/g, '');
    r.comun = COMUNES.some(c => base === c || (base.length <= c.length + 3 && base.includes(c)));
    r.repetida = /(.)\1\1/.test(pw) || /(?:0123|1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(pw);
    let cs = 0; if (r.min) cs += 26; if (r.may) cs += 26; if (r.num) cs += 10; if (r.sim) cs += 32;
    const bits = pw.length * Math.log2(Math.max(cs, 1));
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if ([r.may, r.min, r.num, r.sim].filter(Boolean).length >= 3) score++;
    if (bits >= 60) score++;
    if (r.comun || pw.length < 6) score = 0;
    else if (r.repetida) score = Math.max(0, score - 1);
    score = Math.min(4, score);
    const seg = r.comun ? 0 : Math.pow(2, bits) / 2 / 1e10; // 10 mil millones de intentos por segundo
    r.score = score; r.bits = Math.round(bits);
    r.nombre = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'][score];
    r.color = ['#D9472A', '#FF6B4A', '#F5B82E', '#8E5CFF', '#6C3CE1'][score];
    r.tiempo = tiempoHumano(seg);
    return r;
  };
  function tiempoHumano(s) {
    if (s < 1) return 'al instante';
    const u = [['siglos', 3.15e9], ['años', 3.15e7], ['días', 86400], ['horas', 3600], ['minutos', 60], ['segundos', 1]];
    for (const [n, v] of u) if (s >= v) { const x = s / v; return (x > 1e6 ? 'más de un millón de' : Math.round(x).toLocaleString('es-EC')) + ' ' + n; }
    return 'segundos';
  }
  HA.medidorHTML = (id) => `<div class="medidor"><i id="${id}-bar" style="width:0"></i></div><div class="row small"><b id="${id}-nom">Escribe una contraseña</b><span class="grow"></span><span class="muted" id="${id}-t"></span></div>
    <ul class="checks" id="${id}-chk"><li data-k="len">8 caracteres o más</li><li data-k="len12">12 o más (¡mucho mejor!)</li><li data-k="may">Mayúsculas</li><li data-k="min">Minúsculas</li><li data-k="num">Números</li><li data-k="sim">Símbolos (# ! @ - ...)</li><li data-k="nocomun">No es una clave común</li></ul>`;
  HA.actualizarMedidor = (id, pw) => {
    const f = HA.fuerza(pw);
    const bar = $('#' + id + '-bar'); if (!bar) return f;
    bar.style.width = pw ? ((f.score + 1) * 20) + '%' : '0'; bar.style.background = f.color;
    $('#' + id + '-nom').textContent = pw ? f.nombre : 'Escribe una contraseña';
    $('#' + id + '-nom').style.color = pw ? f.color : '';
    $('#' + id + '-t').textContent = pw ? 'Tiempo para descifrarla: ' + f.tiempo : '';
    $$('#' + id + '-chk li').forEach(li => { const k = li.dataset.k; li.classList.toggle('si', k === 'nocomun' ? (pw && !f.comun) : !!f[k]); });
    return f;
  };

  // ---------- Logo ----------
  let _lg = 0;
  HA.logoSVG = () => { const g = 'lg' + (++_lg); return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E5CFF"/><stop offset="1" stop-color="#4B23B0"/></linearGradient></defs><path d="M32 3 L57 12 V30 C57 46 46 56 32 61 C18 56 7 46 7 30 V12 Z" fill="url(#${g})"/><path d="M12 40 L24 24 L30 31 L38 19 L52 40 Z" fill="#F5B82E"/><path d="M38 19 L42 25 L38 24 L35 26 Z M24 24 L27 28 L24 27.5 L21.5 29 Z" fill="#fff"/><circle cx="32" cy="45" r="4.2" fill="#FFD43B"/><rect x="30.4" y="46" width="3.2" height="7" rx="1.2" fill="#FFD43B"/></svg>`; };

  // ---------- Tema ----------
  function aplicarTema() {
    const p = perfil(), a = (p && p.ajustes) || db.ui || {};
    document.body.classList.toggle('oscuro', !!a.oscuro);
    document.body.classList.toggle('letra-grande', !!a.letraGrande);
  }
  HA.aplicarTema = aplicarTema;

  // ---------- Perfiles ----------
  function nuevoPerfil({ nombre, usuario, clave, animal, nombreMascota }) {
    const id = 'p' + Date.now().toString(36) + randStr(4).toLowerCase();
    const sal = randStr(16), rec = randStr(12);
    const recSal = randStr(16);
    const p = {
      id, nombre, usuario, animal, nombreMascota: nombreMascota || window.Mascota.ANIMALES[animal].defNombre,
      sal, hash: window.hashPassword(clave, sal), recSal, recHash: window.hashPassword(rec.replace(/-/g, ''), recSal),
      creado: Date.now(), xp: 0, xpLog: {}, hechas: {}, errores: [], racha: { n: 0, ultima: null, mejor: 0 },
      logros: {}, desbloqueos: {}, stats: { resp: 0, bien: 0, seg: 0, cmds: 0, perfectas: 0, labs: {} },
      ajustes: { sonido: true, oscuro: !!db.ui.oscuro, letraGrande: false, meta: 20, autobloqueo: true },
      ultimoRespaldo: null, etapaVista: 1, checklist: {}
    };
    db.perfiles[id] = p; guardar();
    return { p, rec: rec.match(/.{1,4}/g).join('-') };
  }
  HA.verificarClave = (p, clave) => window.hashPassword(clave, p.sal) === p.hash;

  // ---------- Sesión y bloqueo automático ----------
  let ultimaActividad = Date.now(), bloqueada = false;
  ['pointerdown', 'keydown', 'scroll'].forEach(ev => addEventListener(ev, () => { ultimaActividad = Date.now(); }, { passive: true }));
  setInterval(() => {
    const p = perfil();
    if (!p || bloqueada || !p.ajustes.autobloqueo) return;
    if (Date.now() - ultimaActividad > 15 * 60 * 1000) bloquear();
  }, 20000);
  function bloquear() {
    const p = perfil(); if (!p) return;
    bloqueada = true;
    const m = HA.modal(`<div class="center"><div style="width:120px;height:120px;margin:0 auto">${window.Mascota.svg(p.animal, etapa(p), 'normal')}</div>
      <h2>🔒 Sesión bloqueada</h2><p class="muted">Pasaron 15 minutos sin actividad. Bloquear la pantalla cuando no la usas evita que otra persona entre a tu cuenta.</p></div>
      <div class="campo"><label for="bq">Contraseña de ${esc(p.usuario)}</label><input id="bq" type="password" autocomplete="current-password"></div><div class="error-txt" id="bqe"></div>
      <div class="row"><button class="btn-txt" id="bqs">Cerrar sesión</button><span class="grow"></span><button class="btn" id="bqo">Desbloquear</button></div>`, { fijo: true });
    const ok = () => {
      if (HA.verificarClave(p, $('#bq').value)) { bloqueada = false; ultimaActividad = Date.now(); HA.cerrarModal(); HA.toast('🔓 ¡Bienvenido de vuelta!'); }
      else { $('#bqe').textContent = 'Contraseña incorrecta.'; HA.sonido.mal(); }
    };
    $('#bqo').onclick = ok; $('#bq').addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
    $('#bqs').onclick = () => { bloqueada = false; HA.cerrarModal(); cerrarSesion(); };
  }
  HA.bloquear = bloquear;
  function iniciarSesion(p) {
    sesionId = p.id; sessionStorage.setItem(SES_KEY, p.id); db.ui.ultimo = p.id; guardar();
    ultimaActividad = Date.now(); aplicarTema(); HA.ir('aprender');
  }
  function cerrarSesion() {
    sesionId = null; sessionStorage.removeItem(SES_KEY); HA.cerrarModal(); aplicarTema(); vistaAuth();
  }
  HA.cerrarSesion = cerrarSesion;

  // =====================================================
  //  PANTALLAS DE ACCESO
  // =====================================================
  const app = () => $('#app');
  function trio() { return `<div class="trio">${['lobo', 'leon', 'condor'].map((a, i) => `<div style="${i === 1 ? 'transform:translateY(-8px) scale(1.12)' : ''}">${window.Mascota.svg(a, 1, i === 1 ? 'feliz' : 'normal')}</div>`).join('')}</div>`; }
  function vistaAuth(modo) {
    aplicarTema();
    const perfs = Object.values(db.perfiles).sort((a, b) => (b.id === db.ui.ultimo) - (a.id === db.ui.ultimo));
    if (!modo) modo = perfs.length ? 'lista' : 'bienvenida';
    let h = `<div class="auth"><div class="auth-box"><div class="auth-hero"><div class="logo">${HA.logoSVG()}<span>Hack<b>Andes</b></span></div>`;
    if (modo === 'bienvenida') {
      h += `${trio()}<h1 style="margin-top:6px">Aprende ciberseguridad desde cero</h1><p class="muted">De "no sé nada" a hacker ético. Gratis, sin internet y a tu ritmo.</p></div>
        <div class="card"><button class="btn full" data-a="registro">Empezar ahora</button><div style="height:12px"></div><button class="btn blanco full" data-a="importar">Tengo un respaldo</button></div>
        <p class="pie">Tus datos se guardan solo en este dispositivo 🔐</p>`;
    } else if (modo === 'lista') {
      h += `${trio()}<h2>¿Quién va a estudiar hoy?</h2></div><div class="perfiles">` + perfs.map(p => `<button class="perfil-btn" data-login="${p.id}"><div class="pm">${window.Mascota.svg(p.animal, etapa(p), 'normal', { anim: false })}</div><div class="grow"><b class="fredoka">${esc(p.nombre)}</b><div class="small muted">@${esc(p.usuario)} · ${p.xp} XP</div></div><span style="font-size:1.3em">›</span></button>`).join('') + `</div>
        <div class="row"><button class="btn blanco grow mini" data-a="registro">＋ Nueva cuenta</button><button class="btn blanco grow mini" data-a="importar">Restaurar respaldo</button></div>
        <p class="pie">Cada cuenta tiene su propia contraseña. Nadie más puede ver tu progreso.</p>`;
    }
    h += `</div></div>`;
    app().innerHTML = h;
    $$('[data-login]').forEach(b => b.onclick = () => vistaLogin(db.perfiles[b.dataset.login]));
    $$('[data-a="registro"]').forEach(b => b.onclick = () => vistaRegistro());
    $$('[data-a="importar"]').forEach(b => b.onclick = () => HA.importarRespaldo());
  }
  HA.vistaAuth = vistaAuth;

  function vistaLogin(p) {
    let intentos = 0, bloqueoHasta = 0;
    app().innerHTML = `<div class="auth"><div class="auth-box"><div class="card">
      <button class="btn-txt" id="volver">‹ Volver</button>
      <div class="center"><div style="width:150px;height:150px;margin:0 auto">${window.Mascota.svg(p.animal, etapa(p), 'feliz')}</div>
      <h2>¡Hola, ${esc(p.nombre)}!</h2><p class="muted small">${esc(p.nombreMascota)} te estaba esperando.</p></div>
      <div class="campo"><label for="lc">Contraseña</label><input id="lc" type="password" autocomplete="current-password"></div>
      <div class="error-txt" id="le"></div>
      <button class="btn full" id="entrar">Entrar</button>
      <div class="center" style="margin-top:10px"><button class="btn-txt" id="olvide">¿Olvidaste tu contraseña?</button></div>
      <div class="ciber-tip"><b>Dato ciber:</b> tu contraseña no se guarda tal cual. Se guarda su <b>hash</b> (una huella) con <b>sal</b>. Así, aunque alguien vea los datos, no puede leer tu clave.</div>
    </div></div></div>`;
    $('#volver').onclick = () => vistaAuth();
    $('#olvide').onclick = () => vistaRecuperar(p);
    const entrar = () => {
      if (Date.now() < bloqueoHasta) { $('#le').textContent = `Demasiados intentos. Espera ${Math.ceil((bloqueoHasta - Date.now()) / 1000)} s (así se frenan los ataques de fuerza bruta).`; return; }
      if (HA.verificarClave(p, $('#lc').value)) { HA.sonido.bien(); iniciarSesion(p); }
      else {
        intentos++; HA.sonido.mal();
        if (intentos >= 5) { bloqueoHasta = Date.now() + 30000; intentos = 0; $('#le').textContent = '5 intentos fallidos: cuenta bloqueada 30 segundos.'; }
        else $('#le').textContent = `Contraseña incorrecta (${intentos}/5).`;
      }
    };
    $('#entrar').onclick = entrar;
    $('#lc').addEventListener('keydown', e => { if (e.key === 'Enter') entrar(); });
    setTimeout(() => $('#lc').focus(), 50);
  }

  function vistaRecuperar(p) {
    app().innerHTML = `<div class="auth"><div class="auth-box"><div class="card">
      <button class="btn-txt" id="volver">‹ Volver</button>
      <h2>Recuperar cuenta</h2><p class="muted">Escribe el <b>código de recuperación</b> que te dio HackAndes cuando creaste tu cuenta.</p>
      <div class="campo"><label for="rc">Código (ej: ABCD-EFGH-JKLM)</label><input id="rc" autocomplete="off" style="text-transform:uppercase;font-family:monospace"></div>
      <div class="campo"><label for="rn">Nueva contraseña</label><input id="rn" type="password" autocomplete="new-password"></div>
      ${HA.medidorHTML('rm')}
      <div class="error-txt" id="re" style="margin-top:8px"></div>
      <button class="btn full" id="rok" style="margin-top:8px">Cambiar contraseña</button>
    </div></div></div>`;
    $('#volver').onclick = () => vistaLogin(p);
    $('#rn').addEventListener('input', e => HA.actualizarMedidor('rm', e.target.value));
    $('#rok').onclick = () => {
      const code = $('#rc').value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (window.hashPassword(code, p.recSal) !== p.recHash) { $('#re').textContent = 'Ese código no es correcto.'; HA.sonido.mal(); return; }
      const nv = $('#rn').value, f = HA.fuerza(nv);
      if (nv.length < 8 || f.score < 2) { $('#re').textContent = 'La nueva contraseña debe ser al menos "Aceptable" y tener 8 caracteres.'; return; }
      p.sal = randStr(16); p.hash = window.hashPassword(nv, p.sal);
      const rec = randStr(12); p.recSal = randStr(16); p.recHash = window.hashPassword(rec, p.recSal); guardar();
      mostrarCodigo(rec.match(/.{1,4}/g).join('-'), () => iniciarSesion(p), 'Contraseña cambiada ✅. Tu código anterior ya no sirve; este es el nuevo:');
    };
  }

  function mostrarCodigo(code, sig, msg) {
    app().innerHTML = `<div class="auth"><div class="auth-box"><div class="card">
      <h2>🔑 Tu código de recuperación</h2><p class="muted">${msg || 'Si olvidas tu contraseña, este código es la ÚNICA forma de recuperar tu cuenta. Anótalo en papel o tómale foto.'}</p>
      <div class="codigo-rec" id="codigo">${code}</div>
      <div class="row" style="margin:10px 0"><button class="btn blanco mini grow" id="copiar">Copiar</button></div>
      <div class="aviso">⚠️ No lo compartas con nadie. Quien tenga este código puede cambiar tu contraseña.</div>
      <label class="row" style="margin:12px 0;font-weight:800"><input type="checkbox" id="guarde" style="width:22px;height:22px;accent-color:#6C3CE1"> Ya lo guardé en un lugar seguro</label>
      <button class="btn full" id="seguir" disabled>Continuar</button></div></div></div>`;
    $('#copiar').onclick = () => { navigator.clipboard && navigator.clipboard.writeText(code).then(() => HA.toast('📋 Copiado'), () => HA.toast('Cópialo a mano 🙂')); };
    $('#guarde').onchange = e => { $('#seguir').disabled = !e.target.checked; };
    $('#seguir').onclick = sig;
  }

  function vistaRegistro() {
    const d = { nombre: '', usuario: '', clave: '', animal: 'leon', nombreMascota: '' };
    let paso = 1;
    const pasos = () => `<div class="pasos">${[1, 2, 3].map(i => `<i class="${i <= paso ? 'on' : ''}"></i>`).join('')}</div>`;
    function render() {
      let h = `<div class="auth"><div class="auth-box"><div class="card"><button class="btn-txt" id="volver">‹ ${paso === 1 ? 'Volver' : 'Atrás'}</button>${pasos()}`;
      if (paso === 1) {
        h += `<h2>Crea tu cuenta</h2><p class="muted">Paso 1 de 3: ¿cómo te llamamos?</p>
          <div class="campo"><label for="rn">Tu nombre</label><input id="rn" maxlength="30" value="${esc(d.nombre)}" placeholder="Ej: Jhordy" autocomplete="given-name"></div>
          <div class="campo"><label for="ru">Usuario para entrar</label><input id="ru" maxlength="20" value="${esc(d.usuario)}" placeholder="Ej: jhordy21" autocomplete="username"></div>
          <div class="ciber-tip"><b>Dato ciber:</b> en internet, no uses tu cédula ni tu fecha de nacimiento como usuario. Son datos personales que los atacantes aprovechan.</div>
          <div class="error-txt" id="err"></div><button class="btn full" id="sig">Siguiente</button>`;
      } else if (paso === 2) {
        h += `<h2>Tu contraseña</h2><p class="muted">Paso 2 de 3: tu primera lección de ciberseguridad empieza aquí 😉</p>
          <div class="campo"><label for="rc">Contraseña</label><input id="rc" type="password" autocomplete="new-password" value="${esc(d.clave)}"></div>
          ${HA.medidorHTML('rg')}
          <div class="campo" style="margin-top:12px"><label for="rc2">Repite la contraseña</label><input id="rc2" type="password" autocomplete="new-password"></div>
          <div class="ciber-tip"><b>Truco:</b> usa una <b>frase de contraseña</b>: varias palabras con símbolos y números. Ej: <code>Cuy-Asado#En-Latacunga26</code>. Es larga, fácil de recordar y difícil de adivinar.</div>
          <div class="error-txt" id="err"></div><button class="btn full" id="sig">Siguiente</button>`;
      } else {
        h += `<h2>Elige tu compañero</h2><p class="muted">Paso 3 de 3: evolucionará contigo hasta su forma legendaria.</p>
          <div class="elige">${Object.entries(window.Mascota.ANIMALES).map(([k, a]) => `<button data-an="${k}" class="${d.animal === k ? 'sel' : ''}"><div class="em">${window.Mascota.svg(k, 1, d.animal === k ? 'feliz' : 'normal')}</div><b>${a.nombre}</b></button>`).join('')}</div>
          <p class="center small muted" style="margin:10px 0 4px">Así se verá cuando termines el curso:</p>
          <div style="width:170px;height:170px;margin:0 auto">${window.Mascota.svg(d.animal, 5, 'normal')}</div>
          <div class="campo"><label for="rm">Nombre de tu mascota</label><input id="rm" maxlength="16" value="${esc(d.nombreMascota || window.Mascota.ANIMALES[d.animal].defNombre)}"></div>
          <div class="error-txt" id="err"></div><button class="btn full dorado" id="sig">¡Crear cuenta!</button>`;
      }
      h += `</div></div></div>`;
      app().innerHTML = h;
      $('#volver').onclick = () => { if (paso === 1) vistaAuth(); else { paso--; render(); } };
      if (paso === 2) { $('#rc').addEventListener('input', e => { d.clave = e.target.value; HA.actualizarMedidor('rg', d.clave); }); HA.actualizarMedidor('rg', d.clave); }
      if (paso === 3) $$('[data-an]').forEach(b => b.onclick = () => { const vm = $('#rm').value; if (!vm || vm === window.Mascota.ANIMALES[d.animal].defNombre) d.nombreMascota = ''; else d.nombreMascota = vm; d.animal = b.dataset.an; render(); });
      const err = (m) => { $('#err').textContent = m; HA.sonido.mal(); };
      $('#sig').onclick = () => {
        if (paso === 1) {
          d.nombre = $('#rn').value.trim(); d.usuario = $('#ru').value.trim().toLowerCase();
          if (d.nombre.length < 2) return err('Escribe tu nombre (mínimo 2 letras).');
          if (!/^[a-z0-9_.]{3,20}$/.test(d.usuario)) return err('El usuario debe tener de 3 a 20 caracteres: letras, números, punto o guion bajo.');
          if (Object.values(db.perfiles).some(p => p.usuario === d.usuario)) return err('Ese usuario ya existe en este dispositivo.');
          paso = 2; render(); $('#rc').focus();
        } else if (paso === 2) {
          const f = HA.fuerza(d.clave);
          if (d.clave.length < 8) return err('Mínimo 8 caracteres.');
          if (f.score < 2) return err(`Tu contraseña es "${f.nombre}". Necesitas al menos "Aceptable". ¡Agrégale largo, símbolos o números!`);
          if (d.clave.toLowerCase().includes(d.usuario) || d.clave.toLowerCase().includes(d.nombre.toLowerCase())) return err('No uses tu nombre ni tu usuario dentro de la contraseña: es lo primero que prueba un atacante.');
          if ($('#rc2').value !== d.clave) return err('Las contraseñas no coinciden.');
          paso = 3; render();
        } else {
          d.nombreMascota = $('#rm').value.trim();
          const btn = $('#sig'); btn.disabled = true; btn.textContent = 'Calculando hash…';
          setTimeout(() => {
            const { p, rec } = nuevoPerfil(d);
            HA.confeti(); HA.sonido.fin();
            mostrarCodigo(rec, () => { iniciarSesion(p); setTimeout(bienvenida, 300); });
          }, 30);
        }
      };
      const inp = $('.auth input'); if (inp && paso !== 3) inp.addEventListener('keydown', e => { if (e.key === 'Enter') $('#sig').click(); });
    }
    render();
  }
  function bienvenida() {
    const p = perfil(); if (!p) return;
    HA.modal(`<div class="center"><div style="width:170px;height:170px;margin:0 auto">${window.Mascota.svg(p.animal, 1, 'feliz')}</div>
      <h2>¡Bienvenido a HackAndes, ${esc(p.nombre)}!</h2>
      <p>${esc(p.nombreMascota)} será tu compañero. Cada vez que completes unidades, <b>evolucionará</b> hasta su forma legendaria.</p>
      <div class="ciber-tip" style="text-align:left"><b>Cómo funciona:</b><br>🛡️ <b>Firewall</b>: tienes 5 escudos por lección. Cada error baja uno.<br>⚡ <b>Uptime</b>: tu racha de días seguidos estudiando.<br>⭐ <b>XP</b>: puntos que ganas al aprender.</div>
      <button class="btn full" onclick="HA.cerrarModal()">¡Vamos!</button></div>`);
  }

  // =====================================================
  //  ESTRUCTURA PRINCIPAL
  // =====================================================
  const SECCIONES = [
    ['aprender', '🗺️', 'Aprender'], ['laboratorio', '🧪', 'Laboratorio'], ['repaso', '🔁', 'Repaso'], ['perfil', '🏆', 'Logros'], ['mas', '☰', 'Más']
  ];
  let seccion = 'aprender';
  HA.ir = function (sec, arg) {
    const p = perfil(); if (!p) return vistaAuth();
    seccion = sec;
    if (sec === 'leccion') return HA.Leccion.abrir(arg);
    const statbar = `<div class="statbar">
        <button class="stat racha ${rachaActual(p) ? '' : 'apagado'}" data-ir="perfil" title="Uptime: días seguidos estudiando"><span class="em">⚡</span>${rachaActual(p)}</button>
        <button class="stat xp" data-ir="perfil" title="Puntos de experiencia"><span class="em">⭐</span>${p.xp}</button>
        <button class="stat niv" data-ir="perfil" title="Etapa de tu mascota"><span class="em">🧬</span>${etapa(p)}/5</button></div>`;
    app().innerHTML = `<div class="shell">
      <nav class="nav" aria-label="Menú principal"><div class="logo">${HA.logoSVG()}<span>Hack<b>Andes</b></span></div>
        ${SECCIONES.map(([k, i, t]) => `<button data-ir="${k}" class="${sec === k ? 'activo' : ''}"><span class="ico">${i}</span><span class="t">${t}</span></button>`).join('')}
        <div class="espacio"></div><button data-accion="salir"><span class="ico">🚪</span><span class="t">Salir</span></button></nav>
      <div class="topbar"><div class="logo">${HA.logoSVG()}<span>Hack<b>Andes</b></span></div>${statbar}</div>
      <main class="main" id="main"></main>
      <aside class="side" id="side"></aside>
      <nav class="bottomnav" aria-label="Menú">${SECCIONES.map(([k, i, t]) => `<button data-ir="${k}" class="${sec === k ? 'activo' : ''}" aria-label="${t}">${i}<small>${t}</small></button>`).join('')}</nav>
    </div>`;
    $$('[data-ir]').forEach(b => b.onclick = () => HA.ir(b.dataset.ir));
    $$('[data-accion="salir"]').forEach(b => b.onclick = () => cerrarSesion());
    renderSide(statbar);
    const vistas = { aprender: vistaAprender, laboratorio: HA.vistaLaboratorio, repaso: vistaRepaso, perfil: vistaPerfil, mas: vistaMas };
    (vistas[sec] || vistaAprender)($('#main'), arg);
    window.scrollTo(0, 0);
  };

  function tarjetaMascota(p) {
    const s = etapa(p), n = unidadesHechas(p);
    const sig = s < 5 ? UMBRALES[s + 1] : null;
    let prog = '';
    if (s < 4) prog = `<div class="barra oro" style="margin:8px 0 4px"><i style="width:${Math.min(100, (n - UMBRALES[s]) / (sig - UMBRALES[s]) * 100)}%"></i></div><div class="small muted">Evoluciona en ${sig - n} unidad${sig - n === 1 ? '' : 'es'} más</div>`;
    else if (s === 4) prog = `<div class="small muted" style="margin-top:6px">Termina TODO el curso para la <b>Fusión Legendaria</b> ✨</div>`;
    else prog = `<div class="chip oro" style="margin-top:6px">✨ Forma legendaria</div>`;
    return `<div class="card mascota-card"><div class="mbox">${window.Mascota.svg(p.animal, s, 'normal')}</div>
      <div class="mnombre">${esc(p.nombreMascota)}</div><div class="small" style="font-weight:800;color:var(--morado)">${window.Mascota.nombreEtapa(p.animal, s)} · Etapa ${s}/5</div>${prog}</div>`;
  }
  HA.tarjetaMascota = tarjetaMascota;
  function tarjetaMeta(p) {
    const meta = p.ajustes.meta || 20, x = xpHoy(p);
    return `<div class="card"><div class="row"><h3 class="grow" style="margin:0">🎯 Meta diaria</h3><span class="chip ${x >= meta ? 'oro' : ''}">${x}/${meta} XP</span></div>
      <div class="barra oro" style="margin-top:10px"><i style="width:${Math.min(100, x / meta * 100)}%"></i></div>
      <div class="small muted" style="margin-top:6px">${x >= meta ? '¡Meta cumplida! Tu firewall está feliz 🛡️' : 'Completa lecciones para llegar a tu meta.'}</div></div>`;
  }
  function renderSide(statbar) {
    const p = perfil(), side = $('#side'); if (!side) return;
    const tips = IDX.tips.length ? IDX.tips : ['La mejor defensa es aprender cómo atacan.'];
    const tip = tips[Math.floor(Math.random() * tips.length)];
    const dias = p.ultimoRespaldo ? Math.floor((Date.now() - p.ultimoRespaldo) / 864e5) : null;
    const resp = (p.xp > 0 && (dias === null || dias >= 7)) ? `<div class="card" style="border-color:var(--dorado)"><h3>💾 Haz tu respaldo</h3><p class="small muted">${dias === null ? 'Aún no tienes un respaldo.' : `Tu último respaldo fue hace ${dias} días.`} Regla 3-2-1: 3 copias, 2 lugares distintos, 1 fuera de casa.</p><button class="btn dorado mini full" id="sideResp">Hacer respaldo</button></div>` : '';
    side.innerHTML = statbar + tarjetaMascota(p) + tarjetaMeta(p) + resp + `<div class="card"><h3>💡 ¿Sabías que…?</h3><p class="small" style="margin:0">${tip}</p></div>`;
    const b = $('#sideResp'); if (b) b.onclick = () => HA.exportarRespaldo();
  }

  // ---------- Vista: Aprender (mapa) ----------
  const ZIG = [0, 46, 70, 46, 0, -46, -70, -46];
  function vistaAprender(main) {
    const p = perfil();
    const sig = siguienteLeccion(p);
    let h = `<div class="mascota-movil">${tarjetaMascota(p)}<div style="height:14px"></div></div>`;
    if (!HA.levels.length) h += `<div class="card">No se encontraron los datos del curso.</div>`;
    HA.levels.forEach(lv => {
      const total = lv.units.reduce((s, u) => s + u.lessons.length, 0);
      const done = lv.units.reduce((s, u) => s + u.lessons.filter(l => hecha(p, l.id)).length, 0);
      const abierto = nivelAbierto(p, lv);
      h += `<section class="nivel" id="nivel-${lv.id}"><div class="nivel-head n${lv.n}"><div class="deco">${lv.n}</div>
        <div class="sub">NIVEL ${lv.n} · ${esc(lv.sub)}</div><h2>${esc(lv.nombre)}</h2>
        <div class="barra"><i style="width:${total ? done / total * 100 : 0}%"></i></div>
        <div class="row small" style="font-weight:800"><span>${done}/${total} lecciones</span><span class="grow"></span>
        ${nivelHecho(p, lv) ? `<button class="btn blanco mini" data-cert="${lv.id}">📜 Certificado</button>` : ''}</div></div>`;
      if (!abierto) {
        h += `<div class="card nivel-bloqueado"><div style="font-size:3em">🔒</div><h3>Nivel bloqueado</h3><p class="muted">Termina el Nivel ${lv.n - 1} para abrirlo.<br>¿Ya sabes estos temas? Haz la prueba y salta directo.</p><button class="btn dorado" data-prueba="${lv.id}">Hacer prueba para saltar</button></div></section>`;
        return;
      }
      lv.units.forEach(u => {
        const uh = unidadHecha(p, u);
        h += `<div class="unidad ${uh ? 'hecha' : ''}"><div class="unidad-banner"><div class="num">${u.icono || '📘'}</div><div class="grow"><div class="small" style="font-weight:900;color:var(--suave)">UNIDAD ${u.num}</div><h3>${esc(u.titulo)}</h3><p>${esc(u.desc || '')}</p></div><button class="btn blanco mini" data-guia="${u.id}" title="Ver la guía con toda la teoría">📖<span class="txt-guia"> Guía</span></button></div><div class="camino">`;
        u.lessons.forEach((l, k) => {
          const ab = leccionAbierta(p, l), hc = hecha(p, l.id), act = sig && sig.id === l.id;
          const off = ZIG[(k + u.num * 3) % ZIG.length];
          const ico = hc ? '✔' : (!ab ? '🔒' : (l.reto ? '🏁' : (l.icono || '★')));
          h += `<div class="nodo-wrap" style="transform:translateX(${off}px)">${act ? `<div class="globo">Empezar</div>` : ''}
            <button class="nodo ${hc ? 'hecho' : ''} ${!ab ? 'bloq' : ''} ${act ? 'actual' : ''} ${l.reto ? 'reto' : ''}" data-lec="${l.id}" aria-label="Lección: ${esc(l.titulo)}${hc ? ' (completada)' : ''}${!ab ? ' (bloqueada)' : ''}">${ico}</button>
            <span class="nodo-label">${esc(l.titulo)}</span>
            ${act ? `<div class="mini-mascota" style="${off >= 0 ? 'right:calc(100% + 18px)' : 'left:calc(100% + 18px)'}">${window.Mascota.svg(p.animal, etapa(p), 'normal')}</div>` : ''}</div>`;
        });
        h += `</div></div>`;
      });
      h += `</section>`;
    });
    if (HA.levels.length < 3) h += `<div class="card center" style="margin-top:10px"><div style="font-size:2.4em">🚧</div><h3>¡Más niveles en camino!</h3><p class="muted small">Los niveles Intermedio y Avanzado llegan en la próxima actualización.</p></div>`;
    h += `<p class="pie">HackAndes v${HA.version} · Hecho en Ecuador 🇪🇨</p>`;
    main.innerHTML = h;
    $$('[data-lec]', main).forEach(b => b.onclick = () => abrirPopLeccion(IDX.porId[b.dataset.lec]));
    $$('[data-guia]', main).forEach(b => b.onclick = () => guiaUnidad(IDX.unidadPorId[b.dataset.guia]));
    $$('[data-prueba]', main).forEach(b => b.onclick = () => HA.Leccion.prueba(b.dataset.prueba));
    $$('[data-cert]', main).forEach(b => b.onclick = () => HA.certificado(b.dataset.cert));
    const act = $('.nodo.actual', main);
    if (act && !HA._scrolled) { HA._scrolled = true; setTimeout(() => act.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120); }
  }
  function abrirPopLeccion(l) {
    const p = perfil();
    if (!leccionAbierta(p, l)) { HA.toast('🔒 Completa la lección anterior primero'); HA.sonido.mal(); return; }
    const hc = hecha(p, l.id);
    const n = l.steps.length;
    HA.modal(`<div class="small" style="font-weight:900;color:var(--suave)">UNIDAD ${l.unidad.num} · LECCIÓN ${l.k + 1} de ${l.unidad.lessons.length}</div>
      <h2>${l.reto ? '🏁 ' : ''}${esc(l.titulo)}</h2><p class="muted">${esc(l.desc || l.unidad.desc || '')}</p>
      <div class="row wrap" style="margin-bottom:14px"><span class="chip">📝 ${n} pasos</span><span class="chip oro">⭐ +${hc ? 5 : 10} XP</span>${hc ? '<span class="chip">✔ Completada</span>' : ''}</div>
      <button class="btn full ${hc ? 'blanco' : ''}" id="empezar">${hc ? 'Repasar' : 'Empezar'}</button>`);
    $('#empezar').onclick = () => { HA.cerrarModal(); HA.Leccion.abrir(l.id); };
  }
  function guiaUnidad(u) {
    let h = `<div class="small" style="font-weight:900;color:var(--suave)">GUÍA · UNIDAD ${u.num}</div><h2>${esc(u.titulo)}</h2>`;
    u.lessons.forEach(l => {
      const t = l.steps.filter(s => s.t === 'teoria');
      if (!t.length) return;
      h += `<h3 style="margin-top:18px;color:var(--morado)">${esc(l.titulo)}</h3>`;
      t.forEach(s => { h += `<div style="margin-bottom:12px"><b>${s.titulo}</b><div class="small">${s.txt}</div>${s.dato ? `<div class="dato small"><b>Dato:</b> ${s.dato}</div>` : ''}</div>`; });
    });
    h += `<button class="btn full" onclick="HA.cerrarModal()" style="margin-top:10px">Cerrar</button>`;
    HA.modal(h, { noFocus: true });
  }

  // ---------- Vista: Repaso ----------
  function vistaRepaso(main) {
    const p = perfil();
    const nErr = (p.errores || []).filter(r => HA.Leccion.pasoDeRef(r)).length;
    const nHechas = Object.keys(p.hechas || {}).length;
    main.innerHTML = `<div class="titulo-sec"><h1>Repaso</h1></div>
      <div class="grid2">
        <div class="card"><div style="font-size:2.4em">🩹</div><h3>Corregir mis errores</h3><p class="muted small">Vuelve a las preguntas que fallaste hasta dominarlas. Así se tapan los "huecos" de tu conocimiento.</p>
          <div class="chip tom" style="margin-bottom:12px">${nErr} pendiente${nErr === 1 ? '' : 's'}</div><button class="btn full" id="repErr" ${nErr ? '' : 'disabled'}>Repasar errores</button></div>
        <div class="card"><div style="font-size:2.4em">🎲</div><h3>Práctica mezclada</h3><p class="muted small">10 preguntas al azar de las lecciones que ya completaste. Ideal antes de un examen.</p>
          <div class="chip" style="margin-bottom:12px">${nHechas} lecciones disponibles</div><button class="btn full dorado" id="repMix" ${nHechas ? '' : 'disabled'}>Practicar</button></div>
      </div>
      <div class="card" style="margin-top:14px"><h3>📖 Guías de estudio</h3><p class="muted small">Toda la teoría de cada unidad en una sola página.</p><div class="row wrap">${IDX.unidades.filter(u => nivelAbierto(p, u.nivel)).map(u => `<button class="btn blanco mini" data-guia="${u.id}">${u.icono || '📘'} ${esc(u.titulo)}</button>`).join('')}</div></div>`;
    const a = $('#repErr'); if (a) a.onclick = () => HA.Leccion.repaso('errores');
    const b = $('#repMix'); if (b) b.onclick = () => HA.Leccion.repaso('mezcla');
    $$('[data-guia]', main).forEach(x => x.onclick = () => guiaUnidad(IDX.unidadPorId[x.dataset.guia]));
  }

  // ---------- Logros ----------
  const LOGROS = [
    ['primer', '🚀', 'Primer paso', 'Completa tu primera lección', p => Object.keys(p.hechas).length >= 1],
    ['perfecta', '💎', 'Sin errores', 'Termina una lección sin perder escudos', p => p.stats.perfectas >= 1],
    ['perfecta10', '👑', 'Precisión de francotirador', '10 lecciones perfectas', p => p.stats.perfectas >= 10],
    ['racha3', '⚡', 'Uptime 3 días', 'Estudia 3 días seguidos', p => (p.racha.mejor || 0) >= 3],
    ['racha7', '🔥', 'Uptime semanal', 'Estudia 7 días seguidos', p => (p.racha.mejor || 0) >= 7],
    ['racha30', '🌋', 'Servidor 24/7', 'Estudia 30 días seguidos', p => (p.racha.mejor || 0) >= 30],
    ['xp100', '⭐', '100 XP', 'Consigue 100 puntos', p => p.xp >= 100],
    ['xp500', '🌟', '500 XP', 'Consigue 500 puntos', p => p.xp >= 500],
    ['xp1000', '✨', '1000 XP', 'Consigue 1000 puntos', p => p.xp >= 1000],
    ['meta', '🎯', 'Meta cumplida', 'Cumple tu meta diaria', p => xpHoy(p) >= (p.ajustes.meta || 20)],
    ['evo2', '🌱', 'Primera evolución', 'Tu mascota llega a Aprendiz', p => etapa(p) >= 2],
    ['evo3', '⚔️', 'Guerrero digital', 'Tu mascota llega a Guerrero', p => etapa(p) >= 3],
    ['evo4', '🛡️', 'Guardián', 'Tu mascota llega a Guardián', p => etapa(p) >= 4],
    ['evo5', '🐉', 'Fusión Legendaria', 'Tu mascota alcanza su forma final', p => etapa(p) >= 5],
    ['nivel1', '🟣', 'Nivel 1 superado', 'Completa el Nivel Básico', p => HA.levels[0] && nivelHecho(p, HA.levels[0])],
    ['nivel2', '🟡', 'Nivel 2 superado', 'Completa el Nivel Intermedio', p => HA.levels[1] && nivelHecho(p, HA.levels[1])],
    ['nivel3', '🟠', 'Nivel 3 superado', 'Completa el Nivel Avanzado', p => HA.levels[2] && nivelHecho(p, HA.levels[2])],
    ['respaldo', '💾', 'Regla 3-2-1', 'Haz tu primer respaldo', p => !!p.ultimoRespaldo],
    ['terminal', '💻', 'Manos en la terminal', 'Ejecuta 50 comandos', p => p.stats.cmds >= 50],
    ['labs', '🧪', 'Científico loco', 'Usa 5 herramientas del laboratorio', p => Object.keys(p.stats.labs || {}).length >= 5],
    ['repaso', '🩹', 'Parche aplicado', 'Completa un repaso', p => (p.stats.repasos || 0) >= 1],
    ['buho', '🦉', 'Hacker nocturno', 'Estudia después de las 23:00', p => !!p.stats.buho],
    ['salto', '🦘', 'Salto de nivel', 'Aprueba una prueba para saltar de nivel', p => Object.keys(p.desbloqueos || {}).length >= 1]
  ];
  HA.revisarLogros = function () {
    const p = perfil(); if (!p) return [];
    const nuevos = [];
    LOGROS.forEach(([id, ic, nom, d, f]) => { if (!p.logros[id] && f(p)) { p.logros[id] = Date.now(); nuevos.push([ic, nom]); } });
    if (nuevos.length) { guardar(); nuevos.forEach(([ic, nom], i) => setTimeout(() => { HA.toast(`${ic} ¡Logro desbloqueado! <b>${esc(nom)}</b>`, 'logro'); HA.sonido.logro(); }, 600 + i * 900)); }
    return nuevos;
  };

  // ---------- Vista: Perfil / Logros ----------
  function vistaPerfil(main) {
    const p = perfil();
    const dias = [];
    for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); dias.push([dkey(d), d]); }
    const max = Math.max(10, ...dias.map(([k]) => p.xpLog[k] || 0));
    const pres = p.stats.resp ? Math.round(p.stats.bien / p.stats.resp * 100) : 0;
    const certs = HA.levels.filter(lv => nivelHecho(p, lv));
    main.innerHTML = `<div class="titulo-sec"><h1>${esc(p.nombre)}</h1><span class="chip">@${esc(p.usuario)}</span></div>
      <div class="mascota-movil">${tarjetaMascota(p)}<div style="height:14px"></div></div>
      <div class="card"><h3>📊 Estadísticas</h3><div class="kpis">
        <div class="kpi"><span class="e">⚡</span><div><b>${rachaActual(p)}</b><span>Uptime (días)</span></div></div>
        <div class="kpi"><span class="e">🏅</span><div><b>${p.racha.mejor || 0}</b><span>Mejor racha</span></div></div>
        <div class="kpi"><span class="e">⭐</span><div><b>${p.xp}</b><span>XP total</span></div></div>
        <div class="kpi"><span class="e">📚</span><div><b>${Object.keys(p.hechas).length}/${IDX.lecciones.length}</b><span>Lecciones</span></div></div>
        <div class="kpi"><span class="e">🎯</span><div><b>${pres}%</b><span>Precisión</span></div></div>
        <div class="kpi"><span class="e">⏱️</span><div><b>${Math.round(p.stats.seg / 60)}</b><span>Minutos</span></div></div>
        <div class="kpi"><span class="e">💻</span><div><b>${p.stats.cmds}</b><span>Comandos</span></div></div>
        <div class="kpi"><span class="e">🧬</span><div><b>${etapa(p)}/5</b><span>Evolución</span></div></div></div>
        <h3 style="margin-top:18px">XP de los últimos 7 días</h3>
        <div class="grafico">${dias.map(([k, d], i) => `<div class="col ${i === 6 ? 'hoy' : ''}"><em>${p.xpLog[k] || 0}</em><i style="height:${((p.xpLog[k] || 0) / max * 100).toFixed(0)}%"></i><span>${i === 6 ? 'Hoy' : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()]}</span></div>`).join('')}</div></div>
      <div class="card" style="margin-top:14px"><h3>📜 Certificados</h3>${certs.length ? `<div class="row wrap">${certs.map(lv => `<button class="btn dorado mini" data-cert="${lv.id}">Nivel ${lv.n}: ${esc(lv.nombre)}</button>`).join('')}${HA.levels.length === 3 && certs.length === 3 ? `<button class="btn mini" data-cert="final">🏆 Certificado final</button>` : ''}</div>` : '<p class="muted small" style="margin:0">Completa un nivel entero para obtener tu certificado imprimible.</p>'}</div>
      <h2 style="margin-top:22px">🏆 Logros <span class="chip">${Object.keys(p.logros).length}/${LOGROS.length}</span></h2>
      <div class="logros">${LOGROS.map(([id, ic, nom, d]) => `<div class="logro ${p.logros[id] ? '' : 'no'}"><div class="li">${ic}</div><div><b>${esc(nom)}</b><div class="d">${esc(d)}</div></div></div>`).join('')}</div>`;
    $$('[data-cert]', main).forEach(b => b.onclick = () => HA.certificado(b.dataset.cert));
  }

  // ---------- Vista: Más ----------
  function vistaMas(main, tab) {
    tab = tab || 'glosario';
    const tabs = [['glosario', '📖 Glosario'], ['ranking', '🏅 Ranking'], ['ajustes', '⚙️ Ajustes'], ['respaldo', '💾 Respaldo'], ['acerca', 'ℹ️ Acerca']];
    main.innerHTML = `<div class="pestanas">${tabs.map(([k, t]) => `<button class="${k === tab ? 'on' : ''}" data-tab="${k}">${t}</button>`).join('')}</div><div id="tabc"></div>`;
    $$('[data-tab]', main).forEach(b => b.onclick = () => vistaMas(main, b.dataset.tab));
    const c = $('#tabc'), p = perfil();
    if (tab === 'glosario') {
      c.innerHTML = `<h1>Glosario</h1><input class="input-grande" id="gq" placeholder="🔍 Busca un término: phishing, hash, IP..." aria-label="Buscar en el glosario"><div id="gl" style="margin-top:10px"></div>`;
      const pinta = (q) => {
        const qq = normaliza(q || '');
        const items = IDX.glosario.filter(g => nivelAbierto(p, HA.levels[g.n - 1]) && (!qq || normaliza(g.t + ' ' + g.d).includes(qq)));
        $('#gl').innerHTML = items.length ? items.map(g => `<div class="glosario-item"><b>${esc(g.t)}</b> <span class="chip">N${g.n}</span><div>${g.d}</div></div>`).join('') : '<p class="muted">No encontré ese término 🤔</p>';
      };
      $('#gq').oninput = e => pinta(e.target.value); pinta('');
    } else if (tab === 'ranking') {
      const ps = Object.values(db.perfiles).sort((a, b) => b.xp - a.xp);
      c.innerHTML = `<h1>Ranking</h1><p class="muted small">Compara tu XP con las otras cuentas de este dispositivo. (El ranking en línea llegará en una próxima versión.)</p><div class="card">` +
        ps.map((x, i) => `<div class="ranking-item ${x.id === p.id ? 'yo' : ''}"><div class="pos">${['🥇', '🥈', '🥉'][i] || i + 1}</div><div class="rm">${window.Mascota.svg(x.animal, etapa(x), 'normal', { anim: false })}</div><div class="grow"><b class="fredoka">${esc(x.nombre)}</b><div class="small muted">⚡ ${rachaActual(x)} días · ${Object.keys(x.hechas).length} lecciones</div></div><b class="fredoka" style="color:var(--dorado-osc)">${x.xp} XP</b></div>`).join('') + `</div>`;
    } else if (tab === 'ajustes') {
      const a = p.ajustes;
      const sw = (k, t, d) => `<div class="ajuste"><div><b>${t}</b><div class="small muted">${d}</div></div><label class="switch"><input type="checkbox" data-aj="${k}" ${a[k] ? 'checked' : ''} aria-label="${t}"><span></span></label></div>`;
      c.innerHTML = `<h1>Ajustes</h1><div class="card">
        ${sw('oscuro', '🌙 Modo oscuro', 'Más cómodo de noche (y más hacker 😎).')}
        ${sw('sonido', '🔊 Sonidos', 'Efectos al acertar, fallar y evolucionar.')}
        ${sw('letraGrande', '🔠 Letra grande', 'Textos más fáciles de leer.')}
        ${sw('autobloqueo', '🔒 Bloqueo automático', 'Pide tu contraseña después de 15 minutos sin uso.')}
        <div class="ajuste"><div><b>🎯 Meta diaria</b><div class="small muted">XP que quieres ganar cada día.</div></div><select id="meta" class="campo" style="margin:0;padding:8px;border-radius:12px;border:2px solid var(--borde);background:var(--card);font-weight:800">${[10, 20, 30, 50].map(v => `<option value="${v}" ${a.meta == v ? 'selected' : ''}>${v} XP · ${{ 10: 'Relajado', 20: 'Normal', 30: 'Serio', 50: 'Intenso' }[v]}</option>`).join('')}</select></div>
        <div class="ajuste"><div><b>🐾 Nombre de tu mascota</b></div><div class="row"><input id="nmasc" value="${esc(p.nombreMascota)}" maxlength="16" style="padding:8px 10px;border-radius:12px;border:2px solid var(--borde);background:var(--card);font-weight:800;width:140px"><button class="btn mini" id="gmasc">OK</button></div></div></div>
        <h2 style="margin-top:20px">🔐 Seguridad de tu cuenta</h2><div class="card">
        <div class="ajuste"><div><b>Cambiar contraseña</b><div class="small muted">Te pediremos la actual.</div></div><button class="btn blanco mini" id="cclave">Cambiar</button></div>
        <div class="ajuste"><div><b>Nuevo código de recuperación</b><div class="small muted">El anterior dejará de funcionar.</div></div><button class="btn blanco mini" id="crec">Generar</button></div>
        <div class="ajuste"><div><b>Cerrar sesión</b><div class="small muted">Hazlo siempre en computadoras compartidas.</div></div><button class="btn blanco mini" id="csal">Salir</button></div>
        <div class="ajuste"><div><b style="color:var(--tomate-osc)">Eliminar mi cuenta</b><div class="small muted">Se borra todo tu progreso de este dispositivo.</div></div><button class="btn tomate mini" id="cdel">Eliminar</button></div></div>`;
      $$('[data-aj]', c).forEach(i => i.onchange = () => { a[i.dataset.aj] = i.checked; if (i.dataset.aj === 'oscuro') db.ui.oscuro = i.checked; guardar(); aplicarTema(); });
      $('#meta').onchange = e => { a.meta = +e.target.value; guardar(); renderSide(); HA.toast('🎯 Meta actualizada'); };
      $('#gmasc').onclick = () => { const v = $('#nmasc').value.trim(); if (v) { p.nombreMascota = v; guardar(); HA.toast(`🐾 Ahora se llama ${esc(v)}`); renderSide(); } };
      $('#cclave').onclick = cambiarClave;
      $('#crec').onclick = async () => {
        const c0 = await HA.pedirClave('Nuevo código', 'Confirma tu contraseña actual.'); if (c0 === null) return;
        if (!HA.verificarClave(p, c0)) return HA.toast('❌ Contraseña incorrecta');
        const rec = randStr(12); p.recSal = randStr(16); p.recHash = window.hashPassword(rec, p.recSal); guardar();
        HA.modal(`<h2>🔑 Nuevo código</h2><div class="codigo-rec">${rec.match(/.{1,4}/g).join('-')}</div><p class="muted small" style="margin-top:10px">Guárdalo en un lugar seguro. El código anterior ya no sirve.</p><button class="btn full" onclick="HA.cerrarModal()">Listo</button>`);
      };
      $('#csal').onclick = cerrarSesion;
      $('#cdel').onclick = async () => {
        const c0 = await HA.pedirClave('Eliminar cuenta', 'Esta acción no se puede deshacer. Confirma con tu contraseña.'); if (c0 === null) return;
        if (!HA.verificarClave(p, c0)) return HA.toast('❌ Contraseña incorrecta');
        if (!(await HA.confirmar('¿Seguro?', `Se borrará la cuenta de ${esc(p.nombre)} y todo su progreso. Si no tienes respaldo, no podrás recuperarla.`, 'Sí, eliminar', 'Cancelar', true))) return;
        delete db.perfiles[p.id]; guardar(); cerrarSesion(); HA.toast('Cuenta eliminada');
      };
    } else if (tab === 'respaldo') {
      const d = p.ultimoRespaldo ? new Date(p.ultimoRespaldo).toLocaleString('es-EC') : 'nunca';
      c.innerHTML = `<h1>Respaldo</h1><div class="card"><h3>💾 Descargar mi respaldo</h3>
        <p class="muted">Se descarga un archivo <code>.hka</code> <b>cifrado con tu contraseña</b> (AES-GCM, el mismo tipo de cifrado que usan los bancos). Sirve para pasar tu progreso a otra computadora o celular, o para no perderlo si se borra el navegador.</p>
        <p class="small">Último respaldo: <b>${d}</b></p><button class="btn dorado" id="exp">Descargar respaldo</button></div>
        <div class="card" style="margin-top:14px"><h3>📂 Restaurar un respaldo</h3><p class="muted">Abre un archivo <code>.hka</code>. Te pediremos la contraseña de esa cuenta para descifrarlo.</p><button class="btn blanco" id="imp">Abrir archivo</button></div>
        <div class="ciber-tip"><b>Regla 3-2-1 de los respaldos:</b> ten <b>3</b> copias de tus datos, en <b>2</b> lugares distintos (ej: tu PC y una memoria USB), y <b>1</b> fuera de casa (ej: tu correo o la nube). Así ni un ransomware ni un celular perdido te dejan sin nada.</div>`;
      $('#exp').onclick = () => HA.exportarRespaldo();
      $('#imp').onclick = () => HA.importarRespaldo();
    } else {
      c.innerHTML = `<h1>Acerca de HackAndes</h1><div class="card"><div class="row"><div style="width:64px;height:64px">${HA.logoSVG()}</div><div><h2 style="margin:0">Hack<span style="color:var(--dorado)">Andes</span></h2><div class="muted small">Versión ${HA.version}</div></div></div>
        <p style="margin-top:12px">Curso gratuito para aprender ciberseguridad desde cero hasta nivel avanzado, con práctica simulada que funciona sin internet y sin instalar programas.</p>
        <p><b>Creado por:</b> Jhordy Cabascango · ESPE Sede Latacunga 🇪🇨</p>
        <div class="aviso"><b>⚖️ Uso ético:</b> todo lo que aprendes aquí es para <b>defender</b>. Practica solo en tus laboratorios o en plataformas autorizadas. En Ecuador, acceder sin permiso a un sistema informático es delito (art. 234 del COIP).</div>
        <p class="small muted">Tipografías Fredoka y Nunito bajo licencia SIL Open Font License. Todo funciona sin conexión: tus datos nunca salen de este dispositivo.</p></div>`;
    }
  }
  HA.vistaMas = vistaMas;

  async function cambiarClave() {
    const p = perfil();
    HA.modal(`<h2>Cambiar contraseña</h2><div class="campo"><label for="ca">Contraseña actual</label><input id="ca" type="password" autocomplete="current-password"></div>
      <div class="campo"><label for="cn">Nueva contraseña</label><input id="cn" type="password" autocomplete="new-password"></div>${HA.medidorHTML('cm')}
      <div class="error-txt" id="ce" style="margin-top:8px"></div><div class="row" style="justify-content:flex-end"><button class="btn blanco mini" onclick="HA.cerrarModal()">Cancelar</button><button class="btn mini" id="cok">Guardar</button></div>`);
    $('#cn').oninput = e => HA.actualizarMedidor('cm', e.target.value);
    $('#cok').onclick = () => {
      if (!HA.verificarClave(p, $('#ca').value)) { $('#ce').textContent = 'La contraseña actual no es correcta.'; return; }
      const nv = $('#cn').value, f = HA.fuerza(nv);
      if (nv.length < 8 || f.score < 2) { $('#ce').textContent = 'La nueva debe ser al menos "Aceptable" (8+ caracteres).'; return; }
      p.sal = randStr(16); p.hash = window.hashPassword(nv, p.sal); guardar(); HA.cerrarModal(); HA.toast('🔐 Contraseña actualizada');
    };
  }

  // ---------- Respaldo cifrado ----------
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  async function claveAES(pass, sal) {
    const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pass), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: sal, iterations: 150000, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  HA.exportarRespaldo = async function () {
    const p = perfil(); if (!p) return;
    const clave = await HA.pedirClave('💾 Respaldo cifrado', 'Escribe tu contraseña. Con ella se cifra el archivo: sin ella nadie puede abrirlo.');
    if (clave === null) return;
    if (!HA.verificarClave(p, clave)) { HA.toast('❌ Contraseña incorrecta'); HA.sonido.mal(); return; }
    p.ultimoRespaldo = Date.now(); guardar();
    const datos = JSON.stringify(p);
    let archivo;
    if (window.crypto && crypto.subtle) {
      const sal = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
      const k = await claveAES(clave, sal);
      const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(datos));
      archivo = { app: 'HackAndes', formato: 1, cifrado: true, usuario: p.usuario, fecha: new Date().toISOString(), sal: b64(sal), iv: b64(iv), datos: b64(ct) };
    } else {
      archivo = { app: 'HackAndes', formato: 1, cifrado: false, usuario: p.usuario, fecha: new Date().toISOString(), datos: btoa(unescape(encodeURIComponent(datos))) };
      HA.toast('⚠️ Este navegador no permite cifrar aquí: el respaldo se guardó SIN cifrar.');
    }
    const blob = new Blob([JSON.stringify(archivo)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `hackandes-${p.usuario}-${dkey()}.hka`;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    HA.toast('💾 Respaldo descargado'); HA.revisarLogros(); if ($('#side')) renderSide();
    return archivo;
  };
  HA.importarRespaldo = function (archivoTexto) {
    const procesar = async (txt) => {
      let f; try { f = JSON.parse(txt); } catch (e) { return HA.toast('❌ Ese archivo no es un respaldo válido'); }
      if (!f || f.app !== 'HackAndes') return HA.toast('❌ Ese archivo no es un respaldo de HackAndes');
      let datos;
      if (f.cifrado) {
        const clave = await HA.pedirClave('📂 Restaurar respaldo', `Contraseña de la cuenta <b>@${esc(f.usuario || '')}</b>`);
        if (clave === null) return;
        try {
          const k = await claveAES(clave, unb64(f.sal));
          const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(f.iv) }, k, unb64(f.datos));
          datos = new TextDecoder().decode(pt);
        } catch (e) { HA.sonido.mal(); return HA.toast('❌ Contraseña incorrecta o archivo dañado'); }
      } else datos = decodeURIComponent(escape(atob(f.datos)));
      let p; try { p = JSON.parse(datos); } catch (e) { return HA.toast('❌ Archivo dañado'); }
      if (!p || !p.id || !p.hash) return HA.toast('❌ Archivo dañado');
      const existe = db.perfiles[p.id];
      if (existe && !(await HA.confirmar('Ya existe esa cuenta', `En este dispositivo ya está la cuenta @${esc(p.usuario)} (${existe.xp} XP). ¿La reemplazas con el respaldo (${p.xp} XP)?`, 'Reemplazar'))) return;
      db.perfiles[p.id] = p; guardar(); HA.toast('✅ Respaldo restaurado'); HA.sonido.fin();
      if (perfil()) HA.ir(seccion); else vistaLogin(p);
    };
    if (archivoTexto) return procesar(archivoTexto);
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.hka,application/json';
    inp.onchange = () => { const file = inp.files[0]; if (!file) return; const r = new FileReader(); r.onload = () => procesar(r.result); r.readAsText(file); };
    inp.click();
  };

  // ---------- Certificados ----------
  HA.certificado = function (lvId) {
    const p = perfil();
    const final = lvId === 'final';
    const lv = HA.levels.find(l => l.id === lvId);
    if (!final && (!lv || !nivelHecho(p, lv))) return;
    const fecha = new Date().toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
    const codigo = window.sha256(p.id + '|' + lvId + '|' + p.usuario).slice(0, 12).toUpperCase().match(/.{1,4}/g).join('-');
    const titulo = final ? 'Curso completo de Ciberseguridad: de cero a avanzado' : `Nivel ${lv.n}: ${lv.nombre}`;
    HA.modal(`<div class="certificado"><div style="width:70px;height:70px;margin:0 auto">${HA.logoSVG()}</div>
      <div style="letter-spacing:.3em;font-weight:900;color:#6F6790;font-size:.8em">HACKANDES · CERTIFICADO</div>
      <h1>${final ? 'Certificado de Finalización' : 'Certificado de Nivel'}</h1><p>Se otorga a</p><div class="nombre">${esc(p.nombre)}</div>
      <p>por completar con éxito<br><b style="font-size:1.15em">${esc(titulo)}</b></p>
      <div class="cm">${window.Mascota.svg(p.animal, final ? 5 : etapa(p), 'feliz', { anim: false })}</div>
      <p class="small">Acompañado por <b>${esc(p.nombreMascota)}</b> · ${p.xp} XP · ${fecha}</p>
      <div class="firma"><div>HackAndes 🇪🇨</div><div>Código: ${codigo}</div></div></div>
      <div class="row" style="justify-content:center;margin-top:14px"><button class="btn blanco mini" onclick="HA.cerrarModal()">Cerrar</button><button class="btn dorado mini" onclick="window.print()">🖨️ Imprimir / PDF</button></div>`, { cls: '', noFocus: true });
    $('#modal .modal').style.width = 'min(880px, 100%)';
  };

  // ---------- Inicio ----------
  function boot() {
    cargarDB(); indexar();
    const sid = sessionStorage.getItem(SES_KEY);
    if (sid && db.perfiles[sid]) { sesionId = sid; aplicarTema(); HA.ir('aprender'); }
    else vistaAuth();
    try { if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {}); } catch (e) { /* sin service worker */ }
  }
  HA.boot = boot;
  HA.renderSide = renderSide;
  HA.racha = function (p) {
    const hoy = dkey(), r = p.racha;
    if (r.ultima === hoy) return false;
    r.n = r.ultima === ayer() ? (r.n || 0) + 1 : 1; r.ultima = hoy; r.mejor = Math.max(r.mejor || 0, r.n);
    return true;
  };
  document.addEventListener('DOMContentLoaded', boot);
})();
