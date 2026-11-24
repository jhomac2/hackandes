"""Prueba completa de HackAndes con un navegador real (Chrome).
Un 'estudiante robot' crea su cuenta, hace TODAS las lecciones, se equivoca a propósito,
prueba el respaldo cifrado, el bloqueo por intentos, el modo oscuro y toma capturas."""
import sys, os, json, re, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = sys.argv[1] if len(sys.argv) > 1 else 'file://' + ROOT + '/index.html'
SHOTS = '/tmp/shots'; os.makedirs(SHOTS, exist_ok=True)
CLAVE = 'Cuy-Asado#En-Latacunga26'
errores_consola = []
fallos = []
def check(cond, msg):
    print(('  ✅ ' if cond else '  ❌ ') + msg)
    if not cond: fallos.append(msg)

def responder(pg, equivocarse=False):
    """Responde el paso actual. Devuelve el tipo."""
    paso = pg.evaluate("() => { const S = HA.Leccion.estado(); if (!S || S.fin) return null; const p = S.cola[S.i].paso; return JSON.parse(JSON.stringify(p)); }")
    if paso is None: return None
    t = paso['t']
    if t == 'teoria':
        pg.click('#lnext'); return t
    if t in ('opcion', 'vf', 'mensaje'):
        if t == 'opcion':
            i = paso['ok'] if not equivocarse else (paso['ok'] + 1) % len(paso['ops'])
            pg.click(f'.opcion[data-i="{i}"]')
        elif t == 'vf':
            v = paso['ok'] != equivocarse
            pg.click(f'.opcion[data-v="{1 if v else 0}"]')
        else:
            v = paso['ok'] if not equivocarse else ('real' if paso['ok'] == 'falso' else 'falso')
            pg.click(f'.opcion[data-v="{v}"]')
        pg.click('#lcheck')
    elif t == 'escribir':
        pg.fill('#esc', 'respuesta equivocada xyz' if equivocarse else paso['ok'][0]); pg.click('#lcheck')
    elif t == 'orden':
        n = len(paso['items'])
        orden = list(range(n))
        if equivocarse: orden = orden[::-1]
        for i in orden: pg.click(f'#opool .ficha[data-i="{i}"]')
        pg.click('#lcheck')
    elif t == 'parejas':
        for i in range(len(paso['pares'])):
            pg.click(f'[data-l="{i}"]'); pg.click(f'[data-r="{i}"]')
    elif t == 'terminal':
        for c in paso['sol']:
            pg.fill('#tin', c); pg.press('#tin', 'Enter')
        if paso['check'].get('flag'):
            pg.fill('#tflag', paso['check']['flag']); pg.click('#tflagok')
    elif t == 'lab':
        lab = paso['lab']
        if paso.get('ok'):
            pg.fill('#lans', paso['ok'][0]); pg.click('#lansok')
        elif lab == 'password':
            pg.fill('#lpw', re.sub(r'^Ej:\s*', '', paso['sol']))
        elif lab == 'sqli':
            pg.fill('#su', paso['sol']); pg.click('#sgo')
        elif lab == 'xss':
            pg.fill('#xc', paso['sol']); pg.click('#xgo')
    pg.wait_for_selector('#lnext', timeout=4000)
    pg.click('#lnext')
    return t

def hacer_leccion(pg, lid, equivocar_en=None):
    pg.evaluate(f"HA.Leccion.abrir('{lid}')")
    n = 0
    while True:
        st = pg.evaluate("() => { const S = HA.Leccion.estado(); return S ? {fin: !!S.fin, i: S.i, len: S.cola.length} : null }")
        if st is None or st['fin']: break
        if pg.query_selector('.resultado'): break
        tipo = responder(pg, equivocarse=(equivocar_en is not None and n == equivocar_en))
        n += 1
        if n > 80: raise Exception('Lección infinita ' + lid)
    pg.wait_for_selector('.resultado', timeout=4000)
    # cerrar modal de evolución si aparece
    pg.wait_for_timeout(1000)
    if pg.query_selector('#evok'): pg.click('#evok')
    return n

