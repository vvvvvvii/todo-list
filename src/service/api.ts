import axios from 'axios'
import { Status } from '@/types/Status'
import { TodoItem } from '@/types/TodoItem'

axios.defaults.baseURL = 'http://localhost:3000'

const api = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  getStatus: (url: string) => {
    return axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.error('cannot get API', err))
  },
  postStatus: (url: string, params: Status) => {
    return axios
      .post(url, params)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.error('cannot post API', err))
  },
  putStatus: (url: string, params: Status) => {
    return axios
      .put(`${url}/${params.id}`, params)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.error('cannot update API', err))
  },
  deleteStatus: (url: string, id: string) => {
    return axios
      .delete(`${url}/${id}`)
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => console.error('cannot delete API', err))
  }
}

export default api
