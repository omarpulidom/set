import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'
import type { Routine, WorkoutSet, WorkoutTicket } from '@/features/gym/types'
import {
  type MeasurementDefinition,
  type MeasurementRecord,
  useMeasurementsStore,
} from '@/features/measurements/measurements-store'
import { useRoutinesStore } from '@/features/routines/routines-store'
import {
  clearPersistedTicketPhotos,
  persistTicketPhoto,
} from '@/features/tickets/ticket-photo-storage'
import { useTicketsStore } from '@/features/tickets/tickets-store'
import { queryClient } from '@/lib/qc'

const DEMO_PHOTO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL9zQAAAABJRU5ErkJggg=='

function dateDaysAgo(days: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function dateForWeek(weeksAgo: number, weekday: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  const daysSinceMonday = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - daysSinceMonday - weeksAgo * 7 + weekday)
  return date.toISOString()
}

function workoutSets(
  workingWeightKg: number,
  targetReps: number,
  count: number,
  workoutNumber: number,
): WorkoutSet[] {
  const repAdjustments = [
    [
      0,
      -1,
      -2,
      0,
    ],
    [
      1,
      0,
      -1,
      -2,
    ],
    [
      0,
      0,
      -1,
      -1,
    ],
    [
      1,
      1,
      0,
      -1,
    ],
    [
      -1,
      -2,
      -2,
      -3,
    ],
    [
      0,
      -1,
      0,
      -1,
    ],
    [
      1,
      0,
      -1,
      -1,
    ],
    [
      0,
      0,
      0,
      -1,
    ],
  ][workoutNumber % 8] ?? [
    0,
    -1,
    -1,
    -2,
  ]

  return Array.from(
    {
      length: count,
    },
    (_, index) => ({
      weightKg: Math.max(2.5, workingWeightKg - (index === 0 ? 2.5 : 0)),
      reps: Math.max(1, targetReps + (repAdjustments[index] ?? -1)),
    }),
  )
}

const demoRoutines: Routine[] = [
  {
    id: 'demo-routine-upper',
    name: 'UPPER',
    description: 'Torso para desarrollo',
    accent: '#202020',
    exercises: [
      {
        id: 'demo-upper-pec-deck',
        catalogExerciseId: '0596',
        name: 'lever seated fly',
        targetSets: 3,
        targetReps: 12,
      },
      {
        id: 'demo-upper-incline-press',
        catalogExerciseId: '1299',
        name: 'lever incline chest press',
        targetSets: 3,
        targetReps: 10,
      },
      {
        id: 'demo-upper-lateral-raise',
        catalogExerciseId: '0584',
        name: 'lever lateral raise',
        targetSets: 3,
        targetReps: 15,
      },
      {
        id: 'demo-upper-biceps-curl',
        catalogExerciseId: '0575',
        name: 'lever bicep curl',
        targetSets: 3,
        targetReps: 12,
      },
      {
        id: 'demo-upper-triceps-extension',
        catalogExerciseId: '0607',
        name: 'lever triceps extension',
        targetSets: 3,
        targetReps: 12,
      },
    ],
  },
  {
    id: 'demo-routine-lower',
    name: 'LOWER',
    description: 'Pierna para desarrollo',
    accent: '#202020',
    exercises: [
      {
        id: 'demo-lower-adduction',
        catalogExerciseId: '0598',
        name: 'lever seated hip adduction',
        targetSets: 3,
        targetReps: 12,
      },
      {
        id: 'demo-lower-abduction',
        catalogExerciseId: '0597',
        name: 'lever seated hip abduction',
        targetSets: 3,
        targetReps: 12,
      },
      {
        id: 'demo-lower-seated-curl',
        catalogExerciseId: '0599',
        name: 'lever seated leg curl',
        targetSets: 3,
        targetReps: 12,
      },
      {
        id: 'demo-lower-leg-press',
        catalogExerciseId: '0739',
        name: 'sled 45° leg press',
        targetSets: 4,
        targetReps: 10,
      },
      {
        id: 'demo-lower-extension',
        catalogExerciseId: '0585',
        name: 'lever leg extension',
        targetSets: 3,
        targetReps: 12,
      },
      {
        id: 'demo-lower-abs',
        catalogExerciseId: '1452',
        name: 'lever seated crunch',
        targetSets: 3,
        targetReps: 15,
      },
    ],
  },
]

const demoMeasurements: MeasurementDefinition[] = [
  {
    id: 'demo-measurement-weight',
    name: 'Peso',
    unit: 'kg',
    createdAt: dateDaysAgo(43),
  },
  {
    id: 'demo-measurement-waist',
    name: 'Cintura',
    unit: 'cm',
    createdAt: dateDaysAgo(43),
  },
  {
    id: 'demo-measurement-arm',
    name: 'Brazo',
    unit: 'cm',
    createdAt: dateDaysAgo(43),
  },
]

