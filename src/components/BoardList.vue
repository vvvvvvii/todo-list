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
     * 產生隨機 ID, Board Name 並設定空白 status
     * @public
     */
    setBlankStatus() {
      const id = this.generateRandomId()
      const name = `New Board ${this.setNewIndex()}`
      return {
        id,
        name,
        todoList: []
      }
    },
    /**
     * 以隨機字母加時間戳產生隨機 ID
     * @public
     */
    generateRandomId() {
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqId = randLetter + Date.now()
      return uniqId
    },
    /**
     * 設定 New Board 後方數字
     * @public
     */
    setNewIndex() {
      let newIndex = 1
      // 檢查畫面上是否已有 New Board
      const duplicateBoards = this.checkDuplicateName('New Board')
      if (duplicateBoards.length) {
        // 數字不連貫時以排在最大數字後方為主，故新數字需取最大數字加一
        const maxIndex = this.getMaxIndex(duplicateBoards, 'New Board')
        newIndex = maxIndex + 1
      }
      return newIndex
    },
    /**
     * 檢查是否有重複名稱
     * @param {string} - 要比對之名稱
     * @public
     */
    checkDuplicateName(targetName: string) {
      const statusNames = this.filterStatusList.map(statusItem => statusItem.name)
      return statusNames.filter(name => name.includes(targetName))
    },
    /**
     * 取出所有目標名稱後方數字，找到其中的最大值
     * @param {string[]} - 比對陣列
     * @param {string} - 目標名稱
     * @public
     */
    getMaxIndex(arr: string[], targetName: string) {
      const indexArr = arr.map(item => Number(item.split(targetName)[1]))
      return indexArr.sort((x, y) => y - x)[0]
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
