import { Cache } from '../Cache'

describe('Cache', () => {
  let cache: Cache

  beforeEach(() => {
    cache = new Cache()
  })

  describe('getValue', () => {
    test('get non-existent value', () => {
      const nonExistentValue = cache.getValue('non-existent')

      expect(nonExistentValue).toBe(undefined)
    })
  })

  describe('setValue / getValue', () => {
    test('set and get value', () => {
      cache.setValue('value', 10)

      const value = cache.getValue('value')

      expect(value).toBe(10)
    })
  })
})
