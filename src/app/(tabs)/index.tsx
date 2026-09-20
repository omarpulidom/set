import { Feather } from '@expo/vector-icons'
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { WeekStrip } from '@/components/gym/GymUI'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { useTicketsStore } from '@/features/tickets/tickets-store'
import { featureFlags } from '@/lib/feature-flags'
import { completedDayKeys, dayKey } from '@/lib/funcs/date'

function formatDuration(minutes: number) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')} hrs`
}

function formatCompletedAt(isoDate: string) {
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoDate))
}

function recentMonths() {
  const today = new Date()
  return Array.from(
    {
      length: 6,
    },
    (_, index) => new Date(today.getFullYear(), today.getMonth() - index, 1),
  )
}

function MonthlyTrainingGrid({ completedDays }: { completedDays: Set<string> }) {
  return (
    <View className='mt-4 flex-row gap-3'>
      {[
        0,
        1,
        2,
      ].map((column) => (
        <View key={column} className='flex-1 gap-3'>
          {recentMonths()
            .filter((_, index) => index % 3 === column)
            .map((month) => {
              const year = month.getFullYear()
              const monthIndex = month.getMonth()
              const firstDayOffset = (month.getDay() + 6) % 7
              const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
              const monthName = new Intl.DateTimeFormat('es-MX', {
                month: 'short',
              })
                .format(month)
                .replace('.', '')
                .toUpperCase()

              return (
                <View
                  key={`${year}-${monthIndex}`}
                  className='aspect-square rounded-3xl bg-surface-muted p-3'
                >
                  <View className='flex-row items-center justify-between px-1 pt-1'>
                    <Text className='font-geist-mono text-xs tracking-[1px] text-ink-muted'>
                      {monthName}
                    </Text>
                    <Text className='font-geist-mono text-[10px] text-ink-muted'>{year}</Text>
                  </View>
                  <View className='mt-auto gap-1'>
                    {Array.from(
                      {
                        length: 6,
                      },
                      (_, week) => (
                        <View key={week} className='flex-row gap-1'>
                          {Array.from(
                            {
                              length: 7,
                            },
                            (_, weekday) => {
                              const date = week * 7 + weekday - firstDayOffset + 1
                              const exists = date >= 1 && date <= daysInMonth
                              const completed =
                                exists &&
                                completedDays.has(dayKey(new Date(year, monthIndex, date)))
                              return (
                                <View
                                  key={`${week}-${weekday}`}
                                  className={`aspect-square flex-1 rounded-sm ${
                                    !exists
                                      ? 'bg-transparent'
                                      : completed
                                        ? 'bg-surface-dark'
                                        : 'bg-surface-card'
                                  }`}
                                />
                              )
                            },
                          )}
                        </View>
                      ),
                    )}
                  </View>
                </View>
              )
            })}
        </View>
      ))}
    </View>
  )
}

