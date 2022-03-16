import { getWeekNumber, getYearNumber } from '../date'

describe('date', () => {
  describe('getYearNumber', () => {
    test('year of date 2016-02-02 is 2016', () => {
      expect(getYearNumber('2016-02-02')).toBe(2016)
    })

    test('year of date 1999-08-09 is 1999', () => {
      expect(getYearNumber('1999-08-09')).toBe(1999)
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
