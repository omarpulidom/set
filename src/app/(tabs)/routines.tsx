import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { RoutinePaper, RoutineRule } from '@/components/routines/RoutinePaper'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import { getExercisePrimaryMuscleLabel } from '@/features/exercises/muscles'
import { useRoutinesStore } from '@/features/routines/routines-store'

function getPrimaryMuscles(catalogExerciseIds: (string | undefined)[]) {
  return [
    ...new Set(
      catalogExerciseIds
        .map((id) => getExercisePrimaryMuscleLabel(id))
        .filter((muscle): muscle is string => Boolean(muscle)),
    ),
  ]
}

export default function RoutinesTab() {
  const router = useRouter()
  const { width } = useWindowDimensions()
  const routines = useRoutinesStore((state) => state.routines)

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
        className='flex-1 px-5'
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <View className='flex-row justify-end'>
          <TouchableOpacity
            onPress={() => router.push('/routine/new')}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-dark'
          >
            <Feather name='plus' size={19} color={Colors.surface.card} />
          </TouchableOpacity>
        </View>

        <View className='mt-7 flex-1'>
          <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Rutinas
          </Text>

          {routines.length === 0 ? (
            <View className='mt-10'>
              <Text className='font-geist-mono text-sm text-ink-muted'>Sin rutinas aún.</Text>
              <TouchableOpacity
                onPress={() => router.push('/routine/new')}
                className='mt-4 flex-row items-center self-start'
              >
                <Feather name='plus' size={15} color={Colors.surface.dark} />
                <Text className='ml-2 font-geist-mono-semibold text-xs uppercase text-surface-dark'>
                  Crear rutina
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className='mt-4 flex-1'
              contentContainerStyle={{
                gap: 16,
              }}
            >
              {routines.map((routine) => (
                <View
                  key={routine.id}
                  className='flex-1'
                  style={{
                    width: width - 40,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: '/routine/[routineId]',
                        params: {
                          routineId: routine.id,
                        },
                      })
                    }
                    activeOpacity={0.86}
                    className='flex-1'
                  >
                    <RoutinePaper className='flex-1'>
                      <View className='flex-row items-start justify-between'>
                        <View className='flex-1 pr-4'>
                          <Text className='font-geist-mono text-[10px] tracking-[1.5px] text-ink-muted'>
                            RUTINA
                          </Text>
                          <Text className='mt-2 font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
                            {routine.name}
                          </Text>
                          <View className='mt-4 border-l-2 border-surface-dark pl-3'>
                            <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                              MÚSCULOS PRINCIPALES
                            </Text>
                            <Text
                              numberOfLines={2}
                              className='mt-1 font-geist-mono-medium text-xs leading-4 text-surface-dark'
                            >
                              {getPrimaryMuscles(
                                routine.exercises.map((exercise) => exercise.catalogExerciseId),
                              ).join(' · ')}
                            </Text>
                          </View>
                        </View>
                        <Feather name='arrow-up-right' size={14} color={Colors.surface.dark} />
                      </View>
                      <View className='my-4'>
                        <RoutineRule />
                      </View>
                      <View className='flex-row'>
                        <View className='w-2/5'>
                          <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                            SERIES
                          </Text>
                          <Text className='mt-1 font-geist-mono-semibold text-lg text-surface-dark'>
                            {routine.exercises.reduce(
                              (total, exercise) => total + (exercise?.targetSets ?? 0),
                              0,
                            )}
                          </Text>
                        </View>
                        <View className='w-3/5 border-l border-border-soft pl-4'>
                          <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                            EJERCICIOS
                          </Text>
                          <View className='mt-2 border-t border-border-soft'>
                            {routine.exercises
                              .filter(Boolean)
                              .slice(0, 3)
                              .map((exercise) => (
                                <View
                                  key={exercise.id}
                                  className='flex-row items-center justify-between border-b border-border-soft py-1.5'
                                >
                                  <Text
                                    numberOfLines={1}
                                    className='flex-1 pr-2 font-geist-mono text-[10px] text-surface-dark'
                                  >
                                    {getExerciseDisplayNameById(
                                      exercise.catalogExerciseId,
                                      exercise.name,
                                    )}
                                  </Text>
                                  <Text className='font-geist-mono text-[10px] text-ink-muted'>
                                    {exercise.targetSets}×{exercise.targetReps}
                                  </Text>
                                </View>
                              ))}
                            {routine.exercises.length > 3 ? (
                              <Text className='font-geist-mono text-xs text-ink-muted'>…</Text>
                            ) : null}
                          </View>
                        </View>
                      </View>
                    </RoutinePaper>
                  </TouchableOpacity>
                  <Text className='mt-3 text-center font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                    {routines.indexOf(routine) + 1} / {routines.length} · DESLIZA
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
