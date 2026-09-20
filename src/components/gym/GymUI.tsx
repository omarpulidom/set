import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { currentWeekDays, dayKey } from '@/lib/funcs/date'

export function GymScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <SafeAreaView
      className='flex-1 bg-surface'
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <View className='px-5 pb-4 pt-5'>
        <View>
          <Text className='font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
            {title}
          </Text>
        </View>
      </View>
      {children}
    </SafeAreaView>
  )
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <View className='rounded-full bg-ink px-3 py-1.5'>
      <Text className='font-geist-mono text-xs text-surface-card'>{children}</Text>
    </View>
  )
}

export function GraphPaperCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <View className={`rounded-3xl border border-border bg-surface-card ${className}`}>
      {children}
    </View>
  )
}

export function WeekStrip({
  completedDays = new Set<string>(),
  onCurrentDayPress,
}: {
  completedDays?: Set<string>
  onCurrentDayPress?: () => void
}) {
  const todayKey = dayKey(new Date())
  const labels = [
    'L',
    'M',
    'M',
    'J',
    'V',
    'S',
    'D',
  ]
  const days = currentWeekDays()

  return (
    <View className='flex-row justify-between'>
      {days.map((date, index) => {
        const key = dayKey(date)
        const completed = completedDays.has(key)
        const isToday = key === todayKey
        const isFuture = key > todayKey
        if (isToday) {
          return (
            <View key={key} className='items-center'>
              <Text className='mb-2 font-geist-mono text-[10px] text-ink-quiet'>
                {labels[index]}
              </Text>
              <TouchableOpacity
                disabled={completed || !onCurrentDayPress}
                onPress={onCurrentDayPress}
                activeOpacity={0.78}
                className='h-12 w-12 items-center justify-center rounded-full bg-surface-dark'
              >
                <Feather
                  name={completed ? 'check' : 'plus'}
                  size={completed ? 18 : 20}
                  color={Colors.surface.card}
                />
              </TouchableOpacity>
            </View>
          )
        }
        return (
          <View key={key} className='items-center'>
            <Text className='mb-2 font-geist-mono text-[10px] text-ink-quiet'>{labels[index]}</Text>
            <View
              className={`h-12 w-12 items-center justify-center rounded-full border ${
                completed
                  ? 'border-ink bg-surface-dark'
                  : isFuture
                    ? 'border-border-soft bg-surface-muted'
                    : 'border-border-warm bg-surface-card'
              }`}
            >
              <Text
                className={
                  completed
                    ? 'font-geist-mono-semibold text-sm text-surface-card'
                    : `font-geist-mono text-sm ${isFuture ? 'text-ink-quiet' : 'text-ink-strong'}`
                }
              >
                {date.getDate()}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export function PrimaryButton({
  label,
  onPress,
  icon = 'arrow-right',
}: {
  label: string
  onPress: () => void
  icon?: keyof typeof Feather.glyphMap
}) {
  return (
    <TouchableOpacity
      className='h-14 flex-row items-center justify-center rounded-2xl border border-ink bg-ink px-5'
      onPress={onPress}
      activeOpacity={0.82}
    >
      <Text className='mr-2 font-geist-mono text-sm text-surface-card'>{label}</Text>
      <Feather name={icon} size={17} color={Colors.surface.card} />
    </TouchableOpacity>
  )
}
