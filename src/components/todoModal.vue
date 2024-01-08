<template>
  <div class="modal fade" id="todoModal" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          {{ mode }}
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="todoModalTitle" class="form-label">標題*</label>
            <input type="text" v-model.trim="modal.title" class="form-control" id="todoModalTitle">
          </div>
          <div class="mb-3">
            <label for="todoModalStatus" class="form-label">狀態</label>
            <select class="form-select" v-model="modal.status" aria-label="待辦事項狀態" id="todoModalStatus">
              <option :value="status" v-for="status in statusNames" :key="status.name">
                {{ status.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <div class="d-flex">
              <label for="todoModalTag" class="form-label">Tag</label>
              <div>
                <span v-for="tag in selectedTags" :key="tag" class="badge bg-primary ms-2">{{ tag }}</span>
              </div>
            </div>
            <select class="form-select" v-model="modal.normalTags" multiple aria-label="待辦事項 Tag" id="todoModalTag">
              <option selected disabled>選擇 Tag</option>
              <option :value="tag" v-for="tag in normalTagList" :key="tag">{{ tag }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="todoModalCustomTag" class="form-label">客製化 Tag</label>
            <input type="text" class="form-control" v-model="modal.customTag" id="todoModalCustomTag">
          </div>
          <div class="mb-3">
            <label class="form-label">到期時間*</label>
            <date-picker v-model="modal.deadline" valueType="timestamp" class="d-block"></date-picker>
          </div>
          <div class="mb-3">
            <label>內文</label>
            <ckeditor :editor="editor" v-model="modal.content" :config="editorConfig"></ckeditor>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-primary" @click="closeModal">取消</button>
          <button type="button" class="btn btn-primary" :disabled="!isValidate" @click="onSubmit">
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
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'
import api from '../service/api'

export default defineComponent({
  name: 'TodoModal',
  props: {
    mode: {
      type: String
    },
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    },
    defaultData: {
      required: true,
      type: Object as PropType<TodoItem>
    },
    todayTimestamp: {
      required: true,
      type: Number
    }
  },
  components: { DatePicker },
  data() {
    return {
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the editor.
      },
      normalTagList: [] as string[],
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
        normalTags: [] as string[],
        customTag: '',
        tags: [] as string[]
      } as TodoItem
    }
  },
  computed: {
    statusNames(): { id: string, name: string }[] {
      return this.boardList.map(status => {
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
    selectedTags(): string[] {
      const { normalTags, customTag } = this.modal
      return [...normalTags, customTag]
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
    async getNormalTags() {
      this.normalTagList = await api.getStatus('/tagList')
    },
    closeModal() {
      this.$emit('toggle-todo-modal', false)
    },
    async onSubmit() {
      await this.findTargetStatus()
      await this.generateNewStatus()
      this.closeModal()
      this.getStatusList()
    },
    async findTargetStatus() {
      // 如果 status 調整成其他項目 要改成新增到其他項目之下
      const targetStatusId = this.modal.status.id
      this.targetStatus = await api.getStatusItem('/statusList', targetStatusId)
    },
    async generateNewStatus() {
      this.modal.tags = this.selectedTags
      if (this.mode === 'add') {
        this.addTodo()
      } else {
        this.editTodo()
      }
      await api.putStatus('statusList', this.targetStatus)
    },
    addTodo() {
      this.targetStatus.todoList.push(this.modal)
    },
    editTodo() {
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
      const targetStatus = this.boardList.filter(status => status.id === statusId)[0]
      const updatedTodoList = targetStatus.todoList.filter(todoItem => todoItem.id !== this.modal.id)

      api.putStatus('statusList', {
        ...targetStatus,
        todoList: updatedTodoList
      })
    },
    getStatusList() {
      this.$emit('get-status-list')
    }
  },
  mounted() {
    this.getNormalTags()
  }
})
</script>