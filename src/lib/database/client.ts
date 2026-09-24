import { NitroSQLite, type NitroSQLiteConnection, open } from 'react-native-nitro-sqlite'

const DATABASE_NAME = 'set.sqlite'

const databaseHost = globalThis as typeof globalThis & {
  __setNitroDatabase?: NitroSQLiteConnection
}

function openAppDatabase() {
  // Nitro keeps its native connection across JS reloads. This app owns one
  // connection to this database, so release any connection from the old JS
  // runtime before creating the new JS session.
  try {
    NitroSQLite.native.close(DATABASE_NAME)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (!message.includes(`${DATABASE_NAME} is not open`)) throw error
  }

  return open({
    name: DATABASE_NAME,
    location: 'databases',
  })
}

if (!databaseHost.__setNitroDatabase) {
  databaseHost.__setNitroDatabase = openAppDatabase()
}

export const database = databaseHost.__setNitroDatabase

database.execute('PRAGMA foreign_keys = ON')
database.execute('PRAGMA journal_mode = WAL')

database.executeBatch([
  {
    query: `CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      accent TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    )`,
  },
  {
    query: `CREATE TABLE IF NOT EXISTS routine_exercises (
      id TEXT PRIMARY KEY NOT NULL,
      routine_id TEXT NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
      catalog_exercise_id TEXT,
      name TEXT NOT NULL,
      target_sets INTEGER NOT NULL,
      target_reps INTEGER NOT NULL,
      sort_order INTEGER NOT NULL
    )`,
  },
  {
    query:
      'CREATE INDEX IF NOT EXISTS routine_exercises_routine_idx ON routine_exercises(routine_id, sort_order)',
  },
  {
    query: `CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY NOT NULL,
      source_workout_id TEXT NOT NULL,
      routine_id TEXT NOT NULL,
      visibility TEXT NOT NULL,
      routine_name TEXT NOT NULL,
      completed_at TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      volume_kg REAL NOT NULL,
      total_sets INTEGER NOT NULL,
      total_reps INTEGER NOT NULL,
      completion_percentage INTEGER NOT NULL,
      volume_change_percentage REAL,
      session_number INTEGER NOT NULL,
      photo_uri TEXT NOT NULL,
      signed_by_author INTEGER NOT NULL,
      author_name TEXT NOT NULL,
      reaction_fire INTEGER NOT NULL,
      reaction_clap INTEGER NOT NULL,
      reaction_strong INTEGER NOT NULL,
      my_reaction TEXT
    )`,
  },
  {
    query: 'CREATE INDEX IF NOT EXISTS workouts_completed_at_idx ON workouts(completed_at DESC)',
  },
  {
    query:
      'CREATE INDEX IF NOT EXISTS workouts_routine_idx ON workouts(routine_id, completed_at DESC)',
  },
  {
    query: `CREATE TABLE IF NOT EXISTS workout_exercises (
      workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      exercise_order INTEGER NOT NULL,
      result_id TEXT NOT NULL,
      catalog_exercise_id TEXT,
      name TEXT NOT NULL,
      PRIMARY KEY (workout_id, exercise_order)
    )`,
  },
  {
    query:
      'CREATE INDEX IF NOT EXISTS workout_exercises_catalog_idx ON workout_exercises(catalog_exercise_id, workout_id)',
  },
  {
    query: `CREATE TABLE IF NOT EXISTS workout_sets (
      workout_id TEXT NOT NULL,
      exercise_order INTEGER NOT NULL,
      set_order INTEGER NOT NULL,
      weight_kg REAL NOT NULL,
      reps INTEGER NOT NULL,
      PRIMARY KEY (workout_id, exercise_order, set_order),
      FOREIGN KEY (workout_id, exercise_order)
        REFERENCES workout_exercises(workout_id, exercise_order) ON DELETE CASCADE
    )`,
  },
  {
    query: `CREATE TABLE IF NOT EXISTS workout_circles (
      workout_id TEXT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
      circle_name TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      PRIMARY KEY (workout_id, sort_order)
    )`,
  },
  {
    query: `CREATE TABLE IF NOT EXISTS circles (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    )`,
  },
  {
    query: `CREATE TABLE IF NOT EXISTS circle_members (
      circle_id TEXT NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
      member TEXT NOT NULL,
      sort_order INTEGER NOT NULL,
      PRIMARY KEY (circle_id, member)
    )`,
  },
  {
    query: `CREATE TABLE IF NOT EXISTS measurements (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      unit TEXT NOT NULL,
      created_at TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    )`,
  },
  {
    query: `CREATE TABLE IF NOT EXISTS measurement_records (
      id TEXT PRIMARY KEY NOT NULL,
      measurement_id TEXT NOT NULL REFERENCES measurements(id) ON DELETE CASCADE,
      value REAL NOT NULL,
      recorded_at TEXT NOT NULL
    )`,
  },
  {
    query:
      'CREATE INDEX IF NOT EXISTS measurement_records_range_idx ON measurement_records(measurement_id, recorded_at)',
  },
])

export function clearDomainDatabase() {
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
    {
      query: 'DELETE FROM routine_exercises',
    },
    {
      query: 'DELETE FROM routines',
    },
    {
      query: 'DELETE FROM measurement_records',
    },
    {
      query: 'DELETE FROM measurements',
    },
  ])
}
