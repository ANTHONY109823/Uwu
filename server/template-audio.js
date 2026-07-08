'use strict';

const fs = require('fs');
const path = require('path');

function escAttr(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function audioPlayerSnippet(src) {
  if (!src) return '';
  // Solo inyecta el <audio>. El kit UWU (#uwuPlayBtn) ya controla play/pause.
  // Si no hay kit, un script mínimo arranca al primer toque.
  return (
    '<audio id="uwuBgm" loop preload="auto" playsinline src="' + escAttr(src) + '" style="display:none"></audio>' +
    '<script>(function(){var a=document.getElementById("uwuBgm");if(!a||!a.src)return;if(document.getElementById("uwuPlayBtn"))return;var p=function(){if(a.paused)a.play().catch(function(){});};document.addEventListener("click",p,{once:true});document.addEventListener("touchstart",p,{once:true});})();<\/script>'
  );
}

function hasAudioHook(html) {
  if (!html) return false;
  return html.indexOf('__UWU_AUDIO__') !== -1 ||
    html.indexOf('__UWU_AUDIO_SRC__') !== -1 ||
    html.indexOf('id="uwuBgm"') !== -1;
}

function ensureAudioPlaceholder(html) {
  if (!html || hasAudioHook(html)) return html;
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, '__UWU_AUDIO__\n</body>');
  }
  return html + '\n__UWU_AUDIO__';
}

function finalizeTemplateHtml(html, slug, src) {
  if (!html) return html;
  if (!src) {
    // Sin audio: quitar los marcadores para que no aparezcan como texto en la página
    return html.replace(/__UWU_AUDIO_SRC__/g, '').replace(/__UWU_AUDIO__/g, '');
  }
  if (html.indexOf('__UWU_AUDIO_SRC__') !== -1) {
    html = html.replace(/__UWU_AUDIO_SRC__/g, escAttr(src));
  }
  if (html.indexOf('__UWU_AUDIO__') !== -1) {
    html = html.replace(/__UWU_AUDIO__/g, audioPlayerSnippet(src));
  } else if (html.indexOf('id="uwuBgm"') === -1) {
    html = html.replace(/<\/body>/i, audioPlayerSnippet(src) + '\n</body>');
  }
  return html;
}

function audioPublicPath(slug) {
  return 'audio/' + slug + '.mp3';
}

function resolveTemplateHtml(rel, resolveRead) {
  const m = String(rel || '').match(/^d\/([a-z0-9-]+)\.html$/i);
  if (!m) return null;
  const slug = m[1];
  const htmlPath = resolveRead(rel);
  if (!fs.existsSync(htmlPath) || !fs.statSync(htmlPath).isFile()) return null;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const audioPath = resolveRead(path.join('d', 'audio', slug + '.mp3'));
  const src = fs.existsSync(audioPath) ? audioPublicPath(slug) : null;
  // Si no hay audio y tampoco marcadores, servir el archivo tal cual (sin reprocesar)
  if (!src && !hasAudioHook(html)) return null;
  return finalizeTemplateHtml(html, slug, src);
}

module.exports = {
  escAttr,
  audioPlayerSnippet,
  hasAudioHook,
  ensureAudioPlaceholder,
  finalizeTemplateHtml,
  audioPublicPath,
  resolveTemplateHtml,
};
