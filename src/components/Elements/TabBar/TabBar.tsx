import { Text, TouchableOpacity, View } from 'react-native'
import { featureFlags } from '@/lib/feature-flags'

type TabBarProps = {
  state: {
    index: number
    routes: {
      key: string
      name: string
    }[]
  }
  navigation: {
    navigate: (name: string) => void
  }
}

export function TabBar({ state, navigation }: TabBarProps) {
  const labels: Record<string, string> = {
    index: 'SETS',
    routines: 'RUTINAS',
    archive: 'ARCHIVO',
    social: 'AMIGOS',
    profile: 'PERFIL',
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
              className='flex-1 items-center gap-1 py-2'
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
