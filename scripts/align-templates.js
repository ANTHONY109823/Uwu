/* Alinea plantillas interactivas con el sistema UWU (placeholders + kit audio).
   No reescribe experiencias visuales: solo añade personalización y mejora el kit. */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'docs', 'd');

const PERSONALIZE_SNIPPET = `
<script>
/* UWU personalización — placeholders + ?para=&de=&msg=&code= */
(function(){
  var p=new URLSearchParams(location.search);
  var para=p.get('para')||'', de=p.get('de')||'';
  var msg=p.get('msg'), sub=p.get('subtitle'), code=p.get('code');
  function isPh(t){return !t||String(t).indexOf('__UWU_')===0;}
  function setText(el,val){ if(el&&val!=null&&val!=='') el.textContent=val; }
  var mEl=document.getElementById('uwuMsg');
  var sEl=document.getElementById('uwuSubtitle');
  var cEl=document.getElementById('uwuCode')||document.querySelector('.code');
  if(mEl){
    if(msg) setText(mEl,msg);
    else if(isPh(mEl.textContent)) setText(mEl,mEl.getAttribute('data-default')||mEl.textContent.replace(/__UWU_MSG__/g,'').trim()||'');
  }
  if(sEl){
    if(sub) setText(sEl,sub);
    else if(para||de) setText(sEl,('Para '+(para||'ti')+' — de '+(de||'alguien que te ama')));
    else if(isPh(sEl.textContent)) setText(sEl,sEl.getAttribute('data-default')||'');
  }
  if(cEl){
    if(code) setText(cEl,'Código: '+code);
    else if(isPh(cEl.textContent)) setText(cEl,'');
  }
  document.querySelectorAll('[data-uwu-msg]').forEach(function(el){
    if(msg) el.textContent=msg;
    else if(isPh(el.textContent)) el.textContent=el.getAttribute('data-default')||el.textContent;
  });
  document.querySelectorAll('[data-uwu-sub]').forEach(function(el){
    if(sub) el.textContent=sub;
    else if(para||de) el.textContent='Para '+(para||'ti')+' — de '+(de||'alguien que te ama');
  });
})();
<\/script>
`.trim();

const IMPROVED_KIT_SCRIPT = `
(function(){
  var playBtn=document.getElementById('uwuPlayBtn');
  var pickBtn=document.getElementById('uwuPickBtn');
  var pickFile=document.getElementById('uwuPickFile');
  var toast=document.getElementById('uwuToast');
  if(!playBtn) return;
  var tHide;
  function say(m){ if(!toast)return; toast.textContent=m; toast.classList.add('show'); clearTimeout(tHide); tHide=setTimeout(function(){toast.classList.remove('show');},2800); }
  function setPlaying(on){ playBtn.classList[on?'add':'remove']('playing'); }
  function bind(a){ if(a.__uwuBound)return; a.__uwuBound=true; a.addEventListener('play',function(){setPlaying(true);}); a.addEventListener('pause',function(){setPlaying(false);}); }
  function getAudio(){
    var a=document.getElementById('uwuBgm');
    if(!a){ a=document.createElement('audio'); a.id='uwuBgm'; a.loop=true; a.setAttribute('playsinline',''); a.style.display='none'; document.body.appendChild(a); }
    bind(a); return a;
  }
  function hasSrc(a){ return !!(a && (a.getAttribute('src')||a.src)); }
  playBtn.addEventListener('click',function(){
    var a=getAudio();
    if(!hasSrc(a)){ say('Toca ＋ para subir tu canción 🎵'); if(pickFile) pickFile.click(); return; }
    if(a.paused){ a.play().then(function(){setPlaying(true);}).catch(function(){ say('Toca la pantalla para activar el audio'); }); }
    else { a.pause(); setPlaying(false); }
  });
  if(pickBtn&&pickFile){
    pickBtn.addEventListener('click',function(){ pickFile.click(); });
    pickFile.addEventListener('change',function(){
      if(pickFile.files&&pickFile.files[0]){
        var a=getAudio();
        a.src=URL.createObjectURL(pickFile.files[0]);
        a.play().then(function(){setPlaying(true);say('🎶 '+pickFile.files[0].name);}).catch(function(){});
      }
    });
  }
  window.addEventListener('load',function(){
    var a=document.getElementById('uwuBgm');
    if(a){ bind(a); if(hasSrc(a)) say('🎵 Música lista — toca 🎵'); if(!a.paused) setPlaying(true); }
  });
})();
`.trim();

