import { Currency } from './currency'

export interface Money {
  amount: number
  currency: Currency
}

export interface OperationConfig {
  percents: number
  min?: Money
  max?: Money
  week_limit?: Money
}

export interface OperationConfigWithWeekLimit extends OperationConfig {
  week_limit: Money
}
