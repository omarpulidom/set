import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { RoutinePaper, RoutineRule } from '@/components/routines/RoutinePaper'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import { useDerivedPrimaryFocus, useDerivedRoutineFocus } from '@/features/exercises/muscles'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'
import { useRoutinesStore } from '@/features/routines/routines-store'

export default function NewRoutineScreen() {
  const router = useRouter()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const { editingId, exercises, name, removeExercise, reset, setName, loadForEdit } =
    useRoutineDraftStore()
  const derivedFocus = useDerivedRoutineFocus()
  const primaryFocus = useDerivedPrimaryFocus()
  const canSave = Boolean(name.trim() && exercises.length)
  const totalSeries = exercises.reduce((total, exercise) => total + exercise.targetSets, 0)
  const primaryMuscles = primaryFocus ? primaryFocus.split(/,\s*|\s+y\s+/) : []

  useEffect(() => {
    if (routineId && editingId !== routineId) {
      loadForEdit(routineId)
    }
  }, [
    routineId,
    editingId,
    loadForEdit,
  ])

  function saveRoutine() {
    if (!canSave) return
    const payload = exercises.map((exercise) => ({
      id: exercise.id,
      catalogExerciseId: exercise.catalogExerciseId,
      name: exercise.name,
      targetSets: exercise.targetSets || 1,
      targetReps: exercise.targetReps || 1,
    }))
    const { createRoutine, updateRoutine } = useRoutinesStore.getState()
    if (editingId) {
      const existing = useRoutinesStore.getState().getRoutine(editingId)
      updateRoutine(editingId, {
        name: name.trim(),
        description: derivedFocus || existing?.description,
        exercises: payload,
      })
    } else {
      createRoutine({
        name: name.trim(),
        description: derivedFocus,
        exercises: payload,
      })
    }
    reset()
    router.back()
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
      <View className='flex-1 px-5 pb-10 pt-5'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => {
              reset()
              router.back()
            }}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>

        <RoutinePaper className='mt-8 flex-1 pt-12' topRule={false}>
          <ScrollView
            className='flex-1'
            contentContainerStyle={{
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='Nombre de rutina'
              placeholderTextColor={Colors.ink.soft}
              className='-my-1 h-12 py-1 font-geist-mono-semibold text-3xl uppercase tracking-[-2px] text-surface-dark'
            />
            <View className='mt-5'>
              <RoutineRule />
            </View>
            <View className='mt-5 border-l-2 border-surface-dark pl-3'>
              <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
                Músculos trabajados
              </Text>
              {primaryMuscles.length ? (
                <View className='mt-2 gap-1'>
                  {primaryMuscles.map((muscle) => (
                    <Text
                      key={muscle}
                      className='font-geist-mono-medium text-sm uppercase text-surface-dark'
                    >
                      {muscle}
                    </Text>
                  ))}
                </View>
              ) : (
                <Text className='mt-2 font-geist-mono text-xs text-ink-soft'>
                  Agrega ejercicios para ver los músculos trabajados
                </Text>
              )}
            </View>
            <View className='my-5'>
              <RoutineRule />
            </View>
            <View className='flex-row'>
              <View className='flex-1'>
                <Text className='font-geist-mono text-[10px] uppercase tracking-[1px] text-ink-muted'>
                  Ejercicios
                </Text>
                <Text className='mt-1 font-geist-mono-medium text-[16px] text-surface-dark'>
                  {exercises.length}
                </Text>
              </View>
              <View className='flex-1 border-l border-border-soft pl-4'>
                <Text className='font-geist-mono text-[10px] uppercase tracking-[1px] text-ink-muted'>
                  Series
                </Text>
                <Text className='mt-1 font-geist-mono-medium text-[16px] text-surface-dark'>
                  {totalSeries}
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
                <Text className='w-20 border-l border-surface-dark px-2 py-2 text-right font-geist-mono-semibold text-[12px] tracking-[1px] text-surface-dark'>
                  SERIES
                </Text>
                <Text className='w-16 border-l border-surface-dark px-2 py-2 text-right font-geist-mono-semibold text-[12px] tracking-[1px] text-surface-dark'>
                  REPS
                </Text>
                <View className='w-8 border-l border-surface-dark' />
              </View>
              {exercises.map((exercise, index) => (
                <TouchableOpacity
                  key={exercise.id}
                  onPress={() =>
                    router.push({
                      pathname: '/routine/exercises/[exerciseId]',
                      params: {
                        exerciseId: exercise.catalogExerciseId,
                        draftExerciseId: exercise.id,
                      },
                    })
                  }
                  activeOpacity={0.82}
                  className='relative flex-row items-stretch'
                >
                  <Text className='flex-1 px-3 py-2 font-geist-mono text-sm uppercase text-surface-dark'>
                    {getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}
                  </Text>
                  <Text className='w-20 border-l border-surface-dark px-2 py-2 text-right font-geist-mono text-sm text-surface-dark'>
                    {exercise.targetSets}
                  </Text>
                  <Text className='w-16 border-l border-surface-dark px-2 py-2 text-right font-geist-mono text-sm text-surface-dark'>
                    {exercise.targetReps}
                  </Text>
                  <View className='w-8 items-center justify-center border-l border-surface-dark'>
                    <TouchableOpacity
                      onPress={(event) => {
                        event.stopPropagation()
                        removeExercise(exercise.id)
                      }}
                      className='h-6 w-6 items-center justify-center'
                    >
                      <Feather name='x' size={12} color={Colors.ink.soft} />
                    </TouchableOpacity>
                  </View>
                  {index < exercises.length - 1 && (
                    <View className='absolute bottom-0 left-0 right-0 h-px bg-border-warm' />
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => router.push('/routine/exercises')}
                className='flex-row items-center border-t border-surface-dark px-3 py-3'
              >
                <Feather name='plus' size={15} color={Colors.surface.dark} />
                <Text className='ml-2 font-geist-mono-medium text-xs uppercase text-surface-dark'>
                  Añadir ejercicio
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </RoutinePaper>

        <TouchableOpacity
          onPress={saveRoutine}
          disabled={!canSave}
          className={`mt-4 items-center rounded-3xl py-4 ${canSave ? 'bg-surface-dark' : 'bg-surface-soft'}`}
        >
          <Text
            className={`font-geist-mono-semibold text-sm uppercase ${canSave ? 'text-surface-card' : 'text-ink-muted'}`}
          >
            Guardar rutina
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