with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx = b.new_context(viewport={'width': 1280, 'height': 860}, accept_downloads=True)
    pg = ctx.new_page(); pg.set_default_timeout(15000)
    pg.on('console', lambda m: errores_consola.append(m.text) if m.type == 'error' else None)
    pg.on('pageerror', lambda e: errores_consola.append('PAGEERROR ' + str(e)))
    pg.on('dialog', lambda d: (errores_consola.append('DIALOG ' + d.message), d.dismiss()))
    print('▶ Abriendo', URL)
    pg.goto(URL); pg.wait_for_timeout(400)
    pg.screenshot(path=f'{SHOTS}/01-bienvenida.png')

    print('▶ Registro')
    pg.click('text=Empezar ahora')
    pg.fill('#rn', 'Jhordy'); pg.fill('#ru', 'jhordy21'); pg.click('#sig')
    pg.fill('#rc', '123456'); pg.fill('#rc2', '123456'); pg.click('#sig')
    check('Débil' in pg.inner_text('#err') or 'Aceptable' in pg.inner_text('#err') or 'Mínimo' in pg.inner_text('#err'), 'Rechaza contraseña débil: ' + pg.inner_text('#err'))
    pg.fill('#rc', CLAVE); pg.fill('#rc2', CLAVE)
    pg.screenshot(path=f'{SHOTS}/02-registro-clave.png')
    pg.click('#sig')
    pg.click('[data-an="condor"]'); pg.click('[data-an="leon"]')
    pg.screenshot(path=f'{SHOTS}/03-elige-mascota.png')
    pg.click('#sig')
    pg.wait_for_selector('#codigo')
    codigo = pg.inner_text('#codigo')
    check(re.match(r'^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$', codigo) is not None, 'Código de recuperación: ' + codigo)
    pg.check('#guarde'); pg.click('#seguir')
    pg.wait_for_selector('.shell'); pg.wait_for_timeout(500)
    pg.screenshot(path=f'{SHOTS}/04-bienvenida-modal.png')
    if pg.query_selector('#modal'): pg.click('#modal .btn')
    raw = pg.evaluate("localStorage.getItem('hackandes:v1')")
    check(CLAVE not in raw, 'La contraseña NO se guarda en texto plano')
    check(codigo.replace('-', '') not in raw, 'El código de recuperación NO se guarda en texto plano')
    pg.screenshot(path=f'{SHOTS}/05-mapa.png')

    print('▶ Lección 1 con un error a propósito')
    pasos = hacer_leccion(pg, 'n1-u1-l1', equivocar_en=2)
    pg.screenshot(path=f'{SHOTS}/06-resultado.png')
    st = pg.evaluate("(() => { const p = HA.perfil(); return {xp: p.xp, err: p.errores.length, hechas: Object.keys(p.hechas).length, racha: p.racha.n} })()")
    check(st['hechas'] == 1 and st['xp'] == 10 and st['racha'] == 1, f'Progreso tras lección 1: {st}')

    print('▶ Captura de una lección en curso (opción, terminal, parejas, mensaje)')
    pg.evaluate("HA.Leccion.abrir('n1-u1-l2')"); pg.click('#lnext'); pg.click('#lnext')
    pg.screenshot(path=f'{SHOTS}/07-leccion-opcion.png')
    pg.click('.opcion[data-i="1"]'); pg.click('#lcheck'); pg.wait_for_timeout(200)
    pg.screenshot(path=f'{SHOTS}/08-leccion-ok.png')
    pg.click('#lnext'); pg.screenshot(path=f'{SHOTS}/09-parejas.png')
    pg.evaluate("HA.ir('aprender')")

    print('▶ Fallar hasta perder el firewall')
    pg.evaluate("HA.Leccion.abrir('n1-u1-l2')")
    perdidas = 0
    for _ in range(40):
        if pg.query_selector('#dotra'): break
        tipo = pg.evaluate("HA.Leccion.estado().cola[HA.Leccion.estado().i].paso.t")
        if tipo in ('teoria', 'parejas'): responder(pg)
        else:
            responder(pg, equivocarse=True); perdidas += 1
    check(pg.query_selector('#dotra') is not None, f'Pantalla "Tu firewall cayó" tras {perdidas} errores')
    pg.screenshot(path=f'{SHOTS}/10-derrota.png')
    pg.click('#dsalir')

    print('▶ Completar TODAS las lecciones disponibles')
    ids = pg.evaluate("HA.IDX.lecciones.map(l => l.id)")
    evos = []
    for lid in ids:
        if pg.evaluate(f"HA.hecha(HA.perfil(), '{lid}')"): continue
        ab = pg.evaluate(f"HA.leccionAbierta(HA.perfil(), HA.IDX.porId['{lid}'])")
        check(ab, f'{lid} desbloqueada en orden') if not ab else None
        antes = pg.evaluate("HA.etapa(HA.perfil())")
        pg.evaluate(f"HA.Leccion.abrir('{lid}')")
        n = 0
        while not pg.query_selector('.resultado'):
            responder(pg); n += 1
            if n > 80: raise Exception('loop ' + lid)
        pg.wait_for_timeout(1000)
        if pg.query_selector('#evok'):
            evos.append(pg.evaluate("HA.etapa(HA.perfil())"))
            pg.screenshot(path=f'{SHOTS}/11-evolucion-{evos[-1]}.png')
            pg.click('#evok')
    final = pg.evaluate("(() => { const p = HA.perfil(); return {xp: p.xp, hechas: Object.keys(p.hechas).length, etapa: HA.etapa(p), logros: Object.keys(p.logros), total: HA.IDX.lecciones.length} })()")
    check(final['hechas'] == final['total'], f"Lecciones completadas {final['hechas']}/{final['total']}")
    print('   Evoluciones vistas:', evos, ' Etapa final:', final['etapa'], ' XP:', final['xp'])
    print('   Logros:', final['logros'])
    pg.evaluate("HA.ir('aprender')"); pg.wait_for_timeout(300)
    pg.screenshot(path=f'{SHOTS}/12-mapa-final.png', full_page=False)

    print('▶ Repaso y certificado')
    pg.evaluate("HA.ir('repaso')"); pg.screenshot(path=f'{SHOTS}/13-repaso.png')
    pg.click('#repMix')
    n = 0
    while not pg.query_selector('.resultado'):
        responder(pg); n += 1
        if n > 40: break
    check(pg.query_selector('.resultado') is not None, 'Práctica mezclada completada')
    pg.wait_for_timeout(900)
    if pg.query_selector('#evok'): pg.click('#evok')
    pg.evaluate("HA.ir('perfil')"); pg.wait_for_timeout(300); pg.screenshot(path=f'{SHOTS}/14-perfil.png', full_page=True)
    if pg.query_selector('[data-cert="n1"]'):
        pg.click('[data-cert="n1"]'); pg.wait_for_timeout(300); pg.screenshot(path=f'{SHOTS}/15-certificado.png')
        check(True, 'Certificado del Nivel 1 disponible'); pg.evaluate("HA.cerrarModal()")
    else: check(False, 'Certificado del Nivel 1 disponible')

    print('▶ Laboratorio')
    pg.evaluate("HA.ir('laboratorio')"); pg.screenshot(path=f'{SHOTS}/16-laboratorio.png')
    pg.click('[data-tool="terminal"]')
    for c in ['cat LEEME.txt', 'ls -la', 'cat .bandera_oculta', 'find . -name "*.txt"', 'cat fotos/viaje/banos/nota_secreta.txt', 'cat mensaje.txt | base64 -d']:
        pg.fill('#tin', c); pg.press('#tin', 'Enter')
    pg.wait_for_timeout(300)
    check('3/3' in pg.inner_text('#bcont'), 'Terminal libre: 3 banderas encontradas')
    pg.screenshot(path=f'{SHOTS}/17-terminal-libre.png')
    for tool in ['password', 'generador', 'cesar', 'base64', 'binario', 'hash', 'sqli', 'xss', 'phishing', 'recursos', 'real']:
        pg.evaluate("HA.ir('laboratorio')"); pg.click(f'[data-tool="{tool}"]'); pg.wait_for_timeout(80)
    pg.evaluate("HA.ir('laboratorio')"); pg.click('[data-tool="sqli"]')
    pg.fill('#su', "' OR '1'='1' --"); pg.click('#sgo')
    check('Entraste' in pg.inner_text('#sres'), 'Login vulnerable: inyección SQL funciona')
    pg.check('#sseg'); pg.click('#sgo')
    check('bloqueado' in pg.inner_text('#sres').lower(), 'Login con protección: inyección bloqueada')
    pg.screenshot(path=f'{SHOTS}/18-sqli.png')
    pg.evaluate("HA.ir('laboratorio')"); pg.click('[data-tool="cesar"]'); pg.screenshot(path=f'{SHOTS}/19-cesar.png')

    print('▶ Respaldo cifrado (exportar e importar)')
    pg.evaluate("HA.ir('mas','respaldo')")
    pg.click('#exp'); pg.fill('#pc', CLAVE)
    with pg.expect_download() as dl:
        pg.click('#modal [data-r="1"]')
    path = dl.value.path(); contenido = open(path).read()
    data = json.loads(contenido)
    check(data['cifrado'] is True and 'Jhordy' not in contenido and CLAVE not in contenido, 'Respaldo descargado y CIFRADO (no se leen los datos)')
    xp_antes = pg.evaluate("HA.perfil().xp")
    pg.evaluate("(() => { const p = HA.perfil(); p.xp = 0; HA.guardar(); })()")
    pg.evaluate("t => { HA.importarRespaldo(t); }", contenido)
    pg.wait_for_selector('#pc'); pg.fill('#pc', 'claveIncorrecta'); pg.click('#modal [data-r="1"]'); pg.wait_for_timeout(1200)
    check(pg.evaluate("HA.perfil().xp") == 0, 'Restaurar con clave incorrecta: NO se restaura')
    pg.evaluate("t => { HA.importarRespaldo(t); }", contenido)
    pg.wait_for_selector('#pc'); pg.fill('#pc', CLAVE); pg.click('#modal [data-r="1"]')
    pg.wait_for_selector('#modal [data-r="1"]'); pg.click('#modal [data-r="1"]')  # confirmar reemplazo
    pg.wait_for_timeout(1500)
    check(pg.evaluate("HA.perfil().xp") == xp_antes, f'Restaurar con clave correcta: XP recuperada ({xp_antes})')

    print('▶ Ajustes: modo oscuro')
    pg.evaluate("HA.ir('mas','ajustes')"); pg.click('label.switch:has([data-aj="oscuro"])')
    check(pg.evaluate("document.body.classList.contains('oscuro')"), 'Modo oscuro activado')
    pg.evaluate("HA.ir('aprender')"); pg.wait_for_timeout(300); pg.screenshot(path=f'{SHOTS}/20-oscuro.png')
    pg.evaluate("HA.ir('mas','glosario')"); pg.fill('#gq', 'phish'); pg.wait_for_timeout(100)
    check('Phishing' in pg.inner_text('#gl'), 'Glosario: buscador funciona')
    pg.screenshot(path=f'{SHOTS}/21-glosario.png')

    print('▶ Cerrar sesión, clave incorrecta y bloqueo')
    pg.evaluate("HA.cerrarSesion()")
    pg.click('[data-login]')
    for i in range(5):
        pg.fill('#lc', 'mala' + str(i)); pg.click('#entrar')
    check('bloqueada' in pg.inner_text('#le'), '5 intentos fallidos bloquean el inicio de sesión')
    pg.screenshot(path=f'{SHOTS}/22-login-bloqueado.png')
    pg.fill('#lc', CLAVE); pg.click('#entrar')
    check(pg.query_selector('.shell') is None, 'Durante el bloqueo ni la clave correcta entra')

    print('▶ Recuperar cuenta con el código')
    pg.click('#olvide'); pg.fill('#rc', codigo); pg.fill('#rn', 'Nueva-Clave#Cotopaxi99'); pg.click('#rok')
    pg.wait_for_selector('#codigo'); check(True, 'Recuperación con código: contraseña cambiada')
    pg.check('#guarde'); pg.click('#seguir'); pg.wait_for_selector('.shell')

    print('▶ Vista de celular')
    m = b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
    mp = m.new_page(); mp.on('pageerror', lambda e: errores_consola.append('PAGEERROR móvil ' + str(e)))
    mp.goto(URL); mp.wait_for_timeout(300); mp.screenshot(path=f'{SHOTS}/30-movil-bienvenida.png')
    mp.click('text=Empezar ahora'); mp.fill('#rn', 'Ana'); mp.fill('#ru', 'ana_ec'); mp.click('#sig')
    mp.fill('#rc', 'Llama-Bonita#Quilotoa7'); mp.fill('#rc2', 'Llama-Bonita#Quilotoa7'); mp.click('#sig'); mp.click('[data-an="lobo"]')
    mp.screenshot(path=f'{SHOTS}/31-movil-mascota.png'); mp.click('#sig'); mp.check('#guarde'); mp.click('#seguir')
    mp.wait_for_timeout(500)
    if mp.query_selector('#modal'): mp.click('#modal .btn')
    mp.screenshot(path=f'{SHOTS}/32-movil-mapa.png')
    if len(mp.evaluate("HA.levels.map(l=>l.id)")) > 1:
        mp.evaluate("HA.Leccion.prueba('n2')"); mp.click('#goPrueba')
        n = 0
        while not mp.query_selector('.resultado'):
            responder(mp); n += 1
            if n > 40: break
        mp.wait_for_timeout(900)
        if mp.query_selector('#evok'): mp.click('#evok')
        check(mp.evaluate("!!HA.perfil().desbloqueos.n2 && HA.nivelAbierto(HA.perfil(), HA.levels[1])"), 'Prueba de salto: Nivel 2 desbloqueado sin hacer el Nivel 1')
        mp.screenshot(path=f'{SHOTS}/35-movil-salto.png')
        mp.evaluate("HA.Leccion.abrir('n2-u2-l4')")
        for _ in range(2): responder(mp)
        mp.screenshot(path=f'{SHOTS}/36-movil-terminal.png')
    mp.evaluate("HA.Leccion.abrir('n1-u4-l2')")
    for _ in range(2): mp.click('#lnext')
    mp.screenshot(path=f'{SHOTS}/33-movil-phishing.png')
    mp.evaluate("HA.Leccion.abrir('n1-u1-l3')")
    for _ in range(4): responder(mp)
    mp.screenshot(path=f'{SHOTS}/34-movil-lab.png')
    sw = mp.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
    check(sw, 'Celular: sin desbordamiento horizontal')

    print('\n▶ Errores de consola:', errores_consola if errores_consola else 'ninguno')
    if errores_consola: fallos.append('errores de consola')
    b.close()
print('\n' + ('✅ TODAS LAS PRUEBAS PASARON' if not fallos else f'❌ {len(fallos)} FALLO(S): ' + ' | '.join(fallos)))
sys.exit(1 if fallos else 0)
