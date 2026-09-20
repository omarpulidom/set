/**
 * Curated Mexican gym terminology. English remains the canonical catalog
 * value; this layer only decides what the Spanish UI displays.
 */
const EXERCISE_NAME_ES: Record<string, string> = {
  '0001': 'Abdominal de 3/4',
  '0002': 'Flexión lateral a 45°',
  '0003': 'Bicicleta abdominal',
  '0006': 'Toques alternos de talón',
  '0009': 'Fondos de pecho asistidos de rodillas',
  '0017': 'Dominadas asistidas',
  '0019': 'Fondos de tríceps asistidos de rodillas',
  '0025': 'Press de banca con barra',
  '0027': 'Remo inclinado con barra',
  '0032': 'Peso muerto con barra',
  '0047': 'Press de banca inclinado con barra',
  '0043': 'Sentadilla con barra',
  '0049': 'Remo inclinado con barra',
  '0058': 'Hip thrust con barra',
  '0061': 'Extensión de tríceps acostado con barra',
  '0054': 'Desplante con barra',
  '0085': 'Peso muerto rumano con barra',
  '0117': 'Peso muerto sumo con barra',
  '0130': 'Extensión de cadera en banco',
  '0138': 'Levantamiento de piernas',
  '0151': 'Press de banca en polea',
  '0178': 'Elevación lateral en polea',
  '0198': 'Jalón en polea',
  '0201': 'Extensión de tríceps en polea',
  '0251': 'Fondos de pecho',
  '0259': 'Lagartija con agarre cerrado',
  '0260': 'Cocoon abdominal',
  '0274': 'Abdominal en suelo',
  '0276': 'Bicho muerto',
  '0443': 'Codo a rodilla',
  '0456': 'Sit-up con rodillas flexionadas',
  '0457': 'Sit-up con piernas extendidas',
  '0458': 'Fly en suelo con barra',
  '0488': 'Hiperextensión en banco',
  '0489': 'Hiperextensión',
  '0289': 'Press de banca con mancuernas',
  '0294': 'Curl de bíceps con mancuernas',
  '0300': 'Peso muerto con mancuernas',
  '0313': 'Curl martillo con mancuernas',
  '0327': 'Remo inclinado con mancuernas',
  '0351': 'Extensión de tríceps acostado con mancuernas',
  '0334': 'Elevación lateral con mancuernas',
  '0413': 'Sentadilla con mancuernas',
  '0426': 'Press de hombro de pie con mancuernas',
  '0499': 'Remo invertido',
  '0514': 'Sentadilla con salto',
  '0576': 'Press de pecho en máquina',
  '0577': 'Press de pecho en máquina',
  '0570': 'Jalón de piernas en banco plano',
  '0585': 'Extensión de pierna en máquina',
  '0599': 'Curl femoral sentado en máquina',
  '0603': 'Press de hombro en máquina',
  '0652': 'Dominada',
  '0662': 'Lagartija',
  '0673': 'Jalón al pecho en máquina con agarre inverso',
  '0687': 'Giro ruso',
  '0680': 'Escalada de cuerda',
  '0709': 'Elevación lateral de cadera en paralelas',
  '0710': 'Abducción lateral de cadera',
  '0748': 'Press de banca en Smith',
  '0752': 'Peso muerto en Smith',
  '0770': 'Sentadilla en Smith',
  '3281': 'Sentadilla en Smith',
  '0777': 'Lanzador de hechizos',
  '0805': 'Caída abdominal suspendida',
  '0811': 'Peso muerto con barra hexagonal',
  '0841': 'Dominada con peso',
  '0859': 'Rodillo de muñeca',
  '1352': 'Curl de espalda baja',
  '1429': 'Dominada con agarre amplio',
  '1689': 'Empuje y jalón con peso corporal',
  '2466': 'Puente con escalador cruzado',
  '3012': 'Fondos escapulares',
  '3016': 'Curl-up',
  '3147': 'Inclinación pélvica',
  '3313': 'Fondos con barra recta y peso',
  '3699': 'Toque de hombro',
}

const COMPLETE_ENGLISH_IDS = new Set([
  '0003',
  '0138',
  '0870',
  '0260',
  '0276',
  '0467',
  '1471',
  '0507',
  '0508',
  '3288',
  '0562',
  '0609',
  '0631',
  '1401',
  '0641',
  '3665',
  '2204',
  '0687',
  '0846',
  '1489',
  '0777',
  '0796',
  '0857',
  '3418',
  '3419',
  '3420',
  '3662',
])

const EQUIPMENT_PREFIXES: Array<
  [
    string,
    string,
  ]
