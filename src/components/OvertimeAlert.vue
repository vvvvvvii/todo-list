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
  right: 1%;
  bottom: 0;
}
</style>
