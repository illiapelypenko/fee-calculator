import { BitBank, BitBankUser } from '../index'
import { BankUser, BankUserType, Currency, OperationType } from '../../types'

describe('BitBankUser', () => {
  let bitBank: BitBank
  let juridicalUser: BankUser
  let naturalUser: BankUser

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
})
