import Vue from 'vue'
import Vuex from 'vuex'
import { Status } from '../types/Status'
import api from '../service/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    todayTimestamp: 0,
    statusList: [] as Status[],
    filterStatusList: [] as Status[]
  },
  actions: {
    // 非同步
    getTodayTimestamp({ commit }) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const timestamp = today.getTime()
      commit('setTodayTimestamp', timestamp)
    },
    setIsOvertime({ commit }, statusList) {
      const updatedList = statusList.map((status: Status) => {
        return {
          ...status,
          todoList: status.todoList.map((todo) => {
            return {
              ...todo,
              isOvertime: this.state.todayTimestamp > todo.deadline
            }
          })
        }
      })
      commit('setStatusList', updatedList)
      commit('setFilterStatusList', updatedList)
    },
    async getStatusList({ dispatch }) {
      const data = await api.getStatus('/statusList')
      dispatch('setIsOvertime', data)
    },
    setStatusList({ commit }, data) {
      commit('setStatusList', data)
    },
    setFilterStatusList({ commit }, data) {
      commit('setFilterStatusList', data)
    }
  },
  mutations: {
    // 同步 只能透過 mutation 更改 state
    setTodayTimestamp(state, data) {
      state.todayTimestamp = data
    },
    setStatusList(state, data) {
      state.statusList = data
    },
    setFilterStatusList(state, data) {
      state.filterStatusList = data
    }
  }
})

export default store
