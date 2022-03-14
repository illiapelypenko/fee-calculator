import { formatMoneyToString, getPercentageFromAmount, round } from '../money'

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
