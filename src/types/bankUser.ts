import { Bank } from './bank'
import { BankOperation, Operation } from './operation'
import { OperationConfig } from './operationConfig'

export enum BankUserType {
  Natural = 'natural',
  Juridical = 'juridical',
}

export interface BankUser {
  id: number
  type: BankUserType
  bank: Bank
  roundNumber: number
  cashIn(operation: BankOperation): Promise<number>
  cashOut(operation: BankOperation): Promise<number>
  processOperationWithConfig(operation: Operation, config: OperationConfig): number
  cashInAmountByYear: {
    [year: string]: {
      [weekNumber: string]: number
    }
  }
  cashOutAmountByYear: {
    [year: string]: {
      [weekNumber: string]: number
    }
  }
}
