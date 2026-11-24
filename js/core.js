/* Núcleo: aquí se registran los niveles del curso (data/nivel1.js, nivel2.js, nivel3.js). */
window.HA = window.HA || {
  version: '1.0.0',
  levels: [],
  addLevel(lvl) {
    this.levels = this.levels.filter(l => l.id !== lvl.id);
    this.levels.push(lvl);
    this.levels.sort((a, b) => a.n - b.n);
  }
};
