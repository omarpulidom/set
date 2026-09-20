import { Feather } from '@expo/vector-icons'
import type { BottomTabBarProps } from 'expo-router/js-tabs'
import { Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '@/components/colors'
import { featureFlags } from '@/lib/feature-flags'

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const tabs = {
    index: {
      label: 'Tickets',
      icon: 'credit-card',
    },
    routines: {
      label: 'Plan',
      icon: 'list',
    },
    social: {
      label: 'Amigos',
      icon: 'users',
    },
  } as const

  return (
    <>
      {/* TabBar */}
      <View className='border-t border-border bg-surface-canvas px-5 pb-6 pt-3'>
        <View className='flex-row items-center justify-center gap-2'>
          {state.routes.map((route, index) => {
            const tab = tabs[route.name as keyof typeof tabs]
            if (!tab || (!featureFlags.circles && route.name === 'social')) return null
            const isFocused = state.index === index

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              })

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name)
              }
            }

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                className={`min-w-[57px] flex-col items-center gap-1 rounded-2xl px-2 py-3 ${
                  isFocused ? 'bg-ink' : ''
                }`}
              >
                <Feather
                  name={tab.icon}
                  size={24}
                  color={isFocused ? Colors.surface.card : Colors.ink.soft}
                />
                <Text
                  className={`font-geist-mono text-[10px] ${isFocused ? 'text-surface-card' : 'text-ink-soft'}`}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </>
  )
}
