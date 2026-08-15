import Ionicons from '@expo/vector-icons/Ionicons'
import { StyleSheet, View } from 'react-native'
import { Colors } from '@/components/colors'

interface StarRatingProps {
  percentage: number // 0.0 - 1.0
  size?: number
  color?: string
}

export function StarRating({
  percentage,
  size = 18,
  color = Colors.legacy.ticket,
}: StarRatingProps) {
  const progress = Math.max(0, Math.min(1, percentage))

  const spacing = 2
  const totalWidth = size * 5 + spacing * 4

  return (
    <View
      style={{
        width: totalWidth,
        height: size,
      }}
    >
      {/* Estrellas vacías */}
      <View className='flex-row' style={StyleSheet.absoluteFillObject}>
        {Array.from({
          length: 5,
        }).map((_, i) => (
          <Ionicons
            key={`bg-${i}`}
            name='star-outline'
            size={size}
            color={color}
            style={
              i < 4
                ? {
                    marginRight: spacing,
                  }
                : undefined
            }
          />
        ))}
      </View>

      {/* Estrellas rellenas */}
      <View
        style={{
          position: 'absolute',
          overflow: 'hidden',
          width: totalWidth * progress,
          height: size,
        }}
      >
        <View className='flex-row'>
          {Array.from({
            length: 5,
          }).map((_, i) => (
            <Ionicons
              key={`fg-${i}`}
              name='star'
              size={size}
              color={color}
              style={
                i < 4
                  ? {
                      marginRight: spacing,
                    }
                  : undefined
              }
            />
          ))}
        </View>
      </View>
    </View>
  )
}
