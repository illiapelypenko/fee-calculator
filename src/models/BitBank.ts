import fs from 'fs'
import { BankOperation, OperationType, RawOperation } from '../types'
import { BitBankJuridicalUser, BitBankNaturalUser } from './bankUsers'
import { bitBankService } from '../services'
import { BankService } from '../services/bitBankService'
import { Bank, BankUserType, BankUser } from '../types'

export class BitBank implements Bank {
  operations: Array<BankOperation> = []
  users: Array<BankUser> = []
  service: BankService = bitBankService

  createBankUser(id: BankUser['id'], type: BankUserType): BankUser {
    let user = this.users.find(u => u.id === id)

    if (user) {
      return user
    }

    switch (type) {
      case BankUserType.Juridical:
        user = new BitBankJuridicalUser(id, this)
        break
      case BankUserType.Natural:
        user = new BitBankNaturalUser(id, this)
        break
    }

    this.users.push(user)

    return user
  }

  loadOperationsFromFile(filePath: string) {
    const file = fs.readFileSync(filePath, 'utf8')

    const rawOperations: Array<RawOperation> = JSON.parse(file)

    const operations = rawOperations.map(o => this.parseRawOperation(o))

    this.operations.push(...operations)
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
    switch (operation.type) {
      case OperationType.CashIn:
        return await operation.user.cashIn(operation)
      case OperationType.CashOut:
        return await operation.user.cashOut(operation)
    }
  }

  async processOperations() {
    const fees = await this.operations.reduce(async (acc: Promise<Array<number>>, curr) => {
      await acc

      const fee: number = await this.performOperation(curr)

      return (await acc).concat([fee])
    }, Promise.resolve([]))

    this.operations = []

    return fees
  }
}
