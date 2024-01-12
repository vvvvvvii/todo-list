<template>
  <div class="card-header">
    <div>
      <h2 class="fs-4" v-show="!isEditMode">
        {{ boardData.title }}
      </h2>
      <div v-show="isEditMode">
        <input type="text" class="form-control edit-input mb-1 fs-4" :value="boardData.title"
          @keyup.enter="onEnterBoardName">
        <p class="fs-6 text-info">按下 enter 完成編輯</p>
      </div>
    </div>
    <div class="d-flex">
      <button class="btn" type="button" @click="toggleEditMode(true)">
        <i class="bi bi-pencil-square"></i>
      </button>
      <button class="btn" type="button" @click="toggleDeleteModal(true)">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts" type="module">
import { Status } from '@/types/Status'
import { defineComponent, PropType } from 'vue'
import api from '../service/api'
import store from '@/store/index'

/**
 * 狀態表頭 / 包含狀態名稱, 編輯欄位按鈕, 刪除按鈕
 */

export default defineComponent({
  name: 'BoardHeader',
  props: {
    /**
     * status 資料
     */
    boardData: {
      required: true,
      type: Object as PropType<Status>
    }
  },
  data() {
    return {
      isEditMode: false
    }
  },
  methods: {
    /**
     * 開關 boardName 的編輯欄位
     * @param {boolean} - 是否為編輯 mode
     * @public
     */
    toggleEditMode(isEditMode: boolean) {
      this.isEditMode = isEditMode
    },
    /**
     * 編輯 boardName 後按下 enter 執行更新，關閉編輯模式
     * @param {KeyboardEvent} -   抓 input.value
     * @public
     */
    async onEnterBoardName(e: KeyboardEvent) {
      const input = e.target as HTMLInputElement
      await this.updateBoard(input.value)
      store.dispatch('getStatusList')
      this.toggleEditMode(false)
    },
    /**
     * 更新 boardName ，如輸入空白值不與更新
     * @param {string} - 新名稱
     * @public
     */
    async updateBoard(newName: string) {
      if (!newName.trim()) return

      const newStatus = {
        ...this.boardData,
        title: newName
      }
      await api.putStatus('statusList', newStatus)
    },
    /**
     * 開關刪除 modal
     * @param {boolean} - 是否開啟
     * @public
     */
    toggleDeleteModal(isShow: boolean) {
      this.$emit('toggle-delete-status-modal', isShow)
    }
  }
})
</script>
<style lang="scss" scoped>
.edit-input {
  padding: .25rem .5rem;
  background: #fcf3a2;

  &:focus {
    background: #fcf3a2;
  }
}
</style>
