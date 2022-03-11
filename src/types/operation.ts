import { Currency } from './currency'
import { BankUser, BankUserType } from './bankUser'

export enum OperationType {
  CashIn = 'cash_in',
  CashOut = 'cash_out',
}

export interface Operation {
  date: string
  type: OperationType
  operation: {
    amount: number
    currency: Currency
  }
}

export interface BankOperation extends Operation {
  user: BankUser
}

export interface RawOperation extends Operation {
  user_id: BankUser['id']
  user_type: BankUserType
}
