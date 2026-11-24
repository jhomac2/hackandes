/* Mascotas de HackAndes: León, Lobo y Cóndor.
   Cada una tiene 5 etapas y se vuelve más épica al avanzar.
   Todo está dibujado con SVG (código), por eso pesa poco y funciona sin internet. */
(function () {
  let uid = 0;

  const ANIMALES = {
    leon: {
      nombre: 'León', defNombre: 'Leo',
      fur: '#F4B350', light: '#FFE3A8', dark: '#3B2A1A', mane: '#E0702F', mane2: '#B8461C', cheek: '#FF9A7A'
    },
    lobo: {
      nombre: 'Lobo', defNombre: 'Lupo',
      fur: '#8C86C4', light: '#EFEBFF', dark: '#2C2650', mane: '#6A63A8', mane2: '#4C4688', cheek: '#FF9AB8'
    },
    condor: {
      nombre: 'Cóndor', defNombre: 'Kuntur',
      fur: '#2E2648', light: '#FFFFFF', dark: '#120E22', mane: '#FFFFFF', mane2: '#DCD6F2', cheek: '#FF8E7A',
      head: '#E88A6E', head2: '#C9634B', beak: '#F6E7C8'
    }
  };

  const ETAPAS = [
    null,
    { nombre: 'Cachorro', desc: 'Recién empieza su aventura' },
    { nombre: 'Aprendiz', desc: 'Ya conoce lo básico' },
    { nombre: 'Guerrero', desc: 'Armadura ligera y mirada firme' },
    { nombre: 'Guardián', desc: 'Escudo, capa y protección total' },
    { nombre: 'Fusión Legendaria', desc: 'Se fusionó con su armadura digital' }
  ];
  const LEGENDARIOS = { leon: 'León Firewall', lobo: 'Lobo Cifrado', condor: 'Cóndor de los Andes' };

  function scallop(cx, cy, r, n, depth, spiky) {
    let d = '';
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      const am = ((i - 0.5) / n) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      if (i === 0) { d += `M${x.toFixed(1)},${y.toFixed(1)}`; continue; }
      const rr = spiky ? r + depth : r + depth;
      const qx = cx + Math.cos(am) * rr, qy = cy + Math.sin(am) * rr;
      d += spiky ? `L${qx.toFixed(1)},${qy.toFixed(1)}L${x.toFixed(1)},${y.toFixed(1)}`
                 : `Q${qx.toFixed(1)},${qy.toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d + 'Z';
  }

  function eyes(cx, ey, dx, r, s, mood, A, id) {
    const glow = s === 5;
    let out = '';
    [-1, 1].forEach(side => {
      const x = cx + side * dx;
      if (mood === 'feliz') {
        out += `<path d="M${x - r},${ey + 2} Q${x},${ey - r * 1.3} ${x + r},${ey + 2}" stroke="${A.dark}" stroke-width="${r * 0.55}" fill="none" stroke-linecap="round"/>`;
        return;
      }
      out += `<circle cx="${x}" cy="${ey}" r="${r}" fill="#fff"/>`;
      const iris = glow ? `url(#${id}eye)` : (s >= 3 ? '#5B2FD1' : A.dark);
      out += `<circle cx="${x + side * r * 0.12}" cy="${ey + r * 0.1}" r="${r * 0.68}" fill="${iris}" ${glow ? `filter="url(#${id}glow)"` : ''}/>`;
      if (!glow || true) out += `<circle cx="${x + side * r * 0.12}" cy="${ey + r * 0.1}" r="${r * 0.36}" fill="${glow ? '#FFF6C9' : A.dark}"/>`;
      out += `<circle cx="${x - r * 0.25}" cy="${ey - r * 0.3}" r="${r * 0.26}" fill="#fff"/>`;
      if (mood === 'triste') {
        out += `<path d="M${x - r * 1.1},${ey - r * 1.5} L${x + r * 0.9},${ey - r * 1.25 - side * r * 0.4}" stroke="${A.dark}" stroke-width="${r * 0.35}" stroke-linecap="round"/>`;
      } else if (s >= 3) {
        // cejas firmes: bajan hacia el centro
        out += `<path d="M${x - side * r * 1.2},${ey - r * 1.55} L${x + side * r * 0.9},${ey - r * 1.05}" stroke="${A.dark}" stroke-width="${r * 0.42}" stroke-linecap="round"/>`;
      }
    });
    if (mood === 'triste') out += `<path d="M${cx + dx + r * 0.6},${ey + r} q-3,8 0,11 q3,-3 0,-11z" fill="#7CC8FF"/>`;
    return out;
  }

  function mouth(cx, my, w, mood, A) {
    if (mood === 'feliz') return `<path d="M${cx - w},${my} Q${cx},${my + w * 1.3} ${cx + w},${my} Z" fill="#7A2335"/><path d="M${cx - w * 0.5},${my + w * 0.6} Q${cx},${my + w * 0.95} ${cx + w * 0.5},${my + w * 0.6}" fill="#FF7E93"/>`;
    if (mood === 'triste') return `<path d="M${cx - w * 0.7},${my + w * 0.6} Q${cx},${my - w * 0.1} ${cx + w * 0.7},${my + w * 0.6}" stroke="${A.dark}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    return `<path d="M${cx - w * 0.8},${my} Q${cx - w * 0.4},${my + w * 0.5} ${cx},${my} Q${cx + w * 0.4},${my + w * 0.5} ${cx + w * 0.8},${my}" stroke="${A.dark}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }

  function head(animal, cx, hy, R, s, mood, A, id) {
    let o = '';
    const ey = hy - R * 0.02, dx = R * 0.4, er = R * (s <= 2 ? 0.19 : 0.15);
    if (animal === 'leon') {
      const mr = R * [0, 1.12, 1.25, 1.33, 1.38, 1.42][s];
      const fill = s === 5 ? `url(#${id}gold)` : A.mane;
      o += `<path d="${scallop(cx, hy + 2, mr, s >= 3 ? 18 : 12, R * (s >= 3 ? 0.3 : 0.18), s >= 3)}" fill="${s === 5 ? '#C66A12' : A.mane2}" transform="translate(0,4)"/>`;
      o += `<path d="${scallop(cx, hy + 2, mr, s >= 3 ? 18 : 12, R * (s >= 3 ? 0.3 : 0.18), s >= 3)}" fill="${fill}"/>`;
      [-1, 1].forEach(sd => { o += `<circle cx="${cx + sd * R * 0.72}" cy="${hy - R * 0.72}" r="${R * 0.27}" fill="${A.fur}"/><circle cx="${cx + sd * R * 0.72}" cy="${hy - R * 0.72}" r="${R * 0.14}" fill="${A.cheek}"/>`; });
      o += `<circle cx="${cx}" cy="${hy}" r="${R}" fill="${A.fur}"/>`;
      o += `<ellipse cx="${cx}" cy="${hy + R * 0.42}" rx="${R * 0.5}" ry="${R * 0.34}" fill="${A.light}"/>`;
      o += `<path d="M${cx - R * 0.17},${hy + R * 0.2} h${R * 0.34} l-${R * 0.17},${R * 0.17}z" fill="${A.dark}" stroke="${A.dark}" stroke-width="4" stroke-linejoin="round"/>`;
      o += mouth(cx, hy + R * 0.48, R * 0.2, mood, A);
    } else if (animal === 'lobo') {
      [-1, 1].forEach(sd => {
        const bx = cx + sd * R * 0.55, tipY = hy - R * (1.45 + s * 0.06);
        o += `<path d="M${bx - R * 0.33},${hy - R * 0.55} L${bx + sd * R * 0.12},${tipY} L${bx + R * 0.33},${hy - R * 0.5}Z" fill="${A.mane2}"/>`;
        o += `<path d="M${bx - R * 0.17},${hy - R * 0.62} L${bx + sd * R * 0.08},${tipY + R * 0.3} L${bx + R * 0.17},${hy - R * 0.6}Z" fill="${A.cheek}" opacity=".8"/>`;
      });
      if (s >= 2) o += `<path d="${scallop(cx, hy + R * 0.25, R * 1.02, 14, R * (0.12 + s * 0.04), true)}" fill="${s === 5 ? `url(#${id}gold)` : A.mane}"/>`;
      o += `<circle cx="${cx}" cy="${hy}" r="${R}" fill="${A.fur}"/>`;
      o += `<path d="M${cx - R * 0.95},${hy + R * 0.15} Q${cx},${hy - R * 0.25} ${cx + R * 0.95},${hy + R * 0.15} Q${cx + R * 0.7},${hy + R * 0.95} ${cx},${hy + R} Q${cx - R * 0.7},${hy + R * 0.95} ${cx - R * 0.95},${hy + R * 0.15}Z" fill="${A.light}"/>`;
      o += `<ellipse cx="${cx}" cy="${hy + R * 0.42}" rx="${R * 0.36}" ry="${R * 0.3}" fill="#fff"/>`;
      o += `<ellipse cx="${cx}" cy="${hy + R * 0.27}" rx="${R * 0.16}" ry="${R * 0.11}" fill="${A.dark}"/>`;
      if (s >= 3) o += `<path d="M${cx},${hy - R * 0.95} l${R * 0.12},${R * 0.35} l-${R * 0.12},${R * 0.18} l-${R * 0.12},-${R * 0.18}z" fill="${s === 5 ? '#FFD43B' : '#E8E3FF'}" opacity=".9"/>`;
      o += mouth(cx, hy + R * 0.5, R * 0.18, mood, A);
    } else { // cóndor
      const rr = R * (0.58 + s * 0.04);
      o += `<path d="${scallop(cx, hy + R * 0.92, rr, 14, R * 0.13, false)}" fill="${A.mane2}" transform="translate(0,3)"/>`;
      o += `<path d="${scallop(cx, hy + R * 0.92, rr, 14, R * 0.13, false)}" fill="${s === 5 ? '#FFF6D8' : A.mane}"/>`;
      if (s >= 2) o += `<path d="M${cx - R * 0.35},${hy - R * 0.78} q${R * 0.12},-${R * 0.4} ${R * 0.24},-${R * 0.05} q${R * 0.12},-${R * 0.45} ${R * 0.24},-${R * 0.02} q${R * 0.14},-${R * 0.35} ${R * 0.22},${R * 0.1}z" fill="${s === 5 ? '#FFB020' : A.head2}"/>`;
      o += `<ellipse cx="${cx}" cy="${hy}" rx="${R * 0.88}" ry="${R * 0.92}" fill="${A.head}"/>`;
      o += `<ellipse cx="${cx}" cy="${hy + R * 0.45}" rx="${R * 0.6}" ry="${R * 0.35}" fill="${A.head2}" opacity=".45"/>`;
      // pico ganchudo
      o += `<path d="M${cx - R * 0.26},${hy + R * 0.12} Q${cx},${hy - R * 0.02} ${cx + R * 0.26},${hy + R * 0.12} Q${cx + R * 0.24},${hy + R * 0.55} ${cx + R * 0.02},${hy + R * 0.78} Q${cx - R * 0.08},${hy + R * 0.6} ${cx - R * 0.2},${hy + R * 0.5}Z" fill="${A.beak}" stroke="#C9B48A" stroke-width="2"/>`;
      o += `<path d="M${cx + R * 0.1},${hy + R * 0.62} Q${cx + R * 0.05},${hy + R * 0.8} ${cx + R * 0.02},${hy + R * 0.78}" stroke="#3A2E20" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      if (mood === 'feliz') o += `<path d="M${cx - R * 0.22},${hy + R * 0.48} Q${cx},${hy + R * 0.62} ${cx + R * 0.22},${hy + R * 0.48}" stroke="#7A2335" stroke-width="3" fill="none"/>`;
    }
    if (s <= 2 && mood !== 'triste') [-1, 1].forEach(sd => { o += `<ellipse cx="${cx + sd * R * 0.62}" cy="${hy + R * 0.3}" rx="${R * 0.15}" ry="${R * 0.09}" fill="${A.cheek}" opacity=".55"/>`; });
    o += eyes(cx, ey, dx, er, s, mood, A, id);
    return o;
  }

  function svg(animal, stage, mood, opts) {
    animal = ANIMALES[animal] ? animal : 'leon';
    const A = ANIMALES[animal], s = Math.max(1, Math.min(5, stage | 0)), id = 'm' + (++uid) + '_';
    opts = opts || {};
    const cx = 120, ground = 222;
    const bRx = [0, 30, 37, 44, 48, 52][s], bRy = [0, 27, 33, 39, 43, 46][s];
    const R = [0, 46, 44, 42, 42, 42][s];
    const by = ground - bRy - 6;
    const hy = by - bRy - R * (animal === 'condor' ? 0.55 : 0.32);
    const bodyFill = animal === 'condor' ? A.fur : A.fur;
    let o = `<defs>
      <radialGradient id="${id}aura"><stop offset="0" stop-color="#FFE27A" stop-opacity=".95"/><stop offset=".45" stop-color="#F5B82E" stop-opacity=".45"/><stop offset="1" stop-color="#6C3CE1" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE58A"/><stop offset=".5" stop-color="#F5B82E"/><stop offset="1" stop-color="#C98A0B"/></linearGradient>
      <linearGradient id="${id}steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A64F0"/><stop offset="1" stop-color="#3E23A0"/></linearGradient>
      <linearGradient id="${id}cape" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7B5C"/><stop offset="1" stop-color="#B8321A"/></linearGradient>
      <radialGradient id="${id}eye"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".5" stop-color="#FFD43B"/><stop offset="1" stop-color="#FF8A00"/></radialGradient>
      <linearGradient id="${id}wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE27A" stop-opacity=".95"/><stop offset="1" stop-color="#9B6BFF" stop-opacity=".25"/></linearGradient>
      <filter id="${id}glow" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;

    // Aura y rayos (etapa 5)
    if (s === 5) {
      o += `<g class="m-rays" style="transform-origin:${cx}px ${hy + 20}px">`;
      for (let i = 0; i < 12; i++) o += `<path d="M${cx},${hy + 20} L${cx - 9},${hy - 105} L${cx + 9},${hy - 105}Z" fill="#FFD43B" opacity=".22" transform="rotate(${i * 30} ${cx} ${hy + 20})"/>`;
      o += `</g><circle cx="${cx}" cy="${hy + 25}" r="112" fill="url(#${id}aura)" class="m-pulse" style="transform-origin:${cx}px ${hy + 25}px"/>`;
    } else if (s === 4) {
      o += `<circle cx="${cx}" cy="${hy + 30}" r="95" fill="url(#${id}aura)" opacity=".45"/>`;
    }
    // sombra
    o += `<ellipse cx="${cx}" cy="${ground}" rx="${bRx * 1.25}" ry="7" fill="#2A1F4A" opacity=".18"/>`;

    // Alas de energía (5) o alas de cóndor
    if (s === 5) {
      [-1, 1].forEach(sd => {
        o += `<path class="m-wing" d="M${cx + sd * 20},${by - 10} C${cx + sd * 90},${by - 120} ${cx + sd * 120},${by - 60} ${cx + sd * 116},${by - 10} C${cx + sd * 100},${by - 30} ${cx + sd * 92},${by} ${cx + sd * 82},${by + 8} C${cx + sd * 70},${by - 10} ${cx + sd * 60},${by + 10} ${cx + sd * 40},${by + 14}Z" fill="url(#${id}wing)" stroke="#FFE27A" stroke-width="2" opacity=".9"/>`;
      });
    }
    if (animal === 'condor') {
      const span = [0, 34, 44, 56, 66, 78][s];
      [-1, 1].forEach(sd => {
        const x0 = cx + sd * bRx * 0.7;
        o += `<path d="M${x0},${by - bRy * 0.6} Q${x0 + sd * span},${by - bRy * 1.1} ${x0 + sd * span * 1.05},${by + bRy * 0.3} l${-sd * 8},-6 l${-sd * 2},12 l${-sd * 9},-8 l${-sd * 3},12 l${-sd * 9},-9 Q${x0 + sd * 6},${by + bRy * 0.5} ${x0},${by + bRy * 0.2}Z" fill="${A.fur}" stroke="${A.dark}" stroke-width="2"/>`;
        o += `<path d="M${x0 + sd * span * 0.35},${by - bRy * 0.5} Q${x0 + sd * span * 0.8},${by - bRy * 0.6} ${x0 + sd * span * 0.95},${by + bRy * 0.1}" stroke="#fff" stroke-width="${3 + s}" fill="none" opacity=".85" stroke-linecap="round"/>`;
      });
    }
    // Capa (4+)
    if (s >= 4) {
      o += `<path d="M${cx - bRx * 0.8},${by - bRy * 0.8} Q${cx - bRx * 1.5},${by + bRy * 0.6} ${cx - bRx * 1.25},${ground - 2} L${cx + bRx * 1.25},${ground - 2} Q${cx + bRx * 1.5},${by + bRy * 0.6} ${cx + bRx * 0.8},${by - bRy * 0.8}Z" fill="url(#${id}cape)"/>`;
    }
    // Cola
    if (animal === 'leon') o += `<path d="M${cx + bRx * 0.8},${by + bRy * 0.4} q${28},-6 ${30},-36" stroke="${A.fur}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="${cx + bRx * 0.8 + 30}" cy="${by + bRy * 0.4 - 38}" r="9" fill="${s === 5 ? '#F5B82E' : A.mane}"/>`;
    if (animal === 'lobo') o += `<path d="M${cx + bRx * 0.7},${by + bRy * 0.3} q34,-4 38,-34 q-16,10 -40,22z" fill="${A.mane2}"/>`;

    // Cuerpo
    o += `<ellipse cx="${cx}" cy="${by}" rx="${bRx}" ry="${bRy}" fill="${bodyFill}"/>`;
    if (animal !== 'condor') o += `<ellipse cx="${cx}" cy="${by + bRy * 0.2}" rx="${bRx * 0.6}" ry="${bRy * 0.65}" fill="${A.light}" opacity=".9"/>`;
    // patas
    [-1, 1].forEach(sd => {
      const fc = animal === 'condor' ? '#9C8E7A' : A.fur;
      o += `<ellipse cx="${cx + sd * bRx * 0.5}" cy="${ground - 6}" rx="${bRx * 0.32}" ry="${9 + s}" fill="${fc}" stroke="${animal === 'condor' ? '#6E6252' : 'none'}"/>`;
      if (s >= 3) o += `<rect x="${cx + sd * bRx * 0.5 - bRx * 0.3}" y="${ground - 16 - s}" width="${bRx * 0.6}" height="7" rx="3" fill="${s === 5 ? `url(#${id}gold)` : `url(#${id}steel)`}"/>`;
    });
    // Pañoleta (2) / Armadura (3+)
    if (s >= 3) {
      const plate = s === 5 ? `url(#${id}gold)` : `url(#${id}steel)`;
      o += `<path d="M${cx - bRx * 0.72},${by - bRy * 0.62} Q${cx},${by - bRy * 0.95} ${cx + bRx * 0.72},${by - bRy * 0.62} L${cx + bRx * 0.6},${by + bRy * 0.45} Q${cx},${by + bRy * 0.85} ${cx - bRx * 0.6},${by + bRy * 0.45}Z" fill="${plate}" stroke="${s === 5 ? '#FFF2B3' : '#F5B82E'}" stroke-width="3"/>`;
      // emblema: escudo con cerradura
      const ey2 = by - bRy * 0.05;
      o += `<path d="M${cx},${ey2 - 15} l13,5 v8 q0,12 -13,18 q-13,-6 -13,-18 v-8z" fill="${s === 5 ? '#6C3CE1' : '#FFD43B'}" ${s >= 4 ? `filter="url(#${id}glow)"` : ''}/>`;
      o += `<circle cx="${cx}" cy="${ey2 - 2}" r="3.5" fill="${s === 5 ? '#FFE27A' : '#3E23A0'}"/><rect x="${cx - 1.6}" y="${ey2}" width="3.2" height="8" rx="1" fill="${s === 5 ? '#FFE27A' : '#3E23A0'}"/>`;
      // líneas de circuito que brillan
      o += `<g stroke="${s === 5 ? '#FFF6C9' : '#7CE7FF'}" stroke-width="2" fill="none" opacity=".9" ${s >= 4 ? `filter="url(#${id}glow)"` : ''} class="m-circuit">
        <path d="M${cx - bRx * 0.55},${by + bRy * 0.05} h10 v10 h8"/><path d="M${cx + bRx * 0.55},${by + bRy * 0.05} h-10 v10 h-8"/>
        <circle cx="${cx - bRx * 0.55 + 18}" cy="${by + bRy * 0.05 + 10}" r="2.5" fill="${s === 5 ? '#FFF6C9' : '#7CE7FF'}"/><circle cx="${cx + bRx * 0.55 - 18}" cy="${by + bRy * 0.05 + 10}" r="2.5" fill="${s === 5 ? '#FFF6C9' : '#7CE7FF'}"/></g>`;
    }
    // Hombreras (4+)
    if (s >= 4 && animal !== 'condor') {
      [-1, 1].forEach(sd => { o += `<path d="M${cx + sd * bRx * 0.95},${by - bRy * 0.35} a${bRx * 0.38},${bRx * 0.3} 0 0 0 ${-sd * bRx * 0.7},${-bRy * 0.38} q${sd * bRx * 0.5},-4 ${sd * bRx * 0.7},${bRy * 0.38}z" fill="${s === 5 ? `url(#${id}gold)` : `url(#${id}steel)`}" stroke="#F5B82E" stroke-width="2"/>`; });
    }
    // Brazos / patitas delanteras
    if (animal !== 'condor') {
      [-1, 1].forEach(sd => { o += `<ellipse cx="${cx + sd * bRx * 0.82}" cy="${by + bRy * 0.15}" rx="${bRx * 0.22}" ry="${bRy * 0.42}" fill="${A.fur}" transform="rotate(${sd * -15} ${cx + sd * bRx * 0.82} ${by + bRy * 0.15})"/>`; });
    }
    // Escudo en mano (4+)
    if (s >= 4) {
      const sx = cx - bRx * 1.05, sy = by + bRy * 0.05;
      o += `<g ${s === 5 ? `filter="url(#${id}glow)"` : ''}><path d="M${sx},${sy - 26} l22,8 v14 q0,22 -22,32 q-22,-10 -22,-32 v-14z" fill="${s === 5 ? `url(#${id}gold)` : '#6C3CE1'}" stroke="${s === 5 ? '#FFF2B3' : '#F5B82E'}" stroke-width="3"/>
        <text x="${sx}" y="${sy + 9}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="20" fill="${s === 5 ? '#4B23B0' : '#FFD43B'}">H</text></g>`;
    }

    // Cabeza
    o += head(animal, cx, hy, R, s, mood, A, id);

    // Pañoleta en la frente (guerrero) / casco (guardián) / corona (legendario)
    if (s === 2 || s === 3) {
      const ty = hy - R * 0.62, c1 = s === 2 ? '#6C3CE1' : '#FF5A36', c2 = s === 2 ? '#5128C7' : '#C9361A';
      o += `<path d="M${cx - R * 0.85},${ty + 6} Q${cx},${ty - 10} ${cx + R * 0.85},${ty + 6} L${cx + R * 0.82},${ty + 16} Q${cx},${ty} ${cx - R * 0.82},${ty + 16}Z" fill="${c1}"/>`;
      o += `<path d="M${cx + R * 0.82},${ty + 10} l20,-6 l-6,12z M${cx + R * 0.82},${ty + 12} l16,14 l-14,0z" fill="${c2}"/><circle cx="${cx}" cy="${ty + 4}" r="4.5" fill="#FFD43B"/>`;
    }
    if (s === 4) {
      const ty = hy - R * (animal === 'condor' ? 0.78 : 0.86);
      o += `<path d="M${cx - R * 0.55},${ty + 8} Q${cx},${ty - 20} ${cx + R * 0.55},${ty + 8} L${cx + R * 0.45},${ty + 14} Q${cx},${ty - 4} ${cx - R * 0.45},${ty + 14}Z" fill="url(#${id}steel)" stroke="#F5B82E" stroke-width="2"/>`;
      o += `<path d="M${cx},${ty - 22} l6,12 l-6,6 l-6,-6z" fill="#FFD43B"/>`;
    }
    if (s === 5) {
      const ty = hy - R * (animal === 'condor' ? 0.85 : 0.95);
      o += `<g filter="url(#${id}glow)"><path d="M${cx - 26},${ty + 6} L${cx - 30},${ty - 22} L${cx - 13},${ty - 8} L${cx},${ty - 32} L${cx + 13},${ty - 8} L${cx + 30},${ty - 22} L${cx + 26},${ty + 6}Z" fill="url(#${id}gold)" stroke="#FFF2B3" stroke-width="2"/>
        <circle cx="${cx}" cy="${ty - 6}" r="5" fill="#6C3CE1"/><circle cx="${cx - 17}" cy="${ty - 2}" r="3" fill="#FF6B4A"/><circle cx="${cx + 17}" cy="${ty - 2}" r="3" fill="#FF6B4A"/></g>`;
      // partículas
      const pts = [[30, 60], [205, 70], [20, 150], [215, 160], [60, 25], [180, 30], [45, 105], [195, 115]];
      pts.forEach((p, i) => { o += `<circle class="m-spark" style="animation-delay:${(i * 0.37).toFixed(2)}s" cx="${p[0]}" cy="${p[1]}" r="${2 + (i % 3)}" fill="${i % 2 ? '#FFD43B' : '#B794FF'}"/>`; });
      o += `<text class="m-spark" x="28" y="200" font-family="monospace" font-size="11" fill="#B794FF" opacity=".8">1011</text><text class="m-spark" style="animation-delay:.8s" x="186" y="205" font-family="monospace" font-size="11" fill="#F5B82E" opacity=".8">0x1F</text>`;
    }
    const cls = 'mascot' + (opts.anim === false ? '' : ' m-idle') + (s === 5 ? ' m-legend' : '');
    const label = `${A.nombre} etapa ${s}: ${ETAPAS[s].nombre}`;
    return `<svg class="${cls}" viewBox="0 0 240 240" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${o}</svg>`;
  }

  window.Mascota = {
    svg, ANIMALES, ETAPAS, LEGENDARIOS,
    nombreEtapa(animal, s) { return s === 5 ? (LEGENDARIOS[animal] || '') + ' · Fusión Legendaria' : ETAPAS[s].nombre; }
  };
})();
