<template>
  <VaInnerLoading :loading="loadingSales">
    <VaForm ref="iformRef">
      <!-- <h3 class="font-bold text-lg mb-2">Hunting Game Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <VaSelect
          v-model="form.entity_contract_permit"
          :options="contractPermitOptions"
          :rules="[(value: any) => value || 'Sales is required']"
          placeholder="Select confirmation "
          label="Choose sales confirmation"
          @update:modelValue="onValueChange"
        />
        <VaDateInput
          v-model="form.start_date"
          placeholder="Choose start date"
          :rules="[(value: any) => value || 'Start date is required']"
          label="Start Date"
        />
        <VaDateInput
          v-model="form.end_date"
          placeholder="Choose charter in date"
          :rules="[(value: any) => value || 'Arrival Date is required']"
          label="Charter In Date"
        />
        <VaSelect
          v-model="form.professional_hunters_ids"
          label="PH"
          :options="phOptions"
          multiple
          max-selections="2"
          :rules="[(value: any) => value || 'PH is required']"
          placeholder="Select PH"
        />
      </div>
      <VaDivider /> -->
      <!-- isAddGameActivities: false, 
          -->

      <!-- <VaCheckbox v-model="isAddGameActivities" label="Add Game Activities" @input="addGameActivities" /> -->

      <VaAlert color="info" outline class="mb-6">
        <h3 class="font-bold text-lg mb-2">Add Game Activities</h3>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <!-- lat -->
          <VaInput
            v-model="form.lat"
            :rules="[(value: any) => value || 'Latitude is required']"
            type="number"
            placeholder="Enter Latitude"
            label="Latitude"
          />
          <!-- long -->
          <VaInput
            v-model="form.lng"
            :rules="[(value: any) => value || 'Longitude is required']"
            type="number"
            placeholder="Enter Longitude"
            label="Longitude"
          />
          <!-- area -->
          <VaSelect
            v-model="form.area_id"
            :rules="[(value: any) => value || 'Area is required']"
            :options="areaOptions"
            placeholder="Select Area"
            label="Area"
          />

          <!-- time -->
          <VaDateInput
            v-model="form.date"
            :rules="[(value: any) => value || 'Date is required']"
            placeholder="wounded/killed date"
            label="Date"
          />
          <VaTimeInput
            v-model="form.time"
            :rules="[(value: any) => value || 'Time is required']"
            clearable
            label="Time"
            placeholder="Wounded/Killed Time"
          />
          <!-- weapon -->
          <VaInput
            v-model="form.weapon_used"
            :rules="[(value: any) => value || 'Weapon is required']"
            type="number"
            placeholder="weapon used"
            label="Weapon Used"
          />
          <!-- spacies -->
          <VaSelect
            v-model="form.spacies_gender"
            :rules="[(value: any) => value || 'Gender is required']"
            :options="genderOptions"
            placeholder="Select Gender"
            label="Gender"
          />
          <!-- status -->
          <VaSelect
            v-model="form.status"
            :rules="[(value: any) => value || 'Status is required']"
            :options="statusOptions"
            placeholder="Select Status"
            label="Status"
          />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaSelect
            v-model="form.species"
            label="Species"
            :options="speciesOptions"
            placeholder="Select Species"
            required
          />

          <VaCounter v-model="form.quantity" label="Quantity" manual-input :min="1" :max="1" />
          <VaTextarea
            v-model="form.description"
            max-length="125"
            label="Short text about something"
            counter
            required-mark
            :rules="[(v: any) => (v && v.length > 0) || 'Required', (v: any) => v && v.length < 125]"
          />
        </div>
        <!-- <div class="flex justify-end">
          <VaButton class="px-0 py-0" color="primary" icon="add" size="small" @click="createGameListObject()" />
        </div>

        <div class="mt-1">
          <VaList>
            <VaListLabel v-if="games.length > 0" class="text-md mb-2 text-left">Games</VaListLabel>
            <VaListLabel v-else color="secondary" class="va-text-code mb-2 text-left">No Game Added</VaListLabel>

            <VaDataTable :items="games" :columns="columns">
              <template #cell(status)="{ value }">
                <strong>{{ value }}</strong>
              </template>
              <template #cell(actions)="{ rowData }">
                <VaButton size="small" color="error" icon="delete" @click="deleteFromStorage(games.indexOf(rowData))" />
              </template>
            </VaDataTable>
          </VaList>
        </div> -->
      </VaAlert>

      <div class="flex justify-end">
        <VaButton
          :loading="sendingData"
          class="p-2 m-2"
          :disabled="!isValidForm || sendingData"
          icon="save"
          @click="validateForm() && onSubmit('IN_PROGRESS')"
          >Save</VaButton
        >
        <VaButton
          :loading="sendingData"
          class="p-2 m-2"
          :disabled="!isValidForm || sendingData"
          icon="save"
          color="warning"
          @click="validateForm() && saveAndClose()"
        >
          Save and close the game activities</VaButton
        >
      </div>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts">
