<template>
  <VaCard class="p-6">
    <!-- Form for Adding Species -->

    <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
      <div class="flex flex-col md:flex-row gap-2 justify-start">
        <VaButton v-if="!showQuotaList" class="px-2 py-2" icon="arrow_back" size="small" @click="showQuota">
          Go Back
        </VaButton>
      </div>
      <VaButtonGroup>
        <VaButton
          class="px-2 py-2"
          color="primary"
          label="Add New Quota"
          icon="add"
          size="small"
          @click="showAddQuotaModal()"
          >Add a New Quota</VaButton
        >
      </VaButtonGroup>
    </div>

    <ModuleTable
      v-if="showQuotaList"
      :items="items"
      :columns="columns"
      :loading="loadingQuotas"
      @onView="showQuota"
    ></ModuleTable>

    <div v-else class="p-2">
      <VaForm ref="sformRef" class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
          <VaValue :default-value="false">
            <VaSelect
              v-model="sform.salesQuota"
              :options="quotasOptions"
              label="Sales Quota"
              :rules="[(v: any) => !!v || 'Sales Quota is required']"
              placeholder="Select Sales Quota"
              @update:modelValue="getSpeciesItems"
            >
              <template #appendInner>
                <VaIcon name="av_timer" size="small" color="primary" />
              </template>
            </VaSelect>
          </VaValue>

          <VaSelect
            v-model="sform.area"
            label="Hunting Area"
            :options="areasOptions"
            placeholder="Select Hunting Area"
            :rules="[(v: any) => !!v || 'Hunting Area is required']"
            required
          />
        </div>

        <VaDivider orientation="left" class="py-12">
          <span caption class="px-2">Add a List of Species</span>
        </VaDivider>
        <!-- <h3 class="font-bold text-lg mb-4"></h3> -->

        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4">
              <VaSelect
                v-model="sform.id"
                label="Species"
                :options="speciesOptions"
                placeholder="Select Species"
                :rules="[(v: any) => !!v || 'Species is required']"
                required
                @update:modelValue="updateQuantitySelectedSpecies"
              />

              <VaCounter v-model="sform.quantity" label="Quantity" manual-input :min="1" :max="100" />
            </div>
          </div>
          <VaButtonGroup>
            <VaButton
              class="px-0 py-0"
              color="primary"
              icon="add"
              size="small"
              round
              @click="addNewSpeciesItemToStorage()"
            />
          </VaButtonGroup>
        </div>
      </VaForm>

      <div class="mb-6">
        <VaList>
          <VaListLabel v-if="speciesObjects.length > 0" class="text-md mb-2 text-left">Selected Species</VaListLabel>
          <VaListItem v-for="(s, index) in speciesObjects" :key="index" class="list__item">
            <VaListItemSection>
              <VaListItemLabel>
                Name: {{ s.name }}
                <VaIcon name="delete" size="small" color="primary" @click="deleteFromStorage(index)" />
              </VaListItemLabel>
              <VaListItemLabel caption>Quantity: {{ s.quantity }}</VaListItemLabel>
            </VaListItemSection>
          </VaListItem>
        </VaList>
      </div>

      <div class="mb-6">
        <VaButton
          :disabled="!isValidSForm"
          color="primary"
          :loading="savingQuotaSpecies"
          icon="save"
          icon-color="#fff"
          @click="validateSForm() && addNewSpeciesToQuota()"
        >
          save
        </VaButton>
      </div>
    </div>

    <VaModal
      v-model="showModal"
      z-index="1"
      :overlay="false"
      ok-text="Save"
      size="small"
      @ok="validateForm() && createNewQuota()"
    >
      <VaForm ref="formRef" class="p-6">
        <h3 class="font-bold text-lg mb-4">Add Quota</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="form.name"
            label="Name"
            placeholder="Enter Quota Name"
            type="text"
            :rules="[(v: any) => !!v || 'Name is required']"
            required
          />

          <VaDateInput
            v-model="form.start_date"
            label="Start Date"
            :rules="[(v: any) => !!v || 'Start Date is required']"
            manual-input
            placeholder="Select a date"
          />

          <VaDateInput
            v-model="form.end_date"
            label="End Date"
            :rules="[(v: any) => !!v || 'End Date is required']"
            manual-input
            placeholder="Select a date"
          />
        </div>
        <div class="mb-4">
          <VaButton
            :loading="savingQuota"
            :disabled="!isValidForm || savingQuota"
            color="primary"
            @click="createNewQuota()"
            >Save</VaButton
          >
        </div>
      </VaForm>
    </VaModal>
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
import { useSettingsStore } from '../../stores/settings-store'

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
    const sformRef = ref(null) as any

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const columns = [
      { key: 'id', sortable: true, sortingOptions: ['desc', 'asc'] },
      { key: 'name', sortable: true },
      { key: 'start_date', sortable: true },
      { key: 'end_date', sortable: true },
      { key: 'actions', width: 80 },
    ]

    const {
      isValid: isValidSForm,
      validate: validateSForm,
      resetValidation: resetValidationSForm,
      reset: resetSForm,
    } = useForm(sformRef)

    // Make sure to use `isValidForm`, `validateForm`, and `resetValidationForm` in your component logic as needed
    return {
      isValidForm, // Ensure this is utilized somewhere
      validateForm, // Ensure this is utilized somewhere
      resetValidationForm, // Ensure this is utilized somewhere
      isValidSForm,
      validateSForm,
      resetValidationSForm,
      resetForm,
      resetSForm,
      formRef,
      sformRef,
      columns,
    }
  },
  data() {
    const items: [] = []

    // const { isValid, validate, reset, resetValidation } = useForm(formRef)
    const form = reactive({
      id: null,
      name: '',
      start_date: null as any,
      end_date: null as any,
      description: '',
    })

    const sform = reactive({
      id: null as any,
      quantity: 1,
      salesQuota: null as any,
      area: null as any,
    })

    const quotasOptions = [] as any

    return {
      items,
      editedItemId: null,
      editedItem: null,
      createdItem: { ...defaultItem },
      toast: useToast(), // Initialize useToast here

      form,
      sform,
      speciesOptions: [] as any,
      areasOptions: [] as any,
      speciesObjects: [] as any,
      showModal: false,
      quotasOptions,
      showQuotaList: true,
      quotaItems: [] as any,
      savingQuotaSpecies: false,
      loadingQuotas: false,
      savingQuota: false,
    }
  },

  mounted() {
    this.getQs()
    this.getSpeciesItems()
    this.getAreas()
  },

  methods: {
    ...mapActions(useQuotaStore, [
      'getQuotas',
      'createQuota',
      'updateQuota',
      'deleteQuota',
      'getSpeciesList',
      'getAreaList',
      'generateQuotaYear',
      'createQuotaAreaSpecies',
    ]),

    ...mapActions(useSettingsStore, ['getLicenceRegulatoryHuntingPackageSpecies']),

    resetEditedItem() {
      this.editedItem = null
      this.editedItemId = null
    },
    resetCreatedItem() {
      this.createdItem = { ...defaultItem }
    },

    showAddQuotaModal() {
      // this.$refs.sformRef.show()
      this.showModal = !this.showModal
    },
    showQuota(e: any) {
      this.showQuotaList = !this.showQuotaList
      this.sform.salesQuota = {
        value: e.id,
        text: this.generateQuotaYear(e.start_date, e.end_date) + ` - ${e.name}`,
      }
      this.getSpeciesItems()
    },

    updateQuantitySelectedSpecies(species: any) {
      this.sform.quantity = species.quantity
    },

    addNewSpeciesItemToStorage() {
      // Check if all required fields in this.sform are not null
      if (!this.sform.id || !this.sform.id.value || !this.sform.id.text || !this.sform.quantity) {
        console.error('Error: Some required fields are null or undefined.')
        return // Exit the method if any field is null
      }

      // Ensure quantity is a positive number
      if (Number(this.sform.quantity) <= 0) {
        // Uncomment the toast message if needed
        // this.toast.init({
        //   message: 'Quantity must be greater than zero.',
        //   color: 'warning',
        // });
        return
      }

      // Check if the species item already exists
      const exists = this.speciesObjects.some((species: { id: any }) => species.id === this.sform.id.value)

      if (!exists) {
        this.speciesObjects.push({
          id: this.sform.id.value,
          name: this.sform.id.text,
          quantity: this.sform.quantity,
        })
        console.log('New species item added:', this.speciesObjects)
      } else {
        console.log('Species item already exists:', this.sform.id)
      }

      // this.resetSForm()
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
    },

    // async getLicencePackageSpecies() {
    //   console.log('Getting species items for the selected sales quota', this.sform.salesQuota.value)

    //   try {
    //     const response = await this.getLicenceRegulatoryHuntingPackageSpecies({
    //       quotaId: this.sform.salesQuota.value,
    //     })
    //     const speciesItems = response.data.map((item: any) => {
    //       //  update the selected species quantity
    //       this.sform.quantity = item.quantity
    //       return {
    //         value: item.species.id,
    //         text: item.species.name,
    //         quantity: item.quantity,
    //       }
    //     })
    //     this.speciesOptions = speciesItems
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },

    async addNewSpeciesToQuota() {
      this.savingQuotaSpecies = true
      if (this.speciesObjects.length === 0) {
        this.toast.init({ message: 'Please add at least one species item.', color: 'warning' })
        return
      }
      const rdata = {
        area_id: this.sform.area.value,
        quota_id: this.sform.salesQuota.value,
        speciesObjects: this.speciesObjects,
      }

      try {
        const response = await this.createQuotaAreaSpecies(rdata)
        if (response.status === 201) {
          this.savingQuotaSpecies = false
          this.toast.init({ message: response.data.message, color: 'success' })
          this.resetSForm()
          this.resetCreatedItem()
          this.speciesObjects = []
        }
      } catch (error) {
        const errors = handleErrors(error)
        this.savingQuotaSpecies = false

        this.toast.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },
    async createNewQuota() {
      this.savingQuota = true
      const quota = {
        name: this.form.name,
        start_date: this.form.start_date,
        end_date: this.form.end_date,
        description: this.form.description,
      }

      try {
        const response = await this.createQuota(quota)
        if (response.status === 201) {
          this.savingQuota = false
          this.toast.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.getQs()
          this.showAddQuotaModal()
          this.resetCreatedItem()
        } else {
          const errors = handleErrors(response)
          this.toast.init({
            message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          })
        }
      } catch (error) {
        this.savingQuota = false
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
    async editItem() {
      // this.items = [
      //   ...this.items.slice(0, this.editedItemId),
      //   { ...this.editedItem },
      //   ...this.items.slice(this.editedItemId + 1),
      // ]
      // this.resetEditedItem()
      console.log(this.editedItem)
      try {
        const data = {
          id: this.form.id,
          name: this.form.name,
          start_date: this.formatDate(new Date(this.form.start_date)), // Format the start date
          end_date: this.formatDate(new Date(this.form.end_date)),
          // description: this.form.description,
        }
        const response = await this.updateQuota(data)
        if (response.status === 200) {
          // const data = response.data
          this.getQs(null)
          this.toast.init({ message: response.data.message, color: 'success' })
          this.resetEditedItem()
        }
      } catch (error) {
        const errors = handleErrors(error)
        console.log(error)
        this.toast.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },

    async getQs(id = null) {
      this.loadingQuotas = true
      try {
        const response = await this.getQuotas(id)
        if (response.status === 200) {
          const data = response.data
          this.loadingQuotas = false

          this.quotasOptions = data.map((item: any) => {
            const result = this.generateQuotaYear(item.start_date, item.end_date)

            // this.sform.salesQuota = {
            //   value: item.id,
            //   text: `${result} - ${item.name}`,
            // }

            return {
              value: item.id,
              text: `${result} - ${item.name}`,
            }
          })
          this.items = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            start_date: item.start_date,
            end_date: item.end_date,
          }))
        }
      } catch (error) {
        this.loadingQuotas = false
        console.log(error)
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Add the species items from the response
        const speciesItems = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },

    async getAreas() {
      try {
        const response = await this.getAreaList()
        this.areasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
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
