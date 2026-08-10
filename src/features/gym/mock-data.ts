import type { CompletedWorkout, ExerciseProgressPoint, Routine } from './types'
import { Colors } from '@/components/colors'

export const mockProfile = {
  displayName: 'Omar',
  weeklyGoalDays: 4,
  completedDaysThisWeek: 3,
  streakDays: 5,
}

export const mockRoutines: Routine[] = [
  {
    id: 'push',
    name: 'Push',
    description: 'Pecho, hombro y tríceps',
    accent: Colors.mono.DEFAULT,
    exercises: [
      {
        id: 'bench',
        name: 'Press banca',
        targetSets: 4,
        targetReps: 8,
      },
      {
        id: 'incline',
        name: 'Press inclinado',
        targetSets: 3,
        targetReps: 10,
      },
      {
        id: 'lateral',
        name: 'Elevaciones laterales',
        targetSets: 3,
        targetReps: 12,
      },
    ],
  },
  {
    id: 'pull',
    name: 'Pull',
    description: 'Espalda y bíceps',
    accent: Colors.mono.light,
    exercises: [
      {
        id: 'row',
        name: 'Remo con barra',
        targetSets: 4,
        targetReps: 8,
      },
      {
        id: 'pulldown',
        name: 'Jalón al pecho',
        targetSets: 3,
        targetReps: 10,
      },
      {
        id: 'curl',
        name: 'Curl inclinado',
        targetSets: 3,
        targetReps: 12,
      },
    ],
  },
  {
    id: 'legs',
    name: 'Legs',
    description: 'Pierna completa',
    accent: Colors.mono.mist,
    exercises: [
      {
        id: 'squat',
        name: 'Sentadilla',
        targetSets: 4,
        targetReps: 6,
      },
      {
        id: 'press',
        name: 'Prensa',
        targetSets: 3,
        targetReps: 10,
      },
      {
        id: 'curl-leg',
        name: 'Curl femoral',
        targetSets: 3,
        targetReps: 12,
      },
    ],
  },
]

export const mockWorkouts: CompletedWorkout[] = [
  {
    id: 'workout-1',
    routineId: 'push',
    routineName: 'Push',
    completedAt: 'Hoy, 7:42 AM',
    durationMinutes: 64,
    adherence: 0.94,
    volumeKg: 8420,
    photo: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800',
  },
  {
    id: 'workout-2',
    routineId: 'pull',
    routineName: 'Pull',
    completedAt: 'Ayer, 6:10 PM',
    durationMinutes: 58,
    adherence: 0.86,
    volumeKg: 7640,
    photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
  },
]

export const mockProgress: ExerciseProgressPoint[] = [
  {
    label: 'S1',
    volumeKg: 4820,
    bestWeightKg: 65,
  },
  {
    label: 'S2',
    volumeKg: 5260,
    bestWeightKg: 67.5,
  },
  {
    label: 'S3',
    volumeKg: 5100,
    bestWeightKg: 67.5,
  },
  {
    label: 'S4',
    volumeKg: 5840,
    bestWeightKg: 70,
  },
  {
    label: 'S5',
    volumeKg: 6120,
    bestWeightKg: 72.5,
  },
]

export function getMockRoutine(id?: string) {
  return mockRoutines.find((routine) => routine.id === id) ?? mockRoutines[0]
}