import { useForm } from '@/composables/useForm'
import { useToast } from '@/composables/useToast'
import { defineComponent, ref, reactive } from 'vue'
import { mapActions } from 'pinia'
import handleErrors from '../../../../utils/errorHandler'
import { useSalesInquiriesStore } from '../../../../stores/sales-store'
import { useGameStore } from '../../../../stores/game-store'
import { useQuotaStore } from '../../../../stores/quota-store'
import { useContractsStore } from '../../../../stores/contracts-store'
import { format } from 'date-fns'
import { useSettingsStore } from '../../../../stores/settings-store'

export default defineComponent({
  props: {
    activityData: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const { init } = useToast()

    const iformRef = ref(null as any)
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm()

    const isNotUpBookingSelected = ref(true)

    const onInputChange = (event: any) => {
      console.log(event)
      if (event.value == 'prior' || event.value == 'after') {
        isNotUpBookingSelected.value = false
      }
    }

    const form = reactive({
      // entity_contract_permit: null as any,
      // start_date: null as any,
      // end_date: null as any,
      description: '',
      // professional_hunters_ids: [] as any,
      lat: null as any,
      lng: null as any,
      species: null as any,
      quantity: 1,
      area_id: null as any,
      time: null as any,
      date: null as any,
      weapon_used: null as any,
      spacies_gender: null as any,
      status: null as any,
    })

    return {
      iformRef,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      form,
      init,
      onInputChange,
      isNotUpBookingSelected,
    }
  },

  data() {
    const columns = [
      { key: 'species_id' },
      { key: 'quantity' },
      { key: 'time' },
      { key: 'date' },
      { key: 'weapon_used', label: 'weapon used' },
      { key: 'spacies_gender' },
      { key: 'status' },
      { key: 'actions', width: 80 },
    ]
    const packages = [] as any
    return {
      packages,
      installments: [] as any,
      regulatoryPackages: [] as any,
      contractPermitOptions: [] as any,
      loadingSales: false,
      salesItem: null as any,
      games: [] as any,
      client_id: null as any,

      areaOptions: [] as any,
      speciesOptions: [] as any,
      columns,
      statusOptions: [
        { text: 'WOUNDED', value: 'WOUNDED' },
        { text: 'KILLED', value: 'KILLED' },
      ],
      isAddGameActivities: false,

      // ['M', 'F']
      genderOptions: [
        { text: 'M', value: 'M' },
        { text: 'F', value: 'F' },
      ],

      phOptions: [] as any,
      sendingData: false,
      sendingSaveClose: false,
    }
  },
  computed: {},

  mounted() {
    this.getPermitOptions()
    this.getSpeciesListOptions()
    this.getAreaListOptions()
    this.getPhVsetOptions()
    console.log(this.activityData)
  },

  methods: {
    ...mapActions(useGameStore, ['iniateandOrSaveGameActivity']),
    ...mapActions(useContractsStore, ['getContractPermits']),
    ...mapActions(useSalesInquiriesStore, ['getallSalesConfirmation']),
    ...mapActions(useQuotaStore, ['getSpeciesList', 'getAreaList']),
    ...mapActions(useSettingsStore, ['getPhVset']),
    onValueChange(value: any) {
      if (value) {
        this.client_id = value.selfitem.entity_contract.sales_confirmation_proposal.sales_inquiry.entity.id
      }
    },

    addGameActivities() {
      this.isAddGameActivities = !this.isAddGameActivities
      if (this.isAddGameActivities == false) {
        this.games = []
      }
    },
    async onSubmit(gameState: any) {
      this.sendingData = true
      // pass empty ph b'cause already added them on the main tables
      const professional_hunters_ids: any = []
      const data = {
        entity_contract_permit_id: this.activityData.entity_contract_permit.id,
        client_id: this.activityData.client.id,
        professional_hunters_ids: professional_hunters_ids,
        // games: this.games,
        game_state: gameState,
        coordinates_type: 'Point',
        coordinates: [
          {
            lat: this.form.lat,
            lng: this.form.lng,
          },
        ],
        species_id: this.form.species?.value,
        quantity: this.form.quantity,
        area_id: this.form.area_id?.value,
        time: format(this.form.time, 'HH:mm'),
        date: format(this.form.date, 'yyyy-MM-dd'),
        weapon_used: this.form.weapon_used,
        description: this.form.description,
        spacies_gender: this.form.spacies_gender.value,
        status: this.form.status.value,
      }

      try {
        const response: any = await this.iniateandOrSaveGameActivity(data)
        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.sendingData = false
          this.sendingSaveClose = false
        }
      } catch (error: any) {
        this.sendingData = false
        this.sendingSaveClose = false

        const errors = handleErrors(error.response)
        console.log(error)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
    },
    saveAndClose() {
      this.sendingSaveClose = true
      this.onSubmit('CLOSED')
    },

    createGameListObject() {
      if (
        !this.form.species ||
        !this.form.area_id ||
        !this.form.lat ||
        !this.form.lng ||
        !this.form.time ||
        !this.form.date ||
        !this.form.weapon_used ||
        !this.form.spacies_gender ||
        !this.form.status
      ) {
        this.init({ message: 'All fields are required', color: 'warning' })
        return
      }

      const gameObj = {
        coordinates_type: 'Point',
        coordinates: [
          {
            lat: this.form.lat,
            lng: this.form.lng,
          },
        ],
        species_id: this.form.species?.value,
        quantity: this.form.quantity,
        area_id: this.form.area_id?.value,
        time: format(this.form.time, 'HH:mm'),
        date: format(this.form.date, 'yyyy-MM-dd'),
        weapon_used: this.form.weapon_used,
        description: this.form.description,
        spacies_gender: this.form.spacies_gender.value,
        status: this.form.status.value,
      }

      this.games.push(gameObj)
    },
    deleteFromStorage(index: any) {
      this.games.splice(index, 1)
    },

    async getPermitOptions() {
      this.loadingSales = true
      const response: any = await this.getContractPermits()
      if (response.status === 200) {
        this.loadingSales = false
        this.contractPermitOptions = response.data.map((item: any) => {
          return {
            text: `PN0: ${item.permit_number} - C: ${item.entity_contract.sales_confirmation_proposal.sales_inquiry.entity.full_name}`,
            value: item.id,
            selfitem: item,
          }
        })
      } else {
        this.loadingSales = false // Handle case when response status is not 200
      }
    },

    // species options
    async getSpeciesListOptions() {
      const response: any = await this.getSpeciesList()
      if (response.status === 200) {
        this.speciesOptions = response.data.map((item: any) => {
          return {
            text: item.name,
            value: item.id,
          }
        })
      } else {
        this.speciesOptions = [] // Handle case when response status is not 200
      }
    },
    // area options
    async getAreaListOptions() {
      const response: any = await this.getAreaList()
      if (response.status === 200) {
        this.areaOptions = response.data.map((item: any) => {
          return {
            text: item.name,
            value: item.id,
          }
        })
      } else {
        this.areaOptions = [] // Handle case when response status is not 200
      }
    },
    async getPhVsetOptions() {
      const response: any = await this.getPhVset()
      if (response.status === 200) {
        this.phOptions = response.data.map((item: any) => {
          return {
            text: item.full_name,
            value: item.id,
          }
        })
      } else {
        this.phOptions = [] // Handle case when response status is not 200
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.sales-inquiry {
  margin: 20px;
}

.split-demo {
  & .custom-grabber {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--va-background-element);
  }
}
</style>
