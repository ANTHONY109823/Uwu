export const CATEGORIES = [
  { slug: 'amor', name: 'Amor', emoji: '❤️', sortOrder: 1 },
  { slug: 'romantica', name: 'Romántica', emoji: '💌', sortOrder: 2 },
  { slug: 'cumpleanos', name: 'Cumpleaños', emoji: '🎂', sortOrder: 3 },
  { slug: 'aniversario', name: 'Aniversario', emoji: '💕', sortOrder: 4 },
  { slug: 'perdon', name: 'Perdón', emoji: '🌸', sortOrder: 5 },
  { slug: 'extranar', name: 'Extrañar', emoji: '💔', sortOrder: 6 },
  { slug: 'familia', name: 'Familia', emoji: '👨‍👩‍👧', sortOrder: 7 },
  { slug: 'mascotas', name: 'Mascotas', emoji: '🐶', sortOrder: 8 },
  { slug: 'sorprender', name: 'Sorprender', emoji: '✨', sortOrder: 9 },
  { slug: 'fechas-especiales', name: 'Fechas especiales', emoji: '🎄', sortOrder: 10 },
  { slug: 'cerrar-ciclos', name: 'Cerrar ciclos', emoji: '🕊️', sortOrder: 11 },
  { slug: 'pedida', name: 'Pedida de mano', emoji: '💍', sortOrder: 12 },
] as const;

export const LEVELS = [
  { code: 'free' as const, name: 'Gratis', emoji: '🆓', pricePen: 0, priceUsd: 0 },
  { code: 'premium' as const, name: 'Premium', emoji: '💌', pricePen: 5, priceUsd: 1.49 },
  { code: 'exclusive' as const, name: 'Exclusiva', emoji: '💎', pricePen: 8, priceUsd: 2.49 },
];

const CAT: Record<string, string> = {
  Sorprender: 'sorprender',
  'Carta romántica': 'romantica',
  Cumpleaños: 'cumpleanos',
  'Pedida de mano': 'pedida',
  Aniversario: 'aniversario',
  'San Valentín': 'romantica',
  Perdón: 'perdon',
  'Cerrar ciclos': 'cerrar-ciclos',
  Familia: 'familia',
  Mascotas: 'mascotas',
  Amar: 'amor',
  Enamorar: 'amor',
  Extrañar: 'extranar',
  'Fechas especiales': 'fechas-especiales',
};

export const SHOWCASE_SLUGS = [
  'hello-kitty', 'carta-eterna', 'feliz-cumple', 'quieres-casarte', 'nuestro-tiempo',
  'mi-valentin', 'perdoname', 'gracias-por-todo', 'para-mama', 'firulais-forever',
];

