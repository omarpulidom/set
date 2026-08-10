import { useMemo, useState } from 'react'
import { type LayoutChangeEvent, Text, View } from 'react-native'

type ChartProps = {
  title: string
  summary: string
  values: number[]
  unit?: string
  bar?: boolean
}

export function TrainingChart({ title, summary, values, unit, bar = false }: ChartProps) {
  const [width, setWidth] = useState(0)
  const height = 142
  const paddingTop = 12
  const paddingBottom = 22
  const drawableHeight = height - paddingTop - paddingBottom
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const points = useMemo(
    () =>
      values.map((value, index) => ({
        x: values.length > 1 ? (index / (values.length - 1)) * width : width / 2,
        y: paddingTop + (1 - (value - min) / range) * drawableHeight,
      })),
    [
      drawableHeight,
      min,
      range,
      values,
      width,
    ],
  )

  function onLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width)
  }

  return (
    <View className='border-b border-dashed border-border-chart py-6'>
      <View className='mb-4 flex-row items-baseline justify-between gap-4'>
        <Text className='font-geist-mono text-sm font-bold tracking-[1px] text-ink'>{title}</Text>
        <Text className='font-geist-mono text-xs text-chart-muted'>{summary}</Text>
      </View>
      <View
        className='relative'
        style={{
          height,
        }}
        onLayout={onLayout}
      >
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <View
            key={`h-${index}`}
            className='absolute left-0 right-0 border-t border-dashed border-chart-grid'
            style={{
              top: paddingTop + (index * drawableHeight) / 3,
            }}
          />
        ))}
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <View
            key={`v-${index}`}
            className='absolute bottom-5 top-3 border-l border-dashed border-chart-gridLight'
            style={{
              left: width ? (index * width) / 5 : 0,
            }}
          />
        ))}
        {bar
          ? points.map((point, index) => (
              <View
                key={`bar-${index}`}
                className='absolute w-[2px] bg-chart-line'
                style={{
                  left: point.x,
                  top: point.y,
                  height: height - paddingBottom - point.y,
                }}
              />
            ))
          : points.slice(1).map((point, index) => {
              const previous = points[index]
              const segmentWidth = Math.hypot(point.x - previous.x, point.y - previous.y)
              const angle = (Math.atan2(point.y - previous.y, point.x - previous.x) * 180) / Math.PI
              return (
                <View
                  key={`segment-${index}`}
                  className='absolute h-[2px] rounded-full bg-chart-line'
                  style={{
                    width: segmentWidth,
                    left: (previous.x + point.x - segmentWidth) / 2,
                    top: (previous.y + point.y) / 2 - 1,
                    transform: [
                      {
                        rotate: `${angle}deg`,
                      },
                    ],
                  }}
                />
              )
            })}
        <Text className='absolute bottom-0 left-0 font-geist-mono text-[10px] text-chart-label'>0 KM</Text>
        <Text className='absolute bottom-0 right-0 font-geist-mono text-[10px] text-chart-label'>
          6.7 KM
        </Text>
        {unit ? (
          <Text className='absolute right-0 top-0 font-geist-mono text-[10px] text-chart-label'>
            {unit}
          </Text>
        ) : null}
      </View>
    </View>
  )
}
