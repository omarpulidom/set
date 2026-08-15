import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { TicketFrame } from '@/components/tickets/TicketFrame'
import { useTicketMockStore } from '@/features/tickets/mock-store'

export default function TicketDetailScreen() {
  const router = useRouter()
  const { workoutId } = useLocalSearchParams<{
    workoutId?: string
  }>()
  const { react, tickets } = useTicketMockStore()
  const ticket = tickets.find((item) => item.id === workoutId)
  if (!ticket) return null
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
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              void Share.share({
                message: `Set · ${ticket.routineName} · ${ticket.durationMinutes} min`,
              })
            }}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='share' size={17} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>
        <Text className='mt-7 font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
          {ticket.routineName}
        </Text>
        <TicketFrame ticket={ticket} onReact={(reaction) => react(ticket.id, reaction)} />
        <View className='mt-6 rounded-3xl bg-surface-muted p-5'>
          <View className='flex-row border-t border-border-soft pt-4'>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[10px] text-ink-muted'>DURACIÓN</Text>
              <Text className='mt-1 font-geist-mono-semibold text-sm text-surface-dark'>
                {ticket.durationMinutes} min
              </Text>
            </View>
            <View className='flex-1 border-l border-border-soft pl-4'>
              <Text className='font-geist-mono text-[10px] text-ink-muted'>FIRMA</Text>
              <Text className='mt-1 font-geist-mono-semibold text-sm text-surface-dark'>
                {ticket.signedByAuthor ? 'Confirmada' : 'Pendiente'}
              </Text>
            </View>
          </View>
          <Text className='mt-5 font-geist-mono text-xs leading-5 text-ink-muted'>
            Aquí irá el diseño final del ticket, sus datos de series, peso, foto y composición
            visual.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
