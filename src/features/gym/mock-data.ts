import type { ExerciseProgressPoint } from './types'

export const mockProfile = {
  displayName: 'Omar',
  weeklyGoalDays: 4,
  completedDaysThisWeek: 3,
  streakDays: 5,
}

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
