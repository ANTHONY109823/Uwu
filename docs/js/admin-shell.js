/* Navegación lateral del panel admin */
(function () {
  'use strict';

  var currentView = 'dashboard';

  function el(id) { return document.getElementById(id); }

  function showView(id) {
    // Al cambiar de sección, cerrar el editor de plantilla abierto para
    // que "Plantillas" siempre muestre el listado y no quede atascado.
    if (window.UWUAdminTemplates && UWUAdminTemplates.closeWorkspace) {
      UWUAdminTemplates.closeWorkspace();
    }
    currentView = id;
    document.querySelectorAll('.sidebar-nav button').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.view === id);
    });
    document.querySelectorAll('.admin-view').forEach(function (view) {
      view.classList.toggle('active', view.id === 'view-' + id);
    });
    try { sessionStorage.setItem('uwuAdminView', id); } catch (e) {}
    if (id === 'dashboard' && window.UWUAdminDashboard) UWUAdminDashboard.refresh();
    if (id === 'plantillas' && window.UWUAdminTemplates) UWUAdminTemplates.renderBrowser();
    if (id === 'landing' && window.UWUAdminLanding) UWUAdminLanding.renderForm();
  }

  function bind() {
    if (bind._done) {
      var saved = sessionStorage.getItem('uwuAdminView');
      if (saved && el('view-' + saved)) showView(saved);
      return;
    }
    bind._done = true;
    document.querySelectorAll('.sidebar-nav button[data-view]').forEach(function (btn) {
      btn.onclick = function () { showView(btn.dataset.view); };
    });
    var saved = sessionStorage.getItem('uwuAdminView');
    if (saved && el('view-' + saved)) showView(saved);
  }

  window.UWUAdminShell = {
    init: bind,
    showView: showView,
    getView: function () { return currentView; }
  };
})();
