import fs from 'fs'
import { Bank, BankOperation, BankUser, BankUserType, OperationType, RawOperation } from '../types'
import { BankService, BitBankService } from '../services'
import { BitBankUser } from './BankUser'

export class BitBank implements Bank {
  operationsToProcess: Array<BankOperation> = []
  users: Array<BankUser> = []
  service: BankService = new BitBankService()

  createBankUser(id: BankUser['id'], type: BankUserType): BankUser {
    const existedUser = this.users.find(user => user.id === id)

    if (existedUser) {
      return existedUser
    }

    const newUser = new BitBankUser(id, type, this)

    this.users.push(newUser)

    return newUser
  }

  cleanOperationsToProcess() {
    this.operationsToProcess = []
  }

  loadOperationsFromFile(filePath: string) {
    const file = fs.readFileSync(filePath, 'utf8')

    const rawOperations: Array<RawOperation> = JSON.parse(file)

    const operationsToProcess = rawOperations.map(operation => this.parseRawOperation(operation))

    this.operationsToProcess.push(...operationsToProcess)
  }

  parseRawOperation(rawOperation: RawOperation) {
    return {
      date: rawOperation.date,
      type: rawOperation.type,
      operation: {
        ...rawOperation.operation,
      },
      user: this.createBankUser(rawOperation.user_id, rawOperation.user_type),
    }
  }

  async performOperation(operation: BankOperation) {
    const operations = {
      [OperationType.CashIn]: () => operation.user.cashIn(operation),
      [OperationType.CashOut]: () => operation.user.cashOut(operation),
    }

    const userOperation = await operations[operation.type]

    if (userOperation) {
      return userOperation()
    } else {
      throw new Error('Unknown operation type')
    }
  }

  async processOperations() {
    const fees = []

    for (const operation of this.operationsToProcess) {
      const fee = await this.performOperation(operation)

      fees.push(fee)
    }

    this.cleanOperationsToProcess()

    return fees
  }
}
