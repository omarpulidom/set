import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GraphPaperCard, Pill, PrimaryButton } from '@/components/gym/GymUI'
import { Colors } from '@/components/colors'
import { getMockRoutine } from '@/features/gym/mock-data'

export default function RoutineDetailScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const routine = getMockRoutine(routineId)

  return (
    <SafeAreaView className='flex-1 bg-surface-canvas'>
      <ScrollView
        contentContainerStyle={{
          padding: 24,
          paddingBottom: 40,
        }}
      >
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity className='p-2' onPress={() => router.back()}>
            <Feather name='arrow-left' size={22} color={Colors.ink.DEFAULT} />
          </TouchableOpacity>
          <TouchableOpacity className='p-2' onPress={() => {}}>
            <Feather name='edit-3' size={19} color={Colors.ink.DEFAULT} />
          </TouchableOpacity>
        </View>
        <GraphPaperCard className='mt-5 p-6'>
          <Text className='font-geist-mono text-4xl uppercase font-semibold tracking-[-2px] text-ink'>
            {routine.name}
          </Text>
          <Text className='mt-3 font-geist-mono text-xs uppercase leading-5 tracking-tight text-ink'>
            {routine.description}
          </Text>
          <View className='mt-5 flex-row gap-2'>
            <Pill>{routine.exercises.length} ejercicios</Pill>
            <Pill>~60 min</Pill>
          </View>
        </GraphPaperCard>

        <GraphPaperCard className='mt-7'>
          {routine.exercises.map((exercise, index) => (
            <View
              key={exercise.id}
              className={`flex-row items-center justify-between p-5 ${index ? 'border-t border-border-muted' : ''}`}
            >
              <View className='flex-row items-center'>
                <Text className='mr-4 font-geist-mono text-xs text-chart-muted'>
                  {String(index + 1).padStart(2, '0')}
                </Text>
                <View>
                  <Text className='font-geist-mono text-sm font-semibold text-ink'>
                    {exercise.name}
                  </Text>
                  <Text className='mt-1 font-geist-mono text-xs text-ink-muted'>
                    {exercise.targetSets} SERIES × {exercise.targetReps} REPS
                  </Text>
                </View>
              </View>
              <Feather name='more-vertical' size={18} color={Colors.chart.muted} />
            </View>
          ))}
        </GraphPaperCard>
        <View className='mt-6'>
          <PrimaryButton
            label='Iniciar entrenamiento'
            icon='play'
            onPress={() =>
              router.push({
                pathname: '/workout/[routineId]',
                params: {
                  routineId: routine.id,
                },
              })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
