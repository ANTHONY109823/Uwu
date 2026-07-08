/* Sincronización del catálogo UWU con Railway (reemplaza GitHub API) */
(function (global) {
  'use strict';

  var CONFIG_KEY = 'uwuRailwaySync';

  function defaultConfig() {
    return {
      baseUrl: '',
      token: '',
      useCookie: true,
      enabled: true
    };
  }

  function getConfig() {
    try {
      return Object.assign(defaultConfig(), JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'));
    } catch (e) {
      return defaultConfig();
    }
  }

  function saveConfig(cfg) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(Object.assign(defaultConfig(), cfg)));
  }

  function normalizeBase(url) {
    return String(url || '').replace(/\/+$/, '');
  }

  function getBaseUrl(cfg) {
    if (cfg.baseUrl) return normalizeBase(cfg.baseUrl);
    if (typeof location !== 'undefined' && location.origin && location.protocol !== 'file:') {
      return normalizeBase(location.origin);
    }
    return '';
  }

  function isReady() {
    var c = getConfig();
    if (!c.enabled) return false;
    return !!getBaseUrl(c);
  }

  function headers(cfg) {
    var h = {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
    if (cfg.token) h.Authorization = 'Bearer ' + cfg.token;
    return h;
  }

  function apiUrl(cfg, path) {
    return getBaseUrl(cfg) + path;
  }

  function request(cfg, path, options) {
    options = options || {};
    return fetch(apiUrl(cfg, path), {
      method: options.method || 'GET',
      headers: headers(cfg),
      credentials: cfg.useCookie !== false ? 'include' : 'same-origin',
      body: options.body != null ? JSON.stringify(options.body) : undefined
    }).then(function (res) {
      return res.json().then(function (j) {
        if (!res.ok) throw new Error((j && j.error) || (j && j.message) || ('Error HTTP ' + res.status));
        return j;
      });
    });
  }

  function buildRemotePayload(store) {
    var catalog = JSON.parse(JSON.stringify(store.catalog || {}));
    Object.keys(store.html || {}).forEach(function (slug) {
      if (!catalog[slug] && global.UWU && global.UWU.CATALOG[slug]) {
        catalog[slug] = JSON.parse(JSON.stringify(global.UWU.CATALOG[slug]));
      }
      if (catalog[slug]) catalog[slug].page = slug + '.html';
    });
    Object.keys(store.audio || {}).forEach(function (slug) {
      if (!catalog[slug] && global.UWU && global.UWU.CATALOG[slug]) {
        catalog[slug] = JSON.parse(JSON.stringify(global.UWU.CATALOG[slug]));
      }
      if (catalog[slug]) catalog[slug].audio = slug + '.mp3';
    });
    Object.keys(store.catalog || {}).forEach(function (slug) {
      if (catalog[slug] && store.catalog[slug].audio) catalog[slug].audio = store.catalog[slug].audio;
    });
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      catalog: catalog,
      order: (store.order && store.order.length) ? store.order.slice() : (global.UWU ? global.UWU.CATALOG_ORDER.slice() : []),
      showcase: (store.showcase || []).slice(),
      hidden: (store.hidden || []).slice()
    };
  }

  function fileToBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var parts = String(reader.result).split(',');
        resolve(parts.length > 1 ? parts[1] : parts[0]);
      };
      reader.onerror = function () { reject(new Error('No se pudo leer el archivo')); };
      reader.readAsDataURL(file);
    });
  }

  function uploadTemplate(slug, html) {
    var cfg = getConfig();
    return request(cfg, '/api/sync/template/' + encodeURIComponent(slug), {
      method: 'PUT',
      body: { content: html }
    });
  }

  function uploadAudio(slug, file) {
    var cfg = getConfig();
    return fileToBase64(file).then(function (b64) {
      return request(cfg, '/api/sync/audio/' + encodeURIComponent(slug), {
        method: 'PUT',
        body: { content: b64 }
      });
    });
  }

  function deleteAudio(slug) {
    var cfg = getConfig();
    return request(cfg, '/api/sync/audio/' + encodeURIComponent(slug), { method: 'DELETE' });
  }

  function syncWorkspace(opts) {
    opts = opts || {};
    var slug = opts.slug;
    if (!slug) return Promise.reject(new Error('Falta slug'));
    var cfg = getConfig();
    if (!isReady()) {
      return Promise.reject(new Error('Configura Railway o inicia sesión en el admin.'));
    }
    var jobs = [];
    if (opts.html != null) {
      jobs.push(uploadTemplate(slug, opts.html));
    }
    if (opts.removeAudio) {
      jobs.push(deleteAudio(slug));
    } else if (opts.audioFile) {
      jobs.push(uploadAudio(slug, opts.audioFile));
    }
    return Promise.all(jobs).then(function () {
      if (!global.UWU) return { ok: true, at: new Date().toISOString() };
      var store = global.UWU.loadCatalogStore();
      var payload = buildRemotePayload(store);
      return request(cfg, '/api/sync/catalog', { method: 'PUT', body: payload });
    }).then(function () {
      return { ok: true, at: new Date().toISOString() };
    });
  }

  function syncCatalog(store, opts) {
    opts = opts || {};
    var cfg = getConfig();
    if (!isReady()) {
      return Promise.reject(new Error('Configura la URL y token de Railway en Configuración.'));
    }
    store = store || (global.UWU ? global.UWU.loadCatalogStore() : { catalog: {}, order: [], showcase: [], hidden: [], html: {}, audio: {} });
    var htmlKeys = opts.onlySlug ? [opts.onlySlug] : Object.keys(store.html || {});
    htmlKeys = htmlKeys.filter(function (slug) { return store.html && store.html[slug]; });
    var audioKeys = opts.onlySlug ? [opts.onlySlug] : Object.keys(store.audio || {});
    audioKeys = audioKeys.filter(function (slug) { return store.audio && store.audio[slug]; });
    var removeAudio = opts.removeAudio || [];

    var jobs = [];
    htmlKeys.forEach(function (slug) {
      jobs.push(request(cfg, '/api/sync/template/' + encodeURIComponent(slug), {
        method: 'PUT',
        body: { content: store.html[slug] }
      }));
    });
    audioKeys.forEach(function (slug) {
      jobs.push(request(cfg, '/api/sync/audio/' + encodeURIComponent(slug), {
        method: 'PUT',
        body: { content: store.audio[slug] }
      }));
    });
    removeAudio.forEach(function (slug) {
      jobs.push(request(cfg, '/api/sync/audio/' + encodeURIComponent(slug), { method: 'DELETE' }));
    });
    return Promise.all(jobs).then(function () {
      var payload = buildRemotePayload(store);
      return request(cfg, '/api/sync/catalog', { method: 'PUT', body: payload });
    }).then(function () {
      if (global.UWU) {
        var cleaned = global.UWU.loadCatalogStore();
        htmlKeys.forEach(function (slug) {
          delete cleaned.html[slug];
          if (cleaned.catalog[slug]) cleaned.catalog[slug].page = slug + '.html';
          else if (global.UWU.CATALOG[slug]) {
            cleaned.catalog[slug] = JSON.parse(JSON.stringify(global.UWU.CATALOG[slug]));
            cleaned.catalog[slug].page = slug + '.html';
          }
        });
        audioKeys.forEach(function (slug) {
          delete cleaned.audio[slug];
          delete cleaned.audioMeta[slug];
          if (!cleaned.catalog[slug] && global.UWU.CATALOG[slug]) {
            cleaned.catalog[slug] = JSON.parse(JSON.stringify(global.UWU.CATALOG[slug]));
          }
          if (cleaned.catalog[slug]) cleaned.catalog[slug].audio = slug + '.mp3';
        });
        removeAudio.forEach(function (slug) {
          delete cleaned.audio[slug];
          delete cleaned.audioMeta[slug];
          if (cleaned.catalog[slug]) delete cleaned.catalog[slug].audio;
        });
        global.UWU.saveCatalogStore(cleaned);
      }
      return { ok: true, at: new Date().toISOString() };
    });
  }

  function testConnection() {
    var cfg = getConfig();
    if (!isReady()) return Promise.reject(new Error('Falta la URL de Railway.'));
    return request(cfg, '/api/admin/test').then(function (j) {
      return { ok: true, message: j.message || 'OK', baseUrl: getBaseUrl(cfg) };
    });
  }

  function pullCatalog() {
    return fetch('data/catalog.json?v=' + Date.now()).then(function (res) {
      if (!res.ok) return null;
      return res.json();
    }).catch(function () { return null; });
  }

  global.UWURailwaySync = {
    getConfig: getConfig,
    saveConfig: saveConfig,
    isReady: isReady,
    uploadTemplate: uploadTemplate,
    uploadAudio: uploadAudio,
    deleteAudio: deleteAudio,
    syncWorkspace: syncWorkspace,
    syncCatalog: syncCatalog,
    pullCatalog: pullCatalog,
    testConnection: testConnection,
    remoteToStore: function (remote) {
      if (!remote) return null;
      return {
        catalog: remote.catalog || {},
        order: remote.order || [],
        showcase: remote.showcase || [],
        hidden: remote.hidden || [],
        html: {}
      };
    }
  };
})(typeof window !== 'undefined' ? window : this);
