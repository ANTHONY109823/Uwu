/* UWU — catálogo, checkout y generador de dedicatorias */
(function (global) {
  'use strict';

  var CATALOG = {
    'carta-eterna':       { id:'UWU-CTRN',  name:'Carta Eterna',       emoji:'💌', cat:'Carta romántica',    tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(165deg,#4a1030,#8e2461)', pill:'Tocar para abrir 💝', title:'Mi carta para ti', desc:'Una carta que se abre con tu voz, tus palabras y la canción de los dos.' },
    'feliz-cumple':       { id:'UWU-FIIN',  name:'Fiesta Infinita',    emoji:'🎂', cat:'Cumpleaños',         tier:'free', pen:'0',     usd:'0',     grad:'linear-gradient(160deg,#F6A13C,#F0567B)', pill:'Soplar velitas 🎉', title:'¡Feliz cumpleaños!', desc:'Sopla las velitas, revienta los globos y descubre 25 razones para celebrarte.' },
    'quieres-casarte':    { id:'UWU-LGPREG',name:'La Gran Pregunta',   emoji:'💍', cat:'Pedida de mano',     tier:'prem', pen:'35.90', usd:'9.99',  grad:'linear-gradient(165deg,#1C1420,#5b2a5e)', pill:'Ver nuestra historia ✨', title:'¿Te casarías conmigo?', desc:'Un cielo de estrellas, la historia de los dos, y la pregunta más importante al final.' },
    'nuestro-tiempo':     { id:'UWU-NUTI',  name:'Nuestro Tiempo',     emoji:'💕', cat:'Aniversario',        tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(160deg,#8e2461,#E8447A)', pill:'Ver cada momento ⏳', title:'847 días juntos', desc:'Un contador en vivo de cada segundo a tu lado, con la línea de tiempo de los dos.' },
    'mi-valentin':        { id:'UWU-JDROS', name:'Jardín de Rosas',    emoji:'🌹', cat:'San Valentín',       tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(160deg,#C21E4C,#F45C7F)', pill:'Abrir el jardín 🌹', title:'Mi San Valentín', desc:'Un jardín de rosas que florece mientras lee por qué la elegiste a ella.' },
    'perdoname':          { id:'UWU-LLFL',  name:'Lluvia de Flores',   emoji:'🌸', cat:'Perdón',             tier:'free', pen:'0',     usd:'0',     grad:'linear-gradient(165deg,#7899d4,#c6a9e8)', pill:'Leer mi disculpa 🌸', title:'Perdóname', desc:'A veces las palabras cuestan. Esta página las dice bonito por ti, con lluvia de flores.' },
    'gracias-por-todo':   { id:'UWU-VOLAR', name:'Volar de Nuevo',     emoji:'💔', cat:'Cerrar ciclos',      tier:'prem', pen:'19.90', usd:'5.49',  grad:'linear-gradient(160deg,#5f72bd,#9b23ea)', pill:'Soltar con amor 🕊️', title:'Gracias por todo', desc:'Cerrar un ciclo también puede ser hermoso. Una despedida en paz, sin rencor.' },
    'para-mama':          { id:'UWU-RAIZ',  name:'Raíces',             emoji:'👨‍👩‍👧', cat:'Familia',            tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(160deg,#E88A4A,#F2BC5C)', pill:'Abrir el álbum 📖', title:'Para mamá', desc:'El álbum de la familia con las fotos de siempre y las palabras que nunca le dijiste.' },
    'firulais-forever':   { id:'UWU-MEAM',  name:'Mejor Amigo',        emoji:'🐶', cat:'Mascotas',           tier:'free', pen:'0',     usd:'0',     grad:'linear-gradient(160deg,#C98A4B,#E8B34B)', pill:'Ver sus travesuras 🐾', title:'Firulais 4ever', desc:'Porque también son familia: la página de tu mejor amigo de cuatro patas.' },
    'netflix-del-amor':   { id:'UWU-NFLX',  name:'Netflix del Amor',   emoji:'🎬', cat:'Aniversario',        tier:'prem', pen:'29.90', usd:'7.99',  grad:'linear-gradient(150deg,#141414,#E50914)', pill:'Reproducir ❤️' },
    'nuestro-playlist':   { id:'UWU-PLAY',  name:'Nuestro Playlist',   emoji:'🎧', cat:'Amar',               tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#121212,#1DB954)', pill:'Escuchar juntos 🎵' },
    'constelacion':       { id:'UWU-CONST', name:'Constelación',       emoji:'⭐', cat:'Enamorar',           tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#0f1030,#4b3f8e)', pill:'Ver las estrellas ✨' },
    'cuenta-regresiva':   { id:'UWU-CUENT', name:'Cuenta Regresiva',   emoji:'⏳', cat:'Sorprender',         tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#B06AB3,#7873f5)', pill:'Iniciar cuenta ⏳' },
    'vhs-recuerdos':      { id:'UWU-VHS',   name:'VHS de Recuerdos',   emoji:'📼', cat:'Extrañar',           tier:'prem', pen:'19.90', usd:'5.49',  grad:'linear-gradient(150deg,#3a2d20,#8a6a3c)', pill:'Rebobinar 📼' },
    'mapa-primer-beso':   { id:'UWU-MAPB',  name:'El Mapa del Primer Beso', emoji:'📍', cat:'Amar',          tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#134E5E,#71B280)', pill:'Ver el mapa 📍' },
    'latidos':            { id:'UWU-LAT',   name:'Latidos',            emoji:'💗', cat:'Enamorar',           tier:'free', pen:'0',     usd:'0',     grad:'linear-gradient(150deg,#FF6584,#E8447A)', pill:'Sentir el latido 💗' },
    'navidad-juntos':     { id:'UWU-NAV',   name:'Navidad Juntos',     emoji:'🎄', cat:'Fechas especiales',  tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#c23a3a,#1e5e3a)', pill:'Abrir regalo 🎁' },
    'amor-distancia':     { id:'UWU-DIST',  name:'Amor a Distancia',   emoji:'✈️', cat:'Extrañar',           tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#56A8E8,#8ED0F8)', pill:'Cruzar kilómetros ✈️' },
    'nuestra-historia':   { id:'UWU-HIST',  name:'Nuestra Historia',   emoji:'📖', cat:'Aniversario',        tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#6d4226,#b8845a)', pill:'Leer capítulo 📖' },
    'buenas-noches':      { id:'UWU-NOCHE', name:'Buenas Noches',      emoji:'🌙', cat:'Amar',               tier:'prem', pen:'19.90', usd:'5.49',  grad:'linear-gradient(150deg,#1C1420,#3d2a6e)', pill:'Soñar juntos 🌙' },
    'ano-nuevo':          { id:'UWU-ANUE',  name:'Año Nuevo, Amor Nuevo', emoji:'🥂', cat:'Fechas especiales', tier:'prem', pen:'25.90', usd:'6.99', grad:'linear-gradient(150deg,#2d2410,#c9a227)', pill:'Brindar 🥂' },
    'ramo-infinito':      { id:'UWU-RAMO',  name:'Ramo Infinito',      emoji:'💐', cat:'San Valentín',       tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#E8447A,#F4A7CB)', pill:'Recibir flores 💐' },
    'perdoname-bonito':   { id:'UWU-PBON',  name:'Perdóname Bonito',   emoji:'🤍', cat:'Perdón',             tier:'prem', pen:'19.90', usd:'5.49',  grad:'linear-gradient(150deg,#8a9bb8,#c4d0e0)', pill:'Leer con calma 🤍' },
    'globos-deseos':      { id:'UWU-GLOB',  name:'Globos y Deseos',    emoji:'🎈', cat:'Cumpleaños',         tier:'prem', pen:'25.90', usd:'6.99',  grad:'linear-gradient(150deg,#F0567B,#FDD35C)', pill:'Soltar globos 🎈' }
  };

  function getCur() { return localStorage.getItem('uwuCur') || 'pen'; }
  function fmtPrice(t, cur) {
    cur = cur || getCur();
    if (t.tier === 'free' || t.pen === '0') return cur === 'pen' ? 'Gratis' : 'Free';
    return cur === 'pen' ? 'S/ ' + t.pen : '$' + t.usd;
  }
  function slugFromPath() {
    var p = location.pathname.replace(/\\/g, '/');
    var m = p.match(/\/d\/([a-z0-9-]+)\.html?$/i) || p.match(/\/d\/([a-z0-9-]+)\/?$/i);
    return m ? m[1] : (new URLSearchParams(location.search).get('slug') || '');
  }
  function genAccessCode() {
    var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = 'UWU-';
    for (var i = 0; i < 2; i++) { if (i) s += '-'; for (var j = 0; j < 4; j++) s += c[Math.floor(Math.random() * c.length)]; }
    return s;
  }
  function saveOrder(order) {
    var orders = JSON.parse(localStorage.getItem('uwuOrders') || '[]');
    orders.unshift(order);
    localStorage.setItem('uwuOrders', JSON.stringify(orders.slice(0, 50)));
    return order;
  }
  function getOrders() { return JSON.parse(localStorage.getItem('uwuOrders') || '[]'); }

  function buildDedicationHTML(slug, data) {
    var t = CATALOG[slug]; if (!t) return '';
    data = data || {};
    var para = data.para || 'Mariana';
    var de = data.de || 'Diego';
    var msg = data.mensaje || 'Desde el día en que llegaste, mi mundo tiene más color. Cada momento contigo es mi lugar favorito… y quiero seguir coleccionando amaneceres a tu lado. Te amo, hoy y siempre.';
    var code = data.accessCode || genAccessCode();
    var song = data.cancion || 'Ed Sheeran — Perfect';
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1"/>\n<title>' + t.emoji + ' ' + t.name + ' — Para ' + para + '</title>\n<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap" rel="stylesheet"/>\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{font-family:Inter,system-ui,sans-serif;min-height:100svh;background:' + t.grad + ';color:#fff;display:flex;align-items:center;justify-content:center;padding:20px}\n.card{max-width:380px;width:100%;border-radius:32px;background:rgba(0,0,0,.25);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.2);padding:36px 24px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.35)}\n.tag{font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.75}\n.name{font-family:\'Dancing Script\',cursive;font-size:42px;margin:8px 0;text-shadow:0 2px 16px rgba(0,0,0,.3)}\n.msg{font-size:14px;line-height:1.75;font-style:italic;opacity:.92;margin:16px 0;min-height:80px}\n.pics{display:flex;gap:8px;justify-content:center;margin:16px 0}\n.pics i{width:58px;height:72px;border-radius:12px;font-style:normal;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(255,255,255,.15);box-shadow:0 6px 18px rgba(0,0,0,.25)}\n.player{margin-top:20px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:10px 14px;font-size:11px;display:flex;align-items:center;gap:10px}\n.player b{display:block;font-family:Sora,sans-serif;font-size:12px}\n.sig{font-family:\'Dancing Script\',cursive;font-size:26px;margin-top:18px}\n.code{margin-top:20px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.1);font-family:monospace;font-size:11px;letter-spacing:.06em}\n.brand{margin-top:16px;font-size:10px;opacity:.55}\n.btn{display:inline-block;margin-top:18px;padding:12px 24px;border-radius:999px;background:#fff;color:#E8447A;font-weight:700;font-family:Sora,sans-serif;font-size:13px;text-decoration:none;border:none;cursor:pointer}\n</style>\n</head>\n<body>\n<div class="card">\n<div class="tag">Para la persona más especial</div>\n<div class="name">' + para + '</div>\n<div class="msg">' + msg.replace(/</g,'&lt;') + '</div>\n<div class="pics"><i>📸</i><i>' + t.emoji + '</i><i>💑</i></div>\n<div class="player"><span>🎵</span><div><b>Nuestra canción</b>' + song + '</div></div>\n<div class="sig">— ' + de + ' 💝</div>\n<div class="code">Código: ' + code + ' · Plantilla ' + t.id + '</div>\n<div class="brand">Hecho con UWU 🧸 · ' + t.name + '</div>\n</div>\n<script>document.querySelector(\'.btn\')&&document.querySelector(\'.btn\').addEventListener(\'click\',function(){alert(\'💝 ¡Gracias por abrir esta dedicatoria!\')});<\/script>\n</body>\n</html>';
  }

  function downloadHTML(slug, data, filename) {
    var html = buildDedicationHTML(slug, data);
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || ('uwu-' + slug + '-' + (data.accessCode || 'edicion') + '.html');
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  function renderDedicationPage(slug, container) {
    var t = CATALOG[slug];
    if (!t) { document.body.innerHTML = '<p style="padding:40px;text-align:center">Dedicatoria no encontrada</p>'; return; }
    var params = new URLSearchParams(location.search);
    var data = {
      para: params.get('para') || 'Mariana',
      de: params.get('de') || 'Diego',
      mensaje: params.get('msg') || null,
      accessCode: params.get('code') || null,
      cancion: params.get('song') || 'Ed Sheeran — Perfect'
    };
    container = container || document.getElementById('uwu-dedication');
    if (!container) return;
    container.innerHTML =
      '<div class="d-card" style="background:' + t.grad + '">' +
      '<div class="d-inner">' +
      '<div class="d-tag">Para la persona más especial</div>' +
      '<div class="d-name">' + data.para + '</div>' +
      '<div class="d-msg">' + (data.mensaje || 'Desde el día en que llegaste, mi mundo tiene más color. Cada momento contigo es mi lugar favorito… Te amo, hoy y siempre.') + '</div>' +
      '<div class="d-pics"><i>📸</i><i>' + t.emoji + '</i><i>💑</i></div>' +
      '<div class="d-player">🎵 <div><b>Nuestra canción</b>' + data.cancion + '</div></div>' +
      '<div class="d-sig">— ' + data.de + ' 💝</div>' +
      (data.accessCode ? '<div class="d-code">🔑 ' + data.accessCode + '</div>' : '') +
      '<div class="d-brand">Hecho con UWU 🧸 · ' + t.name + ' (' + t.id + ')</div>' +
      '</div></div>';
  }

  /* ---- Checkout modal (inyectado en index) ---- */
  function ensureCheckoutUI() {
    if (document.getElementById('uwuCheckout')) return;
    var ov = document.createElement('div');
    ov.id = 'uwuCheckout';
    ov.className = 'chk-ov';
    ov.innerHTML =
      '<div class="chk-box">' +
      '<button class="chk-x" type="button" aria-label="Cerrar">✕</button>' +
      '<div id="chkStep1" class="chk-step">' +
      '<div class="chk-head"><span id="chkEmoji">💌</span><div><b id="chkName">Plantilla</b><small id="chkCat">Categoría</small></div></div>' +
      '<div class="chk-code">Código plantilla: <strong id="chkTplCode">UWU-0000</strong></div>' +
      '<label>Para quién es<input id="chkPara" placeholder="Ej: Mariana"/></label>' +
      '<label>Tu nombre (firma)<input id="chkDe" placeholder="Ej: Diego"/></label>' +
      '<label>Tu mensaje<textarea id="chkMsg" rows="3" placeholder="Escribe tu carta…"></textarea></label>' +
      '<label>Canción<input id="chkSong" placeholder="Artista — Canción" value="Ed Sheeran — Perfect"/></label>' +
      '<div class="chk-price">Total: <strong id="chkPrice">S/ 25.90</strong></div>' +
      '<button class="chk-pay btn" id="chkPayBtn" type="button">💳 Pagar y obtener mi dedicatoria</button>' +
      '<button class="chk-free btn ghost" id="chkFreeBtn" type="button" style="display:none">✨ Obtener gratis</button>' +
      '</div>' +
      '<div id="chkStep2" class="chk-step" hidden>' +
      '<div class="chk-success">🎉 ¡Listo! Tu dedicatoria está viva</div>' +
      '<div class="chk-code big" id="chkAccessCode">UWU-XXXX-XXXX</div>' +
      '<p class="chk-hint">Guarda este código. Lo necesitarás para editar o recuperar tu dedicatoria.</p>' +
      '<div class="chk-actions">' +
      '<a class="btn sm" id="chkViewLink" href="#" target="_blank">👁 Ver en línea</a>' +
      '<button class="btn sm ghost" id="chkDlBtn" type="button">⬇ Descargar HTML editable</button>' +
      '<button class="btn sm ghost" id="chkCopyBtn" type="button">📋 Copiar código</button>' +
      '</div>' +
      '<p class="chk-note">El archivo descargado incluye tus textos. Ábrelo en cualquier editor para seguir personalizando.</p>' +
      '</div></div>';
    document.body.appendChild(ov);
    ov.querySelector('.chk-x').onclick = closeCheckout;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeCheckout(); });
    document.getElementById('chkPayBtn').onclick = processPayment;
    document.getElementById('chkFreeBtn').onclick = processPayment;
    document.getElementById('chkDlBtn').onclick = function () {
      if (window.__chkOrder) downloadHTML(window.__chkOrder.slug, window.__chkOrder);
    };
    document.getElementById('chkCopyBtn').onclick = function () {
      if (!window.__chkOrder) return;
      navigator.clipboard.writeText(window.__chkOrder.accessCode).then(function () { alert('Código copiado 📋'); });
    };
  }

  var __chkSlug = null;
  function openCheckout(slug) {
    if (document.body.classList.contains('adm')) return;
    var t = CATALOG[slug]; if (!t) return;
    ensureCheckoutUI();
    __chkSlug = slug;
    window.__chkSlug = slug;
    document.getElementById('chkEmoji').textContent = t.emoji;
    document.getElementById('chkName').textContent = t.name;
    document.getElementById('chkCat').textContent = t.cat + ' · ' + t.id;
    document.getElementById('chkTplCode').textContent = t.id;
    document.getElementById('chkPrice').textContent = fmtPrice(t);
    document.getElementById('chkStep1').hidden = false;
    document.getElementById('chkStep2').hidden = true;
    var isFree = t.tier === 'free';
    document.getElementById('chkPayBtn').style.display = isFree ? 'none' : 'flex';
    document.getElementById('chkFreeBtn').style.display = isFree ? 'flex' : 'none';
    document.getElementById('uwuCheckout').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCheckout() {
    var ov = document.getElementById('uwuCheckout');
    if (ov) { ov.classList.remove('open'); document.body.style.overflow = ''; }
  }
  function processPayment() {
    var t = CATALOG[__chkSlug]; if (!t) return;
    var order = {
      slug: __chkSlug,
      templateId: t.id,
      templateName: t.name,
      para: document.getElementById('chkPara').value.trim() || 'Mariana',
      de: document.getElementById('chkDe').value.trim() || 'Diego',
      mensaje: document.getElementById('chkMsg').value.trim() || 'Desde el día en que llegaste, mi mundo tiene más color. Te amo, hoy y siempre.',
      cancion: document.getElementById('chkSong').value.trim() || 'Ed Sheeran — Perfect',
      accessCode: genAccessCode(),
      paidAt: new Date().toISOString(),
      amount: fmtPrice(t)
    };
    saveOrder(order);
    window.__chkOrder = order;
    document.getElementById('chkAccessCode').textContent = order.accessCode;
    var base = location.href.replace(/[#?].*$/, '').replace(/[^/]*$/, '');
    var viewUrl = base + 'd/' + __chkSlug + '.html?code=' + encodeURIComponent(order.accessCode) +
      '&para=' + encodeURIComponent(order.para) + '&de=' + encodeURIComponent(order.de) +
      '&msg=' + encodeURIComponent(order.mensaje) + '&song=' + encodeURIComponent(order.cancion);
    document.getElementById('chkViewLink').href = viewUrl;
    document.getElementById('chkStep1').hidden = true;
    document.getElementById('chkStep2').hidden = false;
  }

  global.UWU = {
    CATALOG: CATALOG,
    getCur: getCur,
    fmtPrice: fmtPrice,
    slugFromPath: slugFromPath,
    genAccessCode: genAccessCode,
    buildDedicationHTML: buildDedicationHTML,
    downloadHTML: downloadHTML,
    renderDedicationPage: renderDedicationPage,
    openCheckout: openCheckout,
    closeCheckout: closeCheckout,
    getOrders: getOrders
  };
  global.openCheckout = openCheckout;
})(typeof window !== 'undefined' ? window : this);
