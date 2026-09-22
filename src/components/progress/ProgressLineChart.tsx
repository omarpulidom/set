import { Canvas, Circle, Line, Path, Skia } from '@shopify/react-native-skia'
import { useMemo, useState } from 'react'
import { Text, View } from 'react-native'
import { Colors } from '@/components/colors'

type ChartPoint = {
  label: string
  value: number
}

const CHART_HEIGHT = 116
const HORIZONTAL_PADDING = 2
const VERTICAL_PADDING = 10

export function ProgressLineChart({
  points,
  unit,
  title,
}: {
  points: ChartPoint[]
  unit: string
  title: string
}) {
  const [width, setWidth] = useState(0)
  const chart = useMemo(() => {
    if (width === 0 || points.length === 0) return null
    const values = points.map((point) => point.value)
    const minimum = Math.min(...values)
    const maximum = Math.max(...values)
    const spread = maximum - minimum || Math.max(maximum * 0.1, 1)
    const graphWidth = width - HORIZONTAL_PADDING * 2
    const graphHeight = CHART_HEIGHT - VERTICAL_PADDING * 2
    const path = Skia.Path.Make()
    const coordinates = points.map((point, index) => {
      const x =
        HORIZONTAL_PADDING +
        (points.length === 1 ? graphWidth / 2 : (index / (points.length - 1)) * graphWidth)
      const y = VERTICAL_PADDING + graphHeight - ((point.value - minimum) / spread) * graphHeight
      if (index === 0) path.moveTo(x, y)
      else path.lineTo(x, y)
      return {
        x,
        y,
      }
    })
    return {
      coordinates,
      maximum,
      minimum,
      path,
    }
  }, [
    points,
    width,
  ])

  if (points.length === 0) {
    return (
      <Text className='py-5 font-geist-mono text-xs text-ink-muted'>
        Sin registros en este periodo.
      </Text>
    )
  }

  return (
    <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      <View className='flex-row items-baseline justify-between'>
        <Text className='font-geist-mono-semibold text-xs uppercase tracking-[1px] text-surface-dark'>
          {title}
        </Text>
        {chart ? (
          <Text className='font-geist-mono text-[10px] text-ink-muted'>
            {chart.minimum.toLocaleString('es-MX')}–{chart.maximum.toLocaleString('es-MX')} {unit}
          </Text>
        ) : null}
      </View>
      {chart ? (
        <>
          <Canvas
            style={{
              height: CHART_HEIGHT,
              width,
            }}
          >
            {[
              0.2,
              0.4,
              0.6,
              0.8,
            ].map((position) => (
              <Line
                key={position}
                p1={{
                  x: HORIZONTAL_PADDING,
                  y: VERTICAL_PADDING + (CHART_HEIGHT - VERTICAL_PADDING * 2) * position,
                }}
                p2={{
                  x: width - HORIZONTAL_PADDING,
                  y: VERTICAL_PADDING + (CHART_HEIGHT - VERTICAL_PADDING * 2) * position,
                }}
                color={Colors.chart.grid}
                strokeWidth={1}
              />
            ))}
            {[
              0.2,
              0.4,
              0.6,
              0.8,
            ].map((position) => (
              <Line
                key={`vertical-${position}`}
                p1={{
                  x: HORIZONTAL_PADDING + (width - HORIZONTAL_PADDING * 2) * position,
                  y: VERTICAL_PADDING,
                }}
                p2={{
                  x: HORIZONTAL_PADDING + (width - HORIZONTAL_PADDING * 2) * position,
                  y: CHART_HEIGHT - VERTICAL_PADDING,
                }}
                color={Colors.chart.grid}
                strokeWidth={1}
              />
            ))}
            {points.length > 1 ? (
              <Path path={chart.path} color={Colors.chart.line} style='stroke' strokeWidth={2} />
            ) : null}
            {points.length === 1
              ? chart.coordinates.map((coordinate, index) => (
                  <Circle
                    key={`${points[index]?.label}-${index}`}
                    cx={coordinate.x}
                    cy={coordinate.y}
                    r={4}
                    color={Colors.surface.dark}
                  />
                ))
              : null}
          </Canvas>
          <View className='-mt-2 flex-row justify-between'>
            <Text className='font-geist-mono text-[9px] uppercase text-ink-muted'>
              {points[0]?.label}
            </Text>
            {points.length > 1 ? (
              <Text className='font-geist-mono text-[9px] uppercase text-ink-muted'>
                {points[points.length - 1]?.label}
              </Text>
            ) : null}
          </View>
        </>
      ) : (
        <View className='h-32' />
      )}
    </View>
  )
}