export const TEMPLATES = [
  { slug: 'hello-kitty', code: 'UWU-HKIT', name: 'Hello Kitty Mágica', emoji: '🎀', cat: 'Sorprender', tier: 'exclusive', pen: 8, usd: 2.49, grad: 'linear-gradient(135deg,#e542a1,#3890dd,#c654ce)', pill: 'Tocar para abrir 🎀', title: 'Hello Kitty para ti', desc: 'Hello Kitty se dibuja sola, luego tu mensaje aparece letra por letra con corazones flotantes.', featured: true, sort: 1 },
  { slug: 'carta-eterna', code: 'UWU-CTRN', name: 'Carta Eterna', emoji: '💌', cat: 'Carta romántica', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(165deg,#4a1030,#8e2461)', pill: 'Tocar para abrir 💝', title: 'Mi carta para ti', desc: 'Una carta que se abre con tu voz, tus palabras y la canción de los dos.', featured: true, sort: 2 },
  { slug: 'feliz-cumple', code: 'UWU-FIIN', name: 'Fiesta Infinita', emoji: '🎂', cat: 'Cumpleaños', tier: 'free', pen: 0, usd: 0, grad: 'linear-gradient(160deg,#F6A13C,#F0567B)', pill: 'Soplar velitas 🎉', title: '¡Feliz cumpleaños!', desc: 'Sopla las velitas, revienta los globos y descubre 25 razones para celebrarte.', featured: true, sort: 3 },
  { slug: 'quieres-casarte', code: 'UWU-LGPREG', name: 'La Gran Pregunta', emoji: '💍', cat: 'Pedida de mano', tier: 'exclusive', pen: 8, usd: 2.49, grad: 'linear-gradient(165deg,#1C1420,#5b2a5e)', pill: 'Ver nuestra historia ✨', title: '¿Te casarías conmigo?', desc: 'Un cielo de estrellas, la historia de los dos, y la pregunta más importante al final.', featured: true, sort: 4 },
  { slug: 'nuestro-tiempo', code: 'UWU-NUTI', name: 'Nuestro Tiempo', emoji: '💕', cat: 'Aniversario', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(160deg,#8e2461,#E8447A)', pill: 'Ver cada momento ⏳', title: '847 días juntos', desc: 'Un contador en vivo de cada segundo a tu lado.', featured: true, sort: 5 },
  { slug: 'mi-valentin', code: 'UWU-JDROS', name: 'Jardín de Rosas', emoji: '🌹', cat: 'San Valentín', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(160deg,#C21E4C,#F45C7F)', pill: 'Abrir el jardín 🌹', title: 'Mi San Valentín', desc: 'Un jardín de rosas que florece mientras lee por qué la elegiste a ella.', featured: true, sort: 6 },
  { slug: 'perdoname', code: 'UWU-LLFL', name: 'Lluvia de Flores', emoji: '🌸', cat: 'Perdón', tier: 'free', pen: 0, usd: 0, grad: 'linear-gradient(165deg,#7899d4,#c6a9e8)', pill: 'Leer mi disculpa 🌸', title: 'Perdóname', desc: 'A veces las palabras cuestan. Esta página las dice bonito por ti.', featured: true, sort: 7 },
  { slug: 'gracias-por-todo', code: 'UWU-VOLAR', name: 'Volar de Nuevo', emoji: '💔', cat: 'Cerrar ciclos', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(160deg,#5f72bd,#9b23ea)', pill: 'Soltar con amor 🕊️', title: 'Gracias por todo', desc: 'Cerrar un ciclo también puede ser hermoso.', featured: true, sort: 8 },
  { slug: 'para-mama', code: 'UWU-RAIZ', name: 'Raíces', emoji: '👨‍👩‍👧', cat: 'Familia', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(160deg,#E88A4A,#F2BC5C)', pill: 'Abrir el álbum 📖', title: 'Para mamá', desc: 'El álbum de la familia con las fotos de siempre.', featured: true, sort: 9 },
  { slug: 'firulais-forever', code: 'UWU-MEAM', name: 'Mejor Amigo', emoji: '🐶', cat: 'Mascotas', tier: 'free', pen: 0, usd: 0, grad: 'linear-gradient(160deg,#C98A4B,#E8B34B)', pill: 'Ver sus travesuras 🐾', title: 'Firulais 4ever', desc: 'La página de tu mejor amigo de cuatro patas.', featured: true, sort: 10 },
  { slug: 'netflix-del-amor', code: 'UWU-NFLX', name: 'Netflix del Amor', emoji: '🎬', cat: 'Aniversario', tier: 'exclusive', pen: 8, usd: 2.49, grad: 'linear-gradient(150deg,#141414,#E50914)', pill: 'Reproducir ❤️', title: 'Nuestra serie', desc: 'Tu historia en formato binge.', featured: false, sort: 11 },
  { slug: 'nuestro-playlist', code: 'UWU-PLAY', name: 'Nuestro Playlist', emoji: '🎧', cat: 'Amar', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#121212,#1DB954)', pill: 'Escuchar juntos 🎵', title: 'Nuestra playlist', desc: 'Las canciones que marcaron cada momento.', featured: false, sort: 12 },
  { slug: 'constelacion', code: 'UWU-CONST', name: 'Constelación', emoji: '⭐', cat: 'Enamorar', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#0f1030,#4b3f8e)', pill: 'Ver las estrellas ✨', title: 'Nuestra constelación', desc: 'Un cielo estrellado con el mapa de los momentos.', featured: false, sort: 13 },
  { slug: 'cuenta-regresiva', code: 'UWU-CUENT', name: 'Cuenta Regresiva', emoji: '⏳', cat: 'Sorprender', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#B06AB3,#7873f5)', pill: 'Iniciar cuenta ⏳', title: 'Faltan solo…', desc: 'Un contador que desemboca en el momento más esperado.', featured: false, sort: 14 },
  { slug: 'vhs-recuerdos', code: 'UWU-VHS', name: 'VHS de Recuerdos', emoji: '📼', cat: 'Extrañar', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#3a2d20,#8a6a3c)', pill: 'Rebobinar 📼', title: 'Recuerdos en VHS', desc: 'Nostalgia en pantalla.', featured: false, sort: 15 },
  { slug: 'mapa-primer-beso', code: 'UWU-MAPB', name: 'El Mapa del Primer Beso', emoji: '📍', cat: 'Amar', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#134E5E,#71B280)', pill: 'Ver el mapa 📍', title: 'Aquí empezó todo', desc: 'El lugar exacto donde el mundo cambió.', featured: false, sort: 16 },
  { slug: 'latidos', code: 'UWU-LAT', name: 'Latidos', emoji: '💗', cat: 'Enamorar', tier: 'free', pen: 0, usd: 0, grad: 'linear-gradient(150deg,#FF6584,#E8447A)', pill: 'Sentir el latido 💗', title: 'Mi corazón late por ti', desc: 'Una página que late al ritmo de tu mensaje.', featured: false, sort: 17 },
  { slug: 'navidad-juntos', code: 'UWU-NAV', name: 'Navidad Juntos', emoji: '🎄', cat: 'Fechas especiales', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#c23a3a,#1e5e3a)', pill: 'Abrir regalo 🎁', title: 'Feliz Navidad juntos', desc: 'Luces, nieve digital y palabras cálidas.', featured: false, sort: 18 },
  { slug: 'amor-distancia', code: 'UWU-DIST', name: 'Amor a Distancia', emoji: '✈️', cat: 'Extrañar', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#56A8E8,#8ED0F8)', pill: 'Cruzar kilómetros ✈️', title: 'A kilómetros, juntos', desc: 'La distancia no gana cuando el amor tiene su propia página.', featured: false, sort: 19 },
  { slug: 'nuestra-historia', code: 'UWU-HIST', name: 'Nuestra Historia', emoji: '📖', cat: 'Aniversario', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#6d4226,#b8845a)', pill: 'Leer capítulo 📖', title: 'Capítulo a capítulo', desc: 'La línea de tiempo de los dos.', featured: false, sort: 20 },
  { slug: 'buenas-noches', code: 'UWU-NOCHE', name: 'Buenas Noches', emoji: '🌙', cat: 'Amar', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#1C1420,#3d2a6e)', pill: 'Soñar juntos 🌙', title: 'Buenas noches, amor', desc: 'Para cerrar el día con una carta suave.', featured: false, sort: 21 },
  { slug: 'ano-nuevo', code: 'UWU-ANUE', name: 'Año Nuevo, Amor Nuevo', emoji: '🥂', cat: 'Fechas especiales', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#2d2410,#c9a227)', pill: 'Brindar 🥂', title: 'Un brindis por nosotros', desc: 'Celebrar lo vivido y lo que viene.', featured: false, sort: 22 },
  { slug: 'ramo-infinito', code: 'UWU-RAMO', name: 'Ramo Infinito', emoji: '💐', cat: 'San Valentín', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#E8447A,#F4A7CB)', pill: 'Recibir flores 💐', title: 'Un ramo para ti', desc: 'Flores que nunca se marchitan.', featured: false, sort: 23 },
  { slug: 'perdoname-bonito', code: 'UWU-PBON', name: 'Perdóname Bonito', emoji: '🤍', cat: 'Perdón', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#8a9bb8,#c4d0e0)', pill: 'Leer con calma 🤍', title: 'Lo siento de verdad', desc: 'Una disculpa sincera envuelta en calma.', featured: false, sort: 24 },
  { slug: 'globos-deseos', code: 'UWU-GLOB', name: 'Globos y Deseos', emoji: '🎈', cat: 'Cumpleaños', tier: 'premium', pen: 5, usd: 1.49, grad: 'linear-gradient(150deg,#F0567B,#FDD35C)', pill: 'Soltar globos 🎈', title: 'Pide un deseo', desc: 'Globos, confeti y celebración digital.', featured: false, sort: 25 },
].map((t) => ({ ...t, categorySlug: CAT[t.cat] ?? 'amor' }));

export const DEFAULT_FIELDS = [
  { fieldKey: 'para', fieldType: 'text', label: 'Para quién', placeholder: 'Ej: Mariana', maxLength: 50, isRequired: true, sortOrder: 1 },
  { fieldKey: 'de', fieldType: 'text', label: 'Tu nombre (firma)', placeholder: 'Ej: Diego', maxLength: 50, isRequired: true, sortOrder: 2 },
  { fieldKey: 'mensaje', fieldType: 'textarea', label: 'Tu mensaje', placeholder: 'Escribe tu carta…', maxLength: 2000, isRequired: true, sortOrder: 3 },
  { fieldKey: 'cancion', fieldType: 'music', label: 'Canción', placeholder: 'Artista — Canción', maxLength: 200, isRequired: false, sortOrder: 4 },
];
