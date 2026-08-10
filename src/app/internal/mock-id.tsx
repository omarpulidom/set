import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HiddenMockId() {
  return (
    <SafeAreaView className='flex-1 items-center justify-center bg-surface-subtle p-6'>
      <View className='w-full rounded-3xl border border-border bg-surface-card p-7'>
        <Text className='font-geist-mono text-xs tracking-[3px] text-ink-soft'>SET / LEGACY MOCK</Text>
        <Text className='mt-5 font-geist-mono-semibold text-3xl text-ink-strong'>Identity card</Text>
        <Text className='mt-3 font-geist-mono text-sm leading-6 text-ink-soft'>
          La tarjeta ID original se conserva como referencia interna y no forma parte de la
          navegación.
        </Text>
      </View>
    </SafeAreaView>
  )
}
