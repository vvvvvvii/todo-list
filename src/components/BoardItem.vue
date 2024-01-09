<template>
  <div class="card">
    <div class="card-header">
      <BoardName :board-data="boardData" :is-edit-mode="isEditMode" @toggle-edit-mode="toggleEditMode" />
      <div class="d-flex">
        <button class="btn" type="button" @click="toggleEditMode(true)">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn" type="button" @click="toggleDeleteModal(true)">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
    </div>
    <div class="card-body py-4 scroll-box">
      <draggable :group="boardData.name" @start="onDragging(true)" @end="onDragging(false)">
        <CardItem v-for="todo in boardData.todoList" :key="todo.id" :todo-item="todo" :board-list="boardList"
          :board-data="boardData" @toggle-todo-modal="toggleTodoModal" @get-status-list="getStatusList" />
      </draggable>
      <p v-if="boardData.todoList.length === 0" class="text-center mb-4">無符合項目</p>
      <div class="text-center">
        <button type="button" class="btn btn-primary w-75" @click="openAddModal">新增待辦</button>
      </div>
    </div>
    <!-- delete status modal -->
    <DeleteModal :status-id="boardData.id" @toggle-delete-modal="toggleDeleteModal" @get-status-list="getStatusList" />
  </div>
</template>

<script lang="ts" type="module">
import BoardName from './BoardName.vue'
import CardItem from './CardItem.vue'
import DeleteModal from './DeleteModal.vue'

import { Status } from '@/types/Status'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
import { Modal } from 'bootstrap'
import draggable from 'vuedraggable'

export default defineComponent({
  name: 'BoardItem',
  components: { BoardName, CardItem, DeleteModal, draggable },
  props: {
    boardData: {
      required: true,
      type: Object as PropType<Status>
    },
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    }
  },
  data() {
    return {
      isEditMode: false,
      deleteModal: {} as Modal,
      dragging: false
    }
  },
  methods: {
    toggleEditMode(isEditMode: boolean) {
      this.isEditMode = isEditMode
    },
    getStatusList() {
      this.$emit('get-status-list')
    },
    toggleDeleteModal(isShow: boolean) {
      isShow ? this.deleteModal.show() : this.deleteModal.hide()
    },
    openAddModal() {
      const { id, name } = this.boardData
      this.toggleTodoModal(true, 'add', {
        id: this.generateRandomId(),
        title: '',
        content: '',
        status: {
          id,
          name
        },
        deadline: this.setDefaultTimestamp(),
        isOvertime: false,
        normalTags: [] as string[],
        customTag: null as (null | string),
        tags: [] as string[]
      })
    },
    setDefaultTimestamp() {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return today.getTime()
    },
    generateRandomId() {
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqId = randLetter + Date.now()
      return uniqId
    },
    toggleTodoModal(isShow: boolean, mode: string, data?: TodoItem) {
      this.$emit('toggle-todo-modal', isShow, mode, data)
    },
    onDragging(startDragging: boolean) {
      this.dragging = startDragging
    }
  },
  mounted() {
    const currentId = this.boardData.id
    const deleteModalDom = document.getElementById(`deleteModal${currentId}`) as HTMLElement
    this.deleteModal = new Modal(deleteModalDom, {
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
