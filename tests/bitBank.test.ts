import path from 'path'
import { BitBank, BitBankJuridicalUser, BitBankNaturalUser } from '../src/models'
import { Currency, OperationType, BankUserType } from '../src/types'
import { formatMoneyToString } from '../src/utils'

let bitBank: BitBank

beforeEach(() => {
  bitBank = new BitBank()
})

describe('BitBank', () => {
  describe('BitBank.parseRawOperation', () => {
    test('right operation parsing', () => {
      const operation = bitBank.parseRawOperation({
        date: '2016-01-05',
        user_id: 1,
        user_type: 'natural' as BankUserType.Natural,
        type: 'cash_in' as OperationType.CashIn,
        operation: { amount: 200.0, currency: 'EUR' as Currency.EUR },
      })

      expect(operation).toEqual({
        date: '2016-01-05',
        user: new BitBankNaturalUser(1, bitBank),
        type: OperationType.CashIn,
        operation: { amount: 200.0, currency: Currency.EUR },
      })
    })
  })

  describe('BitBank.createBankUser', () => {
    test('create natural user', () => {
      const naturalUser = bitBank.createBankUser(1, BankUserType.Natural)

      expect(naturalUser instanceof BitBankNaturalUser).toBe(true)
    })

    test('create juridical user', () => {
      const juridicalUser = bitBank.createBankUser(2, BankUserType.Juridical)

      expect(juridicalUser instanceof BitBankJuridicalUser).toBe(true)
    })

    test('do not create user with the same id', () => {
      const juridicalUser1 = bitBank.createBankUser(2, BankUserType.Juridical)
      const juridicalUser2 = bitBank.createBankUser(2, BankUserType.Juridical)

      expect(juridicalUser1).toBe(juridicalUser2)
    })
  })

  describe('BitBank.loadOperationsFromFile', () => {
    test('bank loads and parses operations correctly', () => {
      bitBank.loadOperationsFromFile(path.join(__dirname, 'testData.json'))

      expect(bitBank.operations.length > 0).toBe(true)
    })
  })

  describe('BitBank.performOperation', () => {
    test('bank performs operation correctly', async () => {
      const operation = {
        date: '2022-01-01',
        type: OperationType.CashIn,
        operation: {
          amount: 10000,
          currency: Currency.EUR,
        },
        user: new BitBankNaturalUser(10, bitBank),
      }

      const fee = await bitBank.performOperation(operation)

      expect(fee).toBe(3)
    })
  })

  describe('Bitbank fulltest', () => {
    test('test all system', async () => {
      bitBank.loadOperationsFromFile(path.join(__dirname, 'testData.json'))

      const fees = await bitBank.processOperations().then(fees => fees.map(fee => formatMoneyToString(fee)))

      expect(fees).toEqual(['0.06', '0.90', '87.00', '3.00', '0.30', '0.30', '5.00', '0.00', '0.00'])
    })
  })
})
