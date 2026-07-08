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
  var pendingAudio = undefined;

  function el(id) { return document.getElementById(id); }

  function setSyncStatus(msg, kind) {
    var node = el('rwSyncStatus') || el('ghSyncStatus');
    if (!node) return;
    node.textContent = msg;
    node.className = 'html-status' + (kind ? ' sync-' + kind : '');
  }

  function getSyncProvider() {
    if (typeof UWURailwaySync !== 'undefined' && UWURailwaySync.isReady()) return UWURailwaySync;
    if (typeof UWUGitHubSync !== 'undefined' && UWUGitHubSync.isReady()) return UWUGitHubSync;
    return null;
  }

  function syncNow(showAlert, onlySlug, extraOpts) {
    var provider = getSyncProvider();
    if (!provider) {
      if (showAlert) alert('Configura Railway en Configuración (recomendado) o GitHub como respaldo.');
      return Promise.reject(new Error('Sin proveedor de sincronización'));
    }
    var label = provider === UWURailwaySync ? 'Railway' : 'GitHub';
    setSyncStatus('Sincronizando con ' + label + '…', 'wait');
    var opts = Object.assign({ onlySlug: onlySlug || null }, extraOpts || {});
    return provider.syncCatalog(null, opts).then(function (res) {
      setSyncStatus('✓ Sincronizado — ' + new Date(res.at).toLocaleString(), 'ok');
      if (showAlert) alert('¡Publicado en ' + label + '! Los visitantes verán los cambios al recargar.');
      if (window.UWUAdminDashboard) UWUAdminDashboard.refresh();
      return res;
    }).catch(function (err) {
      setSyncStatus('✗ ' + err.message, 'err');
      if (showAlert) alert('Error al sincronizar:\n\n' + err.message);
      throw err;
    });
  }

  function afterCatalogChange(msg, slug, extraOpts) {
    renderBrowser();
    if (window.UWUAdminDashboard) UWUAdminDashboard.refresh();
    if (UWU.canUseServerStorage && UWU.canUseServerStorage()) {
      if (msg) alert(msg);
      return Promise.resolve();
    }
    var provider = getSyncProvider();
    if (provider) {
      var label = provider === UWURailwaySync ? 'Railway' : 'GitHub';
      return syncNow(false, slug, extraOpts).then(function () {
        if (msg) alert(msg + ' Sincronizado con ' + label + '.');
      }).catch(function (err) {
        var detail = err && err.message ? err.message : 'Error desconocido';
        if (msg) alert(msg + ' Guardado en este navegador.\n\n' + label + ' no pudo publicar:\n' + detail);
      });
    }
    if (msg) alert(msg + ' Guardado localmente.\n\nVe a Configuración → conecta Railway para publicar.');
    return Promise.resolve();
  }

  function filteredItems() {
    return UWU.listAdminTemplates().filter(function (item) {
      // En el admin se muestran TODAS las plantillas, incluidas las ocultas del sitio público
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
          (item.hasHtml ? '<span class="tpl-badge html">HTML</span>' : '') +
          (item.hasAudio ? '<span class="tpl-badge html">MP3</span>' : '') +
          (item.hidden ? '<span class="tpl-badge" style="background:#FEE2E2;color:#DC2626">Oculta</span>' : '') + '</div>' +
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

  function willHaveAudio(slug) {
    if (pendingAudio && pendingAudio !== null) return true;
    if (pendingAudio === null) return false;
    return UWU.hasTemplateAudio(slug);
  }

  function applyAudioPlaceholderToEditor() {
    if (!editingSlug) return false;
    if (!willHaveAudio(editingSlug)) return false;
    var editor = el('fHtmlEditor');
    if (!editor) return false;
    var next = UWU.ensureAudioPlaceholder(editor.value);
    if (next === editor.value) return false;
    editor.value = next;
    return true;
  }

  function insertAudioHook() {
    if (!editingSlug) return;
    if (!willHaveAudio(editingSlug) && !pendingAudio) {
      alert('Primero sube un MP3 para esta plantilla.');
      return;
    }
    if (applyAudioPlaceholderToEditor()) {
      alert('Se insertó __UWU_AUDIO__ antes de </body>. Guarda para publicar.');
    } else {
      alert('Tu HTML ya tiene música integrada (__UWU_AUDIO__, __UWU_AUDIO_SRC__ o #uwuBgm).');
    }
  }

  function updateAudioStatus() {
    var node = el('fAudioStatus');
    if (!node || !editingSlug) return;
    if (pendingAudio === null) {
      node.textContent = 'Se quitará el audio al guardar.';
      return;
    }
    if (pendingAudio && pendingAudio.name) {
      node.textContent = 'Listo para guardar: ' + pendingAudio.name + ' (' + Math.round(pendingAudio.size / 1024) + ' KB)';
      return;
    }
    var store = UWU.loadCatalogStore();
    if (store.audioMeta && store.audioMeta[editingSlug]) {
      node.textContent = 'Audio actual: ' + store.audioMeta[editingSlug].name;
      return;
    }
    if (UWU.hasTemplateAudio(editingSlug)) {
      node.textContent = 'Audio publicado: audio/' + editingSlug + '.mp3';
      return;
    }
    node.textContent = 'Sin música — sube un MP3 (máx. 8 MB)';
  }

  function openWorkspace(slug) {
    editingSlug = slug;
    pendingAudio = undefined;
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
    updateAudioStatus();
    renderBrowser();
  }

  function closeWorkspace() {
    editingSlug = null;
    pendingAudio = undefined;
    var ws = el('tplWorkspace');
    if (ws) ws.classList.remove('open');
    if (el('tplBrowser')) el('tplBrowser').style.display = '';
    if (el('tplFilters')) el('tplFilters').style.display = '';
    renderBrowser();
    var content = document.querySelector('.admin-content');
    if (content) content.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function newTemplate() {
    var name = prompt('Nombre de la nueva plantilla:', 'Mi plantilla');
    if (name === null) return;
    name = name.trim();
    if (!name) { alert('El nombre es obligatorio.'); return; }
    var base = UWU.slugifyName(name);
    var slug = base;
    var i = 2;
    while (UWU.CATALOG[slug]) { slug = base + '-' + i; i++; }
    var idCode = 'UWU-' + slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    var cat = activeCat !== 'all' ? activeCat : 'Enamorar';
    var tpl = {
      id: idCode,
      name: name,
      emoji: '💌',
      cat: cat,
      tier: 'prem',
      pen: '15',
      usd: '5',
      grad: 'linear-gradient(150deg,#EE7EB1,#E8447A)',
      title: name,
      pill: 'Abrir 💝',
      desc: '',
      page: slug + '.html'
    };
    try {
      UWU.saveTemplate(slug, tpl, {});
    } catch (err) {
      alert('No se pudo crear la plantilla: ' + (err && err.message ? err.message : err));
      return;
    }
    renderBrowser();
    openWorkspace(slug);
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

  function setSaveBusy(busy) {
    ['btnSaveWs', 'btnSaveWsNew'].forEach(function (id) {
      var b = el(id);
      if (!b) return;
      b.disabled = busy;
      if (busy) b.dataset.prevLabel = b.textContent;
      b.textContent = busy ? 'Guardando…' : (b.dataset.prevLabel || b.textContent);
    });
  }

  function saveWorkspace(asNewVersion) {
    if (!editingSlug) return;
    var meta = readMeta();
    if (!meta.name) { alert('El nombre es obligatorio.'); return; }
    var html = el('fHtmlEditor').value;
    var slug = editingSlug;
    if (willHaveAudio(slug)) {
      html = UWU.ensureAudioPlaceholder(html);
      el('fHtmlEditor').value = html;
    }
    var versionId = el('fVersion').value;
    var useServer = UWU.canUseServerStorage && UWU.canUseServerStorage();
    var audioFile = pendingAudio && pendingAudio !== null ? pendingAudio : null;
    var removeAudio = pendingAudio === null;
    var syncOpts = removeAudio ? { removeAudio: [slug] } : {};

    setSaveBusy(true);

    try {
      UWU.saveTemplate(slug, meta, { showcase: el('fShowcase').checked });
    } catch (err) {
      setSaveBusy(false);
      alert('No se pudo guardar metadatos: ' + (err.message || err));
      return;
    }

    function onDone(msg, extra) {
      pendingAudio = undefined;
      fillVersionSelect(slug);
      updateAudioStatus();
      setSaveBusy(false);
      afterCatalogChange(msg, slug, extra || syncOpts);
    }

    function onFail(err, partialMsg) {
      setSaveBusy(false);
      alert((partialMsg || 'Error al guardar') + ': ' + (err && err.message ? err.message : err));
    }

    if (useServer && typeof UWURailwaySync !== 'undefined') {
      UWU.saveTemplateHtml(slug, html, {
        newVersion: !!asNewVersion,
        versionId: asNewVersion ? null : versionId,
        versionName: asNewVersion ? ('Versión ' + (UWU.listTemplateVersions(slug).length + 1)) : undefined,
        serverPublished: true
      });
      if (audioFile) {
        UWU.markTemplateAudioPublished(slug, { name: audioFile.name, size: audioFile.size });
      } else if (removeAudio) {
        UWU.removeTemplateAudio(slug);
      }
      UWURailwaySync.syncWorkspace({
        slug: slug,
        html: html,
        audioFile: audioFile,
        removeAudio: removeAudio
      }).then(function () {
        onDone('Plantilla guardada.');
      }).catch(function (err) {
        onFail(err, 'No se pudo publicar en Railway');
      });
      return;
    }

    try {
      UWU.saveTemplateHtml(slug, html, {
        newVersion: !!asNewVersion,
        versionId: asNewVersion ? null : versionId,
        versionName: asNewVersion ? ('Versión ' + (UWU.listTemplateVersions(slug).length + 1)) : undefined
      });
    } catch (err) {
      onFail(err, 'No se pudo guardar el HTML localmente');
      return;
    }

    var audioChain = Promise.resolve();
    if (removeAudio && UWU.hasTemplateAudio(slug)) {
      UWU.removeTemplateAudio(slug);
    } else if (audioFile) {
      audioChain = UWU.saveTemplateAudio(slug, audioFile);
    }
    audioChain.then(function () {
      onDone('Plantilla guardada.');
    }).catch(function (err) {
      onDone('Plantilla guardada (sin audio).', syncOpts);
      alert('HTML guardado, pero falló el audio: ' + err.message);
    });
  }

  function downloadDemo() {
    if (!editingSlug) return;
    var cfg = (typeof UWURailwaySync !== 'undefined') ? UWURailwaySync.getConfig() : {};
    var base = (cfg.baseUrl || '').replace(/\/+$/, '') || location.origin;
    var url = base + '/api/download/template/' + encodeURIComponent(editingSlug);
    var a = document.createElement('a');
    a.href = url;
    a.download = editingSlug + '-demo.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function previewHtml() {
    var html = el('fHtmlEditor').value;
    if (!editingSlug) return;
    function openOut(audioSrc) {
      var out = UWU.finalizeTemplateHtml(
        html,
        editingSlug,
        { audioSrc: pendingAudio === null ? null : audioSrc }
      );
      var blob = new Blob([out], { type: 'text/html;charset=utf-8' });
      window.open(URL.createObjectURL(blob), '_blank');
    }
    if (pendingAudio) {
      var reader = new FileReader();
      reader.onload = function () { openOut(reader.result); };
      reader.readAsDataURL(pendingAudio);
      return;
    }
    if (pendingAudio === null) {
      openOut(null);
      return;
    }
    UWU.getAudioSrcForSlug(editingSlug, true).then(openOut);
  }

  function onAudioUpload(file) {
    if (!file) return;
    if (!/\.mp3$/i.test(file.name) && file.type && file.type.indexOf('audio') === -1) {
      alert('Solo archivos MP3.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('El MP3 no puede superar 8 MB.');
      return;
    }
    pendingAudio = file;
    updateAudioStatus();
    applyAudioPlaceholderToEditor();
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

  function initSyncPanel() {
    initRailwayPanel();
    initGitHubPanel();
  }

  function initRailwayPanel() {
    if (!el('rwBaseUrl') || typeof UWURailwaySync === 'undefined') return;
    var cfg = UWURailwaySync.getConfig();
    el('rwBaseUrl').value = cfg.baseUrl || '';
    if (cfg.token) {
      el('rwToken').value = cfg.token;
      setSyncStatus('✓ Railway listo', 'ok');
    }
    el('btnSaveRw').onclick = function () {
      UWURailwaySync.saveConfig({
        baseUrl: el('rwBaseUrl').value.trim(),
        token: el('rwToken').value.trim(),
        useCookie: true,
        enabled: true
      });
      if (!UWURailwaySync.isReady()) {
        setSyncStatus('Falta la URL de Railway', 'err');
        alert('Pega la URL pública de tu app Railway (o abre el admin desde ese dominio).');
        return;
      }
      setSyncStatus('Probando conexión…', 'wait');
      UWURailwaySync.testConnection().then(function (info) {
        setSyncStatus('✓ Conectado — ' + info.baseUrl, 'ok');
        alert('Railway conectado. Al guardar plantillas se publican ahí.');
        if (window.UWUAdminDashboard) UWUAdminDashboard.refresh();
      }).catch(function (err) {
        setSyncStatus('✗ ' + err.message, 'err');
        alert('La prueba falló:\n\n' + err.message);
      });
    };
    if (el('btnSyncNow')) el('btnSyncNow').onclick = function () { syncNow(true); };
  }

  function initGitHubPanel() {
    if (!el('ghToken') || typeof UWUGitHubSync === 'undefined') return;
    var cfg = UWUGitHubSync.getConfig();
    el('ghOwner').value = cfg.owner || '';
    el('ghRepo').value = cfg.repo || '';
    el('ghBranch').value = cfg.branch || 'main';
    if (cfg.token) {
      el('ghToken').value = cfg.token;
      var ghNode = el('ghSyncStatus');
      if (ghNode) {
        ghNode.textContent = '✓ Token guardado';
        ghNode.className = 'html-status sync-ok';
      }
    }
    if (el('btnSyncNowGh')) el('btnSyncNowGh').onclick = function () { syncNow(true); };
    el('btnSaveGh').onclick = function () {
      UWUGitHubSync.saveConfig({
        token: el('ghToken').value.trim(),
        owner: el('ghOwner').value.trim() || 'ANTHONY109823',
        repo: el('ghRepo').value.trim() || 'Uwu',
        branch: el('ghBranch').value.trim() || 'main',
        enabled: true
      });
      if (!UWUGitHubSync.isReady()) {
        var ghNode = el('ghSyncStatus');
        if (ghNode) {
          ghNode.textContent = 'Falta el token';
          ghNode.className = 'html-status sync-err';
        }
        alert('Pega tu token de GitHub.');
        return;
      }
      var ghWait = el('ghSyncStatus');
      if (ghWait) {
        ghWait.textContent = 'Probando conexión…';
        ghWait.className = 'html-status sync-wait';
      }
      UWUGitHubSync.testConnection().then(function (info) {
        var ghNode = el('ghSyncStatus');
        if (ghNode) {
          ghNode.textContent = '✓ Conectado a ' + info.full_name;
          ghNode.className = 'html-status sync-ok';
        }
        alert('Token válido. GitHub queda como respaldo.');
      }).catch(function (err) {
        var ghNode = el('ghSyncStatus');
        if (ghNode) {
          ghNode.textContent = '✗ ' + err.message;
          ghNode.className = 'html-status sync-err';
        }
        alert('La prueba falló:\n\n' + err.message);
      });
    };
  }

  function bind() {
    if (bind._done) return;
    bind._done = true;
    renderTierTabs();
    renderCatFilter();
    if (el('btnNewTpl')) el('btnNewTpl').onclick = newTemplate;
    if (el('btnCloseWs')) el('btnCloseWs').onclick = closeWorkspace;
    if (el('btnSaveWs')) el('btnSaveWs').onclick = function () { saveWorkspace(false); };
    if (el('btnSaveWsNew')) el('btnSaveWsNew').onclick = function () { saveWorkspace(true); };
    if (el('btnPreviewWs')) el('btnPreviewWs').onclick = previewHtml;
    if (el('btnDownloadDemo')) el('btnDownloadDemo').onclick = downloadDemo;
    if (el('fHtmlUpload')) el('fHtmlUpload').onchange = function () { onHtmlUpload(this.files[0]); this.value = ''; };
    if (el('fAudioUpload')) el('fAudioUpload').onchange = function () { onAudioUpload(this.files[0]); this.value = ''; };
    if (el('btnInsertAudio')) el('btnInsertAudio').onclick = insertAudioHook;
    if (el('btnRemoveAudio')) el('btnRemoveAudio').onclick = function () { pendingAudio = null; updateAudioStatus(); };
    if (el('fTier')) el('fTier').onchange = function () {
      if (this.value === 'free') { el('fPen').value = '0'; el('fUsd').value = '0'; }
    };
    if (el('btnResetTpl')) el('btnResetTpl').onclick = function () {
      if (!confirm('¿Restaurar catálogo original? Se perderán los cambios locales sin publicar.')) return;
      localStorage.removeItem('uwuCatalogAdmin');
      UWU.initCatalog();
      closeWorkspace();
      afterCatalogChange('Catálogo restaurado.');
    };
  }

  window.UWUAdminTemplates = {
    init: function () {
      // Enlazar botones de inmediato (los nodos ya existen en el DOM),
      // así "Volver", "Guardar" y "Nueva plantilla" funcionan aunque la
      // carga del catálogo remoto tarde o falle.
      bind();
      initSyncPanel();
      renderBrowser();
      var refresh = function () { renderBrowser(); };
      if (UWU.bootstrap) UWU.bootstrap(refresh);
      else { UWU.initCatalog(); refresh(); }
    },
    renderBrowser: renderBrowser,
    closeWorkspace: closeWorkspace,
    newTemplate: newTemplate,
    syncNow: syncNow
  };
})();
