/**
 * 以隨機字母加時間戳產生隨機 ID
 * @public
 */

export const generateRandomId = () => {
  const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
  const uniqId = randLetter + Date.now()
  return uniqId
}
