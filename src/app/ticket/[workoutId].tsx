import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { StarRating } from '@/components/Elements/StarRating'
import { HalftoneDiamondCamera } from '@/components/Skia'
import { TicketFrame } from '@/components/tickets/TicketFrame'
import { useTicketMockStore } from '@/features/tickets/mock-store'

export default function TicketDetailScreen() {
  const router = useRouter()
  const { workoutId } = useLocalSearchParams<{
    workoutId?: string
  }>()
  const { react, tickets } = useTicketMockStore()
  const ticket = tickets.find((item) => item.id === workoutId)
  const [ticketRenderSize, setTicketRenderSize] = useState({
    width: 0,
  })

  const sizes = {
    logo: {
      long: ticketRenderSize.width * 0.178,
      short: ticketRenderSize.width * 0.095,
    },
    icon: {
      width: ticketRenderSize.width * 0.178,
      height: ticketRenderSize.width * 0.178,
    },
    title: ticketRenderSize.width * 0.22,
    label: ticketRenderSize.width * 0.03,
    content: ticketRenderSize.width * 0.026,
    gap: ticketRenderSize.width * 0.023,
    barcode: ticketRenderSize.width * 0.1,
    edge: ticketRenderSize.width * 0.021,
  }
  if (!ticket) return null

  return (
    <SafeAreaView
      className='flex-1 bg-surface'
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 40,
        }}
      >
        <View className='flex-row items-center justify-between'>
          <TouchableOpacity
            onPress={() => router.back()}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='arrow-left' size={19} color={Colors.surface.dark} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              void Share.share({
                message: `Set · ${ticket.routineName} · ${ticket.durationMinutes} min`,
              })
            }}
            className='h-10 w-10 items-center justify-center rounded-full bg-surface-muted'
          >
            <Feather name='share' size={17} color={Colors.surface.dark} />
          </TouchableOpacity>
        </View>
        <Text className='mt-7 font-geist-mono-semibold text-3xl uppercase tracking-[-1px] text-surface-dark'>
          {ticket.routineName}
        </Text>
        <TicketFrame ticket={ticket} onReact={(reaction) => react(ticket.id, reaction)} />
        <View className='mt-6 rounded-3xl bg-surface-muted p-5'>
          <View className='flex-row border-t border-border-soft pt-4'>
            <View className='flex-1'>
              <Text className='font-geist-mono text-[10px] text-ink-muted'>DURACIÓN</Text>
              <Text className='mt-1 font-geist-mono-semibold text-sm text-surface-dark'>
                {ticket.durationMinutes} min
              </Text>
            </View>
            <View className='flex-1 border-l border-border-soft pl-4'>
              <Text className='font-geist-mono text-[10px] text-ink-muted'>FIRMA</Text>
              <Text className='mt-1 font-geist-mono-semibold text-sm text-surface-dark'>
                {ticket.signedByAuthor ? 'Confirmada' : 'Pendiente'}
              </Text>
            </View>
          </View>
          <Text className='mt-5 font-geist-mono text-xs leading-5 text-ink-muted'>
            Aquí irá el diseño final del ticket, sus datos de series, peso, foto y composición
            visual.
          </Text>
        </View>

        {/* Short ticket */}
        <View
          className='w-full bg-white'
          onLayout={(e) => {
            setTicketRenderSize({
              width: e.nativeEvent.layout.width,
            })
          }}
        >
          <View className='flex-row'>
            {Array.from({
              length: 24,
            }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: sizes.edge,
                  borderRightWidth: sizes.edge,
                  borderTopWidth: sizes.edge * 0.75,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: Colors.surface.DEFAULT,
                }}
              />
            ))}
          </View>
          <View
            className='flex-row overflow-hidden'
            style={{
              paddingHorizontal: sizes.gap * 0.57,
            }}
          >
            {/* Info */}
            <View
              className='flex-1'
              style={{
                padding: sizes.gap * 2.3,
              }}
            >
              {/* Logo */}
              <View className='self-start'>
                <Image
                  source={require('@/assets/images/logo/logo.png')}
                  resizeMode='contain'
                  style={{
                    width: sizes.logo.short,
                    height: sizes.logo.short,
                  }}
                />
              </View>
              {/* Separator */}
              <Text
                className='font-merchant text-center text-legacy-ticketDivider'
                style={{
                  fontSize: sizes.content,
                  marginTop: sizes.edge * 2,
                  alignSelf: 'center',
                  marginHorizontal: -sizes.gap,
                }}
              >
                ************************************************
              </Text>

              {/* Header */}
              <View
                style={{
                  gap: sizes.content * 0.5,
                  marginVertical: sizes.edge * 1.5,
                }}
              >
                <View className='flex-row justify-between'>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content * 1.25,
                    }}
                  >
                    GYM WORKOUT
                  </Text>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content * 1.25,
                    }}
                  >
                    @OMARPM
                  </Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text
                    className='font-merchant text-ink-muted'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    UPPER DAY
                  </Text>
                  <Text
                    className='font-merchant text-ink-muted'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    AUGUST 5, 2026
                  </Text>
                </View>
              </View>

              {/* Halftone diamond camera */}
              {ticketRenderSize.width > 0 ? (
                <View
                  className='self-center'
                  style={{
                    marginVertical: sizes.gap,
                  }}
                >
                  <HalftoneDiamondCamera width={ticketRenderSize.width} height={ticketRenderSize.width} />
                </View>
              ) : null}

              {/* Detailed info */}
              <View
                style={{
                  gap: sizes.content * 2,
                }}
              >
                <View className='flex-row justify-between w-full'>
                  {/* Item - EXERCISES */}
                  <View
                    className='items-start'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      EXERCISES
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      8
                    </Text>
                  </View>
                  {/* Item - SETS */}
                  <View
                    className='items-center'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      SETS
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      23
                    </Text>
                  </View>
                  {/* Item - REPS */}
                  <View
                    className='items-center'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      REPS
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      214
                    </Text>
                  </View>
                  {/* Item - DURATION */}
                  <View
                    className='items-end'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      DURATION
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      01:18
                    </Text>
                  </View>
                </View>
                <View className='flex-row justify-between w-full'>
                  {/* Item - COMPLETITION */}
                  <View
                    className='items-start'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      COMPLETITION
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      92%
                    </Text>
                  </View>
                  {/* Item - VOLUME CHANGE */}
                  <View
                    className='items-center'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      VOLUME CHANGE
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      +6.4%
                    </Text>
                  </View>
                  {/* Item - TOTAL */}
                  <View
                    className='items-end'
                    style={{
                      gap: sizes.label * 0.75,
                    }}
                  >
                    <Text
                      className='font-merchant text-ink-muted'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      TOTAL
                    </Text>
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.label,
                      }}
                    >
                      12,480 kg
                    </Text>
                  </View>
                </View>
              </View>

              {/* Separator */}
              <Text
                className='font-merchant text-center text-legacy-ticketDivider'
                style={{
                  fontSize: sizes.content,
                  alignSelf: 'center',
                  marginTop: sizes.edge * 1.75,
                  marginHorizontal: -sizes.gap,
                }}
              >
                ************************************************
              </Text>

              {/* Footer - HOUR */}
              <View
                style={{
                  gap: sizes.content * 0.5,
                  marginTop: sizes.gap * 1.5,
                }}
              >
                <Text
                  className='font-merchant text-center text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  OFFICE HOUR
                </Text>
                <Text
                  className='font-merchant text-center text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  THU-AUG 02:12 PM
                </Text>
              </View>

              <Text
                className='font-merchant text-center text-ink-muted'
                style={{
                  fontSize: sizes.content,
                  marginTop: sizes.gap * 1.75,
                }}
              >
                Todo lo que repites, te convierte.
              </Text>
              <Text
                className='font-merchant text-center text-legacy-ticketDivider'
                style={{
                  fontSize: sizes.content,
                  marginTop: sizes.gap,
                }}
              >
                #00032
              </Text>
            </View>
          </View>
          <View className='flex-row'>
            {Array.from({
              length: 24,
            }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: sizes.edge,
                  borderRightWidth: sizes.edge,
                  borderTopWidth: sizes.edge * 0.75,
                  borderLeftColor: Colors.surface.DEFAULT,
                  borderRightColor: Colors.surface.DEFAULT,
                  borderTopColor: 'transparent',
                }}
              />
            ))}
          </View>
        </View>

        {/* Detail ticket */}
        <View
          className='w-full bg-white'
          onLayout={(e) => {
            setTicketRenderSize({
              width: e.nativeEvent.layout.width,
            })
          }}
        >
          <View className='flex-row'>
            {Array.from({
              length: 24,
            }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: sizes.edge,
                  borderRightWidth: sizes.edge,
                  borderTopWidth: sizes.edge * 0.75,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderTopColor: Colors.surface.DEFAULT,
                }}
              />
            ))}
          </View>
          <View
            className='flex-row overflow-hidden'
            style={{
              paddingHorizontal: sizes.gap * 0.57,
              paddingVertical: sizes.gap * 1.5,
            }}
          >
            {/* Info */}
            <View
              className='flex-1'
              style={{
                padding: sizes.gap * 2.3,
              }}
            >
              {/* Logo */}
              <View className='self-center'>
                <Image
                  source={require('@/assets/images/logo/logo.png')}
                  resizeMode='contain'
                  style={{
                    width: sizes.logo.long,
                    height: sizes.logo.long,
                  }}
                />
              </View>
              {/* Data */}
              <View
                style={{
                  gap: sizes.gap * 0.75,
                  marginBottom: sizes.gap * 3.5,
                  marginTop: sizes.gap * 1.2,
                }}
              >
                <Text
                  className='font-merchant text-center text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  SESSION:#23
                </Text>
                <Text
                  className='font-merchant text-center text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  AUGUST 2, 2026
                </Text>
                <Text
                  className='font-merchant text-center text-ink-muted'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  UPPER DAY
                </Text>
              </View>
              {/* Table */}
              <View
                style={{
                  position: 'relative',
                }}
              >
                {/* Separator */}
                <Text
                  className='font-merchant text-center text-legacy-ticketDivider'
                  style={{
                    fontSize: sizes.content,
                    position: 'absolute',
                    alignSelf: 'center',
                    top: sizes.gap * 2.14,
                    marginHorizontal: -sizes.gap,
                  }}
                >
                  ************************************************
                </Text>
                {/* Table */}
                <View className='w-full flex-row justify-between'>
                  {/* Column 1 */}
                  <View
                    style={{
                      gap: sizes.gap * 3.14,
                    }}
                  >
                    {/* Label */}
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      EXERCISES
                    </Text>
                    {/* List */}
                    <View
                      style={{
                        gap: sizes.gap,
                      }}
                    >
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        1. BENCH PRESS
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        2. LAT PULLDOWN
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        3. INCLINE DB PRESS
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        4. SHOULDER PRESS
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        5. LATERAL RAISE
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        6. HAMMER CURL
                      </Text>
                    </View>
                  </View>
                  {/* Column 2 */}
                  <View
                    className='items-center'
                    style={{
                      gap: sizes.gap * 3.14,
                    }}
                  >
                    {/* Label */}
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      SETS/REPS
                    </Text>
                    {/* List */}
                    <View
                      style={{
                        gap: sizes.gap,
                      }}
                    >
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        4 x 6
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        3 x 12
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        3 x 10
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        3 x 10
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        4 x 15
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        3 x 12
                      </Text>
                    </View>
                  </View>
                  {/* Column 3 */}
                  <View
                    className='items-end'
                    style={{
                      gap: sizes.gap * 3.14,
                    }}
                  >
                    {/* Label */}
                    <Text
                      className='font-merchant text-legacy-ticket'
                      style={{
                        fontSize: sizes.content,
                      }}
                    >
                      WEIGHT
                    </Text>
                    {/* List */}
                    <View
                      style={{
                        gap: sizes.gap,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        @ 85 kg
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        @ 65 kg
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        @ 32 kg
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        @ 25 kg
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        @ 10 kg
                      </Text>
                      <Text
                        className='font-merchant text-legacy-ticket'
                        style={{
                          fontSize: sizes.content,
                        }}
                      >
                        @ 18 kg
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {/* Separator */}
              <Text
                className='font-merchant text-center text-legacy-ticketDivider'
                style={{
                  fontSize: sizes.content,
                  alignSelf: 'center',
                  marginTop: sizes.gap * 3.14,
                  marginHorizontal: -sizes.gap,
                }}
              >
                ************************************************
              </Text>
              {/* Price info */}
              <View
                style={{
                  marginTop: sizes.gap,
                  marginBottom: sizes.gap * 1.28,
                }}
              >
                <View
                  className='flex-row justify-between'
                  style={{
                    marginBottom: sizes.gap * 1.28,
                  }}
                >
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    SETS
                  </Text>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    23
                  </Text>
                </View>
                <View
                  className='flex-row justify-between'
                  style={{
                    marginBottom: sizes.gap * 1.28,
                  }}
                >
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    REPS
                  </Text>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    214
                  </Text>
                </View>
                <View
                  className='flex-row justify-between'
                  style={{
                    marginBottom: sizes.gap * 1.28,
                  }}
                >
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    DURATION
                  </Text>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    01:18
                  </Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                      marginBottom: sizes.gap * 2.28,
                    }}
                  >
                    VOLUME CHANGE
                  </Text>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    +6.4%
                  </Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.label,
                    }}
                  >
                    TOTAL
                  </Text>
                  <Text
                    className='font-merchant text-legacy-ticket'
                    style={{
                      fontSize: sizes.label,
                    }}
                  >
                    12,480 kg
                  </Text>
                </View>
              </View>
              {/* Rating */}
              <View className='self-center'>
                <StarRating
                  percentage={0.7}
                  size={sizes.label * 1.33}
                  color={Colors.legacy.ticket}
                />
              </View>
              <Text
                className='font-merchant text-center text-legacy-ticket'
                style={{
                  fontSize: sizes.label,
                  marginVertical: sizes.gap * 1.28,
                  alignSelf: 'center',
                  marginHorizontal: -sizes.gap,
                }}
              >
                ************** CHECK CLOSED **************
              </Text>
              <View className='flex-row justify-between'>
                <Text
                  className='font-merchant text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  Thursday 2 @ 02:12 PM
                </Text>
                <Text
                  className='font-merchant text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  @OMARPM
                </Text>
              </View>
              <Text
                className='font-barcode-39 text-center text-legacy-ticket'
                style={{
                  fontSize: sizes.barcode,
                  marginTop: sizes.gap * 0.75,
                  marginBottom: -sizes.gap,
                }}
              >
                111111111111111111
              </Text>
              <Text
                className='font-merchant text-center text-legacy-ticket'
                style={{
                  fontSize: sizes.content,
                }}
              >
                Thanks for using SET!
              </Text>
              <Text
                className='font-merchant text-center text-ink-muted'
                style={{
                  fontSize: sizes.content,
                  marginTop: sizes.gap * 1.75,
                }}
              >
                Todo lo que repites, te convierte.
              </Text>
            </View>
          </View>
          <View className='flex-row'>
            {Array.from({
              length: 24,
            }).map((_, i) => (
              <View
                key={i}
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: sizes.edge,
                  borderRightWidth: sizes.edge,
                  borderTopWidth: sizes.edge * 0.75,
                  borderLeftColor: Colors.surface.DEFAULT,
                  borderRightColor: Colors.surface.DEFAULT,
                  borderTopColor: 'transparent',
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
