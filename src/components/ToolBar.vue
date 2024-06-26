<template>
  <div class="mb-4">
    <div class="row justify-content-between">
      <div class="col-6">
        <!-- 搜尋欄＆搜尋按鈕 -->
        <div class="d-flex mb-3">
          <input type="text" class="form-control w-75" placeholder="請輸入待辦事項標題" v-model="searchTerms">
          <!-- 以 searchTerms＆checkboxes 搜尋 -->
          <button type="button" class="btn btn-success ms-3" @click="onSubmit">搜尋</button>
        </div>
        <!-- 篩選 checkbox -->
        <div class="d-flex flex-wrap">
          <div class="form-check me-3">
            <input class="form-check-input" type="checkbox" value="overtime" id="checkbox-overtime"
              v-model="checkedOvertime">
            <label class="form-check-label" for="checkbox-overtime">
              已過期
            </label>
          </div>
          <div class="form-check me-3" v-for="(tag, tagIndex) in tagCheckboxes" :key="tag">
            <input class="form-check-input" type="checkbox" :value="tag" :id="`checkbox${tagIndex}`"
              v-model="checkedTags">
            <label class="form-check-label" :for="`checkbox${tagIndex}`">
              {{ tag }}
            </label>
          </div>
        </div>
      </div>
      <!-- 改主題色按鈕 -->
      <div class="col-2">
        <ThemeBtn />
      </div>
    </div>
  </div>
</template>

<script lang="ts" type="module">
import ThemeBtn from './ThemeBtn.vue'
import { TodoItem } from '@/types/TodoItem'
import { defineComponent } from 'vue'
import store from '@/store/index'

/**
 * 包含搜尋欄, 篩選列, ThemeBtn
 */

export default defineComponent({
  name: 'ToolBar',
  components: { ThemeBtn },
  data() {
    return {
      searchTerms: '',
      tagCheckboxes: [] as string[],
      checkedOvertime: false,
      checkedTags: [] as string[]
    }
  },
  computed: {
    statusList() {
      return store.state.statusList
    }
  },
  watch: {
    statusList() {
      // statusList 改變時重抓 checkbox
      this.setTagCheckboxes()
    }
  },
  methods: {
    /**
     * 取得並設定所有被選＆客製化的 tag
     * @public
     */
    setTagCheckboxes() {
      const selectedTagList = this.statusList.map(status => status.todoList.map(todo => todo.tags)).flat(2)
      const uniqTagList = new Set([...selectedTagList])
      this.tagCheckboxes = Array.from(uniqTagList)
    },
    /**
     * 以 statusList 篩出 todoList ，更新 filterStatusList
     * @public
     */
    onSubmit() {
      const updatedStatusList = this.statusList.map((status) => {
        const updatedTodoList = this.organizedTodos(status.todoList)
        // 不管是否有符合的 todoCard ，都要秀出 statusBoard
        return {
          ...status, todoList: updatedTodoList
        }
      })
      store.dispatch('setFilterStatusList', updatedStatusList)
    },
    /**
     * 以 searchTerm＆checkedOvertime＆checkedTags 篩選 Todo
     * @param {TodoItem[]} - todoList
     * @public
     */
    organizedTodos(list: TodoItem[]) {
      if (this.searchTerms.length > 0) {
        list = this.filterTitles(list)
      }
      if (this.checkedOvertime) {
        list = this.filterOvertimes(list)
      }
      if (this.checkedTags.length > 0) {
        list = this.filterTags(list)
      }
      return list
    },
    /**
     * 篩 todo 標題
     * @param {TodoItem[]} - todoList
     * @public
     */
    filterTitles(todoList: TodoItem[]) {
      return todoList.filter(todo => todo.title.includes(this.searchTerms))
    },
    /**
     * 篩已過期 todo
     * @param {TodoItem[]} - todoList
     * @public
     */
    filterOvertimes(todoList: TodoItem[]) {
      return todoList.filter(todo => todo.isOvertime)
    },
    /**
     * 若該 todo 的 tags 中含有「任一個在畫面上勾選的 tag 」，返回該 todo
     * @param {TodoItem[]} - todoList
     * @public
     */
    filterTags(todoList: TodoItem[]) {
      return todoList.filter(todo => {
        const conformTags = todo.tags.filter(tag => this.checkedTags.includes(tag))
        return conformTags.length > 0
      })
    }
  }
})
</script>
