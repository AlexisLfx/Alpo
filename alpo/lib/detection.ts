export type RiskCategory =
  | 'grooming'
  | 'aislamiento'
  | 'crimen_organizado'
  | 'encuentro_fisico'
  | 'estafa_financiera'

export interface CategorizedRiskPhrase {
  phrase: string
  category: RiskCategory
}

export interface RiskMatcher {
  phrase: string
  category: RiskCategory
  regex: RegExp
}

export interface DetectionResult {
  detected: boolean
  phrases: string[]
  categories: RiskCategory[]
}

export const RISK_DICTIONARY: Record<RiskCategory, string[]> = {
  grooming: [
    // Manipulación afectiva y adulación inapropiada de edad/madurez
    'eres muy madura para tu edad', 'eres muy maduro para tu edad',
    'pareces más grande', 'pareces mas grande',
    'te ves más grande', 'te ves mas grande',
    'pareces de más edad', 'pareces de mas edad',
    'no pareces de tu edad', 'no pareces un niño', 'no pareces un nino',
    'no pareces una niña', 'no pareces una nina',
    'eres muy especial para mí', 'eres muy especial para mi',
    'eres especial para mí', 'eres especial para mi',
    'eres mi favorita', 'eres mi favorito',
    'eres mi consentida', 'eres mi consentido',
    'eres el más lindo', 'eres el mas lindo',
    'eres la más linda', 'eres la mas linda',
    'nadie te entiende como yo', 'yo sí te entiendo', 'yo si te entiendo',
    'solo yo te comprendo', 'los demás no te entienden', 'los demas no te entienden',
    'me gustas mucho', 'me encantas',
    't kiero mucho', 'te kiero mucho', 'te quiero mucho',
    't kiero', 'te kiero', 't amo', 'te amo bebé', 'te amo bebe',
    'sé mi novia', 'se mi novia', 'sé mi novio', 'se mi novio',
    'eres mi crush',

    // Solicitud de fotos, videos o poses íntimas (lenguaje estándar y jerga)
    'mándame una foto', 'mandame una foto',
    'mándame foto', 'mandame foto', 'manda foto',
    'pasa foto', 'pásame una foto', 'pasame una foto',
    'mándame una fto', 'mandame una fto', 'manda fto', 'pasa fto',
    'pásame una fto', 'pasame una fto',
    'manda fto xfa', 'mándame fto xfa', 'mandame fto xfa', 'manda foto xfa',
    'mándame una foto tuya', 'mandame una foto tuya',
    'mándame foto de ti', 'mandame foto de ti',
    'mándame una foto de tu cara', 'mandame una foto de tu cara',
    'mándame una foto de cuerpo completo', 'mandame una foto de cuerpo completo',
    'foto de cuerpo completo', 'fto de cuerpo completo',
    'mándame una foto sin ropa', 'mandame una foto sin ropa',
    'manda foto sin ropa', 'manda fto sin ropa', 'foto sin ropa', 'fto sin ropa',
    'mándame una foto en traje de baño', 'mandame una foto en traje de bano',
    'foto en traje de baño', 'foto en traje de bano',
    'mándame una foto en ropa interior', 'mandame una foto en ropa interior',
    'foto en ropa interior', 'en ropa interior',
    'mándame una foto en calzones', 'mandame una foto en calzones',
    'foto en calzones', 'foto en boxer',
    'pasa pack', 'pásame el pack', 'pasame el pack',
    'mándame el pack', 'mandame el pack', 'manda pack', 'pasa el pack',
    'pasa nudes', 'mándame nudes', 'mandame nudes', 'manda nudes', 'pásame nudes', 'pasame nudes',
    'te enseño algo', 'te enseno algo', 'te muestro algo',
    'mira lo que tengo para ti',
    'te mando una foto mía y tú una tuya', 'te mando una foto mia y tu una tuya',
    'te mando una y tú una', 'te mando una y tu una',
    'intercambio de fotos',

    // Citas privadas en línea, webcam y juegos inapropiados
    'enciende tu cámara', 'enciende tu camara',
    'prende tu cam', 'prende la cam',
    'activa la cámara', 'activa la camara', 'activa tu cam',
    'ponte la cámara', 'ponte la camara',
    'préndela cámara', 'prendela camara', 'prendan cam',
    'vamos a hacer videollamada a solas', 'videollamada a solas', 'llamada a solas',
    'vamos a hablar en privado', 'vamos al privado', 'vamos al priv',
    'ven al privado', 'ven al priv', 'pasa al priv',
    'hablamos por whats', 'pásame tu whats', 'pasame tu whats',
    'pasa whats', 'dame tu whats', 'pasa tu whatsapp',
    'agregame a snap', 'pasa tu snap', 'agregame a snapchat',
    'pasa tu ig', 'pasa tu instagram',
    'vamos a discord', 'pasa tu discord', 'llamada en discord',
    'jugamos verdad o reto', 'reto caliente', 'juego atrevido', 'verdad o castigo',

    // Términos y palabras clave de grooming
    'pack', 'nudes', 'webcam', 'cámara web', 'camara web',
    'desnudo', 'desnuda', 'morbo', 'caliente',
    'tocarte', 'tócame', 'tocame', 'tocándote', 'tocandote',
    'te tocas', 'te has tocado', 'te gusta tocarte',
    'hacer cosas malas', 'cosas de grandes', 'juego de adultos',
  ],

  aislamiento: [
    // Secretismo y pactos de silencio frente a padres/tutores
    'no le digas a nadie', 'no le cuentes a nadie',
    'que nadie sepa', 'nadie tiene que saber',
    'que no se entere nadie', 'k nadie sepa', 'k nadie se entere',
    'que quede entre nosotros', 'esto queda entre nosotros',
    'es un secreto entre los dos', 'secreto entre los dos',
    'es nuestro secreto', 'nuestro secreto', 'secreto entre nosotros',
    'es nuestra sorpresa', 'nuestro pequeño secreto', 'nuestro pequeno secreto',
    'secreto de amigos',
    'no le digas a tus papás', 'no le digas a tus papas',
    'no le digas a tu mamá', 'no le digas a tu mama',
    'no le digas a tu papá', 'no le digas a tu papa',
    'no le cuentes a tus papás', 'no le cuentes a tus papas',
    'no le digas a tus jefes', 'no le digas a tus gfs',
    'tus papás no van a entender', 'tus papas no van a entender',
    'tus papás no entienden', 'tus papas no entienden',
    'tus papás te van a regañar', 'tus papas te van a reganar',
    'tus papás te van a castigar', 'tus papas te van a castigar',
    'si les dices se van a enojar',
    'no dejes que vean esto', 'no dejes que revisen tu cel',
    'no dejes que miren tus mensajes', 'bloquea tu celular', 'bloquea tu cel',
    'oculta el chat', 'escóndelo de tus papás', 'escondelo de tus papas',
    'no confíes en tus papás', 'no confies en tus papas',

    // Destrucción de chats, capturas y evidencias
    'borra este chat', 'borra los mensajes',
    'borra la conversación', 'borra la conversacion',
    'borra las fotos', 'borra todo', 'borra el historial',
    'borra todo lo que te envié', 'borra todo lo que te envie',
    'borra lo que te mandé', 'borra lo que te mande',
    'activa los mensajes temporales', 'mensajes temporales',
    'chat temporal', 'chat que se autodestruye',
    'bórralo xfa', 'borralo xfa',
    'bórralo rápido', 'borralo rapido', 'bórralo ya', 'borralo ya',
    'no tomes captura', 'no saques captura', 'no le tomes captura',
    'no screenshot', 'no hagas screenshot', 'no le tomes screen',
    'la borro enseguida', 'la borro de una vez',
    'yo la borro después', 'yo la borro despues',

    // Manipulación psicológica, coacción y amenazas veladas
    'confía en mí', 'confia en mi',
    'solo confía en mí', 'solo confia en mi',
    'tenme confianza', 'me tienes que tener confianza',
    'si eres mi amigo', 'si de verdad eres mi amigo',
    'demuéstrame que eres mi amigo', 'demuestrame que eres mi amigo',
    'si me quieres hazlo',
    'demuéstrame que me quieres', 'demuestrame que me quieres',
    'no seas aguado', 'no seas miedoso', 'no te rajes',
    'no seas cobarde', 'no me decepciones',
    'me vas a romper el corazón', 'me vas a romper el corazon',
    'ya no voy a ser tu amigo', 'no voy a jugar contigo si no lo haces',
    'te prometo que no pasa nada', 'no pasa nada malo',
    'yo te protejo', 'yo te cuido',
    'si dices algo te busco', 'si hablas habrá problemas', 'si hablas habra problemas',
    'no me hagas enojar', 'si dices algo me las vas a pagar',
    'no te conviene hablar',
  ],

  crimen_organizado: [
    // Propuestas económicas y reclutamiento ilícito
    'quieres ganar dinero fácil', 'quieres ganar dinero facil',
    'quieres ganar mucho dinero', 'quieres hacer dinero rápido',
    'quieres hacer dinero rapido', 'dinero fácil y rápido', 'dinero facil y rapido',
    'quieres ganar bien', 'quieres dinero fácil', 'quieres dinero facil',
    'quieres dinero rápido', 'quieres dinero rapido',
    'necesitas dinero', 'te hace falta dinero', 'quieres hacerte rico',
    'yo te puedo hacer ganar dinero', 'yo te consigo dinero', 'yo te puedo conseguir trabajo',
    'yo conozco una forma de ganar dinero', 'yo tengo un trabajo para ti',
    'yo tengo una oportunidad para ti', 'tengo una propuesta para ti',
    'tengo un negocio para ti', 'tengo una forma de ganar mucho',
    'te puedo pagar muy bien', 'vas a ganar bastante', 'vas a ganar muy bien',
    'te voy a pagar mucho', 'te pago por hacer unos trabajos',
    'te pago por ayudarme', 'te pago por acompañarnos', 'te pago por participar',
    'te pago por cada trabajo', 'te puedo dar dinero',
    'quieres ganar plata', 'quieres hacer plata',
    'quieres sacar dinero', 'quieres sacar lana',
    'quieres hacer lana', 'quieres ganar lana',
    'quieres ganar mucha lana', 'hacer lana rápido', 'hacer lana rapido',
    'quieres dinero extra', 'quieres ganar dinero extra',
    'quieres ganar unos pesos', 'quieres ganar unos dólares',
    'te interesa hacer dinero', 'te interesa ganar dinero',
    'te interesa ganar plata', 'te interesa hacer plata',
    'quieres una forma fácil de ganar', 'quieres una forma facil de ganar',
    'quieres ganar sin esfuerzo', 'quieres ganar sin trabajar',
    'quieres ganar mientras juegas', 'quieres ganar rápido', 'quieres ganar rapido',
    'quieres dinero de inmediato', 'quieres dinero hoy', 'quieres dinero ahora',
    'puedes ganar mucho', 'puedes ganar bastante',
    'puedes ganar fácil', 'puedes ganar facil',
    'puedes hacer mucho dinero', 'puedes hacer buena lana',
    'hay dinero para ti', 'hay dinero de por medio',
    'hay buena paga', 'hay buena paga aquí', 'hay buena paga aqui',
    'la paga está buena', 'la paga esta buena',
    'la paga está pesada', 'la paga esta pesada',
    'la paga está chida', 'la paga esta chida',
    'pagan bastante', 'pagan muy bien', 'pagan por ayudar',
    'pagan por trabajos', 'pagan por misiones',
    'pagan machín', 'pagan machin', 'pagan con madre', 'pagan un buen',
    'te va a caer una lana', 'te va a caer feria',
    'te va a caer buen dinero', 'te va a tocar lana', 'te va a tocar feria',
    'te toca buen billete', 'te llevas una feria', 'te llevas una lana',
    'te llevas buen billete', 'te ganas una lana', 'te ganas una feria',
    'te ganas buen dinero', 'te doy una parte', 'te toca una parte',
    'te llevas una parte', 'te llevas buen dinero',
    'te ganas una buena cantidad', 'te ganas bastante',
    'puedes quedarte con una parte', 'hay recompensa',
    'aquí hay feria', 'aqui hay feria', 'aquí hay lana', 'aqui hay lana',
    'aquí se mueve feria', 'aqui se mueve feria',
    'aquí se mueve lana', 'aqui se mueve lana',
    'hay buena feria', 'hay buena lana', 'hay billete bueno', 'hay billete de por medio',
    'quieres ganar billete', 'quieres sacar billete', 'ganar buen billete',
    'quieres hacer billete', 'quieres lana sin batallar', 'quieres lana sin trabajar',
    'quieres lana rápido', 'quieres lana rapido',
    'quieres una feria rápido', 'quieres una feria rapido',
    'quieres ganar machín', 'quieres ganar machin',
    'quieres ganar un buen', 'quieres ganar un buen de lana',
    'quieres ganar un buen de dinero', 'quieres hacer un buen de lana',
    'aquí se gana bastante', 'aqui se gana bastante',
    'aquí todos ganamos dinero', 'aqui todos ganamos dinero',
    'si trabajas conmigo ganas dinero', 'si te unes te pagamos',
    'si vienes con nosotros te damos dinero', 'te conviene unirte',
    'esto te puede hacer ganar mucho',
    'no tienes que hacer mucho', 'es un trabajo fácil', 'es un trabajo facil',
    'es un trabajo fácil y rápido', 'es un trabajo facil y rapido',
    'es rápido y sencillo', 'es rapido y sencillo',

    // Encomiendas, reclutamiento y pertenencia grupal
    'tengo una misión para ti', 'tengo una mision para ti',
    'tengo un encargo para ti', 'tengo un trabajo rápido', 'tengo un trabajo rapido',
    'tengo algo que hacer', 'tengo algo para que hagas',
    'necesito tu ayuda', 'necesito que me ayudes',
    'puedes ayudarme con un trabajo', 'puedes hacerme un favor',
    'hazme un favor y te pago', 'te pago si me ayudas',
    'te pago si vienes', 'te pago si aceptas', 'te pago si participas',
    'hay jale para ti', 'tengo un jale para ti',
    'tengo un jale bueno', 'tengo un jale rápido', 'tengo un jale rapido',
    'tengo un jale sencillo', 'tengo un jale fácil', 'tengo un jale facil',
    'jale tranquilo', 'es un jale sencillo', 'es una chamba sencilla',
    'tengo una chamba para ti', 'hay chamba para ti',
    'chamba fácil', 'chamba facil',
    'hay jale aquí', 'hay jale aqui', 'hay chamba aquí', 'hay chamba aqui',
    'quieres chambear conmigo', 'quieres chambear con nosotros',
    'vente a chambear', 'vente con la raza',
    'ando buscando gente', 'ando buscando raza',
    'busco raza para el jale', 'busco gente para el jale',
    'ocupo raza', 'ocupo gente',
    'ocupo gente de confianza', 'ocupo alguien de confianza',
    'necesito raza', 'necesito raza nueva', 'necesito gente nueva',
    'necesito gente de confianza',
    'busco raza que aguante', 'busco gente que aguante',
    'busco raza que no tenga miedo', 'busco gente que no tenga miedo',
    'busco gente que no se raje', 'busco gente de confianza', 'busco gente que obedezca',
    'busco alguien que sepa moverse', 'busco alguien que sepa manejar',
    'sabes moverte', 'sabes moverte en esto', 'te sabes mover', 'te sabes mover bien',
    'eres bueno para el jale', 'eres bueno para estas cosas',
    'te interesa el jale', 'te interesa la chamba',
    'quieres entrarle al jale', 'quieres entrarle con nosotros',
    'quieres entrarle al negocio', 'quieres entrarle',
    'quieres hacer un jale', 'quieres hacer unos jales',
    'estamos reclutando', 'estamos buscando personal',
    'estamos buscando nuevos miembros', 'estamos contratando',
    'necesitamos gente como tú', 'necesitamos gente como tu',
    'nos hace falta gente', 'necesitamos más gente', 'necesitamos mas gente',
    'nos falta gente', 'necesitamos nuevos miembros',
    'quieres hacer algo diferente', 'quieres entrar a nuestro grupo',
    'quieres unirte a nosotros', 'quieres trabajar con nosotros',
    'quieres trabajar conmigo', 'quieres formar parte del grupo',
    'quieres formar parte de nuestra gente', 'quieres entrar al negocio',
    'quieres entrar con nosotros',
    'entra al grupo', 'entra a nuestro equipo', 'únete al equipo', 'unete al equipo',
    'únete a la banda', 'unete a la banda',
    'quieres entrar a la banda', 'quieres ser parte de nosotros',
    'quieres ser uno de nosotros', 'quieres trabajar para nosotros',
    'quieres trabajar para mí', 'quieres trabajar para mi',
    'puedes trabajar conmigo', 'puedes trabajar con nosotros',
    'puedo meterte con nosotros', 'puedo conseguirte un puesto',
    'puedo conseguirte trabajo', 'puedo meterte al grupo',
    'si te interesa te meto', 'si quieres te meto',
    'yo te meto al grupo', 'yo te consigo jale', 'yo te consigo chamba',
    'yo te consigo una lana', 'yo te consigo feria', 'yo te conecto con la gente',
    'conozco gente que paga bien', 'conozco gente que necesita ayuda',
    'tengo contactos', 'tengo buenos contactos', 'tengo gente importante',
    'quieres conocer al jefe', 'quieres conocer a mi gente',
    'te puedo presentar a unos amigos', 'te puedo presentar al jefe',
    'te puedo presentar a mi gente', 'te presento al patrón', 'te presento al patron',
    'conozco al patrón', 'conozco al patron', 'conozco al jefe', 'la gente de arriba',

    // Logística, transporte ("mulas") y vigilancia ("halconeo")
    'cuidar la plaza', 'cuidar el punto', 'vigilar el punto', 'echar ojo al punto',
    'avísame si ves patrullas', 'avisame si ves patrullas',
    'avísame si ves a los verdes', 'avisame si ves a los verdes',
    'avísame si entra la tira', 'avisame si entra la tira',
    'avísame si ves a la guardia', 'avisame si ves a la guardia',
    'halconear', 'andar de halcón', 'andar de halcon',
    'hacer de halcón', 'hacer de halcon',
    'ocupo un halcón', 'ocupo un halcon', 'trabajo de halcón', 'trabajo de halcon',
    'traer un paquete', 'llevar un paquete', 'entregar un paquete', 'recoger un paquete',
    'hacer una entrega', 'hacer un encargo',
    'solo tienes que llevar algo', 'solo tienes que recoger algo', 'solo tienes que entregar algo',
    'no preguntes qué lleva', 'no preguntes que lleva',
    'no preguntes qué es', 'no preguntes que es',
    'no abras el paquete', 'no abras la bolsa', 'no preguntes demasiado',
    'tirar esquina', 'hacer el paro con la entrega',
    'nomás tienes que ayudar', 'nomas tienes que ayudar',
    'nomás tienes que acompañarnos', 'nomas tienes que acompañarnos',
    'nomás haces lo que te digo', 'nomas haces lo que te digo',
    'haz caso y te va bien', 'tú haz caso', 'tu haz caso',
    'no hagas preguntas', 'no preguntes de más', 'no preguntes de mas',
    'esto queda entre la raza',

    // Armas, violencia y jerga de cárteles
    'sabes usar armas', 'te gustan las armas', 'te gusta disparar',
    'quieres aprender a disparar', 'quieres usar armas', 'te interesa disparar',
    'te gustaría tener armas', 'te gustaria tener armas', 'quieres conseguir armas',
    'cuerno de chivo', 'cuerno', 'cuernos', 'metralleta', 'pistola', 'rifle',
    'balas', 'munición', 'municion', 'disparos', 'disparar',
    'plomo', 'dar plomo', 'echar plomo', 'fuego',
    'dar de baja', 'enfriar', 'dar piso',
    'levantón', 'levanton', 'levantar gente', 'secuestro', 'secuestrado',
    'retenido', 'encerrado', 'rescate',
    'cobro de piso', 'cobro', 'extorsión', 'extorsion',
    'amenaza', 'amenazas', 'chantaje',
    'sicario', 'sicarios', 'halcón', 'halcon', 'comandante',
    'soldado', 'comando', 'plaza', 'territorio', 'punto',
    'célula', 'celula', 'cártel', 'cartel', 'mafia',
    'convoy', 'troca blindada', 'camioneta blindada', 'blindada',
    'pechera', 'chaleco blindado', 'jaleado', 'movida',

    // Términos clave individuales de delincuencia organizada
    'lana', 'feria', 'billete', 'dinero', 'plata',
    'paga', 'pago', 'sueldo', 'ganancia', 'negocio',
    'jale', 'chamba', 'encargo', 'misión', 'mision',
    'patrón', 'patron', 'socio', 'socios',
    'recluta', 'reclutamiento',
  ],

  encuentro_fisico: [
    // Indagación de domicilio, escuela o rutina del menor
    'dame tu dirección', 'dame tu direccion',
    'pasa tu dirección', 'pasa tu direccion',
    'cuál es tu dirección', 'cual es tu direccion',
    'dónde vives', 'donde vives', 'dond vives',
    'en qué colonia vives', 'en que colonia vives',
    'en qué calle vives', 'en que calle vives',
    'pasa tu colonia', 'dime tu colonia',
    'a qué escuela vas', 'a que escuela vas',
    'cómo se llama tu escuela', 'como se llama tu escuela',
    'en qué secundaria vas', 'en que secundaria vas',
    'en qué primaria vas', 'en que primaria vas',
    'a qué hora sales de la escuela', 'a que hora sales de la escuela',
    'a qué hora sales', 'a que hora sales',
    'cuál es tu horario', 'cual es tu horario',
    'vives cerca de', 'queda cerca de tu casa', 'por dónde queda tu casa', 'por donde queda tu casa',
    'mándame tu ubicación', 'mandame tu ubicacion',
    'pasa tu ubicación', 'pasa tu ubicacion',
    'pasa tu ubi', 'pasa ubi', 'manda tu ubi', 'manda ubi',
    'ubicación en tiempo real', 'ubicacion en tiempo real',
    'pasa ubicación actual', 'pasa ubicacion actual',
    'dónde estás ahorita', 'donde estas ahorita', 'dond stas',
    'estás solo en tu casa', 'estas solo en tu casa',
    'estás sola en tu casa', 'estas sola en tu casa',
    'estás solo', 'estas solo', 'estás sola', 'estas sola',
    'están tus papás contigo', 'estan tus papas contigo',
    'están tus papás en casa', 'estan tus papas en casa',
    'a qué hora llegan tus papás', 'a que hora llegan tus papas',
    'cuándo te quedas solo', 'cuando te quedas solo',
    'te quedas solo en casa',

    // Convocatoria a cita o encuentro físico fuera de supervisión
    'vamos a vernos en persona', 'quiero verte en persona',
    'nos vemos en persona', 'te quiero ver en persona',
    't kiero ver', 't quiero ver', 'kiero verte',
    'nos vemos en el parque', 'te veo en el parque',
    'te espero en el parque', 'vamos al parque',
    'nos vemos en el centro', 'nos vemos en la plaza',
    'nos vemos en el oxxo', 'te espero en la esquina', 'nos vemos en la esquina',
    'te paso a recoger', 'te paso a buscar', 'yo paso por ti', 'voy por ti',
    'te recojo en mi carro', 'te recojo en mi moto', 'te recojo en una troca',
    'te espero afuera de tu escuela', 'te espero a la salida', 'te voy a ver a tu escuela',
    'sálte de tu casa', 'salte de tu casa',
    'salte sin que te vean', 'salte por la ventana',
    'escápate de tu casa', 'escapate de tu casa',
    'escápate al rato', 'escapate al rato',
    'escápate un rato', 'escapate un rato',
    'vente conmigo', 'vamos a dar una vuelta', 'vamos a dar la vuelta',
    'súbete al carro', 'subete al carro',
    'te invito a comer', 'te compro lo que quieras', 'te voy a comprar ropa',
    'tengo un regalo para ti ven por él', 'tengo un regalo para ti ven por el',
    'tengo una sorpresa para ti ven a verla',
    'ven solo', 'ven sola', 'no lleves a nadie',
    'sin que te acompañen', 'sin que te acompanen', 'ven sin tus amigos',
    'te mando un uber', 'te pido un didi', 'te pido un taxi', 'te mando un carro',
  ],

  estafa_financiera: [
    // Monedas virtuales de videojuegos (Roblox, Fortnite, Free Fire)
    'robux gratis', 'te regalo robux', 'te doy robux',
    'quieres robux gratis', 'kieres robux', 'kieres robux gratis',
    'te paso robux si me das tu cuenta', 'te recargo robux',
    'generador de robux', 'robux sin pagar',
    'te regalo pavos', 'pavos gratis', 'te doy pavos',
    'diamantes gratis', 'te regalo diamantes',
    'pasa tu cuenta de roblox', 'dame tu cuenta de roblox',
    'préstame tu cuenta de roblox', 'prestame tu cuenta de roblox',
    'te voy a chetar la cuenta', 'te subo de nivel la cuenta', 'cuenta chetada',
    'te regalo una cuenta con robux', 'te regalo skins', 'te compro un gamepass',
    'pasa tus datos para recargarte', 'pasa tu usuario y clave para los robux',

    // Extracción de contraseñas, PIN y códigos de autenticación
    'dame la clave de tu cuenta', 'dame tu contraseña', 'dame tu contrasena',
    'pasa tu contraseña', 'pasa tu contrasena', 'pasa tu pass',
    'cuál es tu contraseña', 'cual es tu contrasena',
    'dame tu password', 'pasa tu contraseña y correo', 'pasa tu contrasena y correo',
    'código de verificación', 'codigo de verificacion',
    'mándame el código que te llegó', 'mandame el codigo que te llego',
    'pásame el código por sms', 'pasame el codigo por sms',
    'pásame el código de 6 dígitos', 'pasame el codigo de 6 digitos',
    'código de seguridad', 'codigo de seguridad',
    'número de confirmación', 'numero de confirmacion',
    'para no perder tu cuenta dame el código', 'para no perder tu cuenta dame el codigo',
    'verificar tu cuenta con este código', 'verificar tu cuenta con este codigo',
    'dame tu pin de seguridad', 'pasa el pin',

    // Datos bancarios familiares y extorsión financiera
    'tómale foto a la tarjeta de tu papá', 'tomale foto a la tarjeta de tu papa',
    'tómale foto a la tarjeta de tu mamá', 'tomale foto a la tarjeta de tu mama',
    'foto a la tarjeta de crédito', 'foto a la tarjeta de credito',
    'foto a la tarjeta de débito', 'foto a la tarjeta de debito',
    'foto a la tarjeta de tus papás', 'foto a la tarjeta de tus papas',
    'los números de la tarjeta de tus papás', 'los numeros de la tarjeta de tus papas',
    'los 16 números de la tarjeta', 'los 16 numeros de la tarjeta',
    'los 3 números de atrás de la tarjeta', 'los 3 numeros de atras de la tarjeta',
    'código cvv de la tarjeta', 'codigo cvv de la tarjeta',
    'código cvv', 'codigo cvv',
    'fecha de vencimiento de la tarjeta', 'agarra la tarjeta de tus papás', 'agarra la tarjeta de tus papas',
    'hazme una transferencia', 'transfiere a esta cuenta',
    'haz un depósito', 'haz un deposito',
    've al oxxo y deposita', 'deposita en el oxxo',
    'haz una recarga a este número', 'haz una recarga a este numero',
    'dame dinero o le digo a tus papás', 'dame dinero o le digo a tus papas',
    'si no me pagas publico tus fotos', 'págame o le digo a todos', 'pagame o le digo a todos',
  ],
}

