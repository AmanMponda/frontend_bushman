<template>
  <h2>Hunting Price Matrix</h2>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Failed to load data.</div>
  <table v-else>
    <thead>
      <tr>
        <th>Hunting Type</th>
        <th v-for="pkg in salesPackages" :key="pkg">{{ pkg }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(type, index) in huntingTypes" :key="index">
        <td>{{ type }}</td>
        <td v-for="pkg in salesPackages" :key="pkg">
          {{ matrix[type][pkg] ?? '-' }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const error = ref(false)
const matrix = ref({})
const huntingTypes = ref([])
const salesPackages = ref([])

onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1.0/price-lists')
    const data = await res.json()
    matrix.value = data.matrix
    huntingTypes.value = Object.keys(matrix.value)
    salesPackages.value = [...new Set(huntingTypes.value.flatMap((type) => Object.keys(matrix.value[type])))]
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
th {
  background-color: #f0f0f0;
}
</style>
