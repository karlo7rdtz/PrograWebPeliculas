// Cada fila contiene:
// identificador, título, año de estreno, géneros y sinopsis.

const peliculas = [
  [
    "scream",
    "Scream",
    1996,
    ["Terror", "Thriller"],
    "Un asesino enmascarado amenaza a los jóvenes de Woodsboro. Sidney Prescott intenta descubrir quién se oculta detrás de los ataques antes de convertirse en su próxima víctima.",
  ],
  [
    "whiplash",
    "Whiplash",
    2014,
    ["Drama"],
    "Un joven baterista ingresa a una exigente escuela de música. Su relación con un profesor obsesionado con la perfección pone a prueba sus límites y su ambición.",
  ],
  [
    "past-lives",
    "Past Lives",
    2023,
    ["Romance", "Drama"],
    "Dos amigos de la infancia vuelven a encontrarse después de muchos años. Su reunión los lleva a reflexionar sobre el destino, las decisiones y las vidas que pudieron compartir.",
  ],
  [
    "paprika",
    "Paprika",
    2006,
    ["Animación", "Ciencia ficción", "Thriller"],
    "Una tecnología permite entrar en los sueños de otras personas. Cuando el dispositivo cae en manos equivocadas, la frontera entre los sueños y la realidad comienza a desaparecer.",
  ],
  [
    "fallen-angels",
    "Fallen Angels",
    1995,
    ["Drama", "Romance", "Crimen"],
    "En las noches de Hong Kong se cruzan las historias de un asesino, su colaboradora y un joven solitario. Sus encuentros revelan deseos, distancias y conexiones inesperadas.",
  ],
  [
    "nosferatu",
    "Nosferatu",
    2024,
    ["Terror", "Fantasía"],
    "Una joven atormentada queda vinculada a una presencia vampírica. La obsesión del conde Orlok extiende el miedo y la desgracia sobre quienes la rodean.",
  ],
  [
    "fantastico-senor-zorro",
    "El fantástico señor Zorro",
    2009,
    ["Animación", "Comedia", "Aventura"],
    "El señor Zorro vuelve a sus antiguas costumbres y provoca la furia de tres granjeros. Para proteger a su familia, deberá reunir el ingenio de toda su comunidad.",
  ],
  [
    "donnie-darko",
    "Donnie Darko",
    2001,
    ["Ciencia ficción", "Thriller", "Drama"],
    "Un adolescente comienza a experimentar visiones de una figura con traje de conejo. Sus advertencias lo conducen hacia una inquietante cadena de sucesos.",
  ],
  [
    "shrek2",
    "Shrek 2",
    2004,
    ["Animación", "Comedia", "Fantasía", "Aventura"],
    "Shrek, Fiona y Burro viajan a Muy Muy Lejano para conocer a los padres de Fiona. La visita se complica cuando el rey conoce a su yerno y el Hada Madrina interviene en sus vidas.",
  ],
  [
    "macario",
    "Macario",
    1960,
    ["Fantasía", "Drama"],
    "Un humilde leñador desea disfrutar de una comida sin compartirla. Su encuentro con la Muerte le concede un don extraordinario que transformará su destino.",
  ],
  [
    "scott-pilgrim",
    "Scott Pilgrim vs. los ex de la chica de sus sueños",
    2010,
    ["Acción", "Comedia", "Romance"],
    "Scott se enamora de Ramona Flowers, pero iniciar una relación con ella implica enfrentar a sus siete malvados ex. Música, romance y combates se mezclan en su aventura.",
  ],
  [
    "supercool",
    "Supercool",
    2007,
    ["Comedia"],
    "Dos amigos quieren cerrar su etapa de preparatoria con una gran fiesta. Conseguir lo necesario para asistir se convierte en una noche de enredos y decisiones absurdas.",
  ],
  [
    "perfect-blue",
    "Perfect Blue",
    1997,
    ["Animación", "Thriller", "Drama"],
    "Una cantante deja su grupo para comenzar una carrera como actriz. La presión, el acoso y una serie de sucesos inquietantes empiezan a alterar su percepción de la realidad.",
  ],
  [
    "isla-de-perros",
    "Isla de perros",
    2018,
    ["Animación", "Aventura", "Comedia"],
    "Un niño llega a una isla donde han sido desterrados los perros de su ciudad. Acompañado por una peculiar manada, emprende la búsqueda de su mascota.",
  ],
  [
    "the-return-of-the-living-dead",
    "The Return of the Living Dead",
    1985,
    ["Terror", "Comedia"],
    "Un accidente libera una sustancia capaz de reanimar a los muertos. Los trabajadores de un almacén y un grupo de jóvenes intentan sobrevivir al caos que se desata.",
  ],
  [
    "el-resplandor",
    "El resplandor",
    1980,
    ["Terror", "Thriller"],
    "Una familia pasa el invierno aislada en el hotel Overlook. Mientras el padre se vuelve cada vez más inestable, su hijo percibe las oscuras presencias del lugar.",
  ],
  [
    "twilight",
    "Twilight",
    2008,
    ["Romance", "Fantasía"],
    "Bella Swan se muda a Forks y conoce a Edward Cullen. Su atracción la acerca a un secreto sobrenatural y a peligros que no imaginaba.",
  ],
  [
    "dead-poets-society",
    "Dead Poets Society",
    1989,
    ["Drama"],
    "Un profesor de literatura inspira a sus alumnos a pensar por sí mismos. Sus enseñanzas despiertan sueños y conflictos dentro de una escuela de tradiciones rígidas.",
  ],
  [
    "mean-girls",
    "Mean Girls",
    2004,
    ["Comedia"],
    "Cady llega por primera vez a una preparatoria y se acerca al grupo más popular. Pronto descubre que encajar en sus reglas puede cambiarla más de lo que esperaba.",
  ],
  [
    "sonrie",
    "Sonríe",
    2022,
    ["Terror", "Thriller"],
    "Después de presenciar un incidente perturbador, una psiquiatra comienza a experimentar sucesos inexplicables. Una presencia asociada a una sonrisa parece seguirla.",
  ],
  [
    "hereditary",
    "Hereditary",
    2018,
    ["Terror", "Drama"],
    "Tras la muerte de la matriarca, una familia descubre señales de una herencia siniestra. El duelo y los secretos los arrastran hacia acontecimientos cada vez más aterradores.",
  ],
  [
    "carrie",
    "Carrie",
    1976,
    ["Terror", "Drama"],
    "Una adolescente sometida al acoso escolar y al control de su madre descubre poderes telequinéticos. Una humillación durante el baile escolar desencadena consecuencias terribles.",
  ],
  [
    "senales",
    "Señales",
    2002,
    ["Ciencia ficción", "Thriller"],
    "Una familia encuentra extrañas figuras en sus campos de maíz. Los sucesos que siguen ponen a prueba su unión y su manera de interpretar lo desconocido.",
  ],
  [
    "akira",
    "Akira",
    1988,
    ["Animación", "Ciencia ficción", "Acción"],
    "En Neo-Tokio, un joven desarrolla poderes después de un encuentro con un experimento secreto. Su amigo intenta salvarlo mientras la ciudad se acerca al desastre.",
  ],
  [
    "destino-final",
    "Destino final",
    2000,
    ["Terror", "Thriller"],
    "Una premonición permite que varios pasajeros eviten una tragedia aérea. Sin embargo, pronto descubren que escapar una vez no significa estar a salvo.",
  ],
  [
    "the-craft",
    "The Craft",
    1996,
    ["Terror", "Fantasía"],
    "Una estudiante se une a tres compañeras interesadas en la brujería. Cuando sus rituales comienzan a funcionar, el poder amenaza con romper su amistad.",
  ],
  [
    "megamente",
    "Megamente",
    2010,
    ["Animación", "Comedia", "Acción"],
    "Un supervillano logra derrotar a su gran rival y descubre que su vida ha perdido sentido. La creación de un nuevo héroe lo obliga a reconsiderar quién quiere ser.",
  ],
  [
    "midsommar",
    "Midsommar",
    2019,
    ["Terror", "Drama"],
    "Una pareja viaja con sus amigos a una comunidad sueca para participar en una celebración. Bajo la luz constante del verano, las tradiciones revelan un lado inquietante.",
  ],
  [
    "perdida",
    "Perdida",
    2014,
    ["Thriller", "Drama", "Crimen"],
    "La desaparición de Amy convierte a su esposo en el centro de una investigación y del interés mediático. Las apariencias de su matrimonio comienzan a desmoronarse.",
  ],
  [
    "pacific-rim",
    "Pacific Rim",
    2013,
    ["Ciencia ficción", "Acción", "Aventura"],
    "La humanidad combate a criaturas gigantes mediante robots pilotados en pareja. Un antiguo piloto y una nueva compañera se unen a una misión decisiva.",
  ],
];

