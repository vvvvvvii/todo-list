<template>
  <div class="card">
    <div class="card-header">
      <h2 class="fs-3" v-show="!isEditMode">
        {{ boardData.name }}
      </h2>
      <div v-show="isEditMode">
        <input type="text" class="fs-3" :value="boardData.name" @keyup.enter="onEnterBoardName">
        <p>按下 enter 完成編輯</p>
      </div>
      <div class="d-flex">
        <button class="btn btn-light" type="button" @click="toggleEditMode(true)">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-light" type="button" @click="toggleDeleteModal(true)">
          <i class="bi bi-trash3-fill"></i>
        </button>
      </div>
    </div>
    <div class="card-body py-4 scroll-box">
      <CardItem v-for="todo in boardData.todoList" :key="todo.id" :todo-item="todo" />
      <div class="text-center">
        <button type="button" class="btn btn-light w-75" @click="toggleAddTodoModal(true)">新增待辦</button>
      </div>
    </div>
    <!-- delete status modal -->
    <div class="modal fade" :id="`deleteModal${boardData.id}`" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <p>是否確定刪除此狀態？下方代辦事項將一併被刪除</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal"
              @click="toggleDeleteModal(false)">取消</button>
            <button type="button" class="btn btn-primary" @click="deleteBoard">刪除</button>
          </div>
        </div>
      </div>
    </div>
    <!-- add todo modal -->
    <div class="modal fade" :id="`addModal${boardData.id}`" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            ADD
          </div>
          <div class="modal-body">
            <!-- 內文 ckeditor 編輯器、到期時間 vue2-datepicker -->
            <div class="mb-3">
              <label for="todoModalTitle" class="form-label">標題</label>
              <input type="text" class="form-control" id="todoModalTitle">
            </div>
            <div class="mb-3">
              <label for="todoModalStatus" class="form-label">狀態</label>
              <select class="form-select" aria-label="待辦事項狀態" id="todoModalStatus">
                <option selected disabled>選擇狀態</option>
                <option value="1">One</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="todoModalTag" class="form-label">Tag</label>
              <select class="form-select" aria-label="待辦事項 Tag" id="todoModalTag">
                <option selected disabled>選擇 Tag</option>
                <option value="1">One</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="todoModalCustomTag" class="form-label">客製化 Tag</label>
              <input type="text" class="form-control" id="todoModalCustomTag">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-primary" data-bs-dismiss="modal"
              @click="toggleAddTodoModal(false)">取消</button>
            <button type="button" class="btn btn-primary" @click="deleteBoard">新增</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" type="module">
import CardItem from './CardItem.vue'
import { Status } from '@/types/Status'
import { defineComponent, PropType } from 'vue'
import api from '../service/api'
import { Modal } from 'bootstrap'

export default defineComponent({
  name: 'BoardItem',
  components: { CardItem },
  props: {
    boardData: {
      required: true,
      type: Object as PropType<Status>
    }
  },
  data() {
    return {
      isEditMode: false,
      deleteModal: {} as Modal,
      addModal: {} as Modal
    }
  },
  methods: {
    toggleEditMode(isEditMode: boolean) {
      this.isEditMode = isEditMode
    },
    onEnterBoardName(e: KeyboardEvent) {
      const input = e.target as HTMLInputElement
      this.updateBoard(input.value)
      this.toggleEditMode(false)
      this.getStatusList()
    },
    updateBoard(newName: string) {
      const newStatus = {
        ...this.boardData,
        name: newName
      }
      api.putStatus('statusList', newStatus)
    },
    getStatusList() {
      this.$emit('get-status-list')
    },
    toggleDeleteModal(isShow: boolean) {
      isShow ? this.deleteModal.show() : this.deleteModal.hide()
    },
    deleteBoard() {
      this.toggleDeleteModal(false)
      api.deleteStatus('statusList', this.boardData.id)
      this.getStatusList()
    },
    toggleAddTodoModal(isShow: boolean) {
      isShow ? this.addModal.show() : this.addModal.hide()
    },
    addTodo() {
      // api.postTodo()
    }
  },
  mounted() {
    const currentId = this.boardData.id
    const deleteModalDom = document.getElementById(`deleteModal${currentId}`) as HTMLElement
    this.deleteModal = new Modal(deleteModalDom, {
      keyboard: false
    })
    const addModalDom = document.getElementById(`addModal${currentId}`) as HTMLElement
    this.addModal = new Modal(addModalDom, {
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
