import { round, getPercentageFromAmount, getYear, getWeekNumber, formatMoneyToString } from '../src/utils'

describe('utils', () => {
  describe('money', () => {
    describe('getPercentageFromAmount', () => {
      test('5% from 100 is equal 5', () => {
        expect(getPercentageFromAmount(100, 5)).toBe(5)
      })

      test('0.3% from 200 is equal 0.3', () => {
        expect(getPercentageFromAmount(200, 0.3)).toBe(0.6)
      })
    })

    describe('round', () => {
      test('round 0.023 toFixed 2 is equal 0.03', () => {
        expect(round(0.023, 2)).toBe(0.03)
      })

      test('round 0.0345 toFixed 3 is equal 0.035', () => {
        expect(round(0.0345, 3)).toBe(0.035)
      })
    })

    describe('formatMoneyToString', () => {
      test('format 0.3 EUR to 0.30 cents', () => {
        expect(formatMoneyToString(0.3)).toBe('0.30')
      })
    })
  })

  describe('date', () => {
    describe('getYear', () => {
      test('year of date 2016-02-02 is 2016', () => {
        expect(getYear('2016-02-02')).toBe(2016)
      })

      test('year of date 1999-08-09 is 1999', () => {
        expect(getYear('1999-08-09')).toBe(1999)
      })
    })

    describe('getWeekNumber', () => {
      test('week number of date 2016-01-01 is 1', () => {
        expect(getWeekNumber('2016-01-01')).toBe(1)
      })

      test('week number of date 2016-01-03 is 1', () => {
        expect(getWeekNumber('2016-01-03')).toBe(1)
      })

      test('week number of date 2016-01-04 is 2', () => {
        expect(getWeekNumber('2016-01-04')).toBe(2)
      })

      test('week number of date 2016-01-01 is 1', () => {
        expect(getWeekNumber('2016-01-09')).toBe(2)
      })

      test('week number of date 2016-02-15 is 8', () => {
        expect(getWeekNumber('2016-02-15')).toBe(8)
      })
    })
  })
})