const series = [
  [
    "avatar",
    "Avatar: The Last Airbender",
    2005,
    ["Animación", "Fantasía", "Aventura"],
    "Aang despierta en un mundo marcado por la guerra. Con ayuda de sus amigos, debe dominar los cuatro elementos y asumir su responsabilidad como Avatar.",
  ],
  [
    "invincible",
    "Invincible",
    2021,
    ["Animación", "Acción", "Ciencia ficción"],
    "Mark Grayson comienza a desarrollar superpoderes y quiere seguir los pasos de su padre. Su formación como héroe pronto revela una realidad mucho más compleja.",
  ],
  [
    "malcolm",
    "Malcolm el de en medio",
    2000,
    ["Comedia"],
    "Un niño de inteligencia excepcional intenta sobrevivir a los problemas de su peculiar familia. La escuela, sus hermanos y sus padres convierten cada día en un desafío.",
  ],
  [
    "mob-psycho",
    "Mob Psycho 100",
    2016,
    ["Animación", "Acción", "Comedia"],
    "Un adolescente con enormes poderes psíquicos busca una vida normal. Mientras aprende a expresar sus emociones, enfrenta espíritus y personas que quieren aprovecharse de él.",
  ],
  [
    "evangelion",
    "Neon Genesis Evangelion",
    1995,
    ["Animación", "Ciencia ficción", "Drama"],
    "Shinji es llamado a pilotar un Evangelion para combatir misteriosas amenazas. Su misión lo enfrenta tanto a los enemigos como a sus propios conflictos.",
  ],
  [
    "south-park",
    "South Park",
    1997,
    ["Animación", "Comedia"],
    "Cuatro niños viven situaciones absurdas en un pequeño pueblo de Colorado. Sus aventuras satirizan la cultura, la política y los conflictos de la vida cotidiana.",
  ],
  [
    "rick-y-morty",
    "Rick y Morty",
    2013,
    ["Animación", "Ciencia ficción", "Comedia"],
    "Un científico impredecible arrastra a su nieto a viajes por mundos y dimensiones. Sus experimentos alteran constantemente la vida de toda la familia.",
  ],
  [
    "un-show-mas",
    "Un show más",
    2010,
    ["Animación", "Comedia", "Fantasía"],
    "Mordecai y Rigby trabajan en un parque y buscan cualquier excusa para divertirse. Sus decisiones suelen convertir tareas simples en aventuras extraordinarias.",
  ],
  [
    "monster",
    "Monster",
    2004,
    ["Animación", "Thriller", "Crimen"],
    "Un cirujano salva la vida de un niño y años después descubre las consecuencias de aquella decisión. Su búsqueda de la verdad lo lleva tras un peligroso asesino.",
  ],
  [
    "hora-de-aventura",
    "Hora de aventura",
    2010,
    ["Animación", "Fantasía", "Aventura"],
    "Finn y Jake recorren la Tierra de Ooo ayudando a sus habitantes. Entre criaturas extrañas y reinos fantásticos, descubren secretos de su mundo y de sí mismos.",
  ],
  [
    "better-call-saul",
    "Better Call Saul",
    2015,
    ["Drama", "Crimen"],
    "Jimmy McGill intenta abrirse camino como abogado. Sus decisiones personales y profesionales lo acercan poco a poco a la identidad de Saul Goodman.",
  ],
  [
    "breaking-bad",
    "Breaking Bad",
    2008,
    ["Drama", "Crimen", "Thriller"],
    "Un profesor de química comienza a fabricar drogas después de recibir un diagnóstico devastador. Su alianza con un antiguo alumno transforma su vida y la de su familia.",
  ],
  [
    "the-office",
    "The Office",
    2005,
    ["Comedia"],
    "Un equipo de oficina es seguido por cámaras que documentan su rutina. Las ocurrencias de su jefe y las relaciones entre compañeros convierten el trabajo en una comedia cotidiana.",
  ],
  [
    "mas-alla-del-jardin",
    "Más allá del jardín",
    2014,
    ["Animación", "Fantasía", "Aventura"],
    "Dos hermanos se pierden en un bosque misterioso e intentan regresar a casa. En su camino encuentran personajes extraños y una presencia que los acecha.",
  ],
  [
    "arcane",
    "Arcane",
    2021,
    ["Animación", "Acción", "Fantasía"],
    "Dos hermanas quedan enfrentadas en un conflicto entre ciudades divididas por la desigualdad. La tecnología y la ambición transforman sus destinos.",
  ],
  [
    "death-note",
    "Death Note",
    2006,
    ["Animación", "Thriller", "Fantasía"],
    "Un estudiante encuentra una libreta capaz de provocar la muerte de las personas cuyos nombres escribe. Su idea de justicia inicia un duelo con un brillante investigador.",
  ],
  [
    "hunter-x-hunter",
    "Hunter x Hunter",
    2011,
    ["Animación", "Acción", "Aventura"],
    "Gon decide convertirse en cazador para encontrar a su padre. Durante el viaje forma amistades y enfrenta pruebas que revelan un mundo tan fascinante como peligroso.",
  ],
  [
    "shingeki",
    "Shingeki no Kyojin",
    2013,
    ["Animación", "Acción", "Drama"],
    "La humanidad vive protegida por enormes murallas frente a los titanes. Tras una devastadora invasión, un grupo de jóvenes se une a la lucha y descubre secretos sobre su mundo.",
  ],
  [
    "the-boys",
    "The Boys",
    2019,
    ["Acción", "Ciencia ficción", "Drama"],
    "Un grupo intenta exponer a los superhéroes que abusan de su poder. Su enfrentamiento con una poderosa corporación revela el lado oscuro de la fama y la influencia.",
  ],
  [
    "el-mentalista",
    "El mentalista",
    2008,
    ["Crimen", "Drama", "Thriller"],
    "Patrick Jane utiliza su capacidad de observación para colaborar en investigaciones criminales. Mientras resuelve casos, persigue al responsable de una tragedia personal.",
  ],

  [
    "avatar-pelicula",
    "Avatar: El último maestro aire",
    2026,
    ["Animación", "Fantasía", "Aventura"],
    "Una aventura de Aang en el mundo de los cuatro elementos.",
  ],

];
// Excepciones: nombres de imágenes diferentes al identificador.
// Los títulos que no aparecen aquí usan automáticamente:
// posters/identificador.jpg y fondos/identificador.jpg

