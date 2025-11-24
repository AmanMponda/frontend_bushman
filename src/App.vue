<template>
  <div id="app">
    <div v-if="isLoading" class="loader">
      <div class="spinner"></div>
      <div class="loader-text">
        <h3>Loading...</h3>
        <p>Please wait while the page is loading.</p>
      </div>
    </div>
    <RouterView v-else />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
// import { mapActions } from 'pinia'
// import { useAuthStore } from './stores/auth-store'

export default defineComponent({
  name: 'App',
  components: {
    // RouterView,
  },
  setup() {
    const isLoading = ref(true)

    onMounted(() => {
      setTimeout(() => {
        isLoading.value = false
      }, 2000)
    })

    return {
      isLoading,
    }
  },
})
</script>

<style lang="scss">
#app {
  font-family: 'Inter', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 20rem;
}

.loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 1000; // Ensure the loader is above other content
}

.spinner {
  width: 4rem;
  height: 4rem;
  border: 5px solid rgba(0, 0, 0, 0.1);
  border-top: 5px solid #5c4033;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loader-text {
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
