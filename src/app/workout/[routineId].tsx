import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { videoForExercise } from '@/features/exercises/catalog'
import type { Routine, WorkoutSet } from '@/features/gym/types'
import { useRoutinesStore } from '@/features/routines/routines-store'

function defaultSets(count: number): WorkoutSet[] {
  return Array.from(
    {
      length: count,
    },
    () => ({
      weightKg: 0,
      reps: 0,
    }),
  )
}

function useResolvedRoutine(routineId: string | undefined): Routine | undefined {
  return useRoutinesStore((state) => state.routines.find((item) => item.id === routineId))
}

export default function WorkoutScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const routine = useResolvedRoutine(routineId)
  const [seconds, setSeconds] = useState(0)
  const [expandedId, setExpandedId] = useState<string | undefined>(() => routine?.exercises[0]?.id)
  const [sets, setSets] = useState<Record<string, WorkoutSet[]>>(() =>
    routine
      ? Object.fromEntries(
          routine.exercises.map((exercise) => [
            exercise.id,
            defaultSets(exercise.targetSets),
          ]),
        )
      : {},
  )

  function toggleExpanded(exerciseId: string) {
    setExpandedId((current) => (current === exerciseId ? undefined : exerciseId))
  }

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const elapsed = useMemo(() => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0')
    return `${minutes}:${remainingSeconds}`
  }, [
    seconds,
  ])

  function updateSet(exerciseId: string, index: number, field: keyof WorkoutSet, value: string) {
    setSets((current) => ({
      ...current,
      [exerciseId]: current[exerciseId].map((set, setIndex) =>
        setIndex === index
          ? {
              ...set,
              [field]: Number(value.replace(',', '.')) || 0,
            }
          : set,
      ),
    }))
  }

  function addSet(exerciseId: string) {
    setSets((current) => ({
      ...current,
      [exerciseId]: [
        ...current[exerciseId],
        {
          weightKg: 0,
          reps: 0,
        },
      ],
    }))
  }

  function removeSet(exerciseId: string, index: number) {
    setSets((current) => ({
      ...current,
      [exerciseId]: current[exerciseId].filter((_, setIndex) => setIndex !== index),
    }))
  }

  if (!routine) {
    return (
      <SafeAreaView
        className='flex-1 bg-surface'
        edges={[
          'top',
          'left',
          'right',
        ]}
      >
        <View className='flex-row items-center justify-between px-5 pt-5'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>
        <View className='flex-1 items-center justify-center px-8'>
          <Text className='text-center font-geist-mono text-sm text-ink-muted'>
            Esta rutina ya no existe.
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      className='flex-1 bg-surface'
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <View className='flex-row items-center justify-between px-5 pt-5'>
        <TouchableOpacity
          onPress={() => router.back()}
          className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
        >
          <Feather name='x' size={19} color={Colors.surface.dark} />
        </TouchableOpacity>
        <Text className='font-geist-mono-semibold text-base uppercase tracking-tight text-surface-dark'>
          {routine.name}
        </Text>
        <Text className='font-geist-mono-semibold text-base tabular-nums text-surface-dark'>
          {elapsed}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps='handled'
      >
        <Text className='font-geist-mono text-xs leading-5 tracking-tight text-ink-soft'>
          Registra lo que hiciste, no tienes que seguir el plan exactamente.
        </Text>

        <View className='mt-9 flex-row items-center justify-between'>
          <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Ejercicios
          </Text>
          <Text className='font-geist-mono text-xs text-ink-muted'>{routine.exercises.length}</Text>
        </View>

        <View className='mt-4 gap-3'>
          {routine.exercises.map((exercise) => {
            const isExpanded = expandedId === exercise.id
            const videoSource = videoForExercise(exercise.catalogExerciseId ?? exercise.id)
            return (
              <View key={exercise.id} className='rounded-3xl bg-surface-muted'>
                {isExpanded && videoSource ? (
                  <Image
                    source={videoSource}
                    resizeMode='contain'
                    className='h-44 w-full rounded-t-3xl bg-surface-card'
                  />
                ) : null}
                <TouchableOpacity
                  onPress={() => toggleExpanded(exercise.id)}
                  activeOpacity={0.82}
                  className='flex-row items-center justify-between p-4'
                >
                  <Text className='flex-1 font-geist-mono-medium text-sm text-surface-dark'>
                    {exercise.name}
                  </Text>
                  <View className='flex-row items-center gap-3'>
                    <View className='rounded-full bg-surface-card px-2.5 py-1'>
                      <Text className='font-geist-mono text-[10px] uppercase tracking-tight text-ink-muted'>
                        {exercise.targetSets} × {exercise.targetReps}
                      </Text>
                    </View>
                    <Feather
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={Colors.ink.muted}
                    />
                  </View>
                </TouchableOpacity>
                {isExpanded ? (
                  <View className='px-4 pb-4'>
                    <View className='gap-2'>
                      <View className='flex-row px-1'>
                        <Text className='w-8 font-geist-mono text-[10px] uppercase tracking-tight text-ink-muted'>
                          Set
                        </Text>
                        <Text className='flex-1 pl-2 font-geist-mono text-[10px] uppercase tracking-tight text-ink-muted'>
                          Kg
                        </Text>
                        <Text className='flex-1 pl-2 font-geist-mono text-[10px] uppercase tracking-tight text-ink-muted'>
                          Reps
                        </Text>
                        <View className='w-8' />
                      </View>
                      {sets[exercise.id].map((set, index) => (
                        <View
                          key={`${exercise.id}-${index}`}
                          className='flex-row items-center gap-2'
                        >
                          <Text className='w-8 text-center font-geist-mono text-xs text-ink-muted'>
                            {index + 1}
                          </Text>
                          <TextInput
                            value={set.weightKg ? String(set.weightKg) : ''}
                            onChangeText={(value) =>
                              updateSet(exercise.id, index, 'weightKg', value)
                            }
                            placeholder='0'
                            keyboardType='decimal-pad'
                            className='flex-1 rounded-2xl bg-surface-card px-3 py-3 font-geist-mono text-sm text-ink'
                          />
                          <TextInput
                            value={set.reps ? String(set.reps) : ''}
                            onChangeText={(value) => updateSet(exercise.id, index, 'reps', value)}
                            placeholder={String(exercise.targetReps)}
                            keyboardType='number-pad'
                            className='flex-1 rounded-2xl bg-surface-card px-3 py-3 font-geist-mono text-sm text-ink'
                          />
                          <TouchableOpacity
                            className='h-10 w-8 items-center justify-center rounded-2xl bg-surface-card'
                            onPress={() => removeSet(exercise.id, index)}
                            accessibilityRole='button'
                            accessibilityLabel={`Eliminar serie ${index + 1} de ${exercise.name}`}
                          >
                            <Feather name='minus' size={16} color={Colors.ink.muted} />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      onPress={() => addSet(exercise.id)}
                      className='mt-3 flex-row items-center self-start'
                    >
                      <Feather name='plus' size={15} color={Colors.surface.dark} />
                      <Text className='ml-1 font-geist-mono text-xs text-surface-dark'>
                        Agregar serie
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/ticket/create/[routineId]',
              params: {
                routineId: routine.id,
                elapsed: String(Math.max(1, Math.round(seconds / 60))),
                sets: JSON.stringify(sets),
              },
            })
          }
          className='mt-8 items-center rounded-3xl bg-surface-dark py-4'
        >
          <Text className='font-geist-mono-semibold text-sm text-surface-card'>
            Terminar entrenamiento
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