const archivosImagenes = {
  // PELÍCULAS

  "avatar-pelicula": {
    poster: "EMA.jpg",
    fondo: "avatar-aang.jpg",
  },

  "scream": {
    poster: "scream.jpg",
    fondo: "scream.jpg",
  },

  "whiplash": {
    poster: "wiplash.jpg",
    fondo: "wiplash.jpg",
  },

  "past-lives": {
    poster: "past-lives.jpg",
    fondo: "past-lives.jpg",
  },

  "paprika": {
    poster: "paprika.jpg",
    fondo: "paprika.jpg",
  },

  "fallen-angels": {
    poster: "fallen-angels.jpg",
    fondo: "FALLEN-ANGELS.jpg",
  },

  "nosferatu": {
    poster: "nosferatu.jpg",
    fondo: "nosferatu.jpg",
  },

  "fantastico-senor-zorro": {
    poster: "fantastico-senor-zorro.jpg",
    fondo: "EL-FANTASTICO-SEÑOR-ZORRO.jpg",
  },

  "donnie-darko": {
    poster: "donnie-darko.jpg",
    fondo: "donnie-darko.jpg",
  },

  "shrek2": {
    poster: "shrek2.jpg",
    fondo: "shrek2.jpg",
  },

  "macario": {
    poster: "macario.jpg",
    fondo: "macario.jpg",
  },

  "scott-pilgrim": {
    poster: "scott-pilgrim.jpg",
    fondo: "scott-pilgrim.jpg",
  },

  "supercool": {
    poster: "supercool.jpg",
    fondo: "supercool.jpg",
  },

  "perfect-blue": {
    poster: "perfect-blue.jpg",
    fondo: "perfect-blue.jpg",
  },

  "isla-de-perros": {
    poster: "isla-de-perros.jpg",
    fondo: "isla-de-perros.jpg",
  },

  "the-return-of-the-living-dead": {
    poster: "TROTLD.jpg",
    fondo: "TROTLD.jpg",
  },

  "el-resplandor": {
    poster: "el-resplandor.jpg",
    fondo: "el-resplandor.jpg",
  },

  "twilight": {
    poster: "twilight.jpg",
    fondo: "twilight.jpg",
  },

  "dead-poets-society": {
    poster: "DPS.jpg",
    fondo: "dps.jpg",
  },

  "mean-girls": {
    poster: "mean-girls.jpg",
    fondo: "mean-girls.jpg",
  },

  "sonrie": {
    poster: "smile.jpg",
    fondo: "smiles.jpg",
  },

  "hereditary": {
    poster: "hereditary.jpg",
    fondo: "HEREDITARY.jpg",
  },

  "carrie": {
    poster: "CARRIE.jpg",
    fondo: "carrie.jpg",
  },

  "senales": {
    poster: "senales.jpg",
    fondo: "senales.jpg",
  },

  "akira": {
    poster: "akira.jpg",
    fondo: "akira.jpg",
  },

  "destino-final": {
    poster: "DF.jpg",
    fondo: "DF.jpg",
  },

  "the-craft": {
    poster: "the craft.jpg",
    fondo: "the-craft.jpg",
  },

  "megamente": {
    poster: "megamente.jpg",
    fondo: "megamente.jpg",
  },

  "midsommar": {
    poster: "midsommar.jpg",
    fondo: "MIDDSOMMAR.jpg",
  },

  "perdida": {
    poster: "perdida.jpg",
    fondo: "perdida.jpg",
  },

  "pacific-rim": {
    poster: "PR.jpg",
    fondo: "PR.jpg",
  },

  // SERIES

  "avatar": {
    poster: "ATLA.jpg",
    fondo: "ATLA.jpg",
  },

  "invincible": {
    poster: "INVINCIBLE.jpg",
    fondo: "invincible.jpg",
  },

  "malcolm": {
    poster: "malcolm.jpg",
    fondo: "malcolm.jpg",
  },

  "mob-psycho": {
    poster: "mob.jpg",
    fondo: "mob.jpg",
  },

  "evangelion": {
    poster: "evangelion.jpg",
    fondo: "EVANGELION.jpg",
  },

  "south-park": {
    poster: "SP.jpg",
    fondo: "sp.jpg",
  },

  "rick-y-morty": {
    poster: "rick-and-morty.jpg",
    fondo: "rick-and-morty.jpg",
  },

  "un-show-mas": {
    poster: "un-show-mas.jpg",
    fondo: "un-show-mas.jpg",
  },

  "monster": {
    poster: "monster.jpg",
    fondo: "monster.jpg",
  },

  "hora-de-aventura": {
    poster: "hora-de-aventura.jpg",
    fondo: "hora-de-aventura.jpg",
  },

  "better-call-saul": {
    poster: "BCS.jpg",
    fondo: "BCS.jpg",
  },

  "breaking-bad": {
    poster: "breaking-bad.jpg",
    fondo: "breaking-bad.jpg",
  },

  "the-office": {
    poster: "the-office.jpg",
    fondo: "the-office.jpg",
  },

  "mas-alla-del-jardin": {
    poster: "MADJ.jpg",
    fondo: "MADJ.jpg",
  },

  "arcane": {
    poster: "ARCANE.jpg",
    fondo: "arcane.jpg",
  },

  "death-note": {
    poster: "dn.jpg",
    fondo: "dn.jpg",
  },

  "hunter-x-hunter": {
    poster: "hxh.jpg",
    fondo: "hxh.jpg",
  },

  "shingeki": {
    poster: "SNK.jpg",
    fondo: "snk.jpg",
  },

  "the-boys": {
    poster: "THE-BOYS.jpg",
    fondo: "the-boys.jpg",
  },

  "el-mentalista": {
    poster: "el-mentalista.jpg",
    fondo: "el-mentalista.jpg",
  },

  "korra": {
    poster: "TLOK.jpg",
    fondo: "tlok.jpg",
  },

  "final-space": {
    poster: "final-space.jpg",
    fondo: "FINAL-SPACE.jpg",
  },

  "the-midnight-gospel": {
    poster: "MG.jpg",
    fondo: "MG.jpg",
  },

  "bojack-horseman": {
    poster: "bojack-horsemna.jpg",
    fondo: "bojack-horsemna.jpg",
  },
};

function rutaImagen(carpeta, archivo) {
  return `/imagenes/${carpeta}/${encodeURIComponent(archivo)}`;
}

function crearContenido(fila, tipo) {
  const [id, titulo, anio, generos, sinopsis] = fila;

  const archivos = archivosImagenes[id] ?? {
    poster: `${id}.jpg`,
    fondo: `${id}.jpg`,
  };

  return {
    id,
    titulo,
    anio,
    tipo,
    generos,
    sinopsis,

    calificacionGeneral: null,
    fuenteCalificacion: "",

    poster: rutaImagen("posters", archivos.poster),
    fondo: rutaImagen("fondos", archivos.fondo),
  };
}

export const catalogo = [
  ...peliculas.map((fila) => crearContenido(fila, "Película")),
  ...series.map((fila) => crearContenido(fila, "Serie")),
];