> = [
  [
    'band',
    'con banda',
  ],
  [
    'resistance band',
    'con banda de resistencia',
  ],
  [
    'exercise ball',
    'en balón de ejercicio',
  ],
  [
    'bodyweight',
    'con peso corporal',
  ],
  [
    'dumbbell',
    'con mancuernas',
  ],
  [
    'barbell',
    'con barra',
  ],
  [
    'kettlebell',
    'con pesa rusa',
  ],
  [
    'ez barbell',
    'con barra EZ',
  ],
  [
    'ez bar',
    'con barra EZ',
  ],
  [
    'cable',
    'en polea',
  ],
  [
    'lever',
    'en máquina',
  ],
  [
    'smith',
    'en Smith',
  ],
  [
    'sled',
    'en trineo',
  ],
]

const CURATED_REPLACEMENTS: Array<
  [
    RegExp,
    string,
  ]
> = [
  [
    /overhead triceps extension/gi,
    'extensión de tríceps por encima de la cabeza',
  ],
  [
    /shoulder raise/gi,
    'elevación de hombro',
  ],
  [
    /high row/gi,
    'remo alto',
  ],
  [
    /side plank/gi,
    'plancha lateral',
  ],
  [
    /hip abduction/gi,
    'abducción de cadera',
  ],
  [
    /hip adduction/gi,
    'aducción de cadera',
  ],
  [
    /hip extension/gi,
    'extensión de cadera',
  ],
  [
    /leg hip raise/gi,
    'elevación de cadera con piernas',
  ],
  [
    /leg raise/gi,
    'elevación de piernas',
  ],
  [
    /biceps curl/gi,
    'curl de bíceps',
  ],
  [
    /wrist curl/gi,
    'curl de muñeca',
  ],
  [
    /ab rollerout/gi,
    'rollout abdominal',
  ],
  [
    /hyperextension/gi,
    'hiperextensión',
  ],
  [
    /bench press/gi,
    'press de banca',
  ],
  [
    /chest press/gi,
    'press de pecho',
  ],
  [
    /shoulder press|overhead press/gi,
    'press de hombro',
  ],
  [
    /lat pulldown/gi,
    'jalón al pecho',
  ],
  [
    /pulldown/gi,
    'jalón',
  ],
  [
    /deadlift/gi,
    'peso muerto',
  ],
  [
    /leg press/gi,
    'prensa de pierna',
  ],
  [
    /leg extension/gi,
    'extensión de pierna',
  ],
  [
    /leg curl/gi,
    'curl femoral',
  ],
  [
    /calf raise/gi,
    'elevación de pantorrilla',
  ],
  [
    /hip thrust/gi,
    'empuje de cadera',
  ],
  [
    /hip raise/gi,
    'elevación de cadera',
  ],
  [
    /glute bridge/gi,
    'puente de glúteo',
  ],
  [
    /back extension/gi,
    'extensión de espalda',
  ],
  [
    /triceps extension/gi,
    'extensión de tríceps',
  ],
  [
    /triceps dip/gi,
    'fondos de tríceps',
  ],
  [
    /chest dip/gi,
    'fondos de pecho',
  ],
  [
    /\bdip\b/gi,
    'fondos',
  ],
  [
    /pull-up|pull up/gi,
    'dominada',
  ],
  [
    /chin-up|chin up/gi,
    'dominada supina',
  ],
  [
    /push-up|push up/gi,
    'lagartija',
  ],
  [
    /row/gi,
    'remo',
  ],
  [
    /squat/gi,
    'sentadilla',
  ],
  [
    /lunge/gi,
    'desplante',
  ],
  [
    /raise/gi,
    'elevación',
  ],
  [
    /shrug/gi,
    'encogimiento',
  ],
  [
    /crunch/gi,
    'abdominal',
  ],
  [
    /plank/gi,
    'plancha',
  ],
  [
    /twist/gi,
    'giro',
  ],
  [
    /reverse/gi,
    'invertido',
  ],
  [
    /incline/gi,
    'inclinado',
  ],
  [
    /decline/gi,
    'declinado',
  ],
  [
    /seated/gi,
    'sentado',
  ],
  [
    /standing/gi,
    'de pie',
  ],
  [
    /lying/gi,
    'acostado',
  ],
  [
    /kneeling/gi,
    'de rodillas',
  ],
  [
    /hanging/gi,
    'colgado',
  ],
  [
    /straight leg/gi,
    'piernas extendidas',
  ],
  [
    /single leg/gi,
    'a una pierna',
  ],
  [
    /one leg/gi,
    'a una pierna',
  ],
  [
    /one arm/gi,
    'a un brazo',
  ],
  [
    /front/gi,
    'frontal',
  ],
  [
    /rear delt/gi,
    'deltoide posterior',
  ],
  [
    /rear/gi,
    'posterior',
  ],
  [
    /lateral/gi,
    'lateral',
  ],
  [
    /close-grip|close grip/gi,
    'agarre cerrado',
  ],
  [
    /wide grip/gi,
    'agarre amplio',
  ],
  [
    /neutral grip/gi,
    'agarre neutro',
  ],
  [
    /underhand/gi,
    'agarre supino',
  ],
  [
    /overhand/gi,
    'agarre prono',
  ],
  [
    /with rope/gi,
    'con cuerda',
  ],
  [
    /male|female/gi,
    '',
  ],
]

