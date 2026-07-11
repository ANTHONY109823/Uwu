/* Panel admin — control completo de la landing */
(function () {
  'use strict';

  function el(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function setStatus(msg, kind) {
    var node = el('siteSaveStatus');
    if (!node) return;
    node.textContent = msg;
    node.className = 'html-status' + (kind ? ' sync-' + kind : '');
  }

  function renderForm() {
    var root = el('siteForm');
    if (!root || !window.UWUSite) return;
    var site = UWUSite.getSite();
    root.innerHTML = UWUSite.GROUPS.map(function (group) {
      var fields = group.fields.map(function (field) {
        var val = site[field.key] != null ? site[field.key] : (UWUSite.DEFAULTS[field.key] || '');
        if (field.rows || field.html) {
          return '<label class="site-field">' +
            '<span>' + esc(field.label) + '</span>' +
            '<textarea data-key="' + field.key + '" rows="' + (field.rows || 2) + '">' + esc(val) + '</textarea></label>';
        }
        return '<label class="site-field">' +
          '<span>' + esc(field.label) + '</span>' +
          '<input type="text" data-key="' + field.key + '" value="' + esc(val) + '" /></label>';
      }).join('');
      return '<details class="site-group" open>' +
        '<summary>' + esc(group.title) + '</summary>' +
        '<div class="site-fields">' + fields + '</div></details>';
    }).join('');
  }

  function readForm() {
    var updates = {};
    document.querySelectorAll('#siteForm [data-key]').forEach(function (node) {
      if (node.tagName === 'LABEL') return;
      updates[node.dataset.key] = node.value;
    });
    return updates;
  }

  function saveForm() {
    var updates = readForm();
    UWUSite.saveSite(updates);
    publishSiteChanges('✓ Textos guardados');
  }

  function resetForm() {
    if (!confirm('¿Restaurar todos los textos de la landing al original?')) return;
    UWUSite.resetSite();
    renderForm();
    publishSiteChanges('✓ Textos restaurados al original');
  }

  function publishSiteChanges(okMsg) {
    if (window.UWUAdminTemplates && UWUAdminTemplates.syncNow) {
      setStatus('Publicando…', 'wait');
      return UWUAdminTemplates.syncNow(false).then(function () {
        setStatus(okMsg + ' · sincronizado con el sitio', 'ok');
      }).catch(function () {
        setStatus(okMsg + ' · solo en este navegador (configura sync)', 'wait');
      });
    }
    setStatus(okMsg + ' · recarga la web para verlos', 'ok');
    return Promise.resolve();
  }

  function bind() {
    if (bind._done) return;
    bind._done = true;
    if (el('btnSaveSite')) el('btnSaveSite').onclick = saveForm;
    if (el('btnResetSite')) el('btnResetSite').onclick = resetForm;
    if (el('btnPreviewSite')) {
      el('btnPreviewSite').onclick = function () {
        saveForm();
        window.open('index.html?_=' + Date.now(), '_blank');
      };
    }
  }

  window.UWUAdminLanding = {
    init: function () {
      renderForm();
      bind();
      setStatus('Edita los textos y guarda. Se publican con Railway/GitHub al sincronizar.', '');
    },
    renderForm: renderForm
  };
})();
