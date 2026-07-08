/* Dashboard — métricas del sitio UWU */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }

  function countByTier(items) {
    var c = { free: 0, prem: 0, excl: 0 };
    items.forEach(function (item) {
      if (item.hidden) return;
      var tier = (item.tpl && item.tpl.tier) || 'prem';
      if (c[tier] != null) c[tier]++;
    });
    return c;
  }

  function countByCategory(items) {
    var map = {};
    items.forEach(function (item) {
      if (item.hidden) return;
      var cat = item.tpl.cat || 'Otra';
      map[cat] = (map[cat] || 0) + 1;
    });
    return map;
  }

  function refresh() {
    if (!window.UWU) return;
    var items = UWU.listAdminTemplates();
    var active = items.filter(function (i) { return !i.hidden; });
    var hidden = items.length - active.length;
    var tiers = countByTier(items);
    var orders = JSON.parse(localStorage.getItem('uwuOrders') || '[]');
    var ops = JSON.parse(localStorage.getItem('uwuOps') || '{}');
    var site = window.UWUSite ? UWUSite.getSite() : {};
    var siteChanges = 0;
    if (window.UWUSite) {
      Object.keys(UWUSite.DEFAULTS).forEach(function (k) {
        if (site[k] !== UWUSite.DEFAULTS[k]) siteChanges++;
      });
    }
    var secHidden = Object.values(ops.sections || {}).filter(function (v) { return v === false; }).length;
    var ghReady = window.UWUGitHubSync && UWUGitHubSync.isReady();
    var rwReady = window.UWURailwaySync && UWURailwaySync.isReady();

    var set = function (id, val) { var n = el(id); if (n) n.textContent = val; };
    set('mTotalTpl', active.length);
    set('mHiddenTpl', hidden);
    set('mOrders', orders.length);
    set('mFree', tiers.free);
    set('mPrem', tiers.prem);
    set('mExcl', tiers.excl);
    set('mSiteEdits', siteChanges);
    set('mSecHidden', secHidden);
    set('mRwStatus', rwReady ? 'Conectado' : 'Sin URL/token');
    set('mGhStatus', ghReady ? 'Conectado' : 'Sin token');

    var catList = el('dashCatList');
    if (catList) {
      var cats = countByCategory(items);
      var keys = Object.keys(cats).sort();
      catList.innerHTML = keys.length ? keys.map(function (cat) {
        return '<div class="dash-row"><span>' + UWU.esc(cat) + '</span><b>' + cats[cat] + '</b></div>';
      }).join('') : '<p class="tpl-empty">Sin categorías</p>';
    }

    var recent = el('dashRecent');
    if (recent) {
      recent.innerHTML = orders.slice(0, 5).map(function (o) {
        return '<div class="dash-row"><span>' + UWU.esc(o.templateName || o.slug || 'Dedicatoria') + '</span><small>' + UWU.esc(o.para || '') + '</small></div>';
      }).join('') || '<p class="tpl-empty">Aún no hay dedicatorias locales</p>';
    }
  }

  window.UWUAdminDashboard = { init: refresh, refresh: refresh };
})();
