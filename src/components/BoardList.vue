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
import TodoModal from './todoModal.vue'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent } from 'vue'
import api from '../service/api'
import { Modal } from 'bootstrap'
import store from '@/store/index'

export default defineComponent({
  name: 'statusList',
  components: { BoardItem, TodoModal },
  computed: {
    filterStatusList() {
      return store.state.filterStatusList
    }
  },
  data() {
    return {
      todoModal: {} as Modal,
      todoMode: 'add',
      todoModalData: {} as TodoItem
    }
  },
  methods: {
    async addStatus() {
      // 新增狀態
      const newStatus = this.setBlankStatus()
      await api.postStatus('/statusList', newStatus)
      // 重新取得最新 statusList
      store.dispatch('getStatusList')
    },
    setBlankStatus() {
      // 產生隨機 ID
      const id = this.generateRandomId()
      // 確認沒有重複 New Board 名稱
      const name = `New Board ${this.setNewIndex()}`
      // 設定空白 status
      return {
        id,
        name,
        todoList: []
      }
    },
    generateRandomId() {
      // 以隨機字母加時間戳產生隨機 ID
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqId = randLetter + Date.now()
      return uniqId
    },
    setNewIndex() {
      // 設定 New Board 後方數字
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
    checkDuplicateName(targetName: string) {
      // 檢查是否有重複名稱
      const statusNames = this.filterStatusList.map(statusItem => statusItem.name)
      return statusNames.filter(name => name.includes(targetName))
    },
    getMaxIndex(arr: string[], targetName: string) {
      // 取出目標名稱後方數字，找到其中的最大值
      const indexArr = arr.map(item => Number(item.split(targetName)[1]))
      return indexArr.sort((x, y) => y - x)[0]
    },
    toggleTodoModal(isShow: boolean, mode: string, data?: TodoItem) {
      // 開關 todoModal
      isShow ? this.todoModal.show() : this.todoModal.hide()
      // 設定 todoMode
      this.todoMode = mode
      // 設定 todoModal 內的資料
      if (data) {
        this.todoModalData = {
          ...data,
          tempTag: '' // 無送出的 tag 一律清空
        }
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
