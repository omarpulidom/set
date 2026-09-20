import { Feather } from '@expo/vector-icons'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '@/components/colors'
import { GymScreen } from '@/components/gym/GymUI'
import { mockProfile } from '@/features/gym/mock-data'
import { useRoutinesStore } from '@/features/routines/routines-store'
import { useTicketsStore } from '@/features/tickets/tickets-store'
import { WARNING_CLEAR_ALL_MMKVS_INSTANCES } from '@/lib/mmkv/stores'
import { queryClient } from '@/lib/qc'

const settings = [
  {
    icon: 'target',
    label: 'Meta semanal',
    value: `${mockProfile.weeklyGoalDays} días`,
  },
  {
    icon: 'trending-down',
    label: 'Objetivo de peso',
    value: '70 kg',
  },
  {
    icon: 'sliders',
    label: 'Unidades',
    value: 'Kilogramos',
  },
]

export default function AccountTab() {
  function handleClearPersistedState() {
    Alert.alert(
      '¿Limpiar datos guardados?',
      'Esto borra rutinas, tickets, círculos y la sesión persistida. La app quedará como recién instalada. Requerirá reiniciar para rehidratar desde cero.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: () => {
            try {
              WARNING_CLEAR_ALL_MMKVS_INSTANCES()
              queryClient.clear()
              useRoutinesStore.setState({
                routines: [],
              })
              useTicketsStore.setState({
                circles: [],
                tickets: [],
              })
              Alert.alert(
                'Datos limpiados',
                'Por favor cierra y vuelve a abrir la app para recargar desde cero.',
              )
            } catch (error) {
              Alert.alert(
                'Error al limpiar',
                error instanceof Error ? error.message : 'ErrorReible',
              )
            }
          },
        },
      ],
    )
  }

  return (
    <GymScreen title='Perfil'>
      <ScrollView
        className='flex-1 px-5'
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View className='mt-2 rounded-3xl border border-border-soft bg-surface-muted p-6'>
          <View className='flex-row items-center'>
            <View className='h-16 w-16 items-center justify-center rounded-2xl bg-surface-dark'>
              <Text className='font-geist-mono-semibold text-2xl text-surface-card'>
                {mockProfile.displayName[0]}
              </Text>
            </View>
            <View className='ml-4 flex-1'>
              <Text className='font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
                {mockProfile.displayName}
              </Text>
              <Text className='mt-1 font-geist-mono text-xs text-ink-subtle'>
                @omarpm · miembro desde 2026
              </Text>
            </View>
            <TouchableOpacity className='h-10 w-10 items-center justify-center rounded-full bg-surface-soft'>
              <Feather name='settings' size={17} color={Colors.surface.dark} />
            </TouchableOpacity>
          </View>

          <View className='mt-6 rounded-3xl bg-surface-soft px-4 py-4'>
            <Text className='font-geist-mono text-[10px] tracking-[1px] text-ink-muted'>
              ESTE AÑO
            </Text>
            <Text className='mt-1 font-geist-mono-semibold text-2xl tracking-[-1px] text-surface-dark'>
              34 entrenamientos
            </Text>
          </View>
        </View>

        <View className='mt-8 flex-row items-end justify-between'>
          <View>
            <Text className='font-geist-mono text-[10px] tracking-[2px] text-ink-subtle'>
              AJUSTES
            </Text>
            <Text className='mt-1 font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
              Preferencias
            </Text>
          </View>
        </View>

        <View className='mt-4 overflow-hidden rounded-3xl border border-border-soft bg-surface-muted'>
          {settings.map((setting, index) => (
            <TouchableOpacity
              key={setting.label}
              className={`flex-row items-center px-5 py-4 ${index ? 'border-t border-border-soft' : ''}`}
            >
              <View className='h-10 w-10 items-center justify-center rounded-full bg-surface-soft'>
                <Feather
                  name={setting.icon as keyof typeof Feather.glyphMap}
                  size={16}
                  color={Colors.surface.dark}
                />
              </View>
              <View className='ml-3 flex-1'>
                <Text className='font-geist-mono-medium text-sm text-surface-dark'>
                  {setting.label}
                </Text>
                <Text className='mt-1 font-geist-mono text-xs text-ink-subtle'>
                  {setting.value}
                </Text>
              </View>
              <Feather name='chevron-right' size={18} color={Colors.ink.soft} />
            </TouchableOpacity>
          ))}
        </View>

        <View className='mt-8 rounded-3xl bg-surface-dark p-6'>
          <Text className='font-geist-mono text-[10px] tracking-[2px] text-ink-light'>
            PRÓXIMAMENTE
          </Text>
          <View className='mt-4 flex-row items-start justify-between'>
            <View className='flex-1'>
              <Text className='font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-card'>
                Grupos y amigos
              </Text>
              <Text className='mt-2 font-geist-mono text-xs leading-5 text-ink-light'>
                Comparte tus tickets y sigue los entrenamientos de tu grupo.
              </Text>
            </View>
            <View className='ml-4 h-11 w-11 items-center justify-center rounded-2xl bg-surface-soft'>
              <Feather name='users' size={18} color={Colors.surface.dark} />
            </View>
          </View>
        </View>

        <View className='mt-8'>
          <Text className='font-geist-mono text-[10px] tracking-[2px] text-ink-subtle'>DEV</Text>
          <Text className='mt-1 font-geist-mono-semibold text-xl uppercase tracking-[-1px] text-surface-dark'>
            Herramientas
          </Text>
          <View className='mt-4 overflow-hidden rounded-3xl border border-dashed border-border-dashed bg-surface-muted'>
            <TouchableOpacity
              onPress={handleClearPersistedState}
              className='flex-row items-center px-5 py-4'
              accessibilityRole='button'
              accessibilityLabel='Limpiar datos guardados'
            >
              <View className='h-10 w-10 items-center justify-center rounded-full bg-surface-soft'>
                <Feather name='trash-2' size={16} color={Colors.surface.dark} />
              </View>
              <View className='ml-3 flex-1'>
                <Text className='font-geist-mono-medium text-sm text-surface-dark'>
                  Limpiar datos guardados
                </Text>
                <Text className='mt-1 font-geist-mono text-xs text-ink-subtle'>
                  Borra MMKV, react-query y reinicia rutinas/tickets
                </Text>
              </View>
              <Feather name='chevron-right' size={18} color={Colors.ink.soft} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </GymScreen>
  )
}
