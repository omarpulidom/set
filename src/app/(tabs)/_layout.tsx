import { Redirect, Tabs } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { CustomTabBar } from '@/components/Elements/CustomTabBar'
import { useAuth } from '@/components/Providers/AuthProvider'

export default function TabsLayout() {
  const { user } = useAuth()

  if (!user) {
    return <Redirect href='/(auth)/login' />
  }

  return (
    <>
      <StatusBar hidden />
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
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
          }}
        />
        <Tabs.Screen name='training' options={{ href: null }} />
        <Tabs.Screen name='stats' options={{ href: null }} />
        <Tabs.Screen name='account' options={{ href: null }} />
        <Tabs.Screen
          name='profile'
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  )
}
