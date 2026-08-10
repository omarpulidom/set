import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { getMockRoutine } from '@/features/gym/mock-data'
import type { WorkoutSet } from '@/features/gym/types'
import { useTicketMockStore } from '@/features/tickets/mock-store'

export default function CreateTicketScreen() {
  const router = useRouter()
  const { routineId, elapsed, sets: serializedSets } = useLocalSearchParams<{ routineId?: string; elapsed?: string; sets?: string }>()
  const routine = getMockRoutine(routineId)
  const [photoReady, setPhotoReady] = useState(false)
  const [signed, setSigned] = useState(false)
  const publishWorkout = useTicketMockStore((state) => state.publishWorkout)

  function finish() {
    if (!photoReady || !signed) return
    let sets: Record<string, WorkoutSet[]> = {}
    try { sets = JSON.parse(serializedSets ?? '{}') as Record<string, WorkoutSet[]> } catch { /* mock fallback */ }
    publishWorkout(routine, Number(elapsed) || 1, sets)
    router.replace('/')
  }

  return (
    <SafeAreaView className='flex-1 bg-surface' edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <TouchableOpacity onPress={() => router.back()} className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'>
          <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
        </TouchableOpacity>
        <Text className='mt-7 font-geist-mono-semibold text-3xl tracking-[-1px] text-surface-dark'>Cerrar ticket</Text>
        <Text className='mt-2 font-geist-mono text-sm leading-5 text-ink-muted'>La foto y tu firma son obligatorias para publicar el ticket grupal.</Text>

        <TouchableOpacity onPress={() => setPhotoReady(true)} className={`mt-7 h-56 items-center justify-center rounded-3xl border border-dashed ${photoReady ? 'border-ink bg-surface-soft' : 'border-border-dashed bg-surface-muted'}`}>
          <Feather name={photoReady ? 'check' : 'camera'} size={28} color={Colors.surface.dark} />
          <Text className='mt-3 font-geist-mono-semibold text-sm text-surface-dark'>{photoReady ? 'Foto mock seleccionada' : 'Agregar foto'}</Text>
          <Text className='mt-1 font-geist-mono text-xs text-ink-muted'>obligatoria para el ticket social</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSigned(true)} className={`mt-4 rounded-3xl p-5 ${signed ? 'bg-surface-dark' : 'bg-surface-muted'}`}>
          <View className='flex-row items-center justify-between'>
            <View><Text className={`font-geist-mono-semibold text-base ${signed ? 'text-surface-card' : 'text-surface-dark'}`}>Firma de autor</Text><Text className={`mt-1 font-geist-mono text-xs ${signed ? 'text-ink-light' : 'text-ink-muted'}`}>{signed ? 'Ticket firmado' : 'Toca para firmar el ticket'}</Text></View>
            <Feather name='edit-3' size={18} color={signed ? Colors.surface.card : Colors.surface.dark} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity disabled={!photoReady || !signed} onPress={finish} className={`mt-7 flex-row items-center justify-between rounded-3xl px-5 py-5 ${photoReady && signed ? 'bg-surface-dark' : 'bg-surface-soft'}`}>
          <Text className={`font-geist-mono-semibold text-sm ${photoReady && signed ? 'text-surface-card' : 'text-ink-soft'}`}>CREAR TICKETS</Text>
          <Feather name='arrow-up-right' size={18} color={photoReady && signed ? Colors.surface.card : Colors.ink.soft} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
