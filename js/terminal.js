/* Terminal de Linux simulada de HackAndes.
   No es un Linux real: imita los comandos más usados para que puedas practicar
   sin instalar nada, incluso desde el celular. */
(function () {
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function norm(path) {
    const parts = [];
    path.split('/').forEach(p => { if (!p || p === '.') return; if (p === '..') parts.pop(); else parts.push(p); });
    return '/' + parts.join('/');
  }

  function globToRe(g) { return new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\?/g, '.') + '$'); }

  function tokenize(line) {
    const out = []; let cur = '', q = null, has = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) { if (c === q) q = null; else cur += c; continue; }
      if (c === '"' || c === "'") { q = c; has = true; continue; }
      if (c === '\\' && i + 1 < line.length) { cur += line[++i]; has = true; continue; }
      if (/\s/.test(c)) { if (cur || has) { out.push(cur); cur = ''; has = false; } continue; }
      cur += c;
    }
    if (cur || has) out.push(cur);
    return out;
  }
  function splitTop(line, sep) { // separa por | o ; fuera de comillas
    const parts = []; let cur = '', q = null;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '\\' && i + 1 < line.length) { cur += c + line[++i]; continue; }
      if (q) { if (c === q) q = null; cur += c; continue; }
      if (c === '"' || c === "'") { q = c; cur += c; continue; }
      if (c === sep) { parts.push(cur); cur = ''; continue; }
      cur += c;
    }
    parts.push(cur); return parts;
  }

  class Terminal {
    constructor(scn) {
      scn = scn || {};
      this.scn = scn;
      this.user = scn.user || 'estudiante';
      this.host = scn.host || 'hackandes';
      this.home = scn.home || ('/home/' + this.user);
      this.fs = {};
      this.mk('/', { t: 'd' });
      ['/home', this.home, '/tmp', '/etc', '/bin', '/usr', '/usr/bin', '/var', '/var/log', '/root'].forEach(d => this.mk(d, { t: 'd', o: d === '/root' ? 'root' : 'root', r: d === '/root' ? 'root' : null }));
      this.mk(this.home, { t: 'd', o: this.user });
      this.mk('/etc/hostname', { t: 'f', c: this.host + '\n', o: 'root' });
      this.mk('/etc/passwd', { t: 'f', o: 'root', c: `root:x:0:0:root:/root:/bin/bash\n${this.user}:x:1000:1000:${this.user}:${this.home}:/bin/bash\n` + (scn.passwdExtra || '') });
      this.mk('/etc/shadow', { t: 'f', o: 'root', r: 'root', m: '-rw-r-----', c: 'root:$6$Hk4nd3s$Yz....:19700:0:99999:7:::\n' });
      if (scn.fs) this.load(scn.fs, this.home);
      this.cwd = scn.cwd ? norm(scn.cwd) : this.home;
      if (!this.fs[this.cwd]) this.mk(this.cwd, { t: 'd' });
      this.prev = this.cwd;
      this.hist = [];
      this.root = false;
      this.last = { line: '', ok: false, out: '' };
    }
    mk(path, node) {
      path = norm(path);
      const parts = path.split('/').filter(Boolean);
      let p = '';
      for (let i = 0; i < parts.length - 1; i++) { p += '/' + parts[i]; if (!this.fs[p]) this.fs[p] = { t: 'd', o: 'root' }; }
      this.fs[path] = Object.assign({ o: this.user }, this.fs[path] && this.fs[path].t === node.t ? this.fs[path] : {}, node);
    }
    load(tree, base) {
      Object.keys(tree).forEach(k => {
        const v = tree[k];
        const path = k.startsWith('/') ? norm(k) : norm(base + '/' + k);
        if (typeof v === 'string') this.mk(path, { t: 'f', c: v });
        else if (v && v._c !== undefined) this.mk(path, { t: 'f', c: v._c, m: v._m, o: v._o, r: v._r });
        else { this.mk(path, { t: 'd', o: v && v._o, r: v && v._r }); if (v) this.load(Object.fromEntries(Object.entries(v).filter(([kk]) => !kk.startsWith('_'))), path); }
      });
    }
    abs(p) { if (!p || p === '~') return this.home; if (p.startsWith('~/')) p = this.home + p.slice(1); return norm(p.startsWith('/') ? p : this.cwd + '/' + p); }
    canRead(path) { const n = this.fs[path]; if (!n) return false; if (this.root) return true; return !n.r || n.r === this.user; }
    kids(dir) {
      const pre = dir === '/' ? '/' : dir + '/';
      return Object.keys(this.fs).filter(k => k !== dir && k.startsWith(pre) && !k.slice(pre.length).includes('/')).map(k => k.slice(pre.length)).sort();
    }
    prompt() { const u = this.root ? 'root' : this.user; const p = this.cwd === this.home ? '~' : (this.cwd.startsWith(this.home + '/') ? '~' + this.cwd.slice(this.home.length) : this.cwd); return `${u}@${this.host}:${p}${this.root ? '#' : '$'}`; }

    run(line) {
      line = line.trim();
      this.last = { line, ok: true, out: '' };
      if (!line) return '';
      this.hist.push(line);
      let html = '';
      for (const seg of splitTop(line, ';')) {
        if (!seg.trim()) continue;
        html += this.pipeline(seg.trim());
      }
      return html;
    }
    pipeline(line) {
      // redirección
      let redir = null;
      const m = line.match(/^(.*?)\s*(>>?)\s*([^\s>]+)\s*$/);
      if (m && !/^\s*echo\s+["'].*>.*["']\s*$/.test(line)) { line = m[1]; redir = { app: m[2] === '>>', file: m[3] }; }
      const stages = splitTop(line, '|').map(s => s.trim());
      let input = null, res = { out: '', err: '', html: null };
      for (const st of stages) {
        res = this.cmd(st, input);
        if (res.err) { this.last.ok = false; break; }
        input = res.out;
      }
      if (redir && !res.err) {
        const p = this.abs(redir.file);
        const prev = this.fs[p] && this.fs[p].t === 'f' ? this.fs[p].c : '';
        const txt = res.out + (res.out && !res.out.endsWith('\n') ? '\n' : '');
        this.mk(p, { t: 'f', c: redir.app ? prev + txt : txt });
        res.out = ''; res.html = null;
      }
      this.last.out += res.out || '';
      if (res.err) return `<span class="err">${esc(res.err)}</span>\n`;
      if (res.html != null) return res.html;
      return res.out ? esc(res.out) + (res.out.endsWith('\n') ? '' : '\n') : '';
    }
    cmd(line, input) {
      // comandos personalizados del escenario
      if (this.scn.cmds) {
        for (const [re, val] of this.scn.cmds) {
          if (new RegExp(re).test(line)) {
            const r = typeof val === 'function' ? val(this, line) : val;
            if (typeof r === 'string') return { out: r };
            return r;
          }
        }
      }
      const a = tokenize(line);
      const c = a[0], args = a.slice(1);
      const flags = args.filter(x => /^-/.test(x)).join('');
      const pos = args.filter(x => !/^-/.test(x));
      const f = this['c_' + c];
      if (c === 'sudo') return this.sudo(args, input);
      if (!f) {
        if (/^[a-z]/i.test(c || '')) return { err: `${c}: comando no encontrado. Escribe "help" para ver los comandos.` };
        return { err: 'Comando no válido' };
      }
      try { return f.call(this, args, input, flags, pos) || { out: '' }; }
      catch (e) { return { err: c + ': ' + e.message }; }
    }
    readText(path) {
      const p = this.abs(path), n = this.fs[p];
      if (!n) throw new Error(`${path}: No existe el archivo o directorio`);
      if (n.t === 'd') throw new Error(`${path}: Es un directorio`);
      if (!this.canRead(p)) throw new Error(`${path}: Permiso denegado`);
      return n.c;
    }
    inputOrFiles(pos, input) { return pos.length ? pos.map(p => this.readText(p)).join('') : (input || ''); }

    sudo(args, input) {
      const s = this.scn.sudo;
      if (!args.length) return { err: 'uso: sudo comando' };
      if (args[0] === '-l') {
        if (!s) return { err: `Lo siento, el usuario ${this.user} no puede ejecutar sudo en ${this.host}.` };
        return { out: `El usuario ${this.user} puede ejecutar los siguientes comandos en ${this.host}:\n    ${s.list}\n` };
      }
      if (!s) return { err: `${this.user} no está en el archivo sudoers. Este incidente será reportado. 👀` };
      const line = args.join(' ');
      if (s.allow && new RegExp(s.allow).test(line)) {
        if (s.shell && new RegExp(s.shell).test(line)) { this.root = true; return { out: '# ¡Ahora eres root! (escalaste privilegios)\n' }; }
        const was = this.root; this.root = true; const r = this.cmd(line, input); this.root = was; return r;
      }
      return { err: `Lo siento, el usuario ${this.user} no puede ejecutar '${line}' como root.` };
    }

    // ===== comandos =====
    c_help() {
      return { out: `Comandos disponibles en HackAndes:
  Navegar:    pwd  ls [-la]  cd  tree
  Archivos:   cat  head  tail  touch  mkdir  rm  cp  mv  echo  file  chmod
  Buscar:     grep [-i -n -c -v -r]  find [-name -type -perm]  wc -l  sort  uniq [-c]
  Sistema:    whoami  id  hostname  uname -a  ps  history  clear  date  sudo
  Redes:      ip a  ifconfig  ping  nmap  curl  host
  Cripto:     base64 [-d]  sha256sum  rev
Truco: puedes unir comandos con | (tubería) y guardar con > archivo.
` };
    }
    c_clear() { return { out: '', html: '__CLEAR__' }; }
    c_pwd() { return { out: this.cwd }; }
    c_whoami() { return { out: this.root ? 'root' : this.user }; }
    c_id() { return { out: this.root ? 'uid=0(root) gid=0(root) grupos=0(root)' : `uid=1000(${this.user}) gid=1000(${this.user}) grupos=1000(${this.user})${this.scn.sudo ? ',27(sudo)' : ''}` }; }
    c_hostname() { return { out: this.host }; }
    c_uname(a) { return { out: a.includes('-a') ? `Linux ${this.host} 6.8.0-hackandes #1 SMP x86_64 GNU/Linux` : 'Linux' }; }
    c_date() { return { out: new Date().toLocaleString('es-EC') }; }
    c_history() { return { out: this.hist.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n') }; }
    c_echo(a) { return { out: a.filter(x => x !== '-e' && x !== '-n').join(' ').replace(/\$USER/g, this.root ? 'root' : this.user).replace(/\$HOME/g, this.home) + '\n' }; }
    c_ps() { return { out: this.scn.ps || `  PID TTY          TIME CMD\n 1337 pts/0    00:00:00 bash\n 2024 pts/0    00:00:00 ps\n` }; }
    c_exit() { if (this.root) { this.root = false; return { out: 'Saliste de root.' }; } return { out: 'No puedes cerrar la terminal de práctica 😉' }; }
    c_su(a) { return { err: 'su: Autenticación fallida' }; }
    c_cd(a, i, fl, pos) {
      let t = pos[0];
      if (t === '-') t = this.prev;
      const p = this.abs(t);
      const n = this.fs[p];
      if (!n) return { err: `cd: ${t}: No existe el archivo o directorio` };
      if (n.t !== 'd') return { err: `cd: ${t}: No es un directorio` };
      if (!this.canRead(p)) return { err: `cd: ${t}: Permiso denegado` };
      this.prev = this.cwd; this.cwd = p; return { out: '' };
    }
    c_ls(a, i, fl, pos) {
      const all = fl.includes('a'), long = fl.includes('l');
      const targets = pos.length ? pos : ['.'];
      let html = '', plain = '';
      targets.forEach(t => {
        const p = this.abs(t), n = this.fs[p];
        if (!n) throw new Error(`no se puede acceder a '${t}': No existe el archivo o directorio`);
        if (!this.canRead(p)) throw new Error(`no se puede abrir el directorio '${t}': Permiso denegado`);
        if (targets.length > 1) html += esc(t) + ':\n';
        let names = n.t === 'd' ? this.kids(p) : [t];
        if (!all) names = names.filter(x => !x.startsWith('.'));
        if (all && n.t === 'd') names = ['.', '..'].concat(names);
        const items = names.map(nm => {
          const fp = nm === '.' ? p : nm === '..' ? norm(p + '/..') : (n.t === 'd' ? norm(p + '/' + nm) : p);
          const node = this.fs[fp] || { t: 'd' };
          const cls = node.t === 'd' ? 'dir' : ((node.m || '').includes('x') ? 'exe' : '');
          plain += nm + '\n';
          if (long) {
            const mode = node.m || (node.t === 'd' ? 'drwxr-xr-x' : '-rw-r--r--');
            const own = node.o || this.user;
            const size = node.t === 'd' ? 4096 : (node.c || '').length;
            return `${mode} 1 ${own.padEnd(10)} ${own.padEnd(10)} ${String(size).padStart(5)} nov 24 10:00 <span class="${cls}">${esc(nm)}</span>`;
          }
          return `<span class="${cls}">${esc(nm)}</span>`;
        });
        html += long ? (all || names.length ? `total ${items.length * 4}\n` : '') + items.join('\n') + (items.length ? '\n' : '') : (items.join('  ') + (items.length ? '\n' : ''));
      });
      return { out: plain, html };
    }
    c_tree(a, i, fl, pos) {
      const start = this.abs(pos[0] || '.');
      const lines = [pos[0] || '.'];
      const walk = (d, pre) => {
        const ks = this.kids(d).filter(k => !k.startsWith('.'));
        ks.forEach((k, idx) => {
          const last = idx === ks.length - 1, fp = norm(d + '/' + k);
          lines.push(pre + (last ? '└── ' : '├── ') + k);
          if (this.fs[fp].t === 'd' && this.canRead(fp)) walk(fp, pre + (last ? '    ' : '│   '));
        });
      };
      walk(start, '');
      return { out: lines.join('\n') + '\n' };
    }
    c_cat(a, input, fl, pos) { return { out: this.inputOrFiles(pos, input) }; }
    c_head(a, input) {
      let n = 10; const pos = [];
      for (let k = 0; k < a.length; k++) { if (a[k] === '-n') n = +a[++k]; else if (/^-\d+$/.test(a[k])) n = +a[k].slice(1); else pos.push(a[k]); }
      return { out: this.inputOrFiles(pos, input).split('\n').slice(0, n).join('\n') + '\n' };
    }
    c_tail(a, input) {
      let n = 10; const pos = [];
      for (let k = 0; k < a.length; k++) { if (a[k] === '-n') n = +a[++k]; else if (/^-\d+$/.test(a[k])) n = +a[k].slice(1); else pos.push(a[k]); }
      const ls = this.inputOrFiles(pos, input).replace(/\n$/, '').split('\n');
      return { out: ls.slice(-n).join('\n') + '\n' };
    }
    c_wc(a, input, fl, pos) {
      const t = this.inputOrFiles(pos, input);
      const l = (t.match(/\n/g) || []).length, w = t.split(/\s+/).filter(Boolean).length;
      if (fl.includes('l')) return { out: `${l}${pos[0] ? ' ' + pos[0] : ''}\n` };
      if (fl.includes('w')) return { out: `${w}\n` };
      return { out: `${l} ${w} ${t.length}${pos[0] ? ' ' + pos[0] : ''}\n` };
    }
    c_touch(a, i, fl, pos) { pos.forEach(p => { const ap = this.abs(p); if (!this.fs[ap]) this.mk(ap, { t: 'f', c: '' }); }); }
    c_mkdir(a, i, fl, pos) {
      if (!pos.length) throw new Error('falta un operando');
      pos.forEach(p => { const ap = this.abs(p); if (this.fs[ap]) throw new Error(`no se puede crear el directorio «${p}»: El archivo ya existe`); this.mk(ap, { t: 'd' }); });
    }
    c_rm(a, i, fl, pos) {
      if (!pos.length) throw new Error('falta un operando');
      pos.forEach(p => {
        const ap = this.abs(p), n = this.fs[ap];
        if (!n) throw new Error(`no se puede borrar '${p}': No existe el archivo o directorio`);
        if (n.o === 'root' && !this.root) throw new Error(`no se puede borrar '${p}': Permiso denegado`);
        if (n.t === 'd' && !fl.includes('r')) throw new Error(`no se puede borrar '${p}': Es un directorio (usa rm -r)`);
        Object.keys(this.fs).forEach(k => { if (k === ap || k.startsWith(ap + '/')) delete this.fs[k]; });
      });
    }
    c_cp(a, i, fl, pos) {
      if (pos.length < 2) throw new Error('falta el destino');
      const src = this.abs(pos[0]), n = this.fs[src];
      if (!n || n.t !== 'f') throw new Error(`no se puede copiar '${pos[0]}'`);
      if (!this.canRead(src)) throw new Error('Permiso denegado');
      let dst = this.abs(pos[1]); if (this.fs[dst] && this.fs[dst].t === 'd') dst = norm(dst + '/' + src.split('/').pop());
      this.mk(dst, { t: 'f', c: n.c, m: n.m, o: this.root ? 'root' : this.user });
    }
    c_mv(a, i, fl, pos) {
      if (pos.length < 2) throw new Error('falta el destino');
      const src = this.abs(pos[0]);
      if (!this.fs[src]) throw new Error(`no se puede mover '${pos[0]}': No existe`);
      let dst = this.abs(pos[1]); if (this.fs[dst] && this.fs[dst].t === 'd') dst = norm(dst + '/' + src.split('/').pop());
      Object.keys(this.fs).forEach(k => { if (k === src || k.startsWith(src + '/')) { this.fs[dst + k.slice(src.length)] = this.fs[k]; delete this.fs[k]; } });
    }
    c_file(a, i, fl, pos) {
      return { out: pos.map(p => { const n = this.fs[this.abs(p)]; if (!n) return `${p}: no existe`; if (n.t === 'd') return `${p}: directory`; if (n.ftype) return `${p}: ${n.ftype}`; const c = n.c || ''; if (/^\x7fELF|^ELF/.test(c)) return `${p}: ELF 64-bit LSB executable`; if (c.startsWith('%PDF')) return `${p}: PDF document`; if (c.startsWith('MZ')) return `${p}: PE32 executable (GUI) Intel 80386, for MS Windows`; if (c.startsWith('#!')) return `${p}: shell script, ASCII text executable`; if (/^[A-Za-z0-9+/=\n]+$/.test(c) && c.length > 12) return `${p}: ASCII text (parece Base64 👀)`; return `${p}: ASCII text`; }).join('\n') + '\n' };
    }
    c_chmod(a, i, fl, pos) {
      if (pos.length < 2) throw new Error('uso: chmod MODO archivo');
      const ap = this.abs(pos[1]), n = this.fs[ap];
      if (!n) throw new Error(`no se puede acceder a '${pos[1]}'`);
      if (n.o === 'root' && !this.root) throw new Error('Operación no permitida');
      const mode = pos[0];
      let m = n.m || '-rw-r--r--';
      if (/^\+x$|^u\+x$|^a\+x$/.test(mode)) m = m.slice(0, 3) + 'x' + m.slice(4, 6) + 'x' + m.slice(7, 9) + 'x';
      else if (/^[0-7]{3}$/.test(mode)) { const r = (d) => ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'][+d]; m = '-' + r(mode[0]) + r(mode[1]) + r(mode[2]); }
      else throw new Error('modo no reconocido (prueba 755 o +x)');
      n.m = m;
    }
    c_grep(a, input) {
      let opts = '', pat = null; const files = [];
      a.forEach(x => { if (/^-[a-zA-Z]+$/.test(x) && pat === null) opts += x.slice(1); else if (pat === null) pat = x; else files.push(x); });
      if (pat === null) throw new Error('uso: grep [-i -n -c -v -r] PATRÓN [ARCHIVO]');
      const fl2 = opts.includes('i') ? 'i' : '';
      let re; try { re = new RegExp(pat, fl2); } catch (e) { re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), fl2); }
      let sources = [];
      if (opts.includes('r')) {
        const base = this.abs(files[0] || '.');
        Object.keys(this.fs).filter(k => (k === base || k.startsWith(base === '/' ? '/' : base + '/')) && this.fs[k].t === 'f' && this.canRead(k)).forEach(k => sources.push([k.replace(this.cwd + '/', ''), this.fs[k].c]));
      } else if (files.length) sources = files.map(f => [f, this.readText(f)]);
      else sources = [[null, input || '']];
      let out = [], count = 0;
      sources.forEach(([name, txt]) => {
        txt.replace(/\n$/, '').split('\n').forEach((ln, idx) => {
          const hit = re.test(ln) !== opts.includes('v');
          if (hit) { count++; if (!opts.includes('c')) out.push((sources.length > 1 || opts.includes('r') ? name + ':' : '') + (opts.includes('n') ? (idx + 1) + ':' : '') + ln); }
        });
      });
      if (opts.includes('c')) return { out: count + '\n' };
      const plain = out.join('\n') + (out.length ? '\n' : '');
      const reG = new RegExp(re.source, fl2 + 'g');
      const html = out.map(l => { let r = '', last = 0; l.replace(reG, (m, ...rest) => { const off = rest[rest.length - 2]; if (!m) return m; r += esc(l.slice(last, off)) + `<span class="ok">${esc(m)}</span>`; last = off + m.length; return m; }); return r + esc(l.slice(last)); }).join('\n') + (out.length ? '\n' : '');
      return { out: plain, html };
    }
    c_find(a) {
      let start = '.', name = null, type = null, perm = null, user = null;
      for (let k = 0; k < a.length; k++) {
        if (a[k] === '-name' || a[k] === '-iname') name = a[++k];
        else if (a[k] === '-type') type = a[++k];
        else if (a[k] === '-perm') perm = a[++k];
        else if (a[k] === '-user') user = a[++k];
        else if (a[k] === '2>/dev/null' || a[k].startsWith('-')) { /* ignorar */ }
        else if (k === 0) start = a[k];
      }
      const base = this.abs(start);
      const res = Object.keys(this.fs).filter(k => k === base || k.startsWith(base === '/' ? '/' : base + '/')).sort().filter(k => {
        const n = this.fs[k];
        if (type && ((type === 'f') !== (n.t === 'f'))) return false;
        if (name && !globToRe(name.toLowerCase()).test(k.split('/').pop().toLowerCase())) return false;
        if (perm && !((n.m || '').charAt(3) === 's')) return false;
        if (user && (n.o || this.user) !== user) return false;
        return true;
      }).map(k => start === '.' ? (k === this.cwd ? '.' : '.' + k.slice(this.cwd.length)) : k);
      return { out: res.join('\n') + (res.length ? '\n' : '') };
    }
    c_sort(a, input, fl, pos) {
      let l = this.inputOrFiles(pos, input).replace(/\n$/, '').split('\n');
      l = fl.includes('n') ? l.sort((x, y) => parseFloat(x) - parseFloat(y)) : l.sort();
      if (fl.includes('r')) l.reverse();
      return { out: l.join('\n') + '\n' };
    }
    c_uniq(a, input, fl, pos) {
      const l = this.inputOrFiles(pos, input).replace(/\n$/, '').split('\n');
      const out = [];
      l.forEach(x => { const last = out[out.length - 1]; if (last && last[1] === x) last[0]++; else out.push([1, x]); });
      return { out: out.map(([n, x]) => fl.includes('c') ? `${String(n).padStart(7)} ${x}` : x).join('\n') + '\n' };
    }
    c_rev(a, input, fl, pos) { return { out: this.inputOrFiles(pos, input).replace(/\n$/, '').split('\n').map(x => [...x].reverse().join('')).join('\n') + '\n' }; }
    c_base64(a, input, fl, pos) {
      const t = this.inputOrFiles(pos, input);
      if (fl.includes('d')) {
        try { return { out: decodeURIComponent(escape(atob(t.replace(/\s/g, '')))) }; } catch (e) { throw new Error('entrada no válida'); }
      }
      return { out: btoa(unescape(encodeURIComponent(t))) + '\n' };
    }
    c_sha256sum(a, input, fl, pos) {
      if (pos.length) return { out: pos.map(p => `${window.sha256(this.readText(p))}  ${p}`).join('\n') + '\n' };
      return { out: `${window.sha256(input || '')}  -\n` };
    }
    c_ip(a) {
      if (a[0] !== 'a' && a[0] !== 'addr') throw new Error('prueba: ip a');
      const ip = (this.scn.net && this.scn.net.ip) || '192.168.1.15';
      return { out: `1: lo: <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: wlan0: <BROADCAST,MULTICAST,UP> mtu 1500\n    link/ether 3c:22:fb:9a:10:4e\n    inet ${ip}/24 brd 192.168.1.255 scope global wlan0\n` };
    }
    c_ifconfig() { return this.c_ip(['a']); }
    c_ping(a, i, fl, pos) {
      const t = pos[0]; if (!t) throw new Error('uso: ping HOST');
      const hosts = (this.scn.net && this.scn.net.hosts) || { '192.168.1.1': 'router', '8.8.8.8': 'dns', 'google.com': '142.250.78.14', 'espe.edu.ec': '190.15.130.10' };
      const ip = /^\d+\.\d+\.\d+\.\d+$/.test(t) ? t : (typeof hosts[t] === 'string' && /^\d/.test(hosts[t]) ? hosts[t] : null);
      const vivo = hosts[t] !== undefined || t === '127.0.0.1';
      if (!vivo) return { out: `PING ${t}: 4 paquetes transmitidos, 0 recibidos, 100% de pérdida de paquetes\n(El equipo no responde o no existe)\n` };
      const lines = [`PING ${t} ${ip ? '(' + ip + ')' : ''} 56 bytes de datos.`];
      for (let k = 1; k <= 4; k++) lines.push(`64 bytes de ${ip || t}: icmp_seq=${k} ttl=${t.includes('.') && !/^192/.test(t) ? 117 : 64} tiempo=${(10 + Math.random() * 30).toFixed(1)} ms`);
      lines.push(`--- ${t} estadísticas ---\n4 paquetes transmitidos, 4 recibidos, 0% de pérdida`);
      return { out: lines.join('\n') + '\n' };
    }
    c_host(a, i, fl, pos) {
      const d = (this.scn.net && this.scn.net.dns) || { 'google.com': '142.250.78.14', 'espe.edu.ec': '190.15.130.10', 'hackandes.local': '10.10.10.5' };
      const t = pos[0]; if (!t) throw new Error('uso: host DOMINIO');
      if (!d[t]) return { err: `Host ${t} no encontrado: 3(NXDOMAIN)` };
      return { out: `${t} has address ${d[t]}\n` };
    }
    c_nmap(a, i, fl, pos) {
      const t = pos[pos.length - 1];
      if (!t) throw new Error('uso: nmap [-sV] [-p-] OBJETIVO');
      const db = (this.scn.net && this.scn.net.nmap) || {};
      let key = Object.keys(db).find(k => k === t);
      if (!key && /\/24$/.test(t)) key = Object.keys(db).find(k => k.endsWith('/24'));
      const sv = a.includes('-sV') || a.includes('-A');
      let body;
      if (!key) body = `Nota: el equipo parece apagado o no existe en la red de práctica.\nNmap terminado: 1 dirección IP (0 equipos activos)`;
      else {
        const d = db[key];
        if (typeof d === 'string') body = d;
        else body = `Nmap scan report for ${t}\nHost is up (0.0021s latency).\nPORT      STATE  SERVICE${sv ? '  VERSION' : ''}\n` + d.map(p => `${(p[0] + '/tcp').padEnd(9)} ${p[1].padEnd(6)} ${p[2].padEnd(8)}${sv && p[3] ? ' ' + p[3] : ''}`).join('\n') + `\n\nNmap terminado: 1 dirección IP (1 equipo activo)`;
      }
      return { out: `Starting Nmap 7.95 ( https://nmap.org )\n${body}\n` };
    }
    c_curl(a, i, fl, pos) {
      const url = pos[0]; if (!url) throw new Error('uso: curl URL');
      const web = (this.scn.net && this.scn.net.web) || {};
      const k = Object.keys(web).find(x => x === url || x === url.replace(/\/$/, ''));
      if (!k) return { err: `curl: (7) No se pudo conectar a ${url}` };
      return { out: web[k] };
    }
    c_wget(a) { return this.c_curl(a, null, '', a.filter(x => !x.startsWith('-'))); }
  }

  window.Terminal = Terminal;
  window.escHTML = esc;
})();
