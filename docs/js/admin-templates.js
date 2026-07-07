/* Panel admin — plantillas por categoría, tier y editor HTML */
(function () {
  'use strict';

  var TIERS = [
    { id: 'all', label: 'Todas' },
    { id: 'free', label: 'Gratis' },
    { id: 'prem', label: 'Premium' },
    { id: 'excl', label: '💎 Exclusiva' }
  ];

  var CAT_OPTIONS = [
    'Enamorar', 'Amar', 'Carta romántica', 'Sorprender', 'Pedida de mano', 'Cumpleaños',
    'San Valentín', 'Aniversario', 'Perdón', 'Extrañar', 'Cerrar ciclos', 'Familia',
    'Mascotas', 'Fechas especiales'
  ];

  var activeTier = 'all';
  var activeCat = 'all';
  var editingSlug = null;
  var currentHtml = '';

  function el(id) { return document.getElementById(id); }

  function setSyncStatus(msg, kind) {
    var node = el('ghSyncStatus');
    if (!node) return;
    node.textContent = msg;
    node.className = 'html-status' + (kind ? ' sync-' + kind : '');
  }

  function syncNow(showAlert) {
    if (typeof UWUGitHubSync === 'undefined' || !UWUGitHubSync.isReady()) {
      if (showAlert) alert('Configura tu token de GitHub en Configuración.');
      return Promise.reject(new Error('GitHub no configurado'));
    }
    setSyncStatus('Sincronizando con GitHub…', 'wait');
    return UWUGitHubSync.syncCatalog().then(function (res) {
      setSyncStatus('✓ Sincronizado — ' + new Date(res.at).toLocaleString(), 'ok');
      if (showAlert) alert('¡Publicado! Los visitantes verán los cambios al recargar.');
      if (window.UWUAdminDashboard) UWUAdminDashboard.refresh();
      return res;
    }).catch(function (err) {
      setSyncStatus('✗ ' + err.message, 'err');
      if (showAlert) alert('Error: ' + err.message);
      throw err;
    });
  }

  function afterCatalogChange(msg) {
    renderBrowser();
    if (window.UWUAdminDashboard) UWUAdminDashboard.refresh();
    if (typeof UWUGitHubSync !== 'undefined' && UWUGitHubSync.isReady()) {
      return syncNow(false).then(function () {
        if (msg) alert(msg + ' Sincronizado con GitHub.');
      }).catch(function () {
        if (msg) alert(msg + ' Guardado localmente; falló GitHub.');
      });
    }
    if (msg) alert(msg + ' Guardado. Configura GitHub para publicar a todos.');
    return Promise.resolve();
  }

  function filteredItems() {
    return UWU.listAdminTemplates().filter(function (item) {
      if (item.hidden) return false;
      var tier = item.tpl.tier || 'prem';
      if (activeTier !== 'all' && tier !== activeTier) return false;
      if (activeCat !== 'all' && item.tpl.cat !== activeCat) return false;
      return true;
    });
  }

  function tierBadge(tier) {
    if (tier === 'free') return '<span class="tpl-badge tier-free">Gratis</span>';
    if (tier === 'excl') return '<span class="tpl-badge tier-excl">💎 Exclusiva</span>';
    return '<span class="tpl-badge tier-prem">Premium</span>';
  }

  function renderBrowser() {
    var browser = el('tplBrowser');
    if (!browser) return;
    var items = filteredItems();
    var byCat = {};
    items.forEach(function (item) {
      var cat = item.tpl.cat || 'Otra';
      if (!byCat[cat]) byCat[cat] = [];
      byCat[cat].push(item);
    });
    var cats = Object.keys(byCat).sort();
    if (!cats.length) {
      browser.innerHTML = '<p class="tpl-empty">No hay plantillas con estos filtros.</p>';
      return;
    }
    browser.innerHTML = cats.map(function (cat) {
      var cards = byCat[cat].map(function (item) {
        var t = item.tpl;
        return '<button type="button" class="tpl-card' + (editingSlug === item.slug ? ' on' : '') + '" data-slug="' + item.slug + '">' +
          '<div class="tpl-card-art" style="background:' + (t.grad || '#333') + '">' + (t.emoji || '💌') + '</div>' +
          '<div class="tpl-card-body"><b>' + UWU.esc(t.name) + '</b>' +
          '<small>' + UWU.esc(t.id) + '</small>' +
          '<div class="tpl-badges">' + tierBadge(t.tier) +
          (item.hasHtml ? '<span class="tpl-badge html">HTML</span>' : '') + '</div>' +
          '<span class="tpl-card-price">' + UWU.fmtPrice(t) + '</span></div></button>';
      }).join('');
      return '<section class="tpl-cat-block"><h3>' + UWU.esc(cat) + ' <span>(' + byCat[cat].length + ')</span></h3><div class="tpl-card-grid">' + cards + '</div></section>';
    }).join('');
    browser.querySelectorAll('.tpl-card').forEach(function (card) {
      card.onclick = function () { openWorkspace(card.dataset.slug); };
    });
  }

  function renderTierTabs() {
    var tabs = el('tierTabs');
    if (!tabs) return;
    tabs.innerHTML = TIERS.map(function (t) {
      return '<button type="button" class="tier-tab' + (activeTier === t.id ? ' on' : '') + '" data-tier="' + t.id + '">' + t.label + '</button>';
    }).join('');
    tabs.querySelectorAll('.tier-tab').forEach(function (btn) {
      btn.onclick = function () {
        activeTier = btn.dataset.tier;
        renderTierTabs();
        renderBrowser();
      };
    });
  }

  function renderCatFilter() {
    var sel = el('catFilter');
    if (!sel) return;
    sel.innerHTML = '<option value="all">Todas las categorías</option>' +
      CAT_OPTIONS.map(function (c) {
        return '<option value="' + c + '"' + (activeCat === c ? ' selected' : '') + '>' + c + '</option>';
      }).join('');
    sel.onchange = function () {
      activeCat = sel.value;
      renderBrowser();
    };
  }

  function fillVersionSelect(slug) {
    var sel = el('fVersion');
    if (!sel) return;
    var versions = UWU.listTemplateVersions(slug);
    var store = UWU.loadCatalogStore();
    var active = store.activeVersion && store.activeVersion[slug];
    if (!versions.length) {
      sel.innerHTML = '<option value="">Versión actual</option>';
      return;
    }
    sel.innerHTML = versions.map(function (v) {
      return '<option value="' + v.id + '"' + (v.id === active ? ' selected' : '') + '>' + UWU.esc(v.name) + ' · ' + new Date(v.at).toLocaleDateString() + '</option>';
    }).join('');
    sel.onchange = function () {
      if (!sel.value) return;
      UWU.setActiveTemplateVersion(slug, sel.value);
      UWU.loadTemplateHtml(slug).then(function (html) {
        currentHtml = html;
        el('fHtmlEditor').value = html;
      });
    };
  }

  function openWorkspace(slug) {
    editingSlug = slug;
    var t = UWU.CATALOG[slug];
    if (!t) return;
    el('tplWorkspace').classList.add('open');
    el('tplBrowser').style.display = 'none';
    el('tplFilters').style.display = 'none';
    el('wsTitle').textContent = t.emoji + ' ' + t.name;
    el('fSlug').value = slug;
    el('fId').value = t.id || '';
    el('fName').value = t.name || '';
    el('fEmoji').value = t.emoji || '💌';
    el('fCat').innerHTML = CAT_OPTIONS.map(function (c) {
      return '<option value="' + c + '"' + (c === t.cat ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
    el('fTier').value = t.tier || 'prem';
    el('fPen').value = t.pen || '0';
    el('fUsd').value = t.usd || '0';
    el('fGrad').value = t.grad || '';
    el('fTitle').value = t.title || '';
    el('fPill').value = t.pill || '';
    el('fDesc').value = t.desc || '';
    el('fShowcase').checked = UWU.SHOWCASE.indexOf(slug) !== -1;
    fillVersionSelect(slug);
    UWU.loadTemplateHtml(slug).then(function (html) {
      currentHtml = html;
      el('fHtmlEditor').value = html;
    });
    renderBrowser();
  }

  function closeWorkspace() {
    editingSlug = null;
    el('tplWorkspace').classList.remove('open');
    el('tplBrowser').style.display = '';
    el('tplFilters').style.display = '';
    renderBrowser();
  }

  function readMeta() {
    return {
      id: el('fId').value.trim(),
      name: el('fName').value.trim(),
      emoji: el('fEmoji').value.trim(),
      cat: el('fCat').value,
      tier: el('fTier').value,
      pen: el('fPen').value.trim(),
      usd: el('fUsd').value.trim(),
      grad: el('fGrad').value.trim(),
      title: el('fTitle').value.trim(),
      pill: el('fPill').value.trim(),
      desc: el('fDesc').value.trim(),
      page: editingSlug ? editingSlug + '.html' : undefined
    };
  }

  function saveWorkspace(asNewVersion) {
    if (!editingSlug) return;
    var meta = readMeta();
    if (!meta.name) { alert('El nombre es obligatorio.'); return; }
    var html = el('fHtmlEditor').value;
    UWU.saveTemplate(editingSlug, meta, { showcase: el('fShowcase').checked });
    var versionId = el('fVersion').value;
    UWU.saveTemplateHtml(editingSlug, html, {
      newVersion: !!asNewVersion,
      versionId: asNewVersion ? null : versionId,
      versionName: asNewVersion ? ('Versión ' + (UWU.listTemplateVersions(editingSlug).length + 1)) : undefined
    });
    fillVersionSelect(editingSlug);
    afterCatalogChange('Plantilla guardada.');
  }

  function previewHtml() {
    var html = el('fHtmlEditor').value;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    window.open(URL.createObjectURL(blob), '_blank');
  }

  function onHtmlUpload(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      el('fHtmlEditor').value = reader.result;
      currentHtml = reader.result;
    };
    reader.readAsText(file, 'UTF-8');
  }

  function initGitHubPanel() {
    if (!el('ghToken') || typeof UWUGitHubSync === 'undefined') return;
    var cfg = UWUGitHubSync.getConfig();
    el('ghOwner').value = cfg.owner || '';
    el('ghRepo').value = cfg.repo || '';
    el('ghBranch').value = cfg.branch || 'main';
    if (cfg.token) {
      el('ghToken').value = cfg.token;
      setSyncStatus('✓ GitHub listo', 'ok');
    }
    el('btnSaveGh').onclick = function () {
      UWUGitHubSync.saveConfig({
        token: el('ghToken').value.trim(),
        owner: el('ghOwner').value.trim() || 'ANTHONY109823',
        repo: el('ghRepo').value.trim() || 'Uwu',
        branch: el('ghBranch').value.trim() || 'main',
        enabled: true
      });
      setSyncStatus(UWUGitHubSync.isReady() ? '✓ Token guardado' : 'Falta token', UWUGitHubSync.isReady() ? 'ok' : 'err');
    };
    el('btnSyncNow').onclick = function () { syncNow(true); };
  }

  function bind() {
    renderTierTabs();
    renderCatFilter();
    if (el('btnCloseWs')) el('btnCloseWs').onclick = closeWorkspace;
    if (el('btnSaveWs')) el('btnSaveWs').onclick = function () { saveWorkspace(false); };
    if (el('btnSaveWsNew')) el('btnSaveWsNew').onclick = function () { saveWorkspace(true); };
    if (el('btnPreviewWs')) el('btnPreviewWs').onclick = previewHtml;
    if (el('fHtmlUpload')) el('fHtmlUpload').onchange = function () { onHtmlUpload(this.files[0]); this.value = ''; };
    if (el('fTier')) el('fTier').onchange = function () {
      if (this.value === 'free') { el('fPen').value = '0'; el('fUsd').value = '0'; }
    };
    if (el('btnResetTpl')) el('btnResetTpl').onclick = function () {
      if (!confirm('¿Restaurar catálogo original?')) return;
      localStorage.removeItem('uwuCatalogAdmin');
      UWU.initCatalog();
      afterCatalogChange('Catálogo restaurado.');
    };
  }

  window.UWUAdminTemplates = {
    init: function () {
      var start = function () {
        bind();
        initGitHubPanel();
        renderBrowser();
      };
      if (UWU.bootstrap) UWU.bootstrap(start);
      else { UWU.initCatalog(); start(); }
    },
    renderBrowser: renderBrowser,
    syncNow: syncNow
  };
})();
