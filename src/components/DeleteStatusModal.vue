<template>
  <div class="modal fade" :id="`deleteStatusModal${statusId}`" tabindex="-1">
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
import store from '@/store/index'

/**
 * 刪除狀態 Modal
 */

export default defineComponent({
  name: 'DeleteStatusModal',
  props: {
    /**
     * 欲刪除狀態之 id
     */
    statusId: {
      required: true,
      type: String
    }
  },
  methods: {
    /**
     * 關閉刪除 modal
     * @public
     */
    closeModal() {
      /**
       * 開關 delete status modal
       *
       * @property {boolean} 是否開啟
       */
      this.$emit('toggle-delete-status-modal', false)
    },
    /**
     * 關閉 modal 、刪除指定 status 、取得新列表
     * @public
     */
    async deleteStatusBoard() {
      this.closeModal()
      await api.deleteStatus('statusList', this.statusId)
      store.dispatch('getStatusList')
    }
  }
})
</script>
