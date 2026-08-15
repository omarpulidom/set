import { Feather } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'

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
  activeIndex = 4,
  todayCompleted = false,
  onCurrentDayPress,
}: {
  activeIndex?: number
  todayCompleted?: boolean
  onCurrentDayPress?: () => void
}) {
  const days = [
    [
      'L',
      '18',
    ],
    [
      'M',
      '19',
    ],
    [
      'M',
      '20',
    ],
    [
      'M',
      '21',
    ],
    [
      'V',
      '22',
    ],
    [
      'S',
      '23',
    ],
    [
      'D',
      '24',
    ],
  ]

  return (
    <View className='flex-row justify-between'>
      {days.map(([day, date], index) => {
        const completed = index === 0 || index === 2
        const active = index === activeIndex
        if (active) {
          return (
            <View key={date} className='items-center'>
              <Text className='mb-2 font-geist-mono text-[10px] text-ink-quiet'>{day}</Text>
              <TouchableOpacity
                disabled={todayCompleted}
                onPress={onCurrentDayPress}
                activeOpacity={0.78}
                className='h-12 w-12 items-center justify-center rounded-full bg-surface-dark'
              >
                <Feather
                  name={todayCompleted ? 'check' : 'plus'}
                  size={todayCompleted ? 18 : 20}
                  color={Colors.surface.card}
                />
              </TouchableOpacity>
            </View>
          )
        }
        return (
          <View key={date} className='items-center'>
            <Text className='mb-2 font-geist-mono text-[10px] text-ink-quiet'>{day}</Text>
            <View
              className={`h-12 w-12 items-center justify-center rounded-full border ${
                completed ? 'border-ink bg-surface-dark' : 'border-border-warm bg-surface-card'
              }`}
            >
              <Text
                className={
                  completed
                    ? 'font-geist-mono-semibold text-sm text-surface-card'
                    : 'font-geist-mono text-sm text-ink-strong'
                }
              >
                {date}
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
