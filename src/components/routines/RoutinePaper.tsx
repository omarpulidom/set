import type { ReactNode } from 'react'
import { View } from 'react-native'

type RoutinePaperProps = {
  children: ReactNode
  className?: string
  topRule?: boolean
}

export function RoutinePaper({ children, className = '', topRule = true }: RoutinePaperProps) {
  return (
    <View className={`relative overflow-hidden bg-surface-card px-6 py-7 shadow-sm ${className}`}>
      <View className='absolute bottom-16 left-3 top-16 justify-between'>
        <View className='h-4 w-4 rounded-full bg-surface-muted' />
        <View className='h-4 w-4 rounded-full bg-surface-muted' />
        <View className='h-4 w-4 rounded-full bg-surface-muted' />
      </View>
      <View
        className={`ml-4 flex-1 ${topRule ? 'border-t border-dashed border-border-dashed pt-5' : ''}`}
      >
        {children}
      </View>
    </View>
  )
}

export function RoutineRule() {
  return <View className='border-t border-dashed border-border-dashed' />
}
