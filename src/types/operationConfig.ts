import { Currency } from './currency'

interface Money {
  amount: number
  currency: Currency
}

export interface OperationConfig {
  percents: number
  min?: Money
  max?: Money
  week_limit?: Money
}
