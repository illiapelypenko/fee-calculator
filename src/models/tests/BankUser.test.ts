import { BitBank, BitBankUser } from '../index'
import { BankUserType, Currency, OperationType } from '../../types'

describe('BitBankUser', () => {
  let bitBank: BitBank
  let juridicalUser: BitBankUser
  let naturalUser: BitBankUser

  beforeEach(() => {
    bitBank = new BitBank()
    juridicalUser = new BitBankUser(1, BankUserType.Juridical, bitBank)
    naturalUser = new BitBankUser(1, BankUserType.Natural, bitBank)
  })

  describe('BitBankJuridicalUser', () => {
    describe('cash in', () => {
      test('small cash in', async () => {
        const fee = await juridicalUser.cashIn({
          date: '2016-01-05',
          user: juridicalUser,
          type: OperationType.CashIn,
          operation: { amount: 200.0, currency: Currency.EUR },
        })

        expect(fee).toBe(0.06)
      })

      test('small cash in with rounding', async () => {
        const fee = await juridicalUser.cashIn({
          date: '2016-01-05',
          user: juridicalUser,
          type: OperationType.CashIn,
          operation: { amount: 250.0, currency: Currency.EUR },
        })

        expect(fee).toBe(0.08)
      })

      test('big cash in', async () => {
        const fee = await juridicalUser.cashIn({
          date: '2016-01-05',
          user: juridicalUser,
          type: OperationType.CashIn,
          operation: { amount: 2500000000.0, currency: Currency.EUR },
        })

        expect(fee).toBe(5)
      })
    })

    describe('cash out', () => {
      test('small cash out', async () => {
        const fee = await juridicalUser.cashOut({
          date: '2016-01-05',
          user: juridicalUser,
          type: OperationType.CashOut,
          operation: { amount: 10.0, currency: Currency.EUR },
        })

        expect(fee).toBe(0.5)
      })

      test('big cash out with rounding', async () => {
        const fee = await juridicalUser.cashOut({
          date: '2016-01-05',
          user: juridicalUser,
          type: OperationType.CashOut,
          operation: { amount: 5555.0, currency: Currency.EUR },
        })

        expect(fee).toBe(16.67)
      })
    })
  })

  describe('BitBankNaturalUser', () => {
    describe('cash in', () => {
      test('small cash in', async () => {
        const fee = await naturalUser.cashIn({
          date: '2016-01-05',
          user: naturalUser,
          type: OperationType.CashIn,
          operation: { amount: 200.0, currency: Currency.EUR },
        })

        expect(fee).toBe(0.06)
      })

      test('small cash in with rounding', async () => {
        const fee = await naturalUser.cashIn({
          date: '2016-01-05',
          user: naturalUser,
          type: OperationType.CashIn,
          operation: { amount: 250.0, currency: Currency.EUR },
        })

        expect(fee).toBe(0.08)
      })

      test('big cash in', async () => {
        const fee = await naturalUser.cashIn({
          date: '2016-01-05',
          user: naturalUser,
          type: OperationType.CashIn,
          operation: { amount: 99999999999.0, currency: Currency.EUR },
        })

        expect(fee).toBe(5)
      })
    })

    describe('cash out', () => {
      test('small cash out', async () => {
        const fee = await naturalUser.cashOut({
          date: '2016-01-05',
          user: naturalUser,
          type: OperationType.CashOut,
          operation: { amount: 100.0, currency: Currency.EUR },
        })

        expect(fee).toBe(0)
      })

      test('big cash', async () => {
        const fee = await naturalUser.cashOut({
          date: '2016-01-05',
          user: naturalUser,
          type: OperationType.CashOut,
          operation: { amount: 1100, currency: Currency.EUR },
        })

        expect(fee).toBe(0.3)
      })
    })
  })

  describe('getFeeWithLimits', () => {
    const config = {
      percents: 0.3,
      week_limit: {
        amount: 1000,
        currency: Currency.EUR,
      },
    }

    test('returns correct fee, one operation, amount is below limits', () => {
      const operation = {
        date: '2016-01-05',
        user: naturalUser,
        type: OperationType.CashOut,
        operation: { amount: 600, currency: Currency.EUR },
      }

      const actualResult = naturalUser.getFeeWithLimits(operation, config)

      const expectedResult = 0

      expect(actualResult).toBe(expectedResult)
    })

    test('returns correct fee, one operation, amount is above limits', () => {
      const operation = {
        date: '2016-01-05',
        user: naturalUser,
        type: OperationType.CashOut,
        operation: { amount: 1600, currency: Currency.EUR },
      }

      const actualResult = naturalUser.getFeeWithLimits(operation, config)

      const expectedResult = 1.8

      expect(actualResult).toBe(expectedResult)
    })

    test('returns correct fee, two operations, amount is above limits', () => {
      const operation = {
        date: '2016-01-05',
        user: naturalUser,
        type: OperationType.CashOut,
        operation: { amount: 800, currency: Currency.EUR },
      }

      naturalUser.getFeeWithLimits(operation, config)
      const actualResult = naturalUser.getFeeWithLimits(operation, config)

      const expectedResult = 1.8

      expect(actualResult).toBe(expectedResult)
    })
  })

  describe('processOperationWithConfig', () => {
    test('returns correct fee when config has max field', () => {
      const config = {
        percents: 1,
        max: {
          amount: 10,
          currency: Currency.EUR,
        },
      }

      const operation = {
        date: '2016-01-05',
        user: naturalUser,
        type: OperationType.CashOut,
        operation: { amount: 2000, currency: Currency.EUR },
      }

      const actualResult = naturalUser.processOperationWithConfig(operation, config)

      const expectedResult = 10

      expect(actualResult).toBe(expectedResult)
    })

    test('returns correct fee when config has min field', () => {
      const config = {
        percents: 0.01,
        min: {
          amount: 1,
          currency: Currency.EUR,
        },
      }

      const operation = {
        date: '2016-01-05',
        user: naturalUser,
        type: OperationType.CashOut,
        operation: { amount: 10, currency: Currency.EUR },
      }

      const actualResult = naturalUser.processOperationWithConfig(operation, config)

      const expectedResult = 1

      expect(actualResult).toBe(expectedResult)
    })
  })
})
