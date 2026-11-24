// Revisa que TODO el contenido del curso esté bien armado (sin respuestas imposibles).
global.window = global; global.btoa = s => Buffer.from(s, 'binary').toString('base64'); global.atob = s => Buffer.from(s, 'base64').toString('binary');
require('../js/core.js'); require('../data/nivel1.js'); require('../data/nivel2.js'); require('../data/nivel3.js');
require('../js/sha256.js'); require('../js/terminal.js');
const LABS = ['password', 'generador', 'cesar', 'base64', 'binario', 'hash', 'sqli', 'xss'];
let errores = 0, pasos = 0, lecciones = 0;
const err = (w, m) => { errores++; console.log('❌', w, '→', m); };
const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[¿?¡!.,;:"]/g, '').replace(/\s+/g, ' ').trim();
HA.levels.forEach(lv => {
  if (!lv.glosario || !lv.tips) err(lv.id, 'falta glosario o tips');
  lv.units.forEach((u, ui) => {
    if (!u.titulo || !u.lessons.length) err(lv.id + ' u' + (ui + 1), 'unidad vacía');
    u.lessons.forEach((l, li) => {
      lecciones++;
      const w = `${lv.id} U${ui + 1} L${li + 1} "${l.titulo}"`;
      if (l.steps.length < 5) err(w, 'muy pocos pasos');
      if (!l.steps.some(s => s.t !== 'teoria')) err(w, 'no tiene ejercicios');
      l.steps.forEach((s, si) => {
        pasos++;
        const ww = `${w} paso ${si + 1} (${s.t})`;
        switch (s.t) {
          case 'teoria': if (!s.titulo || !s.txt) err(ww, 'falta título o texto'); break;
          case 'opcion': if (!Array.isArray(s.ops) || s.ops.length < 2 || !(s.ok >= 0 && s.ok < s.ops.length)) err(ww, 'opciones/ok inválidos'); if (new Set(s.ops).size !== s.ops.length) err(ww, 'opciones repetidas'); if (!s.exp) err(ww, 'falta explicación'); break;
          case 'vf': if (typeof s.ok !== 'boolean') err(ww, 'ok debe ser true/false'); if (!s.exp) err(ww, 'falta explicación'); break;
          case 'escribir': if (!Array.isArray(s.ok) || !s.ok.length) err(ww, 'falta ok'); if (!s.exp) err(ww, 'falta explicación'); break;
          case 'orden': if (!Array.isArray(s.items) || s.items.length < 3) err(ww, 'orden necesita 3+ items'); if (new Set(s.items).size !== s.items.length) err(ww, 'items repetidos'); break;
          case 'parejas': if (!Array.isArray(s.pares) || s.pares.length < 3 || s.pares.length > 6) err(ww, 'parejas: entre 3 y 6'); if (new Set(s.pares.map(p => p[0])).size !== s.pares.length || new Set(s.pares.map(p => p[1])).size !== s.pares.length) err(ww, 'parejas con textos repetidos'); break;
          case 'mensaje': if (!['real', 'falso'].includes(s.ok)) err(ww, 'ok debe ser real/falso'); if (!s.cuerpo || !s.de) err(ww, 'falta cuerpo/de'); if (!s.exp) err(ww, 'falta explicación'); break;
          case 'lab':
            if (!LABS.includes(s.lab)) err(ww, 'lab desconocido ' + s.lab);
            if (!s.ok && !s.sol) err(ww, 'lab sin ok ni sol');
            if (s.lab === 'cesar' && s.ok && s.texto) { /* se verifica en e2e */ }
            break;
          case 'terminal': {
            if (!s.check || !s.sol || !s.sol.length) { err(ww, 'terminal sin check o sol'); break; }
            // Ejecuta la solución en la terminal simulada y comprueba que pase
            const t = new Terminal(s.esc || s); let pasa = false;
            for (const c of s.sol) {
              t.run(c); const k = s.check; let ok = !k.flag;
              if (k.cmd && !(t.last.ok && new RegExp(k.cmd, 'i').test(t.last.line))) ok = false;
              if (k.cwd && t.cwd !== k.cwd) ok = false;
              if (k.out && !new RegExp(k.out, 'i').test(t.last.out)) ok = false;
              if (k.root && !t.root) ok = false;
              if (k.existe && !t.fs[k.existe]) ok = false;
              if (k.noexiste && t.fs[k.noexiste]) ok = false;
              if (k.modo && !(t.fs[k.modo[0]] && new RegExp(k.modo[1]).test(t.fs[k.modo[0]].m || ''))) ok = false;
              if (k.contiene && !(t.fs[k.contiene[0]] && new RegExp(k.contiene[1], 'i').test(t.fs[k.contiene[0]].c || ''))) ok = false;
              if (k.flag && t.last.out.includes(k.flag)) pasa = true;
              if (ok) pasa = true;
            }
            if (!pasa) err(ww, 'la solución NO resuelve la misión. Última salida: ' + JSON.stringify(t.last.out.slice(0, 200)));
            break;
          }
          default: err(ww, 'tipo desconocido');
        }
      });
    });
  });
});
console.log(`\nNiveles: ${HA.levels.length} · Unidades: ${HA.levels.reduce((a, l) => a + l.units.length, 0)} · Lecciones: ${lecciones} · Pasos: ${pasos} · Glosario: ${HA.levels.reduce((a, l) => a + (l.glosario || []).length, 0)}`);
console.log(errores ? `\n❌ ${errores} problema(s)` : '\n✅ Contenido válido');
process.exit(errores ? 1 : 0);
