<template>
  <div>
    <div class="row flex-nowrap">
      <div class="col-4" v-for="statusBoard in filterStatusList" :key="statusBoard.id">
        <BoardItem :board-data="statusBoard" @toggle-todo-modal="toggleTodoModal" />
      </div>
      <div class="col-4 text-center">
        <button type="button" class="btn btn-light-info w-75" @click="addStatus">新增狀態</button>
      </div>
    </div>
    <!-- todo modal -->
    <TodoModal :mode="todoMode" :default-data="todoModalData" @toggle-todo-modal="toggleTodoModal" />
  </div>
</template>

<script lang="ts">
import BoardItem from './BoardItem.vue'
import TodoModal from './TodoModal.vue'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent } from 'vue'
import api from '../service/api'
import { Modal } from 'bootstrap'
import { generateRandomId } from '../mixins/generateRandomId'
import { setNewIndex } from '../mixins/generateUniqName'
import store from '@/store/index'

/**
 * 狀態列表 / 包含  BoardItem, 新增 Board 按鈕, TodoModal
 */

export default defineComponent({
  name: 'BoardList',
  components: { BoardItem, TodoModal },
  data() {
    return {
      todoModal: {} as Modal,
      todoMode: 'add',
      todoModalData: {} as TodoItem
    }
  },
  computed: {
    filterStatusList() {
      return store.state.filterStatusList
    }
  },
  methods: {
    /**
     * 新增狀態並重新取得最新 statusList
     * @public
     */
    async addStatus() {
      const newStatus = this.setBlankStatus()
      await api.postStatus('/statusList', newStatus)
      store.dispatch('getStatusList')
    },
    /**
     * 產生隨機 ID, Board Title 並設定空白 status
     * @public
     */
    setBlankStatus() {
      return {
        id: generateRandomId(),
        title: `New Board ${setNewIndex('New Board', this.filterStatusList)}`,
        todoList: []
      }
    },
    /**
     * 開關 todoModal, 設定 todoMode 和 todoModal
     * @param {boolean} - 是否顯示
     * @param {'add' | 'edit'} - modal 種類
     * @param {TodoItem} - modal 資料
     * @public
     */
    toggleTodoModal(isShow: boolean, mode: ('add' | 'edit'), data?: TodoItem) {
      isShow ? this.todoModal.show() : this.todoModal.hide()
      this.todoMode = mode
      if (data) {
        this.setTodoModalData(data)
      }
    },
    /**
     * 設定 todoModal 內部資料
     * @param {TodoItem} - modal 資料
     * @public
     */
    setTodoModalData(data: TodoItem) {
      this.todoModalData = {
        ...data,
        tempTag: '' // 無送出的 tag 一律清空
      }
    }
  },
  mounted() {
    // 註冊 todoModal
    const todoModalDom = document.getElementById('todoModal') as HTMLElement
    this.todoModal = new Modal(todoModalDom, {
      keyboard: false
    })
  }
})
</script>
