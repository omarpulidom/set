import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { RoutinePaper, RoutineRule } from '@/components/routines/RoutinePaper'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import { getExercisePrimaryMuscleLabel } from '@/features/exercises/muscles'
import { useRoutinesStore } from '@/features/routines/routines-store'

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

  const totalSeries = routine.exercises.reduce(
    (total, exercise) => total + (exercise?.targetSets ?? 0),
    0,
  )
  const primaryMuscles = [
    ...new Set(
      routine.exercises
        .map((exercise) => getExercisePrimaryMuscleLabel(exercise.catalogExerciseId))
        .filter((muscle): muscle is string => Boolean(muscle)),
    ),
  ]

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
          flexGrow: 1,
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

        <RoutinePaper className='mt-8 flex-1'>
          <Text className='font-geist-mono-semibold text-3xl uppercase leading-none tracking-[-2px] text-surface-dark'>
            {routine.name}
          </Text>
          <View className='mt-5 border-l-2 border-surface-dark pl-3'>
            <Text className='font-geist-mono text-[10px] tracking-[1.5px] text-ink-muted'>
              MÚSCULOS TRABAJADOS
            </Text>
            <View className='mt-2 gap-1'>
              {primaryMuscles.map((muscle) => (
                <Text key={muscle} className='font-geist-mono-medium text-sm text-surface-dark'>
                  {muscle}
                </Text>
              ))}
            </View>
          </View>
          <View className='my-5'>
            <RoutineRule />
          </View>
          <View className='flex-row'>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                SERIES
              </Text>
              <Text className='mt-1 font-geist-mono-semibold text-xl text-surface-dark'>
                {totalSeries}
              </Text>
            </View>
            <View className='flex-1 border-l border-border-soft pl-4'>
              <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                DURACIÓN
              </Text>
              <Text className='mt-1 font-geist-mono-semibold text-xl text-surface-dark'>
                ~60 MIN
              </Text>
            </View>
          </View>
          <View className='my-5'>
            <RoutineRule />
          </View>
          <View className='border border-surface-dark'>
            <View className='flex-row border-b border-surface-dark'>
              <Text className='flex-1 px-3 py-2 font-geist-mono-semibold text-[12px] tracking-[1px] text-surface-dark'>
                EJERCICIO
              </Text>
              <View className='w-20 justify-center border-l border-surface-dark px-2 py-2'>
                <Text className='text-right font-geist-mono-semibold text-[12px] tracking-[1px] text-surface-dark'>
                  SERIES
                </Text>
              </View>
              <View className='w-16 justify-center border-l border-surface-dark px-2 py-2'>
                <Text className='text-right font-geist-mono-semibold text-[12px] tracking-[1px] text-surface-dark'>
                  REPS
                </Text>
              </View>
            </View>
            {routine.exercises.filter(Boolean).map((exercise) => (
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
                className='flex-row items-stretch justify-between border-b border-surface-dark last:border-b-0'
              >
                <Text className='flex-1 px-3 py-2 font-geist-mono text-sm text-surface-dark'>
                  {getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}
                </Text>
                <View className='w-20 justify-center border-l border-surface-dark px-2 py-2'>
                  <Text className='text-right font-geist-mono text-sm text-surface-dark'>
                    {exercise.targetSets}
                  </Text>
                </View>
                <View className='w-16 justify-center border-l border-surface-dark px-2 py-2'>
                  <Text className='text-right font-geist-mono text-sm text-surface-dark'>
                    {exercise.targetReps}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </RoutinePaper>

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
