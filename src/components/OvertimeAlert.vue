<template>
  <div class="alert alert-danger alert-dismissible fade show overtime-alert" role="alert">
    <h6 class="text-center fs-5">下列代辦事項已超時：</h6>
    <hr>
    <ul>
      <li v-for="alertItem in list" :key="alertItem.id" class="d-flex justify-content-center mb-2">
        <div class="w-50">
          {{ alertItem.title }}
        </div>
        <div class="fs-6">原訂完成日： {{ timestampTransfer(alertItem.deadline) }}</div>
      </li>
    </ul>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>
<script lang="ts" type="module">
import { defineComponent, PropType } from 'vue'
import { TodoItem } from '@/types/TodoItem'

/**
 * 顯示超時待辦「標題」及「原訂完成日」列表
 */

export default defineComponent({
  name: 'OvertimeAlert',
  props: {
    /**
     * 所有超時待辦列表
     */
    list: {
      required: true,
      type: [] as PropType<TodoItem[]>,
      default: []
    }
  },
  methods: {
    /**
     * 時間戳轉成 月 日,年（ex. Jan 3, 2025 ）格式
     * @param {number} - 時間戳
     * @public
     */
    timestampTransfer(timestamp: number) {
      const date = new Date(timestamp)
      return date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  }
})
</script>
<style scoped>
.overtime-alert {
  width: 33%;
  position: fixed;
  right: 1%;
  bottom: 0;
}
</style>
