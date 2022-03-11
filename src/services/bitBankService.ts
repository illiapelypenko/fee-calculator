import axios from 'axios'
import { BASE_BIT_BANK_API_URL } from '../config'
import { OperationConfig, BankUserType } from '../types'

export interface BankService {
  getCashInConfig(): Promise<OperationConfig>
  getCashOutConfig(userType: BankUserType): Promise<OperationConfig>
}

export const bitBankAPI = axios.create({
  baseURL: BASE_BIT_BANK_API_URL,
})

const cache: Record<string, OperationConfig> = {}

const getCashInConfig: BankService['getCashInConfig'] = async () => {
  try {
    const path = 'cash-in'

    if (cache[path]) {
      return cache[path]
    }

    const response = await bitBankAPI.get(path)

    cache[path] = response.data

    return response.data
  } catch {
    throw new Error('Error: no cashin config')
  }
}

const getCashOutConfig: BankService['getCashOutConfig'] = async userType => {
  try {
    const path = `cash-out-${userType}`

    if (cache[path]) {
      return cache[path]
    }

    const response = await bitBankAPI.get(path)

    cache[path] = response.data

    return response.data
  } catch {
    throw new Error('Error: no cashout config')
  }
}

export const bitBankService: BankService = { getCashInConfig, getCashOutConfig }
