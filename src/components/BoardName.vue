<template>
  <div>
    <h2 class="fs-4" v-show="!isEditMode">
      {{ boardData.name }}
    </h2>
    <div v-show="isEditMode">
      <input type="text" class="form-control edit-input mb-1 fs-4" :value="boardData.name"
        @keyup.enter="onEnterBoardName">
      <p class="fs-6 text-info">按下 enter 完成編輯</p>
    </div>
  </div>
</template>

<script lang="ts" type="module">
import { Status } from '@/types/Status'
import { defineComponent, PropType } from 'vue'
import api from '../service/api'

export default defineComponent({
  name: 'BoardItem',
  props: {
    boardData: {
      required: true,
      type: Object as PropType<Status>
    },
    isEditMode: {
      required: true,
      type: Boolean
    }
  },
  methods: {
    onEnterBoardName(e: KeyboardEvent) {
      const input = e.target as HTMLInputElement
      this.updateBoard(input.value)
      this.$emit('toggleEditMode', false)
      this.getStatusList()
    },
    updateBoard(newName: string) {
      const newStatus = {
        ...this.boardData,
        name: newName
      }
      api.putStatus('statusList', newStatus)
    },
    getStatusList() {
      this.$emit('get-status-list')
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
