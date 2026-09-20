import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { TicketFrame } from '@/components/tickets/TicketFrame'
import type { WorkoutTicket } from '@/features/gym/types'
import { useTicketsStore } from '@/features/tickets/tickets-store'

export default function SocialTab() {
  const router = useRouter()
  const { react, tickets } = useTicketsStore()
  const socialTickets = tickets.filter((ticket) => ticket.visibility === 'social')

  function shareTicket(ticket: WorkoutTicket) {
    void Share.share({
      message: `Set · ${ticket.routineName} · ${ticket.durationMinutes} min`,
    })
  }

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
          <View>
            <Text className='font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
              Amigos
            </Text>
            <Text className='mt-2 font-geist-mono text-xs uppercase tracking-tight text-ink-muted'>
              Tickets de tus círculos
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/circles')}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='users' size={18} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>

        <View className='mt-9 gap-4'>
          {socialTickets.length === 0 ? (
            <View className='items-center rounded-3xl border border-dashed border-border-dashed bg-surface-muted px-6 py-10'>
              <Feather name='users' size={26} color={Colors.ink.soft} />
              <Text className='mt-4 text-center font-geist-mono-semibold text-sm text-surface-dark'>
                Sin tickets sociales
              </Text>
              <Text className='mt-2 text-center font-geist-mono text-xs text-ink-muted'>
                Crea un círculo y termina un entrenamiento para compartir tu primer ticket grupal.
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/circles')}
                className='mt-5 flex-row items-center rounded-3xl bg-surface-dark px-5 py-3'
              >
                <Feather name='users' size={14} color={Colors.surface.card} />
                <Text className='ml-2 font-geist-mono-semibold text-xs uppercase text-surface-card'>
                  Ver círculos
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            socialTickets.map((ticket) => (
              <TicketFrame
                key={ticket.id}
                ticket={ticket}
                onPress={() =>
                  router.push({
                    pathname: '/ticket/[workoutId]',
                    params: {
                      workoutId: ticket.id,
                    },
                  })
                }
                onShare={() => shareTicket(ticket)}
                onReact={(reaction) => react(ticket.id, reaction)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
