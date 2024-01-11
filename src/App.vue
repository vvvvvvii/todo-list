<template>
  <div id="app" class="py-4">
    <ToolBar :status-list="statusList" @set-filter-status-list="setFilterStatusList" />
    <BoardList :board-list="filterStatusList" :today-timestamp="todayTimestamp" @get-status-list="getStatusList" />
    <OvertimeAlert :list="overtimeTodos" v-if="overtimeTodos.length > 0" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OvertimeAlert from './components/OvertimeAlert.vue'
import ToolBar from './components/ToolBar.vue'
import BoardList from './components/BoardList.vue'
import { Status } from './types/Status'
import { TodoItem } from './types/TodoItem'
import api from './service/api'

export default Vue.extend({
  name: 'App',
  components: { ToolBar, BoardList, OvertimeAlert },
  data() {
    return {
      statusList: [] as Status[],
      todayTimestamp: 0,
      todoList: [] as TodoItem[],
      overtimeTodos: [] as TodoItem[],
      filterStatusList: [] as Status[]
    }
  },
  watch: {
    statusList: {
      deep: true,
      handler() {
        this.setFilterStatusList(this.statusList)
      }
    }
  },
  methods: {
    async getStatusList() {
      this.statusList = await api.getStatus('/statusList')
    },
    getTodayTimestamp() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      this.todayTimestamp = today.getTime()
    },
    getOvertimeList() {
      this.getTodayTimestamp()
      this.setStatusList()
      this.setOvertimeTodos()
    },
    setStatusList() {
      const updatedStatusList = this.statusList.map(status => {
        return {
          ...status,
          todoList: status.todoList.map(todo => {
            return {
              ...todo,
              isOvertime: this.todayTimestamp > todo.deadline
            }
          })
        }
      })
      this.statusList = [...updatedStatusList]
      this.setTodoList()
    },
    setTodoList() {
      this.todoList = this.statusList.map(status => status.todoList).flat(1)
    },
    setOvertimeTodos() {
      this.overtimeTodos = this.todoList.filter(todo => todo.isOvertime)
    },
    setFilterStatusList(newList: Status[]) {
      this.filterStatusList = newList
    }
  },
  async mounted() {
    await this.getStatusList()
    this.getOvertimeList()
  }
})
</script>
<style lang="scss">
@import './assets/main.scss'
</style>
