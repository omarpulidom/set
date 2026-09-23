import type { BatchQueryCommand, QueryResultRow } from 'react-native-nitro-sqlite'
import type { Circle, TicketReaction, WorkoutTicket } from '@/features/gym/types'
import { database } from './client'

type WorkoutRow = QueryResultRow & {
  id: string
  source_workout_id: string
  routine_id: string
  visibility: string
  routine_name: string
  completed_at: string
  duration_seconds: number
  duration_minutes: number
  volume_kg: number
  total_sets: number
  total_reps: number
  completion_percentage: number
  volume_change_percentage: number | null
  session_number: number
  photo_uri: string
  signed_by_author: number
  author_name: string
  reaction_fire: number
  reaction_clap: number
  reaction_strong: number
  my_reaction: string | null
}

type WorkoutExerciseRow = QueryResultRow & {
  workout_id: string
  exercise_order: number
  result_id: string
  catalog_exercise_id: string | null
  name: string
}

type WorkoutSetRow = QueryResultRow & {
  workout_id: string
  exercise_order: number
  weight_kg: number
  reps: number
}

type WorkoutCircleRow = QueryResultRow & {
  workout_id: string
  circle_name: string
}

type CircleRow = QueryResultRow & {
  id: string
  name: string
}

type CircleMemberRow = QueryResultRow & {
  circle_id: string
  member: string
}

function isReaction(value: string | null): value is TicketReaction {
  return value === 'fire' || value === 'clap' || value === 'strong'
}

export function readTicketsAndCircles() {
  const workoutRows = database.execute<WorkoutRow>(
    'SELECT * FROM workouts ORDER BY completed_at DESC',
  ).rows._array
  const exerciseRows = database.execute<WorkoutExerciseRow>(
    `SELECT workout_id, exercise_order, result_id, catalog_exercise_id, name
     FROM workout_exercises ORDER BY workout_id, exercise_order`,
  ).rows._array
  const setRows = database.execute<WorkoutSetRow>(
    `SELECT workout_id, exercise_order, weight_kg, reps
     FROM workout_sets ORDER BY workout_id, exercise_order, set_order`,
  ).rows._array
  const workoutCircleRows = database.execute<WorkoutCircleRow>(
    'SELECT workout_id, circle_name FROM workout_circles ORDER BY workout_id, sort_order',
  ).rows._array

  const exercisesByWorkout = new Map<string, WorkoutExerciseRow[]>()
  const setsByExercise = new Map<string, WorkoutSetRow[]>()
  const circlesByWorkout = new Map<string, string[]>()
  for (const exercise of exerciseRows) {
    const group = exercisesByWorkout.get(exercise.workout_id) ?? []
    group.push(exercise)
    exercisesByWorkout.set(exercise.workout_id, group)
  }
  for (const set of setRows) {
    const key = `${set.workout_id}#${set.exercise_order}`
    const group = setsByExercise.get(key) ?? []
    group.push(set)
    setsByExercise.set(key, group)
  }
  for (const circle of workoutCircleRows) {
    const group = circlesByWorkout.get(circle.workout_id) ?? []
    group.push(circle.circle_name)
    circlesByWorkout.set(circle.workout_id, group)
  }

  const tickets: WorkoutTicket[] = workoutRows.map((row) => ({
    id: row.id,
    sourceWorkoutId: row.source_workout_id,
    routineId: row.routine_id,
    visibility: row.visibility === 'private' ? 'private' : 'social',
    routineName: row.routine_name,
    completedAt: row.completed_at,
    durationSeconds: row.duration_seconds,
    durationMinutes: row.duration_minutes,
    volumeKg: row.volume_kg,
    totalSets: row.total_sets,
    totalReps: row.total_reps,
    completionPercentage: row.completion_percentage,
    volumeChangePercentage: row.volume_change_percentage ?? undefined,
    sessionNumber: row.session_number,
    exercises: (exercisesByWorkout.get(row.id) ?? []).map((exercise) => ({
      id: exercise.result_id,
      catalogExerciseId: exercise.catalog_exercise_id ?? undefined,
      name: exercise.name,
      sets: (setsByExercise.get(`${row.id}#${exercise.exercise_order}`) ?? []).map((set) => ({
        weightKg: set.weight_kg,
        reps: set.reps,
      })),
    })),
    photo: row.photo_uri,
    signedByAuthor: row.signed_by_author === 1,
    circles: circlesByWorkout.get(row.id) ?? [],
    authorName: row.author_name,
    reactions: {
      fire: row.reaction_fire,
      clap: row.reaction_clap,
      strong: row.reaction_strong,
    },
    myReaction: isReaction(row.my_reaction) ? row.my_reaction : undefined,
  }))

  const circleRows = database.execute<CircleRow>('SELECT id, name FROM circles ORDER BY sort_order')
    .rows._array
  const memberRows = database.execute<CircleMemberRow>(
    'SELECT circle_id, member FROM circle_members ORDER BY circle_id, sort_order',
  ).rows._array
  const membersByCircle = new Map<string, string[]>()
  for (const member of memberRows) {
    const group = membersByCircle.get(member.circle_id) ?? []
    group.push(member.member)
    membersByCircle.set(member.circle_id, group)
  }
  const circles: Circle[] = circleRows.map((circle) => {
    const members = membersByCircle.get(circle.id) ?? []
    return {
      id: circle.id,
      name: circle.name,
      members,
      memberCount: members.length,
    }
  })

  return {
    circles,
    tickets,
  }
}

