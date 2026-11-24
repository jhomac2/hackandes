/* ============================================================
   NIVEL 3 · AVANZADO — "Ya practico como profesional"
   Todo ocurre en una red de práctica SIMULADA. Las técnicas se enseñan
   para que entiendas cómo atacan y sepas defender.
   ============================================================ */
(function () {
  const RED3 = {
    ip: '10.10.10.99',
    hosts: { '10.10.10.30': 'ftp-viejo', '10.10.10.50': 'ctf', '10.10.10.1': 'gateway' },
    nmap: {
      '10.10.10.30': [[21, 'open', 'ftp', 'vsftpd 2.3.4'], [22, 'open', 'ssh', 'OpenSSH 4.7p1'], [80, 'open', 'http', 'Apache httpd 2.2.8']],
      '10.10.10.50': [[22, 'open', 'ssh', 'OpenSSH 9.6p1'], [80, 'open', 'http', 'nginx 1.24.0']]
    },
    web: {
      'http://10.10.10.50': '<html><body><h1>Cooperativa Andina (ficticia) - Intranet</h1><!-- versión de pruebas, ver /dev --></body></html>\n',
      'http://10.10.10.50/robots.txt': 'User-agent: *\nDisallow: /dev/\n',
      'http://10.10.10.50/dev/': 'Índice de /dev/\n  acceso.b64\n',
      'http://10.10.10.50/dev/acceso.b64': 'c3NoOiBvcGVyYWRvciAvIEFuZGVzI0N0ZjIwMjYKSEF7ZmFzZTFfcmVjMG5fYzBtcGxldGF9Cg==\n',
      'https://cdn-colegiovolcan.example/respaldos/': '<ListBucketResult>\n  <Name>respaldos-colegiovolcan</Name>\n  <Contents><Key>logo.png</Key></Contents>\n  <Contents><Key>respaldo_notas_2026.sql</Key></Contents>\n</ListBucketResult>\n',
      'https://cdn-colegiovolcan.example/respaldos/respaldo_notas_2026.sql': '-- Respaldo de la base de notas (¡PÚBLICO por error!)\nINSERT INTO estudiantes VALUES (1,"Estudiante A","9.5");\n-- HA{bucket_public0_dat0s_expuest0s}\n'
    }
  };
  const SEARCHSPLOIT = '---------------------------------------------------------- ---------------------------\n Exploit Title                                            |  Path\n---------------------------------------------------------- ---------------------------\nvsftpd 2.3.4 - Backdoor Command Execution                 | unix/remote/49757.py\nvsftpd 2.3.4 - Backdoor Command Execution (Metasploit)    | unix/remote/17491.rb\n---------------------------------------------------------- ---------------------------\n';
  const ACCESS_LOG = '190.152.4.21 - - [24/Nov/2026:10:01:02] "GET / HTTP/1.1" 200 5120\n'
    + '190.152.4.21 - - [24/Nov/2026:10:01:09] "GET /productos HTTP/1.1" 200 8840\n'
    + '45.141.87.3 - - [24/Nov/2026:10:05:11] "GET /admin HTTP/1.1" 404 210\n'
    + '45.141.87.3 - - [24/Nov/2026:10:05:11] "GET /wp-login.php HTTP/1.1" 404 210\n'
    + '45.141.87.3 - - [24/Nov/2026:10:05:12] "GET /.env HTTP/1.1" 404 210\n'
    + '45.141.87.3 - - [24/Nov/2026:10:05:12] "GET /backup.zip HTTP/1.1" 404 210\n'
    + '45.141.87.3 - - [24/Nov/2026:10:05:13] "GET /phpmyadmin HTTP/1.1" 404 210\n'
    + '186.47.80.9 - - [24/Nov/2026:10:07:40] "GET /buscar?q=laptop HTTP/1.1" 200 3301\n'
    + '103.77.12.55 - - [24/Nov/2026:10:09:01] "GET /buscar?q=%27%20UNION%20SELECT%20usuario,clave%20FROM%20usuarios-- HTTP/1.1" 500 98\n'
    + '103.77.12.55 - - [24/Nov/2026:10:09:05] "GET /buscar?q=%27%20OR%201=1-- HTTP/1.1" 200 99120\n'
    + '190.152.4.21 - - [24/Nov/2026:10:12:30] "POST /carrito HTTP/1.1" 200 1200\n';
  const PS_MINERO = '  PID USER     %CPU COMMAND\n    1 root      0.0 /sbin/init\n  612 root      0.1 /usr/sbin/sshd\n  845 www-data  0.3 nginx: worker process\n 1337 www-data 98.7 /tmp/.x/kworkerd --url pool.minexmr.example:4444\n 2024 analista  0.0 ps aux\n';

  HA.addLevel({
    n: 3, id: 'n3', nombre: 'Modo profesional', sub: 'Avanzado · Ya practico como profesional',
    units: [
      // ======================= UNIDAD 11: EXPLOTACIÓN =======================
      {
        titulo: 'Vulnerabilidades y explotación', icono: '💥', desc: 'CVE, CVSS, contraseñas offline y shells.',
        lessons: [
          {
            titulo: 'CVE, CVSS y búsqueda de exploits', icono: '📋', desc: 'Cómo se cataloga una falla.',
            steps: [
              { t: 'teoria', titulo: 'El catálogo mundial de fallas', txt: `<p>Cuando se descubre una vulnerabilidad pública, recibe un código <b>CVE</b> (Common Vulnerabilities and Exposures), por ejemplo <code>CVE-2021-44228</code> (la famosa Log4Shell).</p><p>Su gravedad se mide con <b>CVSS</b>, de 0 a 10:</p><ul><li>0.1 – 3.9 <b>Baja</b> · 4.0 – 6.9 <b>Media</b> · 7.0 – 8.9 <b>Alta</b> · 9.0 – 10 <b>Crítica</b></li></ul><p>Flujo típico: <code>nmap -sV</code> te da la <b>versión</b> del servicio → buscas si esa versión tiene CVE conocidos → priorizas por CVSS.</p>`, dato: 'Herramientas como searchsploit buscan en una copia local de Exploit-DB, una base pública de exploits usada por pentesters.' },
              { t: 'terminal', q: '<b>Misión:</b> identifica las versiones de los servicios del servidor de práctica <code>10.10.10.30</code>.', esc: { net: RED3 }, check: { cmd: '^nmap', out: 'vsftpd 2\\.3\\.4' }, pista: 'nmap -sV 10.10.10.30', sol: ['nmap -sV 10.10.10.30'], exp: 'El FTP usa vsftpd 2.3.4, OpenSSH 4.7 y Apache 2.2.8: ¡versiones de hace más de 15 años!' },
              { t: 'terminal', q: '<b>Misión:</b> busca si <code>vsftpd</code> tiene exploits conocidos con <code>searchsploit vsftpd</code>.', esc: { net: RED3, cmds: [['^searchsploit', SEARCHSPLOIT]] }, check: { cmd: '^searchsploit', out: 'Backdoor' }, pista: 'searchsploit vsftpd', sol: ['searchsploit vsftpd'], exp: 'vsftpd 2.3.4 tuvo una puerta trasera (backdoor) famosa: alguien modificó el código fuente original en 2011. Es un clásico de laboratorio.' },
              { t: 'parejas', q: 'Clasifica cada puntaje CVSS', pares: [['2.5', 'Baja'], ['5.3', 'Media'], ['8.1', 'Alta'], ['9.8', 'Crítica']] },
              { t: 'opcion', q: '¿Qué te da la información para buscar vulnerabilidades conocidas?', ops: ['El color de la página', 'La versión exacta del servicio (nmap -sV)', 'La IP pública', 'El número de usuarios'], ok: 1, exp: 'Cada versión tiene fallas conocidas distintas. Por eso los atacantes buscan versiones viejas.' },
              { t: 'vf', q: 'Ocultar la versión del servicio arregla la vulnerabilidad.', ok: false, exp: 'Solo dificulta un poco el reconocimiento. La solución real es ACTUALIZAR.' },
              { t: 'escribir', q: '¿Cómo se llama el sistema de códigos para vulnerabilidades públicas? (3 letras)', ok: ['cve'], exp: 'CVE: Common Vulnerabilities and Exposures.' }
            ]
          },
          {
            titulo: 'Contraseñas offline', icono: '🔓', desc: 'Por qué un hash débil cae en segundos.',
            steps: [
              { t: 'teoria', titulo: 'Atacar hashes robados', txt: `<p>Si un atacante roba una base de datos con <b>hashes</b>, no necesita adivinar en la página web: los ataca <b>offline</b>, en su propia computadora, sin límite de intentos.</p><ul><li>Prueba palabras de una <b>wordlist</b> (lista de claves filtradas, como la famosa <i>rockyou.txt</i>, con más de 14 millones de claves reales).</li><li>Calcula el hash de cada palabra y lo compara.</li><li>Herramientas: <b>John the Ripper</b> y <b>Hashcat</b>.</li></ul>`, dato: 'Un hash MD5 sin sal de una clave común cae en milisegundos. Uno de bcrypt con una frase larga puede resistir años.' },
              { t: 'teoria', titulo: 'Reconocer el tipo de hash', txt: `<ul><li><code>5f4dcc3b5aa765d61d8327deb882cf99</code> → 32 hex: probablemente <b>MD5</b>.</li><li>64 caracteres hex: probablemente <b>SHA-256</b>.</li><li><code>$2y$10$...</code> → <b>bcrypt</b> (lento, bueno).</li><li><code>$6$...</code> → <b>SHA-512 crypt</b> de Linux (el de /etc/shadow).</li></ul>`, dato: 'Este conocimiento se usa en auditorías autorizadas para demostrar a una empresa que sus usuarios usan claves débiles.' },
              { t: 'terminal', q: '<b>Misión (auditoría autorizada):</b> el cliente te entregó <code>hashes.txt</code>. Prueba qué tan débiles son las claves con <code>john --wordlist=rockyou.txt hashes.txt</code>.', esc: { fs: { 'hashes.txt': 'ana:e10adc3949ba59abbe56e057f20f883e\nluis:0b9ed3b1e1f5d6ab17f01e4df1d6b2aa\nsofia:$2y$12$Wq7vY3lJb1Qz...\n', 'rockyou.txt': '123456\npassword\necuador123\n...(14 millones más)\n' }, cmds: [['^john', 'Usando: wordlist rockyou.txt\nCargados 3 hashes (MD5 x2, bcrypt x1)\n123456           (ana)\necuador123       (luis)\n2 contraseñas descifradas en 0:00:00:01. 1 restante (bcrypt: sigue intentando...)\n']] }, check: { cmd: '^john', out: 'descifradas' }, pista: 'john --wordlist=rockyou.txt hashes.txt', sol: ['john --wordlist=rockyou.txt hashes.txt'], exp: 'En 1 segundo cayeron las claves de Ana y Luis (MD5 + claves comunes). La de Sofía resistió: bcrypt es lento y su clave no estaba en la lista.' },
              { t: 'escribir', q: '¿Cuál era la contraseña de <b>luis</b>?', ok: ['ecuador123'], exp: 'ecuador123: está en todas las listas de claves filtradas.' },
              { t: 'parejas', q: 'Reconoce cada hash', pares: [['32 caracteres hex', 'MD5'], ['$2y$...', 'bcrypt'], ['$6$...', 'SHA-512 de Linux'], ['64 caracteres hex', 'SHA-256']] },
              { t: 'opcion', q: '¿Qué protegió la contraseña de Sofía?', ops: ['Que su nombre es largo', 'Un hash lento (bcrypt) y una clave que no está en wordlists', 'Que el archivo era .txt', 'Nada, fue suerte'], ok: 1, exp: 'Algoritmo lento + contraseña única y larga = resistencia real.' },
              { t: 'vf', q: 'Limitar intentos de login en la web también protege contra ataques offline a hashes robados.', ok: false, exp: 'Offline el atacante ya tiene los hashes en su PC: no hay límite. Solo te protegen el hash lento y la clave fuerte.' }
            ]
          },
          {
            titulo: 'Reto: shells y explotación', icono: '🐚', reto: true, desc: 'De una vulnerabilidad a una shell de root.',
            steps: [
              { t: 'teoria', titulo: 'Shells y Metasploit', txt: `<p>Explotar con éxito suele darte una <b>shell</b>: una terminal en el equipo víctima.</p><ul><li><b>Bind shell:</b> la víctima abre un puerto y tú te conectas a ella.</li><li><b>Reverse shell:</b> la víctima se conecta hacia TI. Es más común porque los firewalls suelen permitir conexiones de salida.</li></ul><p><b>Metasploit</b> es un framework con miles de exploits. Flujo básico: <code>search</code> → <code>use</code> el módulo → <code>set RHOSTS</code> (la víctima) → <code>run</code>.</p>`, dato: 'Defensa: actualizar, cerrar servicios innecesarios y vigilar conexiones de salida extrañas (así se detectan muchas reverse shells).' },
              { t: 'orden', q: 'Ordena el flujo básico en Metasploit', items: ['search vsftpd', 'use (el módulo del exploit)', 'set RHOSTS 10.10.10.30', 'run'], exp: 'Buscar → elegir → configurar el objetivo → ejecutar.' },
              { t: 'terminal', q: '<b>Misión (laboratorio):</b> usa el exploit de prueba contra el servidor vulnerable con <code>python3 exploit.py 10.10.10.30</code>. Luego confirma quién eres y lee <code>/root/flag.txt</code>.', esc: { net: RED3, fs: { 'exploit.py': '# exploit de laboratorio (simulado)\n', '/root/flag.txt': { _c: 'HA{versi0nes_viejas_s0n_puertas_abiertas}\n', _r: 'root', _o: 'root' } }, cmds: [['^python3\\s+exploit\\.py\\s+10\\.10\\.10\\.30', (t) => { t.root = true; t.host = 'ftp-viejo'; return '[+] Conectando a 10.10.10.30:21...\n[+] Backdoor activado en el puerto 6200\n[+] ¡Shell obtenida! Ahora estás DENTRO de la víctima como root.\n'; }]] }, check: { flag: 'HA{versi0nes_viejas_s0n_puertas_abiertas}' }, pista: 'python3 exploit.py 10.10.10.30 → whoami → cat /root/flag.txt', sol: ['python3 exploit.py 10.10.10.30', 'whoami', 'cat /root/flag.txt'], exp: 'Un servicio sin actualizar = control total. En el informe, la recomendación es clara: actualizar o retirar ese servicio.' },
              { t: 'parejas', q: 'Une cada término', pares: [['Reverse shell', 'La víctima se conecta al atacante'], ['Bind shell', 'El atacante se conecta a la víctima'], ['Payload', 'Lo que se ejecuta tras explotar'], ['RHOSTS', 'La IP del objetivo en Metasploit']] },
              { t: 'opcion', q: '¿Por qué la reverse shell es más común que la bind shell?', ops: ['Es más bonita', 'Los firewalls suelen permitir conexiones de SALIDA', 'No necesita red', 'Es legal en cualquier caso'], ok: 1, exp: 'Las conexiones entrantes suelen bloquearse; las salientes, no tanto.' },
              { t: 'vf', q: 'La mejor defensa contra este ataque era simplemente actualizar el servicio vulnerable.', ok: true, exp: 'La mayoría de explotaciones reales aprovechan fallas con parche disponible desde hace tiempo.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 12: OSINT =======================
      {
        titulo: 'OSINT: inteligencia de fuentes abiertas', icono: '🔭', desc: 'Investigar con información pública.',
        lessons: [
          {
            titulo: '¿Qué es OSINT?', icono: '🌍', desc: 'Lo que internet sabe de una organización.',
            steps: [
              { t: 'teoria', titulo: 'Información pública, gran poder', txt: `<p><b>OSINT</b> (Open Source Intelligence) es reunir información de <b>fuentes públicas</b>: buscadores, redes sociales, sitios web, registros públicos, ofertas de empleo, metadatos de documentos.</p><p>En un pentest autorizado sirve para el <b>reconocimiento pasivo</b>: descubrir empleados, formato de correos, tecnologías usadas… sin tocar los sistemas del cliente.</p>`, dato: 'Las ofertas de empleo revelan mucho: "buscamos experto en Windows Server 2012 y SAP" le dice al atacante qué software usa la empresa.' },
              { t: 'teoria', titulo: 'Ética de OSINT', txt: `<ul><li>✅ Investigar organizaciones dentro de un trabajo autorizado.</li><li>✅ Revisar TU propia huella digital para protegerte.</li><li>❌ <b>Doxxing</b>: reunir y publicar datos de una persona para acosarla. Es dañino y puede ser delito.</li><li>❌ Usar la información para engañar o suplantar a alguien.</li></ul>`, ec: 'La Ley Orgánica de Protección de Datos Personales protege la información de las personas en Ecuador, aunque parte de ella esté visible en internet.' },
              { t: 'opcion', q: '¿Cuál de estos es reconocimiento PASIVO?', ops: ['Escanear puertos con nmap', 'Leer las ofertas de empleo publicadas por la empresa', 'Probar contraseñas en su login', 'Enviar un correo de phishing'], ok: 1, exp: 'Leer información pública no interactúa con los sistemas del objetivo.' },
              { t: 'parejas', q: 'Une cada fuente con lo que puede revelar', pares: [['Ofertas de empleo', 'Tecnologías que usa la empresa'], ['Redes sociales de empleados', 'Nombres, cargos y fotos de oficinas'], ['Metadatos de un PDF', 'Autor y software usado'], ['Archivo histórico de webs', 'Versiones viejas del sitio']] },
              { t: 'vf', q: 'Reunir datos de una persona para publicarlos y acosarla (doxxing) es parte normal del hacking ético.', ok: false, exp: 'El doxxing daña a personas reales. El OSINT ético se hace con autorización y con un fin defensivo.' },
              { t: 'opcion', q: 'Encuentras en LinkedIn que la empresa usa el formato <code>nombre.apellido@empresa.com</code>. ¿Para qué sirve en un pentest autorizado?', ops: ['Para nada', 'Para armar la lista de correos de una simulación de phishing autorizada', 'Para publicarla', 'Para venderla'], ok: 1, exp: 'Las simulaciones de phishing autorizadas miden qué tan preparados están los empleados.' }
            ]
          },
          {
            titulo: 'Google dorks y metadatos', icono: '🧬', desc: 'Buscar como un investigador.',
            steps: [
              { t: 'teoria', titulo: 'Google dorks', txt: `<p>Son operadores de búsqueda avanzados:</p><ul><li><code>site:colegiovolcan.edu.ec</code> → solo resultados de ese sitio.</li><li><code>filetype:pdf</code> → solo archivos PDF.</li><li><code>intitle:"index of"</code> → páginas cuyo título dice "index of" (carpetas expuestas).</li><li><code>"texto exacto"</code> → frase exacta.</li><li><code>-palabra</code> → excluye resultados.</li></ul>`, dato: 'Tú también puedes usarlos para encontrar apuntes y papers: site:edu.ec filetype:pdf "redes de computadoras".' },
              { t: 'teoria', titulo: 'Metadatos', txt: `<p>Muchos archivos guardan <b>metadatos</b>: datos sobre el archivo.</p><ul><li>📷 Fotos: modelo del celular, fecha y hasta <b>coordenadas GPS</b> de dónde se tomó.</li><li>📄 Documentos: autor, usuario de Windows, software y versión.</li></ul><p>Herramienta clásica: <b>exiftool</b>. Defensa: borrar metadatos antes de publicar archivos (muchas redes sociales ya lo hacen con las fotos).</p>`, dato: 'Hay casos famosos de personas localizadas por las coordenadas GPS escondidas en una foto que publicaron.' },
              { t: 'opcion', q: '¿Qué búsqueda encuentra PDFs SOLO del sitio colegiovolcan.edu.ec?', ops: ['colegiovolcan pdf', 'site:colegiovolcan.edu.ec filetype:pdf', 'filetype:colegiovolcan', 'intitle:pdf'], ok: 1, exp: 'site: limita el dominio y filetype: el tipo de archivo.' },
              { t: 'terminal', q: '<b>Misión:</b> analiza los metadatos de <code>foto_evento.jpg</code> con <code>exiftool</code>. ¿En qué ciudad se tomó? Envía la bandera.', esc: { fs: { 'foto_evento.jpg': 'JFIF...(imagen)' }, cmds: [['^exiftool\\s+foto_evento\\.jpg', 'File Name                       : foto_evento.jpg\nCamera Model Name               : Galaxy A54\nDate/Time Original              : 2026:11:20 18:42:10\nGPS Position                    : 0 deg 56\' 3.20" S, 78 deg 36\' 54.00" W\nGPS (ubicación aprox.)          : Latacunga, Cotopaxi, Ecuador\nArtist                          : HA{l0s_metadat0s_hablan}\n'], ['^exiftool', 'exiftool: no se encontró el archivo']] }, check: { flag: 'HA{l0s_metadat0s_hablan}' }, pista: 'exiftool foto_evento.jpg', sol: ['exiftool foto_evento.jpg'], exp: 'La foto reveló el celular, la fecha y la ubicación exacta (Latacunga). ¡Imagina eso en fotos de tu casa!' },
              { t: 'parejas', q: 'Une cada operador', pares: [['site:', 'Limita a un dominio'], ['filetype:', 'Tipo de archivo'], ['intitle:', 'Texto en el título'], ['-palabra', 'Excluye resultados']] },
              { t: 'vf', q: 'Antes de publicar documentos oficiales, una organización debería limpiar sus metadatos.', ok: true, exp: 'Los metadatos pueden revelar usuarios internos, software y versiones: información valiosa para un atacante.' }
            ]
          },
          {
            titulo: 'Reto: investigación OSINT', icono: '🗂️', reto: true, desc: 'Analiza una organización ficticia.',
            steps: [
              { t: 'teoria', titulo: 'Caso: Cooperativa Andina (ficticia)', txt: `<p>La Cooperativa Andina te contrató para medir su exposición pública. Esto encontraste en internet:</p><div class="card small" style="margin:8px 0"><b>📄 Oferta de empleo:</b> "Buscamos técnico con experiencia en Windows Server 2012 R2 y VPN Fortinet. Enviar CV a talento@coopandina.example"<br><br><b>👤 Perfil profesional:</b> "Carlos Mena · Jefe de TI en Cooperativa Andina · correo: carlos.mena@coopandina.example"<br><br><b>📸 Foto en redes de la oficina:</b> se ve un post-it en un monitor que dice "Wifi: Andina2024"<br><br><b>📑 PDF del informe anual:</b> metadatos → Autor: "mmorales", Software: "Microsoft Word 2010"</div>`, dato: 'Cada dato parece inofensivo por separado. Juntos, arman un plan de ataque.' },
              { t: 'escribir', q: '¿Cuál es el formato de correo de la cooperativa? Escribe el correo que tendría <b>Mónica Morales</b>.', ok: ['monica.morales@coopandina.example'], ph: 'nombre.apellido@...', exp: 'Formato nombre.apellido@coopandina.example, deducido del correo de Carlos Mena.' },
              { t: 'opcion', q: '¿Cuál es el hallazgo MÁS grave?', ops: ['El nombre del jefe de TI', 'La contraseña del Wi-Fi visible en una foto pública', 'Que usan Word', 'Que buscan personal'], ok: 1, exp: 'Una credencial expuesta da acceso directo. Hay que cambiarla y retirar la foto.' },
              { t: 'opcion', q: '¿Qué revela la oferta de empleo que un atacante aprovecharía?', ops: ['El sueldo', 'Que usan Windows Server 2012 R2 (sin soporte desde 2023) y VPN Fortinet', 'El horario', 'Nada importante'], ok: 1, exp: 'Saber las tecnologías y versiones permite buscar vulnerabilidades específicas.' },
              { t: 'orden', q: 'Ordena las recomendaciones del informe por prioridad', items: ['Cambiar la clave del Wi-Fi y retirar la foto', 'Planificar la migración del servidor sin soporte', 'Limpiar metadatos de los documentos públicos', 'Capacitar al personal sobre lo que publica en redes'], exp: 'Primero lo que da acceso directo, luego lo estructural, después la higiene y la cultura.' },
              { t: 'vf', q: 'Para este informe, deberías incluir datos personales de la vida privada de los empleados (familia, dirección de casa).', ok: false, exp: 'Solo se reporta lo necesario para el riesgo de la organización. La privacidad de las personas se respeta.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 13: ESCALADA =======================
      {
        titulo: 'Escalada de privilegios', icono: '🧗', desc: 'De usuario normal a root (en tu laboratorio).',
        lessons: [
          {
            titulo: 'Enumerar como profesional', icono: '📝', desc: 'Lo primero al entrar a un sistema.',
            steps: [
              { t: 'teoria', titulo: '¿Qué es escalar privilegios?', txt: `<p>Después de entrar a un sistema con un usuario limitado, el atacante busca más poder:</p><ul><li>⬆️ <b>Escalada vertical:</b> de usuario normal a <b>root</b> o <b>Administrador</b>.</li><li>↔️ <b>Escalada horizontal:</b> pasar a OTRO usuario del mismo nivel (ej: de Ana a Luis).</li></ul><p>Casi siempre se logra por <b>malas configuraciones</b>, no por magia.</p>`, dato: 'En defensa se aplica el principio de mínimo privilegio: cada usuario y programa con solo los permisos que necesita.' },
              { t: 'teoria', titulo: 'Lista de enumeración', txt: `<ul><li><code>whoami</code> y <code>id</code> → quién soy y en qué grupos.</li><li><code>sudo -l</code> → qué puedo ejecutar como root.</li><li><code>find / -perm -4000</code> → programas con <b>SUID</b> (se ejecutan como su dueño).</li><li>Buscar <b>contraseñas</b> en archivos de configuración: <code>grep -ri password</code>.</li><li>Tareas programadas (cron), versión del kernel, servicios internos.</li></ul>`, dato: 'Herramientas como LinPEAS (Linux) y WinPEAS (Windows) automatizan esta revisión en auditorías.' },
              { t: 'terminal', q: '<b>Misión:</b> entraste como <code>www-data</code> a un servidor de práctica. Busca contraseñas olvidadas en <code>/var/www</code> con <code>grep -ri password</code>.', esc: { user: 'www-data', home: '/var/www', fs: { '/var/www/html/index.php': '<?php include "config.php"; ?>\n', '/var/www/html/config.php': '<?php\n$db_user = "app";\n$db_password = "Volcan-DB#2019";\n// HA{las_c0nfigs_guardan_secret0s}\n?>\n', '/var/www/html/estilos.css': 'body { color: purple; }\n' } }, check: { flag: 'HA{las_c0nfigs_guardan_secret0s}' }, pista: 'grep -ri password /var/www  (y luego cat al archivo que aparezca)', sol: ['grep -ri password /var/www', 'cat /var/www/html/config.php'], exp: 'Una contraseña de base de datos en texto plano. Si se reutiliza para otro usuario o para root... game over. Defensa: secretos fuera del código y claves únicas.' },
              { t: 'parejas', q: 'Une cada comando con su objetivo', pares: [['sudo -l', 'Ver qué puedo correr como root'], ['find / -perm -4000', 'Buscar programas SUID'], ['id', 'Ver mis grupos'], ['grep -ri password', 'Buscar claves en archivos']] },
              { t: 'opcion', q: 'Pasar de la cuenta de Ana a la de Luis (ambos usuarios normales) es escalada…', ops: ['Vertical', 'Horizontal', 'Diagonal', 'No es escalada'], ok: 1, exp: 'Mismo nivel de privilegio, otra cuenta: horizontal.' },
              { t: 'vf', q: 'La mayoría de escaladas de privilegios aprovechan configuraciones descuidadas.', ok: true, exp: 'Permisos excesivos, contraseñas en archivos, software sin actualizar… errores humanos.' }
            ]
          },
          {
            titulo: 'sudo mal configurado', icono: '⚙️', desc: 'Cuando un permiso "inocente" da root.',
            steps: [
              { t: 'teoria', titulo: 'El peligro de sudo sin cuidado', txt: `<p>Un administrador quiso que el usuario pudiera usar <code>find</code> como root para buscar respaldos, y configuró sudo así:</p><p><code>(root) NOPASSWD: /usr/bin/find</code></p><p>Problema: <code>find</code> tiene la opción <code>-exec</code>, que ejecuta otro programa… ¡como root! Con eso se puede abrir una shell de root.</p><p>El sitio <b>GTFOBins</b> documenta qué programas comunes se pueden abusar así (find, vim, less, python, tar…).</p>`, dato: 'Defensa: nunca dar sudo a programas que pueden ejecutar comandos. Si hace falta, crear un script específico y limitado.' },
              { t: 'terminal', q: '<b>Misión (laboratorio):</b> revisa tus permisos con <code>sudo -l</code>, aprovecha la mala configuración de <code>find</code> para volverte root y lee <code>/root/flag.txt</code>.', esc: { user: 'luis', fs: { '/root/flag.txt': { _c: 'HA{minim0_privilegi0_siempre}\n', _r: 'root', _o: 'root' } }, sudo: { list: '(root) NOPASSWD: /usr/bin/find', allow: '^find', shell: '-exec\\s+/bin/(ba)?sh' } }, check: { flag: 'HA{minim0_privilegi0_siempre}' }, pista: 'sudo find . -exec /bin/sh \\; -quit → whoami → cat /root/flag.txt', sol: ['sudo -l', 'sudo find . -exec /bin/sh \\; -quit', 'whoami', 'cat /root/flag.txt'], exp: 'Un solo permiso mal pensado entregó el sistema completo. En el informe: quitar ese permiso de sudo.' },
              { t: 'opcion', q: '¿Por qué <code>find</code> con sudo es peligroso?', ops: ['Porque es lento', 'Porque con -exec puede ejecutar cualquier programa como root', 'Porque borra archivos', 'No es peligroso'], ok: 1, exp: '-exec ejecuta comandos con los mismos privilegios que find: root.' },
              { t: 'vf', q: 'NOPASSWD en sudo significa que no te pide contraseña para ejecutar ese comando como root.', ok: true, exp: 'Correcto. Hace más cómodo… y más riesgoso, si el comando es abusable.' },
              { t: 'opcion', q: '¿Cuál es la mejor corrección?', ops: ['Cambiar find por vim', 'Quitar ese permiso y crear un script limitado que solo haga la tarea necesaria', 'Agregar NOPASSWD a todo', 'Renombrar find'], ok: 1, exp: 'Mínimo privilegio: dar solo lo necesario, sin herramientas que abran shells.' }
            ]
          },
          {
            titulo: 'Reto: SUID y Windows', icono: '🪟', reto: true, desc: 'Programas SUID y escalada en Windows.',
            steps: [
              { t: 'teoria', titulo: 'SUID', txt: `<p>Un programa con el bit <b>SUID</b> se ejecuta con los permisos de su <b>dueño</b> (normalmente root), sin importar quién lo lance. Se ve como una <b>s</b>: <code>-rwsr-xr-x</code>.</p><p>Algunos son normales (<code>passwd</code> necesita root para cambiar tu clave). Pero un programa raro o personalizado con SUID es una bandera roja 🚩.</p>`, dato: 'Comparar la lista de SUID con la de un sistema limpio es una técnica rápida para detectar anomalías.' },
              { t: 'teoria', titulo: 'Escalada en Windows', txt: `<ul><li>Servicios con permisos débiles o rutas sin comillas.</li><li>Contraseñas guardadas (archivos de instalación, credenciales en el registro).</li><li>Parches de seguridad faltantes.</li><li>Usuarios que son administradores locales sin necesitarlo.</li></ul><p>Defensa: parches al día, cuentas estándar para el trabajo diario, contraseñas de administrador local únicas por equipo (Windows LAPS).</p>`, dato: 'Un error clásico en empresas: todos los equipos con el mismo administrador local y la misma clave. Si cae uno, caen todos.' },
              { t: 'terminal', q: '<b>Misión:</b> busca programas SUID con <code>find / -perm -4000</code>. Uno de ellos NO es normal.', esc: { fs: { '/usr/bin/passwd': { _c: 'ELF', _m: '-rwsr-xr-x', _o: 'root' }, '/usr/bin/sudo': { _c: 'ELF', _m: '-rwsr-xr-x', _o: 'root' }, '/usr/bin/su': { _c: 'ELF', _m: '-rwsr-xr-x', _o: 'root' }, '/usr/local/bin/respaldo_express': { _c: 'ELF', _m: '-rwsr-xr-x', _o: 'root' }, '/usr/bin/ls': { _c: 'ELF', _m: '-rwxr-xr-x', _o: 'root' } } }, check: { cmd: '^find', out: 'respaldo_express' }, pista: 'find / -perm -4000', sol: ['find / -perm -4000'], exp: 'passwd, sudo y su son normales. respaldo_express, en /usr/local/bin, es personalizado: hay que revisarlo.' },
              { t: 'escribir', q: '¿Cuál es el programa SUID sospechoso? (solo el nombre)', ok: ['respaldo_express', '/usr/local/bin/respaldo_express'], exp: 'respaldo_express: no viene con el sistema y corre como root.' },
              { t: 'parejas', q: 'Une cada debilidad con su defensa', pares: [['Parches faltantes', 'Actualizar el sistema'], ['Misma clave de admin en todos los equipos', 'Windows LAPS'], ['Usuario admin para todo', 'Cuenta estándar diaria'], ['SUID personalizado', 'Revisar y quitar el bit SUID']] },
              { t: 'vf', q: 'En <code>-rwsr-xr-x</code>, la "s" indica que el programa tiene SUID.', ok: true, exp: 'La s ocupa el lugar de la x del dueño: se ejecuta con los privilegios del dueño.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 14: ACTIVE DIRECTORY =======================
      {
        titulo: 'Active Directory', icono: '🏢', desc: 'El corazón de las redes de empresas.',
        lessons: [
          {
            titulo: '¿Qué es Active Directory?', icono: '🏛️', desc: 'Dominios, usuarios, grupos y políticas.',
            steps: [
              { t: 'teoria', titulo: 'El directorio de la empresa', txt: `<p><b>Active Directory (AD)</b> es el servicio de Microsoft que la mayoría de empresas usa para administrar usuarios, computadoras y permisos desde un solo lugar.</p><ul><li><b>Dominio:</b> el "territorio" de la empresa (ej: <code>coopandina.local</code>).</li><li><b>Controlador de dominio (DC):</b> el servidor que guarda la base de AD y autentica a todos.</li><li><b>Usuarios y grupos:</b> los permisos se asignan a grupos.</li><li><b>GPO</b> (Directivas de grupo): reglas para todos los equipos (fondo de pantalla, contraseñas, bloqueo de USB…).</li></ul>`, dato: 'Quien controla el grupo "Domain Admins" controla prácticamente toda la empresa. Es el premio mayor para un atacante.' },
              { t: 'teoria', titulo: 'Cómo se autentican', txt: `<ul><li><b>Kerberos:</b> el protocolo principal. Usa "tickets": inicias sesión una vez y recibes tickets para usar servicios sin volver a escribir la clave.</li><li><b>NTLM:</b> protocolo más antiguo, todavía presente por compatibilidad. Es más débil.</li></ul>`, dato: 'En Kerberos, el servicio que entrega los tickets se llama KDC y vive en el controlador de dominio.' },
              { t: 'parejas', q: 'Une cada concepto de AD', pares: [['Controlador de dominio', 'Servidor que autentica a todos'], ['GPO', 'Reglas para los equipos'], ['Domain Admins', 'Grupo con control total'], ['Kerberos', 'Autenticación con tickets']] },
              { t: 'opcion', q: '¿Por qué AD es un objetivo tan valioso?', ops: ['Porque es bonito', 'Porque controla usuarios, equipos y permisos de toda la organización', 'Porque no tiene contraseñas', 'Porque es gratis'], ok: 1, exp: 'Comprometer AD equivale a tener las llaves de todo el edificio.' },
              { t: 'vf', q: 'NTLM es más moderno y seguro que Kerberos.', ok: false, exp: 'Al revés: NTLM es más antiguo y débil. Se recomienda limitarlo o deshabilitarlo.' },
              { t: 'escribir', q: '¿Cómo se llaman las reglas que AD aplica a todos los equipos? (sigla de 3 letras)', ok: ['gpo', 'gpos'], exp: 'GPO: Group Policy Object (Directiva de grupo).' }
            ]
          },
          {
            titulo: 'Ataques comunes a AD', icono: '🎯', desc: 'Lo que debes saber para defender.',
            steps: [
              { t: 'teoria', titulo: 'Técnicas conocidas', txt: `<ul><li>🌧️ <b>Password spraying:</b> probar UNA clave común (ej: <i>Ecuador2026!</i>) en MUCHOS usuarios. Evita los bloqueos por intentos.</li><li>🎟️ <b>Kerberoasting:</b> pedir tickets de cuentas de servicio y romper su contraseña offline.</li><li>🔁 <b>Pass-the-hash:</b> usar el hash NTLM robado directamente, sin conocer la clave.</li><li>🗺️ <b>BloodHound:</b> herramienta que dibuja las rutas para llegar a Domain Admins. La usan atacantes… y defensores.</li><li>📢 <b>Envenenamiento LLMNR/NBT-NS:</b> responder a nombres que la red pregunta por error y capturar hashes.</li></ul>`, dato: 'El password spraying funciona porque, en organizaciones grandes, siempre hay alguien con "Mes+Año+!" como contraseña.' },
              { t: 'parejas', q: 'Une cada ataque con su idea', pares: [['Password spraying', 'Una clave en muchos usuarios'], ['Kerberoasting', 'Romper tickets de cuentas de servicio'], ['Pass-the-hash', 'Usar el hash sin saber la clave'], ['BloodHound', 'Mapa de rutas a Domain Admins']] },
              { t: 'opcion', q: 'Ves en los registros 300 usuarios con UN intento fallido cada uno, todos desde la misma IP, en 2 minutos. ¿Qué ataque es?', ops: ['Fuerza bruta a un usuario', 'Password spraying', 'Phishing', 'DDoS'], ok: 1, exp: 'Un intento por usuario (para no bloquear cuentas) en muchos usuarios: spraying clásico.' },
              { t: 'opcion', q: '¿Qué protege mejor contra Kerberoasting?', ops: ['Contraseñas largas y aleatorias en las cuentas de servicio', 'Cambiar el fondo de pantalla con GPO', 'Usar NTLM', 'Desactivar el antivirus'], ok: 0, exp: 'El ticket se rompe offline: si la clave de la cuenta de servicio es larga y aleatoria (o gestionada automáticamente), no cae.' },
              { t: 'vf', q: 'BloodHound solo lo usan los atacantes.', ok: false, exp: 'Los defensores lo usan para encontrar y cortar esas rutas antes que los atacantes.' }
            ]
          },
          {
            titulo: 'Reto: defender AD', icono: '🛡️', reto: true, desc: 'Monitoreo y buenas prácticas.',
            steps: [
              { t: 'teoria', titulo: 'Defensa en AD', txt: `<ul><li><b>MFA</b> para accesos remotos y cuentas privilegiadas.</li><li><b>Modelo por niveles (tiering):</b> los administradores del dominio no inician sesión en equipos comunes.</li><li><b>Windows LAPS:</b> clave de administrador local distinta en cada equipo.</li><li>Deshabilitar <b>LLMNR</b> y limitar <b>NTLM</b>.</li><li><b>Monitorear eventos</b> de Windows:<br>4624 → inicio de sesión exitoso · 4625 → inicio fallido · 4720 → usuario creado · 4740 → cuenta bloqueada</li></ul>`, dato: 'Un nuevo usuario creado a las 3 a. m. y agregado a Domain Admins (eventos 4720 + cambio de grupo) es una alerta roja inmediata.' },
              { t: 'parejas', q: 'Une cada ID de evento de Windows', pares: [['4624', 'Inicio de sesión exitoso'], ['4625', 'Inicio de sesión fallido'], ['4720', 'Usuario creado'], ['4740', 'Cuenta bloqueada']] },
              { t: 'opcion', q: '¿Qué medida evita que, si cae un equipo, caigan todos por usar la misma clave de administrador local?', ops: ['Windows LAPS', 'Cambiar el nombre del equipo', 'Usar NTLM', 'Apagar el firewall'], ok: 0, exp: 'LAPS genera y rota una clave distinta para el administrador local de cada equipo.' },
              { t: 'orden', q: 'Ordena del MENOS al MÁS seguro', items: ['Admins del dominio usan su cuenta para todo', 'Admins con cuenta separada para tareas administrativas', 'Cuenta separada + MFA', 'Cuenta separada + MFA + modelo por niveles + monitoreo'], exp: 'Las capas de defensa se suman.' },
              { t: 'vf', q: 'Muchos eventos 4625 seguidos sobre distintos usuarios pueden indicar password spraying.', ok: true, exp: 'Exacto: es justo lo que un SOC debe vigilar.' },
              { t: 'escribir', q: '¿Qué ID de evento indica un inicio de sesión FALLIDO?', ok: ['4625'], exp: '4625: inicio de sesión fallido.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 15: BLUE TEAM =======================
      {
        titulo: 'Blue team y SOC', icono: '🔵', desc: 'Detectar, analizar y responder.',
        lessons: [
          {
            titulo: 'El centro de operaciones (SOC)', icono: '🖥️', desc: 'SIEM, alertas y analistas.',
            steps: [
              { t: 'teoria', titulo: '¿Qué es un SOC?', txt: `<p>Un <b>SOC</b> (Centro de Operaciones de Seguridad) es el equipo que vigila 24/7 los sistemas de una organización para <b>detectar y responder</b> a ataques.</p><ul><li><b>Logs:</b> registros de todo lo que pasa (inicios de sesión, conexiones, errores).</li><li><b>SIEM:</b> plataforma que junta los logs de todos los sistemas, los correlaciona y genera <b>alertas</b>. Ejemplos: Splunk, Microsoft Sentinel, Wazuh (gratis y de código abierto).</li><li><b>EDR:</b> agente en cada equipo que detecta comportamiento malicioso.</li></ul>`, dato: 'Analista SOC suele ser el primer empleo de muchos profesionales de ciberseguridad. ¡Es una gran puerta de entrada!' },
              { t: 'teoria', titulo: 'Alertas: verdaderas y falsas', txt: `<ul><li>✅ <b>Verdadero positivo:</b> alerta de un ataque real.</li><li>⚠️ <b>Falso positivo:</b> alerta, pero no era ataque (ej: un empleado que olvidó su clave).</li><li>❌ <b>Falso negativo:</b> hubo ataque y NO hubo alerta. ¡El peor caso!</li></ul><p>Niveles: el analista <b>N1</b> revisa y clasifica alertas, el <b>N2</b> investiga a fondo, el <b>N3</b> busca amenazas ocultas (threat hunting).</p>`, dato: 'Demasiados falsos positivos causan "fatiga de alertas": los analistas empiezan a ignorarlas.' },
              { t: 'parejas', q: 'Une cada término', pares: [['SIEM', 'Junta y correlaciona logs'], ['EDR', 'Agente en cada equipo'], ['Falso positivo', 'Alerta sin ataque real'], ['Falso negativo', 'Ataque sin alerta']] },
              { t: 'opcion', q: 'El SIEM alerta "10 intentos fallidos" y resulta que era la gerente que olvidó su nueva clave. Es un…', ops: ['Verdadero positivo', 'Falso positivo', 'Falso negativo', 'Incidente crítico'], ok: 1, exp: 'Hubo alerta pero no ataque: falso positivo. Igual se documenta.' },
              { t: 'vf', q: 'Un falso negativo es más peligroso que un falso positivo.', ok: true, exp: 'El ataque pasa sin que nadie lo vea.' },
              { t: 'escribir', q: 'Nombre del SIEM gratuito y de código abierto mencionado en la lección', ok: ['wazuh'], exp: 'Wazuh: puedes instalarlo en tu laboratorio para practicar.' }
            ]
          },
          {
            titulo: 'Analizar logs web', icono: '📈', desc: 'Encuentra al atacante en el registro.',
            steps: [
              { t: 'teoria', titulo: 'Leer un access.log', txt: `<p>Cada línea del log de un servidor web dice: <b>IP</b> · fecha · <b>petición</b> · <b>código</b> · tamaño.</p><p><code>45.141.87.3 - - [24/Nov/2026:10:05:11] "GET /admin HTTP/1.1" 404 210</code></p><p>Patrones sospechosos:</p><ul><li>Muchos <b>404</b> seguidos probando rutas (/admin, /.env, /backup.zip) → <b>escáner</b> automático.</li><li>Comillas codificadas (<code>%27</code>), <code>UNION SELECT</code>, <code>OR 1=1</code> → intentos de <b>inyección SQL</b>.</li><li>Respuestas inusualmente grandes → posible <b>fuga de datos</b>.</li></ul>`, dato: '%27 es la comilla simple codificada para URL. %20 es un espacio.' },
              { t: 'terminal', q: '<b>Misión:</b> en <code>/var/log/nginx/access.log</code> busca intentos de inyección SQL (busca <code>UNION</code>).', esc: { user: 'analista', fs: { '/var/log/nginx/access.log': ACCESS_LOG } }, check: { cmd: '^grep.*UNION', out: 'UNION' }, pista: 'grep UNION /var/log/nginx/access.log', sol: ['grep UNION /var/log/nginx/access.log'], exp: 'Alguien intentó extraer usuarios y claves con UNION SELECT.' },
              { t: 'escribir', q: '¿Qué IP hizo los intentos de inyección SQL?', ok: ['103.77.12.55'], ph: 'Ej: 1.2.3.4', exp: '103.77.12.55. Ojo: su segundo intento (OR 1=1) devolvió 200 con 99120 bytes: ¡posible fuga de datos! Hay que escalar el incidente.' },
              { t: 'terminal', q: '<b>Misión:</b> cuenta cuántas respuestas 404 generó la IP <code>45.141.87.3</code> (escáner).', esc: { user: 'analista', fs: { '/var/log/nginx/access.log': ACCESS_LOG } }, check: { out: '^5\\s*$' }, pista: 'grep 45.141.87.3 /var/log/nginx/access.log | grep -c 404', sol: ['grep 45.141.87.3 /var/log/nginx/access.log | grep -c 404'], exp: '5 rutas inexistentes en 2 segundos: un escáner automático buscando archivos olvidados.' },
              { t: 'opcion', q: 'En el log, la petición con <code>OR 1=1</code> devolvió <b>200</b> y <b>99 120 bytes</b>. ¿Qué significa?', ops: ['Nada, 200 es bueno', 'Probablemente la inyección funcionó y se filtraron datos', 'Que el servidor está lento', 'Que fue un falso positivo seguro'], ok: 1, exp: 'Una respuesta exitosa y enorme a una inyección es indicio de explotación real. Se activa respuesta a incidentes.' },
              { t: 'parejas', q: 'Une cada patrón con lo que indica', pares: [['Muchos 404 seguidos', 'Escáner de rutas'], ['%27 UNION SELECT', 'Inyección SQL'], ['Respuesta enorme inesperada', 'Posible fuga de datos'], ['/wp-login.php en un sitio sin WordPress', 'Bot automático']] }
            ]
          },
          {
            titulo: 'Reto: respuesta a incidentes', icono: '🚨', reto: true, desc: 'Qué hacer cuando el ataque ya ocurrió.',
            steps: [
              { t: 'teoria', titulo: 'El ciclo de respuesta (NIST)', txt: `<ol><li>🧰 <b>Preparación:</b> planes, herramientas, contactos, respaldos.</li><li>🔎 <b>Detección y análisis:</b> confirmar el incidente y su alcance.</li><li>🧯 <b>Contención, erradicación y recuperación:</b> aislar, eliminar la amenaza y volver a operar.</li><li>📚 <b>Lecciones aprendidas:</b> qué falló y cómo mejorar.</li></ol><p>Los <b>IoC</b> (Indicadores de Compromiso) son las "huellas" del ataque: IPs, dominios, hashes de archivos, nombres de procesos.</p>`, dato: 'Este ciclo viene de la guía de respuesta a incidentes del NIST, el instituto de estándares de EE. UU., y se usa en todo el mundo.' },
              { t: 'terminal', q: '<b>Misión:</b> el servidor web va muy lento. Revisa los procesos con <code>ps aux</code> y encuentra el culpable.', esc: { user: 'analista', ps: PS_MINERO }, check: { cmd: '^ps', out: 'kworkerd' }, pista: 'ps aux', sol: ['ps aux'], exp: 'Un proceso usando 98.7% de CPU, escondido en /tmp/.x/ con nombre parecido a uno del sistema, conectado a un "pool" de minería: un criptominero.' },
              { t: 'opcion', q: '¿Qué es lo PRIMERO que haces tras confirmar el criptominero?', ops: ['Publicarlo en redes', 'Contener: aislar el servidor de la red sin apagarlo bruscamente', 'Formatear de inmediato sin investigar', 'Ignorarlo, solo usa CPU'], ok: 1, exp: 'Contener evita que se propague o comunique, y conservar el equipo encendido mantiene evidencia en memoria.' },
              { t: 'orden', q: 'Ordena las fases de respuesta a incidentes', items: ['Preparación', 'Detección y análisis', 'Contención, erradicación y recuperación', 'Lecciones aprendidas'], exp: 'El ciclo de NIST: prepararse, detectar, contener/erradicar/recuperar y aprender.' },
              { t: 'parejas', q: 'Identifica los IoC de este incidente', pares: [['/tmp/.x/kworkerd', 'Ruta del archivo malicioso'], ['pool.minexmr.example:4444', 'Dominio y puerto de comando'], ['www-data', 'Usuario comprometido'], ['98.7% CPU', 'Síntoma del minero']] },
              { t: 'vf', q: 'En "lecciones aprendidas" se busca culpar a la persona que cometió el error.', ok: false, exp: 'Se buscan causas y mejoras, no culpables. Una cultura de culpa hace que la gente oculte incidentes.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 16: FORENSE =======================
      {
        titulo: 'Forense digital y malware', icono: '🔬', desc: 'Evidencias, cadena de custodia y análisis.',
        lessons: [
          {
            titulo: 'Forense digital', icono: '🧾', desc: 'Evidencias que sirven ante un juez.',
            steps: [
              { t: 'teoria', titulo: 'Reglas del forense', txt: `<ul><li><b>No alterar la evidencia:</b> se trabaja sobre una <b>imagen forense</b> (copia exacta bit a bit), nunca sobre el original.</li><li><b>Hash:</b> se calcula el hash del original y de la copia para probar que son idénticos.</li><li><b>Cadena de custodia:</b> registro de quién tuvo la evidencia, cuándo y qué hizo con ella.</li><li><b>Orden de volatilidad:</b> primero lo que desaparece más rápido.</li></ul>`, ec: 'En Ecuador, la evidencia digital puede presentarse en un proceso penal, pero debe manejarse con cadena de custodia para que sea válida.' },
              { t: 'teoria', titulo: 'Orden de volatilidad', txt: `<ol><li>Registros y caché de la CPU</li><li>Memoria <b>RAM</b> (procesos, conexiones, claves)</li><li>Estado de la red y conexiones activas</li><li><b>Disco</b></li><li>Respaldos y medios externos</li></ol><p>Por eso, ante un incidente, <b>apagar el equipo</b> de golpe puede destruir evidencia valiosa que solo vivía en la RAM.</p>`, dato: 'Herramientas forenses gratuitas: Autopsy (análisis de discos) y Volatility (análisis de memoria RAM).' },
              { t: 'orden', q: 'Ordena del MÁS volátil al MENOS volátil', items: ['Caché de la CPU', 'Memoria RAM', 'Conexiones de red activas', 'Disco duro', 'Respaldos externos'], exp: 'Se recolecta primero lo que se pierde más rápido.' },
              { t: 'terminal', q: '<b>Misión:</b> verifica que la imagen forense <code>evidencia.img</code> no fue alterada: calcula su hash y compáralo con el registrado en <code>custodia.txt</code>.', esc: { user: 'perito', fs: { 'evidencia.img': 'imagen forense del disco del caso 2026-117\n', 'custodia.txt': 'Caso 2026-117\nEvidencia: evidencia.img\nSHA-256 registrado: 2a71b5c1bb3e5d50a33d2e7b1cfd11ed2bd8fe56a0b7b1fcf2d6d1c6b5a26e9b\nRecibido por: Perito A · 24/11/2026 09:00\n' } }, check: { cmd: '^sha256sum\\s+evidencia\\.img' }, pista: 'sha256sum evidencia.img y cat custodia.txt', sol: ['sha256sum evidencia.img', 'cat custodia.txt'], exp: 'Compara los dos valores con atención.' },
              { t: 'vf', q: 'En la misión anterior, el hash calculado coincide con el registrado en la cadena de custodia.', ok: false, exp: 'No coinciden: la imagen fue modificada después de registrarse. Esa evidencia ya no es confiable y hay que documentarlo.' },
              { t: 'parejas', q: 'Une cada concepto', pares: [['Imagen forense', 'Copia exacta bit a bit'], ['Cadena de custodia', 'Registro de quién tuvo la evidencia'], ['Volatility', 'Análisis de memoria RAM'], ['Autopsy', 'Análisis de discos']] }
            ]
          },
          {
            titulo: 'Análisis de malware básico', icono: '🦠', desc: 'Estático, dinámico y sandbox.',
            steps: [
              { t: 'teoria', titulo: 'Dos formas de analizar', txt: `<ul><li><b>Análisis estático:</b> examinar el archivo SIN ejecutarlo: tipo (<code>file</code>), hash, textos internos (<code>strings</code>), qué funciones importa.</li><li><b>Análisis dinámico:</b> ejecutarlo en una <b>sandbox</b> (entorno aislado) y observar qué hace: archivos que crea, conexiones que abre.</li></ul><p>⚠️ Nunca ejecutes malware en tu computadora real.</p>`, dato: 'Subir un archivo a servicios públicos de análisis puede alertar al atacante y exponer datos si el archivo es confidencial. En empresas, se analiza primero en un entorno propio.' },
              { t: 'terminal', q: '<b>Misión:</b> analiza <code>factura_sri.exe</code> de forma estática: usa <code>file</code> y luego <code>strings</code> para ver los textos que esconde. Envía la bandera.', esc: { user: 'analista', fs: { 'factura_sri.exe': 'MZ\x90...' }, cmds: [['^strings\\s+factura_sri\\.exe', '!This program cannot be run in DOS mode.\nkernel32.dll\nGetAsyncKeyState\nhttp://update-facturas.example/panel/recibir.php\nSoftware\\Microsoft\\Windows\\CurrentVersion\\Run\nkeylog.txt\nHA{strings_revela_el_c2}\n']] }, check: { flag: 'HA{strings_revela_el_c2}' }, pista: 'file factura_sri.exe y strings factura_sri.exe', sol: ['file factura_sri.exe', 'strings factura_sri.exe'], exp: 'GetAsyncKeyState + keylog.txt = keylogger. La URL es su servidor de comando y control (C2). La clave "Run" del registro le permite iniciarse con Windows (persistencia).' },
              { t: 'parejas', q: 'Interpreta lo que encontraste', pares: [['GetAsyncKeyState', 'Lee las teclas: keylogger'], ['http://update-facturas...', 'Servidor C2 del atacante'], ['...\\CurrentVersion\\Run', 'Persistencia al iniciar Windows'], ['MZ al inicio', 'Ejecutable de Windows']] },
              { t: 'opcion', q: '¿Qué diferencia al análisis dinámico del estático?', ops: ['El dinámico ejecuta la muestra en un entorno aislado', 'El estático es más peligroso', 'Son iguales', 'El dinámico solo mira el nombre'], ok: 0, exp: 'Dinámico = ejecutar y observar (en sandbox). Estático = examinar sin ejecutar.' },
              { t: 'vf', q: 'La URL de comando y control (C2) es un buen IoC para bloquear en el firewall y buscar en otros equipos.', ok: true, exp: 'Si otro equipo se conecta a esa URL, probablemente también está infectado.' }
            ]
          },
          {
            titulo: 'Reto: la línea de tiempo', icono: '⏳', reto: true, desc: 'Reconstruye lo que pasó.',
            steps: [
              { t: 'teoria', titulo: 'Línea de tiempo forense', txt: `<p>Una de las tareas más importantes es reconstruir <b>qué pasó y en qué orden</b>, combinando logs, archivos y evidencias. Esto responde: ¿cómo entró? ¿qué hizo? ¿qué se llevó?</p>`, dato: 'Por eso es vital que todos los equipos tengan la hora sincronizada (NTP). Si no, la línea de tiempo no cuadra.' },
              { t: 'orden', q: 'Reconstruye el ataque del keylogger en orden', items: ['Llega un correo "Factura SRI pendiente" con un adjunto', 'La víctima abre factura_sri.exe', 'El malware se agrega a la clave Run del registro', 'Registra las teclas en keylog.txt', 'Envía lo capturado al servidor C2'], exp: 'Entrega → ejecución → persistencia → recolección → exfiltración.' },
              { t: 'opcion', q: '¿Cuál fue el vector de entrada?', ops: ['Un USB', 'Un correo de phishing con adjunto', 'Una vulnerabilidad del router', 'Fuerza bruta'], ok: 1, exp: 'Phishing con adjunto ejecutable: lo aprendiste en el Nivel 1. ¡Todo se conecta!' },
              { t: 'opcion', q: '¿Qué contraseñas deben cambiarse tras este incidente?', ops: ['Ninguna', 'Todas las que la víctima escribió desde que se infectó', 'Solo la del Wi-Fi', 'Solo la del correo'], ok: 1, exp: 'El keylogger pudo capturar cualquiera. Se cambian desde un equipo limpio.' },
              { t: 'vf', q: 'Para que la línea de tiempo sea confiable, los equipos deben tener la hora sincronizada.', ok: true, exp: 'Si los relojes no coinciden, los eventos se ordenan mal.' },
              { t: 'escribir', q: '¿Qué protocolo sincroniza la hora de los equipos? (3 letras)', ok: ['ntp'], exp: 'NTP: Network Time Protocol.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 17: NUBE =======================
      {
        titulo: 'Seguridad en la nube', icono: '☁️', desc: 'Responsabilidad compartida y errores comunes.',
        lessons: [
          {
            titulo: 'La nube y sus modelos', icono: '🌥️', desc: 'IaaS, PaaS, SaaS y quién protege qué.',
            steps: [
              { t: 'teoria', titulo: '¿Qué es la nube?', txt: `<p>"La nube" son computadoras de otra empresa que usas por internet. Grandes proveedores: Amazon Web Services (AWS), Microsoft Azure y Google Cloud.</p><ul><li><b>IaaS:</b> te alquilan servidores virtuales; tú administras el sistema operativo y todo lo de arriba.</li><li><b>PaaS:</b> te dan una plataforma lista para subir tu aplicación.</li><li><b>SaaS:</b> usas una aplicación terminada (correo web, ofimática en línea).</li></ul>`, dato: 'Cuando usas tu correo institucional en el navegador, estás usando SaaS.' },
              { t: 'teoria', titulo: 'Responsabilidad compartida', txt: `<p>El proveedor protege <b>la nube</b> (edificios, servidores físicos, red). Tú proteges <b>lo que pones en la nube</b>: tus datos, usuarios, contraseñas y configuraciones.</p><p>La mayoría de incidentes en la nube no son "hackeos al proveedor", sino <b>errores de configuración del cliente</b>.</p>`, dato: 'Mientras más "arriba" contratas (SaaS), más responsabilidad asume el proveedor. Pero tus datos y tus usuarios SIEMPRE son tu responsabilidad.' },
              { t: 'parejas', q: 'Une cada modelo', pares: [['IaaS', 'Servidores virtuales que tú administras'], ['PaaS', 'Plataforma para subir tu app'], ['SaaS', 'Aplicación lista para usar'], ['Proveedor', 'Protege la infraestructura física']] },
              { t: 'opcion', q: 'Una empresa deja una base de datos en la nube sin contraseña. ¿De quién es la responsabilidad?', ops: ['Del proveedor de nube', 'De la empresa (el cliente)', 'De nadie', 'Del usuario final'], ok: 1, exp: 'La configuración es responsabilidad del cliente.' },
              { t: 'vf', q: 'Si uso SaaS, la seguridad de mis usuarios y contraseñas es responsabilidad solo del proveedor.', ok: false, exp: 'Tus cuentas, contraseñas, MFA y quién tiene acceso siempre te tocan a ti.' }
            ]
          },
          {
            titulo: 'Errores de configuración', icono: '🪣', desc: 'Buckets públicos y claves filtradas.',
            steps: [
              { t: 'teoria', titulo: 'Los errores más comunes', txt: `<ul><li>🪣 <b>Almacenamiento público:</b> "buckets" (carpetas en la nube) abiertos a todo internet con respaldos o datos personales.</li><li>🔑 <b>Claves de acceso filtradas:</b> programadores que suben sus llaves de la nube a GitHub por error. Las claves de AWS empiezan con <code>AKIA</code>.</li><li>👑 <b>Permisos excesivos:</b> darle "administrador" a todo (en la nube se gestiona con <b>IAM</b>).</li><li>🔓 Cuenta principal sin <b>MFA</b>.</li></ul>`, dato: 'Hay bots que revisan GitHub todo el tiempo buscando claves de nube. Una clave subida por error puede ser usada en minutos.' },
              { t: 'terminal', q: '<b>Misión:</b> revisa el repositorio del proyecto en <code>~/proyecto</code> y busca si alguien subió una clave de AWS (empiezan con <code>AKIA</code>).', esc: { fs: { 'proyecto': { 'app.js': 'const s3 = require("aws");\nconsole.log("hola");\n', 'README.md': '# Proyecto de notas\n', 'config': { 'nube.env': 'AWS_ACCESS_KEY_ID=AKIAEJEMPLO7HACKANDES\nAWS_SECRET_ACCESS_KEY=EjemploFalso/NoEsReal\n# HA{n0_subas_claves_a_github}\n' } } } }, check: { flag: 'HA{n0_subas_claves_a_github}' }, pista: 'grep -r AKIA proyecto y luego cat al archivo', sol: ['grep -r AKIA proyecto', 'cat proyecto/config/nube.env'], exp: 'Encontraste la clave en un .env. Solución: revocarla YA, usar un gestor de secretos y agregar los .env al .gitignore.' },
              { t: 'opcion', q: 'Descubres que subiste una clave de nube a GitHub. ¿Qué haces PRIMERO?', ops: ['Borrar el commit y listo', 'Revocar (desactivar) la clave inmediatamente y crear una nueva', 'Hacer el repositorio privado y olvidarlo', 'Nada, nadie lo vio'], ok: 1, exp: 'El historial de Git y los bots pudieron copiarla. Revocar es lo único que la vuelve inútil.' },
              { t: 'parejas', q: 'Une cada error con su solución', pares: [['Bucket público', 'Bloquear el acceso público'], ['Clave en GitHub', 'Revocar y usar gestor de secretos'], ['Todos son administradores', 'IAM con mínimo privilegio'], ['Cuenta principal sin MFA', 'Activar MFA']] },
              { t: 'escribir', q: '¿Cómo se llama el servicio de AWS para gestionar usuarios y permisos? (3 letras)', ok: ['iam'], exp: 'IAM: Identity and Access Management.' }
            ]
          },
          {
            titulo: 'Reto: el bucket olvidado', icono: '🧺', reto: true, desc: 'Encuentra datos expuestos en la nube.',
            steps: [
              { t: 'teoria', titulo: 'Caso: Colegio Volcán (ficticio)', txt: `<p>El colegio te pidió revisar su almacenamiento en la nube. Sospechan que un respaldo quedó público en <code>https://cdn-colegiovolcan.example/respaldos/</code>.</p><p>Cuando un bucket es público, se puede <b>listar su contenido</b> con una simple petición web.</p>`, dato: 'Muchas filtraciones masivas de datos en el mundo empezaron con un bucket mal configurado.' },
              { t: 'terminal', q: '<b>Misión:</b> lista el contenido del bucket con <code>curl</code>, descarga el respaldo que encuentres y envía la bandera.', esc: { net: RED3 }, check: { flag: 'HA{bucket_public0_dat0s_expuest0s}' }, pista: 'curl https://cdn-colegiovolcan.example/respaldos/  y luego curl .../respaldo_notas_2026.sql', sol: ['curl https://cdn-colegiovolcan.example/respaldos/', 'curl https://cdn-colegiovolcan.example/respaldos/respaldo_notas_2026.sql'], exp: 'Un respaldo de notas de estudiantes, público para cualquiera. Hallazgo crítico: viola la protección de datos personales.' },
              { t: 'opcion', q: '¿Qué ley ecuatoriana se relaciona directamente con este hallazgo?', ops: ['Ley de Tránsito', 'Ley Orgánica de Protección de Datos Personales', 'Código de Trabajo', 'Ninguna'], ok: 1, exp: 'Exponer datos de estudiantes afecta su derecho a la protección de datos personales.' },
              { t: 'orden', q: 'Ordena la respuesta del colegio', items: ['Bloquear el acceso público al bucket', 'Revisar los registros para saber quién lo descargó', 'Evaluar el impacto y notificar según la ley', 'Activar alertas para detectar buckets públicos en el futuro'], exp: 'Contener, investigar, cumplir con la ley y prevenir.' },
              { t: 'vf', q: 'Como el bucket no estaba "hackeado", sino solo mal configurado, no es un incidente de seguridad.', ok: false, exp: 'Una configuración errónea que expone datos ES un incidente, aunque nadie haya "roto" nada.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 18: CARRERA =======================
      {
        titulo: 'Informes y carrera', icono: '🎓', desc: 'Escribir como profesional y tu ruta.',
        lessons: [
          {
            titulo: 'Escribir un hallazgo', icono: '✍️', desc: 'Lo que el cliente realmente lee.',
            steps: [
              { t: 'teoria', titulo: 'Anatomía de un hallazgo', txt: `<ol><li><b>Título</b> claro: "Inyección SQL en el buscador de productos".</li><li><b>Gravedad</b> (con CVSS): Crítica 9.8.</li><li><b>Descripción:</b> qué es la falla, en palabras simples.</li><li><b>Impacto:</b> qué podría pasarle al negocio.</li><li><b>Evidencia:</b> capturas y pasos para reproducirla.</li><li><b>Recomendación:</b> cómo arreglarla, concreta y priorizada.</li></ol>`, dato: 'El resumen ejecutivo es para gerentes: sin jerga técnica, enfocado en riesgo y dinero. Los detalles técnicos van después, para el equipo de TI.' },
              { t: 'orden', q: 'Ordena las partes de un hallazgo', items: ['Título', 'Gravedad (CVSS)', 'Descripción', 'Impacto', 'Evidencia', 'Recomendación'], exp: 'Del "qué es" al "cómo se arregla".' },
              { t: 'opcion', q: '¿Cuál es la MEJOR frase para un resumen ejecutivo?', ops: ['"Se explotó una SQLi con UNION-based payloads en el parámetro q"', '"Un atacante podría robar los datos de todos los clientes desde el buscador de la web. Se recomienda corregirlo esta semana."', '"Todo mal"', '"Ver anexo técnico"'], ok: 1, exp: 'Claro, enfocado en el impacto y con una acción concreta. Sin jerga.' },
              { t: 'parejas', q: 'Asigna la gravedad más adecuada', pares: [['Inyección SQL que expone todos los clientes', 'Crítica'], ['Panel interno sin contraseña', 'Alta'], ['Versión del servidor visible', 'Baja'], ['Falta un encabezado de seguridad menor', 'Informativa']] },
              { t: 'vf', q: 'Un buen informe solo dice qué está mal; cómo arreglarlo es trabajo del cliente.', ok: false, exp: 'Las recomendaciones concretas son la parte más valiosa del informe.' }
            ]
          },
          {
            titulo: 'Ruta de certificaciones', icono: '🗺️', desc: 'Qué estudiar después de HackAndes.',
            steps: [
              { t: 'teoria', titulo: 'Certificaciones reconocidas', txt: `<p><b>De entrada:</b></p><ul><li><b>CompTIA Security+</b>: fundamentos generales, muy pedida por empresas.</li><li><b>eJPT</b> (INE Security): pentesting práctico de entrada.</li><li><b>ISC2 CC</b> (Certified in Cybersecurity): fundamentos.</li></ul><p><b>Intermedias / avanzadas:</b></p><ul><li>Ofensiva: <b>PNPT</b> (TCM Security), <b>CEH</b> (EC-Council), <b>OSCP</b> (OffSec, muy práctica y exigente).</li><li>Defensiva: <b>CompTIA CySA+</b>, <b>BTL1</b> (Blue Team Level 1).</li></ul>`, dato: 'Los precios y condiciones cambian: revísalos siempre en la página oficial de cada certificación. Muchas tienen material de estudio gratuito.' },
              { t: 'teoria', titulo: 'Aprender gratis', txt: `<ul><li>Cursos de redes y ciberseguridad de <b>Cisco Networking Academy</b>.</li><li>Salas gratis de <b>TryHackMe</b> y laboratorios de <b>PortSwigger</b>.</li><li>Competencias <b>CTF</b>: picoCTF y otras.</li><li>Comunidades locales y de tu universidad: ¡únete o crea una!</li></ul>`, dato: 'Las empresas valoran tanto la práctica demostrable (CTF, laboratorios, write-ups) como los certificados.' },
              { t: 'parejas', q: 'Une cada certificación con su enfoque', pares: [['Security+', 'Fundamentos generales'], ['eJPT', 'Pentesting de entrada'], ['OSCP', 'Pentesting avanzado y práctico'], ['CySA+', 'Análisis defensivo (blue team)']] },
              { t: 'opcion', q: 'Quieres trabajar en un SOC. ¿Qué ruta tiene más sentido?', ops: ['OSCP primero', 'Fundamentos (Security+ o ISC2 CC) y luego una defensiva como CySA+ o BTL1', 'Solo ver videos', 'Ninguna'], ok: 1, exp: 'Fundamentos + certificación defensiva + práctica con un SIEM como Wazuh.' },
              { t: 'vf', q: 'Sin certificaciones es imposible conseguir trabajo en ciberseguridad.', ok: false, exp: 'Ayudan mucho, pero un portafolio con práctica real (CTF, laboratorios, proyectos) también abre puertas.' }
            ]
          },
          {
            titulo: 'Tu portafolio profesional', icono: '💼', desc: 'Cómo demostrar lo que sabes.',
            steps: [
              { t: 'teoria', titulo: 'Arma tu portafolio', txt: `<ul><li>📂 <b>GitHub:</b> publica tus scripts, herramientas y proyectos (¡como HackAndes!).</li><li>📝 <b>Write-ups:</b> explica cómo resolviste retos CTF (solo de retos ya cerrados o permitidos).</li><li>🧪 <b>Tu laboratorio:</b> documenta lo que armaste (Wazuh, Active Directory de práctica…).</li><li>💼 <b>LinkedIn:</b> comparte lo que aprendes, en español y luego en inglés.</li><li>🗣️ <b>Habilidades blandas:</b> comunicar riesgos con claridad vale tanto como lo técnico.</li></ul>`, dato: 'El inglés técnico abre la mayoría de oportunidades en ciberseguridad: documentación, certificaciones y trabajos remotos.' },
              { t: 'parejas', q: 'Une cada rol con lo que hace', pares: [['Analista SOC', 'Vigila y responde alertas'], ['Pentester', 'Ataca con permiso para encontrar fallas'], ['GRC', 'Políticas, riesgos y cumplimiento'], ['Forense digital', 'Investiga incidentes y evidencias']] },
              { t: 'opcion', q: '¿Qué NO deberías publicar en tu portafolio?', ops: ['Un write-up de un reto CTF ya cerrado', 'Vulnerabilidades reales de una empresa sin su permiso', 'El código de tu proyecto', 'Lo que aprendiste en tu laboratorio'], ok: 1, exp: 'Publicar fallas de terceros sin autorización es antiético y puede ser ilegal.' },
              { t: 'vf', q: 'Saber explicar un riesgo a alguien no técnico es una habilidad muy valorada.', ok: true, exp: 'Si el gerente no entiende el riesgo, no aprobará el presupuesto para arreglarlo.' },
              { t: 'orden', q: 'Ordena un plan realista para los próximos meses', items: ['Terminar HackAndes', 'Practicar en TryHackMe y CTFs', 'Armar y documentar tu laboratorio', 'Preparar una certificación de entrada', 'Postular a pasantías o empleos junior'], exp: '¡Paso a paso se llega lejos! 🚀' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 19: CTF FINAL =======================
      {
        titulo: 'CTF final: la prueba legendaria', icono: '🏴', desc: 'Todo lo que aprendiste, en un solo reto.',
        lessons: [
          {
            titulo: 'CTF · Fase 1: Reconocimiento', icono: '🛰️', reto: true, desc: 'Escaneo y enumeración web.',
            steps: [
              { t: 'teoria', titulo: 'La prueba legendaria', txt: `<p>La <b>Cooperativa Andina</b> (ficticia) te autorizó un pentest completo a su servidor <code>10.10.10.50</code>. Este es el reto final del curso: cuando lo termines, tu mascota alcanzará su <b>Fusión Legendaria</b>. ✨</p><p>Fases: <b>1)</b> reconocimiento → <b>2)</b> acceso y escalada → <b>3)</b> análisis defensivo e informe.</p>`, dato: 'Recuerda: alcance = solo 10.10.10.50.' },
              { t: 'terminal', q: '<b>Paso 1:</b> escanea el objetivo y descubre sus servicios.', esc: { net: RED3 }, check: { cmd: '^nmap', out: '80/tcp' }, pista: 'nmap -sV 10.10.10.50', sol: ['nmap -sV 10.10.10.50'], exp: 'SSH (22) y web nginx (80).' },
              { t: 'terminal', q: '<b>Paso 2:</b> enumera la web: página principal, robots.txt y lo que encuentres. Decodifica el archivo y envía la bandera.', esc: { net: RED3 }, check: { flag: 'HA{fase1_rec0n_c0mpleta}' }, pista: 'curl a la raíz → robots.txt → /dev/ → acceso.b64 → base64 -d', sol: ['curl http://10.10.10.50', 'curl http://10.10.10.50/robots.txt', 'curl http://10.10.10.50/dev/', 'curl http://10.10.10.50/dev/acceso.b64', 'echo "c3NoOiBvcGVyYWRvciAvIEFuZGVzI0N0ZjIwMjYKSEF7ZmFzZTFfcmVjMG5fYzBtcGxldGF9Cg==" | base64 -d'], exp: 'Encontraste credenciales SSH del usuario "operador" en un archivo de desarrollo. ¡Fase 1 completa!' },
              { t: 'escribir', q: '¿Qué usuario de SSH encontraste?', ok: ['operador'], exp: 'operador / Andes#Ctf2026.' },
              { t: 'opcion', q: '¿Qué técnicas de las unidades anteriores usaste?', ops: ['Solo phishing', 'Escaneo (nmap), enumeración web (robots.txt, comentarios) y decodificación Base64', 'Ransomware', 'Fuerza bruta'], ok: 1, exp: 'Redes, seguridad web y criptografía trabajando juntas.' }
            ]
          },
          {
            titulo: 'CTF · Fase 2: Acceso y escalada', icono: '🧗', reto: true, desc: 'De operador a root.',
            steps: [
              { t: 'teoria', titulo: 'Dentro del servidor', txt: `<p>Con las credenciales encontradas, iniciaste sesión por SSH como <code>operador</code>. Ahora toca <b>enumerar</b> y <b>escalar privilegios</b> para demostrar el impacto real.</p>`, dato: 'Lista mental: whoami, id, sudo -l, archivos de configuración, SUID.' },
              { t: 'terminal', q: '<b>Paso 3:</b> estás dentro como <code>operador</code>. Enumera: ¿quién eres?, ¿qué hay en tu carpeta?, ¿qué puedes correr con sudo? Lee la bandera de usuario.', esc: { user: 'operador', host: 'coop-srv', fs: { 'user.txt': 'HA{dentr0_c0m0_0perad0r}\n', 'notas.txt': 'Recordar: me dieron sudo para "find" para buscar los respaldos.\n' }, sudo: { list: '(root) NOPASSWD: /usr/bin/find', allow: '^find', shell: '-exec\\s+/bin/(ba)?sh' } }, check: { flag: 'HA{dentr0_c0m0_0perad0r}' }, pista: 'whoami, ls, cat user.txt, cat notas.txt, sudo -l', sol: ['whoami', 'ls', 'cat user.txt', 'cat notas.txt', 'sudo -l'], exp: 'Bandera de usuario conseguida. Y notas.txt confirma algo peligroso: find con sudo…' },
              { t: 'terminal', q: '<b>Paso 4:</b> escala a root usando lo que encontraste y lee <code>/root/root.txt</code>.', esc: { user: 'operador', host: 'coop-srv', fs: { '/root/root.txt': { _c: 'HA{r00t_en_la_c00perativa}\n', _r: 'root', _o: 'root' } }, sudo: { list: '(root) NOPASSWD: /usr/bin/find', allow: '^find', shell: '-exec\\s+/bin/(ba)?sh' } }, check: { flag: 'HA{r00t_en_la_c00perativa}' }, pista: 'sudo find . -exec /bin/sh \\; -quit', sol: ['sudo find . -exec /bin/sh \\; -quit', 'cat /root/root.txt'], exp: '¡ROOT! Demostraste el impacto completo: de un archivo olvidado en la web al control total del servidor.' },
              { t: 'orden', q: 'Ordena la cadena de ataque que lograste', items: ['robots.txt reveló /dev/', 'Credenciales en Base64 en /dev/', 'Acceso por SSH como operador', 'sudo mal configurado con find', 'Control total como root'], exp: 'Una cadena de errores pequeños = compromiso total. Romper cualquier eslabón habría detenido el ataque.' },
              { t: 'opcion', q: '¿Qué eslabón era el MÁS fácil de romper para la cooperativa?', ops: ['No tener un servidor', 'No dejar credenciales en archivos públicos de la web', 'Cambiar el puerto SSH', 'Usar otro sistema operativo'], ok: 1, exp: 'Sin esas credenciales expuestas, la cadena no empezaba.' }
            ]
          },
          {
            titulo: 'CTF · Fase 3: Defensa e informe', icono: '🏆', reto: true, desc: 'Cierra el ciclo como un profesional completo.',
            steps: [
              { t: 'teoria', titulo: 'Ahora, del lado azul', txt: `<p>Un profesional completo entiende <b>ambos lados</b>. El equipo de TI de la cooperativa te pide revisar sus logs para ver si alguien más (un atacante real) ya hizo lo mismo antes que tú.</p>`, dato: 'Esto se llama "assume breach": asumir que ya pudieron entrar y buscar evidencias.' },
              { t: 'terminal', q: '<b>Paso 5:</b> revisa <code>/var/log/nginx/access.log</code> y descubre qué otra IP (que no es la tuya, 10.10.10.99) descargó <code>acceso.b64</code>.', esc: { user: 'analista', fs: { '/var/log/nginx/access.log': '10.10.10.99 - - [24/Nov/2026:15:00:01] "GET /robots.txt HTTP/1.1" 200 41\n10.10.10.99 - - [24/Nov/2026:15:00:09] "GET /dev/acceso.b64 HTTP/1.1" 200 88\n181.39.22.140 - - [02/Nov/2026:03:12:44] "GET /robots.txt HTTP/1.1" 200 41\n181.39.22.140 - - [02/Nov/2026:03:12:51] "GET /dev/ HTTP/1.1" 200 120\n181.39.22.140 - - [02/Nov/2026:03:12:58] "GET /dev/acceso.b64 HTTP/1.1" 200 88\n190.152.4.21 - - [10/Nov/2026:11:20:00] "GET / HTTP/1.1" 200 5120\n' } }, check: { cmd: '^grep.*acceso', out: '181\\.39\\.22\\.140' }, pista: 'grep acceso.b64 /var/log/nginx/access.log', sol: ['grep acceso.b64 /var/log/nginx/access.log'], exp: 'Alguien desde 181.39.22.140 descargó las credenciales el 2 de noviembre a las 3 a. m. ¡Hay que activar la respuesta a incidentes!' },
              { t: 'escribir', q: '¿Qué IP descargó las credenciales antes que tú?', ok: ['181.39.22.140'], exp: 'Esa IP es un IoC: hay que buscarla en todos los logs (incluido el de SSH).' },
              { t: 'orden', q: 'Ordena las recomendaciones de tu informe final por prioridad', items: ['Cambiar YA la contraseña de "operador" e investigar accesos de 181.39.22.140', 'Eliminar /dev/ del servidor web y quitar la ruta de robots.txt', 'Quitar el permiso de sudo sobre find', 'Activar MFA para SSH y monitoreo con un SIEM', 'Capacitar al equipo en manejo seguro de secretos'], exp: 'Primero contener el posible compromiso real, luego cerrar las fallas y finalmente mejorar procesos.' },
              { t: 'opcion', q: '¿Cuál es la GRAVEDAD general del informe?', ops: ['Baja', 'Media', 'Crítica: compromiso total del servidor y evidencia de acceso previo de un tercero', 'Informativa'], ok: 2, exp: 'Root + credenciales ya descargadas por un desconocido = crítica.' },
              { t: 'vf', q: 'Completaste un ciclo profesional: reconocimiento, explotación, escalada, análisis defensivo e informe.', ok: true, exp: '🏆 ¡FELICIDADES! Terminaste HackAndes. Ahora eres capaz de pensar como atacante para proteger como defensor. ¡Prepárate para ver la Fusión Legendaria de tu mascota! ✨' }
            ]
          }
        ]
      }
    ],
    glosario: [
      ['Active Directory', 'Servicio de Microsoft para administrar usuarios, equipos y permisos de una organización.'],
      ['Análisis dinámico', 'Ejecutar una muestra de malware en un entorno aislado para observar su comportamiento.'],
      ['Análisis estático', 'Examinar un archivo sin ejecutarlo (tipo, hash, textos internos).'],
      ['Assume breach', 'Asumir que ya hubo una intrusión y buscar evidencias de ella.'],
      ['BloodHound', 'Herramienta que muestra rutas de ataque dentro de Active Directory.'],
      ['Bucket', 'Contenedor de almacenamiento en la nube.'],
      ['C2 (comando y control)', 'Servidor desde el que el atacante controla el malware.'],
      ['Cadena de custodia', 'Registro de quién manejó una evidencia, cuándo y para qué.'],
      ['CTF', 'Capture The Flag: competencia de retos de seguridad donde se buscan "banderas".'],
      ['CVE', 'Código único de una vulnerabilidad pública.'],
      ['CVSS', 'Escala de 0 a 10 que mide la gravedad de una vulnerabilidad.'],
      ['Doxxing', 'Reunir y publicar datos personales de alguien para dañarlo. No es ético.'],
      ['EDR', 'Herramienta de seguridad instalada en cada equipo para detectar comportamiento malicioso.'],
      ['Escalada de privilegios', 'Conseguir más permisos de los que se tienen (por ejemplo, llegar a root).'],
      ['Falso positivo / negativo', 'Alerta sin ataque real / ataque real sin alerta.'],
      ['Google dorks', 'Operadores de búsqueda avanzada (site:, filetype:, intitle:).'],
      ['GPO', 'Directiva de grupo: reglas que Active Directory aplica a los equipos.'],
      ['GTFOBins', 'Lista de programas de Linux que pueden abusarse si tienen permisos excesivos.'],
      ['IaaS / PaaS / SaaS', 'Modelos de nube: infraestructura, plataforma o software como servicio.'],
      ['IAM', 'Gestión de identidades y permisos en la nube.'],
      ['Imagen forense', 'Copia exacta bit a bit de un disco o memoria.'],
      ['IoC', 'Indicador de compromiso: huella de un ataque (IP, hash, dominio, proceso).'],
      ['John the Ripper / Hashcat', 'Herramientas para auditar contraseñas atacando sus hashes.'],
      ['Kerberoasting', 'Ataque que obtiene tickets de cuentas de servicio para romper su contraseña offline.'],
      ['Kerberos', 'Protocolo de autenticación con tickets usado en Active Directory.'],
      ['LAPS', 'Solución de Windows que da una clave única al administrador local de cada equipo.'],
      ['Metadatos', 'Datos sobre un archivo: autor, fecha, ubicación GPS, software.'],
      ['Metasploit', 'Framework con módulos de explotación usado en pruebas de penetración.'],
      ['NTP', 'Protocolo para sincronizar la hora de los equipos.'],
      ['Orden de volatilidad', 'Recolectar primero la evidencia que desaparece más rápido (RAM antes que disco).'],
      ['OSINT', 'Inteligencia de fuentes abiertas: investigar con información pública.'],
      ['Pass-the-hash', 'Usar un hash robado para autenticarse sin conocer la contraseña.'],
      ['Password spraying', 'Probar una contraseña común en muchos usuarios.'],
      ['Respuesta a incidentes', 'Proceso para preparar, detectar, contener, erradicar, recuperar y aprender de un ataque.'],
      ['Responsabilidad compartida', 'Modelo de la nube: el proveedor protege la infraestructura y el cliente sus datos y configuraciones.'],
      ['Reverse shell', 'Conexión en la que la víctima se conecta hacia el atacante y le entrega una terminal.'],
      ['Sandbox', 'Entorno aislado para ejecutar programas sospechosos sin riesgo.'],
      ['SIEM', 'Plataforma que junta y correlaciona logs para generar alertas.'],
      ['SOC', 'Centro de Operaciones de Seguridad: equipo que vigila y responde a ataques.'],
      ['SUID', 'Permiso que hace que un programa se ejecute con los privilegios de su dueño.'],
      ['Wordlist', 'Lista de palabras o contraseñas usada en ataques de diccionario.']
    ],
    tips: [
      'nmap -sV te da las versiones; las versiones te dan las vulnerabilidades.',
      'En Linux, revisa siempre sudo -l: un permiso mal dado puede entregar el sistema completo.',
      'Una foto puede revelar tu ubicación exacta por sus metadatos GPS.',
      'Ante un incidente, no apagues el equipo de golpe: la RAM guarda evidencia valiosa.',
      'Si subiste una clave a GitHub, borrarla no basta: revócala de inmediato.',
      'Un falso negativo (ataque sin alerta) es el peor escenario para un SOC.',
      'El informe es lo que el cliente paga: escribe para gerentes y para técnicos.',
      'Wazuh es un SIEM gratuito que puedes instalar en tu laboratorio para practicar blue team.',
      'Evento 4625 en Windows = inicio de sesión fallido. Muchos seguidos = posible ataque.',
      'El inglés técnico te abre la puerta a certificaciones y trabajos remotos en ciberseguridad.'
    ]
  });
})();
