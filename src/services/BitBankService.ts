import axios from 'axios'
import { BASE_BIT_BANK_API_URL } from '../config'
import { BankUserType, OperationConfig } from '../types'
import { Cache } from './cache'

export interface BankService {
  getCashInConfig(): Promise<OperationConfig>
  getCashOutConfig(userType: BankUserType): Promise<OperationConfig>
}

export class BitBankService implements BankService {
  cache = new Cache()

  async getConfig(path: string) {
    const cachedData = this.cache.getValue(path)

    if (cachedData) {
      return cachedData
    }

    const response = await axios.get(BASE_BIT_BANK_API_URL + path)

    this.cache.setValue(path, response.data)

    return response.data
  }

  async getCashInConfig() {
    try {
      const path = 'cash-in'

      return await this.getConfig(path)
    } catch {
      throw new Error('No cash in config')
    }
  }

  async getCashOutConfig(userType: BankUserType) {
    try {
      const path = `cash-out-${userType}`

      return await this.getConfig(path)
    } catch {
      throw new Error(`No cash out config for ${userType} user`)
    }
  }
}
