import type { ReactNode } from 'react'
import { View } from 'react-native'

type RoutinePaperProps = {
  children: ReactNode
  className?: string
}

export function RoutinePaper({ children, className = '' }: RoutinePaperProps) {
  return (
    <View className={`relative overflow-hidden bg-surface-card px-6 py-7 shadow-sm ${className}`}>
      <View className='absolute bottom-8 left-3 top-8 justify-between'>
        <View className='h-4 w-4 rounded-full bg-surface-muted' />
        <View className='h-4 w-4 rounded-full bg-surface-muted' />
        <View className='h-4 w-4 rounded-full bg-surface-muted' />
      </View>
      <View className='ml-4 border-t border-dashed border-border-dashed pt-5'>{children}</View>
    </View>
  )
}

export function RoutineRule() {
  return <View className='border-t border-dashed border-border-dashed' />
}
