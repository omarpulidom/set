import { Feather } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { WeekStrip } from '@/components/gym/GymUI'
import { mockRoutines } from '@/features/gym/mock-data'
import { useTicketMockStore } from '@/features/tickets/mock-store'

function formatDuration(minutes: number) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')} hrs`
}

const months = [
  { name: 'AGO', completedDays: [1, 2, 5, 8, 11, 14, 18, 22, 25, 29] },
  { name: 'JUL', completedDays: [3, 6, 7, 10, 15, 19, 23, 26, 30] },
  { name: 'JUN', completedDays: [2, 4, 9, 13, 16, 20, 24, 27] },
  { name: 'MAY', completedDays: [1, 5, 8, 12, 17, 21, 25, 28] },
  { name: 'ABR', completedDays: [3, 6, 10, 14, 18, 23, 26] },
  { name: 'MAR', completedDays: [2, 7, 11, 15, 20, 24, 29] },
]

function MonthlyTrainingGrid() {
  return (
    <View className='mt-4 flex-row gap-3'>
      {[0, 1, 2].map((column) => (
        <View key={column} className='flex-1 gap-3'>
          {months.filter((_, index) => index % 3 === column).map((month) => (
            <View key={month.name} className='aspect-square rounded-3xl bg-surface-muted p-3'>
              <View className='flex-row items-center justify-between px-1 pt-1'>
                <Text className='font-geist-mono text-xs tracking-[1px] text-ink-muted'>{month.name}</Text>
                <Text className='font-geist-mono text-[10px] text-ink-muted'>2026</Text>
              </View>
              <View className='mt-auto gap-1'>
                {Array.from({ length: 5 }, (_, week) => (
                  <View key={week} className='flex-row gap-1'>
                    {Array.from({ length: 7 }, (_, day) => {
                      const date = week * 7 + day + 1
                      const exists = date <= 31
                      return (
                        <View
                          key={date}
                          className={`aspect-square flex-1 rounded-sm ${
                            !exists ? 'bg-transparent' : month.completedDays.includes(date) ? 'bg-surface-dark' : 'bg-surface-card'
                          }`}
                        />
                      )
                    })}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export default function TicketsTab() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'month'>('grid')
  const routineSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['45%'], [])
  const { tickets, todayCompleted } = useTicketMockStore()
  const privateTickets = tickets.filter((ticket) => ticket.visibility === 'private')

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className='flex-row items-center justify-between'>
          <View>
            <Text className='font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>Tickets</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/circles')} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'>
            <Feather name='menu' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>

        <View className='mt-7'>
          <WeekStrip
            todayCompleted={todayCompleted}
            onCurrentDayPress={() => routineSheetRef.current?.present()}
          />
        </View>

        <View className='mt-9 flex-row items-baseline justify-between'>
          <Text className='font-geist-mono-medium text-xs tracking-[1.5px] text-ink-muted'>ENTRENAMIENTOS</Text>
          <View className='flex-row rounded-full bg-surface-muted p-1'>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              className={`h-8 w-8 items-center justify-center rounded-full ${viewMode === 'grid' ? 'bg-surface-dark' : ''}`}
            >
              <Feather name='grid' size={15} color={viewMode === 'grid' ? Colors.surface.card : Colors.ink.soft} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('month')}
              className={`h-8 w-8 items-center justify-center rounded-full ${viewMode === 'month' ? 'bg-surface-dark' : ''}`}
            >
              <Feather name='calendar' size={15} color={viewMode === 'month' ? Colors.surface.card : Colors.ink.soft} />
            </TouchableOpacity>
          </View>
        </View>
        {viewMode === 'grid' ? (
          <View className='mt-4 flex-row gap-3'>
            {[0, 1, 2].map((column) => (
              <View key={column} className='flex-1 gap-3'>
                {privateTickets.filter((_, index) => index % 3 === column).map((ticket) => (
                  <TouchableOpacity
                    key={ticket.id}
                    onPress={() => router.push({ pathname: '/ticket/[workoutId]', params: { workoutId: ticket.id } })}
                    className='aspect-square rounded-3xl bg-surface-muted p-3'
                  >
                    <View className='flex-row items-start justify-between'>
                      <Text className='mt-1 font-geist-mono text-[8px] text-ink-muted'>{ticket.completedAt}</Text>
                      <Feather name='arrow-up-right' size={12} color={Colors.surface.dark} />
                    </View>
                    <View className='mt-auto'>
                      <Text className='font-geist-mono-semibold text-base tracking-[-1px] text-surface-dark'>{ticket.routineName.toUpperCase()}</Text>
                      <Text className='mt-1 font-geist-mono text-[10px] text-ink-muted'>{formatDuration(ticket.durationMinutes)}</Text>
                      <Text className='mt-0.5 font-geist-mono text-[10px] text-ink-muted'>{ticket.volumeKg.toLocaleString('es-MX')} kg</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <MonthlyTrainingGrid />
        )}
      </ScrollView>
      <BottomSheetModal
        ref={routineSheetRef}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: Colors.surface.card }}
        handleIndicatorStyle={{ backgroundColor: Colors.ink.soft }}
      >
        <BottomSheetView className='flex-1 px-5'>
          <Text className='font-geist-mono-semibold text-2xl uppercase text-surface-dark'>Elige una rutina</Text>
          <View className='mt-5'>
            {mockRoutines.map((routine) => (
              <TouchableOpacity
                key={routine.id}
                onPress={() => {
                  routineSheetRef.current?.dismiss()
                  router.push({ pathname: '/workout/[routineId]', params: { routineId: routine.id } })
                }}
                className='flex-row items-center justify-between border-t border-border-soft py-5'
              >
                <View><Text className='font-geist-mono-semibold text-base text-surface-dark'>{routine.name}</Text><Text className='mt-1 font-geist-mono text-xs text-ink-muted'>{routine.exercises.length} ejercicios</Text></View>
                <Feather name='arrow-up-right' size={17} color={Colors.surface.dark} />
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
