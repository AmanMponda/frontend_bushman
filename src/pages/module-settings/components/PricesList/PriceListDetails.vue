<template>
  <!-- <h1 class="h1">Price List Details</h1> -->
  <VaSkeletonGroup v-if="cardStore.loading">
    <VaSkeleton class="mb-4" height="160px" variant="squared" />
    <VaSkeleton class="mb-4" height="160px" variant="squared" />
    <VaSkeleton height="360px" variant="squared" />
  </VaSkeletonGroup>

  <template v-else>
    <h1 class="va-h4 captalized-text text-center">Price List Details</h1>
    <p class="va-h6 captalized-text text-center">
      {{ format(priceListItem.price_list_type.price_list.start_date, 'MMMM yyyy') }}-{{
        format(priceListItem.price_list_type.price_list.end_date, 'MMMM yyyy')
      }}
    </p>
    <VaDivider />
    <h6 class="captalized-text">
      {{ priceListItem.sales_package?.area?.name }}({{ priceListItem.sales_package.area.description }})
    </h6>

    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>Package Name</th>
            <th>Hunting Type</th>
            <th>Amount({{ priceListItem.price_list_type.currency?.name }})</th>
            <th>Duration(Days)</th>
            <th>Licence</th>
            <th>Licence duration(Days)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ priceListItem.sales_package.name }}</td>
            <td>{{ priceListItem.price_list_type.hunting_type.name }}</td>
            <td>{{ priceListItem.price_list_type.amount }}</td>
            <td>{{ priceListItem.price_list_type.duration }}</td>
            <td>{{ priceListItem.sales_package.regulatory_package?.name }}</td>
            <td>{{ priceListItem.sales_package.regulatory_package?.duration }}</td>
            <td v-if="priceListItem.price_list_type?.is_active">
              <VaBadge text="Active" color="success" />
            </td>
            <td v-else>
              <VaBadge text="Inactive" color="danger" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <VaDivider></VaDivider>
    <h6 class="captalized-text">Spieces</h6>
    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Scientific Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="species in priceListItem.sales_package.species" :key="species.id">
            <td>{{ species.species.name }}</td>
            <td>{{ species.species.scientific_name }}</td>
            <td>{{ species.quantity }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <VaDivider></VaDivider>

    <h6 class="captalized-text">Companion Hunter Costs</h6>
    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>Amount({{ priceListItem.price_list_type.currency.name }})</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="companion in priceListItem.componions_hunter" :key="companion.id">
            <td>{{ companion.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <VaDivider></VaDivider>

    <h6 class="captalized-text">SAFARI EXTRAS</h6>

    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>Service</th>
            <th>Amount ({{ priceListItem.price_list_type.currency.name }})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Observer</td>
            <td>{{ priceListItem.price_list_type.currency.name }}{{ priceListItem.observer[0]?.amount }} per day/ person</td>
          </tr>
          <tr>
            <td>Change of Area Fees</td>
            <td>$5</td>
          </tr>
          <tr>
            <td>Baiting vehicle/ Photographic vehicle</td>
            <td>$4</td>
          </tr>
          <tr>
            <td>Baiting vehicle with Professional Hunter</td>
            <td>$7</td>
          </tr>
          <tr>
            <td>WIFI Charges</td>
            <td>$30 per day</td>
          </tr>
          <tr>
            <td>Firearm Hire</td>
            <td>$100 per day</td>
          </tr>
          <tr>
            <td>Ammo Purchase</td>
            <td>$2.5 per Round</td>
          </tr>
        </tbody>
      </table>
    </div>

    <VaAlert color="#e6e6e6" title="*All hunts confirmation is subject to quota availability.!" class="mb-6">
      Other safari packages are available on request and can be customized depending on client requirement.
    </VaAlert>

    <VaDivider></VaDivider>

    <h2 class="captalized-text text-center va-h6">More Information</h2>

    <h6 class="captalized-text">Trophy Fees</h6>

    <div class="va-table-responsive">
      <table class="va-table va-table--hoverable">
        <thead>
          <tr>
            <th>Species</th>
            <th>Species Availability</th>
            <th>10 Days</th>
            <th>14 Days</th>
            <th>21 Days</th>
            <th>Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1st Buffalo</td>
            <td>MS BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>41</td>
          </tr>
          <tr>
            <td>2nd Buffalo</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>43</td>
          </tr>
          <tr>
            <td>3rd Buffalo</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>45</td>
          </tr>
          <tr>
            <td>4th Buffalo</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>45</td>
          </tr>
          <tr>
            <td>Baboon</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>4</td>
          </tr>
          <tr>
            <td>Bushbuck Chobe</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>11</td>
          </tr>
          <tr>
            <td>Bushbuck Masai</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>12</td>
          </tr>
          <tr>
            <td>Bushpig</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>7.5</td>
          </tr>
          <tr>
            <td>Civet Cat</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>7</td>
          </tr>
          <tr>
            <td>Cat Genet</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>8</td>
          </tr>
          <tr>
            <td>Crocodile</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>2.9</td>
          </tr>
          <tr>
            <td>Dik Dik</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>8</td>
          </tr>
          <tr>
            <td>Common Dukier</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>8</td>
          </tr>
          <tr>
            <td>Harvey’s Red Duiker</td>
            <td>BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>9.5</td>
          </tr>
          <tr>
            <td>Patterson Eland</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>4.5</td>
          </tr>
          <tr>
            <td>Elephant 100 Pounds</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>35</td>
          </tr>
          <tr>
            <td>Elephant > 100 Pounds</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>40</td>
          </tr>
          <tr>
            <td>Gerenuk</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>5.5</td>
          </tr>
          <tr>
            <td>Gazella Grant</td>
            <td>BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>1.7</td>
          </tr>
          <tr>
            <td>Gazella Thomson</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>1.7</td>
          </tr>
          <tr>
            <td>Gazella Roberts</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>2.5</td>
          </tr>
          <tr>
            <td>Hartebeest (COKE'S)</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>1.8</td>
          </tr>
          <tr>
            <td>Hippo</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>3</td>
          </tr>
          <tr>
            <td>Spotted Hyena</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>1.5</td>
          </tr>
          <tr>
            <td>Striped Hyena</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>2</td>
          </tr>
          <tr>
            <td>Impala</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>8</td>
          </tr>
          <tr>
            <td>Jackal</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>7</td>
          </tr>
          <tr>
            <td>Klipspringer</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>1.7</td>
          </tr>
          <tr>
            <td>Kudu (Greater)</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>4.5</td>
          </tr>
          <tr>
            <td>Kudu (Lesser)</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>6</td>
          </tr>
          <tr>
            <td>Leopard</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>9.5</td>
          </tr>
          <tr>
            <td>Lion</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>13</td>
          </tr>
          <tr>
            <td>Ostrich</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>2</td>
          </tr>
          <tr>
            <td>Fringe Eared Oryx</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>6.5</td>
          </tr>
          <tr>
            <td>Porcupine</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>7</td>
          </tr>
          <tr>
            <td>Ratel Honey Badger</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>9.5</td>
          </tr>
          <tr>
            <td>Bohor Reedbuck</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>15</td>
          </tr>
          <tr>
            <td>Mountain Reedbuck Common</td>
            <td>BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>15</td>
          </tr>
          <tr>
            <td>Roan</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>6</td>
          </tr>
          <tr>
            <td>Serval Cat</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>7</td>
          </tr>
          <tr>
            <td>Steinbuck</td>
            <td>BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>7</td>
          </tr>
          <tr>
            <td>Suni</td>
            <td>BK</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>1.25</td>
          </tr>
          <tr>
            <td>Topi</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>1.8</td>
          </tr>
          <tr>
            <td>Warthog</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>8</td>
          </tr>
          <tr>
            <td>Wildbeest</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>1.65</td>
          </tr>
          <tr>
            <td>Waterbuck - Deffessa</td>
            <td>MS</td>
            <td></td>
            <td>*</td>
            <td>*</td>
            <td>1.5</td>
          </tr>
          <tr>
            <td>Wild Cat</td>
            <td>MS, BK</td>
            <td></td>
            <td>*</td>
            <td></td>
            <td>8</td>
          </tr>
          <tr>
            <td>Zebra</td>
            <td>MS, BK</td>
            <td>*</td>
            <td>*</td>
            <td>*</td>
            <td>1.8</td>
          </tr>
        </tbody>
      </table>
    </div>
    <VaDivider></VaDivider>

    <VaAlert color="#e6e6e6" title="UPGRADE FEES!" class="mb-6">
      *If 4th Buffalo is taken upgrade fees of USD 5,000 (plus trophy fees)
    </VaAlert>

    <!-- <PriceListPackagesDetails :prece-list-item="priceListItem" />
    <PriceListQuota :item="priceListItem" />
    <PricesSpeciesList :species-items="priceListItem.sales_package.species"> </PricesSpeciesList>

    <ObComCosts :companion-items="priceListItem.componions_hunter" :title="'Companion Costs'"></ObComCosts>
    <ObComCosts :companion-items="priceListItem.observer" :title="'Observer Cost'"></ObComCosts>

    <AdditionCharges></AdditionCharges> -->
    <!-- <PriceListByHuntingType /> -->
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
// import PaymentInfo from './../../billing/PaymentInfo.vue'
// import Invoices from './../../billing/Invoices.vue'
import { usePaymentCardsStore } from '../../../../stores/payment-cards'
import { format } from 'date-fns'
// import PriceListPackagesDetails from './PriceListPackagesDetails.vue'
// import PriceListQuota from './PriceListQuota.vue'
// import PriceListByHuntingType from './PriceListByHuntingType.vue'
// import PricesSpeciesList from './PricesSpeciesList.vue'
// import ObComCosts from './ObComCosts.vue'
// import AdditionCharges from './AdditionCharges.vue'

export default defineComponent({
  components: {
    // PriceListQuota,
    // PriceListByHuntingType,
    // PriceListPackagesDetails,
    // PricesSpeciesList,
    // ObComCosts,
    // AdditionCharges,
  },

  props: {
    priceListItem: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      cardStore: usePaymentCardsStore(),
      format,
    }
  },
  computed: {
    loading() {
      return this.cardStore.loading
    },
  },
  mounted() {
    this.cardStore.load()
  },
})
</script>

<style scoped>
.captalized-text {
  text-transform: uppercase;
}

.terms-of-business {
  padding: 20px;
}

.safari-rate-include {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 30%; /* Adjust width as needed */
}
</style>