const demoMeasurementRecords: MeasurementRecord[] = [
  [
    78.4,
    78.1,
    77.8,
    77.9,
    77.3,
    76.8,
  ].map((value, index) => ({
    id: `demo-weight-${index + 1}`,
    measurementId: 'demo-measurement-weight',
    value,
    recordedAt: dateForWeek(5 - index, 0),
  })),
  [
    84,
    83.7,
    83.4,
    83.6,
    82.5,
    81.8,
  ].map((value, index) => ({
    id: `demo-waist-${index + 1}`,
    measurementId: 'demo-measurement-waist',
    value,
    recordedAt: dateForWeek(5 - index, 0),
  })),
  [
    36.2,
    36.4,
    36.3,
    36.6,
    36.8,
    37,
  ].map((value, index) => ({
    id: `demo-arm-${index + 1}`,
    measurementId: 'demo-measurement-arm',
    value,
    recordedAt: dateForWeek(5 - index, 0),
  })),
].flat()

function ticket(
  id: string,
  routine: Routine,
  completedAt: string,
  exerciseSets: Record<string, WorkoutSet[]>,
  sessionNumber: number,
): WorkoutTicket {
  const exercises = routine.exercises.map((exercise) => ({
    id: exercise.id,
    catalogExerciseId: exercise.catalogExerciseId,
    name: exercise.name,
    sets: exerciseSets[exercise.id] ?? [],
  }))
  const completedSets = exercises.flatMap((exercise) => exercise.sets)
  const volumeKg = completedSets.reduce((total, set) => total + set.weightKg * set.reps, 0)
  const totalReps = completedSets.reduce((total, set) => total + set.reps, 0)
  return {
    id,
    sourceWorkoutId: id,
    routineId: routine.id,
    visibility: 'private',
    routineName: routine.name,
    completedAt,
    durationSeconds: 3_600,
    durationMinutes: 60,
    volumeKg,
    totalSets: completedSets.length,
    totalReps,
    completionPercentage: 100,
    sessionNumber,
    exercises,
    photo: DEMO_PHOTO,
    signedByAuthor: true,
    circles: [],
    authorName: 'Demo athlete',
    reactions: {
      fire: 0,
      clap: 0,
      strong: 0,
    },
  }
}

const baseWeightByExercise: Record<string, number> = {
  'demo-upper-pec-deck': 45,
  'demo-upper-incline-press': 55,
  'demo-upper-lateral-raise': 20,
  'demo-upper-biceps-curl': 25,
  'demo-upper-triceps-extension': 32.5,
  'demo-lower-adduction': 45,
  'demo-lower-abduction': 50,
  'demo-lower-seated-curl': 42.5,
  'demo-lower-leg-press': 120,
  'demo-lower-extension': 55,
  'demo-lower-abs': 40,
}

const upperLoadProgression = [
  0,
  0,
  2.5,
  2.5,
  0,
  5,
  5,
  7.5,
]

const lowerLoadProgression = [
  0,
  2.5,
  2.5,
  0,
  5,
  5,
  7.5,
]

function setsForRoutine(routine: Routine, routineWorkoutNumber: number, sessionNumber: number) {
  const loadProgression =
    routine.id === 'demo-routine-upper' ? upperLoadProgression : lowerLoadProgression
  const loadAdjustment = loadProgression[routineWorkoutNumber] ?? 7.5

  return Object.fromEntries(
    routine.exercises.map((exercise) => [
      exercise.id,
      workoutSets(
        (baseWeightByExercise[exercise.id] ?? 20) + loadAdjustment,
        exercise.targetReps,
        exercise.targetSets,
        sessionNumber,
      ),
    ]),
  )
}

function demoTickets(): WorkoutTicket[] {
  const upper = demoRoutines[0]
  const lower = demoRoutines[1]
  if (!upper || !lower) return []
  const schedule = [
    {
      weeksAgo: 5,
      weekdays: [
        0,
        2,
        4,
      ],
    },
    {
      weeksAgo: 4,
      weekdays: [
        0,
        1,
        3,
        5,
      ],
    },
    {
      weeksAgo: 3,
      weekdays: [
        1,
        4,
      ],
    },
    {
      weeksAgo: 2,
      weekdays: [
        0,
        2,
        4,
      ],
    },
    {
      weeksAgo: 1,
      weekdays: [
        1,
        3,
        5,
      ],
    },
  ]

  return schedule
    .flatMap(({ weeksAgo, weekdays }) =>
      weekdays.map((weekday) => ({
        weeksAgo,
        weekday,
      })),
    )
    .map(({ weeksAgo, weekday }, index, sessions) => {
      const routine = index % 2 === 0 ? upper : lower
      const routineWorkoutNumber = sessions
        .slice(0, index)
        .filter((_, sessionIndex) => (sessionIndex % 2 === 0) === (index % 2 === 0)).length
      return ticket(
        `demo-ticket-${index + 1}`,
        routine,
        dateForWeek(weeksAgo, weekday),
        setsForRoutine(routine, routineWorkoutNumber, index),
        index + 1,
      )
    })
    .reverse()
}

export async function loadDemoData() {
  await clearPersistedTicketPhotos()
  const tickets = await Promise.all(
    demoTickets().map(async (demoTicket) => ({
      ...demoTicket,
      photo: await persistTicketPhoto(DEMO_PHOTO, demoTicket.id),
    })),
  )
  queryClient.clear()
  useRoutineDraftStore.getState().reset()
  useRoutinesStore.getState().replaceRoutines(demoRoutines)
  useTicketsStore.getState().replaceTicketsAndCircles(tickets, [])
  useMeasurementsStore.getState().replaceMeasurements(demoMeasurements, demoMeasurementRecords)
}
