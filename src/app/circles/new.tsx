import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useTicketMockStore } from '@/features/tickets/mock-store'

export default function NewCircleScreen() {
  const router = useRouter()
  const [name, setName] = useState('')
  const createCircle = useTicketMockStore((state) => state.createCircle)
  return (
    <SafeAreaView className='flex-1 bg-surface p-5' edges={['top', 'left', 'right']}>
      <TouchableOpacity onPress={() => router.back()} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'><Feather name='arrow-left' size={19} color={Colors.surface.dark} /></TouchableOpacity>
      <Text className='mt-8 font-geist-mono-semibold text-3xl tracking-[-1px] text-surface-dark'>Nuevo círculo</Text>
      <Text className='mt-2 font-geist-mono text-xs leading-5 text-ink-muted'>Las personas que agregues recibirán tus tickets grupales.</Text>
      <TextInput value={name} onChangeText={setName} placeholder='Nombre del círculo' placeholderTextColor={Colors.ink.soft} className='mt-7 rounded-3xl bg-surface-muted px-5 py-5 font-geist-mono text-base text-surface-dark' />
      <TouchableOpacity onPress={() => { createCircle(name); router.replace('/circles') }} className='mt-4 flex-row items-center justify-between rounded-3xl bg-surface-dark px-5 py-5'><Text className='font-geist-mono-semibold text-sm text-surface-card'>CREAR CÍRCULO</Text><Feather name='arrow-up-right' size={18} color={Colors.surface.card} /></TouchableOpacity>
    </SafeAreaView>
  )
}
