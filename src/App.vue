<template>
  <div id="app" class="py-4">
    <div class="container">
      <ToolBar />
      <BoardList />
    </div>
    <OvertimeAlert :list="overtimeTodos" v-if="overtimeTodos.length > 0" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OvertimeAlert from './components/OvertimeAlert.vue'
import ToolBar from './components/ToolBar.vue'
import BoardList from './components/BoardList.vue'
import { TodoItem } from './types/TodoItem'
import store from '@/store/index'

/**
 * 入口 / 包含 ToolBar, BoardList, OvertimeAlert
 */

export default Vue.extend({
  name: 'App',
  components: { ToolBar, BoardList, OvertimeAlert },
  data() {
    return {
      todoList: [] as TodoItem[],
      overtimeTodos: [] as TodoItem[]
    }
  },
  computed: {
    statusList() {
      return store.state.statusList
    },
    todayTimestamp() {
      return store.state.todayTimestamp
    }
  },
  methods: {
    /**
      * 抽出所有超時 todo 設定 OvertimeAlert
      * @public
    */
    setOvertimeTodos() {
      const todoList = this.statusList.map(status => status.todoList).flat(1)
      this.overtimeTodos = todoList.filter(todo => todo.isOvertime)
    }
  },
  async mounted() {
    await store.dispatch('getTodayTimestamp')
    await store.dispatch('getStatusList')

    this.setOvertimeTodos()
  }
})
</script>
<style lang="scss">
@import './assets/main.scss'
</style>
