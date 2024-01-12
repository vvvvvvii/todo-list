<template>
  <div class="card">
    <BoardHeader :board-data="boardData" @toggle-delete-status-modal="toggleDeleteStatusModal" />
    <div class="card-body py-4 scroll-box">
      <CardItem v-for="todo in boardData.todoList" :key="todo.id" :todo-item="todo" :board-data="boardData"
        @set-modal-data="setModalData" />
      <p v-if="boardData.todoList.length === 0" class="text-center mb-4">無符合項目</p>
      <div class="text-center">
        <button type="button" class="btn btn-primary w-75" @click="openAddModal">新增待辦</button>
      </div>
    </div>
    <!-- delete status modal -->
    <DeleteStatusModal :status-id="boardData.id" @toggle-delete-status-modal="toggleDeleteStatusModal" />
  </div>
</template>

<script lang="ts" type="module">
import BoardHeader from './BoardHeader.vue'
import CardItem from './CardItem.vue'
import DeleteStatusModal from './DeleteStatusModal.vue'

import { Status } from '@/types/Status'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
import { Modal } from 'bootstrap'

import { generateRandomId } from '../mixins/generateRandomId'
import store from '@/store/index'

/**
 * 狀態項目 / 包含 BoardHeader, CardItem, add todo 按鈕, DeleteStatusModal
 */

export default defineComponent({
  name: 'BoardItem',
  components: { BoardHeader, CardItem, DeleteStatusModal },
  props: {
    /**
     * status 資料
     */
    boardData: {
      required: true,
      type: Object as PropType<Status>
    }
  },
  data() {
    return {
      deleteStatusModal: {} as Modal
    }
  },
  methods: {
    /**
     * 開關刪除 modal
     * @param {boolean} - 是否開啟
     * @public
     */
    toggleDeleteStatusModal(isShow: boolean) {
      isShow ? this.deleteStatusModal.show() : this.deleteStatusModal.hide()
    },
    /**
     * 開啟新增 modal
     * @public
     */
    openAddModal() {
      this.setModalData('add')
    },
    /**
     * 確認 session 有無暫存資料，設定 modalData 並開啟 todoModal
     * @param {string} - 'add' | todo.id
     * @public
     */
    setModalData(sessionName: string) {
      const modalMode = sessionName === 'add' ? 'add' : 'edit'
      const defaultData = this.setDefaultData(modalMode, sessionName)

      // 確認有無 tempData
      const tempData = sessionStorage.getItem(sessionName)

      // 有 tempData 則用，沒有則用 default modal
      const modalData = tempData ? JSON.parse(tempData) : defaultData

      this.toggleTodoModal(true, modalMode, modalData)
    },
    /**
     * 依新增或編輯設定預設 modalData
     * @param {string} - 'add' | 'edit'
     * @param {string} - 'add' | todo.id
     * @public
     */
    setDefaultData(modalMode: ('add' | 'edit'), sessionName: string) {
      if (modalMode === 'add') {
        const { id, title } = this.boardData
        return {
          id: generateRandomId(),
          title: '',
          content: '',
          status: {
            id,
            title
          },
          deadline: store.state.todayTimestamp,
          isOvertime: false,
          tags: [] as string[],
          tempTag: ''
        }
      }
      return this.boardData.todoList.filter((todo) => todo.id === sessionName)[0]
    },
    /**
    * 開關 todoModal
    * @param {boolean} - 是否顯示
    * @param {'add' | 'edit'} - modal 種類
    * @param {TodoItem} - modal 資料
    * @public
    */
    toggleTodoModal(isShow: boolean, mode: string, data?: TodoItem) {
      /**
       * 開關 todoModal
       * @param {boolean} - 是否顯示
       * @param {'add' | 'edit'} - modal 種類
       * @param {TodoItem} - modal 資料
       * @public
       */
      this.$emit('toggle-todo-modal', isShow, mode, data)
    }
  },
  mounted() {
    const currentId = this.boardData.id
    const deleteStatusModalDom = document.getElementById(`deleteStatusModal${currentId}`) as HTMLElement
    this.deleteStatusModal = new Modal(deleteStatusModalDom, {
      keyboard: false
    })
  }
})
</script>
<style scoped>
.scroll-box {
  max-height: 70vh;
  overflow-y: scroll
}
</style>
