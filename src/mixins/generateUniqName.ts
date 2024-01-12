import { Status } from '@/types/Status'
import { TodoItem } from '@/types/TodoItem'

/**
 * 設定 New Board 後方數字
 * @public
 */
export const setNewIndex = (targetName: string, arr: Status[] | TodoItem[]) => {
  let newIndex = 1
  // 檢查畫面上是否已有 New Board
  const duplicateBoards = checkDuplicateName(targetName, arr)
  if (duplicateBoards.length) {
    // 數字不連貫時以排在最大數字後方為主，故新數字需取最大數字加一
    const maxIndex = getMaxIndex(duplicateBoards, targetName)
    newIndex = maxIndex + 1
  }
  return newIndex
}
/**
 * 檢查是否有重複名稱
 * @param {string} - 要比對之名稱
 * @public
 */
const checkDuplicateName = (targetName: string, arr: Status[] | TodoItem[]) => {
  const titles = arr.map((item) => item.title)
  return titles.filter((title) => title.includes(targetName))
}
/**
 * 取出所有目標名稱後方數字，找到其中的最大值
 * @param {string[]} - 比對陣列
 * @param {string} - 目標名稱
 * @public
 */
const getMaxIndex = (arr: string[], targetName: string) => {
  const indexArr = arr.map((item) => Number(item.split(targetName)[1]))
  return indexArr.sort((x, y) => y - x)[0]
}
