<template>
  <VaCard class="p-6">
    <!-- Form for Adding Species -->

    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton
          v-if="!showHuntingAreaList"
          class="px-2 py-2"
          icon="arrow_back"
          size="small"
          @click="toggleFormAndList()"
        >
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup v-if="showHuntingAreaList">
        <VaButton
          class="px-2 py-2"
          color="primary"
          label="Add New Quota"
          icon="add"
          size="small"
          @click="toggleFormAndList()"
          >Add a New Hunting Area</VaButton
        >
      </VaButtonGroup>
    </div>

    <ModuleTable
      v-if="showHuntingAreaList"
      :items="items"
      :columns="columns"
      :loading="loading"
      @onView="showHuntingArea"
    ></ModuleTable>

    <div v-else class="p-2">
      <VaForm ref="areaFormRef" class="mb-6">
        <h3 class="font-bold text-lg mb-2">Hunting are details</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="areaForm.name"
            label="Name"
            placeholder="Enter Hunting Area Name"
            :rules="[(v: any) => !!v || 'Hunting Area Name is required']"
            required
          />

          <VaInput
            v-model="areaForm.description"
            type="textarea"
            label="Description"
            placeholder="Enter Hunting Area Description"
            :rules="[(v: any) => !!v || 'Hunting Area Description is required']"
            required
          />
        </div>

        <h3 class="font-bold text-lg mb-2">Area Location</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="areaForm.lat"
            label="Latitude"
            type="text"
            placeholder="Enter Hunting Area Latitude eg. 12.3456789"
            :rules="[(v: any) => !!v || 'Latitude is required']"
            required
          />

          <VaInput
            v-model="areaForm.lng"
            label="Longitude"
            placeholder="Enter Hunting Area Longitude eg. 12.3456789"
            type="text"
            :rules="[(v: any) => !!v || 'Longitude is required']"
            required
          />
        </div>
      </VaForm>

      <div class="mb-6">
        <VaButton
          :disabled="!isValidareaForm"
          color="primary"
          icon="save"
          :loading="saving"
          icon-color="#fff"
          @click="validateareaForm() && createNewHuntingArea()"
        >
          Save
        </VaButton>
      </div>
    </div>
  </VaCard>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useQuotaStore } from '../../stores/quota-store'
import { mapActions } from 'pinia'
import { reactive } from 'vue'
import { useToast, useForm } from 'vuestic-ui'
import handleErrors from '../../utils/errorHandler'
import ModuleTable from './components/ModuleTable.vue'
import { useHuntingAreaStore } from '../../stores/hunting-story'

const defaultItem = {
  name: '',
  start_date: null,
  end_date: null,
  // description: '',
}

export default defineComponent({
  name: 'QuotaPage',
  components: {
    ModuleTable,
  },

  setup() {
    const formRef = ref(null) as any
    const areaFormRef = ref(null) as any

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const {
      isValid: isValidareaForm,
      validate: validateareaForm,
      resetValidation: resetValidationareaForm,
      reset: resetareaForm,
    } = useForm(areaFormRef)

    return {
      isValidForm, // Ensure this is utilized somewhere
      validateForm, // Ensure this is utilized somewhere
      resetValidationForm, // Ensure this is utilized somewhere
      isValidareaForm,
      validateareaForm,
      resetValidationareaForm,
      resetForm,
      resetareaForm,
      formRef,
      areaFormRef,
    }
  },
  data() {
    const items: [] = []

    const areaForm = reactive({
      id: null as any,
      name: null as any,
      description: '',
      lat: null,
      lng: null,
      location: null as any,
    })

    const columns = [
      { key: 'name', sortable: true },
      { key: 'description', sortable: true },
      { key: 'lat', label: 'Latitude', sortable: false },
      { key: 'lng', label: 'Longitude', sortable: false },
    ]

    const quotasOptions = [] as any

    return {
      items,
      columns,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(),
      areaForm,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      speciesObjects: [] as any,
      showCreatenewForm: false,
      quotasOptions,
      showHuntingAreaList: true,
      quotaItems: [] as any,
      saving: false,
      loading: false,
    }
  },

  mounted() {
    // this.getQs()
    // this.getSpeciesItems()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useHuntingAreaStore, ['createHuntingArea']),

    toggleFormAndList() {
      this.showHuntingAreaList = !this.showHuntingAreaList
      this.getAreas()
    },

    showHuntingArea() {
      this.showHuntingAreaList = !this.showHuntingAreaList
    },

    async createNewHuntingArea() {
      this.saving = true
      const coordinates = [
        {
          lat: this.areaForm.lat,
          lng: this.areaForm.lng,
        },
      ]
      const requestData = {
        name: this.areaForm.name,
        description: this.areaForm.description,
        coordinates: coordinates,
      }
      try {
        const response = await this.createHuntingArea(requestData)
        if (response.status === 201) {
          this.saving = false
          this.toast.init({
            message: 'Hunting Area created successfully',
            color: 'success',
          })
          this.resetareaForm()
        } else {
          // console.log(requestData);
          console.log(response)
        }
      } catch (error) {
        this.saving = false
        const errors = handleErrors(error)
        this.toast.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    formatDate(date: Date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    async getAreas() {
      try {
        this.loading = true
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        interface Item {
          id: string
          name: string
          description: string
          location?: {
            geo_coordinates?: {
              coordinates?: string
            }
          }
        }

        if (response.status === 200) {
          this.items = response.data.map((item: Item) => {
            const coords = JSON.parse(item?.location?.geo_coordinates?.coordinates || '[]')
            return {
              id: item?.id,
              name: item?.name,
              description: item?.description,
              lat: coords[0]?.lat,
              lng: coords[0]?.lng,
            }
          })

          this.loading = false
        } else {
          this.loading = false
          this.toast.init({
            message: 'No hunting areas found',
            color: 'info',
          })
        }
      } catch (error: any) {
        this.loading = false
      }
    },
  },
})
</script>

<style lang="scss">
.modal-content {
  padding: 16px; /* Add padding around content */
}

.input-group {
  margin-bottom: 16px; /* Space between input fields */
}

.input-label {
  margin-bottom: 8px; /* Space between label and input */
  font-weight: bold; /* Make the label bold for clarity */
}

/* Flexbox for horizontal alignment of date inputs */
.input-container {
  display: flex;
  align-items: center; /* Align items vertically centered */
}

.input-container > VaDateInput {
  margin-right: 8px; /* Space between start date and end date */
}

.input-container > VaInput {
  flex: 1; /* Let the input take the remaining space */
}
</style>
