<template>
  <VaInnerLoading :loading="savingPriceList" :size="60">
    <VaForm ref="formRef">
      <div class="p-1">
        <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"> -->
        <h3 class="font-bold text-lg mb-2">Price list Infos</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaSelect
            v-model="form.package"
            :options="packageOptions"
            multiple
            clearable
            placeholder="Select Package list here"
            :rules="[(v: any) => v || 'Package is required']"
            label="Packages"
            required-mark
            @update:modelValue="onChangePackage"
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
            <template #append>
              <VaIcon name="add" class="ml-2" @click="_showModal()" />
            </template>
          </VaSelect>
          <!-- <VaInput v-model="form.nick_name" placeholder="Nick name" label="Nick name" /> -->
          <VaSelect
            v-model="form.hunting_type_id"
            placeholder="Select Hunting Type"
            label="Hunting Type"
            :rules="[(v: any) => v || 'Hunting type is required']"
            :options="huntingTypesOptions"
            searchable
            required-mark
            highlight-matched-text
          />
          <VaSelect
            v-model="form.season"
            :options="seasonsOptions"
            required-mark
            label="Select season"
            placeholder="Select season"
          />
        </div>

        <!-- Experience and Date Group -->
        <h3 class="font-bold text-lg mb-2">Charges</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <VaInput
            v-model="form.amount"
            type="text"
            placeholder="Enter Amount"
            :rules="[(value: any) => (value && value.length > 0) || 'Amount is required']"
            label="Amount"
            required-mark
          />

          <VaSelect
            v-model="form.currency"
            placeholder="Select Currency"
            label="Currency"
            :rules="[(v: any) => v || 'Currency is required']"
            :options="currencyOptions"
            searchable
            highlight-matched-text
            required-mark
          />
          <!-- <vue-tel-input v-model="form.phone" mode="international" required></vue-tel-input> -->

          <VaSelect
            v-model="form.duration"
            type="text"
            :options="durationsOptions"
            required-mark
            placeholder="Enter Duration eg: 21 days"
            :rules="[(v: any) => v || 'Duration is required']"
            label="Duration(days)"
          />
        </div>

        <!-- companion group -->
        <h3 class="font-bold text-lg mb-2">Companion's and Observer's Charges(Optional)</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <VaInput
            v-model="form.companion_amount"
            type="text"
            placeholder="Enter Companion Amount"
            label="Companion Cost(Per Person)"
          />
          <VaInput
            v-model="form.observer_amount"
            type="text"
            placeholder="Enter observer Amount"
            label="Observer Cost(Per Person)"
          />
        </div>
      </div>

      <div class="mt-4 d-flex p-2">
        <VaButton
          v-if="!showEditForm"
          icon="save"
          class="mr-3 mb-2"
          :loading="savingPriceList"
          :disabled="!isValidForm"
          @click="validateForm() && submit()"
        >
          Save
        </VaButton>
      </div>
    </VaForm>
  </VaInnerLoading>
  <VaModal v-model="_shM" ok-text="Apply" close-button size="large" :hide-default-actions="true">
    <SalesPackageForm> </SalesPackageForm>
  </VaModal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { VaForm, VaInput, VaSelect, VaButton } from 'vuestic-ui'
import handleErrors from '../../../../utils/errorHandler'
import { validators } from '../../../../services/utils'

import { useForm, useToast } from 'vuestic-ui'
import { mapActions, mapState, mapWritableState } from 'pinia'
import { useQuotaStore } from '../../../../stores/quota-store'
import { useSettingsStore } from '../../../../stores/settings-store'
import { usePriceListStore } from '../../../../stores/price-list-store'
import SalesPackageForm from '../SalesPackageForm.vue'

