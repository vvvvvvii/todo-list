import axios from 'axios'
import { Status } from '@/types/Status'

axios.defaults.baseURL = 'http://localhost:3000'

const api = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  /**
   * 取得狀態列表
   * @param {string} - api 網址
   */
  getStatus: (url: string) => {
    return axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.error('cannot get API', err))
  },
  /**
   * 取得指定狀態
   * @param {string} - api 網址
   * @param {string} - 指定狀態之 id
   */
  getStatusItem: (url: string, id: string) => {
    return axios
      .get(`${url}/${id}`)
      .then((res) => res.data)
      .catch((err) => console.error('cannot get API', err))
  },
  /**
   * 新增狀態
   * @param {string} - api 網址
   * @param {Status} - 新增狀態內容
   */
  postStatus: (url: string, params: Status) => {
    return axios
      .post(url, params)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.error('cannot post API', err))
  },
  /**
   * 更改狀態
   * @param {string} - api 網址
   * @param {Status} - 更新狀態內容
   */
  putStatus: (url: string, params: Status) => {
    return axios
      .put(`${url}/${params.id}`, params)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.error('cannot update API', err))
  },
  /**
   * 刪除狀態
   * @param {string} - api 網址
   * @param {Status} - 刪除狀態 id
   */
  deleteStatus: (url: string, id: string) => {
    return axios
      .delete(`${url}/${id}`)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.error('cannot delete API', err))
  },
  /**
   * 取得 tag 列表
   * @param {string} - api 網址
   */
  getTags: (url: string) => {
    return axios
      .get(url)
      .then((res) => {
        console.log(res.data)
        return res.data
      })
      .catch((err) => console.error('cannot get API', err))
  }
}

export default api
