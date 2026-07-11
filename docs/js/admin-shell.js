/* Navegación lateral del panel admin */
(function () {
  'use strict';

  var currentView = 'dashboard';

  function el(id) { return document.getElementById(id); }

  function dashEl() { return el('dashView'); }

  function closeSidebar() {
    var dash = dashEl();
    if (dash) dash.classList.remove('sidebar-open');
    var overlay = el('sidebarOverlay');
    if (overlay) overlay.setAttribute('aria-hidden', 'true');
  }

  function openSidebar() {
    var dash = dashEl();
    if (dash) dash.classList.add('sidebar-open');
    var overlay = el('sidebarOverlay');
    if (overlay) overlay.setAttribute('aria-hidden', 'false');
  }

  function toggleSidebar() {
    var dash = dashEl();
    if (!dash) return;
    if (dash.classList.contains('sidebar-open')) closeSidebar();
    else openSidebar();
  }

  function bindMobileNav() {
    if (bindMobileNav._done) return;
    bindMobileNav._done = true;
    var btn = el('btnMenu');
    var overlay = el('sidebarOverlay');
    if (btn) btn.onclick = toggleSidebar;
    if (overlay) overlay.onclick = closeSidebar;
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeSidebar();
    });
  }

  function showView(id) {
    closeSidebar();
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
    bindMobileNav();
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
    getView: function () { return currentView; },
    closeSidebar: closeSidebar
  };
})();
