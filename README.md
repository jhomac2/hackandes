# 🛡️ HackAndes

**Aprende ciberseguridad desde cero hasta nivel avanzado, estilo Duolingo.**
Gratis, en español, con ejemplos de Ecuador 🇪🇨, y funciona **sin internet** y **sin instalar nada**.

![Versión](https://img.shields.io/badge/versión-1.0.0-6C3CE1) ![Offline](https://img.shields.io/badge/funciona-sin%20internet-F5B82E) ![Licencia](https://img.shields.io/badge/licencia-MIT-FF6B4A)

---

## ✨ ¿Qué tiene?

- 🗺️ **Camino de lecciones** con niveles, unidades y retos, como en Duolingo.
- 🦁 **Mascota que evoluciona**: elige león, lobo o cóndor. Pasa por 5 etapas hasta su **Fusión Legendaria**.
- 🛡️ **Firewall** (5 escudos por lección), ⚡ **Uptime** (racha de días), ⭐ **XP**, 🎯 meta diaria y 🏆 23 logros.
- 💻 **Terminal de Linux simulada** para practicar comandos desde cualquier PC o celular.
- 🧪 **Laboratorio**: medidor y generador de contraseñas, cifrado César, Base64, binario, hash SHA-256, login vulnerable (inyección SQL), comentarios (XSS), detector de phishing y guía para armar tu laboratorio real.
- 🔁 **Repaso** de tus errores y práctica mezclada.
- 📖 **Glosario** con buscador y **guías** de cada unidad.
- 📜 **Certificados** imprimibles por nivel.
- 🔐 **Cuentas con contraseña**: se guarda el *hash* con sal (nunca la clave), con código de recuperación, bloqueo por intentos fallidos y bloqueo automático por inactividad.
- 💾 **Respaldo cifrado** (AES-GCM) para pasar tu progreso a otra PC o celular.
- 🌙 Modo oscuro, letra grande y sonidos.

## 📚 Temario

| Nivel | Unidades |
|---|---|
| **1 · Básico** (desde cero) | La compu por dentro · ¿Qué es ciberseguridad? · Contraseñas y cuentas · Phishing e ingeniería social · Malware y cómo protegerte |
| **2 · Intermedio** | Redes · Linux y terminal · Criptografía · Seguridad web · Hacking ético y tu laboratorio |
| **3 · Avanzado** | Pentesting · OSINT · Escalada de privilegios · Active Directory · Blue team · Forense y malware · Nube · Informes y certificaciones · CTF final |

## 🚀 Cómo usarlo

**Opción 1 · Sin internet:** descarga el proyecto (botón verde **Code → Download ZIP**), descomprímelo y abre `index.html` con Chrome, Edge o Firefox.

**Opción 2 · En línea (GitHub Pages):** entra a la página del proyecto en GitHub Pages. Desde el celular puedes usar **"Agregar a pantalla de inicio"** para instalarla como app; después funciona sin internet.

> Tu progreso se guarda **solo en tu navegador**. Usa **Más → Respaldo** para descargar una copia cifrada y no perder nada.

## 🗂️ Estructura

```
index.html            Página principal
css/                  Estilos (app.css) y tipografías incrustadas (fuentes.css)
js/core.js            Registro de niveles
js/app.js             Cuentas, mapa, perfil, logros, respaldo, certificados
js/lesson.js          Motor de lecciones, ejercicios y laboratorio
js/terminal.js        Terminal de Linux simulada
js/mascot.js          Mascotas dibujadas en SVG (5 etapas)
js/sha256.js          Hash SHA-256 para contraseñas
data/nivel1.js ...    Contenido de cada nivel (lecciones, glosario, tips)
tests/                Pruebas automáticas
```

### ✏️ Agregar o editar lecciones

Todo el contenido está en `data/nivelX.js`. Cada lección es una lista de pasos. Ejemplo:

```js
{ t: 'opcion', q: '¿Qué significa la S de HTTPS?', ops: ['Super', 'Seguro', 'Servidor'], ok: 1, exp: 'La conexión va cifrada.' }
```

Tipos disponibles: `teoria`, `opcion`, `vf`, `escribir`, `orden`, `parejas`, `mensaje` (phishing), `terminal` y `lab`.

Para revisar que el contenido no tenga errores:

```bash
node tests/validar_datos.js
```

## ⚖️ Uso ético

Todo lo que se enseña aquí es para **defender**. Practica solo en tus propios laboratorios o en plataformas que te dan permiso. En Ecuador, acceder sin autorización a un sistema informático es delito (art. 234 del COIP).

## 👤 Autor

Creado por **Jhordy Cabascango** · Estudiante de Sistemas de la Información y Ciberseguridad · ESPE Sede Latacunga 🇪🇨
TikTok: [@jhordycabascango21](https://www.tiktok.com/@jhordycabascango21)

## 📄 Licencia

Código bajo licencia MIT. Tipografías Fredoka y Nunito bajo SIL Open Font License (ver carpeta `licencias/`).
