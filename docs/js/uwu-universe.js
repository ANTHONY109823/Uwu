/* =========================================================================
   UWU · Universo de plantillas
   Corazón 3D de partículas (canvas) + osito 3D (CSS) + órbita de plantillas.
   Reemplaza la grilla de la sección #plantillas. Sin dependencias externas.
   Lee el catálogo real desde window.UWU y se sincroniza con el carrusel de
   categorías (#marquee / .cat-pill).
   ========================================================================= */
(function (global) {
  'use strict';

  var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MAX_ORBIT = 8;

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else { fn(); }
  }

  /* ---- catálogo: slugs para una categoría (replica UWU.getSlugsForCategory) ---- */
  function slugsForCategory(catId) {
    var U = global.UWU;
    if (!U || !U.CATALOG_ORDER) return [];
    var order = U.CATALOG_ORDER.slice();
    if (!catId) return order;
    var cat = null, cats = U.CATEGORIES || [];
    for (var i = 0; i < cats.length; i++) { if (cats[i].id === catId) { cat = cats[i]; break; } }
    if (!cat) return order;
    return order.filter(function (slug) {
      var t = U.CATALOG[slug];
      return t && cat.match.indexOf(t.cat) !== -1;
    });
  }

  function init() {
    var U = global.UWU;
    var stage = document.getElementById('uniStage');
    var canvas = document.getElementById('uniCanvas');
    var orbitEl = document.getElementById('uniOrbit');
    var enterBtn = document.getElementById('uniEnter');
    var bearEl = stage ? stage.querySelector('.uni-bear') : null;
    var glowEl = stage ? stage.querySelector('.uni-glow') : null;
    if (!stage || !canvas || !orbitEl || !U) return;

    var ctx = canvas.getContext('2d');
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var W = 0, H = 0, cx = 0, cy = 0;
    var plantillasSec = document.getElementById('plantillas');

    /* ---------- estado ---------- */
    var activeCat = null;
    var cards = [];
    var orbAngle = 0;
    var zoom = 0, zoomT = 0;         // entrar al corazón (0..1)
    var mouseX = 0, mouseY = 0;      // parallax sutil
    var visible = true;              // ¿la sección está en pantalla?

    /* ---------- estrellas-corazón de fondo ---------- */
    var stars = [];
    function initStars() {
      stars = [];
      var n = W < 640 ? 120 : 210;
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y0: Math.random() * H,
          r: Math.random() * 1.6 + 0.4, p: Math.random() * 6.28,
          s: Math.random() * 1.6 + 0.4, heart: Math.random() < 0.2,
          vy: 7 + Math.random() * 24,               // caída (px/s)
          vx: (Math.random() - 0.5) * 10            // deriva lateral
        });
      }
    }

    /* ---------- corazón 3D de partículas ---------- */
    var pts = [], NP = 0;
    function buildHeart() {
      NP = W < 640 ? 2200 : 4200;
      pts = [];
      for (var i = 0; i < NP; i++) {
        var t = Math.random() * Math.PI * 2;
        var hx = 16 * Math.pow(Math.sin(t), 3);
        var hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        var s = Math.pow(Math.random(), 0.5);          // relleno hacia el centro
        var px = hx * s, py = hy * s;
        var puff = Math.sqrt(Math.max(0, 1 - s)) * 6.5; // volumen (eje z)
        var pz = (Math.random() * 2 - 1) * puff;
        var dist = Math.sqrt(px * px + py * py + pz * pz) || 1;
        var rr = dist / 20;                             // radio normalizado
        pts.push({
          x: px, y: py, z: pz, r: rr,
          nx: (px / 16 + 1) / 2,                        // 0..1 de un lado a otro (para la onda)
          sdx: px / dist, sdy: py / dist, sdz: pz / dist, // dirección de dispersión (hacia afuera)
          tw: Math.random() * 6.283,                    // fase de parpadeo
          ts: 2.2 + Math.random() * 3.2,                // velocidad de parpadeo
          ch: Math.random() * 6.283                     // desfase de color por punto
        });
      }
    }

    function drawStars(t) {
      var fall = reduced ? 0 : t;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var yy = (s.y0 + fall * s.vy) % (H + 8);       // cae y reaparece arriba
        var xx = s.x + Math.sin(fall * 0.2 + s.p) * s.vx;
        var tw = 0.35 + 0.65 * Math.abs(Math.sin(t * s.s + s.p));
        ctx.globalAlpha = tw * (1 - zoom * 0.75);
        if (s.heart) {
          ctx.fillStyle = '#F4A7CB';
          ctx.font = (s.r * 7) + 'px serif';
          ctx.fillText('♥', xx, yy);
        } else {
          ctx.fillStyle = i % 3 ? '#ffffff' : '#F4A7CB';
          ctx.beginPath(); ctx.arc(xx, yy, s.r, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // latido tipo corazón (dos golpes: lub-dub), 0..1
    function heartbeat(tt) {
      var x = tt % 1.25;
      var b1 = Math.exp(-Math.pow((x - 0.12) / 0.085, 2));
      var b2 = Math.exp(-Math.pow((x - 0.40) / 0.10, 2)) * 0.72;
      var v = b1 + b2;
      return v > 1 ? 1 : v;
    }

    function drawHeart(a, t) {
      var beat = heartbeat(t);                        // latido: crece y se achica
      var scaleBase = (Math.min(W, H) / 34) * (1 + beat * 0.16) * (1 + zoom * 3.4);
      var sweep = t * 0.9;                            // onda que viaja de un lado a otro
      // durante el "recorrido" dentro del corazón: leve deriva/vaivén
      var driftX = zoom * Math.sin(t * 0.6) * W * 0.06;
      var driftY = zoom * Math.cos(t * 0.45) * H * 0.05;
      var cxh = cx + mouseX * 14 + driftX;
      var cyh = cy + mouseY * 10 + driftY;
      var ca = Math.cos(a), sa = Math.sin(a), f = 520;
      ctx.globalCompositeOperation = 'lighter';
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        // disolución que viaja de un lado a otro (aparece/desaparece)
        var dissolve = 0.5 + 0.5 * Math.sin(p.nx * 6.283 - sweep); // 0..1
        var scatter = (1 - dissolve) * 5.5;            // los puntos se separan al disolverse
        var ox = p.x + p.sdx * scatter;
        var oy = p.y + p.sdy * scatter;
        var oz = p.z + p.sdz * scatter;
        var xr = ox * ca + oz * sa;
        var zr = -ox * sa + oz * ca;
        var per = f / (f - zr * scaleBase);
        if (per < 0.25) per = 0.25; else if (per > 2.8) per = 2.8; // estable (evita puntos disparados)
        var sx = cxh + xr * scaleBase * per;
        var sy = cyh - oy * scaleBase * per;
        var depth = (zr + 16) / 32;                   // 0 atrás .. 1 frente
        if (depth < 0) depth = 0; else if (depth > 1) depth = 1;
        var size = (0.7 + depth * 1.7) * (1 + zoom * 1.4);
        if (size < 0.1) size = 0.1;                   // radio SIEMPRE positivo (evita IndexSizeError)
        // color cambiando siempre (ola desde adentro + desfase por punto)
        var phase = t * 1.6 - p.r * 5.0 + p.ch;
        var hue = 330 + Math.sin(phase) * 36;         // rosa ↔ magenta ↔ púrpura, siempre girando
        var lig = 54 + Math.sin(phase) * 16 + depth * 8;
        // parpadeo continuo + desvanecido de la onda de disolución
        var twk = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * p.ts + p.tw));
        var al = (0.30 + depth * 0.6) * twk * (0.18 + 0.82 * dissolve);
        if (al < 0) al = 0; else if (al > 1) al = 1;
        ctx.globalAlpha = al;
        ctx.fillStyle = 'hsl(' + hue + ',90%,' + lig + '%)';
        ctx.beginPath(); ctx.arc(sx, sy, size, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
    }

    /* ---------- órbita de plantillas ---------- */
    function renderCards() {
      var limit = (global.innerWidth < 640) ? 6 : MAX_ORBIT;
      var slugs = slugsForCategory(activeCat).slice(0, limit);
      orbitEl.innerHTML = '';
      cards = [];
      if (!slugs.length) return;
      slugs.forEach(function (slug) {
        var tpl = U.CATALOG[slug];
        if (!tpl) return;
        var card = document.createElement('div');
        card.className = 'uni-card';
        card.setAttribute('data-slug', slug);
        card.innerHTML =
          '<button type="button" class="uc-demo" aria-label="Ver demo">👁</button>' +
          '<div class="uc-art" style="background:' + tpl.grad + '">' +
          '<span class="uc-em">' + tpl.emoji + '</span></div>' +
          '<div class="uc-nm">' + U.esc(tpl.name) + '</div>' +
          '<div class="uc-choose">Elegir ✨</div>';
        card.addEventListener('mouseenter', function () { card._hover = true; });
        card.addEventListener('mouseleave', function () { card._hover = false; });
        card.addEventListener('click', function (e) {
          e.stopPropagation();
          if (e.target.classList.contains('uc-demo')) {
            var page = tpl.page || (slug + '.html');
            global.open('d/' + page, '_blank', 'noopener');
            return;
          }
          U.openCheckout(slug);
        });
        orbitEl.appendChild(card);
        cards.push(card);
      });
    }

    function animateOrbit() {
      var n = cards.length;
      if (!n) return;
      var sw = stage.clientWidth || W, sh = stage.clientHeight || H;
      var rx = Math.min(sw * 0.30, 480), ry = Math.max(104, sh * 0.22);
      var anyHover = false;
      for (var i = 0; i < n; i++) {
        var c = cards[i];
        var ang = orbAngle + i * (Math.PI * 2 / n);
        var depth = (Math.sin(ang) + 1) / 2;             // 0 atrás .. 1 frente
        var x = Math.cos(ang) * rx, y = Math.sin(ang) * ry;
        var scale = (0.72 + depth * 0.62) * (1 - zoom);   // más grandes y con más contraste 3D
        var op = (0.5 + depth * 0.5) * (1 - zoom * 1.6);
        if (c._hover) { scale *= 1.28; op = (1 - zoom * 1.6); anyHover = true; }
        c.style.transform = 'translate(-50%,-50%) translate(' + x + 'px,' + y + 'px) scale(' + Math.max(scale, 0) + ')';
        c.style.opacity = Math.max(op, 0);
        c.style.zIndex = Math.round(depth * 100) + (c._hover ? 200 : 0);
        c.style.filter = depth < 0.35 ? 'blur(1.6px)' : 'none';
      }
      // la órbita NUNCA se detiene: solo va más lento al pasar el mouse
      if (zoomT < 0.3) orbAngle += anyHover ? 0.0018 : 0.0072;
    }

    // (La función "entrar al corazón" se retiró: zoom queda fijo en 0.)

    /* ---------- parallax con el mouse (toda la sección plantillas) ---------- */
    var parallaxEl = plantillasSec || stage;
    if (!reduced) {
      parallaxEl.addEventListener('mousemove', function (e) {
        var b = parallaxEl.getBoundingClientRect();
        mouseX = ((e.clientX - b.left) / b.width - 0.5) * 2;
        mouseY = ((e.clientY - b.top) / b.height - 0.5) * 2;
      });
      parallaxEl.addEventListener('mouseleave', function () { mouseX = 0; mouseY = 0; });
    }

    /* ---------- sincronía con el carrusel de categorías ---------- */
    function selectCategory(catId) {
      activeCat = catId || null;
      renderCards();
    }
    // el marquee usa botones .cat-pill con data-cat
    document.addEventListener('click', function (e) {
      var pill = e.target.closest && e.target.closest('.cat-pill');
      if (!pill) return;
      var catId = pill.getAttribute('data-cat');
      // toggle: si ya está activa, mostrar todas
      selectCategory(catId === activeCat ? null : catId);
    });

    /* ---------- tamaño / loop ---------- */
    function canvasSize() {
      if (document.body.classList.contains('uni-active')) {
        return { w: global.innerWidth, h: global.innerHeight };
      }
      return { w: stage.clientWidth, h: stage.clientHeight };
    }
    function resize() {
      var sz = canvasSize();
      W = sz.w; H = sz.h;
      cx = W / 2; cy = H * 0.50;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars(); buildHeart();
    }
    global.addEventListener('resize', resize);

    var start = performance.now();
    function loop(now) {
      requestAnimationFrame(loop);          // siempre vivo
      if (!visible) return;                 // ahorra batería sin matar el loop
      var t = (now - start) / 1000;
      zoom += (zoomT - zoom) * 0.06;
      ctx.clearRect(0, 0, W, H);
      drawStars(t);
      var spin = reduced ? 0.15 : (0.35 + zoom * 0.5);
      drawHeart(t * spin, t);
      animateOrbit();
    }

    // pausa el dibujo cuando la sección no está visible (sin detener el loop)
    // y oculta la barra superior (nav) mientras el universo está en pantalla
    var observeEl = plantillasSec || stage;
    if ('IntersectionObserver' in global) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          visible = en.isIntersecting;
          document.body.classList.toggle('uni-active', en.intersectionRatio >= 0.25);
          if (en.isIntersecting) resize();
        });
      }, { threshold: [0, 0.25, 0.5] }).observe(observeEl);
    }

    /* ---------- sincronía con el panel admin ---------- */
    global.addEventListener('uwu:catalog-updated', function () {
      if (U.initCatalog) U.initCatalog();
      renderCards();
    });
    global.addEventListener('storage', function (e) {
      if (e.key === 'uwuCatalogAdmin') {
        if (U.invalidateStoreCache) U.invalidateStoreCache();
        if (U.initCatalog) U.initCatalog();
        renderCards();
      }
    });

    resize();
    selectCategory(null);          // arranca mostrando todas
    requestAnimationFrame(loop);
  }

  /* espera a que el catálogo (window.UWU) esté listo */
  ready(function () {
    var tries = 0;
    (function wait() {
      if (global.UWU && global.UWU.CATALOG_ORDER && global.UWU.CATALOG_ORDER.length) {
        init();
      } else if (tries++ < 60) {
        setTimeout(wait, 100);
      } else {
        init(); // último intento (aunque el catálogo esté vacío)
      }
    })();
  });

})(typeof window !== 'undefined' ? window : this);
