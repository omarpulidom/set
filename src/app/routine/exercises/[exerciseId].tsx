import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { NumberRuler } from '@/components/NumberRuler'
import {
  getCatalogExercise,
  imageForExercise,
  videoForExercise,
} from '@/features/exercises/catalog'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'

export default function ExerciseDetailScreen() {
  const router = useRouter()
  const { draftExerciseId, exerciseId, readOnly } = useLocalSearchParams<{
    draftExerciseId?: string
    exerciseId: string
    readOnly?: string
  }>()
  const isReadOnly = Boolean(readOnly)
  const exercise = getCatalogExercise(exerciseId)
  const addExercise = useRoutineDraftStore((state) => state.addExercise)
  const updateExercise = useRoutineDraftStore((state) => state.updateExercise)
  const draftExercise = useRoutineDraftStore((state) =>
    state.exercises.find((item) => item.id === draftExerciseId),
  )
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
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
        >
          <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
        </TouchableOpacity>

        <Image
          source={videoForExercise(selectedExercise.id) ?? imageForExercise(selectedExercise.id)}
          resizeMode='contain'
          className='mt-7 h-44 w-44 self-center rounded-3xl bg-surface-muted'
        />

        <Text className='mt-7 font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
          {selectedExercise.name}
        </Text>
        <Text className='mt-2 font-geist-mono text-xs text-ink-muted'>
          {selectedExercise.target} · {selectedExercise.equipment}
        </Text>

        <View className='mt-5 rounded-3xl bg-surface-muted p-3'>
          <View className='flex-row'>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[9px] text-ink-muted'>Zona corporal</Text>
              <Text className='mt-0.5 font-geist-mono text-[10px] text-surface-dark'>
                {selectedExercise.body_part}
              </Text>
            </View>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[9px] text-ink-muted'>Equipo</Text>
              <Text className='mt-0.5 font-geist-mono text-[10px] text-surface-dark'>
                {selectedExercise.equipment}
              </Text>
            </View>
          </View>
          <View className='mt-4 border-t border-border-soft pt-3'>
            <Text className='font-geist-mono text-[9px] text-ink-muted'>Músculo principal</Text>
            <Text className='mt-0.5 font-geist-mono text-[10px] text-surface-dark'>
              {selectedExercise.muscle_group} · {selectedExercise.target}
            </Text>
            <Text className='mt-3 font-geist-mono text-[9px] text-ink-muted'>
              Músculos secundarios
            </Text>
            <Text className='mt-0.5 font-geist-mono text-[10px] leading-4 text-surface-dark'>
              {selectedExercise.secondary_muscles.join(' · ')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setInstructionsVisible((visible) => !visible)}
          className='mt-5 flex-row items-center self-start'
        >
          <Text className='font-geist-mono text-sm text-surface-dark'>
            {instructionsVisible ? 'Ocultar instrucciones' : 'Mostrar instrucciones'}
          </Text>
          <Feather
            name={instructionsVisible ? 'chevron-up' : 'chevron-down'}
            size={17}
            color={Colors.surface.dark}
            style={{
              marginLeft: 8,
            }}
          />
        </TouchableOpacity>
        {instructionsVisible ? (
          <View className='mt-4 gap-3'>
            {selectedExercise.instruction_steps.es.map((step, index) => (
              <View key={`${selectedExercise.id}-${index}`} className='flex-row'>
                <Text className='mr-3 font-geist-mono text-xs text-surface-dark'>{index + 1}.</Text>
                <Text className='flex-1 font-geist-mono text-sm leading-6 text-ink-muted'>
                  {step}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {isReadOnly ? null : (
          <>
            <NumberRuler label='Series' value={sets} min={1} max={12} onValueChange={setSets} />
            <NumberRuler label='Reps' value={reps} min={1} max={30} onValueChange={setReps} />
          </>
        )}

        {isReadOnly ? null : (
          <TouchableOpacity
            onPress={addToRoutine}
            className='mt-8 items-center rounded-3xl bg-surface-dark py-4'
          >
            <Text className='font-geist-mono-semibold text-sm text-surface-card'>
              {draftExercise ? 'Guardar cambios' : 'Añadir a rutina'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
