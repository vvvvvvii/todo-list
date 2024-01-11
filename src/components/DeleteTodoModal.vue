<template>
  <div class="modal fade" :id="`deleteTodoModal${todoId}`" tabindex="-1">
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content py-3 text-center">
        <div class="modal-body">
          <p>是否確定刪除此待辦事項？</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-outline-light-info" @click="closeModal()">取消</button>
          <button type="button" class="btn btn-primary border-info ms-2" @click="deleteTodo(statusId, todoId)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" type="module">
import { defineComponent } from 'vue'
import api from '../service/api'
import store from '@/store/index'

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
    }
  },
  computed: {
    filterStatusList() {
      return store.state.filterStatusList
    }
  },
  methods: {
    closeModal() {
      this.$emit('toggle-delete-modal', false)
    },
    deleteTodo(targetStatusId: string, targetTodoId: string) {
      this.closeModal()
      const targetStatus = this.filterStatusList.filter(status => status.id === targetStatusId)[0]
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
