import { Status } from '@/types/Status'

/**
 * 以 statusId 找到對應 status
 * @param {string} - 以此 id 搜尋
 * @public
 */

export const findTargetStatus = (list: Status[], targetId: string) => {
  return list.filter((status) => status.id === targetId)[0]
}
