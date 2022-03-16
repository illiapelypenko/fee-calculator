export class Cache {
  private readonly data: {
    [key: string]: unknown
  } = {}

  getValue(key: string) {
    return this.data[key]
  }

  setValue(key: string, value: unknown) {
    this.data[key] = value
  }
}