export default function TicketsTab() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'grid' | 'month'>('grid')
  const routineSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(
    () => [
      '45%',
    ],
    [],
  )
  const tickets = useTicketsStore((state) => state.tickets)
  const routines = useRoutinesStore((state) => state.routines)
  const completedDays = completedDayKeys(tickets)

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
        <View className='flex-row items-center justify-between'>
          <Text className='font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
            Tickets
          </Text>
          {featureFlags.circles ? (
            <TouchableOpacity
              onPress={() => router.push('/circles')}
              className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
            >
              <Feather name='menu' size={19} color={Colors.surface.dark} />
            </TouchableOpacity>
          ) : null}
        </View>

        <View className='mt-7'>
          <WeekStrip
            completedDays={completedDays}
            onCurrentDayPress={() => routineSheetRef.current?.present()}
          />
        </View>

        <View className='mt-9 flex-row items-baseline justify-between'>
          <Text className='font-geist-mono-medium text-xs tracking-[1.5px] text-ink-muted'>
            ENTRENAMIENTOS
          </Text>
          <View className='flex-row rounded-full bg-surface-muted p-1'>
            <TouchableOpacity
              onPress={() => setViewMode('grid')}
              className={`h-8 w-8 items-center justify-center rounded-full ${viewMode === 'grid' ? 'bg-surface-dark' : ''}`}
            >
              <Feather
                name='grid'
                size={15}
                color={viewMode === 'grid' ? Colors.surface.card : Colors.ink.soft}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewMode('month')}
              className={`h-8 w-8 items-center justify-center rounded-full ${viewMode === 'month' ? 'bg-surface-dark' : ''}`}
            >
              <Feather
                name='calendar'
                size={15}
                color={viewMode === 'month' ? Colors.surface.card : Colors.ink.soft}
              />
            </TouchableOpacity>
          </View>
        </View>

        {viewMode === 'grid' ? (
          tickets.length === 0 ? (
            <View className='mt-4 items-center rounded-3xl border border-dashed border-border-dashed bg-surface-muted px-6 py-10'>
              <Feather name='file-text' size={26} color={Colors.ink.soft} />
              <Text className='mt-4 text-center font-geist-mono-semibold text-sm text-surface-dark'>
                Aún no tienes tickets
              </Text>
              <Text className='mt-2 text-center font-geist-mono text-xs text-ink-muted'>
                Toca el día actual para registrar tu primer entrenamiento.
              </Text>
            </View>
          ) : (
            <View className='mt-4 flex-row gap-3'>
              {[
                0,
                1,
                2,
              ].map((column) => (
                <View key={column} className='flex-1 gap-3'>
                  {tickets
                    .filter((_, index) => index % 3 === column)
                    .map((ticket) => (
                      <TouchableOpacity
                        key={ticket.id}
                        onPress={() =>
                          router.push({
                            pathname: '/ticket/[workoutId]',
                            params: {
                              workoutId: ticket.id,
                            },
                          })
                        }
                        className='aspect-square rounded-3xl bg-surface-muted p-3'
                      >
                        <View className='flex-row items-start justify-between'>
                          <Text className='mt-1 font-geist-mono text-[8px] text-ink-muted'>
                            {formatCompletedAt(ticket.completedAt)}
                          </Text>
                          <Feather name='arrow-up-right' size={12} color={Colors.surface.dark} />
                        </View>
                        <View className='mt-auto'>
                          <Text className='font-geist-mono-semibold text-base tracking-[-1px] text-surface-dark'>
                            {ticket.routineName.toUpperCase()}
                          </Text>
                          <Text className='mt-1 font-geist-mono text-[10px] text-ink-muted'>
                            {formatDuration(ticket.durationMinutes)}
                          </Text>
                          <Text className='mt-0.5 font-geist-mono text-[10px] text-ink-muted'>
                            {ticket.volumeKg.toLocaleString('es-MX')} kg
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </View>
              ))}
            </View>
          )
        ) : (
          <MonthlyTrainingGrid completedDays={completedDays} />
        )}
      </ScrollView>

      <BottomSheetModal
        ref={routineSheetRef}
        snapPoints={snapPoints}
        backgroundStyle={{
          backgroundColor: Colors.surface.card,
        }}
        handleIndicatorStyle={{
          backgroundColor: Colors.ink.soft,
        }}
      >
        <BottomSheetView className='flex-1 px-5'>
          <Text className='font-geist-mono-semibold text-2xl uppercase text-surface-dark'>
            Elige una rutina
          </Text>
          <View className='mt-5'>
            {routines.length === 0 ? (
              <View className='items-center rounded-3xl border border-dashed border-border-dashed bg-surface-muted px-4 py-10'>
                <Feather name='clipboard' size={22} color={Colors.ink.soft} />
                <Text className='mt-3 text-center font-geist-mono-semibold text-sm text-surface-dark'>
                  Sin rutinas
                </Text>
                <Text className='mt-1 text-center font-geist-mono text-xs text-ink-muted'>
                  Crea una para empezar.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    routineSheetRef.current?.dismiss()
                    router.push('/routine/new')
                  }}
                  className='mt-5 rounded-2xl bg-surface-dark px-4 py-3'
                >
                  <Text className='font-geist-mono-semibold text-xs text-surface-card'>
                    CREAR RUTINA
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              routines.map((routine) => (
                <TouchableOpacity
                  key={routine.id}
                  onPress={() => {
                    routineSheetRef.current?.dismiss()
                    router.push({
                      pathname: '/workout/[routineId]',
                      params: {
                        routineId: routine.id,
                      },
                    })
                  }}
                  className='flex-row items-center justify-between border-t border-border-soft py-5'
                >
                  <View>
                    <Text className='font-geist-mono-semibold text-base text-surface-dark'>
                      {routine.name}
                    </Text>
                    <Text className='mt-1 font-geist-mono text-xs text-ink-muted'>
                      {routine.exercises.length} ejercicios
                    </Text>
                  </View>
                  <Feather name='arrow-up-right' size={17} color={Colors.surface.dark} />
                </TouchableOpacity>
              ))
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  )
}
