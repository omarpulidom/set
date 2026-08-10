import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GraphPaperCard, PrimaryButton } from '@/components/gym/GymUI'
import { Colors } from '@/components/colors'
import { getMockRoutine } from '@/features/gym/mock-data'
import type { WorkoutSet } from '@/features/gym/types'

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

export default function WorkoutScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const routine = getMockRoutine(routineId)
  const [seconds, setSeconds] = useState(0)
  const [sets, setSets] = useState<Record<string, WorkoutSet[]>>(() =>
    Object.fromEntries(
      routine.exercises.map((exercise) => [
        exercise.id,
        defaultSets(exercise.targetSets),
      ]),
    ),
  )

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

  return (
    <SafeAreaView className='flex-1 bg-surface-canvas'>
      <View className='flex-row items-center justify-between px-6 py-4'>
        <TouchableOpacity onPress={() => router.back()} className='p-2'>
          <Feather name='x' size={24} color={Colors.ink.DEFAULT} />
        </TouchableOpacity>
        <View className='items-center'>
          <Text className='font-geist-mono text-lg font-semibold text-ink'>{routine.name}</Text>
        </View>
        <Text className='font-geist-mono text-base text-ink'>{elapsed}</Text>
      </View>

      <ScrollView
        className='flex-1 px-6'
        contentContainerStyle={{
          paddingBottom: 28,
        }}
      >
        <Text className='mb-4 font-geist-mono text-xs leading-5 text-ink-muted'>
          Registra lo que hiciste, no tienes que seguir el plan exactamente.
        </Text>
        <View className='gap-5'>
          {routine.exercises.map((exercise) => (
            <GraphPaperCard key={exercise.id} className='p-5'>
              <View className='flex-row items-start justify-between'>
                <View>
                  <Text className='font-geist-mono text-base font-semibold text-ink'>
                    {exercise.name}
                  </Text>
                  <Text className='mt-1 font-geist-mono text-xs text-ink-muted'>
                    PLAN · {exercise.targetSets} × {exercise.targetReps}
                  </Text>
                </View>
                <Feather name='more-horizontal' size={20} color={Colors.ink.muted} />
              </View>
              <View className='mt-5 gap-2'>
                <View className='flex-row px-1'>
                  <Text className='w-10 font-geist-mono text-[10px] text-ink-muted'>SET</Text>
                  <Text className='flex-1 font-geist-mono text-[10px] text-ink-muted'>KG</Text>
                  <Text className='flex-1 font-geist-mono text-[10px] text-ink-muted'>REPS</Text>
                  <View className='w-8' />
                </View>
                {sets[exercise.id].map((set, index) => (
                  <View key={`${exercise.id}-${index}`} className='flex-row items-center gap-2'>
                    <Text className='w-8 text-center font-geist-mono text-xs text-ink-muted'>
                      {index + 1}
                    </Text>
                    <TextInput
                      value={set.weightKg ? String(set.weightKg) : ''}
                      onChangeText={(value) => updateSet(exercise.id, index, 'weightKg', value)}
                      placeholder='0'
                      keyboardType='decimal-pad'
                      className='flex-1 border border-border-input bg-surface-card px-3 py-3 font-geist-mono text-ink'
                    />
                    <TextInput
                      value={set.reps ? String(set.reps) : ''}
                      onChangeText={(value) => updateSet(exercise.id, index, 'reps', value)}
                      placeholder={String(exercise.targetReps)}
                      keyboardType='number-pad'
                      className='flex-1 border border-border-input bg-surface-card px-3 py-3 font-geist-mono text-ink'
                    />
                    <TouchableOpacity
                      className='h-10 w-8 items-center justify-center border border-border-input bg-surface-card'
                      onPress={() => removeSet(exercise.id, index)}
                      accessibilityRole='button'
                      accessibilityLabel={`Eliminar serie ${index + 1} de ${exercise.name}`}
                    >
                      <Feather name='minus' size={16} color={Colors.ink.DEFAULT} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => addSet(exercise.id)}
                className='mt-4 flex-row items-center self-start'
              >
                <Feather name='plus' size={15} color={Colors.ink.DEFAULT} />
                <Text className='ml-1 font-geist-mono text-xs text-ink'>Agregar serie</Text>
              </TouchableOpacity>
            </GraphPaperCard>
          ))}
        </View>
        <View className='mt-6'>
          <PrimaryButton
            label='Terminar entrenamiento'
            icon='check'
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
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