function ticketCommands(ticket: WorkoutTicket): BatchQueryCommand[] {
  return [
    {
      query: `INSERT INTO workouts (
        id, source_workout_id, routine_id, visibility, routine_name, completed_at,
        duration_seconds, duration_minutes, volume_kg, total_sets, total_reps,
        completion_percentage, volume_change_percentage, session_number, photo_uri,
        signed_by_author, author_name, reaction_fire, reaction_clap, reaction_strong,
        my_reaction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      params: [
        ticket.id,
        ticket.sourceWorkoutId,
        ticket.routineId,
        ticket.visibility,
        ticket.routineName,
        ticket.completedAt,
        ticket.durationSeconds,
        ticket.durationMinutes,
        ticket.volumeKg,
        ticket.totalSets,
        ticket.totalReps,
        ticket.completionPercentage,
        ticket.volumeChangePercentage ?? null,
        ticket.sessionNumber,
        ticket.photo,
        ticket.signedByAuthor,
        ticket.authorName,
        ticket.reactions.fire,
        ticket.reactions.clap,
        ticket.reactions.strong,
        ticket.myReaction ?? null,
      ],
    },
    ...ticket.exercises.flatMap((exercise, exerciseOrder) => [
      {
        query: `INSERT INTO workout_exercises
                (workout_id, exercise_order, result_id, catalog_exercise_id, name)
                VALUES (?, ?, ?, ?, ?)`,
        params: [
          ticket.id,
          exerciseOrder,
          exercise.id,
          exercise.catalogExerciseId ?? null,
          exercise.name,
        ],
      },
      ...exercise.sets.map((set, setOrder) => ({
        query: `INSERT INTO workout_sets
                (workout_id, exercise_order, set_order, weight_kg, reps)
                VALUES (?, ?, ?, ?, ?)`,
        params: [
          ticket.id,
          exerciseOrder,
          setOrder,
          set.weightKg,
          set.reps,
        ],
      })),
    ]),
    ...ticket.circles.map((circleName, index) => ({
      query: 'INSERT INTO workout_circles (workout_id, circle_name, sort_order) VALUES (?, ?, ?)',
      params: [
        ticket.id,
        circleName,
        index,
      ],
    })),
  ]
}

function circleCommands(circle: Circle, sortOrder: number): BatchQueryCommand[] {
  return [
    {
      query: 'INSERT INTO circles (id, name, sort_order) VALUES (?, ?, ?)',
      params: [
        circle.id,
        circle.name,
        sortOrder,
      ],
    },
    ...circle.members.map((member, index) => ({
      query: 'INSERT INTO circle_members (circle_id, member, sort_order) VALUES (?, ?, ?)',
      params: [
        circle.id,
        member,
        index,
      ],
    })),
  ]
}

export function insertTicket(ticket: WorkoutTicket) {
  database.executeBatch(ticketCommands(ticket))
}

export function updateTicketReaction(
  ticketId: string,
  reaction: TicketReaction,
  reactions: WorkoutTicket['reactions'],
) {
  database.execute(
    `UPDATE workouts SET my_reaction = ?, reaction_fire = ?, reaction_clap = ?, reaction_strong = ?
     WHERE id = ?`,
    [
      reaction,
      reactions.fire,
      reactions.clap,
      reactions.strong,
      ticketId,
    ],
  )
}

export function insertCircle(circle: Circle, sortOrder: number) {
  database.executeBatch(circleCommands(circle, sortOrder))
}

export function replaceCircle(circle: Circle, sortOrder: number) {
  database.executeBatch([
    {
      query: 'DELETE FROM circles WHERE id = ?',
      params: [
        circle.id,
      ],
    },
    ...circleCommands(circle, sortOrder),
  ])
}

export function deleteCircleRecord(circleId: string) {
  database.execute('DELETE FROM circles WHERE id = ?', [
    circleId,
  ])
}

export function replaceAllTicketsAndCircles(tickets: WorkoutTicket[], circles: Circle[]) {
  database.executeBatch([
    {
      query: 'DELETE FROM workout_sets',
    },
    {
      query: 'DELETE FROM workout_exercises',
    },
    {
      query: 'DELETE FROM workout_circles',
    },
    {
      query: 'DELETE FROM workouts',
    },
    {
      query: 'DELETE FROM circle_members',
    },
    {
      query: 'DELETE FROM circles',
    },
    ...tickets.flatMap(ticketCommands),
    ...circles.flatMap(circleCommands),
  ])
}
