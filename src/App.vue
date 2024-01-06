<template>
  <div id="app">
    <ToolBar />
    <BoardList :list="statusList" @get-status-list="getStatusList" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ToolBar from './components/ToolBar.vue'
import BoardList from './components/BoardList.vue'
import { Status } from './types/Status'
import api from './service/api'

export default Vue.extend({
  name: 'App',
  components: { ToolBar, BoardList },
  data() {
    return {
      statusList: [] as Status[]
    }
  },
  methods: {
    async getStatusList() {
      this.statusList = await api.getStatus('/statusList')
    }
  },
  mounted() {
    this.getStatusList()
  }
})
</script>
<style lang="scss">
@import './assets/main.scss'
</style>
