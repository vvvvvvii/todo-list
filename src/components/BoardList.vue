<template>
  <div class="container">
    <div class="row flex-nowrap">
      <div class="col-4" v-for="statusBoard in boardList" :key="statusBoard.id">
        <BoardItem :board-data="statusBoard" :board-list="boardList" @toggle-todo-modal="toggleTodoModal"
          @get-status-list="getStatusList" />
      </div>
      <div class="col-4">
        <div class="text-center">
          <button type="button" class="btn btn-light-info w-75" @click="addStatus">新增狀態</button>
        </div>
      </div>
    </div>
    <!-- todo modal -->
    <TodoModal :today-timestamp="todayTimestamp" :mode="todoMode" :default-data="todoModalData" :board-list="boardList"
      @get-status-list="getStatusList" @toggle-todo-modal="toggleTodoModal" />
  </div>
</template>

<script lang="ts">
import BoardItem from './BoardItem.vue'
import TodoModal from './todoModal.vue'
import { Status } from '../types/Status'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
import api from '../service/api'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'BoardList',
  components: { BoardItem, TodoModal },
  props: {
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    },
    todayTimestamp: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      todoModal: {} as Modal,
      todoMode: 'add',
      todoModalData: {
        id: '',
        title: '',
        content: '',
        status: {
          id: '',
          name: ''
        },
        deadline: 0,
        normalTags: [] as string[],
        customTag: null as (null | string),
        tags: [] as string[]
      } as TodoItem
    }
  },
  methods: {
    addStatus() {
      const newStatus = this.setBlankStatus()
      api.postStatus('/statusList', newStatus)
      this.getStatusList()
    },
    setBlankStatus() {
      const id = this.generateRandomId()
      const name = `New Board ${this.setNewIndex()}`
      return {
        id,
        name,
        todoList: []
      }
    },
    generateRandomId() {
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqId = randLetter + Date.now()
      return uniqId
    },
    setNewIndex() {
      let newIndex = 1
      // 檢查畫面上有無 New Board
      const duplicateBoards = this.checkDuplicateName('New Board')
      if (duplicateBoards.length) {
        // 數字不連貫時以排在最大數字後方為主，故新數字需取最大數字加一
        const maxIndex = this.getMaxIndex(duplicateBoards, 'New Board')
        newIndex = maxIndex + 1
      }
      return newIndex
    },
    checkDuplicateName(targetName: string) {
      const statusNames = this.boardList.map(statusItem => statusItem.name)
      return statusNames.filter(name => name.includes(targetName))
    },
    getMaxIndex(arr: string[], targetName: string) {
      // 若有重複的名稱，單獨取出最後方的數字
      const indexArr = arr.map(item => Number(item.split(targetName)[1]))
      return indexArr.sort((x, y) => y - x)[0]
    },
    getStatusList() {
      this.$emit('get-status-list')
    },
    toggleTodoModal(isShow: boolean, mode: string, data?: TodoItem) {
      isShow ? this.todoModal.show() : this.todoModal.hide()
      this.todoMode = mode
      if (data) this.todoModalData = data
    }
  },
  mounted() {
    const todoModalDom = document.getElementById('todoModal') as HTMLElement
    this.todoModal = new Modal(todoModalDom, {
      keyboard: false
    })
  }
})
</script>
