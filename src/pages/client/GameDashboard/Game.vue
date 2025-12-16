<template>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between px-4 py-2">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButton
            v-if="showDetails || showAddgameForm"
            class="px-2 py-2"
            icon="arrow_back"
            size="small"
            @click="gotBack()"
          >
            Go Back
          </VaButton>
        </div>
        <VaButtonGroup v-if="!showAddgameForm && !showDetails">
          <VaButton
            class="px-2 py-2"
            color="primary"
            label="Add New Quota"
            round
            present="secondary"
            border-color="primary"
            icon="add"
            size="small"
            @click="toggleAddSalesInquiriesForm()"
            >Create game</VaButton
          >
        </VaButtonGroup>
      </div>

      <template v-if="!showDetails">
        <template v-if="!showAddgameForm">
          <VaDataTable :items="games" :columns="columns" :loading="loadinggames" hoverable striped>
            <template #cell(status)="{ value }">
              <VaChip :color="getStatusColor(value)" size="small">
                {{ getStatsText(value) }}
              </VaChip>
            </template>
            <template #cell(actions)="{ rowData }">
              <VaButton preset="plain" icon="download" @click="downloadPdf(rowData.pdf)"></VaButton>
              <VaButton preset="plain" icon="visibility" @click="viewgame(rowData.selfitem)"></VaButton>
            </template>
          </VaDataTable>
        </template>
        <template v-else>
          <GameForm> </GameForm>
        </template>
      </template>
      <template v-else>
        <GameDetails :item="item"></GameDetails>
      </template>
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia'
import { defineComponent } from 'vue'
import downloadPdf from '../../../utils/pdfDownloader'
import GameDetails from './components/GameDetails.vue'
import GameForm from './components/GameForm.vue'
import { useGameStore } from '../../../stores/game-store'

export default defineComponent({
  components: {
    GameDetails,
    GameForm,
  },
  data() {
    // permit_number: item?.entity_game?.permit_number ?? '',
    //         client_name: item?.client.full_name,
    //         pdf: item.pdf,
    //         selfitem: item,
    //         start_date: formatDateTime(item?.start_date),
    //         end_date: formatDateTime(item.end_date),
    const columns = [
      { key: 'permit_number', sortable: true },
      { key: 'client_name', sortable: true },
      { key: 'start_date', sortable: true },
      { key: 'end_date', sortable: true },
      { key: 'status', label: 'status' },
      { key: 'actions', label: 'Actions' },
    ]

    return {
      columns,
      downloadPdf,
      item: null as any,
      showDetails: false,
      showAddgameForm: false,
    }
  },
  computed: {
    ...mapState(useGameStore, ['games', 'loadinggames']),
  },
  mounted() {
    this.getRegisteredGames()
  },
  methods: {
    ...mapActions(useGameStore, ['getRegisteredGames', 'getActiviteActivites']),

    viewgame(game: any) {
      this.item = game
      this.showDetails = true
      this.showAddgameForm = false
      this.getActiviteActivites(game.id)
    },
    getStatusColor(status: string) {
      switch (status) {
        case 'NOT_STARTED':
          return 'default'
        case 'INITIATED':
          return 'warning'
        case 'CLOSED':
          return 'success' // Adjust as needed
        case 'IN_PROGRESS':
          return 'info'

        default:
          return 'default' // fallback color
      }
    },

    getStatsText(status: string) {
      switch (status) {
        case 'NOT_STARTED':
          return 'Not Started'
        case 'INITIATED':
          return 'Initiated'
        case 'CLOSED':
          return 'Finished' // Adjust as needed
        case 'IN_PROGRESS':
          return 'In Progress'

        default:
          return 'default' // fallback color
      }
    },

    gotBack() {
      this.getRegisteredGames()

      this.showDetails = false
      this.showAddgameForm = false
    },

    toggleAddSalesInquiriesForm() {
      this.showDetails = false
      this.showAddgameForm = !this.showAddgameForm
    },
  },
})
</script>
