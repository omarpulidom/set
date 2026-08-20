import { Feather } from '@expo/vector-icons'
import { FilterMode, MipmapMode, Skia, TileMode } from '@shopify/react-native-skia'
import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import { VisionCamera } from 'react-native-vision-camera'
import { SkiaCamera } from 'react-native-vision-camera-skia'
import { AppFontNames } from '@/components/fonts/font-names'
import { crossHalftone } from './crossHalftone'
import {
  type DiamondHalftoneUniforms,
  diamondHalftone,
  diamondHalftoneDefaults,
} from './diamondHalftone'
import { passthroughShader } from './passthroughShader'

type Props = {
  width: number
  height: number
  uniforms?: Partial<DiamondHalftoneUniforms>
}

type CameraPermission = 'not-determined' | 'authorized' | 'denied' | 'restricted'

type ShaderMode = 'detail' | 'cross' | 'passthrough'

/**
 * Live camera preview with switchable runtime effects.
 *
 * Three modes, cycled by tapping the badge:
 *  - `detail`:     Halftone diamond 45° (Manhattan distance).
 *  - `cross`:      Halftone plus sign (`min(|x|, |y|)` distance).
 *  - `passthrough`: Raw camera frame, no effect.
 *
 * The mode is stored in a `useSharedValue` so the per-frame worklet
 * reads it on the UI thread without crossing back to JS. The worklet
 * dispatches by calling the shader factories inline — closures that
 * try to marshal back to JS are forbidden in worklets, so we keep
 * the dispatch logic at module scope.
 */
export function HalftoneDiamondCamera({ width, height, uniforms }: Props) {
  const [permission, setPermission] = useState<CameraPermission>(
    () => (VisionCamera.cameraPermissionStatus ?? 'not-determined') as CameraPermission,
  )
  const [modeIndex, setModeIndex] = useState<number>(0)
  const modeShared = useSharedValue<number>(0)

  const _settings = useMemo(
    () => ({
      ...diamondHalftoneDefaults,
      ...uniforms,
    }),
    [
      uniforms,
    ],
  )

  useEffect(() => {
    let cancelled = false
    if (permission === 'not-determined') {
      VisionCamera.requestCameraPermission()
        .then((granted) => {
          if (cancelled) return
          if (granted) {
            setPermission('authorized')
          } else {
            setPermission((VisionCamera.cameraPermissionStatus ?? 'denied') as CameraPermission)
          }
        })
        .catch(() => {
          if (!cancelled) {
            setPermission('denied')
          }
        })
    }
    return () => {
      cancelled = true
    }
  }, [
    permission,
  ])

  const cycleMode = () => {
    setModeIndex((current) => {
      const next = (current + 1) % 3
      modeShared.value = next
      return next
    })
  }

  if (permission !== 'authorized') {
    return (
      <View
        style={{
          width,
          height,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
        }}
      >
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 12,
          }}
        >
          {permission === 'denied' || permission === 'restricted'
            ? 'Permiso de cámara denegado'
            : 'Solicitando permiso de cámara…'}
        </Text>
      </View>
    )
  }

  const activeMode: ShaderMode =
    modeIndex === 1 ? 'cross' : modeIndex === 2 ? 'passthrough' : 'detail'

  return (
    <View
      style={{
        width,
        height,
        position: 'relative',
      }}
    >
      <SkiaCamera
        device='back'
        isActive
        enablePreviewSizedOutputBuffers
        style={{
          width,
          height,
        }}
        onFrame={(frame, render) => {
          'worklet'
          render(({ canvas, frameTexture }) => {
            const paint = Skia.Paint()
            const imageShader = frameTexture.makeShaderOptions(
              TileMode.Clamp,
              TileMode.Clamp,
              FilterMode.Linear,
              MipmapMode.None,
            )
            const idx = modeShared.value
            // Inline dispatch — calling each factory directly is the
            // only safe form inside a worklet. Closures that try to
            // marshal back to JS will throw.
            const detailUniforms = [
              12,
              1.2,
              0,
              0,
              0.008,
              0.5,
              Math.PI / 4,
              0,
            ]
            const shader =
              idx === 1
                ? crossHalftone.makeShaderWithChildren(detailUniforms, [
                    imageShader,
                  ])
                : idx === 2
                  ? passthroughShader.makeShaderWithChildren(
                      [],
                      [
                        imageShader,
                      ],
                    )
                  : diamondHalftone.makeShaderWithChildren(detailUniforms, [
                      imageShader,
                    ])
            paint.setShader(shader)
            canvas.drawRect(
              {
                x: 0,
                y: 0,
                width: frameTexture.width(),
                height: frameTexture.height(),
              },
              paint,
            )
          })
          frame.dispose()
        }}
      />
      <TouchableOpacity
        accessibilityRole='button'
        accessibilityLabel={`Cambiar modo de shader, actual ${activeMode}`}
        onPress={cycleMode}
        style={styles.badge}
        activeOpacity={0.7}
      >
        <Feather
          name={activeMode === 'detail' ? 'grid' : activeMode === 'cross' ? 'plus' : 'image'}
          size={11}
          color='#fff'
        />
        <Text style={styles.badgeLabel}>
          {activeMode === 'detail' ? 'DETAIL' : activeMode === 'cross' ? 'CROSS' : 'PASSTHROUGH'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  badgeLabel: {
    color: '#fff',
    fontSize: 10,
    fontFamily: AppFontNames.GeistMono_500Medium,
    letterSpacing: 0.8,
  },
})

// Suppress unused-variable warning: `settings` is reserved for a
// future props->uniforms bridge; keep the reference for clarity.
void (null as unknown as DiamondHalftoneUniforms | null)
