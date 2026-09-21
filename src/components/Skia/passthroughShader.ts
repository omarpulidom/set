import { Skia, type SkRuntimeEffect } from '@shopify/react-native-skia'

/**
 * Identity shader: samples the source image at every pixel unchanged.
 *
 * Used as a "passthrough" mode in the halftone camera to compare the
 * raw camera frame against the processed halftone effect.
 */
const SHADER_SOURCE = `
uniform shader image;

half4 main(float2 xy) {
  return image.eval(xy);
}
`

const compiledPassthroughShader = Skia.RuntimeEffect.Make(SHADER_SOURCE)

if (!compiledPassthroughShader) {
  throw new Error('Failed to compile passthrough RuntimeEffect')
}

export const passthroughShader: SkRuntimeEffect = compiledPassthroughShader
