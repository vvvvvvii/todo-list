<template>
  <div class="modal fade" :id="`deleteTodoModal${todoId}`" tabindex="-1">
    <div class="modal-dialog  modal-dialog-centered">
      <div class="modal-content py-3 text-center">
        <div class="modal-body">
          <p>是否確定刪除此待辦事項？</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-outline-light-info" @click="closeModal()">取消</button>
          <button type="button" class="btn btn-primary border-info ms-2" @click="deleteTodo()">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" type="module">
import { defineComponent } from 'vue'
import { Status } from '@/types/Status'
import { findTargetStatus } from '../mixins/findTargetStatus'
import api from '../service/api'
import store from '@/store/index'

/**
 * 刪除待辦 Modal
 */

export default defineComponent({
  name: 'DeleteTodoModal',
  props: {
    /**
     * 欲刪除待辦之 id
     */
    todoId: {
      required: true,
      type: String
    },
    /**
     * 欲刪除待辦位在狀態之 id
     */
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
    /**
     * 關閉 modal 、更新 api 並取得新列表
     * @public
     */
    deleteTodo() {
      this.closeModal()
      this.updateStatus()
      store.dispatch('getStatusList')
    },
    /**
    * 關閉刪除 modal
    * @public
    */
    closeModal() {
      /**
       * 開關 delete todo modal
       *
       * @property {boolean} 是否開啟
       */
      this.$emit('toggle-delete-todo-modal', false)
    },
    /**
     * 找到目標 status 、取得新 todoList 、更新 api
     * @public
     */
    updateStatus() {
      const targetStatus = findTargetStatus(this.filterStatusList, this.statusId)
      const updatedTodoList = this.updateTodoList(targetStatus)
      api.putStatus('statusList', {
        ...targetStatus,
        todoList: updatedTodoList
      })
    },
    /**
     * 取得新 todoList
     * @public
     */
    updateTodoList(targetStatus: Status) {
      return targetStatus.todoList.filter(todoItem => todoItem.id !== this.todoId)
    }
  }

})
</script>
