import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, ScrollView, Share, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/components/colors'
import { StarRating } from '@/components/Elements/StarRating'
import { useTicketsStore } from '@/features/tickets/tickets-store'

const WEEKDAYS_SHORT = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
] as const
const WEEKDAYS_LONG = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const
const MONTHS_SHORT = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
] as const
const MONTHS_LONG = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
] as const

function formatClock(date: Date) {
  const hour24 = date.getHours()
  const hour12 = hour24 % 12 || 12
  const minute = String(date.getMinutes()).padStart(2, '0')
  const period = hour24 >= 12 ? 'PM' : 'AM'
  return `${String(hour12).padStart(2, '0')}:${minute} ${period}`
}

function formatTicketDate(isoDate: string) {
  const date = new Date(isoDate)
  return `${MONTHS_LONG[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

function formatOfficeTime(isoDate: string) {
  const date = new Date(isoDate)
  return `${WEEKDAYS_SHORT[date.getDay()]}-${MONTHS_SHORT[date.getMonth()]} ${formatClock(date)}`
}

function formatClosedTime(isoDate: string) {
  const date = new Date(isoDate)
  return `${WEEKDAYS_LONG[date.getDay()]} ${date.getDate()} @ ${formatClock(date)}`
}

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function formatVolumeChange(value: number | undefined) {
  if (value === undefined) return '—'
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

function formatAuthor(authorName: string) {
  return `@${authorName.replace(/\s+/g, '').toUpperCase()}`
}

export default function TicketDetailScreen() {
  const router = useRouter()
  const { workoutId } = useLocalSearchParams<{
    workoutId?: string
  }>()
  const tickets = useTicketsStore((state) => state.tickets)
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
                    {formatAuthor(ticket.authorName)}
                  </Text>
                </View>
                <View className='flex-row justify-between'>
                  <Text
                    className='font-merchant text-ink-muted'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    {ticket.routineName.toUpperCase()}
                  </Text>
                  <Text
                    className='font-merchant text-ink-muted'
                    style={{
                      fontSize: sizes.content,
                    }}
                  >
                    {formatTicketDate(ticket.completedAt)}
                  </Text>
                </View>
              </View>

              {/* Halftone diamond camera */}
              {ticketRenderSize.width > 0 ? (
                <View
                  style={{
                    width: '100%',
                    marginVertical: sizes.gap * 1.5,
                  }}
                >
                  <Image
                    source={{
                      uri: ticket.photo,
                    }}
                    resizeMode='cover'
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                    }}
                  />
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
                      {ticket.exercises.length}
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
                      {ticket.totalSets}
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
                      {ticket.totalReps}
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
                      {formatDuration(ticket.durationSeconds)}
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
                      {ticket.completionPercentage}%
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
                      {formatVolumeChange(ticket.volumeChangePercentage)}
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
                      {Math.round(ticket.volumeKg).toLocaleString('en-US')} kg
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
                  {formatOfficeTime(ticket.completedAt)}
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
                #{String(ticket.sessionNumber).padStart(5, '0')}
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
                  SESSION:#{ticket.sessionNumber}
                </Text>
                <Text
                  className='font-merchant text-center text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  {formatTicketDate(ticket.completedAt)}
                </Text>
                <Text
                  className='font-merchant text-center text-ink-muted'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  {ticket.routineName.toUpperCase()}
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
                      flex: 1,
                      minWidth: 0,
                      paddingRight: sizes.gap,
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
                      {ticket.exercises.map((exercise, index) => (
                        <Text
                          key={exercise.id}
                          numberOfLines={2}
                          ellipsizeMode='tail'
                          className='font-merchant text-legacy-ticket'
                          style={{
                            fontSize: sizes.content,
                            lineHeight: sizes.content * 1.15,
                            height: sizes.content * 2.3,
                          }}
                        >
                          {index + 1}. {exercise.name.toUpperCase()}
                        </Text>
                      ))}
                    </View>
                  </View>
                  {/* Column 2 */}
                  <View
                    className='items-center'
                    style={{
                      gap: sizes.gap * 3.14,
                      width: '25%',
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
                      {ticket.exercises.map((exercise) => (
                        <Text
                          key={exercise.id}
                          className='font-merchant text-legacy-ticket'
                          style={{
                            fontSize: sizes.content,
                            lineHeight: sizes.content * 1.15,
                            height: sizes.content * 2.3,
                          }}
                        >
                          {exercise.sets.length} x{' '}
                          {exercise.sets.length
                            ? Math.round(
                                exercise.sets.reduce((sum, set) => sum + set.reps, 0) /
                                  exercise.sets.length,
                              )
                            : 0}
                        </Text>
                      ))}
                    </View>
                  </View>
                  {/* Column 3 */}
                  <View
                    className='items-end'
                    style={{
                      gap: sizes.gap * 3.14,
                      width: '23%',
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
                      {ticket.exercises.map((exercise) => (
                        <Text
                          key={exercise.id}
                          className='font-merchant text-legacy-ticket'
                          style={{
                            fontSize: sizes.content,
                            lineHeight: sizes.content * 1.15,
                            height: sizes.content * 2.3,
                          }}
                        >
                          @{' '}
                          {exercise.sets
                            .reduce((maximum, set) => Math.max(maximum, set.weightKg), 0)
                            .toFixed(1)}{' '}
                          kg
                        </Text>
                      ))}
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
                    {ticket.totalSets}
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
                    {ticket.totalReps}
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
                    {formatDuration(ticket.durationSeconds)}
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
                    {formatVolumeChange(ticket.volumeChangePercentage)}
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
                    {Math.round(ticket.volumeKg).toLocaleString('en-US')} kg
                  </Text>
                </View>
              </View>
              {/* Rating */}
              <View className='self-center'>
                <StarRating
                  percentage={ticket.completionPercentage / 100}
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
                  {formatClosedTime(ticket.completedAt)}
                </Text>
                <Text
                  className='font-merchant text-legacy-ticket'
                  style={{
                    fontSize: sizes.content,
                  }}
                >
                  {formatAuthor(ticket.authorName)}
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
                {String(ticket.sessionNumber).padStart(18, '1')}
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
