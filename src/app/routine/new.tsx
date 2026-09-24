import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useCallback, useEffect } from 'react'
import { type ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedRef } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import Sortable, {
  type SortableGridDragEndParams,
  type SortableGridRenderItem,
} from 'react-native-sortables'
import { Colors } from '@/components/colors'
import { RoutinePaper, RoutineRule } from '@/components/routines/RoutinePaper'
import { getExerciseDisplayNameById } from '@/features/exercises/catalog'
import { useDerivedPrimaryFocus, useDerivedRoutineFocus } from '@/features/exercises/muscles'
import {
  type DraftRoutineExercise,
  useRoutineDraftStore,
} from '@/features/exercises/routine-draft-store'
import { useRoutinesStore } from '@/features/routines/routines-store'

function getExerciseKey(exercise: DraftRoutineExercise) {
  return exercise.id
}

export default function NewRoutineScreen() {
  const router = useRouter()
  const scrollRef = useAnimatedRef<ScrollView>()
  const { routineId } = useLocalSearchParams<{
    routineId?: string
  }>()
  const { editingId, exercises, name, moveExercise, removeExercise, reset, setName, loadForEdit } =
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

  const renderExercise = useCallback<SortableGridRenderItem<DraftRoutineExercise>>(
    ({ item: exercise, index }) => (
      <View className='w-full flex-row items-stretch bg-surface-card'>
        <View className='min-w-0 flex-1 flex-row items-center'>
          <Sortable.Handle
            style={{
              width: 32,
              alignSelf: 'stretch',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <View
              accessible
              accessibilityRole='adjustable'
              accessibilityLabel={`Reordenar ${exercise.name}`}
              accessibilityHint='Mantén pulsado y arrastra para cambiar el orden'
              accessibilityValue={{
                text: `${index + 1} de ${exercises.length}`,
              }}
              accessibilityActions={[
                {
                  name: 'increment',
                  label: 'Mover hacia abajo',
                },
                {
                  name: 'decrement',
                  label: 'Mover hacia arriba',
                },
              ]}
              onAccessibilityAction={(event) => {
                if (event.nativeEvent.actionName === 'increment') {
                  moveExercise(index, index + 1)
                } else if (event.nativeEvent.actionName === 'decrement') {
                  moveExercise(index, index - 1)
                }
              }}
              className='w-8 items-center justify-center py-3'
            >
              <Feather name='menu' size={15} color={Colors.ink.muted} />
            </View>
          </Sortable.Handle>
          <TouchableOpacity
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
            className='min-w-0 flex-1 justify-center py-3 pr-2'
          >
            <Text className='font-geist-mono text-sm uppercase text-surface-dark'>
              {getExerciseDisplayNameById(exercise.catalogExerciseId, exercise.name)}
            </Text>
          </TouchableOpacity>
        </View>
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
        <View className='w-8 items-center justify-center border-l border-surface-dark'>
          <TouchableOpacity
            onPress={() => removeExercise(exercise.id)}
            className='h-8 w-8 items-center justify-center'
          >
            <Feather name='x' size={12} color={Colors.ink.soft} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [
      exercises.length,
      moveExercise,
      removeExercise,
      router,
    ],
  )
  const handleDragEnd = useCallback(
    ({ fromIndex, toIndex }: SortableGridDragEndParams<DraftRoutineExercise>) =>
      moveExercise(fromIndex, toIndex),
    [
      moveExercise,
    ],
  )

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
          <Animated.ScrollView
            ref={scrollRef}
            style={{
              flex: 1,
            }}
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
            <View className='min-w-0 self-stretch border border-surface-dark'>
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
              {exercises.length > 0 ? (
                <View className='bg-border-warm'>
                  <Sortable.Grid
                    columns={1}
                    data={exercises}
                    keyExtractor={getExerciseKey}
                    renderItem={renderExercise}
                    rowGap={1}
                    customHandle
                    sortEnabled={exercises.length > 1}
                    dragActivationDelay={160}
                    activeItemScale={1.025}
                    inactiveItemOpacity={1}
                    itemEntering={null}
                    itemExiting={null}
                    itemsLayoutTransitionMode='reorder'
                    overDrag='vertical'
                    scrollableRef={scrollRef}
                    onDragEnd={handleDragEnd}
                  />
                </View>
              ) : null}
              <TouchableOpacity
                onPress={() => router.push('/routine/exercises')}
                className={`flex-row items-center px-3 py-3 ${exercises.length ? 'border-t border-surface-dark' : ''}`}
              >
                <Feather name='plus' size={15} color={Colors.surface.dark} />
                <Text className='ml-2 font-geist-mono-medium text-xs uppercase text-surface-dark'>
                  Añadir ejercicio
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.ScrollView>
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
