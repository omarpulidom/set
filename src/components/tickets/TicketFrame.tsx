import { Feather } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '@/components/colors'
import type { TicketReaction, WorkoutTicket } from '@/features/gym/types'

const reactionLabels: Record<TicketReaction, string> = {
  fire: '🔥',
  clap: '👏',
  strong: '💪',
}

function formatCompletedAt(isoDate: string) {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate))
}

export function TicketFrame({
  ticket,
  onPress,
  onReact,
  onShare,
}: {
  ticket: WorkoutTicket
  onPress?: () => void
  onReact?: (reaction: TicketReaction) => void
  onShare?: () => void
}) {
  const social = ticket.visibility === 'social'
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.86 : 1}
      onPress={onPress}
      className='rounded-3xl bg-surface-muted p-5'
    >
      <View className='h-36 items-center justify-center rounded-2xl bg-surface-soft'>
        <Feather name='image' size={25} color={Colors.ink.soft} />
      </View>
      <View className='mt-4 flex-row items-start justify-between'>
        <View>
          <Text className='font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
            {ticket.routineName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onShare}
          className='h-8 w-8 items-center justify-center rounded-full bg-surface-soft'
        >
          <Feather name='share' size={14} color={Colors.surface.dark} />
        </TouchableOpacity>
      </View>
      <Text className='mt-2 font-geist-mono text-xs text-ink-subtle'>
        {formatCompletedAt(ticket.completedAt)}
      </Text>
      {social ? (
        <>
          <Text className='mt-3 font-geist-mono text-[10px] text-ink-muted'>
            {ticket.circles.join(' · ')}
          </Text>
          <View className='mt-4 flex-row border-t border-border-soft pt-3'>
            {(Object.keys(reactionLabels) as TicketReaction[]).map((reaction) => (
              <TouchableOpacity
                key={reaction}
                onPress={() => onReact?.(reaction)}
                className={`mr-2 flex-row items-center rounded-full px-2.5 py-1.5 ${ticket.myReaction === reaction ? 'bg-surface-dark' : 'bg-surface-soft'}`}
              >
                <Text className='text-xs'>{reactionLabels[reaction]}</Text>
                <Text
                  className={`ml-1 font-geist-mono text-[10px] ${ticket.myReaction === reaction ? 'text-surface-card' : 'text-ink-muted'}`}
                >
                  {ticket.reactions[reaction]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      ) : null}
    </TouchableOpacity>
  )
}
