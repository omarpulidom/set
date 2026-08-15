import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Share, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { TicketFrame } from '@/components/tickets/TicketFrame'
import { useTicketMockStore } from '@/features/tickets/mock-store'

export default function CircleDetailScreen() {
  const router = useRouter()
  const { circleId } = useLocalSearchParams<{ circleId: string }>()
  const { addMember, circles, deleteCircle, react, removeMember, renameCircle, tickets } = useTicketMockStore()
  const circle = circles.find((item) => item.id === circleId)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(circle?.name ?? '')
  const [member, setMember] = useState('')
  useEffect(() => setName(circle?.name ?? ''), [circle?.name])
  if (!circle) return null
  const circleTickets = tickets.filter((ticket) => ticket.visibility === 'social' && ticket.circles.includes(circle.name))
  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity onPress={() => router.back()} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'><Feather name='arrow-left' size={19} color={Colors.surface.dark} /></TouchableOpacity>
          <TouchableOpacity onPress={() => setEditing((value) => !value)} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'><Feather name='edit-3' size={17} color={Colors.surface.dark} /></TouchableOpacity>
        </View>
        {editing ? <View className='mt-7 flex-row'><TextInput value={name} onChangeText={setName} className='flex-1 rounded-3xl bg-surface-muted px-4 py-4 font-geist-mono text-base text-surface-dark' /><TouchableOpacity onPress={() => { renameCircle(circle.id, name); setEditing(false) }} className='ml-2 items-center justify-center rounded-3xl bg-surface-dark px-4'><Feather name='check' size={18} color={Colors.surface.card} /></TouchableOpacity></View> : <Text className='mt-7 font-geist-mono-semibold text-3xl tracking-[-1px] text-surface-dark'>{circle.name}</Text>}
        <View className='mt-4 flex-row items-center'>
          <View className='flex-row'>
            {circle.members.slice(0, 4).map((person, index) => <View key={person} className={`${index ? '-ml-3' : ''} h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-surface-dark`}><Text className='font-geist-mono text-[10px] text-surface-card'>{person[0]}</Text></View>)}
          </View>
          <Text className='ml-3 font-geist-mono text-xs text-ink-muted'>{circle.memberCount} miembros</Text>
        </View>
        <View className='mt-8 gap-2'>{circle.members.map((person) => <View key={person} className='flex-row items-center rounded-3xl bg-surface-muted px-5 py-4'><View className='h-8 w-8 items-center justify-center rounded-full bg-surface-soft'><Text className='font-geist-mono text-xs text-surface-dark'>{person[0]}</Text></View><Text className='ml-3 flex-1 font-geist-mono text-sm text-surface-dark'>{person}</Text><TouchableOpacity onPress={() => removeMember(circle.id, person)}><Feather name='x' size={17} color={Colors.ink.soft} /></TouchableOpacity></View>)}</View>
        <View className='mt-5 flex-row'><TextInput value={member} onChangeText={setMember} placeholder='Agregar persona' placeholderTextColor={Colors.ink.soft} className='flex-1 rounded-3xl bg-surface-muted px-4 py-4 font-geist-mono text-sm text-surface-dark' /><TouchableOpacity onPress={() => { addMember(circle.id, member); setMember('') }} className='ml-2 items-center justify-center rounded-3xl bg-surface-dark px-4'><Feather name='user-plus' size={17} color={Colors.surface.card} /></TouchableOpacity></View>
        <TouchableOpacity onPress={() => { deleteCircle(circle.id); router.replace('/circles') }} className='mt-8 flex-row items-center self-start'><Feather name='trash-2' size={15} color={Colors.ink.soft} /><Text className='ml-2 font-geist-mono text-xs text-ink-soft'>Eliminar círculo</Text></TouchableOpacity>
        <View className='mt-10 border-t border-border-soft pt-7'>
          <Text className='font-geist-mono-semibold text-xl uppercase text-surface-dark'>Tickets de {circle.name}</Text>
          <View className='mt-5 gap-4'>
            {circleTickets.length ? circleTickets.map((ticket) => <TicketFrame key={ticket.id} ticket={ticket} onReact={(reaction) => react(ticket.id, reaction)} onShare={() => { void Share.share({ message: `Set · ${ticket.routineName} · ${ticket.durationMinutes} min` }) }} />            ) : <View className='rounded-3xl bg-surface-muted p-5'><Text className='font-geist-mono text-sm uppercase tracking-tight text-ink-muted'>Aún no hay tickets en este círculo.</Text></View>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