// Lista aplanada de todas las frases registradas en el diccionario
export const RISK_PHRASES: string[] = Object.values(RISK_DICTIONARY).flat()

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Se compila una sola vez: frase original (con acentos, para mostrarla) + categoría + regex de palabra completa.
// Soporta saltos de línea y múltiples espacios entre palabras para tolerar formatos OCR.
export const RISK_MATCHERS: RiskMatcher[] = (() => {
  const seen = new Set<string>()
  const matchers: RiskMatcher[] = []

  for (const [category, phrases] of Object.entries(RISK_DICTIONARY) as [RiskCategory, string[]][]) {
    for (const phrase of phrases) {
      const key = normalize(phrase).trim()
      if (!key || seen.has(key)) continue
      seen.add(key)
      // Permitir que los espacios en frases coincidan con cualquier espacio en blanco o salto de línea OCR (\s+)
      const pattern = escapeRegex(key).replace(/\s+/g, '\\s+')
      matchers.push({
        phrase,
        category,
        regex: new RegExp(`(?<![a-z0-9])${pattern}(?![a-z0-9])`, 'g'),
      })
    }
  }

  return matchers
})()

export function detectRiskPhrases(transcription: string): {
  detected: boolean
  phrases: string[]
  categories: RiskCategory[]
} {
  const text = normalize(transcription)

  const matches: { phrase: string; category: RiskCategory; start: number; end: number }[] = []
  for (const { phrase, category, regex } of RISK_MATCHERS) {
    regex.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = regex.exec(text)) !== null) {
      matches.push({ phrase, category, start: m.index, end: m.index + m[0].length })
    }
  }

  // Descarta las coincidencias contenidas dentro de otra más larga
  // (p. ej. "dinero" dentro de "quieres ganar dinero fácil").
  const kept = matches.filter(
    (a) => !matches.some((b) => b !== a && b.start <= a.start && b.end >= a.end && b.end - b.start > a.end - a.start)
  )

  // Únicas, en el orden en que aparecen en el audio o texto.
  const phrases = Array.from(
    new Map(kept.sort((a, b) => a.start - b.start).map((m) => [m.phrase, m.phrase])).values()
  )

  // Categorías presentes en las coincidencias filtradas.
  const categories = Array.from(
    new Set(kept.map((m) => m.category))
  )

  return { detected: phrases.length > 0, phrases, categories }
}
