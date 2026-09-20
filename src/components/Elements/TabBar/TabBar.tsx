import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { Text, TouchableOpacity, View } from 'react-native'
import { featureFlags } from '@/lib/feature-flags'

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const labels: Record<string, string> = {
    index: 'SETS',
    routines: 'RUTINAS',
    social: 'AMIGOS',
  } as const
  const visibleRoutes = state.routes.filter(
    (route) => labels[route.name] && (featureFlags.circles || route.name !== 'social'),
  )

  return (
    <View className='border-t border-zinc-200 bg-[#f7f7f5] px-8 pb-8 pt-2'>
      <View className='flex-row justify-around'>
        {visibleRoutes.map((route) => {
          const routeIndex = state.routes.findIndex((item) => item.key === route.key)
          const focused = routeIndex === state.index
          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              className='items-center gap-1 px-7 py-2'
            >
              <Text
                className={`font-geist-mono text-base ${focused ? 'text-zinc-950' : 'text-zinc-400'}`}
              >
                {labels[route.name]}
              </Text>
              {focused ? <View className='h-1.5 w-1.5 bg-zinc-950' /> : null}
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}
