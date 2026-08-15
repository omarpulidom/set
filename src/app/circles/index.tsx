import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useTicketMockStore } from '@/features/tickets/mock-store'

export default function CirclesScreen() {
  const router = useRouter()
  const circles = useTicketMockStore((state) => state.circles)
  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity onPress={() => router.back()} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'><Feather name='arrow-left' size={19} color={Colors.surface.dark} /></TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/circles/new')} className='h-10 w-10 items-center justify-center rounded-full bg-surface-dark'><Feather name='plus' size={19} color={Colors.surface.card} /></TouchableOpacity>
        </View>
        <Text className='mt-7 font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>Mis círculos</Text>
        <Text className='mt-3 font-geist-mono text-xs uppercase leading-5 tracking-tight text-ink-muted'>Al cerrar un ticket grupal, se publica automáticamente en todos estos círculos.</Text>
        <View className='mt-7 gap-3'>
          {circles.map((circle) => (
            <TouchableOpacity key={circle.id} onPress={() => router.push({ pathname: '/circles/[circleId]', params: { circleId: circle.id } })} className='flex-row items-center rounded-3xl bg-surface-muted p-5'>
              <View className='w-24 flex-row items-center'>
                {circle.members.slice(0, 3).map((member, index) => (
                  <View key={member} className={`${index ? '-ml-3' : ''} h-10 w-10 items-center justify-center rounded-full border-2 border-surface-muted bg-surface-dark`}>
                    <Text className='font-geist-mono text-xs text-surface-card'>{member[0]}</Text>
                  </View>
                ))}
              </View>
              <View className='ml-2 flex-1'><Text className='font-geist-mono-semibold text-base text-surface-dark'>{circle.name}</Text><Text className='mt-1 font-geist-mono text-xs text-ink-muted'>{circle.memberCount} miembros</Text></View>
              <Feather name='chevron-right' size={18} color={Colors.ink.soft} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
