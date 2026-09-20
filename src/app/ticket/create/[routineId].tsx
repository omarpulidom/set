import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useAuth } from '@/components/Providers/AuthProvider'
import {
  HalftoneDiamondCamera,
  type HalftoneDiamondCameraRef,
} from '@/components/Skia/HalftoneDiamondCamera'
import type { WorkoutSet } from '@/features/gym/types'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { useTicketsStore } from '@/features/tickets/tickets-store'

export default function CreateTicketScreen() {
  const router = useRouter()
  const {
    routineId,
    elapsedSeconds,
    sets: serializedSets,
  } = useLocalSearchParams<{
    routineId?: string
    elapsedSeconds?: string
    sets?: string
  }>()
  const routine = useRoutinesStore((state) => state.routines.find((item) => item.id === routineId))
  const { user } = useAuth()
  const cameraRef = useRef<HalftoneDiamondCameraRef>(null)
  const [photo, setPhoto] = useState<string>()
  const [cameraSize, setCameraSize] = useState(0)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [signed, setSigned] = useState(false)
  const publishWorkout = useTicketsStore((state) => state.publishWorkout)

  function takePhoto() {
    if (capturing) return
    setCapturing(true)
    try {
      const capturedPhoto = cameraRef.current?.takePhoto()
      if (!capturedPhoto) {
        Alert.alert('La cámara aún no está lista', 'Espera un momento e intenta de nuevo.')
        return
      }
      setPhoto(capturedPhoto)
    } catch {
      Alert.alert('No se pudo tomar la foto', 'Revisa el permiso de cámara e intenta de nuevo.')
    } finally {
      setCapturing(false)
    }
  }

  function handlePhotoPress() {
    if (photo) {
      setPhoto(undefined)
      setCameraOpen(true)
      return
    }
    if (!cameraOpen) {
      setCameraOpen(true)
      return
    }
    takePhoto()
  }

  function finish() {
    if (!photo || !signed || !routine) return
    let sets: Record<string, WorkoutSet[]> = {}
    try {
      sets = JSON.parse(serializedSets ?? '{}') as Record<string, WorkoutSet[]>
    } catch {
      Alert.alert('No se pudo crear el ticket', 'Los datos del entrenamiento están dañados.')
      return
    }
    const authorName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Tú'
    const ticketId = publishWorkout(routine, Number(elapsedSeconds) || 1, sets, photo, authorName)
    router.replace({
      pathname: '/ticket/[workoutId]',
      params: {
        workoutId: ticketId,
      },
    })
  }

  if (!routine) {
    return (
      <SafeAreaView
        className='flex-1 bg-surface'
        edges={[
          'top',
          'left',
          'right',
        ]}
      >
        <View className='flex-row items-center justify-between p-5'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>
        <View className='flex-1 items-center justify-center px-8'>
          <Text className='text-center font-geist-mono text-sm text-ink-muted'>
            Esta rutina ya no existe.
          </Text>
        </View>
      </SafeAreaView>
    )
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
        <TouchableOpacity
          onPress={() => router.back()}
          className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
        >
          <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
        </TouchableOpacity>
        <Text className='mt-7 font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
          Cerrar ticket
        </Text>
        <Text className='mt-2 font-geist-mono text-sm uppercase leading-5 tracking-tight text-ink-muted'>
          La foto y tu firma son obligatorias para publicar el ticket grupal.
        </Text>

        <TouchableOpacity
          onPress={handlePhotoPress}
          disabled={capturing}
          onLayout={(event) => setCameraSize(event.nativeEvent.layout.width)}
          className={`mt-7 h-56 items-center justify-center overflow-hidden rounded-3xl border border-dashed ${photo ? 'border-ink bg-surface-soft' : 'border-border-dashed bg-surface-muted'}`}
        >
          {cameraOpen && !photo && cameraSize > 0 ? (
            <View className='absolute inset-0'>
              <HalftoneDiamondCamera ref={cameraRef} width={cameraSize} height={224} isActive />
            </View>
          ) : null}
          <Feather name={photo ? 'check' : 'camera'} size={28} color={Colors.surface.dark} />
          <Text className='mt-3 font-geist-mono-semibold text-sm text-surface-dark'>
            {photo
              ? 'Foto guardada'
              : cameraOpen
                ? capturing
                  ? 'Guardando foto…'
                  : 'Toca para capturar'
                : 'Agregar foto'}
          </Text>
          <Text className='mt-1 font-geist-mono text-xs text-ink-muted'>
            obligatoria para el ticket social
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSigned(true)}
          className={`mt-4 rounded-3xl p-5 ${signed ? 'bg-surface-dark' : 'bg-surface-muted'}`}
        >
          <View className='flex-row items-center justify-between'>
            <View>
              <Text
                className={`font-geist-mono-semibold text-base uppercase ${signed ? 'text-surface-card' : 'text-surface-dark'}`}
              >
                Firma de autor
              </Text>
              <Text
                className={`mt-1 font-geist-mono text-xs ${signed ? 'text-ink-light' : 'text-ink-muted'}`}
              >
                {signed ? 'Ticket firmado' : 'Toca para firmar el ticket'}
              </Text>
            </View>
            <Feather
              name='edit-3'
              size={18}
              color={signed ? Colors.surface.card : Colors.surface.dark}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={!photo || !signed}
          onPress={finish}
          className={`mt-7 flex-row items-center justify-between rounded-3xl px-5 py-5 ${photo && signed ? 'bg-surface-dark' : 'bg-surface-soft'}`}
        >
          <Text
            className={`font-geist-mono-semibold text-sm ${photo && signed ? 'text-surface-card' : 'text-ink-soft'}`}
          >
            CREAR TICKETS
          </Text>
          <Feather
            name='arrow-up-right'
            size={18}
            color={photo && signed ? Colors.surface.card : Colors.ink.soft}
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