export default defineComponent({
  components: {
    // Salesinquirieslist,
    SalesPackageForm,
    VaForm,
    VaInput,
    VaSelect,
    VaButton,
  },
  setup() {
    const formRef = ref()

    const {
      isValid: isValidForm,
      validate: validateForm,
      resetValidation: resetValidationForm,
      reset: resetForm,
    } = useForm(formRef)

    const { init } = useToast()
    const showEditForm = ref(false)
    // const _usePriceListStore: any = usePriceListStore()

    // const pkg: any = computed(() => {
    //   return _usePriceListStore.latestPackage
    // })

    const form = reactive({
      id: null as any,
      hunting_type_id: null as any,
      // is list
      package: [] as any,
      // description: '',s
      // sales_quota_id: null as any,
      amount: null as any,

      currency: null as any,
      duration: null as any,
      season: null as any,
      end_date: null as any,
      species: null as any,
      quantity: null as any,
      // area: null as any,
      // companion_days: 0,
      companion_amount: null as any,
      // observer_days: 0,
      observer_amount: null as any,
    })

    // make as copy of pkg to form package

    const contactForm = reactive({
      id: null as any,
      client_id: null as any,
      contact: '',
      contact_type: null as any,
      contactable: false,
    })

    const deleteChip = (chip: any) => {
      form.package = form.package.filter((v: any) => v !== chip)
    }

    const countries = ref([]) as any
    const nationality = ref([]) as any
    const categoryOptions = ref([]) as any
    const contactsTypes = ref([]) as any
    const clients = ref([]) as any
    const step = ref(0) as any

    return {
      formRef,
      form,
      contactForm,
      showEditForm,
      countries,
      nationality,
      categoryOptions,
      contactsTypes,
      clients,
      step,
      // steps,
      init,
      isValidForm,
      validateForm,
      resetValidationForm,
      resetForm,
      deleteChip,
      validators,
    }
  },
  data() {
    // 1-21
    const durationsOptions: any = [
      { value: 1, text: '1 day' },
      { value: 2, text: '2 days' },
      { value: 3, text: '3 days' },
      { value: 4, text: '4 days' },
      { value: 5, text: '5 days' },
      { value: 6, text: '6 days' },
      { value: 7, text: '7 days' },
      { value: 8, text: '8 days' },
      { value: 9, text: '9 days' },
      { value: 10, text: '10 days' },
      { value: 11, text: '11 days' },
      { value: 12, text: '12 days' },
      { value: 13, text: '13 days' },
      { value: 14, text: '14 days' },
      { value: 15, text: '15 days' },
      { value: 16, text: '16 days' },
      { value: 17, text: '17 days' },
      { value: 18, text: '18 days' },
      { value: 19, text: '19 days' },
      { value: 20, text: '20 days' },
      { value: 21, text: '21 days' },
    ]
    return {
      preferred_species: [] as any,
      speciesOptions: [] as any,
      speciesObjects: [] as any,
      areasOptions: [] as any,
      huntingTypesOptions: [] as any,
      salesQuotasOptions: [] as any,
      speciesItemOptions: [] as any,
      currencyOptions: [] as any,
      // packageOptions: [] as any,
      savingPriceList: false,
      durationsOptions,
      seasonsOptions: [] as any,
    }
  },
  computed: {
    ...mapState(usePriceListStore, ['salesPackages', 'packageOptions', 'latestPackage', 'loadingpackages']),
    ...mapWritableState(usePriceListStore, {
      _shM: 'showModal',
    }),
  },

  watch: {
    // use both close modal and show modal to close modal
    // i want if the  closeMadal is true then showModal should be false
  },
  mounted() {
    // this.getAllSpeciesPerQuotaPerArea()
    this.getAreas()
    this.getHuntingTypes()
    this.getQuotaList()
    this.getCurrencyList()
    this.getSalesPackages()
    this.getSeasonList()
  },

  methods: {
    ...mapActions(useQuotaStore, ['getSpeciesList']),
    ...mapActions(useQuotaStore, ['getAllSpeciesPerQuotaPerArea']),
    ...mapActions(useQuotaStore, ['getAreaList']),
    ...mapActions(useSettingsStore, ['getHuntingsTypes']),
    ...mapActions(useSettingsStore, ['getCurrencies', 'getSeasons']),
    ...mapActions(useQuotaStore, ['getQuotas']),
    ...mapActions(usePriceListStore, ['createPriceList']),
    ...mapActions(usePriceListStore, ['getSalesPackageList']),

    // addNewSpeciesItemToStorage() {},
    // CreateSalesInquiry

    // ...mapActions(useSalesInquiriesStore, ['createSalesInquiry']),

    onAreaChange(value: any) {
      console.log(value as any)
      // this.getAllSpieces()
    },

    async submit() {
      this.savingPriceList = true
      const requestdata = {
        huntingTypeId: this.form.hunting_type_id.value,
        sales_package_ids: this.form.package?.filter((v: any) => v?.value !== undefined).map((v: any) => v?.value),
        amount: this.form.amount,
        currency: this.form.currency.value,
        duration: this.form.duration.value,
        season_id: this.form.season.value.id,
        //chriss' codes
        start_at : this.form.season.value.start_at,
        end_at: this.form.season.value.end_at,
        is_active: 1,
        area_id : 3,
        user_id : 1,
        companionAmount: this.form.companion_amount,
        observerAmount: this.form.observer_amount,
      }


      // console.log(requestdata);
      this.savingPriceList = false
      // return ;
      try {
        const response: any = await this.createPriceList(requestdata)
        if (response.status === 201) {
          this.init({ message: response.data.message, color: 'success' })
          this.resetForm()
          this.resetValidationForm()
          this.speciesObjects = []
          this.savingPriceList = false
        }else{
            console.log(response);
           this.savingPriceList = false
        }
      } catch (error: any) {
        this.savingPriceList = false
        const errors = handleErrors(error.response)
        console.log(error)
        this.init({
          message: error.message,
          color: 'danger',
        })
      }
    },

    async getSpeciesItems() {
      try {
        const response = await this.getSpeciesList()

        // Add the species items from the response
        this.speciesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })

        // Combine default option with species items
        // this.speciesOptions = this.speciesOptions.concat(speciesItems)
      } catch (error) {
        console.log(error)
      }
    },
    async getSeasonList() {
      try {
        const response = await this.getSeasons()
        this.seasonsOptions = response.data.map((item: { id: any; name: any;}) => {
          return {
            value: item,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    _showModal() {
      this._shM = true
    },

    async getSalesPackages() {
      try {
        await this.getSalesPackageList(true)
      } catch (error) {
        console.log(error)
      }
    },

    deleteFromStorage(index: number) {
      this.speciesObjects.splice(index, 1)
      console.log('Species item deleted:', index)
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

    // get hunting types
    async getHuntingTypes() {
      try {
        const response = await this.getHuntingsTypes()
        this.huntingTypesOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    onChangePackage(value: any) {
      console.log(value.filter((v: any) => v?.value !== undefined).map((v: any) => v?.value))
    },

    // async getAllSpieces() {
    //   try {
    //     const response = await this.getAllSpeciesPerQuotaPerArea(null, this.form.area?.value ?? null, null)
    //     this.speciesItemOptions = response.data.map((item: any) => {
    //       return {
    //         value: item.species.id,
    //         text: item.species.name,
    //       }
    //     })
    //     // }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },

    // get quotas
    async getQuotaList() {
      try {
        const response = await this.getQuotas(null)
        this.salesQuotasOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    async getCurrencyList() {
      try {
        const response = await this.getCurrencies()
        this.currencyOptions = response.data.map((item: { id: any; name: any }) => {
          return {
            value: item.id,
            text: item.name,
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    // get clients
  },
})
</script>
s
