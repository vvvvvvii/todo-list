<template>
  <div class="card mb-4" :class="[todoItem.isOvertime ? 'overtime-card' : 'normal-card']">
    <div class="card-header">
      <h3 class="fs-5 text-truncate">{{ todoItem.title }}</h3>
      <div class="dropdown">
        <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#" @click="openEditModal">編輯</a></li>
          <li><a class="dropdown-item" href="#" @click="toggleDeleteModal(true)">刪除</a></li>
          <li><a class="dropdown-item" href="#" @click="copyTodo">複製</a></li>
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
    <DeleteTodoModal :todo-id="todoItem.id" :status-id="todoItem.status.id"
      @toggle-delete-todo-modal="toggleDeleteModal" />
  </div>
</template>

<script lang="ts">
import DeleteTodoModal from './DeleteTodoModal.vue'
import { TodoItem } from '@/types/TodoItem'
import { Status } from '@/types/Status'
import { defineComponent, PropType } from 'vue'
import { Modal } from 'bootstrap'
import api from '../service/api'
import { generateRandomId } from '../mixins/generateRandomId'
import { setNewIndex } from '../mixins/generateUniqName'

/**
 * 待辦項目 / 包含 DeleteTodoModal
 */

export default defineComponent({
  name: 'CardItem',
  props: {
    /**
     * Todo 資料
     */
    todoItem: {
      required: true,
      type: Object as PropType<TodoItem>
    },
    /**
     * status 資料
     */
    boardData: {
      required: true,
      type: Object as PropType<Status>
    }
  },
  components: { DeleteTodoModal },
  data() {
    return {
      showToolList: false,
      deleteTodoModal: {} as Modal
    }
  },
  computed: {
    deadlineDateTransfer(): string {
      const date = new Date(this.todoItem.deadline)
      return date.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  },
  methods: {
    /**
     * 開啟編輯 modal
     * @public
     */
    openEditModal() {
      /**
       * 設定 modal 資料
       * @param {string} - 當時儲存的 session 名稱
       * @public
       */
      this.$emit('set-modal-data', this.todoItem.id)
    },
    /**
     * 開關刪除 modal
     * @param {boolean} - 是否開啟
     * @public
     */
    toggleDeleteModal(isShow: boolean) {
      isShow ? this.deleteTodoModal.show() : this.deleteTodoModal.hide()
    },
    /**
     * 複製 todo 並更新 statusList
     * @public
     */
    copyTodo() {
      const newIndex = setNewIndex('Copy', this.boardData.todoList)

      const copyTodo = {
        ...this.todoItem,
        id: generateRandomId(),
        title: `${this.todoItem.title} Copy${newIndex}`
      }

      this.updateStatus(copyTodo)
    },
    /**
     * 取得新 todoList 、更新 api
     * @public
     */
    updateStatus(newTodo: TodoItem) {
      const { todoList } = this.boardData
      todoList.push(newTodo)

      const updatedStatus = {
        ...this.boardData,
        todoList
      }

      api.putStatus('statusList', updatedStatus)
    }
  },
  mounted() {
    const currentId = this.todoItem.id
    const deleteTodoModalDom = document.getElementById(`deleteTodoModal${currentId}`) as HTMLElement
    this.deleteTodoModal = new Modal(deleteTodoModalDom, {
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
