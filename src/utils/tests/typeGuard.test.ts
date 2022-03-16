import { hasWeekLimit } from '../typeGuard'
import { Currency } from '../../types'

describe('typeGuard', () => {
  describe('hasWeekLimit', () => {
    test('call hasWeekLimit with config that has week_limit property', () => {
      const config = {
        percents: 0.3,
        week_limit: {
          amount: 1000,
          currency: Currency.EUR,
        },
      }

      expect(hasWeekLimit(config)).toBe(true)
    })

    test('call hasWeekLimit with config that does not have week_limit property', () => {
      const config = {
        percents: 0.3,
        min: {
          amount: 0.5,
          currency: Currency.EUR,
        },
      }

      expect(hasWeekLimit(config)).toBe(false)
    })
  })
})