function improveKit(html) {
  // Reemplaza el IIFE del kit por la versión mejorada (detecta MP3 del admin)
  return html.replace(
    /<script>\s*\(function\(\)\{\s*var playBtn=document\.getElementById\('uwuPlayBtn'\);[\s\S]*?\}\)\(\);\s*<\/script>\s*<!-- ===== \/UWU KIT ===== -->/,
    '<script>\n' + IMPROVED_KIT_SCRIPT + '\n</script>\n<!-- ===== /UWU KIT ===== -->'
  );
}

function ensurePersonalizeSnippet(html) {
  if (html.indexOf('UWU personalización') !== -1) return html;
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, PERSONALIZE_SNIPPET + '\n</body>');
  }
  return html + '\n' + PERSONALIZE_SNIPPET;
}

function ensureAudioMarker(html) {
  if (html.indexOf('__UWU_AUDIO__') !== -1) return html;
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, '__UWU_AUDIO__\n</body>');
  return html + '\n__UWU_AUDIO__';
}

const patches = {
  'hello-kitty.html'(html) {
    html = html
      .replace(
        /<div class="romantic-text typing-text" id="typingText">[^<]*<\/div>/,
        '<div class="romantic-text typing-text" id="typingText" data-uwu-msg data-default="Eres el sueño que nunca quiero despertar 🌙">__UWU_MSG__</div>'
      )
      .replace(
        /<div class="romantic-subtitle" id="romanticSubtitle">[^<]*<\/div>/,
        '<div class="romantic-subtitle" id="romanticSubtitle" data-uwu-sub data-default="TE AMO MUCHO ✨">__UWU_SUBTITLE__</div>'
      )
      .replace(
        /<div id="codeBadge" class="code-badge hidden">[^<]*<\/div>/,
        '<div id="codeBadge" class="code-badge hidden" id="uwuCode">__UWU_CODE__</div>'
      );
    // Fix duplicate id if introduced
    html = html.replace('id="codeBadge" class="code-badge hidden" id="uwuCode"', 'id="codeBadge" class="code-badge hidden"');
    html = html.replace(
      /function applyPersonalization\(\) \{[\s\S]*?\n\}/,
      `function applyPersonalization() {
    var params = new URLSearchParams(location.search);
    var typingText = document.getElementById('typingText');
    var subtitleEl = document.getElementById('romanticSubtitle');
    var codeBadge = document.getElementById('codeBadge');
    function isPh(t){ return !t || t.indexOf('__UWU_') === 0; }
    var msg = params.get('msg') || (isPh(typingText.textContent) ? (typingText.getAttribute('data-default') || 'Eres el sueño que nunca quiero despertar 🌙') : typingText.textContent.trim());
    var subtitle = subtitleEl.textContent.trim();
    if (params.get('subtitle')) subtitle = params.get('subtitle');
    else if (params.get('de') || params.get('para')) {
      subtitle = 'TE AMO MUCHO, ' + (params.get('para')||'') + ' — ' + (params.get('de')||'') + ' ✨';
    } else if (isPh(subtitle)) {
      subtitle = subtitleEl.getAttribute('data-default') || 'TE AMO MUCHO ✨';
    }
    var code = params.get('code') || '';
    typingText.textContent = msg;
    subtitleEl.textContent = subtitle;
    if (code) { codeBadge.textContent = code; codeBadge.classList.remove('hidden'); }
    else if (isPh(codeBadge.textContent)) { codeBadge.textContent = ''; codeBadge.classList.add('hidden'); }
}`
    );
    return html;
  },

  'galaxia-amor.html'(html) {
    html = html.replace(
      /<div class="pill" id="pillText">[^<]*<\/div>/,
      '<div class="pill" id="pillText" data-uwu-msg data-default="Nuestra Galaxia 🌌">__UWU_MSG__</div>'
    );
    html = html.replace(
      /var phrases = \[[\s\S]*?\];/,
      `var phrases = [
      "__UWU_MSG__","Te Amo ✨","Eres Única 💛","Mi Bebe","Mi Cielito 🌌","Eres Hermosa ✨",
      "Mi Infinita ♾️","Mi Todo","Me Encantas 🥰","Love 💫","Te Amo 💛",
      "Mi Canción Favorita 🎶","Única 😊","Mi Reina 👑","Mi Amor","Mi Mundo",
      "Mi Luz 🌠","Mi Niña","Mi Tesoro 💛","Mi Paz","Mi Eterna",
      "Mi Sueño","Mi Pensamiento Favorito","Mi Bombom","Mi Diosa","Te Amo Infinitamente ♾️"
    ];
    (function(){
      var p=new URLSearchParams(location.search);
      var msg=p.get('msg');
      var pill=document.getElementById('pillText');
      if(msg){ phrases[0]=msg; if(pill) pill.textContent=msg; }
      else if(pill && (!pill.textContent || pill.textContent.indexOf('__UWU_')===0)){
        pill.textContent=pill.getAttribute('data-default')||'Nuestra Galaxia 🌌';
        phrases[0]=pill.textContent;
      }
      var para=p.get('para')||'', de=p.get('de')||'';
      if(para||de){ phrases.unshift('Para '+(para||'ti')); if(de) phrases.unshift('De '+de); }
    })();`
    );
    return html;
  },

  'flores-interactivas.html'(html) {
    return html.replace(
      /<div class="name">[^<]*<\/div>/,
      '<div class="name" id="uwuMsg" data-uwu-msg data-default="Click Donde Quieras Amor 🌸">__UWU_MSG__</div>'
    );
  },

  'lluvia-te-amo.html'(html) {
    return html.replace(
      /const clickWord = \(params\.get\('msg'\) \|\| 'TE AMO'\)\.toUpperCase\(\);/,
      `const clickWord = (params.get('msg') || (document.getElementById('uwuMsgDefault') && document.getElementById('uwuMsgDefault').textContent) || 'TE AMO').toUpperCase().replace(/__UWU_MSG__/i,'TE AMO');`
    ).replace(
      /<canvas id="canvas"><\/canvas>/,
      '<canvas id="canvas"></canvas>\n  <span id="uwuMsgDefault" hidden>__UWU_MSG__</span>\n  <div id="uwuSubtitle" hidden data-default="">__UWU_SUBTITLE__</div>\n  <div id="uwuCode" hidden>__UWU_CODE__</div>'
    );
  },

  'lluvia-frases.html'(html) {
    return html
      .replace(
        /<div class="mensaje-centro" id="msgCentro">[^<]*<\/div>/,
        '<div class="mensaje-centro" id="msgCentro" data-uwu-msg data-default="ME GUSTAS MUCHO MI AMOR ❤️">__UWU_MSG__</div>'
      )
      .replace(
        /<div class="mensaje-abajo">[^<]*<\/div>/,
        '<div class="mensaje-abajo" id="uwuSubtitle" data-default="😍 bebecita 😍">__UWU_SUBTITLE__</div>'
      )
      .replace(
        /if \(params\.get\('msg'\)\) \{ msgCentro\.textContent = params\.get\('msg'\); \}/,
        `if (params.get('msg')) { msgCentro.textContent = params.get('msg'); }
    else if (!msgCentro.textContent || msgCentro.textContent.indexOf('__UWU_')===0) {
      msgCentro.textContent = msgCentro.getAttribute('data-default') || 'ME GUSTAS MUCHO MI AMOR ❤️';
    }
    var subEl=document.getElementById('uwuSubtitle');
    if(subEl){
      if(params.get('subtitle')) subEl.textContent=params.get('subtitle');
      else if(params.get('para')||params.get('de')) subEl.textContent='Para '+(params.get('para')||'ti')+' — de '+(params.get('de')||'alguien que te ama');
      else if(!subEl.textContent||subEl.textContent.indexOf('__UWU_')===0) subEl.textContent=subEl.getAttribute('data-default')||'😍 bebecita 😍';
    }`
      );
  },

  'lluvia-letras.html'(html) {
    return html.replace(
      /const phrases = \[[\s\S]*?\];/,
      `const phrases = [
        (new URLSearchParams(location.search).get('msg') || '__UWU_MSG__').replace(/__UWU_MSG__/,'T E  A M O'),
        'T E  A M O', 'M I  A M O R', 'E R E S  M I  T O D O',
        'T E  Q U I E R O', 'M I  V I D A', 'M I  C I E L O',
        'E R E S  H E R M O S A', 'M I  R E I N A', 'M I  S O L',
        'T E  E X T R A Ñ O', 'M I  C O R A Z Ó N'
      ];`
    ).replace(
      /<div class="cloud"><\/div>/,
      '<div class="cloud"></div>\n  <div id="uwuSubtitle" hidden>__UWU_SUBTITLE__</div>\n  <div id="uwuCode" hidden>__UWU_CODE__</div>'
    );
  },

  'esfera-dragon.html'(html) {
    if (html.indexOf('id="uwuMsg"') !== -1) return html;
    return html.replace(
      /<body>/,
      `<body>
  <div id="uwuMsg" style="position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:50;max-width:90%;text-align:center;color:#fff;font:600 14px/1.4 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-shadow:0 2px 10px rgba(0,0,0,.7);pointer-events:none" data-default="Pide un deseo… 🐉">__UWU_MSG__</div>
  <div id="uwuSubtitle" style="position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:50;color:rgba(255,255,255,.75);font:12px/1.4 -apple-system,sans-serif;text-shadow:0 1px 6px #000" data-default="">__UWU_SUBTITLE__</div>
  <div id="uwuCode" style="position:fixed;bottom:58px;left:50%;transform:translateX(-50%);z-index:50;color:rgba(255,255,255,.45);font:10px monospace">__UWU_CODE__</div>`
    );
  },

  'laberinto-neon.html'(html) {
    if (html.indexOf('id="uwuMsg"') !== -1) return html;
    return html.replace(
      /<a class="back-btn"[^>]*>[^<]*<\/a>/,
      `$&\n  <div id="uwuMsg" style="position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:9998;color:#7eb6ff;font:600 13px/1.3 -apple-system,sans-serif;text-shadow:0 0 12px #4583dc;pointer-events:none" data-default="Encuéntrame en el laberinto 💙">__UWU_MSG__</div>\n  <div id="uwuSubtitle" hidden data-default="">__UWU_SUBTITLE__</div>\n  <div id="uwuCode" hidden>__UWU_CODE__</div>`
    );
  }
};

let changed = 0;
fs.readdirSync(DIR).filter(f => f.endsWith('.html') && f !== 'view.html').forEach(file => {
  const full = path.join(DIR, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;

  if (patches[file]) html = patches[file](html);
  html = improveKit(html);
  html = ensureAudioMarker(html);
  // Solo añadir snippet genérico a las interactivas que no tenían MSG
  const interactive = Object.keys(patches);
  if (interactive.includes(file) || html.indexOf('__UWU_MSG__') === -1) {
    if (html.indexOf('__UWU_MSG__') !== -1 || interactive.includes(file)) {
      html = ensurePersonalizeSnippet(html);
    }
  }

  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    changed++;
    console.log('updated', file);
  } else {
    console.log('ok     ', file);
  }
});

console.log('Listo:', changed, 'archivos modificados');
