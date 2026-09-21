import { Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { TabBar } from '@/components/Elements/TabBar'
import { useAuth } from '@/components/Providers/AuthProvider'
import { featureFlags } from '@/lib/feature-flags'

export default function TabsLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Redirect href='/(auth)/login' />
  }

  return (
    <>
      <StatusBar hidden />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          headerShown: false,
          animation: 'shift',
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            title: 'Tickets',
          }}
        />
        <Tabs.Screen
          name='routines'
          options={{
            title: 'Plan',
          }}
        />
        <Tabs.Screen
          name='social'
          options={{
            title: 'Amigos',
            href: featureFlags.circles ? undefined : null,
          }}
        />
        <Tabs.Screen
          name='profile'
          options={{
            title: 'Perfil',
          }}
        />
      </Tabs>
    </>
  )
}
