import fs from 'fs'
import { Bank, BankOperation, BankUser, BankUserType, OperationType, RawOperation } from '../types'
import { BitBankService } from '../services'
import { BankService } from '../services/bitBankService'
import { BitBankUser } from './BankUser'

export class BitBank implements Bank {
  cleanOperations: Array<BankOperation> = []
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

  loadOperationsFromFile(filePath: string) {
    const file = fs.readFileSync(filePath, 'utf8')

    const rawOperations: Array<RawOperation> = JSON.parse(file)

    const cleanOperations = rawOperations.map(operation => this.parseRawOperation(operation))

    this.cleanOperations.push(...cleanOperations)
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
      [OperationType.CashIn]: async () => await operation.user.cashIn(operation),
      [OperationType.CashOut]: async () => await operation.user.cashOut(operation),
    }

    const userOperation = await operations[operation.type]

    if (userOperation) {
      return await userOperation()
    } else {
      throw new Error('Unknown operation type')
    }
  }

  async processOperations() {
    const fees = []

    for (const cleanOperation of this.cleanOperations) {
      const fee = await this.performOperation(cleanOperation)

      fees.push(fee)
    }

    this.cleanOperations = []

    return fees
  }
}
