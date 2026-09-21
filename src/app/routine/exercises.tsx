import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { memo, useCallback, useDeferredValue, useMemo, useState } from 'react'
import { FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import {
  bodyPartFilters,
  type CatalogBodyPart,
  type CatalogExercise,
  filterCatalogExercises,
  getExerciseDisplayName,
  getExerciseMetadata,
  imageForExercise,
} from '@/features/exercises/catalog'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'

const EXERCISE_ROW_HEIGHT = 92

const ExerciseRow = memo(function ExerciseRow({
  exercise,
  selected,
  onPress,
}: {
  exercise: CatalogExercise
  selected: boolean
  onPress: (exercise: CatalogExercise) => void
}) {
  return (
    <TouchableOpacity
      disabled={selected}
      activeOpacity={0.82}
      onPress={() => onPress(exercise)}
      className={`flex-row items-center rounded-3xl p-3 ${selected ? 'bg-surface-soft' : 'bg-surface-muted'}`}
    >
      <Image
        source={imageForExercise(exercise.id)}
        className='h-14 w-14 rounded-2xl bg-surface-card'
      />
      <View className='ml-4 flex-1'>
        <Text numberOfLines={1} className='font-geist-mono-semibold text-sm text-surface-dark'>
          {getExerciseDisplayName(exercise)}
        </Text>
        <Text numberOfLines={1} className='mt-1 font-geist-mono text-[10px] text-ink-muted'>
          {getExerciseMetadata(exercise.target)} · {getExerciseMetadata(exercise.equipment)}
        </Text>
      </View>
      {selected ? (
        <Feather name='check' size={17} color={Colors.ink.soft} className='mr-2' />
      ) : (
        <Feather name='plus' size={18} color={Colors.surface.dark} className='mr-2' />
      )}
    </TouchableOpacity>
  )
})

export default function ExercisePickerScreen() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CatalogBodyPart>('all')
  const exercises = useRoutineDraftStore((state) => state.exercises)
  const deferredQuery = useDeferredValue(query)
  const selectedIds = useMemo(
    () => new Set(exercises.map((exercise) => exercise.catalogExerciseId)),
    [
      exercises,
    ],
  )
  const results = useMemo(
    () => filterCatalogExercises(deferredQuery, filter),
    [
      deferredQuery,
      filter,
    ],
  )

  const openExercise = useCallback(
    (exercise: CatalogExercise) => {
      if (selectedIds.has(exercise.id)) return
      router.push({
        pathname: '/routine/exercises/[exerciseId]',
        params: {
          exerciseId: exercise.id,
        },
      })
    },
    [
      router,
      selectedIds,
    ],
  )

  const renderItem = useCallback(
    ({ item }: { item: CatalogExercise }) => (
      <ExerciseRow exercise={item} selected={selectedIds.has(item.id)} onPress={openExercise} />
    ),
    [
      openExercise,
      selectedIds,
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
      <View className='px-5 pt-5'>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
          <Text className='font-geist-mono text-xs text-ink-muted'>{results.length}</Text>
        </View>
        <Text className='mt-8 font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
          EJERCICIOS
        </Text>
        <View className='mt-6 flex-row items-center rounded-3xl bg-surface-muted px-4'>
          <Feather name='search' size={18} color={Colors.ink.soft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder='Buscar ejercicio'
            placeholderTextColor={Colors.ink.soft}
            autoCapitalize='none'
            className='ml-3 flex-1 py-4 font-geist-mono text-sm text-surface-dark'
          />
        </View>
      </View>

      <View className='mt-4'>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          {bodyPartFilters.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setFilter(item.id)}
              className={`mr-2 rounded-full px-4 py-2.5 ${filter === item.id ? 'bg-surface-dark' : 'bg-surface-muted'}`}
            >
              <Text
                className={`font-geist-mono text-xs ${filter === item.id ? 'text-surface-card' : 'text-ink-muted'}`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={results}
        keyExtractor={(exercise) => exercise.id}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: EXERCISE_ROW_HEIGHT,
          offset: EXERCISE_ROW_HEIGHT * index,
          index,
        })}
        className='mt-3'
        contentContainerStyle={{
          padding: 20,
          paddingTop: 8,
          paddingBottom: 40,
        }}
        ItemSeparatorComponent={() => <View className='h-3' />}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}
