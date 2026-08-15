import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { getMockRoutine } from '@/features/gym/mock-data'
import { formatMuscles } from '@/lib/funcs'

export default function RoutineDetailScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const routine = getMockRoutine(routineId)
  const totalSeries = routine.exercises.reduce((total, exercise) => total + exercise.targetSets, 0)

  return (
    <SafeAreaView
      className='flex-1 bg-surface'
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps='handled'
      >
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/routine/new',
                params: {
                  routineId: routine.id,
                },
              })
            }
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='edit-3' size={17} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>

        <Text className='mt-8 font-geist-mono-semibold text-2xl uppercase tracking-[-1px] text-surface-dark'>
          {routine.name}
        </Text>
        <Text className='mt-1 font-geist-mono text-sm text-ink-muted'>
          {formatMuscles(routine.description)}
        </Text>
        <View className='mt-3 flex-row items-center'>
          <Text className='font-geist-mono text-xs text-ink-muted'>{totalSeries} series</Text>
          <View className='mx-2 h-1 w-1 rounded-full bg-ink-soft' />
          <Text className='font-geist-mono text-xs text-ink-muted'>~60 min</Text>
        </View>

        <View className='mt-9 flex-row items-center justify-between'>
          <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Ejercicios
          </Text>
          <Text className='font-geist-mono text-xs text-ink-muted'>{routine.exercises.length}</Text>
        </View>

        <View className='mt-4 gap-3'>
          {routine.exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              onPress={() =>
                router.push({
                  pathname: '/routine/exercises/[exerciseId]',
                  params: {
                    exerciseId: exercise.catalogExerciseId ?? exercise.id,
                    readOnly: '1',
                  },
                })
              }
              activeOpacity={0.82}
              className='rounded-3xl bg-surface-muted p-4'
            >
              <Text className='font-geist-mono-semibold text-sm text-surface-dark'>
                {exercise.name}
              </Text>
              <Text className='mt-3 font-geist-mono text-xs text-ink-muted'>
                {exercise.targetSets} series · {exercise.targetReps} reps
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/workout/[routineId]',
              params: {
                routineId: routine.id,
              },
            })
          }
          className='mt-8 items-center rounded-3xl bg-surface-dark py-4'
        >
          <Text className='font-geist-mono-semibold text-sm text-surface-card'>
            Iniciar entrenamiento
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
