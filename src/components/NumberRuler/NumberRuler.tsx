import { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Colors } from '@/components/colors'

const TICK_WIDTH = 30

/**
 * Horizontal wheel picker (iOS-style ruler) for picking a number.
 *
 * Renders a row of evenly-spaced ticks. The selected value floats in
 * a bubble above the center of the strip and snaps to the nearest
 * tick as the user scrolls. Internally it tracks integer tick
 * indices, so the `step` parameter only controls the *value* of each
 * tick — `step: 2.5` produces ticks at 0, 2.5, 5.0, 7.5, …
 */
export function NumberRuler({
  label,
  value,
  min,
  max,
  step = 1,
  onValueChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onValueChange: (value: number) => void
}) {
  const scrollRef = useRef<ScrollView>(null)
  const [rulerWidth, setRulerWidth] = useState(0)
  // React may render a few tick values behind while a fast drag is in progress.
  // Keep those values so they are not mistaken for external prop changes.
  const positionedValueRef = useRef<number | null>(null)
  const pendingInternalValuesRef = useRef(new Set<number>())
  const sidePadding = Math.max(0, (rulerWidth - TICK_WIDTH) / 2)
  const tickCount = Math.floor((max - min) / step) + 1
  const values = Array.from(
    {
      length: tickCount,
    },
    (_, index) => +(min + index * step).toFixed(2),
  )

  useEffect(() => {
    if (rulerWidth === 0) return

    if (pendingInternalValuesRef.current.has(value)) {
      if (positionedValueRef.current === value) {
        pendingInternalValuesRef.current.clear()
      }
      return
    }

    if (positionedValueRef.current === value) return
    const initialIndex = Math.round((value - min) / step)
    scrollRef.current?.scrollTo({
      x: initialIndex * TICK_WIDTH,
      animated: false,
    })
    positionedValueRef.current = value
  }, [
    value,
    min,
    step,
    rulerWidth,
  ])

  function commitOffset(offset: number) {
    const index = Math.round(offset / TICK_WIDTH)
    const nextValue = Math.max(min, Math.min(max, +(min + index * step).toFixed(2)))
    if (positionedValueRef.current === nextValue) return
    positionedValueRef.current = nextValue
    pendingInternalValuesRef.current.add(nextValue)
    onValueChange(nextValue)
  }

  function formatTick(item: number) {
    // Drop the trailing ".0" for integer-valued ticks so kg values
    // read as "60" rather than "60.0".
    return item.toFixed(1).replace(/\.0$/, '')
  }

  return (
    <View className='mt-3'>
      {label ? (
        <Text className='font-geist-mono text-[10px] uppercase tracking-[1.5px] text-ink-muted'>
          {label}
        </Text>
      ) : null}
      <View
        className='mt-2 h-24 overflow-hidden'
        onLayout={(event) => setRulerWidth(event.nativeEvent.layout.width)}
      >
        <View className='absolute left-0 right-0 top-0 z-10 items-center'>
          <View className='rounded-full bg-surface-dark px-3 py-1.5'>
            <Text className='font-geist-mono-semibold text-sm text-surface-card'>
              {formatTick(value)}
            </Text>
          </View>
        </View>
        <View
          pointerEvents='none'
          style={{
            position: 'absolute',
            left: '50%',
            top: 50,
            marginLeft: -1,
            height: 36,
            width: 2,
            zIndex: 10,
            backgroundColor: Colors.surface.dark,
          }}
        />
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={TICK_WIDTH}
          decelerationRate='fast'
          contentContainerStyle={{
            paddingHorizontal: sidePadding,
            paddingTop: 50,
          }}
          onScroll={(event) => commitOffset(event.nativeEvent.contentOffset.x)}
          onMomentumScrollEnd={(event) => commitOffset(event.nativeEvent.contentOffset.x)}
          scrollEventThrottle={16}
        >
          {values.map((item) => (
            <View
              key={item}
              style={{
                width: TICK_WIDTH,
              }}
              className='h-10 items-center justify-end'
            >
              <View
                className={`w-0.5 rounded-full ${item % 5 === 0 ? 'h-7 bg-surface-soft' : 'h-5 bg-surface-soft'}`}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  )
}
