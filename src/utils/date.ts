import moment from 'moment'

moment.updateLocale('en', {
  week: {
    dow: 1, // set first day of the week to Monday
  },
})

export const getYear = (date: string) => moment(date).year()
export const getWeekNumber = (date: string) => moment(date).week()
