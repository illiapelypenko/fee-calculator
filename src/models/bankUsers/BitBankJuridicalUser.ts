import { BitBankUser } from '../BankUser'
import { Bank, BankUserType, BankUser } from '../../types'

export class BitBankJuridicalUser extends BitBankUser {
  constructor(id: BankUser['id'], bank: Bank) {
    super(id, BankUserType.Juridical, bank)
  }
}
