<template>
  <div class="card mb-4">
    <div class="card-header">
      <h3 class="fs-5 text-truncate">{{ todoItem.title }}</h3>
      <div class="position-relative">
        <button class="btn btn-light" type="button" @click="toggleToolList">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="list-group tool-list" v-show="showToolList">
          <li><a class="list-group-item">edit</a></li>
          <li><a class="list-group-item">delete</a></li>
          <li><a class="list-group-item">copy</a></li>
        </ul>
      </div>
    </div>
    <div class="card-body row">
      <div class="col-9">
        <div class="text-truncate-2" v-html="todoItem.content"></div>
      </div>
      <div class="col-3 border-start">
        <p class="mb-0" v-for="tag in todoItem.tags" :key="tag"># {{ tag }}</p>
      </div>
    </div>
    <div class="card-footer">
      <p>
        <i class="bi bi-hourglass-split"></i>
        <span class="ms-1">
          {{ todoItem.deadline }}
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { TodoItem } from '@/types/TodoItem'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'CardItem',
  props: {
    todoItem: {
      required: true,
      type: Object as PropType<TodoItem>
    }
  },
  data() {
    return {
      showToolList: false
    }
  },
  methods: {
    toggleToolList() {
      this.showToolList = !this.showToolList
    }
  }
})
</script>

<style scoped>
.tool-list {
  position: absolute;
  top: 110%
}
</style>
