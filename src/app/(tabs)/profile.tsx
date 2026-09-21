import { Feather } from '@expo/vector-icons'
import { useState } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { useAuth } from '@/components/Providers/AuthProvider'
import { useRoutineDraftStore } from '@/features/exercises/routine-draft-store'
import { useProfileStore } from '@/features/profile/profile-store'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { clearPersistedTicketPhotos } from '@/features/tickets/ticket-photo-storage'
import { useTicketsStore } from '@/features/tickets/tickets-store'
import { clearAllPersistedData } from '@/lib/mmkv'
import { queryClient } from '@/lib/qc'
import { useGlobalStore } from '@/store'

export default function ProfileTab() {
  const { user } = useAuth()
  const username = useProfileStore((state) => state.username)
  const setUsername = useProfileStore((state) => state.setUsername)
  const accountName = user ? `${user.firstName} ${user.lastName}`.trim() : ''
  const [draftUsername, setDraftUsername] = useState(username || accountName)
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
        <Text className='mt-2 font-geist-mono text-xs uppercase tracking-tight text-ink-muted'>
          Tu identidad dentro de Set
        </Text>

        <View className='mt-8 rounded-3xl border border-border-soft bg-surface-muted p-6'>
          <View className='h-16 w-16 items-center justify-center rounded-2xl bg-surface-dark'>
            <Text className='font-geist-mono-semibold text-2xl uppercase text-surface-card'>
              {(username || accountName || 'S')[0]}
            </Text>
          </View>
          <Text className='mt-5 font-geist-mono-semibold text-xl text-surface-dark'>
            {username || accountName || 'Usuario de Set'}
          </Text>
          {user?.email ? (
            <Text className='mt-1 font-geist-mono text-xs text-ink-subtle'>{user.email}</Text>
          ) : null}
        </View>

        <View className='mt-8'>
          <Text className='font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-subtle'>
            Nombre visible
          </Text>
          <TextInput
            value={draftUsername}
            onChangeText={setDraftUsername}
            placeholder='Escribe tu nombre'
            placeholderTextColor={Colors.ink.soft}
            autoCapitalize='words'
            autoCorrect={false}
            maxLength={32}
            className='mt-3 rounded-3xl border border-border-soft bg-surface-muted px-5 py-4 font-geist-mono text-base text-surface-dark'
          />
          <Text className='mt-2 font-geist-mono text-[10px] leading-4 text-ink-muted'>
            Este nombre aparecerá como autor en los tickets que crees a partir de ahora.
          </Text>
          <TouchableOpacity
            onPress={saveUsername}
            disabled={!hasChanges}
            className={`mt-4 flex-row items-center justify-between rounded-3xl px-5 py-4 ${hasChanges ? 'bg-surface-dark' : 'bg-surface-soft'}`}
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

        <View className='mt-12 border-t border-border-soft pt-8'>
          <Text className='font-geist-mono text-[10px] uppercase tracking-[2px] text-ink-subtle'>
            Desarrollo
          </Text>
          <TouchableOpacity
            onPress={clearLocalData}
            className='mt-4 flex-row items-center rounded-3xl border border-dashed border-border-dashed bg-surface-muted px-5 py-4'
            accessibilityRole='button'
            accessibilityLabel='Borrar todos los datos locales'
          >
            <View className='h-10 w-10 items-center justify-center rounded-full bg-surface-soft'>
              <Feather name='trash-2' size={16} color={Colors.surface.dark} />
            </View>
            <View className='ml-3 flex-1'>
              <Text className='font-geist-mono-medium text-sm text-surface-dark'>
                Borrar datos locales
              </Text>
              <Text className='mt-1 font-geist-mono text-xs leading-4 text-ink-subtle'>
                Limpia MMKV, fotos, caché y todos los stores
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
