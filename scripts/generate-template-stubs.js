/* Genera stubs HTML en docs/d/ para cada plantilla del catálogo */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'docs', 'd');

const SLUGS = [
  'hello-kitty', 'carta-eterna', 'feliz-cumple', 'quieres-casarte', 'nuestro-tiempo', 'mi-valentin',
  'perdoname', 'netflix-del-amor', 'nuestro-playlist', 'constelacion', 'cuenta-regresiva',
  'vhs-recuerdos', 'mapa-primer-beso', 'latidos', 'gracias-por-todo', 'para-mama',
  'firulais-forever', 'navidad-juntos', 'amor-distancia', 'nuestra-historia', 'buenas-noches',
  'ano-nuevo', 'ramo-infinito', 'perdoname-bonito', 'globos-deseos'
];

const META = {
  'hello-kitty': { emoji: '🎀', name: 'Hello Kitty Mágica', id: 'UWU-HKIT', title: 'Hello Kitty para ti', pill: 'Tocar para abrir 🎀', grad: 'linear-gradient(135deg,#e542a1,#3890dd,#c654ce)' },
  'carta-eterna': { emoji: '💌', name: 'Carta Eterna', id: 'UWU-CTRN', title: 'Mi carta para ti', pill: 'Tocar para abrir 💝', grad: 'linear-gradient(165deg,#4a1030,#8e2461)' },
  'feliz-cumple': { emoji: '🎂', name: 'Fiesta Infinita', id: 'UWU-FIIN', title: '¡Feliz cumpleaños!', pill: 'Soplar velitas 🎉', grad: 'linear-gradient(160deg,#F6A13C,#F0567B)' },
  'quieres-casarte': { emoji: '💍', name: 'La Gran Pregunta', id: 'UWU-LGPREG', title: '¿Te casarías conmigo?', pill: 'Ver nuestra historia ✨', grad: 'linear-gradient(165deg,#1C1420,#5b2a5e)' },
  'nuestro-tiempo': { emoji: '💕', name: 'Nuestro Tiempo', id: 'UWU-NUTI', title: '847 días juntos', pill: 'Ver cada momento ⏳', grad: 'linear-gradient(160deg,#8e2461,#E8447A)' },
  'mi-valentin': { emoji: '🌹', name: 'Jardín de Rosas', id: 'UWU-JDROS', title: 'Mi San Valentín', pill: 'Abrir el jardín 🌹', grad: 'linear-gradient(160deg,#C21E4C,#F45C7F)' },
  'perdoname': { emoji: '🌸', name: 'Lluvia de Flores', id: 'UWU-LLFL', title: 'Perdóname', pill: 'Leer mi disculpa 🌸', grad: 'linear-gradient(165deg,#7899d4,#c6a9e8)' },
  'netflix-del-amor': { emoji: '🎬', name: 'Netflix del Amor', id: 'UWU-NFLX', title: 'Nuestra serie', pill: 'Reproducir ❤️', grad: 'linear-gradient(150deg,#141414,#E50914)' },
  'nuestro-playlist': { emoji: '🎧', name: 'Nuestro Playlist', id: 'UWU-PLAY', title: 'Nuestra playlist', pill: 'Escuchar juntos 🎵', grad: 'linear-gradient(150deg,#121212,#1DB954)' },
  'constelacion': { emoji: '⭐', name: 'Constelación', id: 'UWU-CONST', title: 'Nuestra constelación', pill: 'Ver las estrellas ✨', grad: 'linear-gradient(150deg,#0f1030,#4b3f8e)' },
  'cuenta-regresiva': { emoji: '⏳', name: 'Cuenta Regresiva', id: 'UWU-CUENT', title: 'Faltan solo…', pill: 'Iniciar cuenta ⏳', grad: 'linear-gradient(150deg,#B06AB3,#7873f5)' },
  'vhs-recuerdos': { emoji: '📼', name: 'VHS de Recuerdos', id: 'UWU-VHS', title: 'Recuerdos en VHS', pill: 'Rebobinar 📼', grad: 'linear-gradient(150deg,#3a2d20,#8a6a3c)' },
  'mapa-primer-beso': { emoji: '📍', name: 'El Mapa del Primer Beso', id: 'UWU-MAPB', title: 'Aquí empezó todo', pill: 'Ver el mapa 📍', grad: 'linear-gradient(150deg,#134E5E,#71B280)' },
  'latidos': { emoji: '💗', name: 'Latidos', id: 'UWU-LAT', title: 'Mi corazón late por ti', pill: 'Sentir el latido 💗', grad: 'linear-gradient(150deg,#FF6584,#E8447A)' },
  'gracias-por-todo': { emoji: '💔', name: 'Volar de Nuevo', id: 'UWU-VOLAR', title: 'Gracias por todo', pill: 'Soltar con amor 🕊️', grad: 'linear-gradient(160deg,#5f72bd,#9b23ea)' },
  'para-mama': { emoji: '👨‍👩‍👧', name: 'Raíces', id: 'UWU-RAIZ', title: 'Para mamá', pill: 'Abrir el álbum 📖', grad: 'linear-gradient(160deg,#E88A4A,#F2BC5C)' },
  'firulais-forever': { emoji: '🐶', name: 'Mejor Amigo', id: 'UWU-MEAM', title: 'Firulais 4ever', pill: 'Ver sus travesuras 🐾', grad: 'linear-gradient(160deg,#C98A4B,#E8B34B)' },
  'navidad-juntos': { emoji: '🎄', name: 'Navidad Juntos', id: 'UWU-NAV', title: 'Feliz Navidad juntos', pill: 'Abrir regalo 🎁', grad: 'linear-gradient(150deg,#c23a3a,#1e5e3a)' },
  'amor-distancia': { emoji: '✈️', name: 'Amor a Distancia', id: 'UWU-DIST', title: 'A kilómetros, juntos', pill: 'Cruzar kilómetros ✈️', grad: 'linear-gradient(150deg,#56A8E8,#8ED0F8)' },
  'nuestra-historia': { emoji: '📖', name: 'Nuestra Historia', id: 'UWU-HIST', title: 'Capítulo a capítulo', pill: 'Leer capítulo 📖', grad: 'linear-gradient(150deg,#6d4226,#b8845a)' },
  'buenas-noches': { emoji: '🌙', name: 'Buenas Noches', id: 'UWU-NOCHE', title: 'Buenas noches, amor', pill: 'Soñar juntos 🌙', grad: 'linear-gradient(150deg,#1C1420,#3d2a6e)' },
  'ano-nuevo': { emoji: '🥂', name: 'Año Nuevo, Amor Nuevo', id: 'UWU-ANUE', title: 'Un brindis por nosotros', pill: 'Brindar 🥂', grad: 'linear-gradient(150deg,#2d2410,#c9a227)' },
  'ramo-infinito': { emoji: '💐', name: 'Ramo Infinito', id: 'UWU-RAMO', title: 'Un ramo para ti', pill: 'Recibir flores 💐', grad: 'linear-gradient(150deg,#E8447A,#F4A7CB)' },
  'perdoname-bonito': { emoji: '🤍', name: 'Perdóname Bonito', id: 'UWU-PBON', title: 'Lo siento de verdad', pill: 'Leer con calma 🤍', grad: 'linear-gradient(150deg,#8a9bb8,#c4d0e0)' },
  'globos-deseos': { emoji: '🎈', name: 'Globos y Deseos', id: 'UWU-GLOB', title: 'Pide un deseo', pill: 'Soltar globos 🎈', grad: 'linear-gradient(150deg,#F0567B,#FDD35C)' }
};

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildStub(slug) {
  const t = META[slug];
  if (!t) return '';
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>${esc(t.emoji + ' ' + t.name)} — UWU</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui,sans-serif;min-height:100svh;background:${t.grad};color:#fff;display:flex;align-items:center;justify-content:center;padding:24px}
.wrap{max-width:400px;width:100%;text-align:center;background:rgba(0,0,0,.22);border-radius:28px;padding:32px 22px;border:1px solid rgba(255,255,255,.2)}
.big{font-size:64px;margin-bottom:12px}
h1{font-size:1.35rem;margin-bottom:8px}
.pill{display:inline-block;margin-top:16px;padding:12px 22px;border-radius:999px;background:rgba(255,255,255,.2);border:none;color:#fff;font-weight:700;cursor:pointer}
.msg{margin:18px 0;font-size:15px;line-height:1.7;font-style:italic;min-height:3em}
.sub{font-size:12px;opacity:.85;margin-top:12px}
.code{margin-top:16px;font-size:10px;opacity:.65;font-family:monospace}
</style>
</head>
<body>
<div class="wrap">
<div class="big">${t.emoji}</div>
<h1>${esc(t.title)}</h1>
<p class="sub" id="uwuSubtitle">__UWU_SUBTITLE__</p>
<p class="msg" id="uwuMsg">__UWU_MSG__</p>
<button class="pill" type="button">${esc(t.pill)}</button>
<div class="code">__UWU_CODE__</div>
<p class="sub">Plantilla ${esc(t.id)} · Edita este HTML en el panel admin</p>
</div>
<script>
(function(){
var p=new URLSearchParams(location.search);
var msg=p.get("msg")||"__UWU_MSG__";
var sub=p.get("subtitle")||"__UWU_SUBTITLE__";
var code=p.get("code")||"__UWU_CODE__";
if(msg!=="__UWU_MSG__")document.getElementById("uwuMsg").textContent=msg;
if(sub!=="__UWU_SUBTITLE__")document.getElementById("uwuSubtitle").textContent=sub;
if(code!=="__UWU_CODE__")document.querySelector(".code").textContent="Código: "+code;
})();
<\/script>
</body>
</html>`;
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let n = 0;
SLUGS.forEach((slug) => {
  const file = path.join(OUT, slug + '.html');
  if (slug === 'hello-kitty' && fs.existsSync(file)) {
    console.log('skip', slug, '(existente)');
    return;
  }
  fs.writeFileSync(file, buildStub(slug), 'utf8');
  n++;
  console.log('wrote', slug + '.html');
});
console.log('Listo:', n, 'archivos');
