export const getPercentageFromAmount = (amount: number, percentage: number) => amount * percentage * 0.01

export const round = (amount: number, toFixed: number) => {
  const k = Math.pow(10, toFixed)
  return Math.ceil(amount * k) / k
}

export const formatMoneyToString = (money: number) => money.toFixed(2)
