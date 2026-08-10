import { create } from 'zustand'
import type { Circle, Routine, TicketReaction, WorkoutSet, WorkoutTicket } from '@/features/gym/types'

const circles: Circle[] = [
  { id: 'friends', name: 'Friends', memberCount: 4, members: ['Sofía', 'Diego', 'Nora', 'Vale'] },
  { id: 'club', name: 'Lunes de hierro', memberCount: 3, members: ['Nico', 'Bruno', 'Mara'] },
]

const seedTickets: WorkoutTicket[] = [
  {
    id: 'social-seed-1', sourceWorkoutId: 'seed-1', visibility: 'social', routineName: 'Pull',
    completedAt: 'Hoy · 6:10 AM', durationMinutes: 58, volumeKg: 7640, photo: 'mock', signedByAuthor: true,
    circles: ['Friends'], authorName: 'Sofía', reactions: { fire: 4, clap: 2, strong: 1 },
  },
  {
    id: 'private-seed-1', sourceWorkoutId: 'seed-2', visibility: 'private', routineName: 'Push',
    completedAt: 'Ayer · 7:42 AM', durationMinutes: 64, volumeKg: 8420, photo: 'mock', signedByAuthor: true,
    circles: [], authorName: 'Omar', reactions: { fire: 0, clap: 0, strong: 0 },
  },
  {
    id: 'private-seed-2', sourceWorkoutId: 'seed-3', visibility: 'private', routineName: 'Legs',
    completedAt: 'Vie · 6:28 PM', durationMinutes: 71, volumeKg: 10680, photo: 'mock', signedByAuthor: true,
    circles: [], authorName: 'Omar', reactions: { fire: 0, clap: 0, strong: 0 },
  },
]

type TicketMockState = {
  circles: Circle[]
  tickets: WorkoutTicket[]
  todayCompleted: boolean
  publishWorkout: (routine: Routine, durationMinutes: number, sets: Record<string, WorkoutSet[]>) => void
  react: (ticketId: string, reaction: TicketReaction) => void
  addMember: (circleId: string, member: string) => void
  removeMember: (circleId: string, member: string) => void
  renameCircle: (circleId: string, name: string) => void
  deleteCircle: (circleId: string) => void
  createCircle: (name: string) => void
}

export const useTicketMockStore = create<TicketMockState>((set, get) => ({
  circles,
  tickets: seedTickets,
  todayCompleted: false,
  publishWorkout: (routine, durationMinutes, sets) => {
    const sourceWorkoutId = `workout-${Date.now()}`
    const volume = Object.values(sets).flat().reduce((total, item) => total + item.weightKg * item.reps, 0)
    const now = new Date()
    const hour = now.getHours() % 12 || 12
    const minute = String(now.getMinutes()).padStart(2, '0')
    const period = now.getHours() >= 12 ? 'PM' : 'AM'
    const base = {
      sourceWorkoutId,
      routineName: routine.name,
      completedAt: `Hoy · ${hour}:${minute} ${period}`,
      durationMinutes: Math.max(1, durationMinutes),
      volumeKg: volume,
      photo: 'mock',
      signedByAuthor: true,
      authorName: 'Omar',
      reactions: { fire: 0, clap: 0, strong: 0 },
    }
    const privateTicket: WorkoutTicket = { ...base, id: `${sourceWorkoutId}-private`, visibility: 'private', circles: [] }
    const socialTicket: WorkoutTicket = {
      ...base,
      id: `${sourceWorkoutId}-social`,
      visibility: 'social',
      circles: get().circles.map((circle) => circle.name),
    }
    set((state) => ({ tickets: [privateTicket, socialTicket, ...state.tickets], todayCompleted: true }))
  },
  react: (ticketId, reaction) => set((state) => ({
    tickets: state.tickets.map((ticket) => {
      if (ticket.id !== ticketId) return ticket
      const reactions = { ...ticket.reactions }
      if (ticket.myReaction) reactions[ticket.myReaction] -= 1
      reactions[reaction] += 1
      return { ...ticket, myReaction: reaction, reactions }
    }),
  })),
  addMember: (circleId, member) => set((state) => ({ circles: state.circles.map((circle) => circle.id === circleId && member.trim() ? { ...circle, members: [...circle.members, member.trim()], memberCount: circle.memberCount + 1 } : circle) })),
  removeMember: (circleId, member) => set((state) => ({ circles: state.circles.map((circle) => circle.id === circleId ? { ...circle, members: circle.members.filter((item) => item !== member), memberCount: Math.max(0, circle.memberCount - 1) } : circle) })),
  renameCircle: (circleId, name) => set((state) => ({ circles: state.circles.map((circle) => circle.id === circleId && name.trim() ? { ...circle, name: name.trim() } : circle) })),
  deleteCircle: (circleId) => set((state) => ({ circles: state.circles.filter((circle) => circle.id !== circleId) })),
  createCircle: (name) => set((state) => name.trim() ? ({ circles: [...state.circles, { id: `circle-${Date.now()}`, name: name.trim(), members: [], memberCount: 0 }] }) : state),
}))
