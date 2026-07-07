/* Panel admin — gestión de plantillas UWU */
(function () {
  'use strict';

  var CAT_OPTIONS = [
    'Enamorar', 'Amar', 'Carta romántica', 'Sorprender', 'Pedida de mano', 'Cumpleaños',
    'San Valentín', 'Aniversario', 'Perdón', 'Extrañar', 'Cerrar ciclos', 'Familia',
    'Mascotas', 'Fechas especiales'
  ];

  var editingSlug = null;
  var pendingHtml = null;

  function el(id) { return document.getElementById(id); }

  function setSyncStatus(msg, kind) {
    var node = el('ghSyncStatus');
    if (!node) return;
    node.textContent = msg;
    node.className = 'html-status' + (kind ? ' sync-' + kind : '');
  }

  function syncNow(showAlert) {
    if (typeof UWUGitHubSync === 'undefined' || !UWUGitHubSync.isReady()) {
      if (showAlert) alert('Configura tu token de GitHub arriba para sincronizar.');
      return Promise.reject(new Error('GitHub no configurado'));
    }
    setSyncStatus('Sincronizando con GitHub…', 'wait');
    return UWUGitHubSync.syncCatalog().then(function (res) {
      var when = new Date(res.at).toLocaleString();
      setSyncStatus('✓ Sincronizado — ' + when, 'ok');
      if (showAlert) alert('¡Catálogo publicado! Los visitantes verán los cambios al recargar.');
      return res;
    }).catch(function (err) {
      setSyncStatus('✗ ' + err.message, 'err');
      if (showAlert) alert('Error al sincronizar: ' + err.message);
      throw err;
    });
  }

  function afterCatalogChange(doneMsg) {
    renderList();
    if (typeof UWUGitHubSync !== 'undefined' && UWUGitHubSync.isReady()) {
      return syncNow(false).then(function () {
        if (doneMsg) alert(doneMsg + ' Sincronizado con GitHub.');
      }).catch(function () {
        if (doneMsg) alert(doneMsg + ' Guardado localmente, pero falló la sincronización.');
      });
    }
    if (doneMsg) alert(doneMsg + ' Configura GitHub arriba para publicar a todos.');
    return Promise.resolve();
  }

  function initGitHubPanel() {
    if (!el('ghToken') || typeof UWUGitHubSync === 'undefined') return;
    var cfg = UWUGitHubSync.getConfig();
    el('ghOwner').value = cfg.owner || '';
    el('ghRepo').value = cfg.repo || '';
    el('ghBranch').value = cfg.branch || 'main';
    if (cfg.token) {
      el('ghToken').value = cfg.token;
      setSyncStatus('✓ GitHub listo — los cambios se sincronizan al guardar', 'ok');
    }
    el('btnSaveGh').onclick = function () {
      UWUGitHubSync.saveConfig({
        token: el('ghToken').value.trim(),
        owner: el('ghOwner').value.trim() || 'ANTHONY109823',
        repo: el('ghRepo').value.trim() || 'Uwu',
        branch: el('ghBranch').value.trim() || 'main',
        enabled: true
      });
      if (UWUGitHubSync.isReady()) {
        setSyncStatus('✓ Configuración guardada', 'ok');
        alert('Token guardado en este navegador. Ya puedes sincronizar plantillas.');
      } else {
        setSyncStatus('Falta el token de GitHub', 'err');
        alert('Pega tu token de GitHub para activar la sincronización.');
      }
    };
    el('btnSyncNow').onclick = function () { syncNow(true); };
  }

  function catSelectHtml(selected) {
    return CAT_OPTIONS.map(function (c) {
      return '<option value="' + c + '"' + (c === selected ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
  }

  function renderList() {
    var list = el('tplList');
    if (!list) return;
    var items = UWU.listAdminTemplates();
    el('stTpl').textContent = items.filter(function (i) { return !i.hidden; }).length;
    if (!items.length) {
      list.innerHTML = '<p class="tpl-empty">No hay plantillas.</p>';
      return;
    }
    list.innerHTML = items.map(function (item) {
      var t = item.tpl;
      var badges = '';
      if (item.custom) badges += '<span class="tpl-badge">Editada</span>';
      if (item.hasHtml) badges += '<span class="tpl-badge html">HTML</span>';
      if (item.hidden) badges += '<span class="tpl-badge off">Oculta</span>';
      return '<div class="tpl-row' + (item.hidden ? ' is-hidden' : '') + '" data-slug="' + item.slug + '">' +
        '<div class="tpl-preview" style="background:' + (t.grad || '#333') + '">' + (t.emoji || '💌') + '</div>' +
        '<div class="tpl-info"><b>' + UWU.esc(t.name) + '</b>' +
        '<small>' + UWU.esc(t.id) + ' · ' + UWU.esc(t.cat) + ' · ' + UWU.fmtPrice(t) + '</small>' +
        '<div class="tpl-badges">' + badges + '</div></div>' +
        '<div class="tpl-actions">' +
        '<button type="button" class="btn ghost sm" data-act="demo" title="Vista previa">👁</button>' +
        '<button type="button" class="btn ghost sm" data-act="edit" title="Editar">✏️</button>' +
        '<button type="button" class="btn ghost sm" data-act="hide" title="Ocultar/mostrar">' + (item.hidden ? '👁‍🗨' : '🙈') + '</button>' +
        '</div></div>';
    }).join('');
    list.querySelectorAll('.tpl-row').forEach(function (row) {
      var slug = row.dataset.slug;
      row.querySelector('[data-act=demo]').onclick = function () { UWU.openTemplatePreview(slug); };
      row.querySelector('[data-act=edit]').onclick = function () { openEditor(slug); };
      row.querySelector('[data-act=hide]').onclick = function () {
        var item = UWU.listAdminTemplates().find(function (i) { return i.slug === slug; });
        if (item && item.hidden) UWU.unhideTemplate(slug);
        else UWU.deleteTemplate(slug, true);
        afterCatalogChange('Visibilidad actualizada.');
      };
    });
  }

  function openEditor(slug) {
    editingSlug = slug || null;
    pendingHtml = null;
    var form = el('tplForm');
    var title = el('tplModalTitle');
    if (slug) {
      var t = UWU.CATALOG[slug];
      if (!t) return;
      title.textContent = 'Editar plantilla';
      el('fSlug').value = slug;
      el('fSlug').disabled = true;
      el('fId').value = t.id || '';
      el('fName').value = t.name || '';
      el('fEmoji').value = t.emoji || '💌';
      el('fCat').innerHTML = catSelectHtml(t.cat);
      el('fTier').value = t.tier || 'prem';
      el('fPen').value = t.pen || '0';
      el('fUsd').value = t.usd || '0';
      el('fGrad').value = t.grad || '';
      el('fTitle').value = t.title || '';
      el('fPill').value = t.pill || '';
      el('fDesc').value = t.desc || '';
      el('fPage').value = t.page || '';
      el('fShowcase').checked = UWU.SHOWCASE.indexOf(slug) !== -1;
      var html = UWU.getStoredHtml(slug);
      el('fHtmlStatus').textContent = html ? 'HTML personalizado cargado (' + Math.round(html.length / 1024) + ' KB)' : (t.page ? 'Usa archivo d/' + t.page : 'Sin HTML — se genera automática');
    } else {
      title.textContent = 'Nueva plantilla';
      form.reset();
      el('fSlug').disabled = false;
      el('fSlug').value = '';
      el('fCat').innerHTML = catSelectHtml('Enamorar');
      el('fTier').value = 'prem';
      el('fEmoji').value = '💌';
      el('fGrad').value = 'linear-gradient(150deg,#EE7EB1,#E8447A)';
      el('fShowcase').checked = true;
      el('fHtmlStatus').textContent = 'Sin HTML subido';
    }
    el('tplModal').classList.add('open');
  }

  function closeEditor() {
    el('tplModal').classList.remove('open');
    editingSlug = null;
    pendingHtml = null;
  }

  function readFormTpl() {
    return {
      id: el('fId').value.trim() || 'UWU-NEW',
      name: el('fName').value.trim() || 'Nueva plantilla',
      emoji: el('fEmoji').value.trim() || '💌',
      cat: el('fCat').value,
      tier: el('fTier').value,
      pen: el('fPen').value.trim() || '0',
      usd: el('fUsd').value.trim() || '0',
      grad: el('fGrad').value.trim() || 'linear-gradient(150deg,#EE7EB1,#E8447A)',
      title: el('fTitle').value.trim(),
      pill: el('fPill').value.trim(),
      desc: el('fDesc').value.trim(),
      page: el('fPage').value.trim() || undefined
    };
  }

  function saveForm() {
    var slug = editingSlug || el('fSlug').value.trim() || UWU.slugifyName(el('fName').value);
    if (!/^[a-z0-9-]+$/.test(slug)) {
      alert('El slug solo puede tener letras minúsculas, números y guiones.');
      return;
    }
    var tpl = readFormTpl();
    if (!tpl.name) { alert('El nombre es obligatorio.'); return; }
    var opts = { showcase: el('fShowcase').checked ? true : false };
    if (pendingHtml !== null) opts.html = pendingHtml;
    UWU.saveTemplate(slug, tpl, opts);
    closeEditor();
    afterCatalogChange('Plantilla guardada.');
  }

  function onHtmlFile(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      pendingHtml = reader.result;
      el('fHtmlStatus').textContent = 'HTML listo para guardar: ' + file.name + ' (' + Math.round(file.size / 1024) + ' KB)';
    };
    reader.readAsText(file, 'UTF-8');
  }

  function exportAll() {
    var bundle = UWU.exportCatalogBundle();
    var blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'uwu-catalog-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    var store = bundle.store;
    if (store.html) {
      Object.keys(store.html).forEach(function (slug) {
        var hb = new Blob([store.html[slug]], { type: 'text/html' });
        var l = document.createElement('a');
        l.href = URL.createObjectURL(hb);
        l.download = slug + '.html';
        l.click();
      });
    }
    alert('Exportado JSON + archivos HTML (respaldo manual).');
  }

  function importJson(file) {
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        UWU.importCatalogBundle(JSON.parse(reader.result));
        afterCatalogChange('Catálogo importado.');
      } catch (e) {
        alert('No se pudo importar: ' + e.message);
      }
    };
    reader.readAsText(file);
  }

  function resetCatalog() {
    if (!confirm('¿Restaurar catálogo de plantillas al original?\nSe pierden plantillas nuevas y ediciones.')) return;
    localStorage.removeItem('uwuCatalogAdmin');
    UWU.initCatalog();
    afterCatalogChange('Catálogo restaurado.');
  }

  function bind() {
    el('btnNewTpl').onclick = function () { openEditor(null); };
    el('btnExportTpl').onclick = exportAll;
    el('btnResetTpl').onclick = resetCatalog;
    el('tplModalClose').onclick = closeEditor;
    el('tplModalCancel').onclick = closeEditor;
    el('tplForm').onsubmit = function (e) { e.preventDefault(); saveForm(); };
    el('fName').addEventListener('input', function () {
      if (!editingSlug && el('fSlug') && !el('fSlug').disabled) {
        el('fSlug').value = UWU.slugifyName(el('fName').value);
      }
    });
    el('fHtmlFile').onchange = function () { onHtmlFile(this.files[0]); };
    el('fTier').onchange = function () {
      if (this.value === 'free') { el('fPen').value = '0'; el('fUsd').value = '0'; }
    };
    el('importJsonFile').onchange = function () { importJson(this.files[0]); this.value = ''; };
    el('tplModal').addEventListener('click', function (e) {
      if (e.target === el('tplModal')) closeEditor();
    });
  }

  window.UWUAdminTemplates = {
    init: function () {
      var start = function () {
        bind();
        initGitHubPanel();
        renderList();
      };
      if (UWU.bootstrap) UWU.bootstrap(start);
      else { UWU.initCatalog(); start(); }
    },
    renderList: renderList,
    syncNow: syncNow
  };
})();
