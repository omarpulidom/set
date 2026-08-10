import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { getCatalogExercise, imageForExercise } from '@/features/exercises/catalog'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'

const TICK_WIDTH = 30

function NumberRuler({
  label,
  value,
  min,
  max,
  onValueChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onValueChange: (value: number) => void
}) {
  const { width } = useWindowDimensions()
  const scrollRef = useRef<ScrollView>(null)
  const sidePadding = (width - 40 - TICK_WIDTH) / 2
  const values = Array.from({ length: max - min + 1 }, (_, index) => min + index)

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: (value - min) * TICK_WIDTH, animated: false })
  }, [])

  function updateFromOffset(offset: number) {
    const index = Math.round(offset / TICK_WIDTH)
    const alignedOffset = index * TICK_WIDTH
    if (Math.abs(offset - alignedOffset) <= 3) {
      onValueChange(Math.max(min, Math.min(max, min + index)))
    }
  }

  return (
    <View className='mt-8'>
      <Text className='font-geist-mono text-xs text-ink-muted'>{label}</Text>
      <View className='mt-3 h-24 overflow-hidden'>
        <View className='absolute left-0 right-0 top-0 z-10 items-center'>
          <View className='rounded-full bg-surface-dark px-3 py-1.5'>
            <Text className='font-geist-mono-semibold text-sm text-surface-card'>{value}</Text>
          </View>
        </View>
        <View pointerEvents='none' style={{ position: 'absolute', left: '50%', top: 50, marginLeft: -1, height: 36, width: 2, zIndex: 10, backgroundColor: Colors.surface.dark }} />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_WIDTH}
          decelerationRate='fast'
          contentContainerStyle={{ paddingHorizontal: sidePadding, paddingTop: 50 }}
          onScroll={(event) => updateFromOffset(event.nativeEvent.contentOffset.x)}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / TICK_WIDTH)
            onValueChange(Math.max(min, Math.min(max, min + index)))
          }}
          scrollEventThrottle={16}
        >
          {values.map((item) => (
            <View key={item} style={{ width: TICK_WIDTH }} className='h-10 items-center justify-end'>
              <View className={`w-0.5 rounded-full ${item % 5 === 0 ? 'h-7 bg-surface-soft' : 'h-5 bg-surface-soft'}`} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}

export default function ExerciseDetailScreen() {
  const router = useRouter()
  const { draftExerciseId, exerciseId } = useLocalSearchParams<{ draftExerciseId?: string; exerciseId: string }>()
  const exercise = getCatalogExercise(exerciseId)
  const addExercise = useRoutineDraftStore((state) => state.addExercise)
  const updateExercise = useRoutineDraftStore((state) => state.updateExercise)
  const draftExercise = useRoutineDraftStore((state) => state.exercises.find((item) => item.id === draftExerciseId))
  const [sets, setSets] = useState(draftExercise?.targetSets ?? 3)
  const [reps, setReps] = useState(draftExercise?.targetReps ?? 10)
  const [instructionsVisible, setInstructionsVisible] = useState(false)

  if (!exercise) return null
  const selectedExercise = exercise

  function addToRoutine() {
    if (draftExercise) {
      updateExercise(draftExercise.id, 'targetSets', sets)
      updateExercise(draftExercise.id, 'targetReps', reps)
      router.back()
      return
    }
    addExercise(selectedExercise, sets, reps)
    router.dismiss(2)
  }

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <TouchableOpacity onPress={() => router.back()} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'>
          <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
        </TouchableOpacity>

        <Image source={imageForExercise(selectedExercise.id)} resizeMode='contain' className='mt-7 h-44 w-44 self-center rounded-3xl bg-surface-muted' />

        <Text className='mt-7 font-geist-mono-semibold text-3xl tracking-[-1px] text-surface-dark'>{selectedExercise.name}</Text>
        <Text className='mt-2 font-geist-mono text-xs text-ink-muted'>{selectedExercise.target} · {selectedExercise.equipment}</Text>

        <View className='mt-5 rounded-3xl bg-surface-muted p-3'>
          <View className='flex-row'>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[9px] text-ink-muted'>Zona corporal</Text>
              <Text className='mt-0.5 font-geist-mono text-[10px] text-surface-dark'>{selectedExercise.body_part}</Text>
            </View>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[9px] text-ink-muted'>Equipo</Text>
              <Text className='mt-0.5 font-geist-mono text-[10px] text-surface-dark'>{selectedExercise.equipment}</Text>
            </View>
          </View>
          <View className='mt-4 border-t border-border-soft pt-3'>
            <Text className='font-geist-mono text-[9px] text-ink-muted'>Músculo principal</Text>
            <Text className='mt-0.5 font-geist-mono text-[10px] text-surface-dark'>{selectedExercise.muscle_group} · {selectedExercise.target}</Text>
            <Text className='mt-3 font-geist-mono text-[9px] text-ink-muted'>Músculos secundarios</Text>
            <Text className='mt-0.5 font-geist-mono text-[10px] leading-4 text-surface-dark'>{selectedExercise.secondary_muscles.join(' · ')}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setInstructionsVisible((visible) => !visible)} className='mt-5 flex-row items-center self-start'>
          <Text className='font-geist-mono text-sm text-surface-dark'>{instructionsVisible ? 'Ocultar instrucciones' : 'Mostrar instrucciones'}</Text>
          <Feather name={instructionsVisible ? 'chevron-up' : 'chevron-down'} size={17} color={Colors.surface.dark} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        {instructionsVisible ? (
          <View className='mt-4 gap-3'>
            {selectedExercise.instruction_steps.es.map((step, index) => (
              <View key={`${selectedExercise.id}-${index}`} className='flex-row'>
                <Text className='mr-3 font-geist-mono text-xs text-surface-dark'>{index + 1}.</Text>
                <Text className='flex-1 font-geist-mono text-sm leading-6 text-ink-muted'>{step}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <NumberRuler label='Series' value={sets} min={1} max={12} onValueChange={setSets} />
        <NumberRuler label='Reps' value={reps} min={1} max={30} onValueChange={setReps} />

        <TouchableOpacity onPress={addToRoutine} className='mt-8 items-center rounded-3xl bg-surface-dark py-4'>
          <Text className='font-geist-mono-semibold text-sm text-surface-card'>{draftExercise ? 'Guardar cambios' : 'Añadir a rutina'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
