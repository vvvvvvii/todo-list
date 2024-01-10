<template>
  <div class="mb-4 container">
    <div class="row justify-content-between">
      <div class="col-6">
        <div class="d-flex mb-3">
          <!-- searchbar -->
          <input type="text" class="form-control w-75" placeholder="請輸入待辦事項標題" v-model="searchTerms">
          <button type="button" class="btn btn-success ms-3" @click="onSubmit">搜尋</button>
        </div>
        <div class="d-flex flex-wrap">
          <!-- filter checkboxes -->
          <div class="form-check me-3">
            <input class="form-check-input" type="checkbox" value="overtime" :id="`checkbox-overtime`"
              v-model="checkedOvertime">
            <label class="form-check-label" :for="`checkbox-overtime`">
              已過期
            </label>
          </div>
          <div class="form-check me-3" v-for="(tag, tagIndex) in tagList" :key="tag">
            <input class="form-check-input" type="checkbox" :value="tag" :id="`checkbox${tagIndex}`"
              v-model="checkedTags">
            <label class="form-check-label" :for="`checkbox${tagIndex}`">
              {{ tag }}
            </label>
          </div>
        </div>
      </div>
      <div class="col-2">
        <ThemeBtn />
      </div>
    </div>
  </div>
</template>

<script lang="ts" type="module">
import ThemeBtn from './ThemeBtn.vue'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
import { Status } from '../types/Status'

export default defineComponent({
  name: 'ToolBar',
  props: {
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    }
  },
  components: { ThemeBtn },
  data() {
    return {
      searchTerms: '',
      tagList: [] as string[],
      checkedOvertime: false,
      checkedTags: [] as string[],
      themeColor: 'light'
    }
  },
  watch: {
    boardList() {
      this.setTagList()
    }
  },
  methods: {
    setTagList() {
      const selectedTagList = this.boardList.map(status => status.todoList.map(todo => todo.tags)).flat(2)
      const uniqTagList = new Set([...selectedTagList])
      this.tagList = Array.from(uniqTagList)
    },
    organizedTodos(list: TodoItem[]) {
      let updatedList = [...list]
      if (this.searchTerms.length > 0) {
        updatedList = this.filterTitles(updatedList)
      }
      if (this.checkedOvertime) {
        updatedList = this.filterOvertimes(updatedList)
      }
      if (this.checkedTags.length > 0) {
        updatedList = this.filterTags(updatedList)
      }
      return updatedList
    },
    filterTitles(todoList: TodoItem[]) {
      return todoList.filter(todo => todo.title.includes(this.searchTerms))
    },
    filterOvertimes(todoList: TodoItem[]) {
      return todoList.filter(todo => todo.isOvertime)
    },
    filterTags(todoList: TodoItem[]) {
      return todoList.filter(todo => todo.tags.filter(tag => this.checkedTags.includes(tag)).length > 0)
    },
    onSubmit() {
      const updatedStatusList = [] as Status[]
      this.boardList.forEach((status, index) => {
        const updatedTodoList = this.organizedTodos(status.todoList)
        updatedStatusList[index] = {
          ...status, todoList: updatedTodoList
        }
      })
      this.$emit('set-filter-status-list', updatedStatusList)
    },
    toggleThemeColor(mode: 'light' | 'dark') {
      // 調整 themeColor 以設定元件樣式
      this.themeColor = mode
      //  data-bs-theme 屬性需下在 body
      const body = document.querySelector('body')
      if (body) body.setAttribute('data-bs-theme', mode)
    }
  },
  computed: {
    // primary / light 等依 data-bs-theme='light' 而定
    sunBtn(): string[] {
      return this.themeColor === 'light' ? ['btn-primary', 'border-dark'] : ['btn-outline-primary']
    },
    sunBtnIcon(): string {
      return this.themeColor === 'light' ? 'bi-brightness-high-fill' : 'bi-brightness-high'
    },
    moonBtn(): string[] {
      return this.themeColor === 'light' ? ['btn-outline-dark'] : ['btn-light', 'border-primary']
    },
    moonBtnIcon(): string {
      return this.themeColor === 'light' ? 'bi-moon' : 'bi-moon-fill'
    }
  }
})
</script>
