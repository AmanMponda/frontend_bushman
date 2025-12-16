<template>
  <div class="species-details">
    <h1 class="title">Sales Package Details</h1>

    <div class="header">
      <h2>Packages Name: {{ item.name || 'N/A' }}</h2>
      <p class="description"><strong>Description:</strong> {{ item.description || 'No description available' }}</p>
    </div>

    <div class="area-info">
      <h3>Area Information</h3>
      <p><strong>Area Name:</strong> {{ item.area?.name || 'N/A' }}</p>
      <p><strong>Area Description:</strong> {{ item.area?.description || 'No description available' }}</p>
      <!-- <p><strong>Address:</strong> {{ item.area?.address || 'N/A' }}</p>
      <p><strong>Location ID:</strong> {{ item.area?.location || 'N/A' }}</p> -->
    </div>

    <div class="regulatory-package-info">
      <h3>Licence Information</h3>
      <p><strong>Package Name:</strong> {{ item.regulatory_package?.name || 'N/A' }}</p>
      <p><strong>Duration:</strong> {{ item.regulatory_package?.duration || 'N/A' }} days</p>
      <p><strong>Created Date:</strong> {{ item.regulatory_package?.created_at || 'N/A' }}</p>
      <!-- <p><strong>Updated Date:</strong> {{ item.regulatory_package?.updated_date || 'N/A' }}</p>
      <p><strong>User ID:</strong> {{ item.regulatory_package?.user || 'N/A' }}</p> -->
    </div>

    <div class="va-table-responsive">
      <table class="va-table va-table--clickable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Species Name</th>
            <th>Scientific Name</th>
            <!-- <th>Description</th> -->
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="species in item.species" :key="species.id">
            <td>{{ species.id || 'N/A' }}</td>
            <td>{{ species.species?.name || 'N/A' }}</td>
            <td>{{ species.species?.scientific_name || 'N/A' }}</td>
            <!-- <td>{{ species.species?.description || 'No description available' }}</td> -->
            <td>{{ species.quantity !== null ? species.quantity : 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.species-details {
  font-family: 'Arial', sans-serif;
  /* max-width: 800px; */
  margin: auto;
  padding: 20px;
}

.title {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.area-info,
.regulatory-package-info {
  margin: 20px 0;
  padding: 10px;
  /* border: 1px solid #3498db; */
  border-radius: 5px;
  background-color: #eaf3f8;
}

h3 {
  color: #2980b9;
}

.description {
  font-size: 1em;
  margin: 10px 0;
  line-height: 1.5;
  color: #444;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

th {
  /* background-color: #3498db; */
  /* color: white; */
}

tr:nth-child(even) {
  /* background-color: #f2f2f2; */
}

td {
  color: #555;
}
</style>
