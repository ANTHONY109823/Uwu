/* Sincronización del catálogo UWU con Railway (reemplaza GitHub API) */
(function (global) {
  'use strict';

  var CONFIG_KEY = 'uwuRailwaySync';

  function defaultConfig() {
    return {
      baseUrl: '',
      token: '',
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

  function isReady() {
    var c = getConfig();
    return !!(c.enabled && c.baseUrl && c.token);
  }

  function headers(cfg) {
    return {
      Authorization: 'Bearer ' + cfg.token,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    };
  }

  function apiUrl(cfg, path) {
    return normalizeBase(cfg.baseUrl) + path;
  }

  function request(cfg, path, options) {
    options = options || {};
    return fetch(apiUrl(cfg, path), {
      method: options.method || 'GET',
      headers: headers(cfg),
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

    var chain = Promise.resolve();
    htmlKeys.forEach(function (slug) {
      chain = chain.then(function () {
        return request(cfg, '/api/sync/template/' + encodeURIComponent(slug), {
          method: 'PUT',
          body: { content: store.html[slug] }
        });
      });
    });
    audioKeys.forEach(function (slug) {
      chain = chain.then(function () {
        return request(cfg, '/api/sync/audio/' + encodeURIComponent(slug), {
          method: 'PUT',
          body: { content: store.audio[slug] }
        });
      });
    });
    removeAudio.forEach(function (slug) {
      chain = chain.then(function () {
        return request(cfg, '/api/sync/audio/' + encodeURIComponent(slug), { method: 'DELETE' });
      });
    });
    return chain.then(function () {
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
    if (!isReady()) return Promise.reject(new Error('Falta la URL o el token de Railway.'));
    return request(cfg, '/api/admin/test').then(function (j) {
      return { ok: true, message: j.message || 'OK', baseUrl: normalizeBase(cfg.baseUrl) };
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
