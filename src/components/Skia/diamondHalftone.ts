import { Skia, type SkRuntimeEffect } from '@shopify/react-native-skia'

const SHADER_SOURCE = `
uniform shader image;

uniform float cellSize;
uniform float contrast;
uniform float brightness;
uniform float threshold;
uniform float softness;
uniform float gamma;
uniform float angle;
uniform float invert;

float2 rotatePoint(float2 p, float a) {
  float c = cos(a);
  float s = sin(a);

  return float2(
    p.x * c - p.y * s,
    p.x * s + p.y * c
  );
}

half4 main(float2 xy) {
  // Rotate grid
  float2 p = rotatePoint(xy, angle);

  // Identify current halftone cell
  float2 cellId =
    floor(p / cellSize);

  float2 cellCenter =
    (cellId + float2(0.5)) * cellSize;

  // Convert cell center back to image coordinates
  float2 samplePoint =
    rotatePoint(cellCenter, -angle);

  // One luminance sample for the whole cell
  half4 src =
    image.eval(samplePoint);

  float lum =
      src.r * 0.299
    + src.g * 0.587
    + src.b * 0.114;

  // Tonal controls
  lum += brightness;

  lum =
    (lum - 0.5) * contrast + 0.5;

  lum =
    clamp(lum, 0.0, 1.0);

  // Image luminance -> ink coverage
  float ink =
    clamp(
      (1.0 - lum) + threshold,
      0.0,
      1.0
    );

  // Controls how quickly diamonds grow
  float shapedInk =
    pow(
      max(ink, 0.00001),
      max(gamma, 0.00001)
    );

  // Diamond radius
  float radius =
    shapedInk * cellSize;

  // Position relative to current cell center
  float2 local =
    p - cellCenter;

  // Manhattan distance = true diamond
  float d =
    abs(local.x) +
    abs(local.y);

  float feather =
    max(
      0.001,
      cellSize * softness
    );

  float mask =
    1.0 -
    smoothstep(
      radius - feather,
      radius + feather,
      d
    );

  // White paper / black ink
  float result =
    1.0 - mask;

  // Optional inversion
  result =
    mix(
      result,
      1.0 - result,
      clamp(invert, 0.0, 1.0)
    );

  return half4(
    result,
    result,
    result,
    1.0
  );
}
`

const compiledDiamondHalftone = Skia.RuntimeEffect.Make(SHADER_SOURCE)

if (!compiledDiamondHalftone) {
  throw new Error('Failed to compile diamond halftone RuntimeEffect')
}

export const diamondHalftone: SkRuntimeEffect = compiledDiamondHalftone

export const diamondHalftoneDefaults = {
  cellSize: 8,
  contrast: 1.2,
  brightness: 0,
  threshold: 0,
  softness: 0.025,
  gamma: 0.5,
  angle: Math.PI / 4,
  invert: 0,
}

export type DiamondHalftoneUniforms = {
  cellSize: number
  contrast: number
  brightness: number
  threshold: number
  softness: number
  gamma: number
  angle: number
  invert: number
}
