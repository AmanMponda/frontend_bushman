<template>
  <div class="p-4">
    <div class="permit-info">
      <VaCardTitle class="p-0, m-0"
        ><b>Permit No:</b> {{ item?.entity_contract_permit.permit_number ?? 'N/A' }}</VaCardTitle
      >

      <VaCardTitle><b>Client:</b> {{ item?.client.full_name ?? 'N/A' }}</VaCardTitle>

      <VaCardTitle><b>Company:</b> BUSHMAN HUNTING SAFARI (T) LTD</VaCardTitle>

      <VaCardTitle
        ><b>PH NAME:</b>
        {{ Array.isArray(item?.ph) ? item.ph.map((ph: any) => ph.ph.full_name).join(', ') : 'N/A' }}</VaCardTitle
      >
      <!-- <VaCardTitle><b>PH license:</b> N/A</VaCardTitle> -->
    </div>
    <VaCard tag="b">
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
        <div class="flex flex-col md:flex-row gap-2">
          <template v-if="showAddActiviteForm">
            <VaButton size="small" color="primary" @click="goBack">Cancel</VaButton>
          </template>
          <template v-else>
            <VaCardTitle>Killed Species</VaCardTitle>
          </template>
          <!-- button to add new activity -->
        </div>
        <div class="flex flex-col md:flex-row gap-2">
          <VaButton
            v-if="!showAddActiviteForm && item.status !== 'CLOSED'"
            size="small"
            color="primary"
            @click="showAddActiviteForm = true"
            >Add Activity</VaButton
          >
        </div>
      </div>

      <VaCardContent>
        <template v-if="showAddActiviteForm"> <ActivitesForm :activity-data="item" /> </template>
        <template v-else>
          <VaDataTable :items="activities" :loading="loadingActivities" />
        </template>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { formatDateTime } from '../../../../services/utils'
import { mapState, mapActions } from 'pinia'
import { useGameStore } from '../../../../stores/game-store'
import ActivitesForm from './ActivitesForm.vue'

export default defineComponent({
  components: {
    ActivitesForm,
  },
  props: {
    item: {
      type: Object as PropType<any>, // Specify the correct type of the item based on your data structure
      required: true,
    },
  },
  setup() {
    return {
      formatDateTime,
    }
  },
  data() {
    return {
      showAddActiviteForm: false,
    }
  },
  computed: {
    ...mapState(useGameStore, ['activities', 'loadingActivities']),
  },
  mounted() {
    this.getActiviteActivites(this.item.id)
  },

  methods: {
    ...mapActions(useGameStore, ['getActiviteActivites']),
    goBack() {
      this.showAddActiviteForm = false
      this.getActiviteActivites(this.item.id)
    },
  },
})
</script>

<style scoped></style>
