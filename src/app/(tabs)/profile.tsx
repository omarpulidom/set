import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'
import { useProfileStore } from '@/features/profile/profile-store'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { clearPersistedTicketPhotos } from '@/features/tickets/ticket-photo-storage'
import { useTicketsStore } from '@/features/tickets/tickets-store'
import { clearAllPersistedData } from '@/lib/mmkv'
import { queryClient } from '@/lib/qc'
import { useGlobalStore } from '@/store'

export default function ProfileTab() {
  const username = useProfileStore((state) => state.username)
  const setUsername = useProfileStore((state) => state.setUsername)
  const [draftUsername, setDraftUsername] = useState(username)
  const normalizedUsername = draftUsername.trim()
  const hasChanges = normalizedUsername.length > 0 && normalizedUsername !== username

  function saveUsername() {
    if (!normalizedUsername) return
    setUsername(normalizedUsername)
    Alert.alert('Perfil actualizado', 'El nuevo nombre se usará en tus próximos tickets.')
  }

  function clearLocalData() {
    Alert.alert(
      '¿Borrar todos los datos locales?',
      'Se eliminarán la sesión, el perfil, las rutinas, los tickets, las fotos y la caché de la app.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: () => {
            clearAllPersistedData()
            clearPersistedTicketPhotos()
            queryClient.clear()
            useRoutineDraftStore.getState().reset()
            useRoutinesStore.setState({
              routines: [],
            })
            useTicketsStore.setState({
              circles: [],
              tickets: [],
            })
            useProfileStore.getState().resetProfile()
            useGlobalStore.getState().auth.logOut()
          },
        },
      ],
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
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps='handled'
      >
        <Text className='font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
          Perfil
        </Text>
        <View className='mt-10'>
          <Text className='font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-subtle'>
            Username
          </Text>
          <TextInput
            value={draftUsername}
            onChangeText={setDraftUsername}
            placeholder='tu_username'
            placeholderTextColor={Colors.ink.soft}
            autoCapitalize='none'
            autoCorrect={false}
            maxLength={32}
            className='mt-3 border-b border-border-soft py-3 font-geist-mono text-lg text-surface-dark'
          />
          <Text className='mt-2 font-geist-mono text-[10px] leading-4 text-ink-muted'>
            Se usará en tus próximos tickets.
          </Text>
          <TouchableOpacity
            onPress={saveUsername}
            disabled={!hasChanges}
            className={`mt-5 flex-row items-center self-start rounded-full px-4 py-3 ${hasChanges ? 'bg-surface-dark' : 'bg-surface-soft'}`}
          >
            <Text
              className={`font-geist-mono-semibold text-sm ${hasChanges ? 'text-surface-card' : 'text-ink-soft'}`}
            >
              GUARDAR NOMBRE
            </Text>
            <Feather
              name='check'
              size={17}
              color={hasChanges ? Colors.surface.card : Colors.ink.soft}
            />
          </TouchableOpacity>
        </View>

        <View className='mt-14 border-t border-border-soft pt-6'>
          <Text className='font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-subtle'>
            Desarrollo
          </Text>
          <TouchableOpacity
            onPress={clearLocalData}
            className='mt-4 flex-row items-center self-start'
            accessibilityRole='button'
            accessibilityLabel='Borrar todos los datos locales'
          >
            <Feather name='trash-2' size={14} color={Colors.ink.soft} />
            <Text className='ml-2 font-geist-mono text-xs text-ink-muted'>
              Borrar datos locales
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
