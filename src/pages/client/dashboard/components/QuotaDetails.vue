<template>
  <div class="quota-detail-page">
    <div class="panel br-6 p-4">
      <div class="panel-heading mb-4">
        <button class="btn btn-secondary" @click="goBack"><i class="fa fa-arrow-left"></i> Back to List</button>
      </div>
      <div class="quota-details">
        <h3 class="mb-4">{{ quota?.name }}</h3>
        <div class="details-grid">
          <div class="detail-item">
            <strong>Start Date:</strong>
            <p>{{ formatDate(quota?.start_date) }}</p>
          </div>
          <div class="detail-item">
            <strong>End Date:</strong>
            <p>{{ formatDate(quota?.end_date) }}</p>
          </div>
          <div class="detail-item">
            <strong>Status:</strong>
            <p>
              <span class="badge" :class="getStatusClass(quota?.status)">
                {{ quota?.status || 'Active' }}
              </span>
            </p>
          </div>
          <div v-if="quota?.description" class="detail-item">
            <strong>Description:</strong>
            <p>{{ quota.description }}</p>
          </div>
        </div>

        <!-- Quota Statistics -->
        <div v-if="quotaStats" class="mt-6 pt-6 border-top">
          <h4 class="mb-4">Quota Statistics</h4>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Quota Balance</div>
              <div class="stat-value">{{ quotaStats.total_quota_balance }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Available Quota</div>
              <div class="stat-value">{{ quotaStats.available_quota }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Confirmed</div>
              <div class="stat-value">{{ quotaStats.confirmed }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Utilisation Rate</div>
              <div class="stat-value">{{ quotaStats.utilisation_percentage }}%</div>
            </div>
          </div>
        </div>

        <!-- Detailed Data Table -->
        <div v-if="detailedData && detailedData.length > 0" class="mt-6 pt-6 border-top">
          <h4 class="mb-4">Species Breakdown</h4>
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Species</th>
                  <th>Allocation</th>
                  <th>Confirmed</th>
                  <th>Provisioned</th>
                  <th>Taken</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in detailedData" :key="item.id">
                  <td>{{ item.area }}</td>
                  <td>{{ item.name }}</td>
                  <td class="text-center">{{ item.no_of_species }}</td>
                  <td class="text-center">
                    <span class="badge badge-success">{{ item.confirmed }}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-warning">{{ item.provision_sales }}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge badge-info">{{ item.taken }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

interface QuotaItem {
  id?: number
  name: string
  start_date: string
  end_date: string
  description?: string
  status?: string
}

interface QuotaStats {
  total_quota_balance: number
  available_quota: number
  confirmed: number
  provisioned: number
  cancelled: number
  taken: number
  total_allocated: number
  utilisation_percentage: number
}

interface DetailedDataItem {
  id: number
  area: string
  name: string
  scientific_name: string
  no_of_species: number
  provision_sales: number
  confirmed: number
  cancelled: number
  taken: number
}

export default defineComponent({
  name: 'QuotaDetails',
  props: {
    quota: {
      type: Object as PropType<QuotaItem | null>,
      default: null,
    },
    quotaStats: {
      type: Object as PropType<QuotaStats | null>,
      default: null,
    },
    detailedData: {
      type: Array as PropType<DetailedDataItem[]>,
      default: () => [],
    },
  },

  emits: ['goBack'],

  methods: {
    formatDate(date: string | null | undefined): string {
      if (!date) return '-'
      try {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      } catch {
        return '-'
      }
    },

    getStatusClass(status?: string): string {
      const s = (status || 'Active').toLowerCase()
      if (s === 'active') return 'badge-success'
      if (s === 'inactive') return 'badge-secondary'
      if (s === 'expired') return 'badge-danger'
      return 'badge-info'
    },

    goBack() {
      this.$emit('goBack')
    },
  },
})
</script>

<style scoped>
.quota-detail-page {
  padding: 20px;
}

.panel {
  background: white;
  border: 1px solid #e9ecef;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.br-6 {
  border-radius: 6px;
}

.p-4 {
  padding: 2rem;
}

.panel-heading {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 10px;
}

.quota-details h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 20px 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.detail-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item strong {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-size: 14px;
}

.detail-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-secondary {
  background-color: #e2e3e5;
  color: #383d41;
}

.badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.badge-info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.badge-warning {
  background-color: #fff3cd;
  color: #856404;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  padding: 20px;
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border-radius: 6px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 600;
}

.border-top {
  border-top: 1px solid #e9ecef;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.table td {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
}

.table tbody tr:hover {
  background: #f8f9fa;
}

.table-striped tbody tr:nth-child(odd) {
  background: #ffffff;
}

.table-striped tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.text-center {
  text-align: center;
}

.btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f9fa;
  color: #333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover {
  background: #545b62;
  border-color: #545b62;
}

.mt-6 {
  margin-top: 2rem;
}

.pt-6 {
  padding-top: 2rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
