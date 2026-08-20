import { Canvas, Fill, ImageShader, Shader, type SkImage } from '@shopify/react-native-skia'
import {
  type DiamondHalftoneUniforms,
  diamondHalftone,
  diamondHalftoneDefaults,
} from './diamondHalftone'

type Props = {
  image: SkImage
  width: number
  height: number
  uniforms?: Partial<DiamondHalftoneUniforms>
}

/**
 * Bitmap Halftone Diamond 45° applied to a static image.
 *
 * Use this to test the effect without involving the camera. Pass an
 * `SkImage` (e.g. via `useImage(...)` on a `require(...)` asset).
 */
export function DiamondHalftoneImage({ image, width, height, uniforms }: Props) {
  const settings = {
    ...diamondHalftoneDefaults,
    ...uniforms,
  }

  return (
    <Canvas
      style={{
        width,
        height,
      }}
    >
      <Fill>
        <Shader source={diamondHalftone} uniforms={settings}>
          <ImageShader image={image} x={0} y={0} width={width} height={height} fit='cover' />
        </Shader>
      </Fill>
    </Canvas>
  )
}
