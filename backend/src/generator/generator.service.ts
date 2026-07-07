import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { escapeHtml } from '../common/utils';

export interface DedicationData {
  para: string;
  de: string;
  mensaje: string;
  cancion?: string;
  accessCode: string;
  templateName: string;
  templateEmoji: string;
  templateCode: string;
  gradient: string;
  tier: string;
}

@Injectable()
export class GeneratorService {
  private templatesRoot = join(process.cwd(), '..', 'templates');

  async buildHtml(data: DedicationData): Promise<string> {
    const customPath = join(this.templatesRoot, data.templateName.toLowerCase().replace(/\s+/g, '-'), 'index.html');
    try {
      const html = await readFile(customPath, 'utf-8');
      return this.personalize(html, data);
    } catch {
      return this.buildDefaultCard(data);
    }
  }

  async buildFromSlug(slug: string, data: DedicationData): Promise<string> {
    const path = join(this.templatesRoot, slug, 'index.html');
    try {
      const html = await readFile(path, 'utf-8');
      return this.personalize(html, data);
    } catch {
      return this.buildDefaultCard(data);
    }
  }

  private personalize(html: string, data: DedicationData): string {
    const subtitle = `TE AMO MUCHO, ${data.para} — ${data.de} ✨`;
    return html
      .replace(/__UWU_MSG__/g, escapeHtml(data.mensaje))
      .replace(/__UWU_SUBTITLE__/g, escapeHtml(subtitle))
      .replace(/__UWU_CODE__/g, escapeHtml(data.accessCode))
      .replace(/__UWU_PARA__/g, escapeHtml(data.para))
      .replace(/__UWU_DE__/g, escapeHtml(data.de))
      .replace(/__UWU_SONG__/g, escapeHtml(data.cancion ?? ''));
  }

  buildDefaultCard(data: DedicationData): string {
    const brand =
      data.tier === 'free'
        ? `<div class="brand">Hecho con UWU 🧸 · uwu.app</div>`
        : `<div class="brand">Hecho con UWU 🧸 · ${escapeHtml(data.templateName)}</div>`;

    return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(data.templateEmoji + ' ' + data.templateName + ' — Para ' + data.para)}</title>
<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&family=Inter:wght@400;500;600&family=Sora:wght@600;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Inter,system-ui,sans-serif;min-height:100svh;background:${data.gradient};color:#fff;display:flex;align-items:center;justify-content:center;padding:20px}
.card{max-width:380px;width:100%;border-radius:32px;background:rgba(0,0,0,.25);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.2);padding:36px 24px;text-align:center;box-shadow:0 30px 80px rgba(0,0,0,.35)}
.tag{font-size:10px;letter-spacing:.18em;text-transform:uppercase;opacity:.75}
.name{font-family:'Dancing Script',cursive;font-size:42px;margin:8px 0;text-shadow:0 2px 16px rgba(0,0,0,.3)}
.msg{font-size:14px;line-height:1.75;font-style:italic;opacity:.92;margin:16px 0}
.pics{display:flex;gap:8px;justify-content:center;margin:16px 0}
.pics i{width:58px;height:72px;border-radius:12px;font-style:normal;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(255,255,255,.15)}
.player{margin-top:20px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:10px 14px;font-size:11px;display:flex;align-items:center;gap:10px}
.player b{display:block;font-family:Sora,sans-serif;font-size:12px}
.sig{font-family:'Dancing Script',cursive;font-size:26px;margin-top:18px}
.code{margin-top:20px;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,.1);font-family:monospace;font-size:11px;letter-spacing:.06em}
.brand{margin-top:16px;font-size:10px;opacity:.55}
</style>
</head>
<body>
<div class="card">
<div class="tag">Para la persona más especial</div>
<div class="name">${escapeHtml(data.para)}</div>
<div class="msg">${escapeHtml(data.mensaje)}</div>
<div class="pics"><i>📸</i><i>${data.templateEmoji}</i><i>💑</i></div>
<div class="player"><span>🎵</span><div><b>Nuestra canción</b>${escapeHtml(data.cancion ?? 'Ed Sheeran — Perfect')}</div></div>
<div class="sig">— ${escapeHtml(data.de)} 💝</div>
<div class="code">Código: ${escapeHtml(data.accessCode)} · Plantilla ${escapeHtml(data.templateCode)}</div>
${brand}
</div>
</body>
</html>`;
  }
}