const POSITION_PREFIXES = [
  'inclinado',
  'declinado',
  'acostado',
  'sentado',
  'de pie',
  'colgado',
  'invertido',
] as const

function placePositionAfterExercise(name: string) {
  const positions: string[] = []
  let exercise = name

  for (;;) {
    const position = POSITION_PREFIXES.find((item) => exercise.startsWith(`${item} `))
    if (!position) break
    positions.push(position)
    exercise = exercise.slice(position.length).trimStart()
  }

  return positions.length ? `${exercise} ${positions.reverse().join(' ')}` : name
}

function capitalizeExerciseName(name: string) {
  return name ? `${name[0]?.toLocaleUpperCase('es-MX')}${name.slice(1)}` : name
}

const METADATA_ES: Record<string, string> = {
  back: 'Espalda',
  chest: 'Pecho',
  shoulders: 'Hombros',
  arms: 'Brazos',
  waist: 'Abdomen',
  'upper arms': 'Brazos',
  'lower arms': 'Antebrazos',
  'upper legs': 'Piernas',
  'lower legs': 'Piernas',
  cardio: 'Cardio',
  strength: 'Fuerza',
  stretching: 'Estiramiento',
  plyometrics: 'Pliometría',
  'body weight': 'Peso corporal',
  barbell: 'Barra',
  dumbbell: 'Mancuernas',
  cable: 'Polea',
  'resistance band': 'Banda de resistencia',
  kettlebell: 'Pesa rusa',
  'ez barbell': 'Barra EZ',
  'leverage machine': 'Máquina',
  'smith machine': 'Máquina Smith',
  'assisted machine': 'Máquina asistida',
  'medicine ball': 'Balón medicinal',
  'stability ball': 'Balón de estabilidad',
  roller: 'Rodillo',
  weighted: 'Con peso',
  abs: 'Abdomen',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  delts: 'Hombros',
  glutes: 'Glúteos',
  quads: 'Cuádriceps',
  hamstrings: 'Isquiotibiales',
  calves: 'Pantorrillas',
  lats: 'Dorsales',
  pectorals: 'Pecho',
  traps: 'Trapecio',
  forearms: 'Antebrazos',
  abductors: 'Abductores',
  adductors: 'Aductores',
  obliques: 'Oblicuos',
  'lower back': 'Espalda baja',
  'cardiovascular system': 'Sistema cardiovascular',
}

export function getExerciseNameEs(id: string, englishName: string) {
  if (COMPLETE_ENGLISH_IDS.has(id)) return capitalizeExerciseName(englishName)
  const explicit = EXERCISE_NAME_ES[id]
  if (explicit) return capitalizeExerciseName(explicit)

  // These are established gym names. Keep the technical name in English while
  // still translating its surrounding context (for example, "Y-raise con banda").
  const protectedTerms = [
    [
      'y-raise',
      'Y-raise',
    ],
    [
      'good morning',
      'good morning',
    ],
    [
      'hack squat',
      'hack squat',
    ],
    [
      'goblet squat',
      'goblet squat',
    ],
    [
      'hammer curl',
      'hammer curl',
    ],
    [
      'concentration curl',
      'concentration curl',
    ],
    [
      'preacher curl',
      'preacher curl',
    ],
    [
      'rack pull',
      'rack pull',
    ],
    [
      'pullover',
      'pullover',
    ],
    [
      'french press',
      'French press',
    ],
    [
      'glute-ham raise',
      'glute-ham raise',
    ],
    [
      'pistol squat',
      'pistol squat',
    ],
  ]
  const protectedValues: string[] = []
  let name = englishName
  for (const [term, displayName] of protectedTerms) {
    name = name.replace(new RegExp(term, 'gi'), () => {
      const token = `__TERM_${protectedValues.length}__`
      protectedValues.push(displayName)
      return token
    })
  }
  let equipment = ''
  for (const [prefix, suffix] of EQUIPMENT_PREFIXES) {
    if (name.toLowerCase().startsWith(`${prefix} `)) {
      name = name.slice(prefix.length).trim()
      equipment = suffix
      break
    }
  }
  const translated = CURATED_REPLACEMENTS.reduce(
    (current, [pattern, replacement]) => current.replace(pattern, replacement),
    name,
  )
    .replace(/\s+/g, ' ')
    .trim()
  const restored = protectedValues.reduce(
    (current, value, index) => current.replace(`__TERM_${index}__`, value),
    translated,
  )
  const ordered = placePositionAfterExercise(restored)
  return capitalizeExerciseName(equipment ? `${ordered} ${equipment}` : ordered)
}

export function getExerciseMetadataEs(value: string) {
  return METADATA_ES[value.trim().toLowerCase()] ?? value
}
