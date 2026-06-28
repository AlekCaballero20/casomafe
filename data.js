/*
  DATA EDITABLE DEL CASO MAFE
  ------------------------------------------------------------
  Cambien aquí preguntas, respuestas, pistas, premios y frases.
  No necesitan tocar index.html si solo quieren personalizar contenido.
*/

window.MAFE_CASE_DATA = {
  profile: {
    nombreCompleto: "María Fernanda Leal Pulido",
    alias: "Mafe",
    nacimiento: "24 de junio de 1967",
    expediente: "24/06/67",
    edad2026: "59 años",
    rol: "Detective principal, homenajeada y centro del expediente",
    especialidad: "Detectar cuando algo no cuadra antes de que los demás acepten que algo no cuadra.",
    superpoder: "Observar, cuidar, intuir y sostener sin hacer tanta bulla.",
    fraseExpediente: "Una persona puede ser hogar, memoria y brújula al mismo tiempo."
  },

  accessCodes: ["240667", "24061967", "24/06/67", "2406"],

  menuRooms: [
    { id: "escape", icon: "🧩", title: "Las 6 llaves de Mafe", description: "Escape Room físico + app para desbloquear el homenaje final." },
    { id: "quiz", icon: "🕵️‍♀️", title: "¿Quién conoce más a Mafe?", description: "Quiz familiar con puntaje y resultado detectivesco." },
    { id: "ruleta", icon: "🎲", title: "Ruleta de interrogatorio", description: "Preguntas para compartir recuerdos y risas." },
    { id: "detecta", icon: "🔍", title: "Mafe Detecta", description: "Mini reto de memoria visual y atención al detalle." },
    { id: "archivo", icon: "📁", title: "Archivo confidencial", description: "Ficha de Mafe y galería de evidencias." },
    { id: "oraculo", icon: "✨", title: "Oráculo de Mafe", description: "Frases sabias, familiares y ligeramente peligrosas." },
    { id: "awards", icon: "🏆", title: "Mafe Awards", description: "Premios para leer en voz alta durante la reunión." },
    { id: "responde", icon: "🎙️", title: "Mafe responde", description: "Preguntas para que ella cuente historias." },
    { id: "final", icon: "💌", title: "Caso resuelto", description: "Veredicto final y carta de cierre." }
  ],

  escapeRooms: [
    {
      id: "llave-1",
      number: "001",
      title: "La fecha secreta",
      location: "Entrada o puerta principal",
      physicalObject: "Un sobre con sello de 'Archivo familiar confidencial'.",
      digitalClue: "Todo expediente tiene un origen. Este caso empezó el día en que nació la detective principal.",
      task: "Encuentren el sobre de bienvenida y lean la primera evidencia en voz alta.",
      hiddenCard: "La llave del inicio está en la fecha abreviada del expediente: día, mes y año.",
      hints: ["Piensen en el origen del expediente.", "La respuesta tiene seis números y representa una fecha."],
      code: "240667",
      reward: "Se abre oficialmente el expediente Mafe."
    },
    {
      id: "llave-2",
      number: "002",
      title: "El lugar donde se conversa",
      location: "Cocina, cafetera o mesa donde tomen algo",
      physicalObject: "Una taza, café, aromática o algo que invite a conversar.",
      digitalClue: "Donde hay algo caliente para tomar, casi siempre aparece una verdad familiar.",
      task: "Cada persona debe decir una palabra que asocie con Mafe antes de abrir la tarjeta escondida.",
      hiddenCard: "La respuesta es el lugar emocional al que todos vuelven cuando necesitan compañía.",
      hints: ["No es una habitación: es un vínculo.", "Es el grupo al que pertenecemos y al que siempre volvemos."],
      code: "FAMILIA",
      reward: "Se desbloquea la sala de interrogatorio familiar."
    },
    {
      id: "llave-3",
      number: "003",
      title: "La mirada que investiga",
      location: "Sala, sofá o lugar donde ella suele observar todo",
      physicalObject: "Una lupa de juguete, gafas, foto o una nota pegada detrás de un cojín.",
      digitalClue: "Hay personas que no necesitan preguntar mucho para saber que algo raro pasa.",
      task: "Alguien debe imitar con cariño la mirada de Mafe cuando sospecha algo.",
      hiddenCard: "Profesión simbólica de quien nota detalles, encuentra pistas y no se deja meter cuento.",
      hints: ["Busquen una palabra relacionada con investigar.", "Es alguien que observa pistas y resuelve casos."],
      code: "DETECTIVE",
      reward: "Se desbloquea el reto Mafe Detecta."
    },
    {
      id: "llave-4",
      number: "004",
      title: "El archivo de los recuerdos",
      location: "Álbum, mesa con fotos, portarretrato o celular con fotos",
      physicalObject: "Tres fotos o papelitos con recuerdos familiares.",
      digitalClue: "La memoria no vive solo en las fotos. Vive en lo que alguien todavía cuenta con brillo en los ojos.",
      task: "Elijan una foto o recuerdo y cuenten qué estaba pasando ese día.",
      hiddenCard: "La clave es aquello que queda cuando pasa el tiempo y todavía nos importa.",
      hints: ["No es el objeto: es lo que conserva en nosotros.", "Es algo del pasado que podemos volver a contar."],
      code: "RECUERDO",
      reward: "Se desbloquea la galería de evidencias."
    },
    {
      id: "llave-5",
      number: "005",
      title: "El rincón de la intuición",
      location: "Planta, ventana, jardín, balcón o lugar tranquilo",
      physicalObject: "Una flor, hoja, piedra bonita o tarjeta escondida en una matera.",
      digitalClue: "No todo se resuelve pensando. A veces el cuerpo ya sabe antes de que la mente arme el informe.",
      task: "Mafe responde: ¿qué le ha enseñado su intuición en la vida?",
      hiddenCard: "La respuesta es una palabra corta, su alias familiar, el nombre que todos dicen con cariño.",
      hints: ["La clave es una persona.", "Es el nombre corto de la protagonista de este caso."],
      code: "MAFE",
      reward: "Se desbloquea la entrevista viva."
    },
    {
      id: "llave-6",
      number: "006",
      title: "La última vuelta al sol",
      location: "Cerca de la torta, mesa final o regalo",
      physicalObject: "Una tarjeta final junto a la torta o el regalo.",
      digitalClue: "En 2026, el expediente cumple una nueva vuelta al sol. El número final abre el veredicto.",
      task: "Antes de escribir la clave, cada persona le dice a Mafe una frase de gratitud.",
      hiddenCard: "Nacida en 1967. En 2026 celebra este número de años.",
      hints: ["La última clave es un número.", "Calculen cuántos años cumple en 2026 si nació en 1967."],
      code: "59",
      reward: "Se desbloquea el veredicto final."
    }
  ],

  quiz: [
    {
      question: "Si Mafe fuera detective, ¿cuál sería su mayor poder?",
      options: ["Correr detrás del sospechoso", "Leer silencios y notar detalles", "Hackear cámaras de seguridad", "Hacer interrogatorios eternos"],
      answer: 1
    },
    {
      question: "¿Qué describe mejor una escena muy Mafe?",
      options: ["Todo en caos y nadie sabe nada", "Ella mirando en silencio, ya entendió todo", "Ella ignorando por completo el ambiente", "Ella huyendo de la conversación"],
      answer: 1
    },
    {
      question: "¿Cuál sería el nombre de su agencia detectivesca?",
      options: ["Mafe Investiga S.A.S.", "Se veía venir & Asociados", "La intuición no falla", "Todas las anteriores"],
      answer: 3
    },
    {
      question: "¿Qué tipo de regalo suele tener más valor emocional?",
      options: ["Algo carísimo pero impersonal", "Una carta, un detalle pensado o tiempo compartido", "Un manual de instrucciones de lavadora", "Un correo con asunto 'feliz día'"],
      answer: 1
    },
    {
      question: "¿Cuál es el código original del expediente?",
      options: ["010101", "240667", "999999", "BOGOTA"],
      answer: 1
    },
    {
      question: "¿Qué frase podría decir una detective como Mafe?",
      options: ["No noté nada", "Eso se veía raro desde el principio", "Yo no observo detalles", "Da igual, no investiguemos"],
      answer: 1
    },
    {
      question: "¿Qué necesita un buen caso familiar?",
      options: ["Pistas, recuerdos y alguien que pregunte bien", "Solo WiFi", "Una reunión con acta", "Un Excel con macros"],
      answer: 0
    },
    {
      question: "¿Cuál sería el final correcto de este caso?",
      options: ["Todos se van sin decir nada", "Mafe recibe un homenaje, risas y abrazos", "Se imprime un comparendo familiar", "Se borra el expediente"],
      answer: 1
    }
  ],

  scoreLabels: [
    { min: 0, max: 2, title: "Testigo poco confiable", text: "Toca observar más. Mafe probablemente ya lo sabía." },
    { min: 3, max: 4, title: "Sospechoso con potencial", text: "Hay intuición, pero falta archivo familiar." },
    { min: 5, max: 6, title: "Investigador familiar", text: "Buen nivel. Ya puedes portar lupa simbólica." },
    { min: 7, max: 8, title: "Agente autorizado del Clan Mafe", text: "Conoces el expediente. Mafe puede fingir sorpresa." }
  ],

  roulette: [
    "Cuenta un recuerdo bonito con Mafe.",
    "Di una frase que te recuerde a Mafe.",
    "¿Qué cosa admiras de ella y casi nunca dices?",
    "¿Qué momento demuestra que Mafe tiene intuición de detective?",
    "¿Qué consejo suyo te ha servido?",
    "Si Mafe fuera personaje de película, ¿cómo se llamaría la película?",
    "¿Qué detalle de ella pasa desapercibido pero vale oro?",
    "¿Qué comida, olor o lugar te recuerda a ella?",
    "Dile algo que quieras agradecerle hoy.",
    "¿Qué caso familiar resolvió antes que todos?",
    "Imita con cariño una reacción muy Mafe.",
    "¿Qué tradición familiar quisieras conservar con ella?"
  ],

  mafeQuestions: [
    "¿Qué consejo le darías a tu yo de 20 años?",
    "¿Qué momento con tu familia guardarías para siempre?",
    "¿Qué sueño todavía quieres vivir?",
    "¿Qué te hace sentir realmente amada?",
    "¿Qué tradición familiar no quisieras que se pierda?",
    "¿Cuál ha sido una de tus mayores fortalezas?",
    "¿Qué aprendiste de una etapa difícil?",
    "¿Qué te gustaría que recordáramos más de ti?",
    "¿Cuál fue una de las mejores decisiones de tu vida?",
    "¿Qué cosa pequeña te hace feliz aunque parezca simple?"
  ],

  oracle: [
    "Eso se veía venir, pero bueno, sigamos investigando.",
    "Primero coma algo y después decide. La mente con hambre acusa inocentes.",
    "Si algo no cuadra, probablemente no cuadra.",
    "Pregunte bien. La mitad de los problemas nacen por asumir, ese deporte nacional.",
    "No deje para última hora lo que puede evitarle un drama familiar.",
    "Observe la cara, no solo las palabras.",
    "El desorden también habla. A veces grita.",
    "Una buena intuición merece respeto, no comité.",
    "El cariño también se demuestra avisando con tiempo.",
    "No todo se resuelve hablando duro. A veces toca escuchar mejor."
  ],

  evidence: [
    { title: "Evidencia 001 · Nacimiento", text: "María Fernanda Leal Pulido nació el 24 de junio de 1967. El expediente comienza ahí." },
    { title: "Evidencia 002 · Alias", text: "Mafe: nombre corto, carga emocional larga." },
    { title: "Evidencia 003 · Intuición", text: "Capacidad notable para detectar cuando algo no cuadra, aunque nadie más haya abierto los ojos." },
    { title: "Evidencia 004 · Hogar", text: "Algunas personas no solo viven en una casa. También hacen que otros sientan que pueden volver." },
    { title: "Evidencia 005 · Memoria", text: "Cada familia tiene una guardiana de historias. En este expediente, varias pistas apuntan a ella." },
    { title: "Evidencia 006 · Fuerza", text: "Hay fuerzas que no hacen ruido, pero sostienen muchísimo." },
    { title: "Evidencia 007 · Risa", text: "Todo caso necesita humor, porque si no la familia se vuelve junta directiva." },
    { title: "Evidencia 008 · Celebración", text: "El objetivo no es escapar de la casa. Es entrar mejor al corazón de quien celebramos." }
  ],

  awards: [
    { title: "Premio a la intuición más precisa", text: "Por saber que algo iba a pasar antes de que los demás terminaran de negarlo." },
    { title: "Premio a la memoria viva", text: "Por guardar historias, fechas, detalles y pequeñas verdades familiares." },
    { title: "Premio a la fuerza silenciosa", text: "Por sostener más de lo que muchas veces se ve." },
    { title: "Premio a la ternura estratégica", text: "Por cuidar incluso cuando finge que no está tan pendiente." },
    { title: "Premio a la detective del hogar", text: "Por notar pistas emocionales, objetos perdidos y cambios mínimos en la escena." }
  ],

  detectaScenes: [
    {
      title: "Mesa de conversación",
      original: ["Taza", "Llaves", "Flor", "Servilleta", "Libro", "Gafas"],
      changed: ["Taza", "Llaves", "Flor", "Libro", "Gafas"],
      answer: "Servilleta"
    },
    {
      title: "Rincón del recuerdo",
      original: ["Foto familiar", "Carta", "Vela", "Chocolate", "Lápiz", "Sobre"],
      changed: ["Foto familiar", "Carta", "Vela", "Chocolate", "Sobre"],
      answer: "Lápiz"
    },
    {
      title: "Escena de detective",
      original: ["Lupa", "Cuaderno", "Cinta roja", "Tarjeta", "Reloj", "Botón"],
      changed: ["Lupa", "Cuaderno", "Cinta roja", "Tarjeta", "Botón"],
      answer: "Reloj"
    }
  ]
};
