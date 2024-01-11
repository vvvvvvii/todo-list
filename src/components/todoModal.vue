<template>
  <div class="modal fade" id="todoModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content" @click="onModalContentClick">
        <div class="modal-header">
          <h3 class="fs-5 fw-bold text-center">
            {{ modeName }}
          </h3>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="todoModalTitle" class="form-label">
              標題<sup class="text-danger">*必填</sup>
            </label>
            <input type="text" v-model.trim="modal.title" class="form-control form-control-sm" id="todoModalTitle">
          </div>
          <div class="mb-3">
            <label for="todoModalStatus" class="form-label">狀態</label>
            <select class="form-select form-select-sm" v-model="modal.status" aria-label="待辦事項狀態" id="todoModalStatus">
              <option :value="status" v-for="status in statusNames" :key="status.name">
                {{ status.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="todoModalTag" class="form-label">Tag</label>
            <span v-for="(tag, tagIndex) in modal.tags" :key="tag" class="badge bg-dark-primary text-primary ms-2">
              # {{ tag }}
              <a href="#" @click="removeTag(tagIndex)" class="d-block ms-1"><i class="bi bi-x-lg"></i></a>
            </span>
            <div class="position-relative">
              <div class="form-select" id="tagSelect" @click="toggleTagOptions">
                <input type="text" class="form-select-hint" placeholder="下拉選擇或輸入客製化 Tag" v-model.trim="modal.tempTag"
                  @keyup.enter="addTag">
              </div>
              <div class="list-group tag-list" v-show="showTagOptions">
                <a href="#" class="list-group-item list-group-item-action" v-for="tag in tagOptions" :key="tag"
                  @click="toggleSelectedTag(tag)">
                  <i class="bi" :class="[modal.tags.includes(tag) ? 'bi-check-square-fill' : 'bi-square']"></i>
                  <span class="ms-2">{{ tag }}</span>
                </a>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">到期時間
              <sup class="text-danger">*必填</sup>
            </label>
            <date-picker v-model="modal.deadline" valueType="timestamp" class="d-block datepicker-input"
              prefix-class="xmx"></date-picker>
          </div>
          <div>
            <label class="form-label">內文</label>
            <ckeditor :editor="editor" v-model="modal.content" :config="editorConfig"></ckeditor>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-light-info" @click="closeModal">取消</button>
          <button type="button" class="btn btn-outline-light-info" @click="saveTemp">暫存並離開</button>
          <button type="button" class="btn border-info" :class="[isValidate ? 'btn-primary' : 'btn-secondary']"
            :disabled="!isValidate" @click="onSubmit">
            {{ submitBtnName }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" type="module">
import { Status } from '@/types/Status'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '../assets/ckeditor.css'
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import api from '../service/api'
import store from '@/store/index'

export default defineComponent({
  name: 'TodoModal',
  props: {
    mode: {
      type: String
    },
    defaultData: {
      required: true,
      type: Object as PropType<TodoItem>
    }
  },
  components: { DatePicker },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            'fontsize',
            '|',
            'bold',
            'italic',
            'numberedList', 'bulletedList'
          ]
        }
      },
      tagOptions: [] as string[],
      showTagOptions: false,
      targetStatus: {
        id: '',
        name: '',
        todoList: [] as TodoItem[]
      } as Status,
      modal: {
        id: '',
        title: '',
        content: '',
        status: {
          id: '',
          name: ''
        },
        deadline: 0,
        isOvertime: false,
        tags: [] as string[],
        tempTag: '' // 沒按 enter 送出的 tag 開啟 modal 時一律清空
      } as TodoItem
    }
  },
  computed: {
    filterStatusList() {
      return store.state.filterStatusList
    },
    modeName(): string {
      return this.mode === 'add' ? '新增待辦' : `編輯「${this.modal.title}」`
    },
    statusNames(): { id: string, name: string }[] {
      return this.filterStatusList.map(status => {
        const { id, name } = status
        return {
          id,
          name
        }
      })
    },
    isValidate(): boolean {
      // 未填寫資料時必填項目（標題、到期時間）應鎖定送出按鈕
      const { title, deadline } = this.modal
      return !!(title && deadline)
    },
    submitBtnName(): string {
      return this.mode === 'add' ? '新增' : '完成'
    },
    todayTimestamp() {
      return store.state.todayTimestamp
    }
  },
  watch: {
    defaultData() {
      this.setModal()
    },
    'modal.deadline'() {
      this.modal.isOvertime = this.todayTimestamp > this.modal.deadline
    }
  },
  methods: {
    setModal() {
      this.modal = JSON.parse(JSON.stringify(this.defaultData))
    },
    async getTagOptions() {
      this.tagOptions = await api.getStatus('/tagList')
    },
    toggleSelectedTag(tag: string) {
      const { tags } = this.modal
      if (tags.includes(tag)) {
        const deleteIndex = tags.indexOf(tag)
        this.removeTag(deleteIndex)
      } else {
        this.modal.tags.push(tag)
      }
    },
    addTag() {
      if (this.modal.tempTag) this.modal.tags.push(this.modal.tempTag)
      this.modal.tempTag = ''
    },
    removeTag(index: number) {
      this.modal.tags.splice(index, 1)
    },
    closeModal() {
      this.$emit('toggle-todo-modal', false)
    },
    saveTemp() {
      const tempData = JSON.stringify(this.modal)
      const sessionName = this.mode === 'add' ? 'add' : this.modal.id
      sessionStorage.setItem(sessionName, tempData)
      this.closeModal()
    },
    async onSubmit() {
      await this.findTargetStatus()
      await this.generateNewStatus()
      this.closeModal()
      store.dispatch('getStatusList')
    },
    async findTargetStatus() {
      // 如果 status 調整成其他項目 要改成新增到其他項目之下
      const targetStatusId = this.modal.status.id
      this.targetStatus = await api.getStatusItem('/statusList', targetStatusId)
    },
    async generateNewStatus() {
      if (this.mode === 'add') {
        this.addTodo()
      } else {
        this.editTodo()
      }
      await api.putStatus('statusList', this.targetStatus)
    },
    addTodo() {
      this.targetStatus.todoList.push(this.modal)
      // 新增後自動刪除暫存
      sessionStorage.removeItem('add')
      this.modal.tempTag = ''
    },
    editTodo() {
      // 完成後自動刪除暫存
      sessionStorage.removeItem(this.modal.id)
      this.modal.tempTag = ''

      const { todoList } = this.targetStatus

      if (this.modal.status.id === this.defaultData.status.id) {
        // status 沒變時，能在 todolist 找到對應 id 更換
        this.targetStatus.todoList = todoList.map(todoItem => {
          if (todoItem.id === this.modal.id) {
            return this.modal
          }
          return todoItem
        })
      } else {
        // status 改變時，要把原本 status 的 id 刪掉，並在新 status 新增一項
        const oldStatusId = this.defaultData.status.id
        this.deleteTodo(oldStatusId)
        this.addTodo()
      }
    },
    deleteTodo(statusId: string) {
      const targetStatus = this.filterStatusList.filter(status => status.id === statusId)[0]
      const updatedTodoList = targetStatus.todoList.filter(todoItem => todoItem.id !== this.modal.id)

      api.putStatus('statusList', {
        ...targetStatus,
        todoList: updatedTodoList
      })
    },
    onModalContentClick(e: Event) {
      const clickPosition = e.target as HTMLElement
      if (clickPosition.id !== 'tagSelect') this.closeTagOptions()
    },
    closeTagOptions() {
      this.showTagOptions = false
    },
    toggleTagOptions() {
      this.showTagOptions = !this.showTagOptions
    }
  },
  mounted() {
    this.getTagOptions()
  }
})
</script>
<style lang="scss">
/* custom style for datepicker input */
.datepicker-input input {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border: 0;
}

.form-select-hint {
  border: 0;
  width: 100%;
  font-size: 0.875rem;
  background: transparent;
  color: inherit;
}

.tag-list {
  position: absolute;
  top: 110%;
  z-index: 100;
  width: 100%;
  max-height: 100px;
  overflow: scroll;
}

[data-bs-theme='light'] {
  .datepicker-input input {
    background: #fefada;
  }
}

[data-bs-theme='dark'] {
  .datepicker-input input {
    background: #1f2345;
  }
}
</style>
