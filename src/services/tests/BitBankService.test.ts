import axios from 'axios'
import { BASE_BIT_BANK_API_URL } from '../../config'
import { BitBankService } from '../BitBankService'
import { BankUserType } from '../../types'

const configs = {
  'cash-in': {
    percents: 0.03,
    max: {
      amount: 5,
      currency: 'EUR',
    },
  },
  'cash-out-natural': {
    percents: 0.3,
    week_limit: {
      amount: 1000,
      currency: 'EUR',
    },
  },
  'cash-out-juridical': {
    percents: 0.3,
    min: {
      amount: 0.5,
      currency: 'EUR',
    },
  },
}

describe('BitBankService', () => {
  describe('axios', () => {
    test('cash-in', async () => {
      const { data } = await axios.get(BASE_BIT_BANK_API_URL + 'cash-in')

      expect(data).toEqual(configs['cash-in'])
    })

    test('cash-out-natural', async () => {
      const { data } = await axios.get(BASE_BIT_BANK_API_URL + 'cash-out-natural')

      expect(data).toEqual(configs['cash-out-natural'])
    })

    test('cash-out-juridical', async () => {
      const { data } = await axios.get(BASE_BIT_BANK_API_URL + 'cash-out-juridical')

      expect(data).toEqual(configs['cash-out-juridical'])
    })
  })

  describe('single requests', () => {
    let bitBankService: BitBankService

    beforeEach(() => {
      bitBankService = new BitBankService()
    })

    test('getCashInConfig', async () => {
      const config = await bitBankService.getCashInConfig()

      expect(config).toEqual(configs['cash-in'])
    })

    test('getCashOutConfig', async () => {
      const config = await bitBankService.getCashOutConfig(BankUserType.Natural)

      expect(config).toEqual(configs['cash-out-natural'])
    })

    test('getCashOutConfig', async () => {
      const config = await bitBankService.getCashOutConfig(BankUserType.Juridical)

      expect(config).toEqual(configs['cash-out-juridical'])
    })
  })
})
