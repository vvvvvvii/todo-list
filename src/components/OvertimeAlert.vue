<template>
  <div class="alert alert-warning alert-dismissible fade show overtime-alert" role="alert">
    <p class="mb-3"><strong>溫馨小提醒：</strong>下列代辦事項已超時：</p>
    <ul>
      <li v-for="alertItem in list" :key="alertItem.id">
        {{ alertItem.title }}
        <span class="ms-3">原訂完成日： {{ timestampTransfer(alertItem.deadline) }}</span>
      </li>
    </ul>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
</template>
<script lang="ts" type="module">
import { defineComponent, PropType } from 'vue'
import { TodoItem } from '@/types/TodoItem'
export default defineComponent({
  name: 'OvertimeAlert',
  props: {
    list: {
      required: true,
      type: [] as PropType<TodoItem[]>
    }
  },
  methods: {
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
  right: 0;
  bottom: 0;
}
</style>
