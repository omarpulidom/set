import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { RoutinePaper } from '@/components/routines/RoutinePaper'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import { useDerivedPrimaryFocus, useDerivedRoutineFocus } from '@/features/exercises/muscles'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { formatMuscles } from '@/lib/funcs'

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
            onPress={() => {
              reset()
              router.back()
            }}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>

        <Text className='mt-8 font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
          {editingId ? 'EDITAR RUTINA' : 'NUEVA RUTINA'}
        </Text>

        <RoutinePaper className='mt-8 flex-1'>
          <Text className='font-geist-mono text-[10px] tracking-[1.5px] text-ink-muted'>
            DATOS DE RUTINA
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder='Nombre de rutina'
            placeholderTextColor={Colors.ink.soft}
            className='mt-4 border-b border-border-soft py-3 font-geist-mono text-base text-surface-dark'
          />

          <View className='mt-3'>
            {primaryFocus ? (
              <View className='border-t border-dashed border-border-dashed pt-4'>
                <Text className='font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-muted'>
                  Músculos trabajados
                </Text>
                <Text className='mt-1 font-geist-mono text-sm text-surface-dark'>
                  {formatMuscles(primaryFocus)}
                </Text>
              </View>
            ) : (
              <Text className='font-geist-mono text-xs text-ink-soft'>
                Agrega ejercicios para ver los músculos trabajados
              </Text>
            )}
          </View>
          <View className='my-5'>
            <View className='border-t border-dashed border-border-dashed' />
          </View>
          <View className='flex-row items-center justify-between'>
            <Text className='font-geist-mono text-[10px] tracking-[1.5px] text-ink-muted'>
              Ejercicios
            </Text>
            <Text className='font-geist-mono text-xs text-ink-muted'>{exercises.length}</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/routine/exercises')}
            className='mt-4 flex-row items-center justify-between border-y border-border-soft py-4'
          >
            <Text className='font-geist-mono text-sm text-ink-muted'>Buscar ejercicios</Text>
            <Feather name='plus' size={18} color={Colors.surface.dark} />
          </TouchableOpacity>

          {exercises.length === 0 ? (
            <Text className='mt-3 font-geist-mono text-xs text-ink-soft'>
              Empieza agregando ejercicios para armar tu rutina
            </Text>
          ) : null}

          <View className='mt-4 gap-3'>
            {exercises.map((exercise) => (
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
                className='border-b border-border-soft py-4'
              >
                <View className='flex-row items-center justify-between'>
                  <Text className='flex-1 font-geist-mono-semibold text-sm text-surface-dark'>
                    {getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}
                  </Text>
                  <TouchableOpacity
                    onPress={(event) => {
                      event.stopPropagation()
                      removeExercise(exercise.id)
                    }}
                    className='ml-3 h-7 w-7 items-center justify-center rounded-full bg-surface-card'
                  >
                    <Feather name='x' size={14} color={Colors.ink.soft} />
                  </TouchableOpacity>
                </View>
                <Text className='mt-3 font-geist-mono text-xs text-ink-muted'>
                  {exercise.targetSets} series · {exercise.targetReps} reps
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </RoutinePaper>

        {exercises.length ? (
          <TouchableOpacity
            onPress={saveRoutine}
            disabled={!canSave}
            className={`mt-8 items-center rounded-3xl py-4 ${canSave ? 'bg-surface-dark' : 'bg-surface-soft'}`}
          >
            <Text
              className={`font-geist-mono-semibold text-sm ${canSave ? 'text-surface-card' : 'text-ink-muted'}`}
            >
              Guardar rutina
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}
