<template>
  <div class="details-page">
    <!-- General Information -->
    <section class="general-info">
      <h2>General Information</h2>
      <p><strong>Name:</strong> {{ item?.name }}</p>
      <p><strong>Description:</strong> {{ item?.description }}</p>
      <p><strong>Status:</strong> {{ item?.active ? 'Active' : 'Inactive' }}</p>
      <p><strong>Created At:</strong> {{ formatDate(item?.created_at) }}</p>
      <p><strong>Updated At:</strong> {{ formatDate(item?.updated_at) }}</p>
    </section>

    <!-- Approval Chain Levels -->
    <section class="approval-levels">
      <h2>Approval Chain Levels</h2>
      <div v-for="level in item?.approval_chain" :key="level?.id" class="level">
        <h3>Level {{ level?.approval_chain_level?.level_number }}</h3>
        <p><strong>Role:</strong> {{ level?.approval_chain_level?.approval_chain_role?.name }}</p>
        <!-- <p><strong>Role Status:</strong> {{ level?.approval_chain_level?.approval_chain_role?.past }}</p> -->
        <p><strong>Can Change Source:</strong> {{ level?.approval_chain_level?.can_change_source ? 'Yes' : 'No' }}</p>
        <p><strong>Created At:</strong> {{ formatDate(level?.created_at) }}</p>
        <p><strong>Updated At:</strong> {{ formatDate(level?.updated_at) }}</p>
        <p><strong>Assigned User ID:</strong> {{ level?.user }}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A' // Handle null or undefined dates
      const date = new Date(dateString)
      return date.toLocaleString()
    },
  },
}
</script>

<style scoped>
.details-page {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}

h2 {
  color: #555;
  margin-top: 20px;
}

h3 {
  color: #777;
  margin-top: 15px;
}

p {
  margin: 5px 0;
}

.level,
.role {
  background-color: #f9f9f9;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
