import { addDays, format, startOfDay, startOfWeek } from 'date-fns'

type DatedTicket = {
  completedAt: string
}

function toLocalDay(date: Date) {
  return startOfDay(date)
}

export function dayKey(date: Date) {
  return format(toLocalDay(date), 'yyyy-MM-dd')
}

export function completedDayKeys(tickets: DatedTicket[]) {
  return new Set(
    tickets.flatMap((ticket) => {
      const date = new Date(ticket.completedAt)
      return Number.isNaN(date.getTime())
        ? []
        : [
            dayKey(date),
          ]
    }),
  )
}

export function currentWeekDays(now = new Date()) {
  const start = startOfWeek(toLocalDay(now), {
    weekStartsOn: 1,
  })
  return Array.from(
    {
      length: 7,
    },
    (_, index) => addDays(start, index),
  )
}
