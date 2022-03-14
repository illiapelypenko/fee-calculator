import { BASE_BIT_BANK_API_URL } from '../src/config'

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

const axios = {
  get: jest.fn(url => {
    const path = url.split(`${BASE_BIT_BANK_API_URL}`)[1] as keyof typeof configs

    const data = configs[path]

    return Promise.resolve({ data })
  }),
  create: () => axios,
}

export default axios
