import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { formatMuscles } from '@/lib/funcs'

export default function RoutineDetailScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const routine = useRoutinesStore((state) => state.routines.find((item) => item.id === routineId))

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
        <View className='flex-row items-center justify-between p-5'>
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
          <TouchableOpacity
            onPress={() => router.replace('/routines')}
            className='mt-6 items-center rounded-3xl bg-surface-dark px-6 py-3'
          >
            <Text className='font-geist-mono-semibold text-sm text-surface-card'>
              Ver mis rutinas
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const totalSeries = routine.exercises.reduce((total, exercise) => total + exercise.targetSets, 0)

  function handleDelete() {
    Alert.alert(
      'Eliminar rutina',
      `¿Seguro que quieres eliminar "${routine.name}"? Se perderá la configuración.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            useRoutinesStore.getState().deleteRoutine(routine.id)
            router.replace('/routines')
          },
        },
      ],
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
              <Text className='font-geist-mono-medium text-sm text-surface-dark'>
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

        <TouchableOpacity onPress={handleDelete} className='mt-6 flex-row items-center self-start'>
          <Feather name='trash-2' size={15} color={Colors.ink.soft} />
          <Text className='ml-2 font-geist-mono text-xs text-ink-soft'>Eliminar rutina</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
