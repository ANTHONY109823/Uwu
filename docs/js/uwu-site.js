/* Configuración de contenido de la landing UWU */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'uwuSite';

  var GROUPS = [
    {
      id: 'nav',
      title: 'Navegación',
      fields: [
        { key: 'nav.logo', label: 'Logo', selector: 'nav .logo', html: true },
        { key: 'nav.inicio', label: 'Enlace Inicio', selector: 'nav .links a[href="#inicio"]' },
        { key: 'nav.plantillas', label: 'Enlace Plantillas', selector: 'nav .links a[href="#plantillas"]' }
      ]
    },
    {
      id: 'hero',
      title: 'Hero principal',
      fields: [
        { key: 'hero.badge', label: 'Badge superior', selector: '#inicio .hero-badge', html: true, wrap: '<span class="dot"></span>{v}' },
        { key: 'hero.h1', label: 'Título principal', selector: '#inicio h1', html: true, rows: 3 },
        { key: 'hero.sub', label: 'Descripción', selector: '#inicio .sub', html: true, rows: 3 },
        { key: 'hero.cta', label: 'Botón principal', selector: '#inicio .ctas .btn' },
        { key: 'hero.proof', label: 'Prueba social', selector: '#inicio .proof > div:last-child', html: true, rows: 2 }
      ]
    },
    {
      id: 'demo-phone',
      title: 'Demo móvil (hero)',
      fields: [
        { key: 'phone.tag', label: 'Etiqueta', selector: '#inicio .phone .tag' },
        { key: 'phone.name', label: 'Nombre', selector: '#inicio .phone .name' },
        { key: 'phone.msg', label: 'Mensaje', selector: '#inicio .phone .msg', html: true, rows: 2 },
        { key: 'phone.song', label: 'Canción', selector: '#inicio .phone .player .t', html: true }
      ]
    },
    {
      id: 'demo-laptop',
      title: 'Demo laptop (hero)',
      fields: [
        { key: 'laptop.tag', label: 'Etiqueta', selector: '#inicio .laptop .btag' },
        { key: 'laptop.name', label: 'Título', selector: '#inicio .laptop .bname' },
        { key: 'laptop.msg', label: 'Mensaje', selector: '#inicio .laptop .bmsg' },
        { key: 'laptop.btn', label: 'Botón', selector: '#inicio .laptop .bbtn' }
      ]
    },
    {
      id: 'chips',
      title: 'Chips flotantes',
      fields: [
        { key: 'chip.1', label: 'Chip 1', selector: '#inicio .fc1', html: true },
        { key: 'chip.2', label: 'Chip 2', selector: '#inicio .fc2' },
        { key: 'chip.3', label: 'Chip 3', selector: '#inicio .fc3' }
      ]
    },
    {
      id: 'marquee',
      title: 'Cinta de categorías',
      fields: [
        { key: 'marquee.label', label: 'Texto de la cinta', selector: '#categorias .marquee-label' }
      ]
    },
    {
      id: 'plantillas',
      title: 'Sección plantillas',
      fields: [
        { key: 'plantillas.kicker', label: 'Kicker', selector: '#plantillas .kicker' },
        { key: 'plantillas.h2', label: 'Título', selector: '#plantillas h2', html: true, rows: 2 }
      ]
    },
    {
      id: 'footer',
      title: 'Footer',
      fields: []
    }
  ];

  var DEFAULTS = {
    'nav.logo': 'Uwu <span style="font-size:18px">🧸</span>',
    'nav.inicio': 'Inicio',
    'nav.plantillas': 'Plantillas',
    'hero.badge': ' Más de 1,200 corazones conquistados este mes',
    'hero.h1': 'Regálale algo que<br /><span class="grad">nunca va a olvidar</span> <span class="script">💝</span>',
    'hero.sub': 'Crea una <strong>página web romántica</strong> con sus fotos, su canción y tu carta — lista en menos de 5 minutos. Pagas, recibes tu enlace y lo compartes por WhatsApp. Así de mágico.',
    'hero.cta': 'Explorar plantillas 💝',
    'hero.proof': '<span class="stars">★★★★★</span><br />"Lloró de felicidad" — la reseña más repetida',
    'phone.tag': 'Para el amor de mi vida',
    'phone.name': 'Mariana',
    'phone.msg': '"Desde el día en que llegaste,<br />mi mundo tiene más color…"',
    'phone.song': '<b>Nuestra canción</b>Ed Sheeran — Perfect',
    'laptop.tag': 'Hoy es tu día',
    'laptop.name': '¡Feliz cumple, Vale!',
    'laptop.msg': '25 razones por las que eres la persona favorita de todos…',
    'laptop.btn': 'Soplar las velitas 🎉',
    'chip.1': '💌 Vista por primera vez <b style="color:#E8447A">hace 2 min</b>',
    'chip.2': '🎵 Con su canción favorita',
    'chip.3': '📱 Compartida por WhatsApp',
    'marquee.label': 'Categorías · una para cada latido',
    'plantillas.kicker': '✦ El universo UWU ✦',
    'plantillas.h2': 'Elige una categoría y <span>orbita el corazón</span>'
  };

  function allFields() {
    var list = [];
    GROUPS.forEach(function (g) {
      g.fields.forEach(function (f) { list.push(f); });
    });
    return list;
  }

  function getSite() {
    try {
      return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function saveSite(updates) {
    var site = getSite();
    Object.assign(site, updates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(site));
    return site;
  }

  function resetSite() {
    localStorage.removeItem(STORAGE_KEY);
    return Object.assign({}, DEFAULTS);
  }

  function applyField(doc, field, value) {
    if (value == null) return;
    var el = doc.querySelector(field.selector);
    if (!el) return;
    if (field.wrap) {
      el.innerHTML = field.wrap.replace('{v}', value);
      return;
    }
    if (field.html) el.innerHTML = value;
    else el.textContent = value;
  }

  function applySite(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc) return;
    var site = getSite();
    allFields().forEach(function (field) {
      applyField(doc, field, site[field.key]);
    });
  }

  function captureFromDocument(doc) {
    doc = doc || document;
    var site = {};
    allFields().forEach(function (field) {
      var el = doc.querySelector(field.selector);
      if (!el) return;
      if (field.wrap) {
        var html = el.innerHTML;
        var prefix = field.wrap.split('{v}')[0];
        site[field.key] = html.indexOf(prefix) === 0 ? html.slice(prefix.length) : el.textContent;
      } else if (field.html) {
        site[field.key] = el.innerHTML;
      } else {
        site[field.key] = el.textContent;
      }
    });
    return site;
  }

  global.UWUSite = {
    GROUPS: GROUPS,
    DEFAULTS: DEFAULTS,
    allFields: allFields,
    getSite: getSite,
    saveSite: saveSite,
    resetSite: resetSite,
    applySite: applySite,
    captureFromDocument: captureFromDocument
  };
})(typeof window !== 'undefined' ? window : this);
