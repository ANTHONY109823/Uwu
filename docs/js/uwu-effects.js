/* =========================================================================
   UWU · Vida en toda la página
   Un canvas fijo de pantalla completa (detrás del contenido) con:
   - Estrellas y corazoncitos cayendo suavemente por todo el fondo.
   - Estrellas fugaces ocasionales.
   - Al hacer clic en cualquier parte: brota un corazón / rosita que sube y
     se queda flotando (se acumulan hasta un máximo).
   Sin dependencias. Respeta prefers-reduced-motion.
   ========================================================================= */
(function (global) {
  'use strict';

  var reduced = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  ready(function () {
    var cv = document.createElement('canvas');
    cv.id = 'uwuCosmos';
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none';
    // detrás del contenido pero delante del fondo del body (igual que #hearts)
    document.body.insertBefore(cv, document.body.firstChild);
    var ctx = cv.getContext('2d');
    var dpr = Math.min(global.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    var HEART_EMOJI = ['💗', '🌹', '💖', '🩷', '🌸', '💞'];
    var MAX_HEARTS = 60;

    var stars = [], shoot = [], hearts = [];

    function initStars() {
      stars = [];
      var n = Math.round(Math.max(40, Math.min(140, (W * H) / 13000)));
      if (reduced) n = Math.round(n * 0.5);
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.8 + 0.5,
          vy: 6 + Math.random() * 20,            // caída lenta (px/s)
          vx: (Math.random() - 0.5) * 6,          // leve deriva lateral
          tw: Math.random() * 6.283,
          ts: 0.6 + Math.random() * 1.8,
          heart: Math.random() < 0.16,
          hue: [330, 342, 350, 45][Math.floor(Math.random() * 4)] // rosas + dorado
        });
      }
    }

    function spawnShoot() {
      var fromLeft = Math.random() < 0.6;
      shoot.push({
        x: fromLeft ? Math.random() * W * 0.4 : W * (0.5 + Math.random() * 0.5),
        y: -20,
        vx: (fromLeft ? 1 : -1) * (260 + Math.random() * 200),
        vy: 320 + Math.random() * 220,
        life: 0, max: 0.7 + Math.random() * 0.5,
        len: 80 + Math.random() * 90
      });
    }

    function addHeart(x, y) {
      hearts.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 26,
        vy: -34 - Math.random() * 40,             // sube al nacer
        size: 15 + Math.random() * 18,
        rot: (Math.random() - 0.5) * 0.5,
        vr: (Math.random() - 0.5) * 0.8,
        bob: Math.random() * 6.283,
        life: 0, max: 12 + Math.random() * 6,      // vive bastante (se queda flotando)
        em: HEART_EMOJI[Math.floor(Math.random() * HEART_EMOJI.length)]
      });
      if (hearts.length > MAX_HEARTS) hearts.shift();  // los más viejos se retiran
    }

    // clic / toque en cualquier parte → corazón flotante
    function onTap(e) {
      var p = (e.touches && e.touches[0]) ? e.touches[0] : e;
      if (typeof p.clientX !== 'number') return;
      addHeart(p.clientX, p.clientY);
    }
    global.addEventListener('click', onTap, { passive: true });
    global.addEventListener('touchstart', onTap, { passive: true });

    function resize() {
      W = global.innerWidth; H = global.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initStars();
    }
    global.addEventListener('resize', resize);

    var last = performance.now(), shootTimer = 1.5;

    function frame(now) {
      requestAnimationFrame(frame);
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (document.hidden) return;
      ctx.clearRect(0, 0, W, H);

      var t = now / 1000;

      // --- estrellas cayendo ---
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduced) { s.y += s.vy * dt; s.x += s.vx * dt; }
        if (s.y - 4 > H) { s.y = -4; s.x = Math.random() * W; }
        if (s.x < -4) s.x = W + 4; else if (s.x > W + 4) s.x = -4;
        var a = (0.35 + 0.55 * Math.abs(Math.sin(t * s.ts + s.tw))) * (s.hue === 45 ? 0.7 : 0.85);
        ctx.globalAlpha = a;
        if (s.heart) {
          ctx.fillStyle = 'hsl(' + s.hue + ',85%,68%)';
          ctx.font = (s.r * 8) + 'px serif';
          ctx.fillText('♥', s.x, s.y);
        } else {
          ctx.fillStyle = 'hsl(' + s.hue + ',90%,' + (s.hue === 45 ? 62 : 72) + '%)';
          ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // --- estrellas fugaces ---
      if (!reduced) {
        shootTimer -= dt;
        if (shootTimer <= 0) { spawnShoot(); shootTimer = 2.4 + Math.random() * 4; }
      }
      for (var j = shoot.length - 1; j >= 0; j--) {
        var sh = shoot[j];
        sh.life += dt;
        sh.x += sh.vx * dt; sh.y += sh.vy * dt;
        if (sh.life > sh.max || sh.y > H + 40) { shoot.splice(j, 1); continue; }
        var k = 1 - sh.life / sh.max;
        var ang = Math.atan2(sh.vy, sh.vx);
        var tx = sh.x - Math.cos(ang) * sh.len, ty = sh.y - Math.sin(ang) * sh.len;
        var g = ctx.createLinearGradient(sh.x, sh.y, tx, ty);
        g.addColorStop(0, 'rgba(255,220,240,' + (0.9 * k) + ')');
        g.addColorStop(1, 'rgba(238,126,177,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.globalAlpha = k; ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(sh.x, sh.y, 1.8, 0, 6.283); ctx.fill();
        ctx.globalAlpha = 1;
      }

      // --- corazones/rositas flotando (clic) ---
      for (var h = hearts.length - 1; h >= 0; h--) {
        var ht = hearts[h];
        ht.life += dt;
        if (ht.life > ht.max) { hearts.splice(h, 1); continue; }
        // sube y luego se queda flotando (la velocidad vertical se amortigua)
        ht.vy += 26 * dt;                 // gravedad suave: frena la subida y flota
        if (ht.vy > 10) ht.vy = 10;       // no cae rápido: queda flotando
        ht.x += (ht.vx + Math.sin(t * 1.4 + ht.bob) * 10) * dt;
        ht.y += ht.vy * dt;
        ht.rot += ht.vr * dt;
        var fade = ht.life < 0.4 ? ht.life / 0.4 : (ht.life > ht.max - 2 ? (ht.max - ht.life) / 2 : 1);
        ctx.globalAlpha = Math.max(0, Math.min(1, fade));
        ctx.save();
        ctx.translate(ht.x, ht.y);
        ctx.rotate(ht.rot);
        ctx.font = ht.size + 'px serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(ht.em, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    resize();
    requestAnimationFrame(frame);
  });

})(typeof window !== 'undefined' ? window : this);
