<template>
  <div class="card mb-4" :class="[todoItem.isOvertime ? 'overtime-card' : 'normal-card']">
    <div class="card-header">
      <h3 class="fs-5 text-truncate">{{ todoItem.title }}</h3>
      <div class="position-relative">
        <button class="btn" type="button" @click="toggleToolList">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="list-group tool-list" v-show="showToolList">
          <li><a href="#" class="list-group-item list-group-item-action" @click="openEditModal">edit</a></li>
          <li><a href="#" class="list-group-item list-group-item-action" @click="toggleDeleteModal(true)">delete</a></li>
          <li><a href="#" class="list-group-item list-group-item-action" @click="copyTodo">copy</a></li>
        </ul>
      </div>
    </div>
    <div class="card-body">
      <div class="row card-info">
        <div class="col-9">
          <div class="text-truncate-2" v-html="todoItem.content" v-if="todoItem.content"></div>
          <div v-else>無更多說明</div>
        </div>
        <div class="col-3 card-info-border" v-if="todoItem.tags.length > 0">
          <p v-for="tag in todoItem.tags" :key="tag" class="fs-6"># {{ tag }}</p>
        </div>
      </div>
      <p class="fs-6 text-info text-center">
        <i class="bi bi-hourglass-split"></i>
        <span class="ms-1">
          {{ deadlineDateTransfer }}
        </span>
      </p>
    </div>
    <DeleteTodoModal :todo-id="todoItem.id" :status-id="todoItem.status.id" :board-list="boardList"
      @toggle-delete-modal="toggleDeleteModal" @get-status-list="getStatusList" />
  </div>
</template>

<script lang="ts">
import DeleteTodoModal from './DeleteTodoModal.vue'
import { TodoItem } from '@/types/TodoItem'
import { Status } from '@/types/Status'
import { defineComponent, PropType } from 'vue'
import { Modal } from 'bootstrap'
import api from '../service/api'

export default defineComponent({
  name: 'CardItem',
  props: {
    todoItem: {
      required: true,
      type: Object as PropType<TodoItem>
    },
    boardData: {
      required: true,
      type: Object as PropType<Status>
    },
    boardList: {
      required: true,
      type: [] as PropType<Status[]>
    }
  },
  components: { DeleteTodoModal },
  data() {
    return {
      showToolList: false,
      deleteModal: {} as Modal
    }
  },
  computed: {
    deadlineDateTransfer(): string {
      const date = new Date(this.todoItem.deadline)
      return date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  },
  methods: {
    toggleToolList() {
      this.showToolList = !this.showToolList
    },
    openEditModal() {
      this.$emit('toggle-todo-modal', true, 'edit', this.todoItem)
    },
    toggleDeleteModal(isShow: boolean) {
      isShow ? this.deleteModal.show() : this.deleteModal.hide()
    },
    getStatusList() {
      this.$emit('get-status-list')
    },
    copyTodo() {
      const id = this.generateRandomId()
      const newTitle = `${this.todoItem.title} Copy${this.setNewIndex()}`
      const copyTodo = {
        ...this.todoItem,
        id,
        title: newTitle
      }
      const { todoList } = this.boardData
      todoList.push(copyTodo)
      const updatedStatus = {
        ...this.boardData,
        todoList
      }
      api.putStatus('statusList', updatedStatus)
    },
    generateRandomId() {
      const randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
      const uniqId = randLetter + Date.now()
      return uniqId
    },
    setNewIndex() {
      let newIndex = 1
      const duplicateItems = this.checkDuplicateName('Copy')
      if (duplicateItems.length) {
        // 數字不連貫時以排在最大數字後方為主，故新數字需取最大數字加一
        const maxIndex = this.getMaxIndex(duplicateItems, 'Copy')
        newIndex = maxIndex + 1
      }
      return newIndex
    },
    checkDuplicateName(targetTitle: string) {
      const titles = this.boardData.todoList.map(todoItem => todoItem.title)
      return titles.filter(title => title.includes(targetTitle))
    },
    getMaxIndex(arr: string[], targetTitle: string) {
      // 若有重複的名稱，單獨取出最後方的數字
      const indexArr = arr.map(item => Number(item.split(targetTitle)[1]))
      console.log(indexArr.sort((x, y) => y - x))
      return indexArr.sort((x, y) => y - x)[0]
    }
  },
  mounted() {
    const currentId = this.todoItem.id
    const deleteModalDom = document.getElementById(`deleteTodoModal${currentId}`) as HTMLElement
    this.deleteModal = new Modal(deleteModalDom, {
      keyboard: false
    })
  }
})
</script>

<style lang="scss" scoped>
.card-info {
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

[data-bs-theme='light'] {
  .overtime-card {
    background: rgba(#f15555, 0.05);

    .card-header {
      background: #f15555;
      color: #fff
    }

    .btn {
      color: #fff;
    }

    .card-info {
      border-bottom: 1px solid rgba(#f34545, 0.2);

      &-border {
        border-left: 1px solid rgba(#f34545, 0.2)
      }
    }
  }

  .normal-card {
    background: rgba(#fcf3a2, 0.2);

    .card-header {
      background: #fcf3a2
    }

    .card-info {
      padding-bottom: 1rem;
      margin-bottom: 1rem;

      border-bottom: 1px solid rgba(#c7a003, 0.2);

      &-border {
        border-left: 1px solid rgba(#c7a003, 0.2)
      }
    }
  }

}

[data-bs-theme='dark'] {
  .overtime-card {
    background: rgba(#5e0909, 0.5);

    .card-header {
      background: #5e0909;
    }

    .card-info {
      border-bottom: 1px solid rgba(#f34545, 0.2);

      &-border {
        border-left: 1px solid rgba(#f34545, 0.2)
      }
    }
  }

  .normal-card {
    background: rgba(#2d3466, 0.3);

    .card-header {
      background: #2d3466;
    }

    .card-info {

      border-bottom: 1px solid rgba(#2d3466, 0.6);

      &-border {
        border-left: 1px solid rgba(#2d3466, 0.6)
      }
    }
  }
}

.tool-list {
  position: absolute;
  top: 110%;
}
</style>
