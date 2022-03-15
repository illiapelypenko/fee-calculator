import { BankOperation, RawOperation } from './operation'
import { BankService } from '../services'
import { BankUser, BankUserType } from './bankUser'

export interface Bank {
  operationsToProcess: Array<BankOperation>
  users: Array<BankUser>
  service: BankService
  loadOperationsFromFile(filePath: string): void
  parseRawOperation(rawOperation: RawOperation): BankOperation
  performOperation(operation: BankOperation): void
  createBankUser(id: BankUser['id'], type: BankUserType): BankUser
}
