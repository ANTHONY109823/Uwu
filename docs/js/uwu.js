/* UWU — catálogo, checkout, dedicatorias y UI de landing */
(function (global) {
  'use strict';

  var SHOWCASE = [
    'hello-kitty', 'carta-eterna', 'feliz-cumple', 'quieres-casarte', 'nuestro-tiempo', 'mi-valentin',
    'perdoname', 'gracias-por-todo', 'para-mama', 'firulais-forever',
    'galaxia-amor', 'flores-interactivas', 'lluvia-te-amo', 'laberinto-neon'
  ];

  var CATALOG_ORDER = [
    'hello-kitty', 'carta-eterna', 'feliz-cumple', 'quieres-casarte', 'nuestro-tiempo', 'mi-valentin',
    'perdoname', 'netflix-del-amor', 'nuestro-playlist', 'constelacion', 'cuenta-regresiva',
    'vhs-recuerdos', 'mapa-primer-beso', 'latidos', 'gracias-por-todo', 'para-mama',
    'firulais-forever', 'navidad-juntos', 'amor-distancia', 'nuestra-historia', 'buenas-noches',
    'ano-nuevo', 'ramo-infinito', 'perdoname-bonito', 'globos-deseos',
    'galaxia-amor', 'flores-interactivas', 'lluvia-te-amo', 'lluvia-frases',
    'lluvia-letras', 'esfera-dragon', 'laberinto-neon'
  ];

  var CATALOG = {
    'hello-kitty':        { id:'UWU-HKIT',  name:'Hello Kitty Mágica',      emoji:'🎀', cat:'Sorprender',         tier:'excl', pen:'5', usd:'1.50', page:'hello-kitty.html', grad:'linear-gradient(135deg,#e542a1,#3890dd,#c654ce)', pill:'Tocar para abrir 🎀', title:'Hello Kitty para ti', desc:'Hello Kitty se dibuja sola, luego tu mensaje aparece letra por letra con corazones flotantes.' },
    'carta-eterna':       { id:'UWU-CTRN',  name:'Carta Eterna',            emoji:'💌', cat:'Carta romántica',    tier:'prem', pen:'8', usd:'2.00', page:'carta-eterna.html',  grad:'linear-gradient(165deg,#4a1030,#8e2461)', pill:'Tocar para abrir 💝',       title:'Mi carta para ti',          desc:'Una carta que se abre con tu voz, tus palabras y la canción de los dos.' },
    'feliz-cumple':       { id:'UWU-FIIN',  name:'Fiesta Infinita',         emoji:'🎂', cat:'Cumpleaños',         tier:'free', pen:'0', usd:'0', page:'feliz-cumple.html',     grad:'linear-gradient(160deg,#F6A13C,#F0567B)', pill:'Soplar velitas 🎉',          title:'¡Feliz cumpleaños!',          desc:'Sopla las velitas, revienta los globos y descubre 25 razones para celebrarte.' },
    'quieres-casarte':    { id:'UWU-LGPREG',name:'La Gran Pregunta',        emoji:'💍', cat:'Pedida de mano',     tier:'excl', pen:'5', usd:'1.50', page:'quieres-casarte.html', grad:'linear-gradient(165deg,#1C1420,#5b2a5e)', pill:'Ver nuestra historia ✨',    title:'¿Te casarías conmigo?',       desc:'Un cielo de estrellas, la historia de los dos, y la pregunta más importante al final.' },
    'nuestro-tiempo':     { id:'UWU-NUTI',  name:'Nuestro Tiempo',          emoji:'💕', cat:'Aniversario',        tier:'prem', pen:'8', usd:'2.00', page:'nuestro-tiempo.html',  grad:'linear-gradient(160deg,#8e2461,#E8447A)', pill:'Ver cada momento ⏳',        title:'847 días juntos',           desc:'Un contador en vivo de cada segundo a tu lado, con la línea de tiempo de los dos.' },
    'mi-valentin':        { id:'UWU-JDROS', name:'Jardín de Rosas',         emoji:'🌹', cat:'San Valentín',       tier:'prem', pen:'8', usd:'2.00', page:'mi-valentin.html',  grad:'linear-gradient(160deg,#C21E4C,#F45C7F)', pill:'Abrir el jardín 🌹',         title:'Mi San Valentín',             desc:'Un jardín de rosas que florece mientras lee por qué la elegiste a ella.' },
    'perdoname':          { id:'UWU-LLFL',  name:'Lluvia de Flores',        emoji:'🌸', cat:'Perdón',             tier:'free', pen:'0', usd:'0', page:'perdoname.html',     grad:'linear-gradient(165deg,#7899d4,#c6a9e8)', pill:'Leer mi disculpa 🌸',        title:'Perdóname',                   desc:'A veces las palabras cuestan. Esta página las dice bonito por ti, con lluvia de flores.' },
    'gracias-por-todo':   { id:'UWU-VOLAR', name:'Volar de Nuevo',          emoji:'💔', cat:'Cerrar ciclos',      tier:'prem', pen:'8', usd:'2.00', page:'gracias-por-todo.html',  grad:'linear-gradient(160deg,#5f72bd,#9b23ea)', pill:'Soltar con amor 🕊️',         title:'Gracias por todo',            desc:'Cerrar un ciclo también puede ser hermoso. Una despedida en paz, sin rencor.' },
    'para-mama':          { id:'UWU-RAIZ',  name:'Raíces',                  emoji:'👨‍👩‍👧', cat:'Familia',            tier:'prem', pen:'8', usd:'2.00', page:'para-mama.html',  grad:'linear-gradient(160deg,#E88A4A,#F2BC5C)', pill:'Abrir el álbum 📖',          title:'Para mamá',                   desc:'El álbum de la familia con las fotos de siempre y las palabras que nunca le dijiste.' },
    'firulais-forever':   { id:'UWU-MEAM',  name:'Mejor Amigo',             emoji:'🐶', cat:'Mascotas',           tier:'free', pen:'0', usd:'0', page:'firulais-forever.html',     grad:'linear-gradient(160deg,#C98A4B,#E8B34B)', pill:'Ver sus travesuras 🐾',       title:'Firulais 4ever',              desc:'Porque también son familia: la página de tu mejor amigo de cuatro patas.' },
    'netflix-del-amor':   { id:'UWU-NFLX',  name:'Netflix del Amor',        emoji:'🎬', cat:'Aniversario',        tier:'excl', pen:'5', usd:'1.50', page:'netflix-del-amor.html', grad:'linear-gradient(150deg,#141414,#E50914)', pill:'Reproducir ❤️',              title:'Nuestra serie',               desc:'Tu historia en formato binge: capítulos, fotos y la banda sonora de los dos.' },
    'nuestro-playlist':   { id:'UWU-PLAY',  name:'Nuestro Playlist',        emoji:'🎧', cat:'Amar',               tier:'prem', pen:'8', usd:'2.00', page:'nuestro-playlist.html',  grad:'linear-gradient(150deg,#121212,#1DB954)', pill:'Escuchar juntos 🎵',         title:'Nuestra playlist',            desc:'Las canciones que marcaron cada momento, en una página que suena como ustedes.' },
    'constelacion':       { id:'UWU-CONST', name:'Constelación',            emoji:'⭐', cat:'Enamorar',           tier:'excl', pen:'5', usd:'1.50', page:'constelacion.html', grad:'linear-gradient(150deg,#0f1030,#4b3f8e)', pill:'Ver las estrellas ✨',       title:'Nuestra constelación',        desc:'Un cielo estrellado con el mapa de los momentos que los unieron para siempre.' },
    'cuenta-regresiva':   { id:'UWU-CUENT', name:'Cuenta Regresiva',        emoji:'⏳', cat:'Sorprender',         tier:'prem', pen:'8', usd:'2.00',  grad:'linear-gradient(150deg,#B06AB3,#7873f5)', pill:'Iniciar cuenta ⏳',           title:'Faltan solo…',                desc:'La sorpresa perfecta: un contador que desemboca en el momento más esperado.' },
    'vhs-recuerdos':      { id:'UWU-VHS',   name:'VHS de Recuerdos',        emoji:'📼', cat:'Extrañar',           tier:'prem', pen:'8', usd:'2.00', page:'vhs-recuerdos.html',  grad:'linear-gradient(150deg,#3a2d20,#8a6a3c)', pill:'Rebobinar 📼',               title:'Recuerdos en VHS',            desc:'Nostalgia en pantalla: fotos retro, música y la sensación de volver a empezar.' },
    'mapa-primer-beso':   { id:'UWU-MAPB',  name:'El Mapa del Primer Beso', emoji:'📍', cat:'Amar',               tier:'prem', pen:'8', usd:'2.00', page:'mapa-primer-beso.html',  grad:'linear-gradient(150deg,#134E5E,#71B280)', pill:'Ver el mapa 📍',             title:'Aquí empezó todo',            desc:'El lugar exacto donde el mundo cambió, marcado en un mapa hecho con amor.' },
    'latidos':            { id:'UWU-LAT',   name:'Latidos',                 emoji:'💗', cat:'Enamorar',           tier:'free', pen:'0', usd:'0', page:'latidos.html',     grad:'linear-gradient(150deg,#FF6584,#E8447A)', pill:'Sentir el latido 💗',        title:'Mi corazón late por ti',      desc:'Una página que late al ritmo de tu mensaje, simple y profundamente romántica.' },
    'navidad-juntos':     { id:'UWU-NAV',   name:'Navidad Juntos',          emoji:'🎄', cat:'Fechas especiales',  tier:'prem', pen:'8', usd:'2.00', page:'navidad-juntos.html',  grad:'linear-gradient(150deg,#c23a3a,#1e5e3a)', pill:'Abrir regalo 🎁',            title:'Feliz Navidad juntos',        desc:'Luces, nieve digital y las palabras más cálidas para quien llena tu diciembre.' },
    'amor-distancia':     { id:'UWU-DIST',  name:'Amor a Distancia',        emoji:'✈️', cat:'Extrañar',           tier:'prem', pen:'8', usd:'2.00', page:'amor-distancia.html',  grad:'linear-gradient(150deg,#56A8E8,#8ED0F8)', pill:'Cruzar kilómetros ✈️',       title:'A kilómetros, juntos',        desc:'La distancia no gana cuando el amor tiene su propia página en internet.' },
    'nuestra-historia':   { id:'UWU-HIST',  name:'Nuestra Historia',        emoji:'📖', cat:'Aniversario',        tier:'prem', pen:'8', usd:'2.00', page:'nuestra-historia.html',  grad:'linear-gradient(150deg,#6d4226,#b8845a)', pill:'Leer capítulo 📖',           title:'Capítulo a capítulo',         desc:'La línea de tiempo de los dos, contada como la mejor historia que jamás vivieron.' },
    'buenas-noches':      { id:'UWU-NOCHE', name:'Buenas Noches',           emoji:'🌙', cat:'Amar',               tier:'prem', pen:'8', usd:'2.00', page:'buenas-noches.html',  grad:'linear-gradient(150deg,#1C1420,#3d2a6e)', pill:'Soñar juntos 🌙',            title:'Buenas noches, amor',         desc:'Para cerrar el día con una carta suave, estrellas y la canción que los arrulla.' },
    'ano-nuevo':          { id:'UWU-ANUE',  name:'Año Nuevo, Amor Nuevo',   emoji:'🥂', cat:'Fechas especiales',  tier:'prem', pen:'8', usd:'2.00', page:'ano-nuevo.html',  grad:'linear-gradient(150deg,#2d2410,#c9a227)', pill:'Brindar 🥂',                 title:'Un brindis por nosotros',     desc:'Celebrar lo vivido y lo que viene, con fuegos artificiales y promesas bonitas.' },
    'ramo-infinito':      { id:'UWU-RAMO',  name:'Ramo Infinito',           emoji:'💐', cat:'San Valentín',       tier:'prem', pen:'8', usd:'2.00', page:'ramo-infinito.html',  grad:'linear-gradient(150deg,#E8447A,#F4A7CB)', pill:'Recibir flores 💐',          title:'Un ramo para ti',             desc:'Flores que nunca se marchitan y palabras que florecen con cada scroll.' },
    'perdoname-bonito':   { id:'UWU-PBON',  name:'Perdóname Bonito',        emoji:'🤍', cat:'Perdón',             tier:'prem', pen:'8', usd:'2.00', page:'perdoname-bonito.html',  grad:'linear-gradient(150deg,#8a9bb8,#c4d0e0)', pill:'Leer con calma 🤍',          title:'Lo siento de verdad',         desc:'Una disculpa sincera, envuelta en calma, luz suave y mucha honestidad.' },
    'globos-deseos':      { id:'UWU-GLOB',  name:'Globos y Deseos',         emoji:'🎈', cat:'Cumpleaños',         tier:'prem', pen:'8', usd:'2.00', page:'globos-deseos.html',  grad:'linear-gradient(150deg,#F0567B,#FDD35C)', pill:'Soltar globos 🎈',           title:'Pide un deseo',               desc:'Globos, confeti y una celebración digital que se siente como fiesta de verdad.' },
    'galaxia-amor':       { id:'UWU-GALX',  name:'Galaxia de Nuestro Amor', emoji:'🌌', cat:'Enamorar',           tier:'excl', pen:'5', usd:'1.50', page:'galaxia-amor.html',        grad:'linear-gradient(150deg,#050010,#c084fc)', pill:'Explorar la galaxia 🌌',    title:'Nuestra galaxia',             desc:'Una galaxia 3D interactiva con frases de amor flotando entre las estrellas. Controles de órbita incluidos.' },
    'flores-interactivas':{ id:'UWU-FLOR',  name:'Flores Interactivas',     emoji:'🌸', cat:'Enamorar',           tier:'prem', pen:'8', usd:'2.00',  page:'flores-interactivas.html', grad:'linear-gradient(135deg,#1a0a2e,#7c3aed)', pill:'Clic para florecer 🌸',     title:'Florece por ti',              desc:'Flores que nacen donde tocas la pantalla, dibujadas con magia WebGL. Cada clic es un te quiero.' },
    'lluvia-te-amo':      { id:'UWU-LTAM',  name:'Lluvia de Te Amo',        emoji:'💕', cat:'Amar',               tier:'free', pen:'0', usd:'0',     page:'lluvia-te-amo.html',       grad:'linear-gradient(135deg,#000,#ff4d6d)',     pill:'Ver la lluvia 💕',          title:'Te Amo',                      desc:'Una lluvia de "TE AMO" en colores rosados que cae sin parar. Toca la pantalla para ver corazones.' },
    'lluvia-frases':      { id:'UWU-LFRA',  name:'Lluvia de Frases',        emoji:'💗', cat:'Amar',               tier:'prem', pen:'8', usd:'2.00',  page:'lluvia-frases.html',       grad:'linear-gradient(135deg,#000,#ff1493)',     pill:'Sentir el amor 💗',         title:'Me gustas mucho',             desc:'Una lluvia de frases románticas con tu canción favorita de fondo y mensaje central que brillan en la pantalla.' },
    'lluvia-letras':      { id:'UWU-LLTR',  name:'Lluvia de Letras',        emoji:'🌧️', cat:'Sorprender',         tier:'prem', pen:'8', usd:'2.00',  page:'lluvia-letras.html',       grad:'linear-gradient(135deg,#0e2636,#00cc44)',  pill:'Tocar para ver 🌧️',        title:'Lluvia de palabras',          desc:'Letras y palabras de amor caen desde una nube brillante con efecto neón. Personalizable con cualquier mensaje.' },
    'esfera-dragon':      { id:'UWU-DRAG',  name:'Esfera del Dragón',       emoji:'🐉', cat:'Sorprender',         tier:'prem', pen:'8', usd:'2.00',  page:'esfera-dragon.html',       grad:'linear-gradient(135deg,#ff4500,#ffa500)',  pill:'Tocar la esfera 🐉',        title:'Tu deseo se cumple',          desc:'Una esfera del dragón interactiva con animación pulsante y brillo. Para los fans del anime y las sorpresas únicas.' },
    'laberinto-neon':     { id:'UWU-NEON',  name:'Laberinto Neon',          emoji:'🎮', cat:'Sorprender',         tier:'excl', pen:'5', usd:'1.50', page:'laberinto-neon.html',      grad:'linear-gradient(135deg,#000,#4583dc)',     pill:'Entrar al neon 🎮',         title:'Laberinto de luz',            desc:'Un laberinto 3D estilo Pac-Man con luces de neón y efectos volumétricos. Impresionante y completamente único.' }
  };

  Object.keys(CATALOG).forEach(function (slug) {
    if (!CATALOG[slug].page) CATALOG[slug].page = slug + '.html';
  });
  var _baseCatalog = JSON.parse(JSON.stringify(CATALOG));
  var _baseOrder = CATALOG_ORDER.slice();
  var _baseShowcase = SHOWCASE.slice();
  var STORE_KEY = 'uwuCatalogAdmin';
  var _storeCache = null;

  function emptyStore() {
    return { catalog: {}, order: [], showcase: [], hidden: [], html: {}, versions: {}, activeVersion: {}, audio: {}, audioMeta: {} };
  }

  function loadCatalogStore() {
    if (_storeCache) return _storeCache;
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) {
        _storeCache = emptyStore();
        return _storeCache;
      }
      var s = JSON.parse(raw);
      if (!s.catalog) s.catalog = {};
      if (!s.order) s.order = [];
      if (!s.showcase) s.showcase = [];
      if (!s.hidden) s.hidden = [];
      if (!s.html) s.html = {};
      if (!s.versions) s.versions = {};
      if (!s.activeVersion) s.activeVersion = {};
      if (!s.audio) s.audio = {};
      if (!s.audioMeta) s.audioMeta = {};
      _storeCache = s;
      return _storeCache;
    } catch (e) {
      _storeCache = emptyStore();
      return _storeCache;
    }
  }

  function saveCatalogStore(store) {
    store = store || loadCatalogStore();
    if (global.UWURailwaySync && global.UWURailwaySync.isReady()) {
      pruneHeavyLocalData(store);
    }
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(store));
      _storeCache = store;
    } catch (e) {
      if (e && e.name === 'QuotaExceededError') {
        pruneHeavyLocalData(store, true);
        try {
          localStorage.setItem(STORE_KEY, JSON.stringify(store));
          _storeCache = store;
        } catch (e2) {
          throw new Error('Espacio del navegador lleno. Conecta Railway y guarda de nuevo.');
        }
      } else {
        throw e;
      }
    }
    applyCatalogFromStore(store);
  }

  function invalidateStoreCache() {
    _storeCache = null;
  }

  function pruneHeavyLocalData(store, aggressive) {
    if (store.audio) {
      Object.keys(store.audio).forEach(function (k) { delete store.audio[k]; });
    }
    if (aggressive || (global.UWURailwaySync && global.UWURailwaySync.isReady())) {
      if (store.html) {
        Object.keys(store.html).forEach(function (k) { delete store.html[k]; });
      }
      if (store.versions) {
        Object.keys(store.versions).forEach(function (slug) {
          (store.versions[slug] || []).forEach(function (v) { delete v.html; });
        });
      }
    }
  }

  function canUseServerStorage() {
    return !!(global.UWURailwaySync && global.UWURailwaySync.isReady());
  }

  function applyCatalogFromStore(store) {
    store = store || loadCatalogStore();
    var merged = Object.assign({}, _baseCatalog, store.catalog || {});
    (store.hidden || []).forEach(function (slug) { delete merged[slug]; });
    Object.keys(merged).forEach(function (slug) {
      if (merged[slug]) applyTierPrice(merged[slug]);
    });
    Object.keys(CATALOG).forEach(function (k) { delete CATALOG[k]; });
    Object.assign(CATALOG, merged);
    var order = (store.order && store.order.length) ? store.order.slice() : _baseOrder.slice();
    order = order.filter(function (slug) { return CATALOG[slug]; });
    Object.keys(store.catalog || {}).forEach(function (slug) {
      if (CATALOG[slug] && order.indexOf(slug) === -1) order.push(slug);
    });
    // La base es la fuente de verdad: un order guardado (localStorage/remoto) puede
    // reordenar, pero nunca debe ocultar plantillas base nuevas. Añadimos las que falten.
    _baseOrder.forEach(function (slug) {
      if (CATALOG[slug] && order.indexOf(slug) === -1) order.push(slug);
    });
    CATALOG_ORDER.length = 0;
    order.forEach(function (slug) { CATALOG_ORDER.push(slug); });
    var showcase = (store.showcase && store.showcase.length) ? store.showcase.slice() : _baseShowcase.slice();
    showcase = showcase.filter(function (slug) { return CATALOG[slug]; });
    SHOWCASE.length = 0;
    showcase.forEach(function (slug) { SHOWCASE.push(slug); });
  }

  function initCatalog() {
    var store = loadCatalogStore();
    if (canUseServerStorage()) {
      pruneHeavyLocalData(store, true);
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
      } catch (e) { /* quota ya limpio */ }
    }
    applyCatalogFromStore(store);
  }

  function hasRemoteData(remote) {
    if (!remote) return false;
    return !!(Object.keys(remote.catalog || {}).length ||
      (remote.order || []).length ||
      (remote.showcase || []).length ||
      (remote.hidden || []).length);
  }

  function applyRemoteCatalog(remote) {
    if (!hasRemoteData(remote)) return false;
    var store = { catalog: {}, order: [], showcase: [], hidden: [], html: {} };
    if (global.UWUGitHubSync && global.UWUGitHubSync.remoteToStore) {
      store = global.UWUGitHubSync.remoteToStore(remote);
    } else {
      store.catalog = remote.catalog || {};
      store.order = remote.order || [];
      store.showcase = remote.showcase || [];
      store.hidden = remote.hidden || [];
    }
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
    return true;
  }

  function loadRemoteCatalog() {
    var pull = (global.UWUGitHubSync && global.UWUGitHubSync.pullCatalog)
      ? global.UWUGitHubSync.pullCatalog()
      : fetch('data/catalog.json?v=' + Date.now()).then(function (res) {
        return res.ok ? res.json() : null;
      }).catch(function () { return null; });
    return pull.then(function (remote) {
      applyRemoteCatalog(remote);
      return remote;
    });
  }

  function bootstrap(cb) {
    loadRemoteCatalog().then(function () {
      initCatalog();
      if (typeof cb === 'function') cb();
    }).catch(function () {
      initCatalog();
      if (typeof cb === 'function') cb();
    });
  }

  function getStoredHtml(slug) {
    var store = loadCatalogStore();
    if (store.activeVersion && store.activeVersion[slug] && store.versions && store.versions[slug]) {
      var active = store.versions[slug].filter(function (v) { return v.id === store.activeVersion[slug]; })[0];
      if (active && active.html) return active.html;
    }
    return (store.html && store.html[slug]) || null;
  }

  function listTemplateVersions(slug) {
    var store = loadCatalogStore();
    return (store.versions && store.versions[slug]) ? store.versions[slug].slice() : [];
  }

  function setActiveTemplateVersion(slug, versionId) {
    var store = loadCatalogStore();
    if (!store.versions || !store.versions[slug]) return;
    var v = store.versions[slug].filter(function (x) { return x.id === versionId; })[0];
    if (!v) return;
    store.activeVersion[slug] = versionId;
    store.html[slug] = v.html;
    saveCatalogStore(store);
  }

  function escAttr(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function hasTemplateAudio(slug) {
    var store = loadCatalogStore();
    if (store.audio && store.audio[slug]) return true;
    if (store.catalog[slug] && store.catalog[slug].audio) return true;
    var t = CATALOG[slug];
    return !!(t && t.audio);
  }

  function getTemplateAudioPublicPath(slug) {
    return 'audio/' + slug + '.mp3';
  }

  function getTemplateAudioFetchUrl(slug) {
    return 'd/audio/' + slug + '.mp3';
  }

  function saveTemplateAudio(slug, file) {
    return new Promise(function (resolve, reject) {
      if (!file) { reject(new Error('Archivo inválido')); return; }
      if (file.size > 8 * 1024 * 1024) {
        reject(new Error('El MP3 no puede superar 8 MB'));
        return;
      }
      if (canUseServerStorage()) {
        global.UWURailwaySync.uploadAudio(slug, file).then(function () {
          markTemplateAudioPublished(slug, { name: file.name, size: file.size });
          resolve({ name: file.name, size: file.size });
        }).catch(reject);
        return;
      }
      if (file.size > 512 * 1024) {
        reject(new Error('MP3 demasiado grande para guardar local (' + Math.round(file.size / 1024) + ' KB). Usa Railway.'));
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        var parts = String(reader.result).split(',');
        var base64 = parts.length > 1 ? parts[1] : parts[0];
        var store = loadCatalogStore();
        store.audio[slug] = base64;
        store.audioMeta[slug] = { name: file.name, size: file.size };
        if (!store.catalog[slug] && _baseCatalog[slug]) {
          store.catalog[slug] = JSON.parse(JSON.stringify(_baseCatalog[slug]));
        }
        if (store.catalog[slug]) store.catalog[slug].audio = slug + '.mp3';
        saveCatalogStore(store);
        resolve({ name: file.name, size: file.size });
      };
      reader.onerror = function () { reject(new Error('No se pudo leer el MP3')); };
      reader.readAsDataURL(file);
    });
  }

  function markTemplateAudioPublished(slug, meta) {
    var store = loadCatalogStore();
    if (!store.audio) store.audio = {};
    if (!store.audioMeta) store.audioMeta = {};
    delete store.audio[slug];
    store.audioMeta[slug] = meta || { name: slug + '.mp3' };
    if (!store.catalog[slug] && _baseCatalog[slug]) {
      store.catalog[slug] = JSON.parse(JSON.stringify(_baseCatalog[slug]));
    }
    if (store.catalog[slug]) store.catalog[slug].audio = slug + '.mp3';
    saveCatalogStore(store);
  }

  function markTemplateHtmlPublished(slug, html, opts) {
    opts = opts || {};
    var store = loadCatalogStore();
    if (!store.versions) store.versions = {};
    if (!store.activeVersion) store.activeVersion = {};
    if (!store.versions[slug]) store.versions[slug] = [];
    var versionId = opts.versionId;
    if (opts.newVersion || !versionId) {
      versionId = 'v' + Date.now();
      store.versions[slug].push({
        id: versionId,
        name: opts.versionName || ('Versión ' + store.versions[slug].length + 1),
        at: new Date().toISOString()
      });
    } else {
      var cur = store.versions[slug].filter(function (v) { return v.id === versionId; })[0];
      if (cur) {
        cur.at = new Date().toISOString();
        if (opts.versionName) cur.name = opts.versionName;
        delete cur.html;
      }
    }
    store.activeVersion[slug] = versionId;
    delete store.html[slug];
    if (!store.catalog[slug] && _baseCatalog[slug]) {
      store.catalog[slug] = JSON.parse(JSON.stringify(_baseCatalog[slug]));
    }
    if (store.catalog[slug]) store.catalog[slug].page = slug + '.html';
    saveCatalogStore(store);
    return versionId;
  }

  function removeTemplateAudio(slug) {
    var store = loadCatalogStore();
    delete store.audio[slug];
    delete store.audioMeta[slug];
    if (store.catalog[slug]) delete store.catalog[slug].audio;
    saveCatalogStore(store);
  }

  function getAudioSrcForSlug(slug, forDownload) {
    var store = loadCatalogStore();
    if (store.audio && store.audio[slug]) {
      return Promise.resolve('data:audio/mpeg;base64,' + store.audio[slug]);
    }
    if (!hasTemplateAudio(slug)) return Promise.resolve(null);
    var url = getTemplateAudioFetchUrl(slug);
    if (!forDownload) return Promise.resolve(getTemplateAudioPublicPath(slug));
    return fetch(url + '?v=' + Date.now()).then(function (res) {
      if (!res.ok) return null;
      return res.blob().then(function (blob) {
        return new Promise(function (resolve) {
          var reader = new FileReader();
          reader.onload = function () { resolve(reader.result); };
          reader.readAsDataURL(blob);
        });
      });
    }).catch(function () { return null; });
  }

  function hasAudioHook(html) {
    if (!html) return false;
    return html.indexOf('__UWU_AUDIO__') !== -1 ||
      html.indexOf('__UWU_AUDIO_SRC__') !== -1 ||
      html.indexOf('id="uwuBgm"') !== -1;
  }

  function ensureAudioPlaceholder(html) {
    if (!html || hasAudioHook(html)) return html;
    if (/<\/body>/i.test(html)) {
      return html.replace(/<\/body>/i, '__UWU_AUDIO__\n</body>');
    }
    return html + '\n__UWU_AUDIO__';
  }

  function audioPlayerSnippet(src) {
    if (!src) return '';
    // Solo el <audio>. El kit UWU (#uwuPlayBtn) controla play/pause.
    return '<audio id="uwuBgm" loop preload="auto" playsinline src="' + escAttr(src) + '" style="display:none"></audio>' +
      '<script>(function(){var a=document.getElementById("uwuBgm");if(!a||!a.src)return;if(document.getElementById("uwuPlayBtn"))return;var p=function(){if(a.paused)a.play().catch(function(){});};document.addEventListener("click",p,{once:true});document.addEventListener("touchstart",p,{once:true});})();<\/script>';
  }

  function finalizeTemplateHtml(html, slug, opts) {
    opts = opts || {};
    if (!html) return html;
    var src = opts.audioSrc;
    if (!src && !hasTemplateAudio(slug)) return html;
    if (html.indexOf('__UWU_AUDIO_SRC__') !== -1) {
      html = html.replace(/__UWU_AUDIO_SRC__/g, src ? escAttr(src) : '');
    }
    if (html.indexOf('__UWU_AUDIO__') !== -1) {
      html = html.replace(/__UWU_AUDIO__/g, audioPlayerSnippet(src));
    } else if (src && html.indexOf('id="uwuBgm"') === -1) {
      html = html.replace(/<\/body>/i, audioPlayerSnippet(src) + '\n</body>');
    }
    return html;
  }

  function prepareTemplateOutput(html, slug, data, forDownload) {
    return getAudioSrcForSlug(slug, forDownload).then(function (audioSrc) {
      var out = personalizeCustomPage(html, slug, data || {});
      return finalizeTemplateHtml(out, slug, { audioSrc: audioSrc });
    });
  }

  function buildTemplateStub(slug) {
    var t = _baseCatalog[slug] || CATALOG[slug];
    if (!t) return '';
    var grad = t.grad || 'linear-gradient(150deg,#EE7EB1,#E8447A)';
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>\n<meta name="robots" content="noindex"/>\n<title>' + esc(t.emoji + ' ' + t.name) + ' — UWU</title>\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',system-ui,sans-serif;min-height:100svh;background:' + grad + ';color:#fff;display:flex;align-items:center;justify-content:center;padding:24px}\n.wrap{max-width:400px;width:100%;text-align:center;background:rgba(0,0,0,.28);backdrop-filter:blur(12px);border-radius:28px;padding:32px 22px;border:1px solid rgba(255,255,255,.2);box-shadow:0 20px 60px rgba(0,0,0,.35)}\n.big{font-size:64px;margin-bottom:12px}\nh1{font-size:1.4rem;margin-bottom:8px}\n.pill{display:inline-block;margin-top:16px;padding:12px 22px;border-radius:999px;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.25);color:#fff;font-weight:700;cursor:pointer}\n.msg{margin:18px 0;font-size:15px;line-height:1.7;font-style:italic;min-height:3em}\n.sub{font-size:12px;opacity:.85;margin-top:12px}\n.code{margin-top:16px;font-size:10px;opacity:.65;font-family:monospace}\n</style>\n</head>\n<body>\n<div class="wrap">\n<div class="big">' + t.emoji + '</div>\n<h1>' + esc(t.title || t.name) + '</h1>\n<p class="sub" id="uwuSubtitle" data-default="">__UWU_SUBTITLE__</p>\n<p class="msg" id="uwuMsg" data-default="Eres el sueño que nunca quiero despertar 🌙">__UWU_MSG__</p>\n<button class="pill" type="button">' + esc(t.pill || 'Abrir 💝') + '</button>\n<div class="code" id="uwuCode">__UWU_CODE__</div>\n<p class="sub">Plantilla ' + esc(t.id) + ' · UWU</p>\n</div>\n<a id="uwuBrand" href="../index.html" aria-label="Volver a UWU"><span class="uwu-mark">UWU</span><span class="uwu-sub">hecho con amor</span></a>\n<div id="uwuDock"><button id="uwuPlayBtn" type="button" title="Reproducir / Pausar música">🎵</button><button id="uwuPickBtn" type="button" title="Subir tu canción (MP3)">＋</button><input id="uwuPickFile" type="file" accept="audio/*" hidden></div>\n<div id="uwuToast"></div>\n<style>#uwuBrand{position:fixed;top:14px;right:14px;z-index:99999;display:flex;flex-direction:column;align-items:flex-end;gap:2px;text-decoration:none;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;line-height:1}#uwuBrand .uwu-mark{font-weight:800;font-size:20px;letter-spacing:1px;background:linear-gradient(135deg,#ff4fa3,#a855f7,#38bdf8);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 6px rgba(0,0,0,.45))}#uwuBrand .uwu-sub{font-size:9px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.78)}#uwuDock{position:fixed;bottom:16px;right:16px;z-index:99999;display:flex;gap:8px}#uwuDock button{width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(20,18,30,.55);backdrop-filter:blur(10px);color:#fff;font-size:20px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 20px rgba(0,0,0,.35)}#uwuDock button.playing{background:linear-gradient(135deg,#ff4fa3,#a855f7)}#uwuToast{position:fixed;bottom:74px;right:16px;z-index:99999;max-width:230px;padding:10px 14px;border-radius:12px;background:rgba(20,18,30,.92);color:#fff;font:12px/1.4 sans-serif;opacity:0;transition:opacity .3s;pointer-events:none}#uwuToast.show{opacity:1}</style>\n<script>(function(){var playBtn=document.getElementById("uwuPlayBtn"),pickBtn=document.getElementById("uwuPickBtn"),pickFile=document.getElementById("uwuPickFile"),toast=document.getElementById("uwuToast"),tHide;function say(m){if(!toast)return;toast.textContent=m;toast.classList.add("show");clearTimeout(tHide);tHide=setTimeout(function(){toast.classList.remove("show");},2800);}function setPlaying(on){playBtn.classList[on?"add":"remove"]("playing");}function bind(a){if(a.__uwuBound)return;a.__uwuBound=true;a.addEventListener("play",function(){setPlaying(true);});a.addEventListener("pause",function(){setPlaying(false);});}function getAudio(){var a=document.getElementById("uwuBgm");if(!a){a=document.createElement("audio");a.id="uwuBgm";a.loop=true;a.setAttribute("playsinline","");a.style.display="none";document.body.appendChild(a);}bind(a);return a;}function hasSrc(a){return !!(a&&(a.getAttribute("src")||a.src));}playBtn.addEventListener("click",function(){var a=getAudio();if(!hasSrc(a)){say("Toca ＋ para subir tu canción 🎵");if(pickFile)pickFile.click();return;}if(a.paused){a.play().then(function(){setPlaying(true);}).catch(function(){say("Toca la pantalla para activar el audio");});}else{a.pause();setPlaying(false);}});if(pickBtn&&pickFile){pickBtn.addEventListener("click",function(){pickFile.click();});pickFile.addEventListener("change",function(){if(pickFile.files&&pickFile.files[0]){var a=getAudio();a.src=URL.createObjectURL(pickFile.files[0]);a.play().then(function(){setPlaying(true);say("🎶 "+pickFile.files[0].name);}).catch(function(){});}}); }window.addEventListener("load",function(){var a=document.getElementById("uwuBgm");if(a){bind(a);if(hasSrc(a))say("🎵 Música lista — toca 🎵");if(!a.paused)setPlaying(true);}});})();<\/script>\n__UWU_AUDIO__\n<script>(function(){var p=new URLSearchParams(location.search);var para=p.get("para")||"",de=p.get("de")||"";var msg=p.get("msg"),sub=p.get("subtitle"),code=p.get("code");function isPh(t){return !t||String(t).indexOf("__UWU_")===0;}var mEl=document.getElementById("uwuMsg"),sEl=document.getElementById("uwuSubtitle"),cEl=document.getElementById("uwuCode");if(mEl){if(msg)mEl.textContent=msg;else if(isPh(mEl.textContent))mEl.textContent=mEl.getAttribute("data-default")||"";}if(sEl){if(sub)sEl.textContent=sub;else if(para||de)sEl.textContent="Para "+(para||"ti")+" — de "+(de||"alguien que te ama");else if(isPh(sEl.textContent))sEl.textContent="";}if(cEl){if(code)cEl.textContent="Código: "+code;else if(isPh(cEl.textContent))cEl.textContent="";}})();<\/script>\n</body>\n</html>';
  }

  function saveTemplateHtml(slug, html, opts) {
    opts = opts || {};
    if (hasTemplateAudio(slug) || (opts && opts.forceAudio)) {
      html = ensureAudioPlaceholder(html);
    }
    if (canUseServerStorage() && opts.serverPublished) {
      return markTemplateHtmlPublished(slug, html, opts);
    }
    var store = loadCatalogStore();
    if (!store.versions) store.versions = {};
    if (!store.activeVersion) store.activeVersion = {};
    if (!store.versions[slug]) store.versions[slug] = [];
    var versionId = opts.versionId;
    if (opts.newVersion || !versionId) {
      versionId = 'v' + Date.now();
      store.versions[slug].push({
        id: versionId,
        name: opts.versionName || ('Versión ' + store.versions[slug].length + 1),
        html: html,
        at: new Date().toISOString()
      });
    } else {
      var cur = store.versions[slug].filter(function (v) { return v.id === versionId; })[0];
      if (cur) {
        cur.html = html;
        cur.at = new Date().toISOString();
        if (opts.versionName) cur.name = opts.versionName;
      } else {
        versionId = 'v' + Date.now();
        store.versions[slug].push({ id: versionId, name: opts.versionName || 'Versión', html: html, at: new Date().toISOString() });
      }
    }
    store.activeVersion[slug] = versionId;
    store.html[slug] = html;
    if (!store.catalog[slug] && _baseCatalog[slug]) {
      store.catalog[slug] = JSON.parse(JSON.stringify(_baseCatalog[slug]));
    }
    if (store.catalog[slug]) store.catalog[slug].page = slug + '.html';
    saveCatalogStore(store);
    return versionId;
  }

  function loadTemplateHtml(slug) {
    var cached = getStoredHtml(slug);
    if (cached) return Promise.resolve(cached);
    var t = CATALOG[slug] || _baseCatalog[slug];
    if (t && t.page) {
      return fetch('d/' + t.page + '?v=' + Date.now()).then(function (r) {
        if (r.ok) return r.text();
        return buildTemplateStub(slug);
      }).catch(function () { return buildTemplateStub(slug); });
    }
    return Promise.resolve(buildTemplateStub(slug));
  }

  function slugifyName(name) {
    return String(name || 'plantilla').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'plantilla';
  }

  function openTemplatePreview(slug) {
    var t = CATALOG[slug];
    var html = getStoredHtml(slug);
    var openBlob = function (content) {
      prepareTemplateOutput(content, slug, {}, true).then(function (out) {
        var blob = new Blob([out], { type: 'text/html;charset=utf-8' });
        window.open(URL.createObjectURL(blob), '_blank');
      });
    };
    if (html) {
      openBlob(html);
      return true;
    }
    if (t && t.page) {
      fetch('d/' + t.page).then(function (r) { return r.text(); }).then(function (fetched) {
        openBlob(fetched);
      }).catch(function () { window.open('d/' + t.page, '_blank'); });
      return true;
    }
    return false;
  }

  function saveTemplate(slug, tpl, opts) {
    opts = opts || {};
    applyTierPrice(tpl);
    var store = loadCatalogStore();
    store.catalog[slug] = tpl;
    if (store.order.indexOf(slug) === -1) store.order.unshift(slug);
    if (opts.showcase) {
      if (store.showcase.indexOf(slug) === -1) store.showcase.unshift(slug);
    } else if (opts.showcase === false) {
      store.showcase = store.showcase.filter(function (s) { return s !== slug; });
    }
    if (opts.html !== undefined) {
      if (!opts.html) {
        delete store.html[slug];
        if (store.versions) delete store.versions[slug];
        if (store.activeVersion) delete store.activeVersion[slug];
      }
    }
    store.hidden = store.hidden.filter(function (s) { return s !== slug; });
    saveCatalogStore(store);
    if (opts.html) saveTemplateHtml(slug, opts.html, { versionName: 'Subida manual' });
    return slug;
  }

  function deleteTemplate(slug, soft) {
    var store = loadCatalogStore();
    if (soft) {
      if (store.hidden.indexOf(slug) === -1) store.hidden.push(slug);
    } else if (store.catalog[slug]) {
      delete store.catalog[slug];
      delete store.html[slug];
      store.order = store.order.filter(function (s) { return s !== slug; });
      store.showcase = store.showcase.filter(function (s) { return s !== slug; });
      store.hidden = store.hidden.filter(function (s) { return s !== slug; });
    } else {
      if (store.hidden.indexOf(slug) === -1) store.hidden.push(slug);
    }
    saveCatalogStore(store);
  }

  function unhideTemplate(slug) {
    var store = loadCatalogStore();
    store.hidden = store.hidden.filter(function (s) { return s !== slug; });
    saveCatalogStore(store);
  }

  function listAdminTemplates() {
    var store = loadCatalogStore();
    var hidden = store.hidden || [];
    return CATALOG_ORDER.map(function (slug) {
      var t = CATALOG[slug];
      return {
        slug: slug,
        tpl: Object.assign({}, t),
        hidden: hidden.indexOf(slug) !== -1,
        hasHtml: !!(store.html[slug] || (t && t.page)),
        hasAudio: !!(
          (store.audio && store.audio[slug]) ||
          (store.catalog[slug] && store.catalog[slug].audio) ||
          (t && t.audio)
        )
      };
    });
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getCur() { return localStorage.getItem('uwuCur') || 'pen'; }

  var TIER_PRICES = {
    free: { pen: '0', usd: '0' },
    prem: { pen: '8', usd: '2.00' },
    excl: { pen: '5', usd: '1.50' }
  };

  function pricesForTier(tier) {
    return TIER_PRICES[tier] || TIER_PRICES.prem;
  }

  function applyTierPrice(tpl) {
    if (!tpl) return tpl;
    var p = pricesForTier(tpl.tier || 'prem');
    tpl.pen = p.pen;
    tpl.usd = p.usd;
    return tpl;
  }

  function tierLabel(tier) {
    if (tier === 'free') return 'Gratis';
    if (tier === 'excl') return '💎 VIP';
    return 'Premium';
  }

  function fmtPrice(t, cur) {
    cur = cur || getCur();
    var priced = applyTierPrice(Object.assign({}, t));
    if (priced.tier === 'free' || priced.pen === '0') return cur === 'pen' ? 'Gratis' : 'Free';
    var prefix = priced.tier === 'excl' ? '💎 ' : '';
    return cur === 'pen' ? prefix + 'S/ ' + priced.pen : prefix + '$' + priced.usd;
  }

  function slugFromPath() {
    var p = location.pathname.replace(/\\/g, '/');
    var m = p.match(/\/d\/([a-z0-9-]+)\.html?$/i);
    if (m) return m[1];
    return new URLSearchParams(location.search).get('slug') || '';
  }

  function dedicationViewUrl(slug, order) {
    var t = CATALOG[slug];
    var q = new URLSearchParams();
    if (order.para) q.set('para', order.para);
    if (order.de) q.set('de', order.de);
    if (order.mensaje) q.set('msg', order.mensaje);
    if (order.accessCode) q.set('code', order.accessCode);
    if (order.cancion) q.set('song', order.cancion);
    if (getStoredHtml(slug)) {
      q.set('slug', slug);
      return 'd/view.html?' + q.toString();
    }
    if (t && t.page) return 'd/' + t.page + '?' + q.toString();
    q.set('slug', slug);
    return 'd/view.html?' + q.toString();
  }

  function personalizeCustomPage(html, slug, data) {
    var para = data.para || 'Mariana';
    var de = data.de || 'Diego';
    var msg = data.mensaje || 'Eres el sueño que nunca quiero despertar 🌙';
    var code = data.accessCode || '';
    var subtitle = 'TE AMO MUCHO, ' + para + ' — ' + de + ' ✨';
    return html
      .replace(/__UWU_MSG__/g, esc(msg))
      .replace(/__UWU_SUBTITLE__/g, esc(subtitle))
      .replace(/__UWU_CODE__/g, esc(code));
  }

  function genAccessCode() {
    var c = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = 'UWU-';
    for (var i = 0; i < 2; i++) {
      if (i) s += '-';
      for (var j = 0; j < 4; j++) s += c[Math.floor(Math.random() * c.length)];
    }
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
    var t = CATALOG[slug];
    if (!t) return '';
    data = data || {};
    var para = data.para || 'Mariana';
    var de = data.de || 'Diego';
    var msg = data.mensaje || 'Desde el día en que llegaste, mi mundo tiene más color. Cada momento contigo es mi lugar favorito… Te amo, hoy y siempre.';
    var code = data.accessCode || genAccessCode();
    var song = data.cancion || 'Ed Sheeran — Perfect';
    return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1"/>\n<title>' + esc(t.emoji + ' ' + t.name + ' — Para ' + para) + '</title>\n<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap" rel="stylesheet"/>\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{font-family:Inter,system-ui,sans-serif;min-height:100svh;background:' + t.grad + ';color:#fff;display:flex;align-items:center;justify-content:center;padding:20px}\n.card{max-width:380px;width:100%;border-radius:32px;background:rgba(0,0,0,.25);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.2);padding:36px 24px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.35)}\n.tag{font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.75}\n.name{font-family:\'Dancing Script\',cursive;font-size:42px;margin:8px 0;text-shadow:0 2px 16px rgba(0,0,0,.3)}\n.msg{font-size:14px;line-height:1.75;font-style:italic;opacity:.92;margin:16px 0}\n.pics{display:flex;gap:8px;justify-content:center;margin:16px 0}\n.pics i{width:58px;height:72px;border-radius:12px;font-style:normal;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(255,255,255,.15)}\n.player{margin-top:20px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:10px 14px;font-size:11px;display:flex;align-items:center;gap:10px}\n.player b{display:block;font-family:Sora,sans-serif;font-size:12px}\n.sig{font-family:\'Dancing Script\',cursive;font-size:26px;margin-top:18px}\n.code{margin-top:20px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.1);font-family:monospace;font-size:11px;letter-spacing:.06em}\n.brand{margin-top:16px;font-size:10px;opacity:.55}\n</style>\n</head>\n<body>\n<div class="card">\n<div class="tag">Para la persona más especial</div>\n<div class="name">' + esc(para) + '</div>\n<div class="msg">' + esc(msg) + '</div>\n<div class="pics"><i>📸</i><i>' + t.emoji + '</i><i>💑</i></div>\n<div class="player"><span>🎵</span><div><b>Nuestra canción</b>' + esc(song) + '</div></div>\n<div class="sig">— ' + esc(de) + ' 💝</div>\n<div class="code">Código: ' + esc(code) + ' · Plantilla ' + esc(t.id) + '</div>\n<div class="brand">Hecho con UWU 🧸 · ' + esc(t.name) + '</div>\n</div>\n</body>\n</html>';
  }

  function downloadHTML(slug, data, filename) {
    var t = CATALOG[slug];
    data = data || {};
    filename = filename || ('uwu-' + slug + '-' + (data.accessCode || 'edicion') + '.html');
    function deliver(html) {
      prepareTemplateOutput(html, slug, data, true).then(function (out) {
        var blob = new Blob([out], { type: 'text/html;charset=utf-8' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      });
    }
    var stored = getStoredHtml(slug);
    if (stored) {
      deliver(stored);
      return;
    }
    if (t && t.page) {
      fetch('d/' + t.page).then(function (r) { return r.text(); }).then(deliver).catch(function () {
        alert('No se pudo descargar. Usa el enlace "Ver en línea" y guarda la página.');
      });
      return;
    }
    deliver(buildDedicationHTML(slug, data));
  }

  function renderDedicationPage(slug, container) {
    slug = slug || slugFromPath();
    var t = CATALOG[slug];
    if (!t) {
      document.body.innerHTML = '<p style="padding:40px;text-align:center;font-family:system-ui">Dedicatoria no encontrada. <a href="../index.html">Volver a UWU</a></p>';
      return;
    }
    var params = new URLSearchParams(location.search);
    var data = {
      para: params.get('para') || 'Mariana',
      de: params.get('de') || 'Diego',
      mensaje: params.get('msg') || 'Desde el día en que llegaste, mi mundo tiene más color. Cada momento contigo es mi lugar favorito… Te amo, hoy y siempre.',
      accessCode: params.get('code') || null,
      cancion: params.get('song') || 'Ed Sheeran — Perfect'
    };
    var stored = getStoredHtml(slug);
    if (stored) {
      prepareTemplateOutput(stored, slug, data, false).then(function (out) {
        document.open();
        document.write(out);
        document.close();
      });
      return;
    }
    if (t.page) {
      fetch('d/' + t.page).then(function (r) { return r.text(); }).then(function (html) {
        prepareTemplateOutput(html, slug, data, false).then(function (out) {
          document.open();
          document.write(out);
          document.close();
        });
      }).catch(function () {
        document.body.innerHTML = '<p style="padding:40px;text-align:center">No se pudo cargar la plantilla.</p>';
      });
      return;
    }
    document.title = 'UWU — ' + t.name + ' para ' + data.para;
    container = container || document.getElementById('uwu-dedication');
    if (!container) return;
    container.innerHTML =
      '<div class="d-card" style="background:' + t.grad + '">' +
      '<div class="d-inner">' +
      '<div class="d-tag">Para la persona más especial</div>' +
      '<div class="d-name">' + esc(data.para) + '</div>' +
      '<div class="d-msg">' + esc(data.mensaje) + '</div>' +
      '<div class="d-pics"><i>📸</i><i>' + t.emoji + '</i><i>💑</i></div>' +
      '<div class="d-player">🎵 <div><b>Nuestra canción</b>' + esc(data.cancion) + '</div></div>' +
      '<div class="d-sig">— ' + esc(data.de) + ' 💝</div>' +
      (data.accessCode ? '<div class="d-code">🔑 ' + esc(data.accessCode) + '</div>' : '') +
      '<div class="d-brand">Hecho con UWU 🧸 · ' + esc(t.name) + ' (' + esc(t.id) + ')</div>' +
      '</div></div>';
  }

  var CATEGORIES = [
    { id:'enamorar',         label:'Enamorar',          emoji:'❤️', match:['Enamorar'] },
    { id:'amar',             label:'Amar',              emoji:'💕', match:['Amar','Carta romántica'] },
    { id:'sorprender',       label:'Sorprender',        emoji:'🥰', match:['Sorprender'] },
    { id:'pedida-de-mano',   label:'Pedida de mano',    emoji:'💍', match:['Pedida de mano'] },
    { id:'cumpleanos',       label:'Cumpleaños',        emoji:'🎂', match:['Cumpleaños'] },
    { id:'san-valentin',     label:'San Valentín',      emoji:'🌹', match:['San Valentín'] },
    { id:'aniversarios',     label:'Aniversarios',      emoji:'💒', match:['Aniversario'] },
    { id:'perdon',           label:'Perdón',            emoji:'🌸', match:['Perdón'] },
    { id:'extranar',         label:'Extrañar',          emoji:'🤗', match:['Extrañar'] },
    { id:'olvidar-soltar',   label:'Olvidar y soltar',  emoji:'💔', match:['Cerrar ciclos'] },
    { id:'familia',          label:'Familia',           emoji:'👨‍👩‍👧', match:['Familia'] },
    { id:'mascotas',         label:'Mascotas',          emoji:'🐶', match:['Mascotas'] },
    { id:'fechas-especiales',label:'Fechas especiales', emoji:'🎄', match:['Fechas especiales'] },
    { id:'despedidas',       label:'Despedidas',        emoji:'😢', match:['Cerrar ciclos'] },
    { id:'agradecer',        label:'Agradecer',         emoji:'💌', match:['Familia','Amar','Carta romántica'] }
  ];

  var activeCategory = null;

  function getCategoryById(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i];
    }
    return null;
  }

  function templateMatchesCategory(tpl, catId) {
    var cat = getCategoryById(catId);
    if (!cat || !tpl) return false;
    return cat.match.indexOf(tpl.cat) !== -1;
  }

  function getSlugsForCategory(catId) {
    if (!catId) return CATALOG_ORDER.slice();
    return CATALOG_ORDER.filter(function (slug) {
      return templateMatchesCategory(CATALOG[slug], catId);
    });
  }

  function bindCategoryPills() {
    if (global.__catPillsBound) return;
    global.__catPillsBound = true;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.cat-pill');
      if (!btn || !btn.dataset.cat) return;
      setCategoryFilter(btn.dataset.cat);
    });
  }

  function setCategoryFilter(catId, opts) {
    opts = opts || {};
    activeCategory = catId || null;
    if (activeCategory) {
      try { sessionStorage.setItem('uwuCat', activeCategory); } catch (e) {}
    } else {
      try { sessionStorage.removeItem('uwuCat'); } catch (e) {}
    }
    document.querySelectorAll('.cat-pill').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.cat === activeCategory);
    });
    var bar = document.getElementById('catFilterBar');
    var cat = activeCategory ? getCategoryById(activeCategory) : null;
    if (bar) {
      if (cat) {
        bar.hidden = false;
        bar.innerHTML =
          '<span class="cat-filter-active">' + cat.emoji + ' ' + esc(cat.label) + '</span>' +
          '<span class="cat-filter-count" id="catFilterCount"></span>' +
          '<button type="button" class="cat-filter-clear" id="catFilterClear">✕ Ver todas</button>';
        var clearBtn = document.getElementById('catFilterClear');
        if (clearBtn) clearBtn.onclick = function () { setCategoryFilter(null, { scroll: false }); };
      } else {
        bar.hidden = true;
        bar.innerHTML = '';
      }
    }
    var catalogOpts = Object.assign({}, global.__uwuCatalogOpts || {});
    if (opts.reveal) catalogOpts.reveal = opts.reveal;
    buildCatalogUI(catalogOpts);
    if (opts.scroll !== false && activeCategory) {
      if (global.__scrollToPlantillas) global.__scrollToPlantillas(opts.smooth !== false);
      else {
        var sec = document.getElementById('plantillas');
        if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    if (opts.updateUrl !== false) {
      var url = new URL(location.href);
      if (activeCategory) url.searchParams.set('cat', activeCategory);
      else url.searchParams.delete('cat');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
  }

  function applyCategoryFromUrl() {
    var fromUrl = new URLSearchParams(location.search).get('cat');
    var fromStore = null;
    try { fromStore = sessionStorage.getItem('uwuCat'); } catch (e) {}
    var id = fromUrl || fromStore;
    if (id && getCategoryById(id)) {
      setCategoryFilter(id, { scroll: !!fromUrl && location.hash === '#plantillas', updateUrl: true });
    }
  }

  function fillMarqueeTrack(track, saveHalf) {
    if (!track) return;
    var html = CATEGORIES.map(function (cat) {
      return '<button type="button" class="cat-pill" data-cat="' + cat.id + '" title="Ver plantillas de ' + esc(cat.label) + '">' +
        cat.emoji + ' ' + esc(cat.label) + '</button>';
    }).join('');
    if (saveHalf) global.__marqHalf = html;
    track.innerHTML = html + html;
  }

  function renderMarquee() {
    bindCategoryPills();
    fillMarqueeTrack(document.getElementById('marquee'), true);
  }

  function buildCatalogUI(opts) {
    opts = opts || {};
    var cur = getCur();
    var onDemo = opts.onDemo || function () {};
    var slugs = getSlugsForCategory(activeCategory);
    var grid = document.getElementById('showGrid');
    var countEl = document.getElementById('catFilterCount');
    if (countEl) {
      countEl.textContent = slugs.length
        ? slugs.length + ' plantilla' + (slugs.length === 1 ? '' : 's')
        : 'Sin plantillas aún';
    }
    if (grid) {
      if (!slugs.length) {
        var cat = activeCategory ? getCategoryById(activeCategory) : null;
        grid.innerHTML =
          '<div class="cat-empty rv on">' +
          '<div class="big">' + (cat ? cat.emoji : '🔍') + '</div>' +
          '<b>' + (cat ? 'Pronto habrá plantillas de ' + esc(cat.label) : 'Sin resultados') + '</b>' +
          '<p>Estamos preparando más diseños para esta categoría. Mientras tanto, explora otras plantillas.</p>' +
          '<button type="button" class="btn sm" id="catEmptyAll">Ver todas las plantillas</button>' +
          '</div>';
        var emptyBtn = document.getElementById('catEmptyAll');
        if (emptyBtn) emptyBtn.onclick = function () { setCategoryFilter(null); };
        return;
      }
      grid.innerHTML = slugs.map(function (slug, i) {
        var t = CATALOG[slug];
        if (!t) return '';
        var delay = i % 3 ? ' d' + (i % 3) : '';
        return '<div class="mini rv' + delay + '" data-slug="' + slug + '">' +
          '<div class="mbar"><u></u><u></u><u></u><s>uwu.app/d/' + slug + '</s></div>' +
          '<div class="mview" style="background:' + t.grad + '">' +
          '<div class="shimmer"></div><div class="big">' + t.emoji + '</div>' +
          '<div class="t1">' + esc(t.title || t.name) + '</div>' +
          '<div class="t2">' + esc(t.desc || t.cat) + '</div>' +
          '<div class="pill">' + esc(t.pill) + '</div></div>' +
          '<div class="minf"><div><div class="nm">' + esc(t.name) + '</div><div class="ct">' + t.emoji + ' ' + esc(t.cat) + '</div></div>' +
          '<span class="tg code">' + esc(t.id) + '</span>' +
          '<span class="price-tag tpl-price" data-slug="' + slug + '">' + fmtPrice(t, cur) + '</span>' +
          '<div class="buy-row">' +
          '<button class="btn sm ghost" type="button" data-demo="1" data-demo-slug="' + slug + '">👁 Demo</button>' +
          '<button class="btn sm" type="button" data-buy="' + slug + '">💳 Comprar</button>' +
          '</div></div></div>';
      }).join('');
      grid.querySelectorAll('[data-demo]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          var slug = btn.dataset.demoSlug;
          if (!openTemplatePreview(slug)) onDemo();
        });
      });
      grid.querySelectorAll('[data-buy]').forEach(function (btn) {
        btn.addEventListener('click', function (e) { e.stopPropagation(); openCheckout(btn.dataset.buy); });
      });
      if (activeCategory) {
        grid.querySelectorAll('.rv').forEach(function (el) { el.classList.add('on'); });
      }
    }
    var car = document.getElementById('car');
    if (car) {
      car.innerHTML = CATALOG_ORDER.map(function (slug) {
        var t = CATALOG[slug];
        if (!t) return '';
        return '<div class="tcard" data-slug="' + slug + '" data-buy="' + slug + '" style="cursor:pointer">' +
          '<div class="art" style="background:' + t.grad + '">' + t.emoji + '<small>Comprar</small></div>' +
          '<div class="inf"><span class="tg code">' + esc(t.id) + '</span>' +
          '<b>' + esc(t.name) + '</b><span>' + esc(t.cat) + '</span>' +
          '<span class="price tpl-price" data-slug="' + slug + '">' + fmtPrice(t, cur) + '</span></div></div>';
      }).join('');
      car.querySelectorAll('[data-buy]').forEach(function (card) {
        card.addEventListener('click', function () { openCheckout(card.dataset.buy); });
      });
    }
    if (opts.reveal && typeof opts.reveal === 'function') opts.reveal();
  }

  function updatePrices(cur) {
    cur = cur || getCur();
    document.querySelectorAll('.tpl-price').forEach(function (el) {
      var t = CATALOG[el.dataset.slug];
      if (t) el.textContent = fmtPrice(t, cur);
    });
    var cp = document.getElementById('chkPrice');
    if (cp && window.__chkSlug) {
      var active = CATALOG[window.__chkSlug];
      if (active) cp.textContent = fmtPrice(active, cur);
    }
  }

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
      '<div class="cur-toggle" role="group" aria-label="Elegir moneda">' +
      '<button type="button" data-c="pen">🇵🇪 Soles S/</button>' +
      '<button type="button" data-c="usd">🇺🇸 Dólares $</button>' +
      '</div>' +
      '<div class="chk-price">Total: <strong id="chkPrice">S/ 8</strong></div>' +
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
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCheckout();
    });
    ov.querySelectorAll('.cur-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { setCurrency(b.dataset.c); });
    });
    setCurrency(getCur());
  }

  var __chkSlug = null;

  function openCheckout(slug) {
    if (document.body && document.body.classList.contains('adm')) return;
    var t = CATALOG[slug];
    if (!t) return;
    ensureCheckoutUI();
    __chkSlug = slug;
    window.__chkSlug = slug;
    document.getElementById('chkEmoji').textContent = t.emoji;
    document.getElementById('chkName').textContent = t.name;
    document.getElementById('chkCat').textContent = t.cat + ' · ' + t.id;
    document.getElementById('chkTplCode').textContent = t.id;
    document.getElementById('chkPrice').textContent = fmtPrice(t);
    document.getElementById('chkPara').value = '';
    document.getElementById('chkDe').value = '';
    document.getElementById('chkMsg').value = slug === 'hello-kitty' ? 'Eres el sueño que nunca quiero despertar 🌙' : '';
    document.getElementById('chkSong').value = 'Ed Sheeran — Perfect';
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
    var t = CATALOG[__chkSlug];
    if (!t) return;
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
    document.getElementById('chkViewLink').href = dedicationViewUrl(__chkSlug, order);
    document.getElementById('chkStep1').hidden = true;
    document.getElementById('chkStep2').hidden = false;
  }

  function setCurrency(c) {
    localStorage.setItem('uwuCur', c);
    document.querySelectorAll('.money').forEach(function (el) {
      if (el.dataset[c]) el.textContent = el.dataset[c];
    });
    document.querySelectorAll('.cur-toggle button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.c === c);
    });
    updatePrices(c);
  }

  initCatalog();

  global.UWU = {
    SHOWCASE: SHOWCASE,
    CATALOG_ORDER: CATALOG_ORDER,
    CATALOG: CATALOG,
    CATEGORIES: CATEGORIES,
    esc: esc,
    tierLabel: tierLabel,
    pricesForTier: pricesForTier,
    applyTierPrice: applyTierPrice,
    getCur: getCur,
    fmtPrice: fmtPrice,
    slugFromPath: slugFromPath,
    dedicationViewUrl: dedicationViewUrl,
    genAccessCode: genAccessCode,
    buildDedicationHTML: buildDedicationHTML,
    downloadHTML: downloadHTML,
    renderDedicationPage: renderDedicationPage,
    buildCatalogUI: buildCatalogUI,
    renderMarquee: renderMarquee,
    setCategoryFilter: setCategoryFilter,
    applyCategoryFromUrl: applyCategoryFromUrl,
    updatePrices: updatePrices,
    openCheckout: openCheckout,
    closeCheckout: closeCheckout,
    setCurrency: setCurrency,
    getOrders: getOrders,
    initCatalog: initCatalog,
    bootstrap: bootstrap,
    loadRemoteCatalog: loadRemoteCatalog,
    loadCatalogStore: loadCatalogStore,
    saveCatalogStore: saveCatalogStore,
    getStoredHtml: getStoredHtml,
    loadTemplateHtml: loadTemplateHtml,
    saveTemplateHtml: saveTemplateHtml,
    listTemplateVersions: listTemplateVersions,
    setActiveTemplateVersion: setActiveTemplateVersion,
    buildTemplateStub: buildTemplateStub,
    saveTemplateAudio: saveTemplateAudio,
    hasTemplateAudio: hasTemplateAudio,
    markTemplateAudioPublished: markTemplateAudioPublished,
    markTemplateHtmlPublished: markTemplateHtmlPublished,
    canUseServerStorage: canUseServerStorage,
    removeTemplateAudio: removeTemplateAudio,
    getTemplateAudioFetchUrl: getTemplateAudioFetchUrl,
    prepareTemplateOutput: prepareTemplateOutput,
    finalizeTemplateHtml: finalizeTemplateHtml,
    ensureAudioPlaceholder: ensureAudioPlaceholder,
    hasAudioHook: hasAudioHook,
    getAudioSrcForSlug: getAudioSrcForSlug,
    saveTemplate: saveTemplate,
    deleteTemplate: deleteTemplate,
    unhideTemplate: unhideTemplate,
    listAdminTemplates: listAdminTemplates,
    slugifyName: slugifyName,
    openTemplatePreview: openTemplatePreview,
    invalidateStoreCache: invalidateStoreCache
  };
  global.openCheckout = openCheckout;
})(typeof window !== 'undefined' ? window : this);
