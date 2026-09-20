import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getCatalogExerciseId } from '@/features/exercises/catalog'
import type {
  Circle,
  Routine,
  TicketReaction,
  WorkoutSet,
  WorkoutTicket,
} from '@/features/gym/types'
import { zustandMMKVStorage } from '@/lib/mmkv'

export const TICKETS_STORE_NAME = 'zustand-tickets-store'

type TicketsState = {
  circles: Circle[]
  tickets: WorkoutTicket[]
  publishWorkout: (
    routine: Routine,
    durationSeconds: number,
    sets: Record<string, WorkoutSet[]>,
    photo: string,
    authorName: string,
  ) => string
  react: (ticketId: string, reaction: TicketReaction) => void
  addMember: (circleId: string, member: string) => void
  removeMember: (circleId: string, member: string) => void
  renameCircle: (circleId: string, name: string) => void
  deleteCircle: (circleId: string) => void
  createCircle: (name: string) => void
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function catalogIdFromRoutineExerciseId(id: string) {
  const match = id.match(/-(\d{4})-[a-z0-9]{4}$/i)
  return getCatalogExerciseId(match?.[1])
}

function migrateTicketExercises(tickets: unknown[]) {
  return tickets.map((value) => {
    if (typeof value !== 'object' || value === null) return value
    const ticket = value as WorkoutTicket
    if (!Array.isArray(ticket.exercises)) return ticket
    return {
      ...ticket,
      exercises: ticket.exercises.map((exercise) => ({
        ...exercise,
        catalogExerciseId:
          getCatalogExerciseId(exercise.catalogExerciseId) ??
          catalogIdFromRoutineExerciseId(exercise.id) ??
          getCatalogExerciseId(undefined, exercise.name),
      })),
    }
  })
}

function isPersistableTicket(value: unknown): value is WorkoutTicket {
  if (typeof value !== 'object' || value === null) return false
  const ticket = value as Partial<WorkoutTicket>
  return (
    typeof ticket.id === 'string' &&
    typeof ticket.routineId === 'string' &&
    typeof ticket.completedAt === 'string' &&
    typeof ticket.durationSeconds === 'number' &&
    typeof ticket.photo === 'string' &&
    ticket.photo.startsWith('data:image/') &&
    Array.isArray(ticket.exercises)
  )
}

export const useTicketsStore = create<TicketsState>()(
  persist(
    (set, get) => ({
      circles: [],
      tickets: [],

      publishWorkout: (routine, durationSeconds, sets, photo, authorName) => {
        const sourceWorkoutId = generateId('workout')
        const exercises = routine.exercises.map((exercise) => ({
          id: exercise.id,
          catalogExerciseId: exercise.catalogExerciseId,
          name: exercise.name,
          sets: (sets[exercise.id] ?? []).map((item) => ({
            weightKg: item.weightKg,
            reps: item.reps,
          })),
        }))
        const completedSets = exercises.flatMap((exercise) => exercise.sets)
        const volume = completedSets.reduce((total, item) => total + item.weightKg * item.reps, 0)
        const totalReps = completedSets.reduce((total, item) => total + item.reps, 0)
        const plannedSets = routine.exercises.reduce(
          (total, exercise) => total + exercise.targetSets,
          0,
        )
        const previousWorkout = get().tickets.find((ticket) => ticket.routineId === routine.id)
        const volumeChangePercentage =
          previousWorkout && previousWorkout.volumeKg > 0
            ? ((volume - previousWorkout.volumeKg) / previousWorkout.volumeKg) * 100
            : undefined
        const ticket: WorkoutTicket = {
          id: sourceWorkoutId,
          sourceWorkoutId,
          routineId: routine.id,
          visibility: 'social',
          routineName: routine.name,
          completedAt: new Date().toISOString(),
          durationSeconds: Math.max(1, Math.round(durationSeconds)),
          durationMinutes: Math.max(1, Math.ceil(durationSeconds / 60)),
          volumeKg: volume,
          totalSets: completedSets.length,
          totalReps,
          completionPercentage:
            plannedSets > 0
              ? Math.min(100, Math.round((completedSets.length / plannedSets) * 100))
              : 0,
          volumeChangePercentage,
          sessionNumber: get().tickets.length + 1,
          exercises,
          photo,
          signedByAuthor: true,
          authorName: authorName.trim() || 'Tú',
          circles: get().circles.map((circle) => circle.name),
          reactions: {
            fire: 0,
            clap: 0,
            strong: 0,
          },
        }
        set((state) => ({
          tickets: [
            ticket,
            ...state.tickets,
          ],
        }))
        return ticket.id
      },

      react: (ticketId, reaction) =>
        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket
            const reactions = {
              ...ticket.reactions,
            }
            if (ticket.myReaction) reactions[ticket.myReaction] -= 1
            reactions[reaction] += 1
            return {
              ...ticket,
              myReaction: reaction,
              reactions,
            }
          }),
        })),

      addMember: (circleId, member) =>
        set((state) => ({
          circles: state.circles.map((circle) =>
            circle.id === circleId && member.trim()
              ? {
                  ...circle,
                  members: [
                    ...circle.members,
                    member.trim(),
                  ],
                  memberCount: circle.memberCount + 1,
                }
              : circle,
          ),
        })),

      removeMember: (circleId, member) =>
        set((state) => ({
          circles: state.circles.map((circle) =>
            circle.id === circleId
              ? {
                  ...circle,
                  members: circle.members.filter((item) => item !== member),
                  memberCount: Math.max(0, circle.memberCount - 1),
                }
              : circle,
          ),
        })),

      renameCircle: (circleId, name) =>
        set((state) => ({
          circles: state.circles.map((circle) =>
            circle.id === circleId && name.trim()
              ? {
                  ...circle,
                  name: name.trim(),
                }
              : circle,
          ),
        })),

      deleteCircle: (circleId) =>
        set((state) => ({
          circles: state.circles.filter((circle) => circle.id !== circleId),
        })),

      createCircle: (name) =>
        set((state) =>
          name.trim()
            ? {
                circles: [
                  ...state.circles,
                  {
                    id: generateId('circle'),
                    name: name.trim(),
                    members: [],
                    memberCount: 0,
                  },
                ],
              }
            : state,
        ),
    }),
    {
      name: TICKETS_STORE_NAME,
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 3,
      migrate: (persistedState) => {
        const persisted = persistedState as {
          tickets?: unknown[]
        }
        return {
          ...persisted,
          tickets: Array.isArray(persisted.tickets)
            ? migrateTicketExercises(persisted.tickets)
            : [],
        }
      },
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | {
              tickets?: unknown[]
              circles?: Circle[]
            }
          | undefined
        const tickets = Array.isArray(persisted?.tickets)
          ? persisted.tickets.filter(isPersistableTicket)
          : []
        return {
          ...currentState,
          circles: Array.isArray(persisted?.circles) ? persisted.circles : [],
          tickets,
        }
      },
    },
  ),
)

export const selectTickets = (state: TicketsState) => state.tickets
export const selectCircles = (state: TicketsState) => state.circles
