import { create } from 'zustand'
import type {
  Circle,
  Routine,
  RoutineExercise,
  TicketReaction,
  WorkoutSet,
  WorkoutTicket,
} from '@/features/gym/types'
import {
  deleteCircleRecord,
  insertCircle,
  insertTicket,
  readTicketsAndCircles,
  replaceAllTicketsAndCircles,
  replaceCircle,
  updateTicketReaction,
} from '@/lib/database'
import { persistTicketPhoto } from './ticket-photo-storage'

type TicketsState = {
  circles: Circle[]
  tickets: WorkoutTicket[]
  publishWorkout: (
    routine: Routine,
    durationSeconds: number,
    sets: Record<string, WorkoutSet[]>,
    photo: string,
    authorName: string,
    exercises?: RoutineExercise[],
  ) => Promise<string>
  react: (ticketId: string, reaction: TicketReaction) => void
  addMember: (circleId: string, member: string) => void
  removeMember: (circleId: string, member: string) => void
  renameCircle: (circleId: string, name: string) => void
  deleteCircle: (circleId: string) => void
  createCircle: (name: string) => void
  replaceTicketsAndCircles: (tickets: WorkoutTicket[], circles: Circle[]) => void
}

function generateId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const initialData = readTicketsAndCircles()

export const useTicketsStore = create<TicketsState>()((set, get) => ({
  circles: initialData.circles,
  tickets: initialData.tickets,

  publishWorkout: async (routine, durationSeconds, sets, photo, authorName, workoutExercises) => {
    const sourceWorkoutId = generateId('workout')
    const persistedPhoto = await persistTicketPhoto(photo, sourceWorkoutId)
    const exercisesForTicket = workoutExercises ?? routine.exercises
    const exercises = exercisesForTicket.map((exercise) => ({
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
    const plannedSets = exercisesForTicket.reduce(
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
        plannedSets > 0 ? Math.min(100, Math.round((completedSets.length / plannedSets) * 100)) : 0,
      volumeChangePercentage,
      sessionNumber: get().tickets.length + 1,
      exercises,
      photo: persistedPhoto,
      signedByAuthor: true,
      authorName: authorName.trim() || 'Tú',
      circles: get().circles.map((circle) => circle.name),
      reactions: {
        fire: 0,
        clap: 0,
        strong: 0,
      },
    }
    insertTicket(ticket)
    set((state) => ({
      tickets: [
        ticket,
        ...state.tickets,
      ],
    }))
    return ticket.id
  },

  react: (ticketId, reaction) => {
    const ticket = get().tickets.find((item) => item.id === ticketId)
    if (!ticket) return
    const reactions = {
      ...ticket.reactions,
    }
    if (ticket.myReaction) {
      reactions[ticket.myReaction] = Math.max(0, reactions[ticket.myReaction] - 1)
    }
    reactions[reaction] += 1
    updateTicketReaction(ticketId, reaction, reactions)
    set((state) => ({
      tickets: state.tickets.map((item) =>
        item.id === ticketId
          ? {
              ...item,
              myReaction: reaction,
              reactions,
            }
          : item,
      ),
    }))
  },

  addMember: (circleId, member) => {
    const normalizedMember = member.trim()
    const index = get().circles.findIndex((circle) => circle.id === circleId)
    const circle = get().circles[index]
    if (!circle || !normalizedMember || circle.members.includes(normalizedMember)) return
    const updatedCircle = {
      ...circle,
      members: [
        ...circle.members,
        normalizedMember,
      ],
      memberCount: circle.memberCount + 1,
    }
    replaceCircle(updatedCircle, index)
    set((state) => ({
      circles: state.circles.map((item) => (item.id === circleId ? updatedCircle : item)),
    }))
  },

  removeMember: (circleId, member) => {
    const index = get().circles.findIndex((circle) => circle.id === circleId)
    const circle = get().circles[index]
    if (!circle) return
    const members = circle.members.filter((item) => item !== member)
    const updatedCircle = {
      ...circle,
      members,
      memberCount: members.length,
    }
    replaceCircle(updatedCircle, index)
    set((state) => ({
      circles: state.circles.map((item) => (item.id === circleId ? updatedCircle : item)),
    }))
  },

  renameCircle: (circleId, name) => {
    const normalizedName = name.trim()
    const index = get().circles.findIndex((circle) => circle.id === circleId)
    const circle = get().circles[index]
    if (!circle || !normalizedName) return
    const updatedCircle = {
      ...circle,
      name: normalizedName,
    }
    replaceCircle(updatedCircle, index)
    set((state) => ({
      circles: state.circles.map((item) => (item.id === circleId ? updatedCircle : item)),
    }))
  },

  deleteCircle: (circleId) => {
    deleteCircleRecord(circleId)
    set((state) => ({
      circles: state.circles.filter((circle) => circle.id !== circleId),
    }))
  },

  createCircle: (name) => {
    const normalizedName = name.trim()
    if (!normalizedName) return
    const circle: Circle = {
      id: generateId('circle'),
      name: normalizedName,
      members: [],
      memberCount: 0,
    }
    insertCircle(circle, get().circles.length)
    set((state) => ({
      circles: [
        ...state.circles,
        circle,
      ],
    }))
  },

  replaceTicketsAndCircles: (tickets, circles) => {
    replaceAllTicketsAndCircles(tickets, circles)
    set({
      circles,
      tickets,
    })
  },
}))

export const selectTickets = (state: TicketsState) => state.tickets
export const selectCircles = (state: TicketsState) => state.circles
