import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useDerivedRoutineFocus } from '@/features/exercises/muscles'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'
import { mockRoutines } from '@/features/gym/mock-data'
import { formatMuscles } from '@/lib/funcs'

export default function NewRoutineScreen() {
  const router = useRouter()
  const { exercises, name, removeExercise, reset, setName } = useRoutineDraftStore()
  const derivedFocus = useDerivedRoutineFocus()
  const canSave = Boolean(name.trim() && exercises.length)

  function saveRoutine() {
    if (!canSave) return
    mockRoutines.unshift({
      id: `routine-${Date.now()}`,
      name: name.trim(),
      description: derivedFocus || 'Rutina personalizada',
      accent: Colors.mono.DEFAULT,
      exercises: exercises.map((exercise) => ({
        id: exercise.id,
        catalogExerciseId: exercise.catalogExerciseId,
        name: exercise.name,
        targetSets: exercise.targetSets || 1,
        targetReps: exercise.targetReps || 1,
      })),
    })
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
          <TouchableOpacity
            disabled={!canSave}
            onPress={saveRoutine}
            className={`h-10 items-center justify-center rounded-full px-4 ${canSave ? 'bg-surface-dark' : 'bg-surface-soft'}`}
          >
            <Text
              className={`font-geist-mono-semibold text-xs ${canSave ? 'text-surface-card' : 'text-ink-muted'}`}
            >
              Guardar
            </Text>
          </TouchableOpacity>
        </View>

        <Text className='mt-8 font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
          NUEVA RUTINA
        </Text>

        <View className='mt-8'>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder='Nombre de rutina'
            placeholderTextColor={Colors.ink.soft}
            className='rounded-3xl bg-surface-muted px-5 py-4 font-geist-mono text-base text-surface-dark'
          />

          <View className='mt-3'>
            {derivedFocus ? (
              <Text className='font-geist-mono text-xs text-ink-muted'>
                {formatMuscles(derivedFocus)}
              </Text>
            ) : (
              <Text className='font-geist-mono text-xs text-ink-soft'>
                Agrega ejercicios para ver los músculos trabajados
              </Text>
            )}
          </View>
        </View>

        <View className='mt-9 flex-row items-center justify-between'>
          <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Ejercicios
          </Text>
          <Text className='font-geist-mono text-xs text-ink-muted'>{exercises.length}</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/routine/exercises')}
          className='mt-4 flex-row items-center justify-between rounded-3xl bg-surface-muted px-5 py-4'
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
              className='rounded-3xl bg-surface-muted p-4'
            >
              <View className='flex-row items-center justify-between'>
                <Text className='flex-1 font-geist-mono-semibold text-sm text-surface-dark'>
                  {exercise.name}
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
