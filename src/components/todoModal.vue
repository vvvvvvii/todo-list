<template>
  <div class="modal fade" id="todoModal" tabindex="-1" @click="onModalContentClick">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="fs-5 fw-bold text-center">
            {{ modeName }}
          </h3>
        </div>
        <div class="modal-body">
          <!-- 標題 -->
          <div class="mb-3">
            <label for="todoModalTitle" class="form-label">
              標題<sup class="text-danger">*必填</sup>
            </label>
            <input type="text" v-model.trim="modal.title" class="form-control form-control-sm" id="todoModalTitle">
          </div>
          <!-- 狀態下拉選單 -->
          <div class="mb-3">
            <label for="todoModalStatus" class="form-label">狀態</label>
            <select class="form-select form-select-sm" v-model="modal.status" aria-label="待辦事項狀態" id="todoModalStatus">
              <option :value="status" v-for="status in statusNames" :key="status.name">
                {{ status.name }}
              </option>
            </select>
          </div>
          <!-- tag 下拉選單＆輸入欄 -->
          <div class="mb-3">
            <label for="todoModalTag" class="form-label">Tag</label>
            <!-- 已選 tag -->
            <span v-for="(tag, tagIndex) in modal.tags" :key="tag" class="badge bg-dark-primary text-primary ms-2">
              # {{ tag }}
              <a href="#" @click="removeTag(tagIndex)"><i class="bi bi-x-lg"></i></a>
            </span>
            <div class="position-relative">
              <!-- select＆input -->
              <div class="form-select" id="tagSelect" @click="toggleTagOptions(!showTagOptions)">
                <input type="text" class="select-input" placeholder="下拉選擇或輸入客製化 Tag" v-model.trim="modal.tempTag"
                  @keyup.enter="addTempTag">
              </div>
              <!-- 下拉選單 -->
              <div class="list-group tag-list" v-show="showTagOptions">
                <a href="#" class="list-group-item list-group-item-action" v-for="tag in  tagOptions " :key="tag"
                  @click="toggleSelectedTag(tag)">
                  <i class="bi" :class="tagOptionIcon(tag)"></i>
                  <span class="ms-2">{{ tag }}</span>
                </a>
              </div>
            </div>
          </div>
          <!-- 到期時間 -->
          <div class="mb-3">
            <label class="form-label">到期時間
              <sup class="text-danger">*必填</sup>
            </label>
            <date-picker v-model="modal.deadline" valueType="timestamp" class="d-block datepicker-input"
              prefix-class="xmx"></date-picker>
          </div>
          <!-- 內文 -->
          <div>
            <label class="form-label">內文</label>
            <ckeditor :editor="editor" v-model="modal.content" :config="editorConfig"></ckeditor>
          </div>
        </div>
        <!-- 取消、暫存、送出 -->
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
      targetStatus: {} as Status,
      modal: {} as TodoItem
    }
  },
  computed: {
    filterStatusList() {
      return store.state.filterStatusList
    },
    modeName(): string {
      // modal header 標題
      return this.mode === 'add' ? '新增待辦' : `編輯「${this.modal.title}」`
    },
    statusNames(): { id: string, name: string }[] {
      // 列出所有現有 status 給「狀態」下拉選單
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
      // 送出按鈕文字
      return this.mode === 'add' ? '新增' : '完成'
    },
    todayTimestamp() {
      return store.state.todayTimestamp
    }
  },
  watch: {
    defaultData() {
      // 更換點擊項目時設定 modal 資料
      this.setModalData()
    }
  },
  methods: {
    tagOptionIcon(tag: string) {
      // tag 下拉選單是否打勾 icon 樣式
      return this.modal.tags && this.modal.tags.includes(tag) ? 'bi-check-square-fill' : 'bi-square'
    },
    setModalData() {
      // 深拷貝
      this.modal = JSON.parse(JSON.stringify(this.defaultData))
    },
    async getTagOptions() {
      // 取得所有預設 tag
      this.tagOptions = await api.getStatus('/tagList')
    },
    toggleSelectedTag(tag: string) {
      const { tags } = this.modal
      if (tags.includes(tag)) {
        // 已有的則刪掉
        const deleteIndex = tags.indexOf(tag)
        this.removeTag(deleteIndex)
      } else {
        // 沒有則加入
        this.addTag(tag)
      }
    },
    addTempTag() {
      // 有輸入值（不含空白）則新增
      const { tempTag } = this.modal
      if (tempTag) {
        this.addTag(tempTag)
        this.modal.tempTag = ''
      }
    },
    addTag(tag: string) {
      // 新增 tag
      this.modal.tags.push(tag)
    },
    removeTag(index: number) {
      // 移除 tag
      this.modal.tags.splice(index, 1)
    },
    closeModal() {
      // 關 todo modal
      this.$emit('toggle-todo-modal', false)
    },
    saveTemp() {
      // 以 add 或 modal.id 做名稱暫存 modal 資料後關閉 modal
      // 新增最多只可有一筆暫存資料，故統一命名
      const tempData = JSON.stringify(this.modal)
      const sessionName = this.mode === 'add' ? 'add' : this.modal.id
      sessionStorage.setItem(sessionName, tempData)
      this.closeModal()
    },
    async onSubmit() {
      // 按送出按鈕
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
      // 新增或編輯 todoList 並更新 statusList
      if (this.mode === 'add') {
        this.addTodo()
      } else {
        this.editTodo()
      }
      await api.putStatus('statusList', this.targetStatus)
    },
    addTodo() {
      this.targetStatus.todoList.push(this.modal)
      // 自動刪除暫存
      this.clearTempData('add')
    },
    editTodo() {
      const { todoList } = this.targetStatus
      const oldStatusId = this.defaultData.status.id
      // this.defaultData.status 只有{id, name} ，須重新取完整 Status
      const oldStatus = this.filterStatusList.filter(status => status.id === oldStatusId)[0]

      if (this.targetStatus.id === oldStatusId) {
        // status 沒變時，在 todolist 找到對應 todo id ，更換為現在的 modal 資料
        this.targetStatus.todoList = todoList.map(todoItem => {
          if (todoItem.id === this.modal.id) {
            return this.modal
          }
          return todoItem
        })
        // 自動刪除暫存
        this.clearTempData(this.modal.id)
      } else {
        // status 改變時，把原本 status 的 todo 刪掉，並在新 status 新增一項
        this.deleteTodo(oldStatus)
        this.addTodo()
      }
    },
    clearTempData(sessionName: string) {
      // 移除 sessionStorage 資料並清空 tempTag
      sessionStorage.removeItem(sessionName)
      this.modal.tempTag = ''
    },
    deleteTodo(deleteStatus: Status) {
      // 找到對應 todo 刪除並更新 statusList
      const updatedTodoList = deleteStatus.todoList.filter(todoItem => todoItem.id !== this.modal.id)

      api.putStatus('statusList', {
        ...deleteStatus,
        todoList: updatedTodoList
      })
    },
    onModalContentClick(e: Event) {
      // 點擊 modal 任一部分時，檢查點的是否是 tag 下拉選單，若不是則關閉 tag 下拉選單
      const clickPosition = e.target as HTMLElement
      if (clickPosition.id !== 'tagSelect') this.toggleTagOptions(false)
    },
    toggleTagOptions(isShow: boolean) {
      // 開關 tag 下拉選單
      this.showTagOptions = isShow
    }
  },
  mounted() {
    this.getTagOptions()
  }
})
</script>
<style lang="scss">
.select-input {
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

/* custom style for datepicker input */
.datepicker-input input {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.25rem;
  border: 0;
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
