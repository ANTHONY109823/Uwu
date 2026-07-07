'use strict';

const fs = require('fs');
const path = require('path');

function escAttr(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function audioPlayerSnippet(src) {
  if (!src) return '';
  return (
    '<audio id="uwuBgm" loop preload="auto" playsinline src="' + escAttr(src) + '" style="display:none"></audio>' +
    '<script>(function(){var a=document.getElementById("uwuBgm");if(!a||!a.src)return;var p=function(){a.play().catch(function(){});};document.addEventListener("click",p,{once:true});document.addEventListener("touchstart",p,{once:true});var b=document.getElementById("uwuPlayBtn");if(b)b.addEventListener("click",function(e){e.preventDefault();a.play().catch(function(){});});})();<\/script>'
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
  if (!src) return html;
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
  const audioPath = resolveRead(path.join('d', 'audio', slug + '.mp3'));
  if (!fs.existsSync(audioPath)) return null;
  const html = fs.readFileSync(htmlPath, 'utf8');
  return finalizeTemplateHtml(html, slug, audioPublicPath(slug));
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
