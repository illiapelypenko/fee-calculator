import path from 'path'
import { BitBank, BitBankUser } from '../index'
import { BankUserType, Currency, OperationType } from '../../types'
import { formatMoneyToString } from '../../utils'

jest.mock('fs')

describe('BitBank', () => {
  let bitBank: BitBank

  beforeEach(() => {
    bitBank = new BitBank()
  })

  describe('BitBank.parseRawOperation', () => {
    test('right operation parsing', () => {
      const operation = bitBank.parseRawOperation({
        date: '2016-01-05',
        user_id: 1,
        user_type: BankUserType.Natural,
        type: OperationType.CashIn,
        operation: { amount: 200.0, currency: Currency.EUR },
      })

      expect(operation).toEqual({
        date: '2016-01-05',
        user: new BitBankUser(1, BankUserType.Natural, bitBank),
        type: OperationType.CashIn,
        operation: { amount: 200.0, currency: Currency.EUR },
      })
    })
  })

  describe('BitBank.createBankUser', () => {
    test('create natural user', () => {
      const naturalUser = bitBank.createBankUser(1, BankUserType.Natural)

      expect(naturalUser.type).toBe(BankUserType.Natural)
    })

    test('create juridical user', () => {
      const juridicalUser = bitBank.createBankUser(2, BankUserType.Juridical)

      expect(juridicalUser.type).toBe(BankUserType.Juridical)
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

      expect(bitBank.operationsToProcess.length > 0).toBe(true)
    })
  })

  describe('BitBank.cleanOperationsToProcess', () => {
    test('bank clears operations correctly', () => {
      bitBank.operationsToProcess = [
        {
          date: '2016-01-05',
          user: new BitBankUser(1, BankUserType.Natural, bitBank),
          type: OperationType.CashIn,
          operation: { amount: 200.0, currency: Currency.EUR },
        },
      ]

      bitBank.cleanOperationsToProcess()

      expect(bitBank.operationsToProcess.length).toBe(0)
    })
  })

  describe('BitBank.performOperation', () => {
    test('bank performs cash in operation correctly', async () => {
      const operation = {
        date: '2022-01-01',
        type: OperationType.CashIn,
        operation: {
          amount: 10000,
          currency: Currency.EUR,
        },
        user: new BitBankUser(10, BankUserType.Natural, bitBank),
      }

      const fee = await bitBank.performOperation(operation)

      expect(fee).toBe(3)
    })

    test('bank performs cash out operation correctly', async () => {
      const operation = {
        date: '2022-01-01',
        type: OperationType.CashOut,
        operation: {
          amount: 300,
          currency: Currency.EUR,
        },
        user: new BitBankUser(10, BankUserType.Juridical, bitBank),
      }

      const fee = await bitBank.performOperation(operation)

      expect(fee).toBe(0.9)
    })

    test('fails on unknown operation type', async () => {
      const operation = {
        date: '2022-01-01',
        type: 'cancel' as OperationType,
        operation: {
          amount: 10000,
          currency: Currency.EUR,
        },
        user: new BitBankUser(10, BankUserType.Natural, bitBank),
      }

      await expect(bitBank.performOperation(operation)).rejects.toEqual(new Error('Unknown operation type'))
    })
  })

  describe('Bitbank.processOperations', () => {
    test('process operations correctly', async () => {
      bitBank.operationsToProcess = [
        {
          date: '2022-01-01',
          type: OperationType.CashIn,
          operation: {
            amount: 10000,
            currency: Currency.EUR,
          },
          user: new BitBankUser(10, BankUserType.Natural, bitBank),
        },
        {
          date: '2022-01-01',
          type: OperationType.CashOut,
          operation: {
            amount: 300,
            currency: Currency.EUR,
          },
          user: new BitBankUser(10, BankUserType.Juridical, bitBank),
        },
      ]

      const fees = await bitBank.processOperations()

      expect(bitBank.operationsToProcess.length).toBe(0)
      expect(fees).toEqual([3, 0.9])
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
