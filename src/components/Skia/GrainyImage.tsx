import type {
  DataSourceParam,
  SkPaint,
  SkRuntimeEffect,
  SkShader,
} from '@shopify/react-native-skia'
import {
  Blur,
  Canvas,
  Fill,
  FilterMode,
  Group,
  ImageShader,
  MipmapMode,
  Paint,
  Shader,
  Skia,
  TileMode,
  useImage,
} from '@shopify/react-native-skia'
import { useMemo } from 'react'

const GRAIN_TEXTURE = require('@/assets/textures/grain.png')

const compiledGrayscaleShader = Skia.RuntimeEffect.Make(`
  uniform shader image;
  half4 main(float2 xy) {
    half4 c = image.eval(xy);
    float l = c.r * 0.299 + c.g * 0.587 + c.b * 0.114;
    return half4(vec3(l), c.a);
  }
`)

if (!compiledGrayscaleShader) {
  throw new Error('Failed to compile grayscale RuntimeEffect')
}

const grayscaleShader: SkRuntimeEffect = compiledGrayscaleShader

type Fit = 'cover' | 'contain' | 'fill' | 'fitHeight' | 'fitWidth' | 'none'

type Props = {
  source: DataSourceParam
  width: number
  height: number
  borderRadius?: number
  fit?: Fit
  blur?: number
  grainTileSize?: number
  grainOpacity?: number
  grayscale?: boolean
}

export const GrainyImage = ({
  source,
  width,
  height,
  borderRadius = 0,
  fit = 'cover',
  blur = 0.3,
  grainTileSize = 128,
  grainOpacity = 0.32,
  grayscale = false,
}: Props) => {
  const image = useImage(source)
  const grainImage = useImage(GRAIN_TEXTURE)

  const grainShader: SkShader | null = useMemo(() => {
    if (!grainImage) return null
    const scale = grainTileSize / Math.max(grainImage.width(), grainImage.height())
    const matrix = Skia.Matrix()
    matrix.scale(scale, scale)
    return grainImage.makeShaderOptions(
      TileMode.Repeat,
      TileMode.Repeat,
      FilterMode.Linear,
      MipmapMode.None,
      matrix,
    )
  }, [
    grainImage,
    grainTileSize,
  ])

  const grainPaint: SkPaint | null = useMemo(() => {
    if (!grainShader) return null
    const paint = Skia.Paint()
    paint.setShader(grainShader)
    return paint
  }, [
    grainShader,
  ])

  if (!image || !grainPaint) return null

  const imageShader = (
    <ImageShader
      image={image}
      fit={fit}
      rect={{
        x: 0,
        y: 0,
        width,
        height,
      }}
    />
  )

  return (
    <Canvas
      style={{
        width,
        height,
        borderRadius,
        overflow: 'hidden',
      }}
    >
      <Group
        layer={
          <Paint>
            <Blur blur={blur} />
          </Paint>
        }
      >
        <Fill>
          {grayscale ? <Shader source={grayscaleShader}>{imageShader}</Shader> : imageShader}
        </Fill>

        <Group opacity={grainOpacity}>
          <Fill paint={grainPaint} />
        </Group>
      </Group>
    </Canvas>
  )
}
