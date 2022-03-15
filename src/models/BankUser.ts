import {
  Bank,
  BankOperation,
  BankUser,
  Operation,
  OperationConfig,
  OperationConfigWithWeekLimit,
  OperationType,
} from '../types'
import { getPercentageFromAmount, getWeekNumber, getYearNumber, hasWeekLimit, round } from '../utils'

export class BitBankUser implements BankUser {
  id
  type

  operationLimitsByYear: BankUser['operationLimitsByYear'] = {
    [OperationType.CashIn]: {},
    [OperationType.CashOut]: {},
  }

  roundNumber = 2

  bank

  constructor(id: BankUser['id'], type: BankUser['type'], bank: Bank) {
    this.id = id
    this.type = type
    this.bank = bank
  }

  getFeeWithLimits(operation: Operation, config: OperationConfigWithWeekLimit) {
    const limits = this.operationLimitsByYear[operation.type]

    const year = getYearNumber(operation.date)
    const weekNumber = getWeekNumber(operation.date)

    if (!limits[year]) {
      limits[year] = {
        [weekNumber]: 0,
      }
    }

    limits[year][weekNumber] += operation.operation.amount

    if (limits[year][weekNumber] > config.week_limit.amount) {
      if (limits[year][weekNumber] - config.week_limit.amount < operation.operation.amount) {
        return getPercentageFromAmount(limits[year][weekNumber] - config.week_limit.amount, config.percents)
      }
    } else {
      return 0
    }

    return getPercentageFromAmount(operation.operation.amount, config.percents)
  }

  processOperationWithConfig(operation: Operation, config: OperationConfig) {
    let fee = getPercentageFromAmount(operation.operation.amount, config.percents)

    if (hasWeekLimit(config)) {
      fee = this.getFeeWithLimits(operation, config)
    }

    const minFee = config.min?.amount
    const maxFee = config.max?.amount

    if (minFee && fee < minFee) {
      fee = minFee
    }

    if (maxFee && fee > maxFee) {
      fee = maxFee
    }

    return round(fee, this.roundNumber)
  }

  async cashIn(operation: BankOperation) {
    const config = await this.bank.service.getCashInConfig()

    return this.processOperationWithConfig(operation, config)
  }

  async cashOut(operation: BankOperation) {
    const config = await this.bank.service.getCashOutConfig(this.type)

    return this.processOperationWithConfig(operation, config)
  }
}
