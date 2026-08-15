import {
  Canvas,
  Fill,
  Group,
  ImageShader,
  LinearGradient,
  RoundedRect,
  Skia,
  useImage,
} from '@shopify/react-native-skia'
import { useFocusEffect } from 'expo-router'
import Gyroscope from 'expo-sensors/build/Gyroscope'
import { type PropsWithChildren, useCallback, useMemo } from 'react'
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const HOLO_TEXTURE = require('@/assets/textures/holo.png')
const HOLO_OPACITY = 0.5

const SHIMMER_COLORS = [
  'rgba(0, 0, 0, 0)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(0, 0, 0, 0)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(0, 0, 0, 0)',
  'rgba(255, 255, 255, 0.3)',
  'rgba(0, 0, 0, 0)',
]
const SHIMMER_POSITIONS = [
  0,
  0.17,
  0.35,
  0.5,
  0.65,
  0.82,
  1,
]

interface HoloCardProps {
  maxAngle?: number
  width: number
  height: number
  borderRadius?: number
  style?: StyleProp<ViewStyle>
}

const RAD2DEG = 180 / Math.PI

function clamp(v: number, min: number, max: number) {
  'worklet'
  return Math.min(Math.max(v, min), max)
}

export const HoloCard = ({
  children,
  maxAngle = 8,
  width,
  height,
  borderRadius = 12,
  style,
}: PropsWithChildren<HoloCardProps>) => {
  const rotateX = useSharedValue(0)
  const rotateY = useSharedValue(0)
  const holoImage = useImage(HOLO_TEXTURE)

  const rStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          perspective: 2500,
        },
        {
          rotateX: `${rotateX.value}deg`,
        },
        {
          rotateY: `${rotateY.value}deg`,
        },
      ],
    }),
    [],
  )

  const gradientStart = useDerivedValue(() => ({
    x: -width + (width / 2 + (width / 2) * (rotateY.value / maxAngle)),
    y: -height + (height / 2 + (height / 2) * (rotateX.value / maxAngle)),
  }))

  const gradientEnd = useDerivedValue(() => ({
    x: width + (width / 2 + (width / 2) * (rotateY.value / maxAngle)),
    y: height + (height / 2 + (height / 2) * (rotateX.value / maxAngle)),
  }))

  const holoClip = useMemo(
    () =>
      Skia.Path.RRect(Skia.RRectXY(Skia.XYWHRect(0, 0, width, height), borderRadius, borderRadius)),
    [
      width,
      height,
      borderRadius,
    ],
  )

  useFocusEffect(
    useCallback(() => {
      let unsubscribe: {
        remove: () => void
      } | null = null
      let prev = Date.now()

      try {
        Gyroscope.setUpdateInterval(16)
        unsubscribe = Gyroscope.addListener((gyroscopeData) => {
          const now = Date.now()
          const dt = (now - prev) / 1000
          prev = now

          rotateX.value = clamp(
            rotateX.value + (gyroscopeData.x / 2) * dt * RAD2DEG,
            -maxAngle,
            maxAngle,
          )
          rotateY.value = clamp(
            rotateY.value - (gyroscopeData.y / 2) * dt * RAD2DEG,
            -maxAngle,
            maxAngle,
          )
        })
      } catch (e) {
        console.warn('Gyroscope not available:', e)
      }

      return () => {
        rotateX.value = withTiming(0, {
          duration: 500,
        })
        rotateY.value = withTiming(0, {
          duration: 500,
        })
        try {
          unsubscribe?.remove()
        } catch {}
      }
    }, [
      maxAngle,
    ]),
  )

  return (
    <Animated.View
      style={[
        rStyle,
        style,
      ]}
    >
      {children}

      <Canvas
        pointerEvents={'none'}
        style={[
          StyleSheet.absoluteFill,
          {
            width,
            height,
          },
        ]}
      >
        <RoundedRect x={0} y={0} r={borderRadius} width={width} height={height}>
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={SHIMMER_COLORS}
            positions={SHIMMER_POSITIONS}
          />
        </RoundedRect>

        {holoImage && (
          <Group clip={holoClip} blendMode={'srcIn'} opacity={HOLO_OPACITY}>
            <Fill>
              <ImageShader
                image={holoImage}
                fit='fill'
                rect={{
                  x: 0,
                  y: 0,
                  width,
                  height,
                }}
                tx={'decal'}
                ty={'decal'}
              />
            </Fill>
          </Group>
        )}

        <Group clip={holoClip} blendMode={'screen'} opacity={HOLO_OPACITY * 0.7}>
          <RoundedRect x={0} y={0} r={borderRadius} width={width} height={height}>
            <LinearGradient
              start={gradientStart}
              end={gradientEnd}
              colors={SHIMMER_COLORS}
              positions={SHIMMER_POSITIONS}
            />
          </RoundedRect>
        </Group>
      </Canvas>
    </Animated.View>
  )
}
