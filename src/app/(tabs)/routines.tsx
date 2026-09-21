import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
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
            <View className='mt-4 gap-3'>
              {routines.map((routine) => (
                <TouchableOpacity
                  key={routine.id}
                  onPress={() =>
                    router.push({
                      pathname: '/routine/[routineId]',
                      params: {
                        routineId: routine.id,
                      },
                    })
                  }
                  activeOpacity={0.86}
                  className='rounded-3xl border border-border-soft bg-surface-muted p-5'
                >
                  <View className='flex-row items-start justify-between'>
                    <View className='flex-1 pr-4'>
                      <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
                        {routine.name}
                      </Text>
                      <Text
                        numberOfLines={2}
                        className='mt-3 font-geist-mono text-xs uppercase leading-4 text-ink-muted'
                      >
                        {getPrimaryMuscles(
                          routine.exercises.map((exercise) => exercise.catalogExerciseId),
                        ).join(' · ')}
                      </Text>
                    </View>
                    <Feather name='arrow-up-right' size={14} color={Colors.surface.dark} />
                  </View>
                  <View className='mt-5 flex-row border-t border-border-soft pt-4'>
                    <View className='flex-1'>
                      <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                        SERIES
                      </Text>
                      <Text className='mt-1 font-geist-mono-medium text-lg text-surface-dark'>
                        {routine.exercises.reduce(
                          (total, exercise) => total + (exercise?.targetSets ?? 0),
                          0,
                        )}
                      </Text>
                    </View>
                    <View className='flex-1 border-l border-border-soft pl-4'>
                      <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
                        DURACIÓN
                      </Text>
                      <Text className='mt-1 font-geist-mono-medium text-lg text-surface-dark'>
                        ~60 MIN
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
