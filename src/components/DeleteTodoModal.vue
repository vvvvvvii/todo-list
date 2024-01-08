<template>
  <div class="modal fade" :id="`deleteTodoModal${todoId}`" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <p>是否確定刪除此待辦事項？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" @click="closeModal()">取消</button>
          <button type="button" class="btn btn-primary" @click="deleteTodo(statusId, todoId)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" type="module">
import { Status } from '@/types/Status'
import { defineComponent, PropType } from 'vue'
import api from '../service/api'

export default defineComponent({
  name: 'DeleteTodoModal',
  props: {
    todoId: {
      required: true,
      type: String
    },
    statusId: {
      required: true,
      type: String
    },
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    }
  },
  methods: {
    closeModal() {
      this.$emit('toggle-delete-modal', false)
    },
    deleteTodo(targetStatusId: string, targetTodoId: string) {
      this.closeModal()
      const targetStatus = this.boardList.filter(status => status.id === targetStatusId)[0]
      const updatedTodoList = targetStatus.todoList.filter(todoItem => todoItem.id !== targetTodoId)
      api.putStatus('statusList', {
        ...targetStatus,
        todoList: updatedTodoList
      })
      this.$emit('get-status-list')
    }
  }

})
</script>
