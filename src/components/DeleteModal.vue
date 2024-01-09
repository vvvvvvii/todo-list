<template>
  <div class="modal fade" :id="`deleteModal${statusId}`" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content py-3 text-center">
        <div class="modal-body">
          <p>是否確定刪除此狀態？下方待辦事項將一併被刪除</p>
        </div>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-outline-light-info" @click="closeModal()">取消</button>
          <button type="button" class="btn btn-primary border-info ms-2" @click="deleteStatusBoard">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" type="module">
import { defineComponent } from 'vue'
import api from '../service/api'

export default defineComponent({
  name: 'DeleteModal',
  props: {
    statusId: {
      required: true,
      type: String
    }
  },
  methods: {
    closeModal() {
      this.$emit('toggle-delete-modal', false)
    },
    deleteStatusBoard() {
      this.closeModal()
      api.deleteStatus('statusList', this.statusId)
      this.$emit('get-status-list')
    }
  }

})
</script>
