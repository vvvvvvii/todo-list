<template>
  <div class="mb-4 container">
    <div class="row justify-content-between">
      <div class="col-6">
        <div class="d-flex mb-3">
          <!-- searchbar -->
          <input type="text" class="form-control w-75" placeholder="請輸入待辦事項標題" v-model="searchTerms">
          <button type="button" class="btn btn-primary ms-3" @click="onSubmit">搜尋</button>
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
        <!-- change theme btn -->
        <div class="btn-group" role="group">
          <button type="button" class="btn" :class="sunBtn" @click="toggleThemeColor('light')">
            <i class="bi" :class="sunBtnIcon"></i>
          </button>
          <button type="button" class="btn" :class="moonBtn" @click="toggleThemeColor('dark')">
            <i class="bi" :class="moonBtnIcon"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" type="module">

import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
import { Status } from '../types/Status'

export default defineComponent({
  name: 'ToolBar',
  props: {
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    },
    themeColor: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      searchTerms: '',
      tagList: [] as string[],
      checkedOvertime: false,
      checkedTags: [] as string[]
    }
  },
  watch: {
    boardList() {
      this.setTagList()
    }
  },
  methods: {
    setTagList() {
      this.tagList = this.boardList.map(status => status.todoList.map(todo => todo.tags)).flat(2)
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
      this.$emit('toggle-theme-color', mode)
    }
  },
  computed: {
    sunBtn() {
      return this.themeColor === 'light' ? ['btn-warning', 'border-dark'] : ['text-warning', 'border-dark']
    },
    sunBtnIcon() {
      return this.themeColor === 'light' ? 'bi-brightness-high-fill' : 'bi-brightness-high'
    },
    moonBtn() {
      return this.themeColor === 'light' ? 'btn-outline-dark' : 'btn-dark'
    },
    moonBtnIcon() {
      return this.themeColor === 'light' ? 'bi-moon' : 'bi-moon-fill'
    }
  }
})
</script>
