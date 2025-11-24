<template>
  <VaInnerLoading :loading="loadingSales">
    <VaForm ref="iformRef">
      <h3 class="font-bold text-lg mb-2">Hunting Game Information</h3>
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
          placeholder="Choose End date"
          :rules="[(value: any) => value || 'Arrival Date is required']"
          label="End date"
        />
        <VaSelect
          v-model="form.professional_hunters_ids"
          label="PH"
          :options="phOptions"
          multiple
          max-selections="2"
          :rules="[(value: any) => value || 'PH is required']"
          placeholder="Select PH"
        >
          <template #content="{ value }">
            <VaChip
              v-for="chip in value"
              :key="chip"
              size="small"
              color="info"
              class="mr-1 my-1"
              closeable
              @update:modelValue="deleteChip(chip)"
            >
              {{ chip.text }}
            </VaChip>
          </template>
        </VaSelect>
      </div>
      <VaDivider />

      <div class="flex justify-end">
        <VaButton
          :loading="sendingData"
          :disabled="!isValidForm"
          icon="save"
          @click="validateForm() && onSubmit('IN_PROGRESS')"
          >Save</VaButton
        >
      </div>
    </VaForm>
  </VaInnerLoading>
</template>

<script lang="ts">
import { useForm, useToast } from 'vuestic-ui'
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
  setup() {
    const { init } = useToast()

    const iformRef = ref(null as any)
    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(iformRef)

    const isNotUpBookingSelected = ref(true)

    const onInputChange = (event: any) => {
      console.log(event)
      if (event.value == 'prior' || event.value == 'after') {
        isNotUpBookingSelected.value = false
      }
    }

    const form = reactive({
      entity_contract_permit: null as any,
      start_date: null as any,
      end_date: null as any,
      description: '',
      professional_hunters_ids: [] as any,
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
    const deleteChip = (chip: any) => {
      form.professional_hunters_ids = form.professional_hunters_ids.filter((v: any) => v !== chip)
    }

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
      deleteChip,
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
    }
  },
  computed: {},

  mounted() {
    this.getPermitOptions()
    this.getSpeciesListOptions()
    this.getAreaListOptions()
    this.getPhVsetOptions()
  },

  methods: {
    ...mapActions(useGameStore, ['initiateGameActivity']),
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
      const professional_hunters_ids = this.form.professional_hunters_ids.map((item: any) => item.value)
      //       {
      //     "entity_contract_permit_id": 5,
      //     "client_id": 2,
      //     "start_date": "2024-11-01",
      //     "end_date": "2024-12-01",
      //     "coordinates_type": "Point",
      //     "professional_hunters_ids": [7]

      // }

      const data = {
        entity_contract_permit_id: this.form.entity_contract_permit?.value,
        client_id: this.client_id,
        start_date: format(this.form.start_date, 'yyyy-MM-dd'),
        end_date: format(this.form.end_date, 'yyyy-MM-dd'),

        professional_hunters_ids: professional_hunters_ids,
        game_state: gameState,
        // // games: this.games,
        // coordinates_type: 'Point',
        // coordinates: [
        //   {
        //     lat: this.form.lat,
        //     lng: this.form.lng,
        //   },
        // ],
        // species_id: this.form.species?.value ?? null,
        // quantity: this.form.quantity,
        // area_id: this.form.area_id?.value ?? null,
        // time: format(this.form.time, 'HH:mm'),
        // date: format(this.form.date, 'yyyy-MM-dd'),
        // weapon_used: this.form.weapon_used,
        // description: this.form.description,
        // spacies_gender: this.form.spacies_gender?.value ?? null,
        // status: this.form.status?.value ?? null,
      }

      console.log(data)
      try {
        const response: any = await this.initiateGameActivity(data)
        if (response.status === 201) {
          this.init({ message: 'Contract created successfully', color: 'success' })
          this.sendingData = false
        }
      } catch (error: any) {
        this.sendingData = false
        const errors = handleErrors(error.response)
        this.init({
          message: '\n' + errors.map((error, index) => `${index + 1}. ${error}`).join('\n'),
          color: 'danger',
        })
      }
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
