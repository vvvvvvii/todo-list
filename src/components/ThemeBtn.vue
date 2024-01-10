<template>
  <!-- change theme btn -->
  <div class="btn-group" role="group">
    <button type="button" class="btn" :class="sunBtn" @click="toggleThemeColor('light')">
      <i class="bi" :class="sunBtnIcon"></i>
    </button>
    <button type="button" class="btn" :class="moonBtn" @click="toggleThemeColor('dark')">
      <i class="bi" :class="moonBtnIcon"></i>
    </button>
  </div>
</template>

<script lang="ts" type="module">

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ThemeBtn',
  data() {
    return {
      themeColor: 'light'
    }
  },
  methods: {
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
