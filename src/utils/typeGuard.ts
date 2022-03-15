import { OperationConfig, OperationConfigWithWeekLimit } from '../types'

export const hasWeekLimit = (operation: OperationConfig): operation is OperationConfigWithWeekLimit => {
  return 'week_limit' in operation
}
