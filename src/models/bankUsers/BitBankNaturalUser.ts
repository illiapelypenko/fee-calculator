import { BitBankUser } from '../BankUser'
import { Bank, BankUserType, BankUser } from '../../types'

export class BitBankNaturalUser extends BitBankUser {
  constructor(id: BankUser['id'], bank: Bank) {
    super(id, BankUserType.Natural, bank)
  }
}
