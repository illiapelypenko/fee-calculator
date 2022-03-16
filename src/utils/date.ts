import getWeek from 'date-fns/getWeek'
import getYear from 'date-fns/getYear'

export const getYearNumber = (date: string) => getYear(new Date(date))

export const getWeekNumber = (date: string) =>
  getWeek(new Date(date), {
    weekStartsOn: 1,
  })
