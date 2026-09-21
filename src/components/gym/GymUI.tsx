import { Feather } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '@/components/colors'
import { currentWeekDays, dayKey } from '@/lib/funcs/date'

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

  return (
    <View className='flex-row justify-between'>
      {currentWeekDays().map((date, index) => {
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
