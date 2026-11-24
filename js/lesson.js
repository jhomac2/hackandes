/* ============================================================
   HackAndes · Motor de lecciones, ejercicios y laboratorio
   ============================================================ */
(function () {
  'use strict';
  const HA = window.HA, $ = HA.$, $$ = HA.$$, esc = HA.esc;
  const M = () => window.Mascota;
  const app = () => $('#app');

  const FRASES_BIEN = ['¡Excelente!', '¡Correcto!', '¡Acceso concedido! ✅', '¡Así se hace!', '¡Bien hackeado (éticamente) 😉!', '¡Impecable!', '¡Eso es!'];
  const FRASES_MAL = ['Acceso denegado ❌', 'Casi…', '¡Ups! Firewall dañado', 'No pasa nada, así se aprende', 'Ese no era 🤔'];
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const TIPOS_CALIFICADOS = ['opcion', 'vf', 'escribir', 'orden', 'mensaje'];

  // =====================================================
  //  LABORATORIOS (sirven dentro de lecciones y en la pestaña Laboratorio)
  // =====================================================
  const Labs = HA.Labs = {};
  const cesar = (t, n) => t.replace(/[a-zñ]/gi, ch => {
    const abc = 'abcdefghijklmnopqrstuvwxyz';
    const low = ch.toLowerCase(), i = abc.indexOf(low);
    if (i < 0) return ch;
    const r = abc[((i + n) % 26 + 26) % 26];
    return ch === low ? r : r.toUpperCase();
  });
  HA.cesar = cesar;
  const utf8b64 = (s) => btoa(unescape(encodeURIComponent(s)));
  const b64utf8 = (s) => decodeURIComponent(escape(atob(s.replace(/\s/g, ''))));

  Labs.password = (el, o, done) => {
    el.innerHTML = `<div class="lab"><div class="campo"><label for="lpw">Prueba una contraseña (no uses la tuya real)</label><input id="lpw" class="input-grande" autocomplete="off" spellcheck="false"></div>${HA.medidorHTML('lpm')}
      <p class="small muted" style="margin:10px 0 0">Calculamos el tiempo imaginando un atacante que prueba <b>10 mil millones</b> de claves por segundo (una buena tarjeta gráfica).</p></div>`;
    $('#lpw', el).oninput = e => { const f = HA.actualizarMedidor('lpm', e.target.value); if (done && f.score >= (o.meta || 3)) done(); };
  };
  Labs.generador = (el) => {
    el.innerHTML = `<div class="lab"><div class="row wrap"><label class="small"><b>Largo:</b> <input type="range" min="8" max="32" value="16" id="glen"> <span id="glv">16</span></label>
      <label class="small"><input type="checkbox" id="gsim" checked> Símbolos</label><label class="small"><input type="checkbox" id="gfrase"> Frase de palabras</label></div>
      <div class="salida" id="gout" style="margin:12px 0;font-size:1.15em"></div><div class="row"><button class="btn mini" id="gnew">🎲 Generar otra</button><button class="btn blanco mini" id="gcop">Copiar</button></div>
      <p class="small muted" style="margin-top:10px">Se genera con <code>crypto.getRandomValues</code>: números aleatorios seguros del navegador. Nada se envía a internet.</p></div>`;
    const PAL = ['volcan', 'condor', 'llama', 'cuy', 'mote', 'pailon', 'quinua', 'chola', 'canelazo', 'tungurahua', 'cotopaxi', 'mitad', 'mundo', 'colibri', 'orquidea', 'galapagos', 'tortuga', 'cacao', 'banano', 'chimborazo', 'paramo', 'laguna', 'cascada', 'humita', 'tigrillo'];
    const gen = () => {
      const r = new Uint32Array(40); crypto.getRandomValues(r);
      let s;
      if ($('#gfrase', el).checked) { s = Array.from({ length: 4 }, (_, i) => { const w = PAL[r[i] % PAL.length]; return w[0].toUpperCase() + w.slice(1); }).join('-') + (r[5] % 90 + 10) + (($('#gsim', el).checked) ? '#!$%&*'[r[6] % 6] : ''); }
      else { const abc = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789' + ($('#gsim', el).checked ? '#!$%&*-_+=?@' : ''); const n = +$('#glen', el).value; s = Array.from({ length: n }, (_, i) => abc[r[i] % abc.length]).join(''); }
      $('#gout', el).textContent = s;
    };
    $('#glen', el).oninput = e => { $('#glv', el).textContent = e.target.value; gen(); };
    $('#gsim', el).onchange = gen; $('#gfrase', el).onchange = gen; $('#gnew', el).onclick = gen;
    $('#gcop', el).onclick = () => navigator.clipboard && navigator.clipboard.writeText($('#gout', el).textContent).then(() => HA.toast('📋 Copiada'));
    gen();
  };
  Labs.cesar = (el, o) => {
    el.innerHTML = `<div class="lab"><div class="campo"><label for="ctx">Mensaje</label><textarea id="ctx" spellcheck="false">${esc(o.texto || 'Hola desde Latacunga')}</textarea></div>
      <div class="row wrap"><b>Desplazamiento:</b><button class="btn blanco mini" id="cm">−</button><b class="fredoka" id="cn" style="font-size:1.4em;min-width:30px;text-align:center">3</b><button class="btn blanco mini" id="cp">＋</button>
      <span class="grow"></span><label class="small"><input type="radio" name="cmode" value="1" ${o.texto ? '' : 'checked'}> Cifrar</label><label class="small"><input type="radio" name="cmode" value="-1" ${o.texto ? 'checked' : ''}> Descifrar</label></div>
      <div class="salida" id="cout" style="margin-top:12px"></div></div>`;
    let n = 3;
    const upd = () => { $('#cn', el).textContent = n; const m = +$('input[name=cmode]:checked', el).value; $('#cout', el).textContent = cesar($('#ctx', el).value, n * m); };
    $('#cm', el).onclick = () => { n = (n + 25) % 26; upd(); }; $('#cp', el).onclick = () => { n = (n + 1) % 26; upd(); };
    $('#ctx', el).oninput = upd; $$('input[name=cmode]', el).forEach(r => r.onchange = upd); upd();
  };
  Labs.base64 = (el, o) => {
    el.innerHTML = `<div class="lab"><div class="campo"><label for="btx">Texto</label><textarea id="btx" spellcheck="false">${esc(o.texto || 'Hola ESPE')}</textarea></div>
      <div class="row"><button class="btn mini" id="benc">Codificar ➜ Base64</button><button class="btn blanco mini" id="bdec">Decodificar</button></div>
      <div class="salida" id="bout" style="margin-top:12px"></div><p class="small muted" style="margin:8px 0 0">⚠️ Base64 <b>NO es cifrado</b>: cualquiera lo puede decodificar. Solo cambia la forma de escribir los datos.</p></div>`;
    $('#benc', el).onclick = () => { $('#bout', el).textContent = utf8b64($('#btx', el).value); };
    $('#bdec', el).onclick = () => { try { $('#bout', el).textContent = b64utf8($('#btx', el).value); } catch (e) { $('#bout', el).textContent = '❌ Eso no es Base64 válido'; } };
  };
  Labs.binario = (el, o) => {
    el.innerHTML = `<div class="lab"><div class="row wrap"><div class="campo grow"><label for="bdn">Número decimal</label><input id="bdn" type="number" min="0" max="65535" value="${o.numero != null ? o.numero : 42}"></div></div>
      <table class="tabla mono"><tr><th>Sistema</th><th>Valor</th></tr><tr><td>Binario (base 2)</td><td id="bb"></td></tr><tr><td>Hexadecimal (base 16)</td><td id="bh"></td></tr><tr><td>Letra ASCII</td><td id="ba"></td></tr></table>
      <div class="campo" style="margin-top:14px"><label for="btxt">Texto a binario</label><input id="btxt" value="Hi"></div><div class="salida" id="bto"></div></div>`;
    const upd = () => {
      const n = Math.max(0, Math.min(65535, parseInt($('#bdn', el).value || '0', 10)));
      $('#bb', el).textContent = n.toString(2).padStart(8, '0').replace(/(.{4})(?=.)/g, '$1 ');
      $('#bh', el).textContent = '0x' + n.toString(16).toUpperCase();
      $('#ba', el).textContent = n >= 32 && n < 127 ? `"${String.fromCharCode(n)}"` : '(no imprimible)';
      $('#bto', el).textContent = [...$('#btxt', el).value].map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
    };
    $('#bdn', el).oninput = upd; $('#btxt', el).oninput = upd; upd();
  };
  Labs.hash = (el, o) => {
    el.innerHTML = `<div class="lab"><div class="campo"><label for="htx">Texto</label><textarea id="htx" spellcheck="false">${esc(o.texto || 'hola')}</textarea></div>
      <b class="small">SHA-256:</b><div class="salida" id="hout"></div><p class="small muted" style="margin:8px 0 0">Cambia una sola letra y mira cómo cambia TODO el hash (efecto avalancha). Y siempre mide 64 caracteres, aunque escribas un libro entero.</p></div>`;
    const upd = () => { $('#hout', el).textContent = window.sha256($('#htx', el).value); };
    $('#htx', el).oninput = upd; upd();
  };
  Labs.sqli = (el, o, done) => {
    el.innerHTML = `<div class="lab"><div class="login-falso"><div class="lf-title">🏫 Sistema de Notas · Colegio Volcán <span class="chip tom">ficticio</span></div>
      <div class="campo"><label for="su">Usuario</label><input id="su" autocomplete="off" spellcheck="false" value="admin"></div><div class="campo"><label for="sp">Contraseña</label><input id="sp" autocomplete="off" spellcheck="false"></div>
      <label class="small row" style="margin-bottom:10px"><input type="checkbox" id="sseg"> Activar protección (consultas preparadas)</label><button class="btn full mini" id="sgo">Ingresar</button></div>
      <div class="sql-box"><b class="small">Consulta SQL que arma el servidor:</b><div class="salida" id="sq" style="color:#9EC5FF"></div><div id="sres" style="margin-top:10px"></div></div></div>`;
    const upd = () => {
      const u = $('#su', el).value, c = $('#sp', el).value, seg = $('#sseg', el).checked;
      $('#sq', el).textContent = seg ? `SELECT * FROM usuarios WHERE usuario = ? AND clave = ?\n-- parámetros: ["${u}", "${c}"] (se tratan como texto, nunca como código)` : `SELECT * FROM usuarios WHERE usuario = '${u}' AND clave = '${c}'`;
    };
    const ataque = (s) => /'\s*(or|\|\|)\s*('?\w*'?\s*=\s*'?\w*|true|1)/i.test(s) || /'\s*(--|#|\/\*)/.test(s);
    $$('input', el).forEach(i => i.oninput = upd);
    $('#sseg', el).onchange = upd;
    $('#sgo', el).onclick = () => {
      const u = $('#su', el).value, c = $('#sp', el).value, seg = $('#sseg', el).checked, r = $('#sres', el);
      if (!seg && (ataque(u) || ataque(c))) {
        r.innerHTML = `<div class="aviso" style="background:var(--amarillo-claro)">💥 <b>¡Entraste como <code>admin</code> sin saber la contraseña!</b><br>Tu texto cambió la lógica de la consulta: la condición se volvió siempre verdadera (o el resto se volvió comentario). Eso es una <b>inyección SQL</b>.</div>`;
        HA.sonido.bien(); if (done) done();
      } else if (seg && (ataque(u) || ataque(c))) {
        r.innerHTML = `<div class="ciber-tip">🛡️ <b>Ataque bloqueado.</b> Con consultas preparadas, tu comilla <code>'</code> se trata como una letra más, no como código SQL.</div>`;
      } else r.innerHTML = `<div class="aviso">❌ Usuario o contraseña incorrectos.</div>`;
    };
    upd();
  };
  Labs.xss = (el, o, done) => {
    el.innerHTML = `<div class="lab"><div class="lf-title fredoka" style="margin-bottom:8px">🛒 Comentarios · Tienda "El Cuy Feliz" <span class="chip tom">ficticia</span></div>
      <div class="campo"><label for="xc">Escribe un comentario</label><textarea id="xc" spellcheck="false" placeholder="¡Muy buena atención!"></textarea></div>
      <label class="small row" style="margin-bottom:10px"><input type="checkbox" id="xseg"> Activar protección (escapar el HTML)</label><button class="btn mini" id="xgo">Publicar</button>
      <div id="xres" style="margin-top:12px"></div></div>`;
    const peligro = (s) => /<\s*script|on\w+\s*=|javascript:|<\s*img[^>]*src|<\s*iframe|<\s*svg/i.test(s);
    $('#xgo', el).onclick = () => {
      const v = $('#xc', el).value, seg = $('#xseg', el).checked, r = $('#xres', el);
      if (!v.trim()) return;
      if (peligro(v) && !seg) {
        r.innerHTML = `<div class="aviso">🚨 <b>¡El navegador de CADA visitante ejecutaría tu código!</b> (Aquí no lo ejecutamos, solo lo simulamos.)<br>Con esto un atacante podría robar sesiones, cambiar la página o redirigir a un sitio falso. Eso es <b>XSS</b> (Cross-Site Scripting).</div><div class="salida">${esc(v)}</div>`;
        HA.sonido.bien(); if (done) done();
      } else if (peligro(v) && seg) {
        r.innerHTML = `<div class="ciber-tip">🛡️ <b>Bloqueado.</b> El sitio convirtió <code>&lt;</code> y <code>&gt;</code> en texto inofensivo. El comentario se ve, pero no se ejecuta:</div><div class="card small mono">${esc(esc(v))}</div>`;
      } else r.innerHTML = `<div class="card"><b>👤 Visitante:</b> ${esc(v)}</div>`;
    };
  };

  // =====================================================
  //  EJERCICIOS (tipos de paso)
  // =====================================================
  const Tipos = HA.Tipos = {};
  const extra = (p) => p.html ? `<div style="margin-bottom:16px">${p.html}</div>` : '';

  Tipos.teoria = {
    render: (p, ctx) => `<div class="teoria"><div class="tmasc">${M().svg(ctx.perfil.animal, ctx.etapa, p.mood || 'normal')}</div><div class="lec-tipo">📘 ${p.etiqueta || 'Aprende'}</div><h2>${p.titulo}</h2>${p.txt}
      ${p.ec ? `<div class="ejemplo-ec"><b>🇪🇨 En Ecuador:</b> ${p.ec}</div>` : ''}${p.dato ? `<div class="dato"><b>💡 Dato:</b> ${p.dato}</div>` : ''}</div>`
  };
  Tipos.opcion = {
    render: (p) => { const orden = HA.shuffle(p.ops.map((_, i) => i)); return `<div class="lec-tipo">🧠 Elige la respuesta</div><div class="lec-q">${p.q}</div>${extra(p)}<div class="opciones">${orden.map((i, k) => `<button class="opcion" data-i="${i}"><span class="k">${k + 1}</span><span>${p.ops[i]}</span></button>`).join('')}</div>`; },
    mount: (el, p, ctx) => {
      const bs = $$('.opcion', el);
      bs.forEach(b => b.onclick = () => { bs.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); HA.sonido.tecla(); ctx.listo(+b.dataset.i); });
      ctx.teclas = (k) => { const b = bs[+k - 1]; if (b) b.click(); };
    },
    check: (p, v) => v === p.ok,
    correcta: (p) => p.ops[p.ok],
    marcar: (el, p, v) => { $$('.opcion', el).forEach(b => { const i = +b.dataset.i; if (i === p.ok) b.classList.add('bien'); else if (i === v) b.classList.add('malo'); }); }
  };
  Tipos.vf = {
    render: (p) => `<div class="lec-tipo">⚖️ ¿Verdadero o falso?</div><div class="lec-q">${p.q}</div>${extra(p)}<div class="opciones vf"><button class="opcion" data-v="1"><span class="k">1</span>✅ Verdadero</button><button class="opcion" data-v="0"><span class="k">2</span>❌ Falso</button></div>`,
    mount: (el, p, ctx) => {
      const bs = $$('.opcion', el);
      bs.forEach(b => b.onclick = () => { bs.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); HA.sonido.tecla(); ctx.listo(b.dataset.v === '1'); });
      ctx.teclas = (k) => { const b = bs[+k - 1]; if (b) b.click(); };
    },
    check: (p, v) => v === p.ok,
    correcta: (p) => p.ok ? 'Verdadero' : 'Falso',
    marcar: (el, p, v) => { $$('.opcion', el).forEach(b => { const bv = b.dataset.v === '1'; if (bv === p.ok) b.classList.add('bien'); else if (bv === v) b.classList.add('malo'); }); }
  };
  Tipos.escribir = {
    render: (p) => `<div class="lec-tipo">⌨️ Escribe la respuesta</div><div class="lec-q">${p.q}</div>${extra(p)}<input class="input-grande" id="esc" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(p.ph || 'Tu respuesta…')}">`,
    mount: (el, p, ctx) => { const i = $('#esc', el); i.oninput = () => ctx.listo(i.value.trim() ? i.value : null); i.onkeydown = e => { if (e.key === 'Enter' && i.value.trim()) { e.preventDefault(); ctx.comprobar(); } }; setTimeout(() => i.focus(), 60); },
    check: (p, v) => p.ok.some(o => HA.normaliza(o) === HA.normaliza(v)),
    correcta: (p) => p.ok[0],
    marcar: (el) => { $('#esc', el).disabled = true; }
  };
  Tipos.orden = {
    render: (p) => { const o = HA.shuffle(p.items.map((_, i) => i)); return `<div class="lec-tipo">🔢 Ordena</div><div class="lec-q">${p.q}</div>${extra(p)}<div class="orden-res" id="ores"><span class="small muted" id="ohint">Toca las tarjetas en el orden correcto 👇</span></div><div class="orden-pool" id="opool">${o.map(i => `<button class="ficha" data-i="${i}">${p.items[i]}</button>`).join('')}</div>`; },
    mount: (el, p, ctx) => {
      const sel = [];
      const pinta = () => {
        $('#ores', el).innerHTML = sel.length ? sel.map((i, k) => `<button class="ficha" data-q="${k}"><span class="n">${k + 1}</span>${p.items[i]}</button>`).join('') : `<span class="small muted">Toca las tarjetas en el orden correcto 👇</span>`;
        $$('#opool .ficha', el).forEach(b => b.classList.toggle('usada', sel.includes(+b.dataset.i)));
        $$('#ores [data-q]', el).forEach(b => b.onclick = () => { sel.splice(+b.dataset.q, 1); pinta(); ctx.listo(null); });
        ctx.listo(sel.length === p.items.length ? sel.slice() : null);
      };
      $$('#opool .ficha', el).forEach(b => b.onclick = () => { const i = +b.dataset.i; if (!sel.includes(i)) { sel.push(i); HA.sonido.tecla(); pinta(); } });
    },
    check: (p, v) => v.every((x, k) => x === k),
    correcta: (p) => p.items.map((t, k) => `${k + 1}. ${t}`).join('<br>'),
    marcar: (el) => el.classList.add('bloqueado-ui')
  };
  Tipos.mensaje = {
    render: (p) => {
      const cuerpo = String(p.cuerpo).replace(/\{\{(.+?)\}\}/g, (m, u) => `<span class="enlace-falso">${u}</span>`);
      let box;
      if (p.canal === 'correo') box = `<div class="correo"><div class="ch"><div><b>De:</b> ${p.de}</div><div><b>Asunto:</b> ${p.asunto || ''}</div></div><div class="cb">${cuerpo}</div></div>`;
      else box = `<div class="telefono"><div class="tel-head"><div class="tel-av">${p.canal === 'whatsapp' ? '💬' : '✉'}</div><div><b>${p.de}</b><div class="small muted">${p.canal === 'whatsapp' ? 'WhatsApp' : 'SMS'} · ahora</div></div></div><div class="burbuja">${cuerpo}</div></div>`;
      return `<div class="lec-tipo">🎣 ¿Real o phishing?</div><div class="lec-q">${p.q || '¿Este mensaje es legítimo o es una trampa?'}</div>${box}<div class="opciones vf"><button class="opcion" data-v="falso"><span class="k">1</span>🎣 Es phishing</button><button class="opcion" data-v="real"><span class="k">2</span>✅ Es legítimo</button></div>`;
    },
    mount: (el, p, ctx) => { const bs = $$('.opcion', el); bs.forEach(b => b.onclick = () => { bs.forEach(x => x.classList.remove('sel')); b.classList.add('sel'); ctx.listo(b.dataset.v); }); ctx.teclas = (k) => { const b = bs[+k - 1]; if (b) b.click(); }; },
    check: (p, v) => v === p.ok,
    correcta: (p) => p.ok === 'falso' ? 'Es phishing' : 'Es legítimo',
    extraFb: (p) => p.senales ? `<ul class="senales">${p.senales.map(s => `<li>${s}</li>`).join('')}</ul>` : '',
    marcar: (el, p, v) => { $$('.opcion', el).forEach(b => { if (b.dataset.v === p.ok) b.classList.add('bien'); else if (b.dataset.v === v) b.classList.add('malo'); }); }
  };
  Tipos.parejas = {
    auto: true,
    render: (p) => {
      const a = HA.shuffle(p.pares.map((_, i) => i)), b = HA.shuffle(p.pares.map((_, i) => i));
      return `<div class="lec-tipo">🔗 Une las parejas</div><div class="lec-q">${p.q || 'Toca un elemento de cada columna para unirlos'}</div><div class="parejas"><div class="col">${a.map(i => `<button class="par" data-l="${i}">${p.pares[i][0]}</button>`).join('')}</div><div class="col">${b.map(i => `<button class="par" data-r="${i}">${p.pares[i][1]}</button>`).join('')}</div></div>`;
    },
    mount: (el, p, ctx) => {
      let sl = null, sr = null, hechos = 0;
      const probar = () => {
        if (sl === null || sr === null) return;
        const bl = $(`[data-l="${sl}"]`, el), br = $(`[data-r="${sr}"]`, el);
        if (sl === sr) { bl.classList.remove('sel'); br.classList.remove('sel'); bl.classList.add('hecho'); br.classList.add('hecho'); hechos++; HA.sonido.tecla(); if (hechos === p.pares.length) ctx.resuelto(); }
        else { [bl, br].forEach(x => { x.classList.remove('sel'); x.classList.add('error'); setTimeout(() => x.classList.remove('error'), 400); }); HA.sonido.mal(); ctx.fallo(); }
        sl = sr = null;
      };
      $$('[data-l]', el).forEach(b => b.onclick = () => { $$('[data-l]', el).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sl = +b.dataset.l; probar(); });
      $$('[data-r]', el).forEach(b => b.onclick = () => { $$('[data-r]', el).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sr = +b.dataset.r; probar(); });
    }
  };
  Tipos.terminal = {
    auto: true,
    render: (p) => `<div class="lec-tipo">💻 Terminal · Misión</div><div class="mision">${p.q}</div>
      <div class="terminal" id="term"><div class="term-bar"><i style="background:#FF6B4A"></i><i style="background:#F5B82E"></i><i style="background:#B794FF"></i><span style="margin-left:8px">${esc((p.host || 'hackandes'))} — terminal de práctica</span></div><div class="term-out" id="tout" aria-live="polite"></div>
      <div class="term-in"><span class="prompt" id="tprompt"></span><input id="tin" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Escribe un comando"></div></div>
      ${p.check && p.check.flag ? `<div class="flag-row"><input class="input-grande" id="tflag" placeholder="🚩 Pega aquí la bandera: HA{...}" autocomplete="off" spellcheck="false"><button class="btn" id="tflagok">Enviar</button></div>` : ''}
      <div class="pista-box">${p.pista ? '<button class="btn blanco mini" id="tpista">💡 Pista</button>' : ''}<button class="btn blanco mini" id="tsol">👀 Ver solución</button><button class="btn blanco mini" id="thelp">❓ Comandos</button></div><div id="tpinfo"></div>`,
    mount: (el, p, ctx) => HA.montarTerminal(el, p, ctx)
  };
  HA.montarTerminal = function (el, p, ctx) {
    const t = new window.Terminal(p.esc || p);
    const out = $('#tout', el), inp = $('#tin', el), pr = $('#tprompt', el);
    let hi = 0, resuelto = false;
    out.innerHTML = `<span class="dim">${esc(p.bienvenida || 'Escribe un comando y presiona Enter. Escribe "help" para ver la lista.')}</span>\n`;
    pr.textContent = t.prompt();
    const revisar = () => {
      if (resuelto || !p.check) return;
      const c = p.check;
      let ok = true;
      if (c.flag) ok = false;
      if (c.cmd && !(t.last.ok && new RegExp(c.cmd, 'i').test(t.last.line))) ok = false;
      if (c.cwd && t.cwd !== c.cwd) ok = false;
      if (c.out && !new RegExp(c.out, 'i').test(t.last.out)) ok = false;
      if (c.root && !t.root) ok = false;
      if (c.existe && !t.fs[c.existe]) ok = false;
      if (c.noexiste && t.fs[c.noexiste]) ok = false;
      if (c.modo && !(t.fs[c.modo[0]] && new RegExp(c.modo[1]).test(t.fs[c.modo[0]].m || ''))) ok = false;
      if (c.contiene && !(t.fs[c.contiene[0]] && new RegExp(c.contiene[1], 'i').test(t.fs[c.contiene[0]].c || ''))) ok = false;
      if (ok) { resuelto = true; ctx.resuelto(); }
    };
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const line = inp.value; inp.value = '';
        const res = t.run(line);
        out.innerHTML += `<span class="cmd"><span style="color:#B794FF">${esc(pr.textContent)}</span> ${esc(line)}</span>\n`;
        if (res.includes('__CLEAR__')) out.innerHTML = ''; else out.innerHTML += res;
        pr.textContent = t.prompt(); out.scrollTop = out.scrollHeight; hi = t.hist.length;
        if (line.trim() && ctx.perfil) { ctx.perfil.stats.cmds = (ctx.perfil.stats.cmds || 0) + 1; }
        if (ctx.alComando) ctx.alComando(t);
        revisar();
      } else if (e.key === 'ArrowUp') { if (hi > 0) { hi--; inp.value = t.hist[hi] || ''; } e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (hi < t.hist.length) { hi++; inp.value = t.hist[hi] || ''; } e.preventDefault(); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = inp.value.split(' '), last = parts.pop();
        const dir = last.includes('/') ? last.slice(0, last.lastIndexOf('/') + 1) : '';
        const base = t.abs(dir || '.');
        const m = t.kids(base).filter(k => k.startsWith(last.slice(dir.length)));
        if (m.length === 1) { parts.push(dir + m[0] + (t.fs[(base === '/' ? '' : base) + '/' + m[0]].t === 'd' ? '/' : '')); inp.value = parts.join(' '); }
      }
    });
    $('#term', el).addEventListener('click', () => { if (!window.getSelection().toString()) inp.focus(); });
    const fb = $('#tflagok', el);
    if (fb) {
      const enviar = () => {
        const v = $('#tflag', el).value.trim();
        if (v === p.check.flag) { resuelto = true; ctx.resuelto(); }
        else { HA.sonido.mal(); HA.toast('🚩 Esa no es la bandera correcta'); if (ctx.fallo) ctx.fallo(); }
      };
      fb.onclick = enviar; $('#tflag', el).onkeydown = e => { if (e.key === 'Enter') enviar(); };
    }
    const info = $('#tpinfo', el);
    const ps = $('#tpista', el); if (ps) ps.onclick = () => { info.innerHTML = `<div class="dato">💡 ${p.pista}</div>`; };
    $('#tsol', el).onclick = () => { if (ctx.verSolucion) ctx.verSolucion(); info.innerHTML = `<div class="dato"><b>👀 Solución:</b><br>${(p.sol || []).map(s => `<code>${esc(s)}</code>`).join('<br>')}${p.check && p.check.flag ? `<br>Bandera: <code>${esc(p.check.flag)}</code>` : ''}</div>`; };
    $('#thelp', el).onclick = () => { inp.value = 'help'; inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); };
    setTimeout(() => inp.focus({ preventScroll: true }), 80);
    return t;
  };
  Tipos.lab = {
    auto: true,
    render: (p) => `<div class="lec-tipo">🧪 Laboratorio</div><div class="lec-q">${p.q}</div>${extra(p)}<div id="labw"></div>${p.ok ? `<div class="flag-row"><input class="input-grande" id="lans" placeholder="${esc(p.ph || 'Tu respuesta…')}" autocomplete="off" spellcheck="false"><button class="btn" id="lansok">Enviar</button></div>` : ''}<div class="pista-box"><button class="btn blanco mini" id="lsol">👀 Ver solución</button></div><div id="lpinfo"></div>`,
    mount: (el, p, ctx) => {
      let resuelto = false;
      const ok = () => { if (!resuelto) { resuelto = true; ctx.resuelto(); } };
      Labs[p.lab]($('#labw', el), p, p.ok ? null : ok);
      if (p.ok) {
        const enviar = () => { const v = $('#lans', el).value; if (p.ok.some(o => HA.normaliza(o) === HA.normaliza(v))) ok(); else { HA.sonido.mal(); HA.toast('🤔 Esa no es. Sigue intentando'); ctx.fallo(); } };
        $('#lansok', el).onclick = enviar; $('#lans', el).onkeydown = e => { if (e.key === 'Enter') enviar(); };
      }
      $('#lsol', el).onclick = () => { if (ctx.verSolucion) ctx.verSolucion(); $('#lpinfo', el).innerHTML = `<div class="dato"><b>👀 Solución:</b> ${p.solTxt || esc(p.sol || (p.ok && p.ok[0]) || '')}</div>`; };
      if (ctx.perfil) { ctx.perfil.stats.labs = ctx.perfil.stats.labs || {}; ctx.perfil.stats.labs[p.lab] = 1; }
    }
  };

  // =====================================================
  //  MOTOR DE LA LECCIÓN
  // =====================================================
  const L = HA.Leccion = {};
  let S = null;
  L.estado = () => S;
  L.pasoDeRef = (ref) => { const [lid, i] = String(ref).split('#'); const l = HA.IDX.porId[lid]; return l ? l.steps[+i] : null; };

  function iniciar(cfg) {
    const p = HA.perfil();
    S = Object.assign({ cola: [], i: 0, hechos: 0, errores: 0, fallos: 0, escudos: 5, maxEsc: 5, inicio: Date.now(), solucion: false, fallados: new Set(), etapaAntes: HA.etapa(p) }, cfg);
    S.total = S.cola.length;
    pintar();
  }
  L.abrir = (id) => {
    const l = HA.IDX.porId[id]; if (!l) return HA.ir('aprender');
    iniciar({ tipo: 'leccion', leccion: l, titulo: l.titulo, cola: l.steps.map((paso, i) => ({ paso, ref: `${l.id}#${i}` })) });
  };
  L.repaso = (modo) => {
    const p = HA.perfil();
    let refs;
    if (modo === 'errores') refs = (p.errores || []).filter(r => L.pasoDeRef(r)).slice(-10);
    else {
      const pool = [];
      Object.keys(p.hechas).forEach(lid => { const l = HA.IDX.porId[lid]; if (l) l.steps.forEach((s, i) => { if (TIPOS_CALIFICADOS.includes(s.t)) pool.push(`${lid}#${i}`); }); });
      refs = HA.shuffle(pool).slice(0, 10);
    }
    if (!refs.length) return HA.toast('No hay preguntas para repasar todavía');
    iniciar({ tipo: 'repaso', modo, titulo: modo === 'errores' ? 'Repaso de errores' : 'Práctica mezclada', cola: refs.map(ref => ({ paso: L.pasoDeRef(ref), ref })) });
  };
  L.prueba = (lvId) => {
    const lv = HA.levels.find(l => l.id === lvId); if (!lv || lv.idx === 0) return;
    const pool = [];
    HA.levels.slice(0, lv.idx).forEach(prev => prev.units.forEach(u => u.lessons.forEach(l => l.steps.forEach((s, i) => { if (TIPOS_CALIFICADOS.includes(s.t)) pool.push(`${l.id}#${i}`); }))));
    const refs = HA.shuffle(pool).slice(0, 15);
    HA.modal(`<div class="center"><div style="font-size:3em">🦘</div><h2>Prueba para saltar al Nivel ${lv.n}</h2><p class="muted">${refs.length} preguntas de los niveles anteriores. Tienes solo <b>3 escudos</b>: si fallas 3, no pasas. ¡Puedes intentarlo las veces que quieras!</p><button class="btn dorado full" id="goPrueba">Empezar prueba</button></div>`);
    $('#goPrueba').onclick = () => { HA.cerrarModal(); iniciar({ tipo: 'prueba', nivel: lv, titulo: `Prueba de salto · Nivel ${lv.n}`, cola: refs.map(ref => ({ paso: L.pasoDeRef(ref), ref })), escudos: 3, maxEsc: 3 }); };
  };

  function salir() {
    if (S && S.hechos > 0 && S.hechos < S.total) {
      HA.confirmar('¿Salir de la lección?', 'Perderás el avance de esta lección.', 'Salir', 'Seguir aprendiendo').then(si => { if (si) { S = null; HA.ir('aprender'); } });
    } else { S = null; HA.ir('aprender'); }
  }

  function pintar() {
    const p = HA.perfil();
    if (S.i >= S.cola.length) return finalizar();
    const item = S.cola[S.i], paso = item.paso, T = Tipos[paso.t];
    if (!T) { console.warn('Tipo desconocido', paso.t); S.i++; S.hechos++; return pintar(); }
    const ctx = { perfil: p, etapa: HA.etapa(p), valor: null };
    S.ctx = ctx; S.estadoPie = 'normal';
    app().innerHTML = `<div class="leccion">
      <div class="lec-top"><button class="cerrar" id="lsalir" aria-label="Salir de la lección">✕</button><div class="barra"><i style="width:${S.hechos / S.total * 100}%"></i></div>
      <div class="escudos" title="Firewall: escudos restantes">🛡️ ${S.escudos}</div></div>
      <div class="lec-body" id="lbody">${item.reintento ? '<div class="chip tom" style="margin-bottom:10px">🔁 Error anterior: ¡inténtalo otra vez!</div>' : ''}${T.render(paso, ctx)}</div>
      <div class="lec-foot" id="lfoot"></div></div>`;
    $('#lsalir').onclick = salir;
    const body = $('#lbody');
    ctx.listo = (v) => { ctx.valor = v; const b = $('#lcheck'); if (b) b.disabled = v === null || v === undefined; };
    ctx.comprobar = () => comprobar();
    ctx.resuelto = () => exito(true);
    ctx.fallo = () => { S.fallos++; };
    ctx.verSolucion = () => { S.solucion = true; };
    if (T.mount) T.mount(body, paso, ctx);
    pie();
    window.scrollTo(0, 0);
  }

  function pie() {
    const paso = S.cola[S.i].paso, T = Tipos[paso.t], f = $('#lfoot');
    f.className = 'lec-foot';
    if (paso.t === 'teoria') f.innerHTML = `<span class="small muted">Paso ${S.i + 1}</span><button class="btn" id="lnext">Continuar</button>`;
    else if (T.auto) f.innerHTML = `<button class="btn-txt" id="lskip">${S.tipo === 'prueba' ? '' : 'Saltar'}</button><span class="small muted">Completa el reto para seguir</span>`;
    else f.innerHTML = `<button class="btn-txt" id="lskip">${S.tipo === 'prueba' ? '' : 'No sé'}</button><button class="btn" id="lcheck" disabled>Comprobar</button>`;
    const n = $('#lnext'); if (n) n.onclick = () => { S.hechos++; S.i++; pintar(); };
    const c = $('#lcheck'); if (c) c.onclick = comprobar;
    const s = $('#lskip');
    if (s) { if (S.tipo === 'prueba') s.remove(); else s.onclick = () => (T.auto ? saltarAuto() : fallar(null)); }
  }
  function saltarAuto() { // en retos interactivos "saltar" cuenta como error pero muestra la solución
    S.solucion = true;
    fallar(null);
  }

  function comprobar() {
    const item = S.cola[S.i], paso = item.paso, T = Tipos[paso.t], v = S.ctx.valor;
    if (S.estadoPie !== 'normal' || v === null || v === undefined) return;
    const p = HA.perfil();
    p.stats.resp++;
    if (T.check(paso, v)) { p.stats.bien++; if (T.marcar) T.marcar($('#lbody'), paso, v); exito(false); }
    else { if (T.marcar) T.marcar($('#lbody'), paso, v); fallar(v); }
  }

  function exito(auto) {
    const item = S.cola[S.i], paso = item.paso, T = Tipos[paso.t];
    S.estadoPie = 'ok';
    if (auto) { const p = HA.perfil(); p.stats.resp++; p.stats.bien++; }
    HA.sonido.bien();
    const f = $('#lfoot'); f.className = 'lec-foot ok';
    f.innerHTML = `<div class="fb"><div class="fbm">${M().svg(HA.perfil().animal, HA.etapa(HA.perfil()), 'feliz', { anim: false })}</div><div class="fbtxt"><h3>${pick(FRASES_BIEN)}</h3>${paso.exp ? `<p>${paso.exp}</p>` : ''}${T.extraFb ? T.extraFb(paso) : ''}</div></div><button class="btn" id="lnext">Continuar</button>`;
    $('#lbody').classList.add('bloqueado-ui');
    $('#lnext').onclick = () => { S.hechos++; S.i++; pintar(); };
    $('#lnext').focus({ preventScroll: true });
  }

  function fallar(v) {
    const item = S.cola[S.i], paso = item.paso, T = Tipos[paso.t], p = HA.perfil();
    S.estadoPie = 'mal';
    if (v === null && !T.auto) { p.stats.resp++; if (T.marcar) T.marcar($('#lbody'), paso, -1); }
    S.errores++; S.escudos--; S.fallados.add(item.ref);
    if (!p.errores.includes(item.ref)) p.errores.push(item.ref);
    if (p.errores.length > 60) p.errores = p.errores.slice(-60);
    if (S.tipo !== 'prueba') S.cola.push({ paso, ref: item.ref, reintento: true });
    HA.sonido.mal();
    $('.escudos').innerHTML = `🛡️ ${S.escudos}`;
    const f = $('#lfoot'); f.className = 'lec-foot mal';
    let sol = '';
    if (T.correcta) sol = `<p><b>Respuesta correcta:</b> ${T.correcta(paso)}</p>`;
    else if (paso.sol) sol = `<p><b>Solución:</b> ${(Array.isArray(paso.sol) ? paso.sol : [paso.sol]).map(s => `<code>${esc(s)}</code>`).join(' → ')}${paso.check && paso.check.flag ? ` · bandera <code>${esc(paso.check.flag)}</code>` : ''}</p>`;
    else if (paso.ok) sol = `<p><b>Respuesta:</b> ${esc(paso.ok[0])}</p>`;
    f.innerHTML = `<div class="fb"><div class="fbm">${M().svg(p.animal, HA.etapa(p), 'triste', { anim: false })}</div><div class="fbtxt"><h3>${pick(FRASES_MAL)}</h3>${sol}${paso.exp ? `<p>${paso.exp}</p>` : ''}${T.extraFb ? T.extraFb(paso) : ''}${S.tipo !== 'prueba' ? '<p class="small muted">Volverá a salir al final de la lección.</p>' : ''}</div></div><button class="btn tomate" id="lnext">Continuar</button>`;
    $('#lbody').classList.add('bloqueado-ui');
    $('#lnext').onclick = () => {
      if (S.escudos <= 0) return derrota();
      S.i++; pintar();
    };
    $('#lnext').focus({ preventScroll: true });
  }

  function derrota() {
    const p = HA.perfil();
    p.stats.seg += Math.round((Date.now() - S.inicio) / 1000); HA.guardar();
    const cfg = S;
    app().innerHTML = `<div class="resultado"><div class="rm">${M().svg(p.animal, HA.etapa(p), 'triste')}</div>
      <h1>🔥 ¡Tu firewall cayó!</h1><p class="muted">Te quedaste sin escudos. No te preocupes: hasta los mejores hackers fallan muchas veces antes de lograrlo.</p>
      <div class="ciber-tip" style="text-align:left"><b>Consejo:</b> abre la <b>📖 Guía</b> de la unidad para repasar la teoría y vuelve a intentarlo.</div>
      <div class="row" style="justify-content:center;margin-top:18px;flex-wrap:wrap"><button class="btn blanco" id="dsalir">Salir</button><button class="btn" id="dotra">Intentar de nuevo</button></div></div>`;
    $('#dsalir').onclick = () => { S = null; HA.ir('aprender'); };
    $('#dotra').onclick = () => {
      if (cfg.tipo === 'leccion') L.abrir(cfg.leccion.id);
      else if (cfg.tipo === 'prueba') { S = null; HA.ir('aprender'); setTimeout(() => L.prueba(cfg.nivel.id), 50); }
      else L.repaso(cfg.modo);
    };
  }

  function finalizar() {
    const p = HA.perfil();
    const seg = Math.round((Date.now() - S.inicio) / 1000);
    p.stats.seg += seg;
    let xp = 0, titulo = '¡Lección completada!', extraMsg = '';
    const perfecta = S.errores === 0 && S.fallos === 0 && !S.solucion;
    const nivelesAntes = HA.levels.filter(lv => HA.nivelHecho(p, lv)).map(lv => lv.id);
    if (S.tipo === 'leccion') {
      const primera = !HA.hecha(p, S.leccion.id);
      xp = primera ? 10 + (perfecta ? 5 : 0) : 5;
      const prev = p.hechas[S.leccion.id];
      p.hechas[S.leccion.id] = { f: Date.now(), err: prev ? Math.min(prev.err, S.errores) : S.errores };
      if (perfecta) p.stats.perfectas++;
      // si respondió bien un paso que estaba en errores, se quita
      p.errores = p.errores.filter(r => !(r.startsWith(S.leccion.id + '#') && !S.fallados.has(r)));
      if (!primera) titulo = '¡Lección repasada!';
    } else if (S.tipo === 'repaso') {
      xp = 10 + (perfecta ? 5 : 0);
      const resueltos = new Set(S.cola.map(c => c.ref));
      p.errores = p.errores.filter(r => !resueltos.has(r));
      p.stats.repasos = (p.stats.repasos || 0) + 1;
      titulo = S.modo === 'errores' ? '¡Errores corregidos! 🩹' : '¡Práctica completada!';
    } else if (S.tipo === 'prueba') {
      xp = 20; p.desbloqueos[S.nivel.id] = true; titulo = `¡Nivel ${S.nivel.n} desbloqueado! 🦘`;
      extraMsg = `<p>Demostraste que ya dominas los niveles anteriores. ¡Bienvenido al ${esc(S.nivel.nombre)}!</p>`;
    }
    p.xp += xp;
    const hoy = HA.dkey();
    p.xpLog[hoy] = (p.xpLog[hoy] || 0) + xp;
    const rachaSube = HA.racha(p);
    const h = new Date().getHours(); if (h >= 23 || h < 4) p.stats.buho = 1;
    const etapaNueva = HA.etapa(p), evoluciono = etapaNueva > (p.etapaVista || 1);
    if (evoluciono) p.etapaVista = etapaNueva;
    const nivelNuevo = HA.levels.find(lv => HA.nivelHecho(p, lv) && !nivelesAntes.includes(lv.id));
    HA.guardar();
    const precision = S.total ? Math.round(Math.max(0, (S.total - S.errores)) / S.total * 100) : 100;
    const mm = Math.floor(seg / 60), ss = String(seg % 60).padStart(2, '0');
    HA.sonido.fin(); HA.confeti();
    app().innerHTML = `<div class="resultado"><div class="rm">${M().svg(p.animal, S.etapaAntes, 'feliz')}</div>
      <h1 style="color:var(--dorado-osc)">${titulo}</h1>${perfecta ? '<p class="chip oro">💎 ¡Perfecta! Sin perder escudos</p>' : ''}${extraMsg}
      <div class="res-stats"><div class="res-stat" style="--c:var(--dorado)"><div class="t">XP ganada</div><div class="v">⭐ ${xp}</div></div>
        <div class="res-stat" style="--c:var(--morado)"><div class="t">Precisión</div><div class="v">🎯 ${precision}%</div></div>
        <div class="res-stat" style="--c:var(--tomate)"><div class="t">Tiempo</div><div class="v">⏱️ ${mm}:${ss}</div></div></div>
      ${rachaSube ? `<p class="fredoka" style="font-size:1.2em;color:var(--tomate)">⚡ ¡Uptime: ${p.racha.n} día${p.racha.n === 1 ? '' : 's'} seguido${p.racha.n === 1 ? '' : 's'}!</p>` : ''}
      ${nivelNuevo ? `<div class="card" style="border-color:var(--dorado);margin-bottom:14px"><h3>📜 ¡Completaste el Nivel ${nivelNuevo.n}!</h3><p class="small muted">Ya puedes descargar tu certificado.</p><button class="btn dorado mini" id="rcert">Ver certificado</button></div>` : ''}
      <button class="btn full" id="rsig">Continuar</button></div>`;
    $('#rsig').onclick = () => { S = null; HA.ir('aprender'); };
    const rc = $('#rcert'); if (rc) rc.onclick = () => HA.certificado(nivelNuevo.id);
    const t = S.tipo; S.fin = true;
    if (evoluciono) evolucion(p, etapaNueva);
    else HA.revisarLogros();
    if (t === 'leccion' && $('#rsig')) $('#rsig').focus({ preventScroll: true });
  }

  function evolucion(p, s) {
    const legend = s === 5;
    HA.sonido.evo(); HA.confeti(220);
    const m = HA.modal(`<div class="center"><div class="small" style="letter-spacing:.2em;font-weight:900;color:#FFD43B">${legend ? '✨ FUSIÓN LEGENDARIA ✨' : '¡EVOLUCIÓN!'}</div>
      <h2>¡${esc(p.nombreMascota)} evolucionó!</h2><div class="em-box">${M().svg(p.animal, s, 'feliz')}</div>
      <h3 style="color:#fff">${M().nombreEtapa(p.animal, s)}</h3><p style="opacity:.9">${legend ? 'Se fusionó con su armadura digital. Ahora es un guardián legendario de los Andes. ¡Terminaste el curso completo!' : M().ETAPAS[s].desc + '. ¡Sigue así para la siguiente forma!'}</p>
      <button class="btn dorado full" id="evok">¡Increíble!</button></div>`, { cls: 'evo', fijo: true });
    $('#evok').onclick = () => { HA.cerrarModal(); HA.revisarLogros(); };
    const rm = $('.resultado .rm'); if (rm) rm.innerHTML = M().svg(p.animal, s, 'feliz');
  }

  // Teclado: Enter = comprobar/continuar, 1-4 = opciones
  document.addEventListener('keydown', e => {
    if (!S || S.fin || !$('.leccion') || $('#modal')) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (e.key === 'Enter' && tag !== 'input' && tag !== 'textarea' && tag !== 'button') {
      const n = $('#lnext'), c = $('#lcheck');
      if (n) { e.preventDefault(); n.click(); } else if (c && !c.disabled) { e.preventDefault(); c.click(); }
    } else if (/^[1-9]$/.test(e.key) && tag !== 'input' && tag !== 'textarea' && S.ctx && S.ctx.teclas && S.estadoPie === 'normal') S.ctx.teclas(e.key);
  });

  // =====================================================
  //  VISTA: LABORATORIO LIBRE
  // =====================================================
  const HERRAMIENTAS = [
    ['terminal', '💻', 'Terminal libre', 'Practica comandos de Linux y busca 3 banderas escondidas.'],
    ['password', '🔐', 'Medidor de contraseñas', '¿Cuánto tardarían en descifrar tu clave?'],
    ['generador', '🎲', 'Generador de contraseñas', 'Claves aleatorias seguras o frases fáciles de recordar.'],
    ['phishing', '🎣', 'Detector de phishing', 'Entrena tu ojo con mensajes reales y falsos.'],
    ['cesar', '🏛️', 'Cifrado César', 'El cifrado que usaba Julio César, hace 2000 años.'],
    ['base64', '🔤', 'Base64', 'Codifica y decodifica texto.'],
    ['binario', '0️⃣', 'Binario y hexadecimal', 'Cómo ve los números una computadora.'],
    ['hash', '#️⃣', 'Hash SHA-256', 'La huella digital de cualquier texto.'],
    ['sqli', '💉', 'Login vulnerable (SQLi)', 'Rompe un login de práctica con inyección SQL.'],
    ['xss', '📜', 'Comentarios (XSS)', 'Descubre cómo se inyecta código en una web.'],
    ['real', '🖥️', 'Tu laboratorio real', 'Guía paso a paso: VirtualBox, Kali y TryHackMe.'],
    ['recursos', '🌐', 'Recursos gratis', 'Las mejores plataformas gratuitas para practicar.']
  ];
  const TERM_LIBRE = {
    bienvenida: 'Terminal libre de HackAndes. Escribe "cat LEEME.txt" para empezar.',
    fs: {
      'LEEME.txt': '¡Bienvenido a la terminal libre!\n\nAquí puedes practicar sin miedo: nada de lo que hagas daña tu computadora.\nHay 3 banderas escondidas con el formato HA{...}. ¿Las encuentras?\n\nPistas:\n  1) Algunos archivos están ocultos (empiezan con punto). Prueba: ls -la\n  2) Hay una carpeta llena de fotos... ¿o no? Usa find.\n  3) Un mensaje está codificado en Base64.\n',
      '.bandera_oculta': 'HA{l0s_punt0s_esc0nden_c0sas}\n',
      'fotos': { 'volcan.jpg': 'JFIF... (imagen)', 'cuy.jpg': 'JFIF...', 'viaje': { 'banos': { 'nota_secreta.txt': '¡Bien! Usar find te ahorra tiempo: HA{find_es_tu_amig0}\n' } } },
      'mensaje.txt': 'SEF7YmFzZTY0X25vX2VzX2NpZnJhZG99Cg==\n',
      'tareas': { 'redes.txt': 'Investigar el modelo OSI\n', 'mate.txt': 'Ejercicios de inecuaciones\n' }
    },
    net: { nmap: { '192.168.1.1': [[53, 'open', 'domain', 'dnsmasq 2.90'], [80, 'open', 'http', 'lighttpd 1.4'], [443, 'open', 'https', 'lighttpd 1.4']] } }
  };
  const BANDERAS = ['HA{l0s_punt0s_esc0nden_c0sas}', 'HA{find_es_tu_amig0}', 'HA{base64_no_es_cifrado}'];

  HA.vistaLaboratorio = function (main, tool) {
    const p = HA.perfil();
    if (!tool) {
      main.innerHTML = `<div class="titulo-sec"><h1>Laboratorio</h1></div><p class="muted">Herramientas para practicar cuando quieras. Todo funciona sin internet y sin instalar nada.</p>
        <div class="grid2">${HERRAMIENTAS.map(([k, i, t, d]) => `<button class="tool-btn" data-tool="${k}"><span class="ti">${i}</span><span><b>${t}</b><span>${d}</span></span></button>`).join('')}</div>`;
      $$('[data-tool]', main).forEach(b => b.onclick = () => HA.vistaLaboratorio(main, b.dataset.tool));
      return;
    }
    const meta = HERRAMIENTAS.find(h => h[0] === tool);
    p.stats.labs = p.stats.labs || {}; if (tool !== 'recursos' && tool !== 'real') { p.stats.labs[tool] = 1; HA.guardar(); }
    main.innerHTML = `<button class="btn-txt" id="labback">‹ Laboratorio</button><h1>${meta[1]} ${meta[2]}</h1><p class="muted">${meta[3]}</p><div id="toolw"></div>`;
    $('#labback').onclick = () => HA.vistaLaboratorio(main);
    const w = $('#toolw');
    if (tool === 'terminal') {
      p.banderas = p.banderas || {};
      w.innerHTML = Tipos.terminal.render({ q: '<b>Reto libre:</b> encuentra las 3 banderas <code>HA{...}</code>. <span id="bcont"></span>' }).replace('<div class="lec-tipo">💻 Terminal · Misión</div>', '');
      const pinta = () => { $('#bcont').innerHTML = `Encontradas: <b>${BANDERAS.filter(b => p.banderas[b]).length}/3</b> 🚩`; };
      pinta();
      HA.montarTerminal(w, TERM_LIBRE, {
        perfil: p, resuelto() {}, fallo() {},
        alComando(t) { BANDERAS.forEach(b => { if (t.last.out.includes(b) && !p.banderas[b]) { p.banderas[b] = 1; HA.toast(`🚩 ¡Bandera encontrada! <code>${b}</code>`, 'logro'); HA.sonido.logro(); } }); pinta(); HA.guardar(); HA.revisarLogros(); }
      });
      $('#tsol').onclick = () => { $('#tpinfo').innerHTML = `<div class="dato">1) <code>ls -la</code> y <code>cat .bandera_oculta</code><br>2) <code>find . -name "*.txt"</code> y luego <code>cat</code> al archivo raro<br>3) <code>cat mensaje.txt | base64 -d</code></div>`; };
    } else if (tool === 'phishing') {
      const pool = [];
      HA.levels.forEach(lv => { if (HA.nivelAbierto(p, lv)) lv.units.forEach(u => u.lessons.forEach(l => l.steps.forEach(s => { if (s.t === 'mensaje') pool.push(s); }))); });
      let aciertos = 0, total = 0;
      const ronda = () => {
        const s = pool[Math.floor(Math.random() * pool.length)];
        if (!s) { w.innerHTML = '<p class="muted">Aún no hay mensajes disponibles.</p>'; return; }
        w.innerHTML = `<div class="row"><span class="chip">Puntaje: ${aciertos}/${total}</span></div><div style="height:10px"></div>${Tipos.mensaje.render(s)}<div id="pfb"></div>`;
        $$('.opcion', w).forEach(b => b.onclick = () => {
          total++; const ok = b.dataset.v === s.ok; if (ok) { aciertos++; HA.sonido.bien(); } else HA.sonido.mal();
          Tipos.mensaje.marcar(w, s, b.dataset.v); $('.opciones', w).classList.add('bloqueado-ui');
          $('#pfb').innerHTML = `<div class="card" style="margin-top:14px;border-color:${ok ? 'var(--morado)' : 'var(--tomate)'}"><h3>${ok ? '✅ ¡Bien visto!' : '❌ Te engañaron esta vez'}</h3>${s.exp ? `<p>${s.exp}</p>` : ''}${Tipos.mensaje.extraFb(s)}<button class="btn full" id="potro" style="margin-top:10px">Otro mensaje</button></div>`;
          $('#potro').onclick = ronda;
        });
      };
      ronda();
    } else if (tool === 'recursos') {
      const R = [
        ['🎯', 'TryHackMe', 'https://tryhackme.com', 'Cientos de salas gratis y la AttackBox (una máquina de ataque en el navegador) 1 hora al día gratis. Ideal si tu PC tiene poca RAM.'],
        ['🕸️', 'PortSwigger Web Security Academy', 'https://portswigger.net/web-security', 'El mejor curso gratis de seguridad web, con laboratorios en el navegador.'],
        ['🚩', 'picoCTF', 'https://picoctf.org', 'Retos tipo CTF gratis, hechos por la Universidad Carnegie Mellon para principiantes.'],
        ['🐧', 'OverTheWire: Bandit', 'https://overthewire.org/wargames/bandit/', 'Aprende Linux jugando. Se conecta por SSH (sirve hasta desde el celular con Termux).'],
        ['🧑‍🍳', 'CyberChef', 'https://gchq.github.io/CyberChef/', 'La "navaja suiza" para codificar, decodificar y analizar datos. Funciona en el navegador.'],
        ['🎓', 'Cisco Networking Academy', 'https://www.netacad.com', 'Cursos gratis de redes y ciberseguridad con certificado de participación.'],
        ['📦', 'VirtualBox', 'https://www.virtualbox.org', 'Programa gratis para crear máquinas virtuales.'],
        ['🐉', 'Kali Linux', 'https://www.kali.org', 'El sistema operativo más usado por hackers éticos. Gratis.'],
        ['🦈', 'Wireshark', 'https://www.wireshark.org', 'Para ver el tráfico de la red paquete por paquete.'],
        ['🗺️', 'Nmap', 'https://nmap.org', 'El escáner de redes más famoso del mundo.']
      ];
      w.innerHTML = `<div class="card">${R.map(([i, n, u, d]) => `<div class="recurso"><span class="ri">${i}</span><div><a href="${u}" target="_blank" rel="noopener noreferrer">${n} ↗</a><div class="small muted">${d}</div></div></div>`).join('')}</div><p class="small muted">Estos enlaces necesitan internet. Todos tienen opción gratuita.</p>`;
    } else if (tool === 'real') {
      HA.guiaLaboratorioReal(w);
    } else {
      Labs[tool](w, {}, null);
    }
  };

  HA.guiaLaboratorioReal = function (w) {
    const p = HA.perfil(); p.checklist = p.checklist || {};
    const A = [
      ['a1', 'Revisa tu PC: necesitas mínimo 8 GB de RAM, 60 GB libres y la virtualización activada (VT-x/AMD-V) en la BIOS.'],
      ['a2', 'Descarga e instala VirtualBox (gratis) desde virtualbox.org.'],
      ['a3', 'Descarga la imagen de Kali Linux para VirtualBox ("Virtual Machines") desde kali.org.'],
      ['a4', 'Importa Kali en VirtualBox y dale 2 GB de RAM y 2 núcleos.'],
      ['a5', 'Crea una red "Solo anfitrión" (Host-only) para que tus máquinas de práctica NO estén expuestas a internet.'],
      ['a6', 'Descarga Metasploitable 2 (máquina vulnerable a propósito) y conéctala a la misma red Host-only.'],
      ['a7', 'Desde Kali, haz ping y un nmap a Metasploitable. ¡Tu laboratorio está listo!'],
      ['a8', 'Toma una "instantánea" (snapshot) de cada máquina: si algo se rompe, vuelves atrás en segundos.']
    ];
    const B = [
      ['b1', 'Crea tu cuenta gratis en tryhackme.com (no pide tarjeta).'],
      ['b2', 'Entra a una sala gratis de principiante (por ejemplo, las introductorias de Linux o redes).'],
      ['b3', 'Presiona "Start AttackBox": es una máquina de ataque que funciona en tu navegador (1 hora al día gratis).'],
      ['b4', 'Si se te acaba la hora, puedes conectarte por VPN gratis o usar la terminal de HackAndes para practicar.'],
      ['b5', 'Complementa con OverTheWire Bandit (Linux) y PortSwigger Academy (web): ambos gratis.']
    ];
    const lista = (arr) => arr.map(([k, t]) => `<label><input type="checkbox" data-ck="${k}" ${p.checklist[k] ? 'checked' : ''}> <span>${t}</span></label>`).join('');
    w.innerHTML = `<div class="aviso"><b>⚖️ Regla de oro:</b> solo atacas máquinas TUYAS o plataformas que te dan permiso. Nunca la red de tu universidad, de tu trabajo o de un vecino.</div>
      <div class="grid2" style="margin-top:14px"><div class="card"><h3>🖥️ Camino A · PC con 8 GB de RAM o más</h3><div class="checklist">${lista(A)}</div></div>
      <div class="card"><h3>🌐 Camino B · PC de 4 GB o solo navegador</h3><div class="checklist">${lista(B)}</div><div class="ciber-tip small"><b>Tip:</b> con 4 GB de RAM no conviene instalar máquinas virtuales: la PC se pondría muy lenta. El Camino B te da práctica real igual.</div></div></div>`;
    $$('[data-ck]', w).forEach(c => c.onchange = () => { p.checklist[c.dataset.ck] = c.checked; HA.guardar(); });
  };
})();
