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

  function putFile(cfg, path, content, message) {
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
        if (!res.ok) {
          return res.json().then(function (j) {
            throw new Error((j && j.message) || 'Error al guardar ' + path);
          });
        }
        return res.json();
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
    return {
      version: 1,
      updatedAt: new Date().toISOString(),
      catalog: catalog,
      order: (store.order && store.order.length) ? store.order.slice() : (global.UWU ? global.UWU.CATALOG_ORDER.slice() : []),
      showcase: (store.showcase || []).slice(),
      hidden: (store.hidden || []).slice()
    };
  }

  function syncCatalog(store) {
    var cfg = getConfig();
    if (!isReady()) {
      return Promise.reject(new Error('Configura tu token de GitHub para sincronizar.'));
    }
    store = store || (global.UWU ? global.UWU.loadCatalogStore() : { catalog: {}, order: [], showcase: [], hidden: [], html: {} });
    var chain = Promise.resolve();
    var htmlKeys = Object.keys(store.html || {});
    htmlKeys.forEach(function (slug) {
      chain = chain.then(function () {
        return putFile(cfg, 'docs/d/' + slug + '.html', store.html[slug], 'UWU: actualizar plantilla ' + slug);
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

  global.UWUGitHubSync = {
    getConfig: getConfig,
    saveConfig: saveConfig,
    isReady: isReady,
    syncCatalog: syncCatalog,
    pullCatalog: pullCatalog,
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
