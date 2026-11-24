/* ============================================================
   NIVEL 1 · BÁSICO — "No sé nada"
   Tipos de paso: teoria, opcion, vf, escribir, orden, parejas, mensaje, terminal, lab
   ============================================================ */
HA.addLevel({
  n: 1, id: 'n1', nombre: 'Fundamentos', sub: 'Básico · Desde cero',
  units: [
    // ======================= UNIDAD 1 =======================
    {
      titulo: 'La compu por dentro', icono: '💻', desc: 'Hardware, software, archivos, binario e internet.',
      lessons: [
        {
          titulo: 'Hardware y software', icono: '🖥️', desc: 'Las partes que se tocan y las que no.',
          steps: [
            { t: 'teoria', titulo: '¿Qué es una computadora?', txt: `<p>Una computadora es una máquina que <b>recibe datos, los procesa y te devuelve un resultado</b>. Tu celular, tu laptop y hasta un cajero automático son computadoras.</p><p>Tienen dos partes:</p><ul><li><b>Hardware:</b> lo que puedes tocar (pantalla, teclado, procesador).</li><li><b>Software:</b> los programas que le dicen al hardware qué hacer (WhatsApp, Word, Windows).</li></ul>`, dato: 'Para proteger algo, primero hay que entender cómo funciona. Por eso empezamos desde aquí.' },
            { t: 'teoria', titulo: 'Las piezas clave', txt: `<ul><li><b>CPU (procesador):</b> el "cerebro". Hace los cálculos.</li><li><b>RAM:</b> la memoria de trabajo. Es rápida pero se borra al apagar.</li><li><b>Disco (HDD o SSD):</b> donde se guardan tus archivos de forma permanente.</li><li><b>Tarjeta de red:</b> permite conectarse a internet (por cable o Wi-Fi).</li></ul>`, ec: 'Si compras una laptop en la Av. Amazonas o en el centro de Latacunga, siempre te dirán: "tiene 8 GB de RAM y 512 GB de SSD". ¡Ahora sabes qué significa!' },
            { t: 'opcion', q: '¿Cuál de estos es <b>software</b>?', ops: ['El teclado', 'WhatsApp', 'La memoria RAM', 'El cargador'], ok: 1, exp: 'WhatsApp es un programa: no lo puedes tocar. Los otros son hardware.' },
            { t: 'parejas', q: 'Une cada pieza con lo que hace', pares: [['CPU', 'Hace los cálculos'], ['RAM', 'Memoria temporal'], ['Disco SSD', 'Guarda archivos'], ['Tarjeta de red', 'Conecta a internet']] },
            { t: 'vf', q: 'Si apagas la computadora, lo que estaba en la <b>RAM</b> se borra.', ok: true, exp: 'Correcto. La RAM es memoria volátil: necesita energía. Por eso debes guardar tu trabajo en el disco.' },
            { t: 'opcion', q: 'Un atacante roba tu laptop. ¿Dónde están tus fotos y documentos?', ops: ['En la CPU', 'En la RAM', 'En el disco', 'En el monitor'], ok: 2, exp: 'Los archivos viven en el disco. Por eso es buena idea cifrar el disco (lo veremos más adelante).' },
            { t: 'vf', q: 'Un celular NO es una computadora.', ok: false, exp: 'Sí lo es: tiene procesador, memoria, almacenamiento y sistema operativo. ¡Y también se puede hackear!' }
          ]
        },
        {
          titulo: 'Sistema operativo y archivos', icono: '📁', desc: 'Windows, Linux, Android y las extensiones tramposas.',
          steps: [
            { t: 'teoria', titulo: 'El sistema operativo', txt: `<p>El <b>sistema operativo (SO)</b> es el programa principal: administra el hardware y deja que funcionen las demás apps.</p><ul><li>En computadoras: <b>Windows</b>, <b>macOS</b> y <b>Linux</b>.</li><li>En celulares: <b>Android</b> e <b>iOS</b>.</li></ul><p>En ciberseguridad vas a usar mucho <b>Linux</b>: es gratis, poderoso y lo usan la mayoría de servidores de internet.</p>`, dato: 'Android está construido sobre el núcleo de Linux. ¡Si tienes Android, ya usas Linux sin saberlo!' },
            { t: 'teoria', titulo: 'Archivos y extensiones', txt: `<p>Un <b>archivo</b> guarda información: una foto, un documento, un programa. Su <b>extensión</b> (lo que va después del punto) dice qué tipo es:</p><ul><li><code>.pdf</code> documento · <code>.jpg</code> foto · <code>.mp3</code> audio</li><li><code>.exe</code> <b>programa de Windows</b> (¡se ejecuta!)</li><li><code>.apk</code> <b>app de Android</b></li></ul><p>⚠️ Windows esconde las extensiones por defecto. Un atacante puede enviarte <code>factura.pdf.exe</code> y tú solo verías <code>factura.pdf</code>.</p>`, dato: 'Activa "Mostrar extensiones de archivo" en el Explorador de Windows (menú Ver). Es un cambio pequeño que te protege mucho.' },
            { t: 'opcion', q: 'Te llega por correo <code>Comprobante_SRI.pdf.exe</code>. ¿Qué es realmente?', ops: ['Un documento PDF', 'Un programa que se ejecutará', 'Una foto', 'Un archivo de texto'], ok: 1, exp: 'Lo que cuenta es la ÚLTIMA extensión: <code>.exe</code>. Es un programa disfrazado de PDF, casi seguro malware.' },
            { t: 'parejas', q: 'Une cada extensión con su tipo', pares: [['.jpg', 'Imagen'], ['.exe', 'Programa de Windows'], ['.apk', 'App de Android'], ['.docx', 'Documento de Word'], ['.mp4', 'Video']] },
            { t: 'vf', q: 'Linux es un sistema operativo gratuito y muy usado en servidores.', ok: true, exp: 'Exacto. La mayoría de servidores web del mundo usan Linux.' },
            { t: 'opcion', q: '¿Qué archivo es el MÁS peligroso de abrir si te lo manda un desconocido?', ops: ['vacaciones.jpg', 'tarea.txt', 'premio_ganador.apk', 'cancion.mp3'], ok: 2, exp: 'Un <code>.apk</code> instala una app en Android. Una app maliciosa puede leer tus mensajes o robar tus datos bancarios.' },
            { t: 'escribir', q: 'Completa: el programa principal que administra la computadora se llama <b>sistema ________</b>', ok: ['operativo'], ph: 'Escribe la palabra', exp: 'Sistema operativo: Windows, Linux, macOS, Android, iOS.' }
          ]
        },
        {
          titulo: 'Bits, bytes y binario', icono: '0️⃣', desc: 'El idioma secreto de las máquinas.',
          steps: [
            { t: 'teoria', titulo: 'Todo son ceros y unos', txt: `<p>Las computadoras solo entienden dos estados: <b>apagado (0)</b> y <b>encendido (1)</b>. Cada 0 o 1 es un <b>bit</b>.</p><ul><li><b>8 bits = 1 byte</b> (alcanza para una letra).</li><li>1 KB ≈ mil bytes · 1 MB ≈ un millón · 1 GB ≈ mil millones.</li></ul><p>Una foto de tu celular pesa unos 3 MB: ¡son unos 24 millones de ceros y unos!</p>`, dato: 'Los megas de tu plan de internet se miden en Mbps: mega<b>bits</b> por segundo. Por eso un plan de 100 Mbps descarga unos 12 mega<b>bytes</b> por segundo.' },
            { t: 'teoria', titulo: 'Contar en binario', txt: `<p>En decimal usamos 10 dígitos (0-9). En <b>binario</b> solo 2 (0 y 1). Cada posición vale el doble que la anterior:</p><p style="font-family:monospace;font-size:1.05em;text-align:center">128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</p><p>Ejemplo: <code>101</code> = 4 + 0 + 1 = <b>5</b>.<br><code>1010</code> = 8 + 0 + 2 + 0 = <b>10</b>.</p>`, dato: 'Las direcciones IP, los permisos de Linux y el cifrado usan binario. Lo vas a necesitar en los siguientes niveles.' },
            { t: 'opcion', q: '¿Cuántos bits tiene un byte?', ops: ['2', '8', '10', '1024'], ok: 1, exp: '1 byte = 8 bits. Con 8 bits puedes representar 256 valores distintos (de 0 a 255).' },
            { t: 'escribir', q: '¿Cuánto vale <code>110</code> en decimal?', ok: ['6', 'seis'], ph: 'Escribe un número', exp: '110 = 4 + 2 + 0 = 6.' },
            { t: 'lab', lab: 'binario', q: 'Usa el conversor: ¿cómo se escribe el número <b>42</b> en binario? (escribe solo los dígitos, sin espacios)', numero: 42, ok: ['101010', '00101010', '0010 1010'], ph: 'Ej: 1010', exp: '42 = 32 + 8 + 2 → 101010.' },
            { t: 'vf', q: 'Con 8 bits, el número más grande que puedes escribir es 255.', ok: true, exp: '11111111 = 128+64+32+16+8+4+2+1 = 255. Por eso las partes de una IP van de 0 a 255.' },
            { t: 'orden', q: 'Ordena de MÁS PEQUEÑO a MÁS GRANDE', items: ['Bit', 'Byte', 'Kilobyte (KB)', 'Megabyte (MB)', 'Gigabyte (GB)'], exp: 'Bit → Byte → KB → MB → GB → TB...' }
          ]
        },
        {
          titulo: 'Internet sin misterio', icono: '🌎', desc: 'Router, servidor, navegador y el candado.',
          steps: [
            { t: 'teoria', titulo: '¿Cómo llega una página a tu pantalla?', txt: `<ol><li>Escribes una dirección (URL) en el <b>navegador</b> (Chrome, Firefox...).</li><li>Tu celular envía la petición al <b>router</b> (el aparato del Wi-Fi).</li><li>El router la manda por internet hasta un <b>servidor</b>: una computadora que guarda la página.</li><li>El servidor responde y tu navegador la muestra.</li></ol><p>Todo esto pasa en menos de un segundo. 🚀</p>`, ec: 'Cuando entras a la página de la ESPE, tu petición viaja desde tu router, pasa por tu proveedor de internet (CNT, Netlife, Claro...) y llega al servidor de la universidad.' },
            { t: 'teoria', titulo: 'HTTP, HTTPS y el candado 🔒', txt: `<p>La URL empieza con <code>http://</code> o <code>https://</code>. La <b>S</b> significa <b>seguro</b>: la información viaja <b>cifrada</b>, así nadie en el camino puede leerla.</p><p>⚠️ Pero ojo: el candado solo dice que la conexión está cifrada, <b>NO que la página sea honesta</b>. Los estafadores también usan HTTPS.</p>`, dato: 'Más del 80% de las páginas de phishing ya usan HTTPS. Revisa siempre que el nombre del sitio sea el correcto.' },
            { t: 'orden', q: 'Ordena el viaje de una página web', items: ['Escribes la URL en el navegador', 'La petición llega a tu router', 'Viaja por internet hasta el servidor', 'El servidor responde con la página', 'El navegador te muestra la página'], exp: 'Navegador → router → internet → servidor → respuesta → navegador.' },
            { t: 'opcion', q: '¿Qué significa la S de HTTPS?', ops: ['Super', 'Seguro (la conexión va cifrada)', 'Servidor', 'Sistema'], ok: 1, exp: 'HTTP Secure: la información viaja cifrada entre tu navegador y el servidor.' },
            { t: 'vf', q: 'Si una página tiene el candado 🔒, seguro que no es una estafa.', ok: false, exp: 'Falso. El candado solo garantiza cifrado. Un sitio falso como <code>banco-volcan-premios.xyz</code> también puede tener candado.' },
            { t: 'parejas', q: 'Une cada término con su definición', pares: [['Navegador', 'Programa para ver páginas web'], ['Servidor', 'Computadora que guarda y entrega páginas'], ['Router', 'Aparato que conecta tu casa a internet'], ['URL', 'Dirección de una página']] },
            { t: 'opcion', q: 'Estás en el Wi-Fi gratis de un centro comercial. ¿Qué página es más segura para escribir una contraseña?', ops: ['http://tiendavolcan.ec/login', 'https://tiendavolcan.ec/login', 'Ambas son iguales', 'Ninguna tiene riesgo'], ok: 1, exp: 'Con HTTPS tu contraseña viaja cifrada. En HTTP, alguien en la misma red Wi-Fi podría leerla.' }
          ]
        }
      ]
    },
    // ======================= UNIDAD 2 =======================
    {
      titulo: '¿Qué es ciberseguridad?', icono: '🛡️', desc: 'La tríada CIA, riesgos y quiénes atacan.',
      lessons: [
        {
          titulo: 'Proteger lo que vale', icono: '💎', desc: 'Por qué tus datos valen oro.',
          steps: [
            { t: 'teoria', titulo: 'Ciberseguridad = proteger la información', txt: `<p>La <b>ciberseguridad</b> es el conjunto de prácticas para <b>proteger computadoras, redes y datos</b> de ataques, robos o daños.</p><p>¿Por qué importa? Porque hoy casi todo es digital: tus notas, tu dinero, tus fotos, tus chats, tu historial médico.</p>`, ec: 'En Ecuador, empresas grandes —incluyendo bancos y una empresa pública de telecomunicaciones— han sufrido ciberataques que paralizaron sus servicios por días. Miles de personas no pudieron hacer transferencias ni pagar.' },
            { t: 'teoria', titulo: 'Tus datos tienen precio', txt: `<p>Para un delincuente, tus datos son dinero:</p><ul><li>Tu <b>cuenta bancaria</b> → robo directo.</li><li>Tu <b>cédula y fotos</b> → suplantar tu identidad o pedir préstamos a tu nombre.</li><li>Tu <b>WhatsApp</b> → pedir dinero a tus contactos haciéndose pasar por ti.</li><li>Tu <b>correo</b> → recuperar contraseñas de TODAS tus otras cuentas.</li></ul>`, dato: 'Tu correo electrónico es la "llave maestra": quien lo controla puede resetear casi todas tus cuentas. Protégelo como a tu billetera.' },
            { t: 'opcion', q: '¿Cuál es la cuenta MÁS importante de proteger?', ops: ['Tu cuenta de un juego', 'Tu correo electrónico', 'Tu cuenta de música', 'Una tienda online que usaste una vez'], ok: 1, exp: 'Con tu correo, un atacante puede usar "¿Olvidaste tu contraseña?" en casi todas tus otras cuentas.' },
            { t: 'vf', q: 'Si no soy famoso ni millonario, a nadie le interesa hackearme.', ok: false, exp: 'Falso. La mayoría de ataques son automáticos y masivos: buscan a cualquiera que caiga. Tu WhatsApp o tu cuenta bancaria son suficiente premio.' },
            { t: 'parejas', q: '¿Qué puede hacer un delincuente con cada dato?', pares: [['Tu WhatsApp', 'Pedir dinero a tus contactos'], ['Tu cédula', 'Suplantar tu identidad'], ['Tu correo', 'Resetear tus otras cuentas'], ['Tu clave del banco', 'Robar tu dinero']] },
            { t: 'escribir', q: 'Completa: la ciberseguridad protege computadoras, redes y ________', ok: ['datos', 'informacion', 'la informacion', 'los datos'], exp: 'Proteger los datos (la información) es el corazón de la ciberseguridad.' }
          ]
        },
        {
          titulo: 'La tríada CIA', icono: '🔺', desc: 'Confidencialidad, Integridad y Disponibilidad.',
          steps: [
            { t: 'teoria', titulo: 'Los 3 pilares de la seguridad', txt: `<p>Todo en ciberseguridad busca proteger 3 cosas. Se llama <b>tríada CIA</b> (por sus siglas en inglés):</p><ul><li>🔒 <b>Confidencialidad:</b> solo quien debe, puede VER la información.</li><li>✅ <b>Integridad:</b> nadie puede CAMBIAR la información sin permiso.</li><li>⚡ <b>Disponibilidad:</b> la información está ahí CUANDO la necesitas.</li></ul>`, dato: 'Nada que ver con la agencia de espionaje 😄. Viene de Confidentiality, Integrity, Availability.' },
            { t: 'teoria', titulo: 'Ejemplos reales', txt: `<ul><li>Alguien lee tus chats privados → se rompió la <b>confidencialidad</b>.</li><li>Alguien cambia tu nota de 6 a 10 en el sistema → se rompió la <b>integridad</b>.</li><li>La página de matrículas se cae el día de inscripciones → se rompió la <b>disponibilidad</b>.</li></ul>`, ec: 'Cuando colapsa la página de matrículas de una universidad por tanta gente entrando a la vez, es un problema de disponibilidad (aunque nadie haya atacado).' },
            { t: 'parejas', q: 'Une cada pilar con su significado', pares: [['Confidencialidad', 'Solo quien debe puede verla'], ['Integridad', 'Nadie la cambia sin permiso'], ['Disponibilidad', 'Está cuando la necesitas']] },
            { t: 'opcion', q: 'Un estudiante entra al sistema y se sube la nota de Matemática. ¿Qué pilar se rompió?', ops: ['Confidencialidad', 'Integridad', 'Disponibilidad', 'Ninguno'], ok: 1, exp: 'Se modificó información sin autorización: se rompió la integridad.' },
            { t: 'opcion', q: 'Un ataque deja la página del banco caída todo el día. ¿Qué pilar se afectó?', ops: ['Confidencialidad', 'Integridad', 'Disponibilidad'], ok: 2, exp: 'Los clientes no pueden usar el servicio: se afectó la disponibilidad. Esos ataques se llaman DoS (denegación de servicio).' },
            { t: 'opcion', q: 'Se filtran en internet los datos personales de millones de ciudadanos. ¿Qué pilar se rompió?', ops: ['Confidencialidad', 'Integridad', 'Disponibilidad'], ok: 0, exp: 'Personas no autorizadas pueden ver los datos: se rompió la confidencialidad.' },
            { t: 'vf', q: 'Una contraseña protege principalmente la confidencialidad.', ok: true, exp: 'Correcto: evita que otros vean tu información. (Indirectamente también protege la integridad.)' }
          ]
        },
        {
          titulo: 'Amenaza, vulnerabilidad y riesgo', icono: '⚠️', desc: 'Tres palabras que confunden a todos.',
          steps: [
            { t: 'teoria', titulo: 'La casa con la ventana abierta', txt: `<p>Imagina tu casa:</p><ul><li>🪟 <b>Vulnerabilidad:</b> una debilidad. Ej: la ventana que no cierra bien.</li><li>🦹 <b>Amenaza:</b> algo o alguien que puede causar daño. Ej: un ladrón en el barrio.</li><li>🎲 <b>Riesgo:</b> la posibilidad de que la amenaza aproveche la vulnerabilidad, y cuánto daño haría.</li></ul><p>Fórmula fácil: <b>Riesgo = Probabilidad × Impacto</b>.</p>`, dato: 'No puedes eliminar todas las amenazas (los ladrones existen), pero sí puedes arreglar vulnerabilidades (cerrar la ventana).' },
            { t: 'teoria', titulo: 'Ahora en digital', txt: `<ul><li><b>Vulnerabilidad:</b> un programa sin actualizar, una contraseña débil, un empleado que no sabe de phishing.</li><li><b>Amenaza:</b> un ciberdelincuente, un virus, incluso un apagón.</li><li><b>Exploit:</b> la técnica o el código que aprovecha una vulnerabilidad.</li></ul>`, dato: 'Cuando tu celular te pide actualizar, muchas veces está tapando vulnerabilidades. ¡No lo postergues!' },
            { t: 'parejas', q: 'Clasifica cada ejemplo', pares: [['Windows sin actualizar hace 2 años', 'Vulnerabilidad'], ['Un grupo de delincuentes informáticos', 'Amenaza'], ['Código que aprovecha una falla', 'Exploit'], ['Probabilidad × Impacto', 'Riesgo']] },
            { t: 'opcion', q: 'Tu contraseña es "123456". Eso es una…', ops: ['Amenaza', 'Vulnerabilidad', 'Exploit', 'Ataque'], ok: 1, exp: 'Es una debilidad que un atacante puede aprovechar: una vulnerabilidad.' },
            { t: 'opcion', q: '¿Qué acción REDUCE una vulnerabilidad?', ops: ['Instalar las actualizaciones pendientes', 'Leer noticias de hackers', 'Cambiar el fondo de pantalla', 'Apagar el monitor'], ok: 0, exp: 'Las actualizaciones corrigen fallas conocidas: cierran la ventana.' },
            { t: 'vf', q: 'Si una vulnerabilidad es muy difícil de aprovechar y causa poco daño, su riesgo es bajo.', ok: true, exp: 'Exacto: baja probabilidad × bajo impacto = riesgo bajo. Así las empresas deciden qué arreglar primero.' },
            { t: 'escribir', q: 'Completa la fórmula: Riesgo = Probabilidad × ________', ok: ['impacto', 'el impacto'], exp: 'Riesgo = Probabilidad × Impacto.' }
          ]
        },
        {
          titulo: '¿Quiénes atacan y por qué?', icono: '🎩', desc: 'Sombreros blancos, negros y grises.',
          steps: [
            { t: 'teoria', titulo: 'Hacker no es lo mismo que delincuente', txt: `<p>Un <b>hacker</b> es alguien con mucha curiosidad que entiende a fondo cómo funcionan los sistemas. Lo que importa es <b>qué hace con ese conocimiento</b>:</p><ul><li>🤍 <b>Sombrero blanco (hacker ético):</b> busca fallas CON PERMISO para arreglarlas. ¡Es tu meta!</li><li>🖤 <b>Sombrero negro:</b> ataca sin permiso para robar o dañar. Es un delincuente.</li><li>🩶 <b>Sombrero gris:</b> entra sin permiso pero "sin mala intención". Igual es ilegal.</li></ul>`, ec: 'En Ecuador, entrar sin permiso a un sistema informático es delito según el artículo 234 del COIP, con pena de 3 a 5 años de prisión. Las buenas intenciones no te salvan: siempre necesitas autorización.' },
            { t: 'teoria', titulo: 'Tipos de atacantes', txt: `<ul><li>💰 <b>Cibercriminales:</b> quieren dinero (estafas, ransomware).</li><li>📢 <b>Hacktivistas:</b> atacan por causas políticas o sociales.</li><li>🏢 <b>Insiders (internos):</b> empleados o ex empleados resentidos.</li><li>🧒 <b>Script kiddies:</b> usan herramientas de otros sin entenderlas.</li><li>🏛️ <b>Grupos patrocinados por estados:</b> espionaje entre países.</li></ul>`, dato: 'Muchos ataques empiezan por un insider descuidado, no malvado: alguien que hizo clic en un correo falso.' },
            { t: 'parejas', q: 'Une cada atacante con su motivación', pares: [['Cibercriminal', 'Dinero'], ['Hacktivista', 'Una causa política'], ['Insider resentido', 'Venganza contra la empresa'], ['Espionaje estatal', 'Secretos de otro país']] },
            { t: 'opcion', q: 'Una empresa te contrata y te FIRMA un permiso para buscar fallas en su web. Eres un…', ops: ['Sombrero negro', 'Sombrero blanco (hacker ético)', 'Sombrero gris', 'Script kiddie'], ok: 1, exp: 'Con autorización por escrito y para ayudar a arreglar: hacker ético. A esto se le llama pentesting.' },
            { t: 'vf', q: 'Si entro a la red Wi-Fi de mi vecino "solo para probar" y no robo nada, no es delito.', ok: false, exp: 'Falso. Acceder sin permiso ya es delito (art. 234 COIP). La intención no cambia eso.' },
            { t: 'opcion', q: 'Alguien descarga una herramienta de YouTube y ataca sin saber cómo funciona. Es un…', ops: ['Hacktivista', 'Script kiddie', 'Pentester', 'Insider'], ok: 1, exp: 'Script kiddie: usa "scripts" de otros sin entenderlos. Igual puede causar daño y cometer delitos.' },
            { t: 'escribir', q: 'Al hacker que trabaja con permiso para proteger se le llama hacker ________', ok: ['etico', 'ético'], exp: 'Hacker ético (o de sombrero blanco). ¡En eso te vas a convertir!' }
          ]
        }
      ]
    },
    // ======================= UNIDAD 3 =======================
    {
      titulo: 'Contraseñas y cuentas', icono: '🔑', desc: 'Claves fuertes, ataques, 2FA y gestores.',
      lessons: [
        {
          titulo: 'Contraseñas fuertes', icono: '💪', desc: 'Larga gana a complicada.',
          steps: [
            { t: 'teoria', titulo: '¿Qué hace fuerte a una contraseña?', txt: `<p>Lo más importante es la <b>LONGITUD</b>. Cada carácter extra multiplica el trabajo del atacante.</p><ul><li>❌ <code>Ecuador1</code> → corta y común.</li><li>❌ <code>J0rd1#</code> → complicada pero corta.</li><li>✅ <code>Cuy-Asado#En-Latacunga26</code> → larga, fácil de recordar, difícil de adivinar.</li></ul><p>A esto se le llama <b>frase de contraseña</b> (passphrase).</p>`, dato: 'Una clave de 8 caracteres se puede romper en horas. Una frase de 20 caracteres tardaría miles de años con la misma tecnología.' },
            { t: 'teoria', titulo: 'Lo que NUNCA debes usar', txt: `<ul><li>Tu nombre, apellido, cédula o fecha de nacimiento.</li><li>Nombres de tu mascota, novia/novio o equipo de fútbol.</li><li>Secuencias: <code>123456</code>, <code>qwerty</code>, <code>abc123</code>.</li><li>La misma contraseña en varias cuentas.</li></ul>`, ec: 'Claves como "barcelona", "emelec", "ldu2008" o "ecuador123" están en todas las listas que usan los atacantes. ¡Son las primeras que prueban!' },
            { t: 'lab', lab: 'password', q: 'Crea una contraseña que llegue al nivel <b>"Fuerte"</b>. Usa una frase con símbolos y números. (¡No uses tu clave real!)', meta: 3, sol: 'Ej: Volcan-Cotopaxi#Nieve2026', exp: '¡Eso es! Fíjate cómo el tiempo para descifrarla sube muchísimo con cada carácter.' },
            { t: 'opcion', q: '¿Cuál es la contraseña MÁS segura?', ops: ['Jhordy2005', 'P@ss', 'Mi-Perro-Come-Mote#2026', 'ecuador123'], ok: 2, exp: 'Es la más larga y mezcla mayúsculas, minúsculas, símbolos y números, sin datos personales obvios.' },
            { t: 'vf', q: 'Es buena idea usar la misma contraseña segura en todas mis cuentas.', ok: false, exp: 'Si una página la filtra, el atacante entra a TODAS tus cuentas. Cada cuenta necesita su propia clave.' },
            { t: 'opcion', q: '¿Qué influye MÁS en la fuerza de una contraseña?', ops: ['Que tenga una mayúscula', 'Su longitud', 'Que tenga tu fecha de cumpleaños', 'Cambiarla cada semana'], ok: 1, exp: 'La longitud es el factor más importante. Una frase larga le gana a una clave corta "complicada".' }
          ]
        },
        {
          titulo: 'Cómo roban contraseñas', icono: '🕵️', desc: 'Fuerza bruta, diccionario y filtraciones.',
          steps: [
            { t: 'teoria', titulo: 'Ataques a contraseñas', txt: `<ul><li>🔨 <b>Fuerza bruta:</b> probar TODAS las combinaciones posibles (a, b, c... aa, ab...). Funciona contra claves cortas.</li><li>📖 <b>Ataque de diccionario:</b> probar listas de claves comunes y palabras reales. Rápido y muy efectivo.</li><li>🔁 <b>Relleno de credenciales:</b> usar correos y claves filtradas de una página para entrar en OTRAS páginas.</li><li>🎣 <b>Phishing:</b> engañarte para que tú mismo la escribas en una página falsa.</li></ul>`, dato: 'Por eso HackAndes bloquea tu cuenta 30 segundos después de 5 intentos fallidos: frena los ataques de fuerza bruta.' },
            { t: 'teoria', titulo: 'Las filtraciones de datos', txt: `<p>Cuando hackean una empresa, a veces publican millones de correos y contraseñas. Esto se llama <b>filtración</b> (data breach).</p><p>Puedes revisar si tu correo apareció en alguna en <b>haveibeenpwned.com</b> (es gratis y legítimo). Si aparece, cambia esa contraseña en todas las cuentas donde la usaste.</p>`, dato: 'Hay listas filtradas con miles de millones de contraseñas reales. Si tu clave está ahí, un ataque de diccionario la encuentra en segundos.' },
            { t: 'parejas', q: 'Une cada ataque con cómo funciona', pares: [['Fuerza bruta', 'Prueba todas las combinaciones'], ['Diccionario', 'Prueba claves comunes de una lista'], ['Relleno de credenciales', 'Usa claves filtradas en otras páginas'], ['Phishing', 'Te engaña para que la escribas tú']] },
            { t: 'opcion', q: 'Usas la misma clave en una tienda online y en tu banco. La tienda es hackeada. ¿Qué ataque te afecta?', ops: ['Fuerza bruta', 'Relleno de credenciales', 'Ataque DoS', 'Ninguno'], ok: 1, exp: 'Los atacantes prueban tu correo y clave filtrados en bancos, redes sociales y correos. Por eso no se repiten claves.' },
            { t: 'vf', q: 'Limitar los intentos de inicio de sesión ayuda a frenar ataques de fuerza bruta.', ok: true, exp: 'Correcto: si solo puedes probar 5 veces cada pocos minutos, probar millones de claves se vuelve imposible.' },
            { t: 'orden', q: 'Tu correo apareció en una filtración. Ordena qué hacer', items: ['Cambiar la contraseña de esa cuenta', 'Cambiarla en todas las cuentas donde la repetías', 'Activar la verificación en dos pasos', 'Revisar si hay movimientos o accesos extraños'], exp: 'Primero cierras la puerta (cambias la clave), luego las otras puertas con la misma llave, agregas un candado extra (2FA) y revisas daños.' }
          ]
        },
        {
          titulo: 'Verificación en dos pasos', icono: '📲', desc: 'El candado extra que frena al 99% de ataques.',
          steps: [
            { t: 'teoria', titulo: '2FA: una segunda llave', txt: `<p>La <b>verificación en dos pasos (2FA)</b> pide algo más que tu contraseña. Así, aunque te roben la clave, no pueden entrar.</p><p>Los factores de autenticación son:</p><ul><li>🧠 <b>Algo que SABES:</b> contraseña, PIN.</li><li>📱 <b>Algo que TIENES:</b> tu celular, una llave USB de seguridad.</li><li>👆 <b>Algo que ERES:</b> huella, rostro.</li></ul>`, dato: 'Cuando usas dos factores DISTINTOS se llama MFA (autenticación multifactor). Contraseña + PIN no cuenta: ambos son "algo que sabes".' },
            { t: 'teoria', titulo: 'Tipos de segundo paso', txt: `<ul><li>💬 <b>Código por SMS:</b> mejor que nada, pero se puede interceptar o robar con un duplicado de chip.</li><li>🔢 <b>App autenticadora</b> (Google Authenticator, Microsoft Authenticator, Aegis): genera códigos que cambian cada 30 segundos. Más segura.</li><li>🔑 <b>Llave física</b> (USB/NFC): la más segura.</li></ul><p>⚠️ <b>Regla de oro: NUNCA le des tu código a nadie.</b> Ni al "banco", ni a un "amigo", ni a "soporte técnico".</p>`, ec: 'Una estafa muy común en Ecuador: te escriben por WhatsApp "te envié un código por error, ¿me lo pasas?". Si lo das, te roban tu cuenta de WhatsApp.' },
            { t: 'parejas', q: 'Clasifica cada factor', pares: [['Contraseña', 'Algo que sabes'], ['Huella digital', 'Algo que eres'], ['App en tu celular', 'Algo que tienes'], ['Reconocimiento facial', 'Algo que eres (rostro)']] },
            { t: 'opcion', q: '¿Cuál de estos SÍ es autenticación multifactor (MFA)?', ops: ['Contraseña + pregunta secreta', 'Contraseña + código de app autenticadora', 'PIN + contraseña', 'Dos contraseñas'], ok: 1, exp: 'Combina algo que sabes (contraseña) con algo que tienes (el celular con la app).' },
            { t: 'mensaje', canal: 'whatsapp', de: '+593 98 *** 2214 (Primo Carlos)', cuerpo: 'Holaa primo 😅 te llegó un código de 6 dígitos por SMS, te lo mandé por error, ¿me lo puedes pasar porfa? Es urgente', ok: 'falso', senales: ['Te pide un código de verificación: eso NUNCA se comparte', 'Urgencia ("es urgente")', 'Aunque sea un contacto conocido, su cuenta pudo ser robada'], exp: 'Ese código es para registrar TU WhatsApp en otro teléfono. Si lo das, pierdes tu cuenta y el atacante pide dinero a tus contactos.' },
            { t: 'vf', q: 'Un empleado real del banco puede pedirte tu código de verificación por teléfono para "confirmar tu identidad".', ok: false, exp: 'Los bancos NUNCA piden códigos, claves ni PIN por teléfono, correo o WhatsApp. Si te lo piden, es estafa.' },
            { t: 'opcion', q: '¿Qué segundo factor es MÁS seguro?', ops: ['SMS', 'App autenticadora', 'Pregunta "¿nombre de tu mascota?"', 'Correo con el mismo password'], ok: 1, exp: 'Las apps autenticadoras generan códigos en tu propio celular: no se pueden interceptar como un SMS.' }
          ]
        },
        {
          titulo: 'Gestores y buenos hábitos', icono: '🗝️', desc: 'Una sola clave maestra para gobernarlas a todas.',
          steps: [
            { t: 'teoria', titulo: 'Gestores de contraseñas', txt: `<p>¿Cómo recordar una clave distinta para cada cuenta? Con un <b>gestor de contraseñas</b>: una bóveda cifrada que guarda todas tus claves. Tú solo recuerdas UNA contraseña maestra (muy fuerte).</p><p>Opciones gratis y confiables: <b>Bitwarden</b> (en la nube) y <b>KeePassXC</b> (sin internet, en tu PC).</p>`, dato: 'Los gestores también generan claves aleatorias y te avisan si una página es falsa: no autocompletan tu clave en un sitio que no es el original.' },
            { t: 'teoria', titulo: 'Hábitos que te protegen', txt: `<ul><li>🔒 Bloquea tu celular y tu PC al alejarte (en Windows: tecla Windows + L).</li><li>🚪 Cierra sesión en computadoras compartidas (cibercafés, laboratorios de la U).</li><li>🙅 No guardes claves en una nota del celular ni en un papel pegado al monitor.</li><li>❓ En las "preguntas de seguridad" puedes inventar respuestas falsas (y guardarlas en tu gestor).</li></ul>`, ec: 'En los laboratorios de computación de la universidad, muchos estudiantes dejan abiertas sus cuentas de correo o redes sociales. ¡Siempre cierra sesión!' },
            { t: 'opcion', q: '¿Cuál es la principal ventaja de un gestor de contraseñas?', ops: ['Que todas tus cuentas tengan la misma clave', 'Tener claves distintas y fuertes sin memorizarlas', 'Que no necesitas ninguna contraseña', 'Que hace más rápido tu internet'], ok: 1, exp: 'Recuerdas una sola clave maestra y el gestor guarda una distinta y fuerte para cada cuenta.' },
            { t: 'vf', q: 'Si te alejas 5 minutos de tu PC en la biblioteca, no hace falta bloquearla.', ok: false, exp: 'En 5 minutos alguien puede leer tus chats, enviar mensajes en tu nombre o instalar algo. Bloquear toma 1 segundo (Windows + L).' },
            { t: 'escribir', q: 'Atajo de teclado para bloquear Windows: tecla Windows + ___ (una letra)', ok: ['l'], ph: 'Una letra', exp: 'Windows + L bloquea la sesión al instante.' },
            { t: 'orden', q: 'Ordena del hábito MENOS seguro al MÁS seguro', items: ['La misma clave corta en todo', 'Claves distintas anotadas en un papel en el monitor', 'Claves distintas y fuertes en un gestor', 'Gestor de contraseñas + verificación en dos pasos'], exp: 'Gestor + 2FA es la combinación ganadora.' },
            { t: 'opcion', q: 'Una página te pregunta "¿Nombre de tu primera mascota?". ¿Qué es lo más seguro?', ops: ['Responder la verdad', 'Inventar una respuesta y guardarla en tu gestor', 'Dejarlo en blanco', 'Poner tu contraseña'], ok: 1, exp: 'Las respuestas reales se pueden averiguar en tus redes sociales. Una respuesta inventada y guardada es mucho más segura.' }
          ]
        }
      ]
    },
    // ======================= UNIDAD 4 =======================
    {
      titulo: 'Phishing e ingeniería social', icono: '🎣', desc: 'Hackear personas: el ataque más común.',
      lessons: [
        {
          titulo: 'Hackear personas', icono: '🧠', desc: 'Los trucos mentales de los estafadores.',
          steps: [
            { t: 'teoria', titulo: '¿Qué es la ingeniería social?', txt: `<p>Es <b>manipular a las personas</b> para que hagan algo que no deberían: dar una contraseña, hacer una transferencia o abrir un archivo.</p><p>¿Por qué funciona? Porque es más fácil engañar a una persona que romper un sistema bien protegido. Se dice que <b>el eslabón más débil es el humano</b>.</p>`, dato: 'La mayoría de ciberataques exitosos empiezan con un correo o mensaje engañoso, no con un "hackeo de película".' },
            { t: 'teoria', titulo: 'Los botones que presionan', txt: `<ul><li>⏰ <b>Urgencia:</b> "¡Tu cuenta se bloqueará en 24 horas!"</li><li>👮 <b>Autoridad:</b> "Somos de la Policía / del banco / del SRI."</li><li>😱 <b>Miedo:</b> "Detectamos un cargo de $500 en tu tarjeta."</li><li>🎁 <b>Codicia:</b> "¡Ganaste un iPhone! Solo paga el envío."</li><li>🤔 <b>Curiosidad:</b> "Mira estas fotos tuyas que están circulando…"</li><li>💞 <b>Confianza:</b> se hacen pasar por un familiar o amigo.</li></ul>`, ec: 'Clásico en Ecuador: "Mami, se me dañó el celular, este es mi nuevo número, ¿me puedes hacer una transferencia urgente?".' },
            { t: 'parejas', q: 'Une cada mensaje con el truco que usa', pares: [['"Tu cuenta se cerrará HOY"', 'Urgencia'], ['"Le habla el gerente del banco"', 'Autoridad'], ['"Ganaste $1.000 en un sorteo"', 'Codicia'], ['"Mira quién publicó tu foto"', 'Curiosidad']] },
            { t: 'vf', q: 'Si un mensaje me pone nervioso y me pide actuar YA, es buena señal para detenerme y verificar.', ok: true, exp: 'La urgencia es la herramienta favorita de los estafadores: no te dejan pensar. Respira y verifica por otro canal.' },
            { t: 'opcion', q: 'Te llama alguien que dice ser "técnico de tu proveedor de internet" y te pide instalar una app para "arreglar tu conexión". ¿Qué haces?', ops: ['Instalo la app, es el técnico', 'Cuelgo y llamo yo al número oficial del proveedor', 'Le doy mi clave del Wi-Fi', 'Le pido que me la mande por WhatsApp'], ok: 1, exp: 'Es una estafa común: la app les da control remoto de tu equipo. Verifica siempre llamando tú al número oficial.' },
            { t: 'escribir', q: 'Al arte de manipular personas para obtener información se le llama ingeniería ________', ok: ['social'], exp: 'Ingeniería social: hackear a la persona, no a la máquina.' }
          ]
        },
        {
          titulo: 'Detecta el phishing', icono: '🔍', desc: 'Las señales de un mensaje falso.',
          steps: [
            { t: 'teoria', titulo: '¿Qué es el phishing?', txt: `<p>El <b>phishing</b> (de "fishing", pescar 🎣) es un mensaje falso que imita a una empresa o persona de confianza para robarte datos o dinero.</p><p><b>Señales de alerta:</b></p><ul><li>🔗 Enlaces raros: <code>bancovolcan-seguridad.xyz</code> en vez de <code>bancovolcan.com.ec</code>.</li><li>📧 Remitente extraño: <code>soporte@banco-volcan.info</code>.</li><li>✍️ Errores de ortografía o saludos genéricos ("Estimado cliente").</li><li>⏰ Urgencia, amenazas o premios demasiado buenos.</li><li>📎 Adjuntos inesperados (.zip, .exe, .html).</li></ul>`, dato: 'Truco: lee el dominio de DERECHA a IZQUIERDA desde la primera "/". En <code>bancovolcan.com.ec.premios.xyz/login</code> el dominio real es <b>premios.xyz</b>, ¡no el banco!' },
            { t: 'teoria', titulo: 'Si dudas, verifica por otro canal', txt: `<p>Nunca uses el enlace ni el número que viene en el mensaje sospechoso. En su lugar:</p><ul><li>Escribe tú mismo la dirección oficial en el navegador.</li><li>Abre la app oficial.</li><li>Llama al número que está detrás de tu tarjeta o en la web oficial.</li></ul><p>Así, aunque el mensaje sea falso, no caes. 🛡️</p>`, ec: 'Los estafadores suelen hacerse pasar por bancos, empresas de envíos, el SRI o la Agencia Nacional de Tránsito (multas falsas). Los nombres que usamos aquí (Banco Volcán, etc.) son inventados para practicar.' },
            { t: 'mensaje', canal: 'sms', de: 'BancoVolcan', cuerpo: 'BANCO VOLCAN: Su cuenta ha sido BLOQUEADA por actividad inusual. Para desbloquear ingrese en las proximas 2 horas: {{bit.ly/volcan-desbloqueo}}', ok: 'falso', senales: ['Enlace acortado (bit.ly) que esconde el destino real', 'Urgencia: "próximas 2 horas"', 'Miedo: "cuenta bloqueada"', 'Los bancos no te piden ingresar datos por un enlace en SMS'], exp: 'Nunca entres por enlaces en SMS. Si te preocupa, abre la app oficial del banco tú mismo.' },
            { t: 'mensaje', canal: 'correo', de: 'Banco Volcán &lt;notificaciones@bancovolcan.com.ec&gt;', asunto: 'Tu estado de cuenta de octubre está disponible', cuerpo: 'Hola Jhordy,\n\nTu estado de cuenta de octubre ya está disponible. Puedes verlo ingresando a nuestra app oficial o a la Banca Web escribiendo bancovolcan.com.ec en tu navegador.\n\nRecuerda: nunca te pediremos claves ni códigos por correo.\n\nBanco Volcán', ok: 'real', senales: ['Remitente con el dominio oficial (bancovolcan.com.ec)', 'Te llama por tu nombre', 'No tiene enlaces ni adjuntos: te pide entrar por tu cuenta', 'Sin urgencia ni amenazas'], exp: 'Este correo es informativo, no te pide datos y te indica entrar por los canales oficiales. Así se ven los correos legítimos.' },
            { t: 'opcion', q: '¿Cuál de estas direcciones pertenece REALMENTE a Banco Volcán (bancovolcan.com.ec)?', ops: ['bancovolcan.com.ec.validar-cuenta.net/login', 'banco-volcan.com', 'bancovolcan.com.ec/personas', 'bancovolcan-ec.xyz'], ok: 2, exp: 'Solo la tercera tiene exactamente el dominio oficial antes de la primera "/". La primera es un truco: el dominio real es validar-cuenta.net.' },
            { t: 'mensaje', canal: 'correo', de: 'Soporte StreamPlus &lt;soporte@streamplus-pagos.info&gt;', asunto: '⚠️ Problema con tu pago - suscripcion suspendida', cuerpo: 'Estimado cliente,\n\nNo pudimos procesar su pago mensual. Su suscripcion sera suspendida en 24 horas.\n\nActualice sus datos de tarjeta aqui: {{streamplus-pagos.info/actualizar}}\n\nAtentamente,\nEquipo StreamPlus', ok: 'falso', senales: ['Dominio raro: streamplus-pagos.info', 'Saludo genérico: "Estimado cliente"', 'Urgencia: 24 horas', 'Pide datos de tarjeta por un enlace', 'Errores (falta de tildes)'], exp: 'Si dudas de un pago, entra a la app oficial y revisa allí. Nunca pongas tu tarjeta desde un enlace de correo.' },
            { t: 'vf', q: 'Si el correo tiene el logo y los colores del banco, es real.', ok: false, exp: 'Copiar un logo toma 5 segundos. Lo que hay que revisar es el remitente, el enlace y lo que te piden.' }
          ]
        },
        {
          titulo: 'Smishing, vishing y WhatsApp', icono: '📞', desc: 'Estafas por SMS, llamadas, QR y chats.',
          steps: [
            { t: 'teoria', titulo: 'Phishing por todos lados', txt: `<ul><li>💬 <b>Smishing:</b> phishing por SMS.</li><li>📞 <b>Vishing:</b> phishing por llamada (voz). Ej: "Le llamamos del área de fraudes del banco…"</li><li>🟢 <b>WhatsApp:</b> robo de cuentas con códigos, falsos familiares, falsas ofertas de empleo.</li><li>🔳 <b>Quishing:</b> códigos QR falsos pegados encima de los reales (en parqueaderos, restaurantes) que te llevan a páginas trampa.</li></ul>`, dato: 'Con inteligencia artificial ya se puede clonar una voz con pocos segundos de audio. Si "tu hijo" te llama pidiendo dinero, cuelga y llámalo tú a su número de siempre.' },
            { t: 'teoria', titulo: 'Protege tu WhatsApp', txt: `<ol><li>Activa la <b>verificación en dos pasos</b>: Ajustes → Cuenta → Verificación en dos pasos (crea un PIN de 6 dígitos).</li><li><b>Nunca</b> compartas el código de 6 dígitos que te llega por SMS.</li><li>Si un contacto te pide dinero por chat, <b>llámalo</b> para confirmar.</li><li>Desconfía de ofertas de trabajo que te piden pagar "para registrarte".</li></ol>`, ec: 'La estafa del "falso familiar" es de las más reportadas en el país: usan una foto de perfil real y un número nuevo, y piden transferencias urgentes.' },
            { t: 'parejas', q: 'Une cada estafa con su nombre', pares: [['Llamada falsa del banco', 'Vishing'], ['SMS con enlace falso', 'Smishing'], ['QR falso en un parqueadero', 'Quishing'], ['Correo falso', 'Phishing']] },
            { t: 'mensaje', canal: 'whatsapp', de: '+593 99 *** 7781', cuerpo: 'Hola mami 😢 se me cayó el celular y este es mi número nuevo. Guárdalo porfa. Necesito que me ayudes con una transferencia de $180 que tengo que pagar hoy, mañana te devuelvo 🙏', ok: 'falso', senales: ['Número desconocido que dice ser un familiar', 'Pide dinero con urgencia', 'Excusa del "celular nuevo"', 'No puedes verificar quién es'], exp: 'Llama al número de siempre de tu familiar o hazle una pregunta que solo él sepa. Nunca transfieras sin confirmar.' },
            { t: 'mensaje', canal: 'sms', de: '7788', cuerpo: 'Banco Volcán: tu codigo de verificacion es 482913. Vence en 5 minutos. NO lo compartas con nadie. Banco Volcán nunca te lo solicitara.', ok: 'real', q: 'Acabas de pedir una transferencia en la app oficial y te llega esto. ¿Es legítimo?', senales: ['Lo pediste tú mismo hace un momento', 'No tiene enlaces', 'Te advierte que NO lo compartas', 'Viene de un número corto del banco'], exp: 'Es el código que TÚ solicitaste. Úsalo solo en la app oficial y jamás se lo dictes a nadie.' },
            { t: 'opcion', q: 'Te llaman: "Somos del banco, detectamos un fraude. Para bloquearlo díganos el código que le acaba de llegar." ¿Qué haces?', ops: ['Le doy el código para que bloqueen el fraude', 'Cuelgo y llamo yo al número oficial del banco', 'Le doy solo la mitad del código', 'Le pido su nombre y se lo doy'], ok: 1, exp: 'El "fraude" es la llamada. El código sirve para que ELLOS hagan una operación en tu cuenta. Cuelga y llama tú.' },
            { t: 'vf', q: 'Escanear cualquier código QR es siempre seguro porque los QR no pueden tener virus.', ok: false, exp: 'Un QR puede llevarte a una página falsa que roba tus datos o descarga una app maliciosa. Revisa la dirección antes de abrirla.' }
          ]
        },
        {
          titulo: 'Reto: Detective anti-phishing', icono: '🕵️', reto: true, desc: 'Pon a prueba tu ojo de detective.',
          steps: [
            { t: 'teoria', titulo: '¿Y si ya caíste?', txt: `<p>Le puede pasar a cualquiera. Lo importante es <b>actuar rápido</b>:</p><ol><li>Cambia la contraseña de la cuenta afectada (y donde la repetías).</li><li>Si diste datos bancarios: llama de inmediato a tu banco para bloquear.</li><li>Activa la verificación en dos pasos.</li><li>Avisa a tus contactos si usaron tu cuenta para estafar.</li><li>Denuncia en la Fiscalía: guarda capturas como evidencia.</li></ol>`, dato: 'No te avergüences: avisar rápido evita que la estafa le llegue a más personas.' },
            { t: 'mensaje', canal: 'correo', de: 'Dirección de Carrera ESPE (simulado) &lt;carrera.ti@espe.edu.ec&gt;', asunto: 'Cambio de aula - Fundamentos de Programación', cuerpo: 'Estimados estudiantes del paralelo A:\n\nLes informamos que la clase de mañana se dictará en el laboratorio 3 del bloque B, en el mismo horario.\n\nSaludos cordiales,\nDirección de Carrera', ok: 'real', senales: ['Dominio institucional correcto', 'Información concreta y esperable', 'No pide datos, no tiene enlaces ni adjuntos', 'Sin urgencia ni amenazas'], exp: 'Es un aviso normal: no te pide nada. Recuerda que los atacantes también pueden imitar correos de la U, así que la clave es revisar QUÉ te piden.' },
            { t: 'mensaje', canal: 'correo', de: 'Soporte Correo ESPE &lt;soporte.espe@correo-institucional.com&gt;', asunto: 'Su buzon esta lleno - verifique ahora', cuerpo: 'Querido usuario,\n\nSu buzón ha superado el límite de almacenamiento. Si no verifica su cuenta en 12 horas, sus correos serán eliminados.\n\nVerifique con su usuario y contraseña institucional: {{correo-institucional.com/espe/verificar}}\n\nDepartamento de TI', ok: 'falso', senales: ['Dominio que NO es de la universidad', 'Pide usuario y contraseña', 'Amenaza de eliminar correos', 'Urgencia: 12 horas', 'Saludo genérico'], exp: 'El clásico "buzón lleno". El área de TI nunca te pide tu contraseña por correo.' },
            { t: 'mensaje', canal: 'sms', de: '+593 96 *** 0042', cuerpo: 'CorreosRapidosEC: Tu paquete esta retenido en aduana. Paga $1,99 de impuesto para liberarlo: {{correos-rapidos-ec.top/pago}}', ok: 'falso', senales: ['Número de celular normal, no de una empresa', 'Monto pequeño para que no lo pienses', 'Dominio extraño (.top)', '¿Esperabas un paquete?'], exp: 'El monto pequeño es el anzuelo: lo que buscan son los datos de tu tarjeta para hacer cargos mucho más grandes.' },
            { t: 'mensaje', canal: 'whatsapp', de: 'Reclutamiento Empleos Andinos', cuerpo: '¡Felicidades! 🎉 Fuiste seleccionado para trabajar desde casa dando "likes" a videos. Ganas $50 diarios. Para activar tu cuenta deposita $20 de inscripción. Cupos limitados!!!', ok: 'falso', senales: ['Trabajo demasiado bueno para ser real', 'Te piden pagar para trabajar', 'Urgencia: "cupos limitados"', 'Nunca aplicaste a ese trabajo'], exp: 'Ningún trabajo real te cobra por contratarte. Es una estafa muy común en redes y WhatsApp.' },
            { t: 'orden', q: 'Diste tu clave del banco en una página falsa. Ordena qué hacer', items: ['Llamar al banco para bloquear la cuenta', 'Cambiar la contraseña desde la app oficial', 'Activar la verificación en dos pasos', 'Hacer la denuncia con capturas como evidencia'], exp: 'Primero detienes el daño (bloqueo), luego aseguras la cuenta, refuerzas y denuncias.' },
            { t: 'opcion', q: '¿Cuál es la MEJOR regla para no caer en phishing?', ops: ['Nunca abrir correos', 'Verificar por un canal oficial antes de dar datos o hacer clic', 'Solo confiar en mensajes con logo', 'Responder al mensaje preguntando si es real'], ok: 1, exp: 'Verificar por otro canal (app oficial, número oficial, escribir la URL tú mismo) desarma casi cualquier phishing.' }
          ]
        }
      ]
    },
    // ======================= UNIDAD 5 =======================
    {
      titulo: 'Malware y cómo protegerte', icono: '🦠', desc: 'Virus, ransomware, keyloggers y defensa.',
      lessons: [
        {
          titulo: 'El zoológico del malware', icono: '🐛', desc: 'Virus, gusanos y troyanos.',
          steps: [
            { t: 'teoria', titulo: '¿Qué es el malware?', txt: `<p><b>Malware</b> = <b>mal</b>icious soft<b>ware</b>: cualquier programa hecho para dañar, espiar o robar.</p><ul><li>🦠 <b>Virus:</b> se pega a otros archivos o programas y se activa cuando los abres.</li><li>🪱 <b>Gusano:</b> se copia SOLO de una computadora a otra por la red, sin que nadie haga clic.</li><li>🐴 <b>Troyano:</b> se disfraza de algo útil (un juego, un "crack", un PDF) pero por dentro es malicioso.</li></ul>`, dato: 'Se llama troyano por el caballo de Troya: un "regalo" que por dentro traía soldados enemigos.' },
            { t: 'teoria', titulo: '¿Cómo entra a tu equipo?', txt: `<ul><li>Programas "crackeados" o piratas (Office, Photoshop, juegos gratis).</li><li>Adjuntos de correos y enlaces falsos.</li><li>Memorias USB de otras personas.</li><li>Apps descargadas fuera de la tienda oficial (.apk).</li><li>Programas sin actualizar con vulnerabilidades.</li></ul>`, ec: 'En muchos centros de copiado y cibercafés, las memorias USB pasan de computadora en computadora... y el malware también. Escanea tu USB antes de abrir archivos.' },
            { t: 'parejas', q: 'Une cada tipo con su característica', pares: [['Virus', 'Se pega a otros archivos'], ['Gusano', 'Se propaga solo por la red'], ['Troyano', 'Se disfraza de programa útil'], ['Malware', 'Cualquier software malicioso']] },
            { t: 'opcion', q: 'Descargas un "Minecraft gratis full crack" y dentro venía un programa que roba contraseñas. ¿Qué tipo de malware es?', ops: ['Gusano', 'Troyano', 'Adware', 'Ninguno'], ok: 1, exp: 'Se disfrazó de algo que querías (un juego gratis): es un troyano. Los cracks son una de las formas más comunes de infectarse.' },
            { t: 'vf', q: 'Un gusano necesita que hagas clic para propagarse a otras computadoras.', ok: false, exp: 'Falso. Lo que hace peligroso a un gusano es que se propaga solo, aprovechando fallas en la red.' },
            { t: 'opcion', q: '¿Cuál es la forma MÁS segura de instalar apps en Android?', ops: ['Archivos .apk que manda un amigo', 'La tienda oficial (Google Play) revisando permisos y reseñas', 'Páginas que dicen "APK premium gratis"', 'Enlaces de un grupo de WhatsApp'], ok: 1, exp: 'La tienda oficial revisa las apps (no es perfecta, pero es mucho más segura). Revisa siempre qué permisos pide.' }
          ]
        },
        {
          titulo: 'Ransomware: el secuestro de datos', icono: '💀', desc: 'Cifran tus archivos y piden rescate.',
          steps: [
            { t: 'teoria', titulo: '¿Qué es el ransomware?', txt: `<p>El <b>ransomware</b> es un malware que <b>cifra (bloquea) todos tus archivos</b> y te pide un <b>rescate</b> (ransom), casi siempre en criptomonedas, para devolverlos.</p><p>Muchas veces también <b>roban los datos</b> antes de cifrarlos y amenazan con publicarlos: a eso se le llama <b>doble extorsión</b>.</p>`, ec: 'El ransomware es uno de los ataques que más daño ha hecho a empresas e instituciones públicas en Ecuador y toda Latinoamérica: sistemas paralizados durante días o semanas.' },
            { t: 'teoria', titulo: 'La mejor defensa: respaldos', txt: `<p>Si tienes copias de seguridad, el ransomware pierde su poder: borras todo, restauras y listo.</p><p><b>Regla 3-2-1:</b></p><ul><li><b>3</b> copias de tus datos.</li><li>En <b>2</b> lugares distintos (ej: PC y disco externo).</li><li><b>1</b> fuera de casa o en la nube.</li></ul><p>⚠️ Desconecta el disco externo después de respaldar: si está conectado, el ransomware también lo cifra.</p>`, dato: 'Los expertos y la policía recomiendan NO pagar el rescate: no hay garantía de que te devuelvan los archivos y financias más ataques.' },
            { t: 'opcion', q: '¿Qué hace el ransomware?', ops: ['Muestra publicidad molesta', 'Cifra tus archivos y pide un rescate', 'Hace más rápida tu PC', 'Solo borra el historial'], ok: 1, exp: 'Secuestra tus datos cifrándolos y pide dinero para "liberarlos".' },
            { t: 'escribir', q: 'Regla de respaldos: 3 copias, 2 lugares distintos y ___ fuera de casa (escribe el número)', ok: ['1', 'uno', 'una'], exp: 'Regla 3-2-1: 3 copias, 2 lugares, 1 fuera de casa.' },
            { t: 'orden', q: 'Tu PC muestra un mensaje de ransomware. Ordena qué hacer', items: ['Desconectar el equipo de internet y de la red', 'Avisar al área de TI o a un experto', 'No pagar el rescate', 'Limpiar o reinstalar el equipo', 'Restaurar los archivos desde un respaldo'], exp: 'Aislar primero evita que se propague a otros equipos. Luego pides ayuda, no pagas, limpias y restauras.' },
            { t: 'vf', q: 'Un respaldo en un disco externo que SIEMPRE está conectado a la PC te protege del ransomware.', ok: false, exp: 'Si está conectado, el ransomware también lo cifra. Respalda y desconecta, o usa respaldos con versiones en la nube.' },
            { t: 'opcion', q: '¿Qué es la "doble extorsión"?', ops: ['Pedir el rescate dos veces', 'Cifrar los datos Y amenazar con publicarlos', 'Atacar dos computadoras', 'Usar dos virus'], ok: 1, exp: 'Aunque tengas respaldos, te amenazan con filtrar tus datos. Por eso también importa la prevención.' }
          ]
        },
        {
          titulo: 'Espías en tu equipo', icono: '👁️', desc: 'Spyware, keyloggers, adware y botnets.',
          steps: [
            { t: 'teoria', titulo: 'Malware que espía', txt: `<ul><li>🕵️ <b>Spyware:</b> espía lo que haces y lo envía al atacante.</li><li>⌨️ <b>Keylogger:</b> registra CADA tecla que presionas: contraseñas, mensajes, números de tarjeta. Puede ser un programa o un pequeño aparato USB conectado entre el teclado y la PC.</li><li>🎮 <b>RAT</b> (troyano de acceso remoto): le da al atacante control total de tu equipo, incluso de la cámara.</li><li>📢 <b>Adware:</b> te llena de publicidad molesta.</li></ul>`, dato: 'Un keylogger físico parece un adaptador USB normal. En computadoras públicas, revisa que no haya nada raro conectado al teclado.' },
            { t: 'teoria', titulo: 'Botnets: ejércitos zombis', txt: `<p>Cuando muchos equipos infectados son controlados por el mismo atacante, forman una <b>botnet</b> (red de bots o "zombis").</p><p>La usan para enviar spam, minar criptomonedas o lanzar ataques <b>DDoS</b>: miles de equipos atacando una página al mismo tiempo para tumbarla.</p><p>Señales de que tu equipo puede estar infectado: muy lento, ventilador a tope sin razón, programas que no instalaste, publicidad por todos lados.</p>`, ec: 'Muchas cámaras de seguridad y routers con la contraseña de fábrica ("admin/admin") terminan formando parte de botnets. Cambia siempre la clave por defecto.' },
            { t: 'parejas', q: 'Une cada malware con lo que hace', pares: [['Keylogger', 'Registra lo que escribes'], ['Adware', 'Muestra publicidad'], ['RAT', 'Control remoto del equipo'], ['Botnet', 'Red de equipos zombis']] },
            { t: 'opcion', q: 'Escribes tu clave del banco en la PC de un cibercafé y al día siguiente te vacían la cuenta. ¿Qué malware pudo haber sido?', ops: ['Adware', 'Keylogger', 'Gusano', 'Ninguno, es imposible'], ok: 1, exp: 'Un keylogger registró tu contraseña. Evita entrar a tu banco desde computadoras públicas.' },
            { t: 'vf', q: 'Un keylogger puede ser un aparato físico, no solo un programa.', ok: true, exp: 'Sí: existen keyloggers USB que se conectan entre el teclado y la computadora.' },
            { t: 'opcion', q: '¿Qué hace una botnet en un ataque DDoS?', ops: ['Roba una contraseña', 'Miles de equipos saturan un servicio al mismo tiempo', 'Cifra los archivos', 'Envía un solo correo'], ok: 1, exp: 'DDoS = denegación de servicio distribuida: tantas peticiones a la vez que la página se cae. Ataca la DISPONIBILIDAD.' },
            { t: 'opcion', q: 'Compraste una cámara Wi-Fi para tu casa. ¿Qué es lo PRIMERO que debes hacer?', ops: ['Dejar la clave de fábrica', 'Cambiar la contraseña por defecto por una fuerte', 'Publicar su IP en redes', 'Nada, ya viene segura'], ok: 1, exp: 'Las claves de fábrica son públicas. Los bots las prueban automáticamente en todo internet.' }
          ]
        },
        {
          titulo: 'Reto: Escudo total', icono: '🛡️', reto: true, desc: 'Cómo protegerte de verdad.',
          steps: [
            { t: 'teoria', titulo: 'Tu kit de defensa', txt: `<ul><li>🔄 <b>Actualiza</b> sistema y apps (activa actualizaciones automáticas).</li><li>🛡️ <b>Antivirus:</b> en Windows 10/11 ya viene <b>Microsoft Defender</b>, gratis y bueno. Mantenlo activo.</li><li>🏪 Descarga solo de sitios y tiendas <b>oficiales</b>. Nada de cracks.</li><li>🔌 Escanea las <b>USB</b> antes de abrirlas y no conectes memorias que encuentres "perdidas".</li><li>📱 Revisa los <b>permisos</b> de tus apps: ¿una linterna necesita tus contactos?</li><li>💾 Haz <b>respaldos</b> con la regla 3-2-1.</li></ul>`, dato: 'Hay atacantes que dejan memorias USB "olvidadas" a propósito en parqueaderos de empresas. La curiosidad hace que alguien la conecte… y el malware entra.' },
            { t: 'opcion', q: 'Encuentras una memoria USB tirada en el parqueadero de la U con la etiqueta "Notas finales". ¿Qué haces?', ops: ['La conecto para ver de quién es', 'La entrego a seguridad sin conectarla', 'La conecto en la PC del laboratorio', 'Me la quedo y la formateo en mi PC'], ok: 1, exp: 'Puede ser una trampa (se llama "USB drop"). Entrégala sin conectarla a ningún equipo.' },
            { t: 'parejas', q: 'Une cada amenaza con su defensa', pares: [['Ransomware', 'Respaldos 3-2-1'], ['Vulnerabilidad conocida', 'Actualizar'], ['App que pide demasiados permisos', 'Revisar y negar permisos'], ['Programa pirata', 'Descargar solo de sitios oficiales']] },
            { t: 'vf', q: 'Windows 10 y 11 ya traen un antivirus gratuito incluido.', ok: true, exp: 'Microsoft Defender viene incluido y activado. No necesitas "antivirus milagrosos" que aparecen en anuncios.' },
            { t: 'opcion', q: 'Aparece un anuncio: "¡Tu PC tiene 37 virus! Descarga nuestro limpiador YA". ¿Qué es?', ops: ['Una alerta real de Windows', 'Probablemente scareware: un falso antivirus', 'Un aviso del gobierno', 'Un mensaje de tu proveedor de internet'], ok: 1, exp: 'Se llama scareware: te asusta para que instales malware o pagues por nada. Las alertas reales vienen de tu antivirus instalado, no de páginas web.' },
            { t: 'lab', lab: 'password', q: 'Último reto del Nivel 1: crea una contraseña <b>"Muy fuerte"</b> (frase larga con símbolos y números).', meta: 4, sol: 'Ej: Mi-Condor-Vuela#Sobre-El-Cotopaxi-2026', exp: '¡Maestro de las contraseñas! Ya tienes las bases para proteger tus cuentas.' },
            { t: 'orden', q: 'Ordena de MENOR a MAYOR protección', items: ['Sin antivirus y con programas piratas', 'Antivirus activo pero sin actualizar Windows', 'Antivirus + actualizaciones al día', 'Antivirus + actualizaciones + respaldos 3-2-1 + 2FA'], exp: 'La seguridad funciona en capas: cada capa extra hace mucho más difícil el ataque. A esto se le llama "defensa en profundidad".' },
            { t: 'vf', q: 'Si sigo todos estos consejos, es imposible que me hackeen.', ok: false, exp: 'La seguridad 100% no existe. Pero con estas capas te vuelves un blanco MUY difícil, y los atacantes prefieren objetivos fáciles.' }
          ]
        }
      ]
    }
  ],
  glosario: [
    ['Adware', 'Malware que muestra publicidad no deseada.'],
    ['Amenaza', 'Algo o alguien que puede causar daño a un sistema o a la información.'],
    ['Binario', 'Sistema de numeración con solo dos dígitos: 0 y 1. Es el idioma de las computadoras.'],
    ['Bit', 'La unidad mínima de información: un 0 o un 1.'],
    ['Botnet', 'Red de equipos infectados ("zombis") controlados por un atacante.'],
    ['Byte', 'Grupo de 8 bits. Alcanza para guardar una letra.'],
    ['CPU', 'El procesador o "cerebro" de la computadora.'],
    ['DDoS', 'Ataque de denegación de servicio distribuido: muchos equipos saturan un servicio para tumbarlo.'],
    ['Disponibilidad', 'Pilar de la seguridad: la información está accesible cuando se necesita.'],
    ['Exploit', 'Código o técnica que aprovecha una vulnerabilidad.'],
    ['Extensión', 'Letras después del punto en el nombre de un archivo (.pdf, .exe) que indican su tipo.'],
    ['Filtración de datos', 'Cuando información privada (como contraseñas) se publica o es robada de una empresa.'],
    ['Fuerza bruta', 'Ataque que prueba todas las combinaciones posibles de una contraseña.'],
    ['Gestor de contraseñas', 'Bóveda cifrada que guarda todas tus contraseñas. Ej: Bitwarden, KeePassXC.'],
    ['Gusano', 'Malware que se propaga solo de un equipo a otro por la red.'],
    ['Hacker ético', 'Experto que busca fallas CON PERMISO para que se corrijan. También llamado sombrero blanco.'],
    ['Hardware', 'Las partes físicas de una computadora.'],
    ['HTTPS', 'Versión segura de HTTP: la información viaja cifrada entre tu navegador y el servidor.'],
    ['Ingeniería social', 'Manipular a personas para que revelen información o hagan algo indebido.'],
    ['Integridad', 'Pilar de la seguridad: la información no se modifica sin autorización.'],
    ['Keylogger', 'Programa o aparato que registra todo lo que escribes en el teclado.'],
    ['Malware', 'Cualquier software malicioso: virus, gusanos, troyanos, ransomware, spyware…'],
    ['MFA / 2FA', 'Autenticación de varios factores: además de la contraseña, se pide algo que tienes o eres.'],
    ['Phishing', 'Mensaje falso que imita a alguien de confianza para robar datos o dinero.'],
    ['Quishing', 'Phishing con códigos QR falsos.'],
    ['RAM', 'Memoria de trabajo de la computadora. Es rápida y se borra al apagar.'],
    ['Ransomware', 'Malware que cifra tus archivos y pide un rescate para devolverlos.'],
    ['Regla 3-2-1', 'Tener 3 copias de los datos, en 2 lugares distintos y 1 fuera de casa.'],
    ['Relleno de credenciales', 'Usar contraseñas filtradas de un sitio para entrar en otros sitios.'],
    ['Riesgo', 'Probabilidad de que una amenaza aproveche una vulnerabilidad, multiplicada por el impacto.'],
    ['Router', 'Aparato que conecta tu red de casa con internet.'],
    ['Scareware', 'Falsos avisos que te asustan ("¡tienes virus!") para que instales malware o pagues.'],
    ['Script kiddie', 'Persona que usa herramientas de ataque de otros sin entender cómo funcionan.'],
    ['Servidor', 'Computadora que ofrece servicios o páginas a otras computadoras.'],
    ['Sistema operativo', 'Programa principal que administra el hardware: Windows, Linux, Android…'],
    ['Smishing', 'Phishing por SMS.'],
    ['Software', 'Los programas de una computadora.'],
    ['Spyware', 'Malware que espía tu actividad y la envía al atacante.'],
    ['Tríada CIA', 'Los tres pilares de la seguridad: Confidencialidad, Integridad y Disponibilidad.'],
    ['Troyano', 'Malware disfrazado de programa útil.'],
    ['URL', 'Dirección de una página web.'],
    ['Virus', 'Malware que se adhiere a otros archivos y se activa al abrirlos.'],
    ['Vishing', 'Phishing por llamada telefónica.'],
    ['Vulnerabilidad', 'Debilidad que un atacante puede aprovechar.'],
    ['Confidencialidad', 'Pilar de la seguridad: solo las personas autorizadas pueden ver la información.']
  ],
  tips: [
    'Activa "Mostrar extensiones de archivo" en Windows para descubrir archivos disfrazados como factura.pdf.exe.',
    'Windows + L bloquea tu PC al instante. Úsalo siempre que te levantes.',
    'Tu correo es la llave maestra de todas tus cuentas: ponle la contraseña más fuerte y 2FA.',
    'Los bancos nunca te pedirán claves ni códigos por teléfono, correo o WhatsApp.',
    'En WhatsApp: Ajustes → Cuenta → Verificación en dos pasos. ¡Actívala hoy!',
    'Lee los dominios de derecha a izquierda desde la primera "/" para descubrir el sitio real.',
    'Las actualizaciones no son molestias: son parches que cierran puertas a los atacantes.',
    'Una memoria USB "perdida" puede ser una trampa. No la conectes.',
    'El candado de HTTPS significa "cifrado", no "confiable".',
    'Una frase de contraseña larga le gana a una clave corta y complicada.',
    'Hacker no es sinónimo de delincuente: el hacker ético trabaja con permiso para proteger.',
    'Cambia siempre la contraseña de fábrica de tu router y tus cámaras Wi-Fi.'
  ]
});
