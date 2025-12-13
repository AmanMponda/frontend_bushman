<template>
  <form class="quota-form" @submit.prevent="submitForm">
    <div class="form-section">
      <div class="form-group">
        <label for="quota-name" class="form-label">Quota Name *</label>
        <input
          id="quota-name"
          v-model="form.name"
          type="text"
          class="form-control"
          placeholder="Enter quota name"
          required
        />
        <span v-if="errors.name" class="form-error">{{ errors.name }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="start-date" class="form-label">Start Date *</label>
          <input id="start-date" v-model="form.start_date" type="date" class="form-control" required />
          <span v-if="errors.start_date" class="form-error">{{ errors.start_date }}</span>
        </div>

        <div class="form-group">
          <label for="end-date" class="form-label">End Date *</label>
          <input id="end-date" v-model="form.end_date" type="date" class="form-control" required />
          <span v-if="errors.end_date" class="form-error">{{ errors.end_date }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          rows="3"
          placeholder="Enter optional description"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="status" class="form-label">Status</label>
        <select id="status" v-model="form.status" class="form-control">
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Expired">Expired</option>
        </select>
      </div>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="submitting">
        {{ submitting ? (editMode ? 'Updating...' : 'Creating...') : editMode ? 'Update Quota' : 'Create Quota' }}
      </button>
      <button type="button" class="btn btn-secondary" :disabled="submitting" @click="goBack">Cancel</button>
    </div>

    <div v-if="apiError" class="form-error-message">
      {{ apiError }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQuotaStore } from '../../../../stores/quota-store'
import handleErrors from '../../../../utils/errorHandler'

interface QuotaItem {
  id?: number
  name: string
  start_date: string
  end_date: string
  description?: string
  status?: string
}

interface FormErrors {
  name?: string
  start_date?: string
  end_date?: string
  description?: string
}

const props = withDefaults(
  defineProps<{
    editMode?: boolean
    editItem?: QuotaItem | null
  }>(),
  {
    editMode: false,
    editItem: null,
  },
)

const emit = defineEmits<{
  saved: []
  goBack: []
}>()

const form = ref<QuotaItem & { id?: number }>({
  id: undefined,
  name: '',
  start_date: '',
  end_date: '',
  description: '',
  status: 'Active',
})

const errors = ref<FormErrors>({})
const submitting = ref(false)
const apiError = ref('')

const quotaStore = useQuotaStore()

// Watch for editItem changes
watch(
  () => props.editItem,
  (newItem) => {
    if (newItem && props.editMode) {
      form.value = {
        id: newItem.id,
        name: newItem.name,
        start_date: newItem.start_date,
        end_date: newItem.end_date,
        description: newItem.description || '',
        status: newItem.status || 'Active',
      }
    }
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}
  apiError.value = ''

  if (!form.value.name || form.value.name.trim() === '') {
    errors.value.name = 'Quota name is required'
  }

  if (!form.value.start_date) {
    errors.value.start_date = 'Start date is required'
  }

  if (!form.value.end_date) {
    errors.value.end_date = 'End date is required'
  }

  if (form.value.start_date && form.value.end_date) {
    const startDate = new Date(form.value.start_date)
    const endDate = new Date(form.value.end_date)
    if (startDate > endDate) {
      errors.value.end_date = 'End date must be after start date'
    }
  }

  return Object.keys(errors.value).length === 0
}

async function submitForm() {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  try {
    const quotaData = {
      name: form.value.name,
      start_date: form.value.start_date,
      end_date: form.value.end_date,
      description: form.value.description,
      status: form.value.status,
    }

    if (props.editMode && form.value.id) {
      const response = await quotaStore.updateQuota({
        ...quotaData,
        id: form.value.id,
      })

      if (response.status === 200 || response.data?.success) {
        emit('saved')
      } else {
        apiError.value = response.data?.message || 'Failed to update quota'
      }
    } else {
      const response = await quotaStore.createQuota(quotaData)

      if (response.status === 201 || response.data?.success) {
        emit('saved')
      } else {
        apiError.value = response.data?.message || 'Failed to create quota'
      }
    }
  } catch (error) {
    const errorMessages = handleErrors(error)
    apiError.value = errorMessages.join(', ')
  } finally {
    submitting.value = false
  }
}

function goBack() {
  emit('goBack')
}
</script>

<style scoped>
.quota-form {
  max-width: 800px;
}

.form-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
  border-color: #545b62;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

.form-error-message {
  margin-top: 20px;
  padding: 12px 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 14px;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
