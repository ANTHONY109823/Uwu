/* Sincronización del catálogo UWU con GitHub */
(function (global) {
  'use strict';

  var CONFIG_KEY = 'uwuGitHubSync';
  var CATALOG_PATH = 'docs/data/catalog.json';

  function defaultConfig() {
    return {
      token: '',
      owner: 'ANTHONY109823',
      repo: 'Uwu',
      branch: 'main',
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

  function isReady() {
    var c = getConfig();
    return !!(c.enabled && c.token && c.owner && c.repo && c.branch);
  }

  function headers(cfg) {
    return {
      Authorization: 'Bearer ' + cfg.token,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    };
  }

  function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function apiUrl(cfg, path) {
    return 'https://api.github.com/repos/' + encodeURIComponent(cfg.owner) + '/' +
      encodeURIComponent(cfg.repo) + '/contents/' + path.split('/').map(encodeURIComponent).join('/');
  }

  function getFileMeta(cfg, path) {
    return fetch(apiUrl(cfg, path) + '?ref=' + encodeURIComponent(cfg.branch), {
      method: 'GET',
      headers: headers(cfg)
    }).then(function (res) {
      if (res.status === 404) return null;
      if (!res.ok) {
        return res.json().then(function (j) {
          throw new Error((j && j.message) || 'No se pudo leer ' + path);
        });
      }
      return res.json();
    });
  }

  function isUnchangedError(status, j) {
    if (status !== 422) return false;
    var msg = (j && j.message) || '';
    if (/identical|not changed|same/i.test(msg)) return true;
    if (j && j.errors) {
      return j.errors.some(function (e) {
        return /not changed|identical|same/i.test(String(e.message || e.code || ''));
      });
    }
    return false;
  }

  function putFileBinary(cfg, path, base64Content, message, retried) {
    return getFileMeta(cfg, path).then(function (meta) {
      var body = {
        message: message,
        content: base64Content,
        branch: cfg.branch
      };
      if (meta && meta.sha) body.sha = meta.sha;
      return fetch(apiUrl(cfg, path), {
        method: 'PUT',
        headers: headers(cfg),
        body: JSON.stringify(body)
      }).then(function (res) {
        if (res.ok) return res.json();
        return res.json().then(function (j) {
          if (isUnchangedError(res.status, j)) {
            return { unchanged: true, path: path };
          }
          if (res.status === 409 && !retried) {
            return putFileBinary(cfg, path, base64Content, message, true);
          }
          var extra = (j && j.errors && j.errors.length) ? ' — ' + j.errors.map(function (e) { return e.message || e.code; }).join('; ') : '';
          throw new Error(((j && j.message) || 'Error al guardar ' + path) + extra);
        });
      });
    });
  }

  function putFile(cfg, path, content, message, retried) {
    return getFileMeta(cfg, path).then(function (meta) {
      var body = {
        message: message,
        content: toBase64(content),
        branch: cfg.branch
      };
      if (meta && meta.sha) body.sha = meta.sha;
      return fetch(apiUrl(cfg, path), {
        method: 'PUT',
        headers: headers(cfg),
        body: JSON.stringify(body)
      }).then(function (res) {
        if (res.ok) return res.json();
        return res.json().then(function (j) {
          if (isUnchangedError(res.status, j)) {
            return { unchanged: true, path: path };
          }
          if (res.status === 409 && !retried) {
            return putFile(cfg, path, content, message, true);
          }
          var extra = (j && j.errors && j.errors.length) ? ' — ' + j.errors.map(function (e) { return e.message || e.code; }).join('; ') : '';
          throw new Error(((j && j.message) || 'Error al guardar ' + path) + extra);
        });
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
    var extra = (global.UWU && global.UWU.getSiteOpsPayload) ? global.UWU.getSiteOpsPayload() : { site: {}, ops: { sections: {} } };
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      catalog: catalog,
      order: (store.order && store.order.length) ? store.order.slice() : (global.UWU ? global.UWU.CATALOG_ORDER.slice() : []),
      showcase: (store.showcase || []).slice(),
      hidden: (store.hidden || []).slice(),
      tierPrices: store.tierPrices || {},
      site: extra.site || {},
      ops: extra.ops || { sections: {} }
    };
  }

  function syncCatalog(store, opts) {
    opts = opts || {};
    var cfg = getConfig();
    if (!isReady()) {
      return Promise.reject(new Error('Configura tu token de GitHub para sincronizar.'));
    }
    store = store || (global.UWU ? global.UWU.loadCatalogStore() : { catalog: {}, order: [], showcase: [], hidden: [], html: {}, audio: {} });
    var htmlKeys = opts.onlySlug ? [opts.onlySlug] : Object.keys(store.html || {});
    htmlKeys = htmlKeys.filter(function (slug) { return store.html && store.html[slug]; });
    var audioKeys = opts.onlySlug ? [opts.onlySlug] : Object.keys(store.audio || {});
    audioKeys = audioKeys.filter(function (slug) { return store.audio && store.audio[slug]; });
    var chain = Promise.resolve();
    htmlKeys.forEach(function (slug) {
      chain = chain.then(function () {
        return putFile(cfg, 'docs/d/' + slug + '.html', store.html[slug], 'UWU: actualizar plantilla ' + slug);
      });
    });
    audioKeys.forEach(function (slug) {
      chain = chain.then(function () {
        return putFileBinary(cfg, 'docs/d/audio/' + slug + '.mp3', store.audio[slug], 'UWU: actualizar audio ' + slug);
      });
    });
    return chain.then(function () {
      var payload = buildRemotePayload(store);
      return putFile(cfg, CATALOG_PATH, JSON.stringify(payload, null, 2), 'UWU: sincronizar catálogo de plantillas');
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
          if (!cleaned.catalog[slug] && global.UWU.CATALOG[slug]) {
            cleaned.catalog[slug] = JSON.parse(JSON.stringify(global.UWU.CATALOG[slug]));
          }
          if (cleaned.catalog[slug]) cleaned.catalog[slug].audio = slug + '.mp3';
        });
        global.UWU.saveCatalogStore(cleaned);
      }
      return { ok: true, at: new Date().toISOString() };
    });
  }

  function pullCatalog() {
    return fetch('data/catalog.json?v=' + Date.now()).then(function (res) {
      if (!res.ok) return null;
      return res.json();
    }).catch(function () { return null; });
  }

  function testConnection() {
    var cfg = getConfig();
    if (!isReady()) return Promise.reject(new Error('Falta el token o la configuración del repositorio.'));
    return fetch('https://api.github.com/repos/' + encodeURIComponent(cfg.owner) + '/' + encodeURIComponent(cfg.repo), {
      headers: headers(cfg)
    }).then(function (res) {
      return res.json().then(function (j) {
        if (!res.ok) throw new Error(j.message || 'No se pudo acceder al repositorio');
        return { ok: true, full_name: j.full_name, default_branch: j.default_branch };
      });
    });
  }

  global.UWUGitHubSync = {
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
        tierPrices: remote.tierPrices || {},
        html: {}
      };
    }
  };
})(typeof window !== 'undefined' ? window : this);
