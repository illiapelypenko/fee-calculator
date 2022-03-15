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
  let bitBankService: BitBankService

  beforeEach(() => {
    bitBankService = new BitBankService()
  })

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

  describe('getCashInConfig', () => {
    test('getCashInConfig returns correct config', async () => {
      const config = await bitBankService.getCashInConfig()

      expect(config).toEqual(configs['cash-in'])
    })

    test('getCashInConfig throws error', async () => {
      jest.spyOn(bitBankService, 'getConfig').mockImplementationOnce(() => Promise.reject())

      await expect(bitBankService.getCashInConfig()).rejects.toEqual(new Error('No cash in config'))
    })
  })

  describe('getCashOutConfig', () => {
    test('getCashOutConfig for natural user returns correct config', async () => {
      const config = await bitBankService.getCashOutConfig(BankUserType.Natural)

      expect(config).toEqual(configs['cash-out-natural'])
    })

    test('getCashOutConfig for natural user throws error', async () => {
      jest.spyOn(bitBankService, 'getConfig').mockImplementationOnce(() => Promise.reject())

      await expect(bitBankService.getCashOutConfig(BankUserType.Natural)).rejects.toEqual(
        new Error('No cash out config for natural user'),
      )
    })

    test('getCashOutConfig for juridical returns correct config', async () => {
      const config = await bitBankService.getCashOutConfig(BankUserType.Juridical)

      expect(config).toEqual(configs['cash-out-juridical'])
    })

    test('getCashOutConfig for juridical user throws error', async () => {
      jest.spyOn(bitBankService, 'getConfig').mockImplementationOnce(() => Promise.reject())

      await expect(bitBankService.getCashOutConfig(BankUserType.Juridical)).rejects.toEqual(
        new Error('No cash out config for juridical user'),
      )
    })
  })

  describe('getConfig', () => {
    test('getConfig returns correct config from cache', async () => {
      const firstConfig = await bitBankService.getConfig('cash-out-juridical')
      const secondConfig = await bitBankService.getConfig('cash-out-juridical')

      expect(axios.get).toHaveBeenCalledTimes(1)

      expect(firstConfig).toEqual(secondConfig)
    })

    test('getConfig returns correct config', async () => {
      const config = await bitBankService.getConfig('cash-out-juridical')

      expect(axios.get).toHaveBeenCalledTimes(1)

      expect(config).toEqual(configs['cash-out-juridical'])
    })
  })
})
