import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '@/components/colors'
import { GymScreen } from '@/components/gym/GymUI'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import { useRoutinesStore } from '@/features/routines/routines-store'

export default function TrainingTab() {
  const router = useRouter()
  const routine = useRoutinesStore((state) => state.routines[0])

  return (
    <GymScreen title='Entrenar'>
      <ScrollView
        className='flex-1 px-5'
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {routine ? (
          <>
            <View className='mt-2 rounded-3xl border border-border-soft bg-surface-muted p-6'>
              <View className='flex-row items-center justify-between'>
                <Text className='font-geist-mono-semibold text-[10px] tracking-[2px] text-ink-subtle'>
                  ENTRENAMIENTO DE HOY
                </Text>
                <View className='h-10 w-10 items-center justify-center rounded-2xl bg-surface-dark'>
                  <Feather name='activity' size={15} color={Colors.surface.card} />
                </View>
              </View>

              <Text className='mt-7 font-geist-mono-semibold text-4xl tracking-[-2px] text-surface-dark'>
                {routine.name}
              </Text>
              <Text className='mt-2 font-geist-mono text-sm leading-5 text-ink-subtle'>
                {routine.description}
              </Text>

              <View className='mt-6 flex-row border-t border-border-soft pt-4'>
                <View className='flex-1'>
                  <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-subtle'>
                    EJERCICIOS
                  </Text>
                  <Text className='mt-1 font-geist-mono-semibold text-sm text-surface-dark'>
                    {routine.exercises.length}
                  </Text>
                </View>
                <View className='flex-1 border-l border-border-soft pl-4'>
                  <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-subtle'>
                    DURACIÓN
                  </Text>
                  <Text className='mt-1 font-geist-mono-semibold text-sm text-surface-dark'>
                    ~60 min
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                className='mt-6 flex-row items-center justify-between rounded-2xl bg-surface-dark px-5 py-4'
                onPress={() =>
                  router.push({
                    pathname: '/workout/[routineId]',
                    params: {
                      routineId: routine.id,
                    },
                  })
                }
              >
                <Text className='font-geist-mono-semibold text-sm text-surface-card'>
                  INICIAR ENTRENAMIENTO
                </Text>
                <Feather name='arrow-up-right' size={17} color={Colors.surface.card} />
              </TouchableOpacity>
            </View>

            <View className='mt-7 flex-row items-end justify-between'>
              <View>
                <Text className='font-geist-mono text-[10px] tracking-[2px] text-ink-subtle'>
                  RUTINA
                </Text>
                <Text className='mt-1 font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
                  Lo que harás hoy
                </Text>
              </View>
              <TouchableOpacity
                className='mb-0.5 flex-row items-center'
                onPress={() =>
                  router.push({
                    pathname: '/routine/[routineId]',
                    params: {
                      routineId: routine.id,
                    },
                  })
                }
              >
                <Text className='font-geist-mono-medium text-xs text-surface-dark'>VER RUTINA</Text>
                <Feather
                  name='arrow-up-right'
                  size={14}
                  color={Colors.surface.dark}
                  style={{
                    marginLeft: 5,
                  }}
                />
              </TouchableOpacity>
            </View>

            <View className='mt-3 overflow-hidden rounded-3xl border border-border-soft bg-surface-muted'>
              {routine.exercises.map((exercise, index) => (
                <View
                  key={exercise.id}
                  className={`flex-row items-center justify-between px-5 py-4 ${index ? 'border-t border-border-soft' : ''}`}
                >
                  <View className='flex-row items-center'>
                    <View className='mr-3 h-9 w-9 items-center justify-center rounded-full bg-surface-soft'>
                      <Text className='font-geist-mono-semibold text-[10px] text-surface-dark'>
                        0{index + 1}
                      </Text>
                    </View>
                    <View>
                      <Text className='font-geist-mono-semibold text-sm text-surface-dark'>
                        {getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}
                      </Text>
                      <Text className='mt-1 font-geist-mono text-[10px] text-ink-subtle'>
                        {exercise.targetSets} series · {exercise.targetReps} reps
                      </Text>
                    </View>
                  </View>
                  <Feather name='chevron-right' size={18} color={Colors.ink.soft} />
                </View>
              ))}
            </View>
          </>
        ) : (
          <View className='mt-7 items-center rounded-3xl border border-dashed border-border-dashed bg-surface-muted px-6 py-12'>
            <Feather name='activity' size={28} color={Colors.ink.soft} />
            <Text className='mt-4 text-center font-geist-mono-semibold text-sm text-surface-dark'>
              Sin entrenamiento para hoy
            </Text>
            <Text className='mt-2 text-center font-geist-mono text-xs text-ink-muted'>
              Crea una rutina para ver aquí el entrenamiento del día.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/routine/new')}
              className='mt-5 flex-row items-center rounded-3xl bg-surface-dark px-5 py-3'
            >
              <Feather name='plus' size={15} color={Colors.surface.card} />
              <Text className='ml-2 font-geist-mono-semibold text-xs uppercase text-surface-card'>
                Nueva rutina
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </GymScreen>
  )
}
