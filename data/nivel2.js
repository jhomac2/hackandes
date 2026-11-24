/* ============================================================
   NIVEL 2 · INTERMEDIO — "Ya entiendo cómo funciona"
   ============================================================ */
(function () {
  // Red de práctica compartida por varias misiones
  const RED = {
    ip: '192.168.1.15',
    hosts: { '192.168.1.1': 'router', '8.8.8.8': 'dns', 'google.com': '142.250.78.14', 'espe.edu.ec': '190.15.130.10', '10.10.10.5': 'objetivo', 'tienda.local': '10.10.10.20' },
    dns: { 'google.com': '142.250.78.14', 'espe.edu.ec': '190.15.130.10', 'tienda.local': '10.10.10.20', 'hackandes.local': '10.10.10.5' },
    nmap: {
      '192.168.1.1': [[53, 'open', 'domain', 'dnsmasq 2.90'], [80, 'open', 'http', 'lighttpd 1.4.76'], [443, 'open', 'https', 'lighttpd 1.4.76']],
      '10.10.10.5': [[22, 'open', 'ssh', 'OpenSSH 9.6p1 Ubuntu'], [80, 'open', 'http', 'Apache httpd 2.4.58']],
      '10.10.10.20': [[80, 'open', 'http', 'nginx 1.24.0'], [3306, 'open', 'mysql', 'MySQL 8.0.36']],
      '192.168.1.0/24': 'Nmap scan report for 192.168.1.1 (router)\nHost is up.\nNmap scan report for 192.168.1.15 (tu-pc)\nHost is up.\nNmap scan report for 192.168.1.23 (celular-de-ana)\nHost is up.\nNmap scan report for 192.168.1.40 (camara-wifi)\nHost is up.\n\nNmap terminado: 256 direcciones IP (4 equipos activos)'
    },
    web: {
      'http://tienda.local': '<html>\n<head><title>Tienda El Cuy Feliz</title></head>\n<body>\n  <h1>Bienvenido a la tienda</h1>\n  <!-- TODO: borrar el panel de pruebas /admin-viejo antes de publicar -->\n  <a href="/productos">Ver productos</a>\n</body>\n</html>\n',
      'http://tienda.local/robots.txt': 'User-agent: *\nDisallow: /admin-viejo/\n',
      'http://tienda.local/admin-viejo/': 'Panel de pruebas (sin contraseña 😱)\nHA{l0s_c0mentari0s_hablan}\n',
      'http://tienda.local/pedido?id=1001': '{"pedido": 1001, "cliente": "Estudiante", "producto": "Audífonos", "direccion": "Latacunga"}\n',
      'http://tienda.local/pedido?id=1002': '{"pedido": 1002, "cliente": "María P.", "producto": "Laptop", "direccion": "Av. Amazonas, Quito", "telefono": "099*******"}\nHA{id0r_acces0_r0t0}\n',
      'http://10.10.10.5': '<html><body><h1>Servidor de pruebas - Colegio Volcán (ficticio)</h1></body></html>\n',
      'http://10.10.10.5/robots.txt': 'User-agent: *\nDisallow: /respaldo/\n',
      'http://10.10.10.5/respaldo/': 'Índice de /respaldo/\n  credenciales.txt\n  notas.txt\n',
      'http://10.10.10.5/respaldo/notas.txt': 'Recordatorio: codifiqué las credenciales en Base64 para que "nadie las lea" :)\n',
      'http://10.10.10.5/respaldo/credenciales.txt': 'dXN1YXJpbzogYWRtaW4KY2xhdmU6IFZvbGNhbjIwMjYhCkhBe3JvYm90c190eHRfcmV2ZWxhX3NlY3JldG9zfQo=\n'
    }
  };
  const HOME = {
    'Documentos': { 'tarea_redes.txt': 'Investigar el modelo OSI y las capas TCP/IP.\n', 'horario.txt': 'Lunes: Programación\nMartes: Redes\nMiércoles: Matemática\n' },
    'Descargas': { 'foto.jpg': 'JFIF...(imagen)', 'virus.exe': 'MZ... programa sospechoso' },
    'Escritorio': {},
    '.secreto': 'HA{l0s_archiv0s_0cult0s_empiezan_c0n_punt0}\n'
  };
  const LOG = 'Nov 24 08:01:12 servidor sshd[1201]: Accepted password for profesor from 192.168.1.23\n'
    + 'Nov 24 08:15:40 servidor sshd[1210]: Failed password for root from 45.83.12.7\n'
    + 'Nov 24 08:15:42 servidor sshd[1210]: Failed password for root from 45.83.12.7\n'
    + 'Nov 24 08:15:44 servidor sshd[1210]: Failed password for admin from 45.83.12.7\n'
    + 'Nov 24 08:15:47 servidor sshd[1210]: Failed password for admin from 45.83.12.7\n'
    + 'Nov 24 08:15:49 servidor sshd[1210]: Failed password for root from 45.83.12.7\n'
    + 'Nov 24 09:02:03 servidor sshd[1302]: Failed password for estudiante from 192.168.1.40\n'
    + 'Nov 24 09:02:10 servidor sshd[1302]: Accepted password for estudiante from 192.168.1.40\n'
    + 'Nov 24 09:30:00 servidor CRON[1400]: (root) CMD (respaldo.sh) # HA{grep_encuentra_t0d0}\n';

  HA.addLevel({
    n: 2, id: 'n2', nombre: 'Manos a la obra', sub: 'Intermedio · Ya entiendo cómo funciona',
    units: [
      // ======================= UNIDAD 6: REDES =======================
      {
        titulo: 'Redes a fondo', icono: '🌐', desc: 'IP, puertos, protocolos, DNS, OSI y Wi-Fi.',
        lessons: [
          {
            titulo: 'Direcciones IP y MAC', icono: '📍', desc: 'La "dirección de casa" de cada equipo.',
            steps: [
              { t: 'teoria', titulo: 'La dirección IP', txt: `<p>Cada equipo en una red tiene una <b>dirección IP</b>, como la dirección de una casa. Así los datos saben a dónde ir.</p><p>Una IPv4 tiene <b>4 números del 0 al 255</b> separados por puntos: <code>192.168.1.15</code>. (Recuerda: con 8 bits el máximo es 255.)</p><ul><li><b>IP privada:</b> dentro de tu casa o empresa. Rangos: <code>192.168.x.x</code>, <code>10.x.x.x</code> y <code>172.16.x.x</code> a <code>172.31.x.x</code>.</li><li><b>IP pública:</b> la que te da tu proveedor de internet para salir al mundo.</li><li><code>127.0.0.1</code> es <b>localhost</b>: tu propio equipo.</li></ul>`, dato: 'Hay tantos equipos en el mundo que las IPv4 se acabaron. Por eso existe IPv6, con direcciones mucho más largas como 2800:370:1a4::5.' },
              { t: 'teoria', titulo: 'La dirección MAC', txt: `<p>La <b>MAC</b> es el "número de serie" de la tarjeta de red. Viene de fábrica y se escribe en hexadecimal: <code>3c:22:fb:9a:10:4e</code>.</p><ul><li><b>IP</b> → puede cambiar según la red a la que te conectes (como tu dirección cuando te mudas).</li><li><b>MAC</b> → identifica al aparato (como tu número de cédula).</li></ul>`, dato: 'Los celulares modernos usan una MAC aleatoria en cada red Wi-Fi para que no puedan rastrearte de un lugar a otro.' },
              { t: 'terminal', q: '<b>Misión:</b> averigua la IP de esta computadora. Escribe <code>ip a</code> y presiona Enter.', esc: { net: RED }, check: { cmd: '^(ip a|ip addr|ifconfig)' }, pista: 'Escribe exactamente: ip a', sol: ['ip a'], exp: 'En <code>wlan0</code> aparece <b>inet 192.168.1.15</b>: esa es tu IP privada en la red Wi-Fi. En Windows el comando equivalente es <code>ipconfig</code>.' },
              { t: 'opcion', q: '¿Cuál de estas IP es <b>privada</b>?', ops: ['8.8.8.8', '192.168.0.10', '190.15.130.10', '142.250.78.14'], ok: 1, exp: 'Todo lo que empieza con 192.168 es privado: solo existe dentro de una red local.' },
              { t: 'vf', q: 'La dirección <code>192.168.1.300</code> es una IP válida.', ok: false, exp: 'Cada número va de 0 a 255 (8 bits). 300 no cabe.' },
              { t: 'parejas', q: 'Une cada concepto', pares: [['IP pública', 'La que te da tu proveedor de internet'], ['IP privada', 'Solo funciona dentro de tu red'], ['127.0.0.1', 'Tu propio equipo (localhost)'], ['MAC', 'Identificador de la tarjeta de red']] },
              { t: 'escribir', q: '¿Cómo se llama la dirección <code>127.0.0.1</code>?', ok: ['localhost', 'local host'], exp: 'localhost = "este mismo equipo".' }
            ]
          },
          {
            titulo: 'Puertos y protocolos', icono: '🚪', desc: 'Las puertas de cada servicio.',
            steps: [
              { t: 'teoria', titulo: 'Los puertos', txt: `<p>Si la IP es la dirección de un edificio, los <b>puertos</b> son las <b>puertas de cada oficina</b>. Un servidor puede ofrecer varios servicios a la vez, cada uno en su puerto (del 0 al 65535).</p><table class="tabla"><tr><th>Puerto</th><th>Servicio</th></tr><tr><td>22</td><td>SSH (control remoto seguro)</td></tr><tr><td>53</td><td>DNS</td></tr><tr><td>80</td><td>HTTP (web)</td></tr><tr><td>443</td><td>HTTPS (web segura)</td></tr><tr><td>21</td><td>FTP (archivos)</td></tr><tr><td>3389</td><td>RDP (escritorio remoto de Windows)</td></tr><tr><td>3306</td><td>MySQL (base de datos)</td></tr></table>`, dato: 'Cada puerto abierto es una puerta por la que un atacante puede intentar entrar. Regla de oro: cierra lo que no uses.' },
              { t: 'teoria', titulo: 'TCP y UDP', txt: `<ul><li><b>TCP:</b> confiable. Confirma que cada paquete llegó y los ordena. Se usa en la web, correo y descargas. Empieza con un "saludo de 3 pasos": <b>SYN → SYN-ACK → ACK</b>.</li><li><b>UDP:</b> rápido pero sin confirmación. Se usa en videollamadas, juegos en línea y DNS: si se pierde un pedacito, no importa tanto.</li></ul>`, dato: 'Cuando en una videollamada la imagen se "congela" un segundo y salta, son paquetes UDP que se perdieron. Con TCP esperaría... y sería peor.' },
              { t: 'parejas', q: 'Une cada puerto con su servicio', pares: [['22', 'SSH'], ['80', 'HTTP'], ['443', 'HTTPS'], ['53', 'DNS'], ['3389', 'Escritorio remoto (RDP)']] },
              { t: 'orden', q: 'Ordena el saludo de 3 pasos de TCP', items: ['SYN: "¿Hablamos?"', 'SYN-ACK: "Sí, hablemos"', 'ACK: "Perfecto, empezamos"'], exp: 'SYN → SYN-ACK → ACK. Después de esto, la conexión queda establecida.' },
              { t: 'opcion', q: '¿Qué protocolo usarías para una videollamada en vivo?', ops: ['TCP, porque es más confiable', 'UDP, porque es más rápido', 'FTP', 'Ninguno'], ok: 1, exp: 'En tiempo real importa la velocidad. Perder un cuadro de video es mejor que esperar.' },
              { t: 'vf', q: 'Tener el puerto 3389 (escritorio remoto) abierto a todo internet es una buena práctica.', ok: false, exp: 'RDP expuesto es una de las entradas favoritas del ransomware. Si se necesita, debe ir detrás de una VPN y con contraseñas fuertes.' },
              { t: 'escribir', q: '¿Qué puerto usa HTTPS?', ok: ['443'], ph: 'Número de puerto', exp: 'HTTPS → 443. HTTP → 80.' }
            ]
          },
          {
            titulo: 'DNS: la guía telefónica', icono: '📒', desc: 'Cómo un nombre se convierte en IP.',
            steps: [
              { t: 'teoria', titulo: '¿Qué es el DNS?', txt: `<p>Las computadoras usan IP, pero las personas recordamos nombres. El <b>DNS</b> (Sistema de Nombres de Dominio) traduce <code>espe.edu.ec</code> → <code>190.15.130.10</code>.</p><p>Es como la guía de contactos de tu celular: buscas "Mamá" y el teléfono marca el número.</p><p>Partes de un dominio: <code>www.espe.edu.ec</code> → <code>.ec</code> es el país (Ecuador), <code>.edu</code> educación, <code>espe</code> la institución.</p>`, dato: 'Si un atacante cambia las respuestas del DNS (DNS spoofing), escribes la dirección correcta del banco pero llegas a un sitio falso.' },
              { t: 'terminal', q: '<b>Misión:</b> pregunta al DNS la IP de la ESPE con <code>host espe.edu.ec</code>', esc: { net: RED }, check: { cmd: '^host\\s+espe\\.edu\\.ec', out: 'has address' }, pista: 'host + espacio + el dominio', sol: ['host espe.edu.ec'], exp: 'El DNS respondió con la IP del servidor. Ahora tu navegador ya sabe a dónde ir.' },
              { t: 'terminal', q: '<b>Misión:</b> comprueba si el router (<code>192.168.1.1</code>) responde con <code>ping</code>.', esc: { net: RED }, check: { cmd: '^ping\\s+192\\.168\\.1\\.1', out: '0% de pérdida' }, pista: 'ping 192.168.1.1', sol: ['ping 192.168.1.1'], exp: 'Recibiste 4 respuestas: el router está vivo. Ping es la primera prueba para saber si un equipo está conectado.' },
              { t: 'opcion', q: '¿Qué hace el DNS?', ops: ['Cifra tu conexión', 'Traduce nombres de dominio a direcciones IP', 'Bloquea virus', 'Asigna la MAC'], ok: 1, exp: 'DNS = la guía telefónica de internet.' },
              { t: 'opcion', q: 'En <code>www.espe.edu.ec</code>, ¿qué indica <code>.ec</code>?', ops: ['Educación', 'Ecuador', 'Empresa comercial', 'Correo'], ok: 1, exp: '.ec es el dominio de país de Ecuador.' },
              { t: 'vf', q: 'Si el DNS es manipulado, puedes terminar en una página falsa aunque escribas bien la dirección.', ok: true, exp: 'Por eso HTTPS es importante: el certificado del sitio falso no coincidiría y el navegador te avisaría.' }
            ]
          },
          {
            titulo: 'Modelo OSI, Wi-Fi y escaneo', icono: '📡', desc: 'Las 7 capas y tu primer nmap.',
            steps: [
              { t: 'teoria', titulo: 'El modelo OSI', txt: `<p>Para entender las redes, se dividen en <b>7 capas</b>. Cada una tiene un trabajo:</p><ol><li><b>Física:</b> cables, ondas Wi-Fi, señales.</li><li><b>Enlace de datos:</b> direcciones MAC, switches.</li><li><b>Red:</b> direcciones IP, routers.</li><li><b>Transporte:</b> TCP y UDP, puertos.</li><li><b>Sesión:</b> abre y cierra conversaciones.</li><li><b>Presentación:</b> formato y cifrado de datos.</li><li><b>Aplicación:</b> lo que usas: HTTP, DNS, correo.</li></ol>`, dato: 'Truco para recordar de abajo hacia arriba: "Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación" → "Fea Enana Roja Trae Su Propia Aplicación".' },
              { t: 'teoria', titulo: 'Wi-Fi seguro y escaneo de redes', txt: `<ul><li><b>WEP:</b> roto, se descifra en minutos. ❌</li><li><b>WPA2:</b> aceptable con una clave larga.</li><li><b>WPA3:</b> el más seguro actualmente. ✅</li></ul><p>En redes Wi-Fi públicas (aeropuerto, centro comercial) cualquiera en la misma red podría espiar tráfico sin cifrar. Usa HTTPS o una <b>VPN</b> de confianza.</p><p><b>Nmap</b> es la herramienta para descubrir equipos y puertos abiertos en una red. ⚠️ Solo úsala en redes tuyas o con permiso.</p>`, ec: 'Muchos routers que instalan los proveedores en Ecuador vienen con la clave escrita en una etiqueta. Cámbiala por una frase larga y usa WPA2 o WPA3.' },
              { t: 'orden', q: 'Ordena las capas OSI de ABAJO (1) hacia ARRIBA (7)', items: ['Física', 'Enlace de datos', 'Red', 'Transporte', 'Sesión', 'Presentación', 'Aplicación'], exp: 'Física → Enlace → Red → Transporte → Sesión → Presentación → Aplicación.' },
              { t: 'parejas', q: '¿En qué capa trabaja cada cosa?', pares: [['Dirección IP', 'Red'], ['Puertos TCP/UDP', 'Transporte'], ['Dirección MAC', 'Enlace de datos'], ['HTTP', 'Aplicación'], ['Cable de red', 'Física']] },
              { t: 'terminal', q: '<b>Misión (en tu red de práctica):</b> escanea el router con <code>nmap 192.168.1.1</code> y descubre qué puertos tiene abiertos.', esc: { net: RED }, check: { cmd: '^nmap', out: '80/tcp' }, pista: 'nmap seguido de la IP del router', sol: ['nmap 192.168.1.1'], exp: 'El router tiene abiertos 53 (DNS), 80 (HTTP) y 443 (HTTPS). Prueba también <code>nmap -sV</code> para ver las versiones.' },
              { t: 'terminal', q: '<b>Misión:</b> descubre cuántos equipos hay en toda la red con <code>nmap 192.168.1.0/24</code>. ¿Ves algún equipo que no debería estar?', esc: { net: RED }, check: { cmd: '^nmap', out: 'equipos activos' }, pista: 'El /24 significa "las 256 direcciones de 192.168.1.0 a 192.168.1.255"', sol: ['nmap 192.168.1.0/24'], exp: 'Hay 4 equipos: el router, tu PC, el celular de Ana y una cámara Wi-Fi. Conocer tu red es el primer paso para defenderla.' },
              { t: 'opcion', q: '¿Qué tipo de seguridad Wi-Fi es la MÁS segura hoy?', ops: ['WEP', 'WPA', 'WPA2', 'WPA3'], ok: 3, exp: 'WPA3 es el estándar más reciente. WEP nunca debe usarse.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 7: LINUX =======================
      {
        titulo: 'Linux y terminal', icono: '🐧', desc: 'Moverte como un hacker en la línea de comandos.',
        lessons: [
          {
            titulo: 'Primeros pasos: pwd, ls, cd', icono: '👣', desc: 'Saber dónde estás y moverte.',
            steps: [
              { t: 'teoria', titulo: '¿Por qué la terminal?', txt: `<p>La <b>terminal</b> (o consola) es una forma de controlar la computadora escribiendo comandos. Los hackers éticos y los administradores la usan todo el tiempo porque es <b>rápida, potente y automatizable</b>.</p><p>Los 3 comandos para moverte:</p><ul><li><code>pwd</code> → ¿dónde estoy? (print working directory)</li><li><code>ls</code> → ¿qué hay aquí? (list)</li><li><code>cd carpeta</code> → entrar a una carpeta (change directory). <code>cd ..</code> sube un nivel.</li></ul>`, dato: 'En Linux todo empieza en la raíz <code>/</code>. Tu carpeta personal está en <code>/home/tu_usuario</code> y su atajo es <code>~</code>.' },
              { t: 'terminal', q: '<b>Misión 1:</b> averigua en qué carpeta estás con <code>pwd</code>', esc: { fs: HOME }, check: { cmd: '^pwd\\s*$' }, sol: ['pwd'], exp: 'Estás en <code>/home/estudiante</code>: tu carpeta personal.' },
              { t: 'terminal', q: '<b>Misión 2:</b> mira qué carpetas hay con <code>ls</code>', esc: { fs: HOME }, check: { cmd: '^ls', out: 'Documentos' }, sol: ['ls'], exp: 'Ves Descargas, Documentos y Escritorio. Las carpetas aparecen en azul.' },
              { t: 'terminal', q: '<b>Misión 3:</b> entra a la carpeta <code>Documentos</code> y lista lo que tiene.', esc: { fs: HOME }, check: { cwd: '/home/estudiante/Documentos', cmd: '^ls' }, pista: 'Primero cd Documentos, después ls', sol: ['cd Documentos', 'ls'], exp: '¡Bien! Ojo: Linux distingue mayúsculas: <code>documentos</code> no es lo mismo que <code>Documentos</code>.' },
              { t: 'terminal', q: '<b>Misión 4:</b> estás dentro de Documentos. Regresa a la carpeta anterior con <code>cd ..</code>', esc: { fs: HOME, cwd: '/home/estudiante/Documentos' }, check: { cwd: '/home/estudiante' }, sol: ['cd ..'], exp: '<code>..</code> siempre significa "la carpeta de arriba".' },
              { t: 'terminal', q: '<b>Misión 5:</b> hay un archivo <b>oculto</b> en tu carpeta. Los ocultos empiezan con punto y solo se ven con <code>ls -la</code>. Léelo con <code>cat</code> y envía la bandera.', esc: { fs: HOME }, check: { flag: 'HA{l0s_archiv0s_0cult0s_empiezan_c0n_punt0}' }, pista: 'ls -la para verlo, luego cat .secreto', sol: ['ls -la', 'cat .secreto'], exp: 'Los atacantes (y los defensores) siempre revisan los archivos ocultos: ahí suelen esconderse configuraciones y secretos.' },
              { t: 'parejas', q: 'Une cada comando con lo que hace', pares: [['pwd', 'Muestra dónde estás'], ['ls', 'Lista archivos'], ['cd ..', 'Sube una carpeta'], ['ls -la', 'Lista incluso ocultos']] }
            ]
          },
          {
            titulo: 'Crear, copiar, mover y borrar', icono: '🗂️', desc: 'cat, mkdir, touch, cp, mv, rm y echo.',
            steps: [
              { t: 'teoria', titulo: 'Manejar archivos', txt: `<ul><li><code>cat archivo</code> → muestra el contenido.</li><li><code>mkdir carpeta</code> → crea una carpeta.</li><li><code>touch archivo</code> → crea un archivo vacío.</li><li><code>cp origen destino</code> → copia.</li><li><code>mv origen destino</code> → mueve o cambia el nombre.</li><li><code>rm archivo</code> → borra (¡no hay papelera!). Para carpetas: <code>rm -r</code>.</li><li><code>echo "texto" &gt; archivo</code> → escribe texto en un archivo.</li></ul>`, dato: 'En la terminal, rm borra para siempre. Por eso los profesionales piensan dos veces antes de presionar Enter.' },
              { t: 'terminal', q: '<b>Misión:</b> muestra tu horario con <code>cat Documentos/horario.txt</code>. ¿Qué materia toca el martes?', esc: { fs: HOME }, check: { cmd: '^cat\\s+.*horario', out: 'Martes' }, sol: ['cat Documentos/horario.txt'], exp: 'El martes toca Redes. Puedes leer archivos de otra carpeta escribiendo la ruta completa.' },
              { t: 'terminal', q: '<b>Misión:</b> crea una carpeta llamada <code>proyecto</code>', esc: { fs: HOME }, check: { existe: '/home/estudiante/proyecto' }, sol: ['mkdir proyecto'], exp: 'Carpeta creada. Compruébalo con <code>ls</code>.' },
              { t: 'terminal', q: '<b>Misión:</b> crea un archivo <code>saludo.txt</code> que diga <b>Hola ESPE</b> usando <code>echo</code>.', esc: { fs: HOME }, check: { contiene: ['/home/estudiante/saludo.txt', 'hola espe'] }, pista: 'echo "Hola ESPE" > saludo.txt', sol: ['echo "Hola ESPE" > saludo.txt', 'cat saludo.txt'], exp: 'El símbolo <code>&gt;</code> guarda la salida de un comando en un archivo. Con <code>&gt;&gt;</code> lo agregas al final sin borrar lo anterior.' },
              { t: 'terminal', q: '<b>Misión:</b> mueve <code>Descargas/foto.jpg</code> a la carpeta <code>Escritorio</code>.', esc: { fs: HOME }, check: { existe: '/home/estudiante/Escritorio/foto.jpg' }, pista: 'mv Descargas/foto.jpg Escritorio', sol: ['mv Descargas/foto.jpg Escritorio'], exp: '¡Movido! mv también sirve para renombrar: <code>mv viejo.txt nuevo.txt</code>.' },
              { t: 'terminal', q: '<b>Misión:</b> en Descargas hay un <code>virus.exe</code> sospechoso. Revisa qué es con <code>file</code> y bórralo con <code>rm</code>.', esc: { fs: HOME }, check: { noexiste: '/home/estudiante/Descargas/virus.exe' }, pista: 'file Descargas/virus.exe y luego rm Descargas/virus.exe', sol: ['file Descargas/virus.exe', 'rm Descargas/virus.exe'], exp: '<code>file</code> te dice el tipo REAL del archivo (aquí, un ejecutable de Windows). Luego lo eliminaste.' },
              { t: 'opcion', q: '¿Qué comando CAMBIA EL NOMBRE de un archivo?', ops: ['cp', 'mv', 'rm', 'cat'], ok: 1, exp: 'mv mueve... y mover a un nombre nuevo es renombrar.' }
            ]
          },
          {
            titulo: 'Permisos, usuarios y root', icono: '👑', desc: 'rwx, chmod y sudo.',
            steps: [
              { t: 'teoria', titulo: 'Los permisos rwx', txt: `<p>Con <code>ls -l</code> verás algo como <code>-rwxr-xr--</code>. Se lee en grupos de 3:</p><ul><li><b>r</b> = leer · <b>w</b> = escribir · <b>x</b> = ejecutar · <b>-</b> = no tiene ese permiso</li></ul><p><code>-</code> <b>rwx</b> <b>r-x</b> <b>r--</b> → el primer carácter es el tipo (<code>-</code> archivo, <code>d</code> carpeta). Luego: <b>dueño</b> · <b>grupo</b> · <b>otros</b>.</p><p>Se cambian con <code>chmod</code>. Ej: <code>chmod +x script.sh</code> le da permiso de ejecutar.</p>`, dato: 'También se usan números: r=4, w=2, x=1. Así, 755 = rwx (7) r-x (5) r-x (5).' },
              { t: 'teoria', titulo: 'root y sudo', txt: `<p><b>root</b> es el superusuario: puede hacer TODO en el sistema. Por seguridad, se trabaja con un usuario normal y solo se usa <code>sudo</code> ("hazlo como root") cuando hace falta.</p><p>Un archivo importantísimo: <code>/etc/shadow</code> guarda los <b>hashes</b> de las contraseñas. Solo root puede leerlo.</p>`, dato: 'Uno de los objetivos de un atacante es "escalar privilegios": pasar de usuario normal a root. Lo verás en el Nivel 3.' },
              { t: 'opcion', q: 'En <code>-rw-r--r--</code>, ¿qué puede hacer el DUEÑO?', ops: ['Solo leer', 'Leer y escribir', 'Leer, escribir y ejecutar', 'Nada'], ok: 1, exp: 'El primer grupo después del tipo es rw- → leer y escribir, pero no ejecutar.' },
              { t: 'terminal', q: '<b>Misión:</b> el archivo <code>respaldo.sh</code> no se puede ejecutar. Dale permiso de ejecución con <code>chmod +x</code>.', esc: { fs: { 'respaldo.sh': { _c: '#!/bin/bash\necho "Respaldando..."\n', _m: '-rw-r--r--' } } }, check: { modo: ['/home/estudiante/respaldo.sh', 'x'] }, pista: 'chmod +x respaldo.sh y luego ls -l', sol: ['chmod +x respaldo.sh', 'ls -l'], exp: 'Ahora dice <code>-rwxr-xr-x</code> y aparece en verde: es ejecutable.' },
              { t: 'terminal', q: '<b>Misión:</b> intenta leer <code>/etc/shadow</code> con cat. Te van a negar el permiso… usa <code>sudo</code> para leerlo como root.', esc: { sudo: { list: '(ALL : ALL) ALL', allow: '.*' } }, check: { cmd: '^sudo\\s+cat\\s+/etc/shadow', out: 'root:' }, pista: 'sudo cat /etc/shadow', sol: ['cat /etc/shadow', 'sudo cat /etc/shadow'], exp: 'Con sudo lo lograste. Mira: no aparece la contraseña, sino su HASH ($6$... = SHA-512 con sal). ¡Como en HackAndes!' },
              { t: 'parejas', q: 'Une cada permiso', pares: [['r', 'Leer'], ['w', 'Escribir'], ['x', 'Ejecutar'], ['755', 'rwxr-xr-x'], ['root', 'Superusuario']] },
              { t: 'vf', q: 'Es buena práctica trabajar todo el día como root para no tener problemas de permisos.', ok: false, exp: 'Si un malware se ejecuta mientras eres root, tendrá control total. Principio de mínimo privilegio: usa root solo cuando haga falta.' }
            ]
          },
          {
            titulo: 'Reto: buscar como hacker', icono: '🔎', reto: true, desc: 'grep, find y tuberías.',
            steps: [
              { t: 'teoria', titulo: 'grep, find y la tubería |', txt: `<ul><li><code>grep palabra archivo</code> → muestra las líneas que contienen esa palabra. Opciones: <code>-i</code> (sin importar mayúsculas), <code>-c</code> (contar), <code>-r</code> (buscar en todas las carpetas).</li><li><code>find . -name "*.txt"</code> → busca archivos por nombre.</li><li><code>|</code> (tubería) → pasa la salida de un comando al siguiente. Ej: <code>cat log | grep Failed | wc -l</code> cuenta cuántas líneas tienen "Failed".</li></ul>`, dato: 'Los analistas de seguridad usan grep todos los días para encontrar ataques en archivos de registro (logs) con millones de líneas.' },
              { t: 'terminal', q: '<b>Misión:</b> en <code>/var/log/auth.log</code> están los inicios de sesión del servidor. Muestra solo los intentos fallidos con <code>grep Failed</code>.', esc: { fs: { '/var/log/auth.log': LOG } }, check: { cmd: '^grep.*Failed', out: 'Failed password' }, pista: 'grep Failed /var/log/auth.log', sol: ['grep Failed /var/log/auth.log'], exp: 'Hay muchos fallos seguidos desde la misma IP probando "root" y "admin": es un ataque de fuerza bruta.' },
              { t: 'terminal', q: '<b>Misión:</b> cuenta cuántos intentos fallidos vinieron de la IP <code>45.83.12.7</code> usando <code>grep -c</code>.', esc: { fs: { '/var/log/auth.log': LOG } }, check: { cmd: '^grep\\s+-c', out: '^5' }, pista: 'grep -c 45.83.12.7 /var/log/auth.log', sol: ['grep -c 45.83.12.7 /var/log/auth.log'], exp: '5 intentos en 9 segundos: claramente un script automático. Esa IP debería bloquearse.' },
              { t: 'escribir', q: 'Según el log, ¿qué IP hizo el ataque de fuerza bruta?', ok: ['45.83.12.7'], ph: 'Ej: 1.2.3.4', exp: '45.83.12.7: la que acumuló intentos fallidos contra root y admin.' },
              { t: 'terminal', q: '<b>Misión:</b> hay una bandera escondida en el log. Búscala con grep (todas las banderas empiezan con <code>HA{</code>).', esc: { fs: { '/var/log/auth.log': LOG } }, check: { flag: 'HA{grep_encuentra_t0d0}' }, pista: 'grep HA /var/log/auth.log', sol: ['grep HA /var/log/auth.log'], exp: '¡Encontrada! grep es tu mejor amigo para buscar agujas en pajares.' },
              { t: 'terminal', q: '<b>Misión final:</b> en algún lugar de tu carpeta hay un archivo llamado <code>pista.txt</code>. Encuéntralo con <code>find</code>, léelo y envía la bandera.', esc: { fs: { 'fotos': { 'paseo': {}, 'familia': {} }, 'tareas': { 'redes': { 'semana3': { 'pista.txt': '¡Lo lograste! HA{find_l0_encuentra_t0d0}\n' } } }, 'musica': {} } }, check: { flag: 'HA{find_l0_encuentra_t0d0}' }, pista: 'find . -name pista.txt y luego cat con la ruta que te dé', sol: ['find . -name pista.txt', 'cat tareas/redes/semana3/pista.txt'], exp: 'find te ahorra abrir carpeta por carpeta. ¡Dominaste la terminal básica!' },
              { t: 'opcion', q: '¿Qué hace el símbolo <code>|</code> en <code>cat log | grep Failed</code>?', ops: ['Borra el archivo', 'Pasa la salida del primer comando al segundo', 'Guarda en un archivo', 'Ejecuta como root'], ok: 1, exp: 'La tubería conecta comandos: la salida de uno es la entrada del siguiente.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 8: CRIPTOGRAFÍA =======================
      {
        titulo: 'Criptografía', icono: '🔐', desc: 'Codificar, cifrar, hashear y firmar.',
        lessons: [
          {
            titulo: 'Codificar no es cifrar', icono: '🏛️', desc: 'César, Base64 y la gran confusión.',
            steps: [
              { t: 'teoria', titulo: 'Tres cosas distintas', txt: `<ul><li>🔤 <b>Codificar:</b> cambiar la forma de escribir los datos. <b>No hay secreto</b>: cualquiera lo revierte. Ej: Base64, binario.</li><li>🔐 <b>Cifrar:</b> esconder el mensaje con una <b>clave</b>. Sin la clave no se puede leer. Ej: AES.</li><li>#️⃣ <b>Hash:</b> una "huella" de una sola vía: no se puede revertir. Ej: SHA-256.</li></ul>`, dato: 'Uno de los errores más comunes en sistemas reales: "protegí las contraseñas con Base64". ¡Base64 no protege nada!' },
              { t: 'teoria', titulo: 'El cifrado César', txt: `<p>Julio César, hace más de 2000 años, cifraba sus mensajes moviendo cada letra <b>3 posiciones</b>: A→D, B→E, C→F…</p><p><code>HOLA</code> → <code>KROD</code></p><p>La <b>clave</b> es el número de posiciones. El problema: solo hay 25 claves posibles. ¡Se rompe probando todas en segundos! (fuerza bruta)</p>`, dato: 'ROT13 es un César con desplazamiento 13. Aplicarlo dos veces te devuelve el mensaje original.' },
              { t: 'lab', lab: 'cesar', q: 'Interceptaste el mensaje <code>Krod hvwxgldqwh</code>, cifrado con César (desplazamiento 3). Usa la herramienta en modo <b>Descifrar</b> y escribe el mensaje original.', texto: 'Krod hvwxgldqwh', ok: ['hola estudiante'], ph: 'Mensaje descifrado', exp: 'Desplazando 3 hacia atrás: "Hola estudiante".' },
              { t: 'lab', lab: 'cesar', q: 'Este mensaje usa un desplazamiento <b>desconocido</b>: <code>Jq jcfrjs jx jq anjwsjx</code>. Prueba claves hasta que tenga sentido (fuerza bruta 😉).', texto: 'Jq jcfrjs jx jq anjwsjx', ok: ['el examen es el viernes'], ph: 'Mensaje descifrado', solTxt: 'Desplazamiento 5 → "El examen es el viernes"', exp: 'Con desplazamiento 5 aparece: "El examen es el viernes". Así de débil es César.' },
              { t: 'lab', lab: 'base64', q: 'Este texto está en Base64: <code>Q2l1ZGFkIGRlIExhdGFjdW5nYQ==</code>. Decodifícalo.', texto: 'Q2l1ZGFkIGRlIExhdGFjdW5nYQ==', ok: ['ciudad de latacunga'], ph: 'Texto decodificado', exp: 'Sin ninguna clave lo leíste: Base64 es codificación, no cifrado. Tip: el "==" al final suele delatar Base64.' },
              { t: 'parejas', q: 'Clasifica cada técnica', pares: [['Base64', 'Codificación (sin secreto)'], ['AES', 'Cifrado (usa clave)'], ['SHA-256', 'Hash (una sola vía)'], ['César', 'Cifrado antiguo y débil']] },
              { t: 'vf', q: 'Guardar contraseñas en Base64 es seguro porque no se leen a simple vista.', ok: false, exp: 'Cualquiera las decodifica en un segundo. Las contraseñas se guardan con hash + sal.' }
            ]
          },
          {
            titulo: 'Hash: huellas digitales', icono: '#️⃣', desc: 'Integridad y contraseñas.',
            steps: [
              { t: 'teoria', titulo: '¿Qué es un hash?', txt: `<p>Una función <b>hash</b> convierte cualquier dato en una "huella" de tamaño fijo. Con SHA-256 siempre son 64 caracteres hexadecimales.</p><ul><li>Mismo texto → <b>siempre</b> el mismo hash.</li><li>Un cambio mínimo → hash <b>totalmente distinto</b> (efecto avalancha).</li><li><b>No se puede revertir</b>: del hash no sacas el texto.</li></ul><p>Usos: guardar contraseñas y <b>verificar la integridad</b> de archivos (que nadie los modificó).</p>`, dato: 'MD5 y SHA-1 ya están rotos: se pueden encontrar dos archivos distintos con el mismo hash. Usa SHA-256 o superior.' },
              { t: 'teoria', titulo: 'Hash de contraseñas y sal', txt: `<p>Los sistemas serios no guardan tu contraseña: guardan su hash. Al iniciar sesión, calculan el hash de lo que escribiste y lo comparan.</p><p>Problema: dos personas con la clave <code>123456</code> tendrían el mismo hash, y existen tablas gigantes de hashes ya calculados. Solución: la <b>sal</b>, un valor aleatorio que se agrega a cada contraseña antes del hash.</p><p>Para contraseñas se usan algoritmos <b>lentos a propósito</b>: bcrypt, scrypt, Argon2.</p>`, dato: 'HackAndes guarda tu contraseña así: sal aleatoria + 12.000 vueltas de SHA-256. ¡Ya entiendes cómo te protegemos!' },
              { t: 'lab', lab: 'hash', q: 'Calcula el SHA-256 de la palabra <code>ESPE</code> (en mayúsculas). ¿Cuáles son sus <b>primeros 6 caracteres</b>?', texto: 'ESPE', ok: ['090b9e'], ph: '6 caracteres', exp: 'SHA-256("ESPE") empieza con 090b9e... Ahora escribe "espe" en minúsculas: ¡el hash cambia por completo!' },
              { t: 'terminal', q: '<b>Misión:</b> descargaste <code>setup.exe</code>. El sitio oficial publica su hash en <code>hash_oficial.txt</code>. Calcula el hash del archivo con <code>sha256sum</code> y compáralo.', esc: { fs: { 'setup.exe': 'MZ instalador modificado con malware\n', 'hash_oficial.txt': 'fc835eac392f0e6cd25a1cf80e674dbdb987e2ad40c84a059402551bc96304ae  setup.exe\n' } }, check: { cmd: '^sha256sum\\s+setup\\.exe' }, pista: 'sha256sum setup.exe y luego cat hash_oficial.txt', sol: ['sha256sum setup.exe', 'cat hash_oficial.txt'], exp: 'Compara los dos hashes con calma.' },
              { t: 'vf', q: 'En la misión anterior, el hash de <code>setup.exe</code> coincidía con el oficial, así que es seguro instalarlo.', ok: false, exp: 'No coincidían: el archivo fue MODIFICADO (quizás con malware). Verificar el hash protege la INTEGRIDAD.' },
              { t: 'opcion', q: '¿Para qué sirve la "sal" en las contraseñas?', ops: ['Para que el hash se pueda revertir', 'Para que claves iguales tengan hashes distintos', 'Para cifrar el disco', 'Para hacerlas más cortas'], ok: 1, exp: 'La sal es aleatoria por usuario: así las tablas de hashes precalculados no sirven.' },
              { t: 'parejas', q: 'Une cada algoritmo con su estado', pares: [['MD5', 'Roto, no usar'], ['SHA-256', 'Seguro para integridad'], ['bcrypt / Argon2', 'Ideales para contraseñas'], ['Base64', 'No es hash ni cifrado']] }
            ]
          },
          {
            titulo: 'Simétrico, asimétrico y firmas', icono: '🗝️', desc: 'AES, RSA y la firma electrónica.',
            steps: [
              { t: 'teoria', titulo: 'Cifrado simétrico', txt: `<p>Usa <b>la misma clave</b> para cifrar y descifrar. Es muy rápido. El más usado es <b>AES</b>.</p><p>Problema: ¿cómo le das la clave a la otra persona sin que nadie la intercepte?</p>`, dato: 'Tu respaldo de HackAndes se cifra con AES-256: la clave sale de tu contraseña.' },
              { t: 'teoria', titulo: 'Cifrado asimétrico', txt: `<p>Usa <b>dos claves</b> relacionadas:</p><ul><li>🔓 <b>Clave pública:</b> la compartes con todos. Sirve para CIFRAR mensajes para ti.</li><li>🔑 <b>Clave privada:</b> SOLO tú la tienes. Sirve para DESCIFRAR.</li></ul><p>Es como un buzón: cualquiera puede meter cartas (pública), pero solo tú tienes la llave para abrirlo (privada). Ejemplo: <b>RSA</b>.</p><p><b>Firma digital:</b> al revés. Firmas con tu clave privada y cualquiera verifica con tu pública que fuiste tú y que el documento no cambió.</p>`, ec: 'La firma electrónica que se usa en Ecuador (el archivo .p12) funciona con criptografía asimétrica. Con la app oficial FirmaEC puedes firmar documentos y verificar firmas: tiene la misma validez legal que una firma a mano.' },
              { t: 'parejas', q: 'Une cada concepto', pares: [['AES', 'Simétrico: una sola clave'], ['RSA', 'Asimétrico: par de claves'], ['Clave pública', 'Se comparte con todos'], ['Clave privada', 'Nunca se comparte']] },
              { t: 'opcion', q: 'Ana quiere enviarte un mensaje secreto usando cifrado asimétrico. ¿Con qué clave debe cifrarlo?', ops: ['Con la clave privada de Ana', 'Con TU clave pública', 'Con TU clave privada', 'Con ninguna'], ok: 1, exp: 'Cifra con tu pública → solo tu privada puede descifrarlo.' },
              { t: 'opcion', q: '¿Qué garantiza una firma digital?', ops: ['Que el documento es secreto', 'Quién lo firmó y que no fue modificado', 'Que el archivo es más pequeño', 'Que no tiene virus'], ok: 1, exp: 'Autenticidad (quién) e integridad (no cambió). No lo hace secreto.' },
              { t: 'vf', q: 'Si alguien roba tu archivo .p12 de firma electrónica y su contraseña, puede firmar documentos legales a tu nombre.', ok: true, exp: 'Por eso tu firma electrónica se protege como tu cédula: contraseña fuerte y nunca la envíes por WhatsApp o correo.' },
              { t: 'orden', q: 'Ordena cómo se firma y verifica un documento', items: ['Se calcula el hash del documento', 'El firmante cifra ese hash con su clave PRIVADA', 'Se envía el documento con la firma', 'El receptor verifica con la clave PÚBLICA del firmante'], exp: 'Hash + clave privada = firma. Clave pública = verificación.' }
            ]
          },
          {
            titulo: 'Reto: HTTPS y certificados', icono: '📜', reto: true, desc: 'TLS, autoridades y ataques MITM.',
            steps: [
              { t: 'teoria', titulo: 'Cómo funciona HTTPS', txt: `<p>HTTPS usa <b>TLS</b>, que combina lo que aprendiste:</p><ol><li>El sitio te muestra su <b>certificado</b> (con su clave pública), firmado por una <b>Autoridad de Certificación (CA)</b> en la que tu navegador confía.</li><li>Tu navegador verifica la firma: así sabe que el sitio es quien dice ser.</li><li>Usan cifrado asimétrico para acordar una clave secreta.</li><li>El resto de la conversación va con cifrado simétrico (AES), que es rápido.</li></ol>`, dato: 'Un ataque "Man in the Middle" (MITM, hombre en el medio) intenta ponerse entre tú y el sitio. Si ves un aviso de "certificado no válido", ¡no continúes!' },
              { t: 'orden', q: 'Ordena los pasos de una conexión HTTPS', items: ['El navegador se conecta al sitio', 'El sitio envía su certificado', 'El navegador verifica la firma de la CA', 'Acuerdan una clave secreta', 'La comunicación viaja cifrada con AES'], exp: 'Certificado → verificación → clave compartida → cifrado rápido.' },
              { t: 'opcion', q: 'Tu navegador muestra "Su conexión no es privada: certificado no válido" al entrar a tu banco. ¿Qué haces?', ops: ['Clic en "Continuar de todos modos"', 'No continúo: puede ser un ataque. Pruebo desde otra red o la app oficial', 'Desactivo el antivirus', 'Borro las cookies y continúo'], ok: 1, exp: 'Puede ser un ataque MITM o un sitio falso. Nunca ignores ese aviso en sitios donde pones datos.' },
              { t: 'terminal', q: '<b>Reto:</b> interceptaste este mensaje en Base64. Decodifícalo con <code>echo "..." | base64 -d</code> y envía la bandera:<br><code>SEF7ZGVjb2RpZmljYXJfbm9fZXNfZGVzY2lmcmFyfQo=</code>', esc: {}, check: { flag: 'HA{decodificar_no_es_descifrar}' }, pista: 'echo "SEF7ZGVj...=" | base64 -d', sol: ['echo "SEF7ZGVjb2RpZmljYXJfbm9fZXNfZGVzY2lmcmFyfQo=" | base64 -d'], exp: 'Como dice la bandera: decodificar no es descifrar. ¡Lo lograste sin ninguna clave!' },
              { t: 'lab', lab: 'cesar', q: 'Último reto: un compañero usó ROT13 (desplazamiento 13): <code>Abf irzbf ra ry Pbgbcnkv</code>. ¿Qué dice?', texto: 'Abf irzbf ra ry Pbgbcnkv', ok: ['nos vemos en el cotopaxi'], ph: 'Mensaje descifrado', solTxt: 'Desplazamiento 13 → "Nos vemos en el Cotopaxi"', exp: '"Nos vemos en el Cotopaxi". ROT13 es su propio inverso: cifrar y descifrar es lo mismo.' },
              { t: 'vf', q: 'El candado de HTTPS garantiza que la información viaja cifrada entre tu navegador y el servidor.', ok: true, exp: 'Correcto. Pero recuerda: no garantiza que el dueño del sitio sea honesto.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 9: SEGURIDAD WEB =======================
      {
        titulo: 'Seguridad web', icono: '🕸️', desc: 'HTTP, inyección SQL, XSS y OWASP.',
        lessons: [
          {
            titulo: 'Cómo habla una web', icono: '💬', desc: 'Peticiones, respuestas, códigos y cookies.',
            steps: [
              { t: 'teoria', titulo: 'Petición y respuesta', txt: `<p>Tu navegador envía una <b>petición HTTP</b> y el servidor devuelve una <b>respuesta</b>.</p><ul><li><b>GET:</b> pedir algo (ver una página).</li><li><b>POST:</b> enviar datos (un formulario, un login).</li></ul><p>La respuesta trae un <b>código de estado</b>:</p><ul><li><b>200</b> OK · <b>301</b> redirección · <b>403</b> prohibido · <b>404</b> no encontrado · <b>500</b> error del servidor</li></ul>`, dato: 'El famoso "Error 404" significa que la página no existe en ese servidor.' },
              { t: 'teoria', titulo: 'Cookies y sesiones', txt: `<p>HTTP no recuerda quién eres entre una petición y otra. Por eso, cuando inicias sesión, el servidor te da una <b>cookie de sesión</b>: un "pase" que tu navegador muestra en cada petición.</p><p>⚠️ Si alguien roba esa cookie, puede entrar a tu cuenta <b>sin saber tu contraseña</b> (secuestro de sesión).</p>`, dato: 'Por eso es importante "Cerrar sesión": el servidor invalida ese pase.' },
              { t: 'terminal', q: '<b>Misión:</b> pide la página principal de la tienda de práctica con <code>curl http://tienda.local</code> y lee el código HTML. ¿Ves algo que el programador olvidó?', esc: { net: RED }, check: { cmd: '^curl\\s+http://tienda\\.local/?$', out: 'admin-viejo' }, pista: 'curl http://tienda.local', sol: ['curl http://tienda.local'], exp: 'En un comentario HTML dejaron: "borrar el panel /admin-viejo". Los comentarios del código fuente son una mina de oro en un pentest.' },
              { t: 'terminal', q: '<b>Misión:</b> revisa el archivo <code>robots.txt</code> de la tienda y luego entra a la ruta que esconde. Envía la bandera.', esc: { net: RED }, check: { flag: 'HA{l0s_c0mentari0s_hablan}' }, pista: 'curl http://tienda.local/robots.txt y luego curl http://tienda.local/admin-viejo/', sol: ['curl http://tienda.local/robots.txt', 'curl http://tienda.local/admin-viejo/'], exp: 'robots.txt le dice a Google qué NO indexar... y sin querer le dice a los atacantes dónde mirar.' },
              { t: 'parejas', q: 'Une cada código de estado', pares: [['200', 'Todo bien'], ['404', 'No encontrado'], ['403', 'Prohibido'], ['500', 'Error del servidor']] },
              { t: 'opcion', q: '¿Qué método HTTP se usa normalmente para enviar un formulario de login?', ops: ['GET', 'POST', 'DELETE', 'PING'], ok: 1, exp: 'POST envía los datos en el cuerpo de la petición, no en la URL.' },
              { t: 'vf', q: 'Si me roban la cookie de sesión, pueden entrar a mi cuenta sin mi contraseña.', ok: true, exp: 'Exacto. Por eso existen las cookies con atributos HttpOnly y Secure, y por eso hay que cerrar sesión.' }
            ]
          },
          {
            titulo: 'Inyección SQL', icono: '💉', desc: 'Cuando tu texto se vuelve código.',
            steps: [
              { t: 'teoria', titulo: 'Bases de datos y SQL', txt: `<p>Las webs guardan usuarios, notas y productos en <b>bases de datos</b>. Se consultan con el lenguaje <b>SQL</b>:</p><p><code>SELECT * FROM usuarios WHERE usuario = 'ana' AND clave = '1234'</code></p><p>Si el programador mete lo que escribes directamente en esa consulta, puedes <b>cambiar la lógica</b> con caracteres especiales como la comilla <code>'</code>. Eso es la <b>inyección SQL</b>.</p>`, dato: 'La inyección SQL lleva más de 25 años siendo una de las vulnerabilidades más peligrosas de la web.' },
              { t: 'teoria', titulo: 'El truco clásico', txt: `<p>Si escribes como usuario: <code>' OR '1'='1' --</code></p><p>La consulta queda:<br><code>... WHERE usuario = '' OR '1'='1' --' AND clave = ''</code></p><ul><li><code>'1'='1'</code> siempre es verdadero.</li><li><code>--</code> convierte el resto en comentario (se ignora la clave).</li></ul><p><b>Defensa:</b> usar <b>consultas preparadas</b> (parámetros), que tratan tu texto siempre como texto y nunca como código.</p>`, dato: 'Solo practica en laboratorios. Probar esto en una web real sin permiso es un delito.' },
              { t: 'lab', lab: 'sqli', q: 'Entra al sistema de notas del colegio ficticio <b>sin saber la contraseña</b>, usando inyección SQL en el campo de usuario o de contraseña.', sol: "' OR '1'='1' --", solTxt: "Escribe en Usuario: <code>' OR '1'='1' --</code> y presiona Ingresar", exp: '¡Bypass logrado! Ahora activa la protección y vuelve a intentarlo: verás cómo las consultas preparadas lo bloquean.' },
              { t: 'opcion', q: '¿Cuál es la MEJOR defensa contra la inyección SQL?', ops: ['Esconder el formulario', 'Consultas preparadas (parametrizadas)', 'Poner un captcha', 'Cambiar el color del login'], ok: 1, exp: 'Las consultas preparadas separan el código SQL de los datos del usuario.' },
              { t: 'opcion', q: 'En la inyección, ¿para qué sirven los dos guiones <code>--</code>?', ops: ['Para restar', 'Para comentar (anular) el resto de la consulta', 'Para cifrar', 'Para conectarse a la base'], ok: 1, exp: 'En SQL, -- inicia un comentario: todo lo que sigue se ignora, incluida la verificación de la clave.' },
              { t: 'vf', q: 'Con una inyección SQL un atacante podría leer TODOS los usuarios de la base de datos, no solo entrar.', ok: true, exp: 'Sí: puede extraer, modificar o borrar datos. Por eso es una de las fallas más graves.' }
            ]
          },
          {
            titulo: 'XSS: código en la página', icono: '📜', desc: 'Cross-Site Scripting.',
            steps: [
              { t: 'teoria', titulo: '¿Qué es XSS?', txt: `<p><b>Cross-Site Scripting (XSS)</b> ocurre cuando una web muestra lo que escribe un usuario <b>sin limpiarlo</b>, y ese texto contiene código JavaScript.</p><p>Ej: en una sección de comentarios alguien escribe <code>&lt;script&gt;...&lt;/script&gt;</code>. Si la página no lo filtra, <b>el navegador de cada visitante ejecuta ese código</b>.</p><p>Con XSS se puede robar cookies de sesión, cambiar el contenido de la página o redirigir a sitios falsos.</p>`, dato: 'Tipos: XSS almacenado (queda guardado, como un comentario), reflejado (va en un enlace) y basado en DOM.' },
              { t: 'teoria', titulo: 'Cómo se previene', txt: `<ul><li><b>Escapar la salida:</b> convertir <code>&lt;</code> en <code>&amp;lt;</code> para que se muestre como texto y no se ejecute.</li><li><b>Validar la entrada:</b> aceptar solo lo esperado.</li><li><b>Content Security Policy (CSP):</b> una regla del servidor que le dice al navegador qué scripts puede ejecutar.</li><li>Cookies con <b>HttpOnly</b>: JavaScript no puede leerlas.</li></ul>`, dato: 'HackAndes escapa todo lo que escribes (tu nombre, tu usuario) antes de mostrarlo. ¡Es una defensa contra XSS!' },
              { t: 'lab', lab: 'xss', q: 'Publica un comentario que haría que la tienda ficticia ejecute código en el navegador de los visitantes. (Aquí solo se simula, no se ejecuta nada.)', sol: '<script>alert("XSS")</script>', solTxt: 'Escribe <code>&lt;script&gt;alert("XSS")&lt;/script&gt;</code> y publica', exp: 'Detectaste un XSS. Activa la protección y publica lo mismo: ahora se muestra como texto inofensivo.' },
              { t: 'opcion', q: '¿Qué puede robar un atacante con XSS?', ops: ['La contraseña del Wi-Fi', 'La cookie de sesión de otros usuarios', 'El disco duro del servidor', 'Nada'], ok: 1, exp: 'El código corre en el navegador de la víctima, donde están sus cookies de sesión.' },
              { t: 'parejas', q: 'Une cada defensa', pares: [['Escapar la salida', 'Mostrar < como texto'], ['CSP', 'Lista de scripts permitidos'], ['HttpOnly', 'JavaScript no lee la cookie'], ['Validar entrada', 'Aceptar solo lo esperado']] },
              { t: 'vf', q: 'El XSS ataca al servidor directamente, no a los usuarios.', ok: false, exp: 'El XSS se ejecuta en el NAVEGADOR de los usuarios que visitan la página. Las víctimas son las personas.' }
            ]
          },
          {
            titulo: 'Reto: OWASP Top 10', icono: '🏆', reto: true, desc: 'Las fallas web más comunes.',
            steps: [
              { t: 'teoria', titulo: 'El OWASP Top 10', txt: `<p><b>OWASP</b> es una fundación abierta que publica la lista de los <b>10 riesgos más críticos</b> en aplicaciones web. Algunos:</p><ul><li>🔓 <b>Control de acceso roto</b> (el #1): ver o hacer cosas que no te corresponden.</li><li>💉 <b>Inyección</b> (SQL y otras).</li><li>🔐 <b>Fallas criptográficas</b>: datos sin cifrar, algoritmos débiles.</li><li>⚙️ <b>Configuración insegura</b>: contraseñas por defecto, paneles expuestos.</li><li>📦 <b>Componentes vulnerables</b>: librerías sin actualizar.</li></ul>`, dato: 'Un ejemplo clásico de control de acceso roto es IDOR: cambiar un número en la URL (?id=1001 → ?id=1002) y ver los datos de otra persona.' },
              { t: 'terminal', q: '<b>Misión (IDOR):</b> tu pedido es <code>http://tienda.local/pedido?id=1001</code>. Mira qué pasa si cambias el número a 1002. Envía la bandera.', esc: { net: RED }, check: { flag: 'HA{id0r_acces0_r0t0}' }, pista: 'curl "http://tienda.local/pedido?id=1002"', sol: ['curl "http://tienda.local/pedido?id=1001"', 'curl "http://tienda.local/pedido?id=1002"'], exp: 'Viste la dirección y el teléfono de otra clienta. El servidor nunca comprobó si ese pedido era TUYO. Esto pasa más de lo que crees.' },
              { t: 'opcion', q: 'En el reto anterior, ¿qué debió hacer el servidor?', ops: ['Usar números más grandes', 'Verificar que el pedido pertenece al usuario que lo pide', 'Ocultar la URL', 'Poner el sitio en HTTPS'], ok: 1, exp: 'Siempre hay que validar en el servidor que el usuario tiene permiso sobre ese recurso.' },
              { t: 'parejas', q: 'Une cada falla con su ejemplo', pares: [['Control de acceso roto', 'Ver el pedido de otro cambiando el id'], ['Inyección', "' OR '1'='1"], ['Configuración insegura', 'Panel admin sin contraseña'], ['Componentes vulnerables', 'Librería sin actualizar desde 2015']] },
              { t: 'terminal', q: '<b>Misión:</b> la tienda tiene una base de datos expuesta. Escanéala con <code>nmap -sV 10.10.10.20</code> e identifica qué base de datos usa.', esc: { net: RED }, check: { cmd: '^nmap', out: 'MySQL' }, pista: 'nmap -sV 10.10.10.20', sol: ['nmap -sV 10.10.10.20'], exp: 'Puerto 3306 con MySQL abierto a la red: configuración insegura. Una base de datos nunca debería estar expuesta.' },
              { t: 'escribir', q: '¿Qué puerto usa MySQL?', ok: ['3306'], exp: 'MySQL → 3306.' },
              { t: 'vf', q: 'El control de acceso roto ocupa el primer lugar del OWASP Top 10.', ok: true, exp: 'Es la falla más encontrada en las aplicaciones web analizadas.' }
            ]
          }
        ]
      },
      // ======================= UNIDAD 10: HACKING ÉTICO =======================
      {
        titulo: 'Hacking ético y tu laboratorio', icono: '⚖️', desc: 'Leyes, metodología y tu propio lab.',
        lessons: [
          {
            titulo: 'Ética y leyes en Ecuador', icono: '📕', desc: 'Lo que puedes y no puedes hacer.',
            steps: [
              { t: 'teoria', titulo: 'La regla de oro: AUTORIZACIÓN', txt: `<p>La única diferencia entre un hacker ético y un delincuente es el <b>permiso</b>. Antes de cualquier prueba necesitas:</p><ul><li>✍️ <b>Autorización por escrito</b> del dueño del sistema.</li><li>🎯 <b>Alcance</b> claro: qué sistemas SÍ y cuáles NO, y en qué horario.</li><li>🤐 <b>Confidencialidad</b>: lo que encuentras no se comparte.</li></ul>`, ec: 'El Código Orgánico Integral Penal (COIP) sanciona, entre otros: la revelación ilegal de bases de datos (art. 229), la interceptación ilegal de datos (art. 230), el ataque a la integridad de sistemas informáticos (art. 232) y el acceso no consentido a un sistema informático (art. 234, con 3 a 5 años de prisión).' },
              { t: 'teoria', titulo: 'Protección de datos y divulgación responsable', txt: `<p>En Ecuador también existe la <b>Ley Orgánica de Protección de Datos Personales</b> (2021): obliga a empresas e instituciones a cuidar los datos de las personas.</p><p>Si encuentras una falla por casualidad, lo correcto es la <b>divulgación responsable</b>: avisar en privado a la organización, darles tiempo para arreglarla y no explotarla ni publicarla.</p><p>Muchas empresas tienen programas de <b>bug bounty</b>: te pagan legalmente por reportar fallas dentro de sus reglas.</p>`, dato: 'Plataformas como HackerOne o Bugcrowd conectan a hackers éticos con empresas que pagan por encontrar vulnerabilidades.' },
              { t: 'opcion', q: '¿Qué es lo PRIMERO que necesitas antes de hacer una prueba de penetración?', ops: ['Kali Linux instalado', 'Autorización por escrito y alcance definido', 'Una VPN', 'Un buen nombre de hacker'], ok: 1, exp: 'Sin autorización, cualquier prueba es ilegal, sin importar tus intenciones.' },
              { t: 'vf', q: 'Si encuentro una falla en la web de mi universidad, lo ético es publicarla en redes para que la arreglen rápido.', ok: false, exp: 'Publicarla expone a todos. Lo correcto: reportarla en privado al área de TI (divulgación responsable) y no explotarla.' },
              { t: 'parejas', q: 'Une cada término', pares: [['Alcance', 'Qué sistemas se pueden probar'], ['Bug bounty', 'Pago por reportar fallas'], ['Divulgación responsable', 'Avisar en privado primero'], ['Art. 234 COIP', 'Acceso no consentido']] },
              { t: 'opcion', q: 'Durante un pentest autorizado encuentras datos personales de clientes. ¿Qué haces?', ops: ['Los descargo para mostrarlos en clase', 'Lo documento en el informe sin copiar ni divulgar los datos', 'Los publico para demostrar la falla', 'Los vendo'], ok: 1, exp: 'Reportas que el acceso fue posible, con evidencia mínima, protegiendo la confidencialidad.' }
            ]
          },
          {
            titulo: 'Metodología del pentest', icono: '🧭', desc: 'Las fases de un hacking ético.',
            steps: [
              { t: 'teoria', titulo: 'Las fases', txt: `<ol><li>📝 <b>Planificación:</b> permisos, alcance, reglas.</li><li>🔍 <b>Reconocimiento:</b> reunir información (pasiva: sin tocar el objetivo; activa: interactuando).</li><li>📡 <b>Escaneo y enumeración:</b> puertos, servicios, versiones.</li><li>💥 <b>Explotación:</b> aprovechar una vulnerabilidad para obtener acceso.</li><li>🧗 <b>Post-explotación:</b> qué más se puede alcanzar (escalar privilegios, moverse).</li><li>📄 <b>Informe:</b> qué encontraste, qué tan grave es y cómo arreglarlo.</li></ol>`, dato: 'El informe es lo que el cliente realmente paga. Un pentest sin un buen informe no sirve de nada.' },
              { t: 'teoria', titulo: 'Tipos de prueba', txt: `<ul><li>⬛ <b>Caja negra:</b> el pentester no sabe nada del sistema (como un atacante externo).</li><li>⬜ <b>Caja blanca:</b> tiene toda la información: código, diagramas, usuarios.</li><li>🔲 <b>Caja gris:</b> tiene información parcial (por ejemplo, un usuario normal).</li></ul><p>También existen el <b>Red Team</b> (ataca, simulando a un adversario real) y el <b>Blue Team</b> (defiende y detecta).</p>`, dato: 'Cuando ambos equipos trabajan juntos para mejorar, se le llama Purple Team (rojo + azul = morado 💜, como HackAndes).' },
              { t: 'orden', q: 'Ordena las fases de un pentest', items: ['Planificación y permisos', 'Reconocimiento', 'Escaneo y enumeración', 'Explotación', 'Post-explotación', 'Informe'], exp: 'Planificar → reconocer → escanear → explotar → post-explotación → informar.' },
              { t: 'parejas', q: 'Une cada tipo de prueba', pares: [['Caja negra', 'Sin información previa'], ['Caja blanca', 'Con toda la información'], ['Caja gris', 'Con información parcial'], ['Red Team', 'Simula al atacante'], ['Blue Team', 'Defiende y detecta']] },
              { t: 'opcion', q: 'Buscar en Google información pública de una empresa (empleados, correos) es reconocimiento…', ops: ['Activo', 'Pasivo', 'Ilegal siempre', 'De explotación'], ok: 1, exp: 'Pasivo: no interactúas con los sistemas de la empresa. Lo verás a fondo en OSINT (Nivel 3).' },
              { t: 'vf', q: 'Escanear puertos con nmap es parte de la fase de escaneo y enumeración.', ok: true, exp: 'Exacto: descubres qué servicios hay y sus versiones para buscar vulnerabilidades.' }
            ]
          },
          {
            titulo: 'Arma tu laboratorio', icono: '🧰', desc: 'Máquinas virtuales o laboratorio en el navegador.',
            steps: [
              { t: 'teoria', titulo: 'Máquinas virtuales', txt: `<p>Una <b>máquina virtual (VM)</b> es una computadora "dentro" de tu computadora. Te permite practicar ataques sin riesgo.</p><ul><li><b>VirtualBox</b> (gratis): el programa que crea las VMs.</li><li><b>Kali Linux</b> (gratis): tu máquina de ataque, con cientos de herramientas.</li><li><b>Metasploitable 2</b> o <b>DVWA</b>: máquinas vulnerables A PROPÓSITO para practicar.</li><li>Red <b>"Solo anfitrión" (Host-only)</b>: aísla tus VMs de internet.</li><li><b>Instantáneas (snapshots)</b>: si rompes algo, vuelves atrás en segundos.</li></ul>`, dato: 'Requisitos recomendados: 8 GB de RAM o más, 60 GB libres y la virtualización (VT-x/AMD-V) activada en la BIOS.' },
              { t: 'teoria', titulo: '¿Tu PC tiene solo 4 GB?', txt: `<p>¡No hay problema! Tienes opciones sin instalar máquinas virtuales:</p><ul><li><b>TryHackMe</b>: salas gratis y una AttackBox (máquina de ataque en el navegador) 1 hora al día gratis.</li><li><b>PortSwigger Web Security Academy</b>: laboratorios web gratis.</li><li><b>OverTheWire Bandit</b> y <b>picoCTF</b>: retos gratis.</li><li>La <b>terminal y el laboratorio de HackAndes</b>, sin internet.</li></ul><p>En la pestaña <b>🧪 Laboratorio → Tu laboratorio real</b> tienes la guía paso a paso con lista para ir marcando.</p>`, dato: 'Muchos profesionales empezaron solo con TryHackMe desde una laptop sencilla. Lo que importa es la constancia.' },
              { t: 'orden', q: 'Ordena cómo armar tu laboratorio con VirtualBox', items: ['Activar la virtualización en la BIOS', 'Instalar VirtualBox', 'Importar Kali Linux', 'Importar una máquina vulnerable (Metasploitable)', 'Conectar ambas a una red Host-only', 'Tomar una instantánea'], exp: '¡Listo para practicar de forma segura y legal!' },
              { t: 'opcion', q: '¿Por qué conectar las máquinas a una red "Host-only"?', ops: ['Para que vayan más rápido', 'Para aislar las máquinas vulnerables de internet y de otras redes', 'Porque es obligatorio en Kali', 'Para ahorrar batería'], ok: 1, exp: 'Una máquina vulnerable expuesta a internet podría ser atacada por otros. Aislarla protege tu red.' },
              { t: 'parejas', q: 'Une cada herramienta', pares: [['VirtualBox', 'Crea máquinas virtuales'], ['Kali Linux', 'Sistema de ataque'], ['Metasploitable', 'Máquina vulnerable a propósito'], ['Snapshot', 'Punto para volver atrás'], ['AttackBox', 'Kali en el navegador (TryHackMe)']] },
              { t: 'vf', q: 'Con una PC de 4 GB de RAM no puedo aprender hacking ético.', ok: false, exp: 'Puedes usar laboratorios en el navegador (TryHackMe, PortSwigger) y los simuladores de HackAndes.' }
            ]
          },
          {
            titulo: 'Reto final: tu primer pentest', icono: '🏁', reto: true, desc: 'Un mini pentest completo, paso a paso.',
            steps: [
              { t: 'teoria', titulo: 'Briefing de la misión', txt: `<p>El <b>Colegio Volcán</b> (ficticio) te contrató y te firmó una autorización para revisar su servidor de pruebas <code>10.10.10.5</code>. Nada más está en el alcance.</p><p>Tu objetivo: descubrir si hay información sensible expuesta. Aplica las fases: <b>escaneo → enumeración web → hallazgo → informe</b>.</p>`, dato: 'En la vida real, guarda una copia de tu autorización durante TODO el pentest.' },
              { t: 'terminal', q: '<b>Fase 1 · Escaneo:</b> descubre qué servicios tiene <code>10.10.10.5</code>.', esc: { net: RED }, check: { cmd: '^nmap', out: '80/tcp' }, pista: 'nmap -sV 10.10.10.5', sol: ['nmap -sV 10.10.10.5'], exp: 'Tiene SSH (22) y una web Apache (80). Empecemos por la web.' },
              { t: 'terminal', q: '<b>Fase 2 · Enumeración web:</b> revisa el <code>robots.txt</code> del servidor.', esc: { net: RED }, check: { cmd: 'robots\\.txt', out: 'Disallow' }, pista: 'curl http://10.10.10.5/robots.txt', sol: ['curl http://10.10.10.5/robots.txt'], exp: 'Hay una carpeta /respaldo/ que no quieren que se vea. ¡Sospechoso!' },
              { t: 'terminal', q: '<b>Fase 3 · Hallazgo:</b> explora <code>/respaldo/</code>, lee los archivos y decodifica lo que encuentres. Envía la bandera.', esc: { net: RED }, check: { flag: 'HA{robots_txt_revela_secretos}' }, pista: 'curl http://10.10.10.5/respaldo/ → curl .../credenciales.txt → echo "..." | base64 -d', sol: ['curl http://10.10.10.5/respaldo/', 'curl http://10.10.10.5/respaldo/credenciales.txt', 'echo "dXN1YXJpbzogYWRtaW4KY2xhdmU6IFZvbGNhbjIwMjYhCkhBe3JvYm90c190eHRfcmV2ZWxhX3NlY3JldG9zfQo=" | base64 -d'], exp: 'Encontraste usuario y contraseña de admin, "protegidos" solo con Base64. Hallazgo CRÍTICO.' },
              { t: 'opcion', q: '<b>Fase 4 · Informe:</b> ¿qué recomendación pondrías?', ops: ['Cambiar el robots.txt para que no mencione la carpeta', 'Quitar los respaldos del servidor web, cambiar la contraseña expuesta y nunca guardar credenciales en Base64', 'Usar Base64 dos veces', 'No hacer nada, nadie lo va a encontrar'], ok: 1, exp: 'Ocultar no es proteger. Hay que eliminar la exposición, rotar la credencial filtrada y almacenar secretos de forma segura.' },
              { t: 'vf', q: 'Como ya tienes la contraseña de admin, puedes entrar por SSH a otros servidores del colegio para ver si también funciona.', ok: false, exp: '¡NO! Solo 10.10.10.5 está en el alcance. Salir del alcance es ilegal aunque tengas un contrato.' },
              { t: 'orden', q: 'Ordena las secciones de un informe de pentest', items: ['Resumen ejecutivo (para gerentes)', 'Alcance y metodología', 'Hallazgos con su gravedad', 'Evidencias y pasos para reproducir', 'Recomendaciones para corregir'], exp: 'Del resumen sencillo a los detalles técnicos y las soluciones. En el Nivel 3 aprenderás a escribirlo como profesional.' }
            ]
          }
        ]
      }
    ],
    glosario: [
      ['AES', 'Algoritmo de cifrado simétrico muy usado y seguro.'],
      ['Autoridad de Certificación (CA)', 'Entidad de confianza que firma los certificados de los sitios web.'],
      ['Base64', 'Forma de codificar datos como texto. No es cifrado: cualquiera lo decodifica.'],
      ['Bug bounty', 'Programa en el que una empresa paga por reportar vulnerabilidades dentro de sus reglas.'],
      ['Caja negra / blanca / gris', 'Tipos de prueba según cuánta información previa tiene el pentester.'],
      ['Certificado digital', 'Documento electrónico que asocia una clave pública con su dueño, firmado por una CA.'],
      ['Cifrado asimétrico', 'Usa una clave pública para cifrar y una privada para descifrar. Ej: RSA.'],
      ['Cifrado César', 'Cifrado antiguo que desplaza cada letra un número fijo de posiciones.'],
      ['Cifrado simétrico', 'Usa la misma clave para cifrar y descifrar. Ej: AES.'],
      ['chmod', 'Comando de Linux para cambiar permisos.'],
      ['Cookie de sesión', 'Dato que el servidor entrega al iniciar sesión para reconocerte en cada petición.'],
      ['CSP', 'Content Security Policy: regla que limita qué scripts puede ejecutar una página.'],
      ['curl', 'Comando para hacer peticiones web desde la terminal.'],
      ['Divulgación responsable', 'Reportar una falla en privado a la organización antes de hacerla pública.'],
      ['DNS', 'Sistema que traduce nombres de dominio a direcciones IP.'],
      ['Firma digital', 'Garantiza quién firmó un documento y que no fue modificado.'],
      ['grep', 'Comando de Linux para buscar texto dentro de archivos.'],
      ['Hash', 'Huella de tamaño fijo de unos datos. No se puede revertir. Ej: SHA-256.'],
      ['HTTP', 'Protocolo con el que navegadores y servidores web se comunican.'],
      ['IDOR', 'Falla de control de acceso: cambiar un identificador para ver datos ajenos.'],
      ['Inyección SQL', 'Ataque que mete código SQL en un formulario para alterar la consulta a la base de datos.'],
      ['IP', 'Dirección que identifica a un equipo en una red.'],
      ['Kali Linux', 'Sistema operativo gratuito con herramientas para hacking ético.'],
      ['MAC', 'Identificador único de una tarjeta de red.'],
      ['Máquina virtual', 'Computadora simulada dentro de otra computadora.'],
      ['MITM', 'Ataque "hombre en el medio": el atacante se pone entre dos partes que se comunican.'],
      ['Modelo OSI', 'Modelo de 7 capas que explica cómo funcionan las redes.'],
      ['Nmap', 'Herramienta para descubrir equipos, puertos y servicios en una red.'],
      ['OWASP Top 10', 'Lista de los 10 riesgos más críticos en aplicaciones web.'],
      ['Pentest', 'Prueba de penetración: ataque autorizado para encontrar vulnerabilidades.'],
      ['Puerto', 'Número que identifica un servicio dentro de un equipo (80 web, 22 SSH...).'],
      ['Red Team / Blue Team', 'Equipo que simula ataques / equipo que defiende y detecta.'],
      ['robots.txt', 'Archivo que indica a los buscadores qué rutas no indexar. A veces revela rutas sensibles.'],
      ['root', 'El superusuario de Linux, con control total del sistema.'],
      ['RSA', 'Algoritmo de cifrado asimétrico muy conocido.'],
      ['Sal (salt)', 'Valor aleatorio que se agrega a una contraseña antes de calcular su hash.'],
      ['SSH', 'Protocolo para controlar equipos de forma remota y segura (puerto 22).'],
      ['sudo', 'Comando para ejecutar algo con privilegios de root.'],
      ['TCP / UDP', 'Protocolos de transporte: TCP es confiable, UDP es rápido.'],
      ['TLS', 'Protocolo que cifra las conexiones HTTPS.'],
      ['WPA3', 'El estándar de seguridad Wi-Fi más reciente.'],
      ['XSS', 'Cross-Site Scripting: inyectar código que se ejecuta en el navegador de otros usuarios.']
    ],
    tips: [
      'Linux distingue mayúsculas y minúsculas: Documentos y documentos son carpetas distintas.',
      'En la terminal, presiona la flecha ↑ para repetir comandos anteriores y Tab para autocompletar.',
      'Base64 no es cifrado. Si ves "==" al final de un texto raro, prueba decodificarlo.',
      'Verifica el hash de los programas que descargas: así sabes que nadie los modificó.',
      'Nunca ignores un aviso de "certificado no válido" en una página donde pondrás datos.',
      'robots.txt es público. Nunca pongas ahí rutas secretas.',
      'Sin autorización por escrito no hay hacking ético: solo delito.',
      'Tu archivo .p12 de firma electrónica es tan importante como tu cédula. Protégelo.',
      'Cierra los puertos que no uses: cada puerto abierto es una puerta más para un atacante.',
      'Usa una red "Solo anfitrión" en VirtualBox para que tus máquinas vulnerables no queden expuestas.'
    ]
  });
})();
