import { BankOperation, OperationConfig, Operation, OperationType, Bank, BankUser } from '../types'
import { getPercentageFromAmount, getWeekNumber, getYear, round } from '../utils'

export abstract class BitBankUser implements BankUser {
  id
  type

  cashInAmountByYear: BankUser['cashInAmountByYear'] = {}
  cashOutAmountByYear: BankUser['cashOutAmountByYear'] = {}

  roundNumber = 2

  bank

  protected constructor(id: BankUser['id'], type: BankUser['type'], bank: Bank) {
    this.id = id
    this.type = type
    this.bank = bank
  }

  processOperationWithConfig(operation: Operation, config: OperationConfig) {
    const percentageFee = getPercentageFromAmount(operation.operation.amount, config.percents)

    let fee = percentageFee

    let limits

    const year = getYear(operation.date)
    const weekNumber = getWeekNumber(operation.date)

    switch (operation.type) {
      case OperationType.CashIn:
        limits = this.cashInAmountByYear
        break
      case OperationType.CashOut:
        limits = this.cashOutAmountByYear
        break
    }

    if (config.week_limit && limits) {
      if (!limits[year]) {
        limits[year] = {
          [weekNumber]: 0,
        }
      }

      limits[year][weekNumber] += operation.operation.amount

      if (limits[year][weekNumber] > config.week_limit.amount) {
        if (limits[year][weekNumber] - config.week_limit.amount < operation.operation.amount) {
          fee = getPercentageFromAmount(limits[year][weekNumber] - config.week_limit.amount, config.percents)
        }
      } else {
        fee = 0
      }
    }

    const minFee = config.min?.amount
    const maxFee = config.max?.amount

    if (minFee) {
      fee = percentageFee < minFee ? minFee : percentageFee
    }

    if (maxFee) {
      fee = percentageFee > maxFee ? maxFee : percentageFee
    }

    return round(fee, this.roundNumber)
  }

  async cashIn(operation: BankOperation) {
    const config = await this.bank.service.getCashInConfig()

    const fee = this.processOperationWithConfig(operation, config)

    return fee
  }

  async cashOut(operation: BankOperation) {
    const config = await this.bank.service.getCashOutConfig(this.type)

    const fee = this.processOperationWithConfig(operation, config)

    return fee
  }
}
