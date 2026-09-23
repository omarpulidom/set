export type RoutineExercise = {
  id: string
  catalogExerciseId?: string
  name: string
  targetSets: number
  targetReps: number
}

export type Routine = {
  id: string
  name: string
  description: string
  accent: string
  exercises: RoutineExercise[]
}

export type WorkoutSet = {
  weightKg: number
  reps: number
}

export type WorkoutExerciseResult = {
  id: string
  catalogExerciseId?: string
  name: string
  sets: WorkoutSet[]
}

export type CompletedWorkout = {
  id: string
  routineId: string
  routineName: string
  completedAt: string
  durationMinutes: number
  adherence: number
  volumeKg: number
  photo: string
}

export type ExerciseProgressPoint = {
  label: string
  volumeKg: number
  bestWeightKg: number
}

export type TicketVisibility = 'private' | 'social'

export type TicketReaction = 'fire' | 'clap' | 'strong'

export type WorkoutTicket = {
  id: string
  sourceWorkoutId: string
  routineId: string
  visibility: TicketVisibility
  routineName: string
  /** ISO-8601 timestamp. Kept structured so every screen can format it correctly. */
  completedAt: string
  durationSeconds: number
  durationMinutes: number
  volumeKg: number
  totalSets: number
  totalReps: number
  completionPercentage: number
  volumeChangePercentage?: number
  sessionNumber: number
  exercises: WorkoutExerciseResult[]
  /** Local URI containing the already-rendered camera effect. */
  photo: string
  signedByAuthor: boolean
  circles: string[]
  authorName: string
  reactions: Record<TicketReaction, number>
  myReaction?: TicketReaction
}

export type Circle = {
  id: string
  name: string
  memberCount: number
  members: string[]
}
