const RISK_PHRASES = [
  'quieres ganar dinero fácil', 'quieres ganar dinero facil',
  'quieres ganar mucho dinero', 'quieres hacer dinero rápido',
  'quieres hacer dinero rapido', 'quieres ganar bien',
  'quieres dinero fácil', 'quieres dinero facil',
  'quieres dinero rápido', 'quieres dinero rapido',
  'necesitas dinero', 'te hace falta dinero',
  'quieres hacerte rico', 'yo te puedo hacer ganar dinero',
  'yo te consigo dinero', 'yo te puedo conseguir trabajo',
  'yo conozco una forma de ganar dinero', 'yo tengo un trabajo para ti',
  'yo tengo una oportunidad para ti', 'tengo una propuesta para ti',
  'tengo un negocio para ti', 'tengo una forma de ganar mucho',
  'te puedo pagar muy bien', 'vas a ganar bastante',
  'vas a ganar muy bien', 'te voy a pagar mucho',
  'te pago por hacer unos trabajos', 'te pago por ayudarme',
  'te pago por acompañarnos', 'te pago por participar',
  'te pago por cada trabajo', 'te puedo dar dinero',
  'te gustan las armas', 'te gusta disparar',
  'sabes usar armas', 'quieres aprender a disparar',
  'quieres usar armas', 'te interesa disparar',
  'te gustaría tener armas', 'te gustaria tener armas',
  'quieres conseguir armas', 'sabes manejar',
  'sabes conducir', 'te gusta la acción',
  'te gusta la accion', 'te gusta la adrenalina',
  'te gustan las misiones', 'te gustan los trabajos peligrosos',
  'quieres hacer algo diferente', 'quieres entrar a nuestro grupo',
  'quieres unirte a nosotros', 'quieres trabajar con nosotros',
  'quieres trabajar conmigo', 'quieres formar parte del grupo',
  'quieres formar parte de nuestra gente', 'quieres entrar al negocio',
  'quieres entrar con nosotros', 'quieres conocer al jefe',
  'quieres conocer a mi gente', 'te puedo presentar a unos amigos',
  'tengo gente que busca jugadores', 'estamos buscando gente',
  'estamos buscando nuevos miembros', 'necesitamos gente como tú',
  'necesitamos gente como tu', 'nos hace falta gente',
  'estamos reclutando', 'estamos buscando jugadores activos',
  'buscamos gente que sepa disparar', 'buscamos gente que no tenga miedo',
  'buscamos gente de confianza', 'buscamos gente que obedezca',
  'necesitamos alguien que pueda ayudarnos', 'necesitamos alguien discreto',
  'necesitamos alguien que sepa manejar', 'únete y vas a ganar dinero',
  'unete y vas a ganar dinero', 'entra con nosotros y ganarás bien',
  'entra con nosotros y ganaras bien', 'si te unes te pagamos',
  'si trabajas conmigo ganas dinero', 'si vienes con nosotros te damos dinero',
  'te conviene unirte', 'esto te puede hacer ganar mucho',
  'aquí se gana bastante', 'aqui se gana bastante',
  'aquí todos ganamos dinero', 'aqui todos ganamos dinero',
  'no tienes que hacer mucho', 'es un trabajo fácil',
  'es un trabajo facil', 'es rápido y sencillo',
  'es rapido y sencillo', 'solo tienes que ayudarnos',
  'solo tienes que acompañarnos', 'solo tienes que seguir instrucciones',
  'solo tienes que hacer un encargo', 'solo tienes que llevar algo',
  'solo tienes que recoger algo', 'solo tienes que entregar algo',
  'no le digas a nadie', 'esto queda entre nosotros',
  'no preguntes demasiado', 'confía en mí',
  'confia en mi', 'nadie tiene que saber',
  'no tengas miedo', 'nosotros te protegemos',
  'nosotros nos encargamos de todo', 'te damos protección',
  'te damos proteccion', 'si haces bien el trabajo habrá más',
  'si haces bien el trabajo habra mas', 'si quieres ganar dinero ven conmigo',
    'quieres ganar plata', 'quieres hacer plata',
    'quieres sacar dinero', 'quieres sacar lana',
    'quieres hacer lana', 'quieres ganar lana',
    'quieres dinero extra', 'quieres ganar dinero extra',
    'quieres ganar unos pesos', 'quieres ganar unos dólares',
    'te interesa hacer dinero', 'te interesa ganar dinero',
    'te interesa ganar plata', 'te interesa hacer plata',
    'quieres una forma fácil de ganar', 'quieres una forma facil de ganar',
    'quieres ganar sin esfuerzo', 'quieres ganar sin trabajar',
    'quieres ganar mientras juegas', 'quieres ganar rápido',
    'quieres ganar rapido', 'quieres dinero de inmediato',
    'quieres dinero hoy', 'quieres dinero ahora',
    'puedes ganar mucho', 'puedes ganar bastante',
    'puedes ganar fácil', 'puedes ganar facil',
    'puedes hacer mucho dinero', 'puedes hacer buena lana',
    'hay dinero para ti', 'hay dinero de por medio',
    'hay buena paga', 'hay buena paga aquí',
    'hay buena paga aqui', 'la paga está buena',
    'la paga esta buena', 'pagan bastante',
    'pagan muy bien', 'pagan por ayudar',
    'pagan por trabajos', 'pagan por misiones',
    'te doy una parte', 'te toca una parte',
    'te llevas una parte', 'te llevas buen dinero',
    'te ganas una buena cantidad', 'te ganas bastante',
    'puedes quedarte con una parte', 'hay recompensa',
    'tengo una misión para ti', 'tengo una mision para ti',
    'tengo un encargo para ti', 'tengo un trabajo rápido',
    'tengo un trabajo rapido', 'tengo algo que hacer',
    'tengo algo para que hagas', 'necesito tu ayuda',
    'necesito que me ayudes', 'puedes ayudarme con un trabajo',
    'puedes hacerme un favor', 'hazme un favor y te pago',
    'te pago si me ayudas', 'te pago si vienes',
    'te pago si aceptas', 'te pago si participas',
    'ven conmigo', 'vente conmigo',
    'ven con nosotros', 'vente con nosotros',
    'sígueme', 'sigueme',
    'acompáñame', 'acompaname',
    'entra al grupo', 'entra a nuestro equipo',
    'únete al equipo', 'unete al equipo',
    'únete a la banda', 'unete a la banda',
    'quieres entrar a la banda', 'quieres ser parte de nosotros',
    'quieres ser uno de nosotros', 'quieres trabajar para nosotros',
    'quieres trabajar para mí', 'quieres trabajar para mi',
    'puedes trabajar conmigo', 'puedes trabajar con nosotros',
    'estamos contratando', 'estamos buscando personal',
    'estamos buscando nuevos jugadores', 'buscamos gente nueva',
    'buscamos jugadores', 'buscamos gente para trabajar',
    'necesitamos nuevos miembros', 'necesitamos más gente',
    'necesitamos mas gente', 'nos falta gente',
    'conozco gente que paga bien', 'conozco gente que necesita ayuda',
    'tengo contactos', 'tengo buenos contactos',
    'tengo gente importante', 'conozco al jefe',
    'puedo meterte con nosotros', 'puedo conseguirte un puesto',
    'puedo conseguirte trabajo', 'puedo meterte al grupo',
    'te puedo presentar al jefe', 'te puedo presentar a mi gente',
    'si te interesa ven', 'si quieres ganar ven',
    'si quieres dinero ven', 'si quieres trabajar ven',
    'solo ven conmigo', 'solo sígueme',
    'solo sigueme', 'no necesitas experiencia',
    'no necesitas saber mucho', 'no necesitas experiencia previa',
    'es fácil ganar aquí', 'es facil ganar aqui',
    'es dinero rápido', 'es dinero rapido',
    'es dinero fácil', 'es dinero facil',
      'quieres sacar lana', 'quieres hacer lana rápido',
      'quieres hacer lana rapido', 'quieres ganar una feria',
      'quieres sacar una feria', 'quieres hacerte de feria',
      'quieres ganar una lana', 'quieres llevarte una lana',
      'quieres una lana extra', 'quieres dinero de volada',
      'quieres sacar feria fácil', 'quieres sacar feria facil',
      'quieres dinero fácil y rápido', 'quieres dinero facil y rapido',
      'quieres billete', 'quieres hacer billete',
      'quieres ganar billete', 'quieres sacar billete',
      'quieres lana sin batallar', 'quieres lana sin trabajar',
      'quieres lana rápido', 'quieres lana rapido',
      'quieres una feria rápido', 'quieres una feria rapido',
      'quieres ganar machín', 'quieres ganar machin',
      'quieres ganar un buen', 'quieres ganar un buen de lana',
      'quieres ganar un buen de dinero', 'quieres hacer un buen de lana',
      'aquí hay feria', 'aqui hay feria',
      'aquí hay lana', 'aqui hay lana',
      'aquí se mueve feria', 'aqui se mueve feria',
      'aquí se mueve lana', 'aqui se mueve lana',
      'hay buena feria', 'hay buena lana',
      'hay billete bueno', 'hay billete de por medio',
      'la paga está pesada', 'la paga esta pesada',
      'la paga está chida', 'la paga esta chida',
      'pagan machín', 'pagan machin',
      'pagan un buen', 'pagan con madre',
      'te va a caer una lana', 'te va a caer feria',
      'te va a caer buen dinero', 'te va a tocar lana',
      'te va a tocar feria', 'te toca buen billete',
      'te llevas una feria', 'te llevas una lana',
      'te llevas buen billete', 'te ganas una lana',
      'te ganas una feria', 'te ganas buen dinero',
      'hay jale para ti', 'tengo un jale para ti',
      'tengo un jale bueno', 'tengo un jale rápido',
      'tengo un jale rapido', 'tengo un jale sencillo',
      'tengo una chamba para ti', 'hay chamba para ti',
      'hay jale aquí', 'hay jale aqui',
      'hay chamba aquí', 'hay chamba aqui',
      'ando buscando gente', 'ando buscando raza',
      'busco raza para el jale', 'busco gente para el jale',
      'ocupo raza', 'ocupo gente',
      'ocupo gente de confianza', 'ocupo alguien de confianza',
      'necesito raza', 'necesito raza nueva',
      'necesito gente nueva', 'necesito gente de confianza',
      'busco raza que aguante', 'busco gente que aguante',
      'busco raza que no tenga miedo', 'busco gente que no se raje',
      'busco alguien que sepa moverse', 'busco alguien que sepa manejar',
      'sabes moverte', 'sabes moverte en esto',
      'te sabes mover', 'te sabes mover bien',
      'eres bueno para el jale', 'eres bueno para estas cosas',
      'te interesa el jale', 'te interesa la chamba',
      'quieres entrarle al jale', 'quieres entrarle con nosotros',
      'quieres entrarle al negocio', 'quieres entrarle',
      'quieres hacer un jale', 'quieres hacer unos jales',
      'quieres chambear conmigo', 'quieres chambear con nosotros',
      'vente a chambear', 'vente con la raza',
      'vente con nosotros', 'jale tranquilo',
      'es un jale sencillo', 'es una chamba sencilla',
      'no está pesado', 'no esta pesado',
      'no te vas a complicar', 'no tienes que hacer mucho',
      'nomás tienes que ayudar', 'nomas tienes que ayudar',
      'nomás tienes que acompañarnos', 'nomas tienes que acompañarnos',
      'nomás haces lo que te digo', 'nomas haces lo que te digo',
      'haz caso y te va bien', 'tú haz caso',
      'tu haz caso', 'no hagas preguntas',
      'no preguntes de más', 'no preguntes de mas',
      'esto queda entre la raza', 'esto queda entre nosotros',
      'no le cuentes a nadie', 'no le digas a nadie',
      'nadie tiene que saber', 'que no se entere nadie',
      'si te interesa te meto', 'si quieres te meto',
      'yo te meto al grupo', 'yo te consigo jale',
      'yo te consigo chamba', 'yo te consigo una lana',
      'yo te consigo feria', 'yo te conecto con la gente',
      'lana', 'feria', 'billete', 'dinero', 'plata',
    'paga', 'pago', 'sueldo', 'ganancia', 'negocio',
    'jale', 'chamba', 'trabajo', 'encargo', 'misión',
    'mision', 'ayuda', 'puesto', 'grupo', 'banda',
    'raza', 'gente', 'contactos', 'jefe', 'patrón',
    'patron', 'compa', 'compas', 'socio', 'socios',
    'miembro', 'recluta', 'reclutamiento', 'ingreso', 'entrada',
    'equipo', 'organización', 'organizacion', 'célula', 'celula',
    'cártel', 'cartel', 'mafia', 'sicario', 'halcón',
    'halcon', 'soldado', 'comando', 'plaza', 'territorio',
    'punto', 'movida', 'movimiento', 'jaleado', 'levantón',
    'levanton', 'secuestro', 'secuestrado', 'retenido', 'encerrado',
    'rescate', 'cobro', 'extorsión', 'extorsion', 'amenaza', 'amenazas',
    'chantaje', 'presión', 'presion', 'miedo', 'obediencia',
    'órdenes', 'ordenes', 'confianza', 'discreción', 'discrecion',
    'secreto', 'armas', 'arma', 'rifle', 'pistola',
    'cuerno', 'cuernos', 'metralleta', 'balas', 'munición',
    'municion', 'disparos', 'disparar', 'plomo', 'fuego',
    'camioneta', 'troca', 'vehículo', 'vehiculo', 'blindada',
    'convoy', 'cargar', 'entregar', 'recoger', 'trasladar',
    'vigilar', 'vigía', 'vigia', 'escolta', 'proteger',
    'jalar', 'chambear', 'entrarle', 'mover', 'moverse'
]

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Se compila una sola vez: frase original (con acentos, para mostrarla) + regex de palabra completa.
// Las variantes con y sin acento normalizan igual, así que se quedan con la primera.
const RISK_MATCHERS = (() => {
  const seen = new Set<string>()
  const matchers: { phrase: string; regex: RegExp }[] = []
  for (const phrase of RISK_PHRASES) {
    const key = normalize(phrase).trim()
    if (!key || seen.has(key)) continue
    seen.add(key)
    matchers.push({
      phrase,
      regex: new RegExp(`(?<![a-z0-9])${escapeRegex(key)}(?![a-z0-9])`, 'g'),
    })
  }
  return matchers
})()

export function detectRiskPhrases(transcription: string): {
  detected: boolean
  phrases: string[]
} {
  const text = normalize(transcription)

  const matches: { phrase: string; start: number; end: number }[] = []
  for (const { phrase, regex } of RISK_MATCHERS) {
    regex.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
      matches.push({ phrase, start: m.index, end: m.index + m[0].length })
    }
  }

  // Descarta las coincidencias contenidas dentro de otra más larga
  // (p. ej. "dinero" dentro de "quieres ganar dinero fácil").
  const kept = matches.filter(
    (a) => !matches.some((b) => b !== a && b.start <= a.start && b.end >= a.end && b.end - b.start > a.end - a.start)
  )

  // Únicas, en el orden en que aparecen en el audio.
  const phrases = Array.from(
    new Map(kept.sort((a, b) => a.start - b.start).map((m) => [m.phrase, m.phrase])).values()
  )

  return { detected: phrases.length > 0, phrases }
}
