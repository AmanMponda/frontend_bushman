import { h as F } from './errorHandler-DijQ3xmc.js'
import { v as $ } from './utils-BWc0LXoO.js'
import { u as Q } from './useForm-XQT-jLAz.js'
import { u as T } from './useToast-DVuIP6Z-.js'
import {
  _ as q,
  g as N,
  e as s,
  t as n,
  h as l,
  F as _,
  q as E,
  o as u,
  d as j,
  m as p,
  l as B,
  B as O,
  s as f,
  b as d,
  w as r,
  i as h,
  a as C,
  v as V,
} from './index-P4QeRV7n.js'
import { u as b } from './quota-store-Bck9cnCu.js'
import { u as A } from './settings-store-BoS8g_yz.js'
import { u as M } from './price-list-store-CE2l0b9v.js'
import { u as R } from './regulatrory-store-DAcA9qfI.js'
import { S as z } from './SalesPackageForm-DZGcJZQ_.js'
const G = { props: { item: { type: Object, required: !0 } } },
  H = { class: 'species-details' },
  U = { class: 'header' },
  W = { class: 'description' },
  J = { class: 'area-info' },
  K = { class: 'regulatory-package-info' },
  X = { class: 'va-table-responsive' },
  Y = { class: 'va-table va-table--clickable' }
function Z(e, t, a, i, g, D) {
  var o, y, P, w, k
  return (
    u(),
    N('div', H, [
      t[9] || (t[9] = s('h1', { class: 'title' }, 'Sales Package Details', -1)),
      s('div', U, [
        s('h2', null, 'Packages Name: ' + n(a.item.name || 'N/A'), 1),
        s('p', W, [
          t[0] || (t[0] = s('strong', null, 'Description:', -1)),
          l(' ' + n(a.item.description || 'No description available'), 1),
        ]),
      ]),
      s('div', J, [
        t[3] || (t[3] = s('h3', null, 'Area Information', -1)),
        s('p', null, [
          t[1] || (t[1] = s('strong', null, 'Area Name:', -1)),
          l(' ' + n(((o = a.item.area) == null ? void 0 : o.name) || 'N/A'), 1),
        ]),
        s('p', null, [
          t[2] || (t[2] = s('strong', null, 'Area Description:', -1)),
          l(' ' + n(((y = a.item.area) == null ? void 0 : y.description) || 'No description available'), 1),
        ]),
      ]),
      s('div', K, [
        t[7] || (t[7] = s('h3', null, 'Licence Information', -1)),
        s('p', null, [
          t[4] || (t[4] = s('strong', null, 'Package Name:', -1)),
          l(' ' + n(((P = a.item.regulatory_package) == null ? void 0 : P.name) || 'N/A'), 1),
        ]),
        s('p', null, [
          t[5] || (t[5] = s('strong', null, 'Duration:', -1)),
          l(' ' + n(((w = a.item.regulatory_package) == null ? void 0 : w.duration) || 'N/A') + ' days', 1),
        ]),
        s('p', null, [
          t[6] || (t[6] = s('strong', null, 'Created Date:', -1)),
          l(' ' + n(((k = a.item.regulatory_package) == null ? void 0 : k.created_at) || 'N/A'), 1),
        ]),
      ]),
      s('div', X, [
        s('table', Y, [
          t[8] ||
            (t[8] = s(
              'thead',
              null,
              [
                s('tr', null, [
                  s('th', null, 'ID'),
                  s('th', null, 'Species Name'),
                  s('th', null, 'Scientific Name'),
                  s('th', null, 'Quantity'),
                ]),
              ],
              -1,
            )),
          s('tbody', null, [
            (u(!0),
            N(
              _,
              null,
              E(a.item.species, (c) => {
                var S, v
                return (
                  u(),
                  N('tr', { key: c.id }, [
                    s('td', null, n(c.id || 'N/A'), 1),
                    s('td', null, n(((S = c.species) == null ? void 0 : S.name) || 'N/A'), 1),
                    s('td', null, n(((v = c.species) == null ? void 0 : v.scientific_name) || 'N/A'), 1),
                    s('td', null, n(c.quantity !== null ? c.quantity : 'N/A'), 1),
                  ])
                )
              }),
              128,
            )),
          ]),
        ]),
      ]),
    ])
  )
}
const x = q(G, [
    ['render', Z],
    ['__scopeId', 'data-v-e004d657'],
  ]),
  ee = j({
    components: { SalesPackageDetails: x, SalesPackageForm: z },
    setup() {
      const e = f(),
        { isValid: t, validate: a, resetValidation: i, reset: g } = Q(e),
        { init: D } = T(),
        o = f(!1),
        y = O({ package_name: '', description: '', species: null, quantity: 1, area: null, licence: null }),
        P = O({ id: null, client_id: null, contact: '', contact_type: null, contactable: !1 }),
        w = f([]),
        k = f([]),
        c = f([]),
        S = f([]),
        v = f([]),
        L = f(0)
      return {
        formRef: e,
        form: y,
        contactForm: P,
        showEditForm: o,
        countries: w,
        nationality: k,
        categoryOptions: c,
        contactsTypes: S,
        clients: v,
        step: L,
        init: D,
        isValidForm: t,
        validateForm: a,
        resetValidationForm: i,
        resetForm: g,
        validators: $,
      }
    },
    data() {
      return {
        defaultColDef: { editable: !0 },
        columnDefs: [{ field: 'name' }, { field: 'quantity' }],
        preferred_species: [],
        speciesOptions: [],
        speciesObjects: [],
        areasOptions: [],
        huntingTypesOptions: [],
        salesQuotasOptions: [],
        speciesItemOptions: [],
        currencyOptions: [],
        showPackageList: !0,
        showCreateNewPackageForm: !1,
        showEditPackageForm: !1,
        packages: [],
        columns: [
          { key: 'id', sortable: !0, sortingOptions: ['desc', 'asc'] },
          { key: 'name', sortable: !0 },
          { key: 'area_name', label: 'Area', sortable: !0 },
          { key: 'regulatory_package_name', label: 'Licence', sortable: !0 },
          { key: 'actions', sortable: !0 },
        ],
        loading: !1,
        saving: !1,
        regulatoryPackagesOptions: [],
        loadingLicenceOptions: !1,
        loadingSpeciesOptions: !1,
        isChanged: !1,
        originalQuantities: O({}),
        quntityChangedsaved: !1,
        showDetailsPage: !1,
        selectItem: null,
        showDeleteModal: !1,
        itemToDelete: null,
        deleting: !1,
      }
    },
    computed: {
      ...B(A, ['licenceAreaSpecies', 'laodinglicenceAreaSpecies']),
      itemChanged() {
        return (e) => {
          const t = this.originalQuantities[e],
            a = this.licenceAreaSpecies.find((i) => i.id === e).quantity
          return console.log('Original value:', t, 'Current value:', a), (t && t !== a) || this.isChanged
        }
      },
    },
    mounted() {
      ;(this.loading = !0), this.getSpeciesItems(), this.getSalesPackages(), this.getLicencePackages(), this.getAreas()
    },
    methods: {
      ...p(b, ['getSpeciesList']),
      ...p(b, ['getAllSpeciesPerQuotaPerArea']),
      ...p(b, ['getAreaList']),
      ...p(A, ['getHuntingsTypes']),
      ...p(A, ['getCurrencies']),
      ...p(b, ['getQuotas']),
      ...p(M, [
        'createPriceList',
        'createSalesPackage',
        'getSalesPackageList',
        'updateSalesPackage',
        'deleteSalesPackage',
      ]),
      ...p(R, ['getRegulatoryPackages']),
      ...p(A, ['getHuntingLicenseAreaSpecies']),
      showCreateNewPackaeListFormMethod() {
        ;(this.showCreateNewPackageForm = !0), (this.showPackageList = !1)
      },
      goBack() {
        ;(this.showCreateNewPackageForm = !1),
          (this.showPackageList = !0),
          (this.showDetailsPage = !1),
          (this.showEditPackageForm = !1),
          this.getSalesPackages()
      },
      editPackage(e) {
        ;(this.selectItem = e.selfItem), (this.showEditPackageForm = !0), (this.showPackageList = !1)
      },
      onEditSaved() {
        ;(this.showEditPackageForm = !1), (this.showPackageList = !0), this.getSalesPackages()
      },
      confirmDelete(e) {
        ;(this.itemToDelete = e), (this.showDeleteModal = !0)
      },
      async deletePackage() {
        if (this.itemToDelete) {
          this.deleting = !0
          try {
            const e = await this.deleteSalesPackage(this.itemToDelete.id, !0)
            ;(e.status === 200 || e.status === 204) &&
              (this.init({ message: 'Package deleted successfully.', color: 'success' }),
              (this.showDeleteModal = !1),
              (this.itemToDelete = null),
              this.getSalesPackages())
          } catch (e) {
            const t = F(e.response)
            this.init({ message: t.join(', ') || 'Failed to delete package.', color: 'danger' })
          } finally {
            this.deleting = !1
          }
        }
      },
      async submit() {
        this.saving = !0
        const e = this.licenceAreaSpecies.filter((a) => a.quantity > 0)
        if (e.length === 0) {
          this.init({ message: 'Please add at least one species with quantity greater than 0.', color: 'warning' }),
            (this.saving = !1)
          return
        }
        const t = {
          name: this.form.package_name,
          description: this.form.description,
          areaId: this.form.area.value,
          licenceId: this.form.licence.value,
          speciesObjectList: e,
        }
        try {
          const a = await this.createSalesPackage(t)
          a.status === 201 &&
            ((this.saving = !1),
            console.log(a),
            this.init({ message: a.data.message, color: 'success' }),
            (this.licenceAreaSpecies = []))
        } catch (a) {
          this.saving = !1
          const i = F(a.response)
          console.log(i),
            this.init({
              message:
                `
` +
                i.map((g, D) => `${D + 1}. ${g}`).join(`
`),
              color: 'danger',
            })
        }
      },
      async getSpeciesItems() {
        this.loadingSpeciesOptions = !0
        try {
          const e = await this.getSpeciesList()
          e.status === 200 &&
            ((this.loadingSpeciesOptions = !1),
            (this.speciesItemOptions = e.data.map((t) => ({ value: t.id, text: t.name }))))
        } catch (e) {
          console.log(e)
        }
      },
      showDetails(e) {
        console.log('Show details for:', e), (this.showDetailsPage = !0), (this.selectItem = e.selfItem || e)
      },
      async getSalesPackages() {
        this.loading = !0
        try {
          const e = await this.getSalesPackageList()
          e.status === 200 &&
            ((this.packages = e.data.map((t) => {
              var a, i
              return {
                id: t.id,
                name: t.name,
                area_name: ((a = t == null ? void 0 : t.area) == null ? void 0 : a.name) ?? 'N/A',
                regulatory_package_name:
                  ((i = t == null ? void 0 : t.regulatory_package) == null ? void 0 : i.name) ?? 'N/A',
                selfItem: t,
              }
            })),
            (this.loading = !1))
        } catch {
          this.loading = !1
        }
      },
      async getLicencePackages() {
        this.loadingLicenceOptions = !0
        try {
          const e = await this.getRegulatoryPackages()
          if (e.status === 200) {
            this.loadingLicenceOptions = !1
            const t = e.data
            this.regulatoryPackagesOptions = t.map((a) => ({ value: a.id, text: a.name }))
          }
        } catch (e) {
          console.log(e)
        }
      },
      async getAreas() {
        try {
          const e = await this.getAreaList()
          this.areasOptions = e.data.map((t) => ({ value: t.id, text: t.name }))
        } catch (e) {
          console.log(e)
        }
      },
      async getLicenceAreaSpeciesList() {
        const e = { areaId: this.form.area.value, licenceId: this.form.licence.value }
        try {
          const t = await this.getHuntingLicenseAreaSpecies(e)
          if (t.status === 200) {
            const a = t.data
            this.speciesOptions = a.map((i) => ({ value: i.id, text: i.name }))
          }
        } catch (t) {
          const a = F(t.response)
          console.log(a),
            this.init({
              message:
                `
` +
                a.map((i, g) => `${g + 1}. ${i}`).join(`
`),
              color: 'danger',
            })
        }
      },
      onChange(e, t) {
        if ((console.log('Quantity changed:', e, t), !(e in this.originalQuantities))) {
          const i = this.licenceAreaSpecies.find((g) => g.id === e)
          this.originalQuantities[e] = i.quantity
        }
        const a = this.licenceAreaSpecies.find((i) => i.id === e)
        a && ((a.quantity = t), (this.licenceAreaSpecies = [...this.licenceAreaSpecies])),
          this.init({
            message: `Quantity for ${a.name} has been updated to ${t} quantity(s).`,
            color: 'success',
            position: 'bottom-right',
          }),
          console.log('updated item list:', this.licenceAreaSpecies)
      },
      addNewSpeciesItemToStorage() {
        if (!this.form.species || !this.form.quantity) {
          this.init({ message: 'Please fill all required fields.', color: 'warning' })
          return
        }
        if (Number(this.form.quantity) <= 0) {
          this.init({ message: 'Quantity must be greater than zero.', color: 'warning' })
          return
        }
        this.speciesObjects.some((t) => t.species_id === this.form.species.value)
          ? console.log('Species item already exists:', this.form.species.value)
          : this.speciesObjects.push({
              id: this.form.species.value,
              name: this.form.species.text,
              quantity: this.form.quantity,
            })
      },
      deleteFromStorage(e) {
        this.speciesObjects.splice(e, 1), console.log('Species item deleted:', e)
      },
    },
  }),
  te = { class: 'flex flex-col md:flex-row gap-2 mb-2 justify-between' },
  se = { class: 'flex flex-col md:flex-row gap-2 justify-start' },
  ae = { class: 'flex gap-2' },
  ie = { class: 'flex gap-2 justify-end' }
function oe(e, t, a, i, g, D) {
  const o = h('VaButton'),
    y = h('VaButtonGroup'),
    P = h('VaDivider'),
    w = h('SalesPackageDetails'),
    k = h('SalesPackageForm'),
    c = h('VaDataTable'),
    S = h('VaCardContent'),
    v = h('VaCard'),
    L = h('VaModal')
  return (
    u(),
    N(
      _,
      null,
      [
        d(v, null, {
          default: r(() => [
            d(S, null, {
              default: r(() => [
                s('div', te, [
                  s('div', se, [
                    !e.showPackageList || e.showDetailsPage || e.showEditPackageForm
                      ? (u(),
                        C(
                          o,
                          { key: 0, class: 'px-2 py-2', icon: 'arrow_back', size: 'small', onClick: e.goBack },
                          { default: r(() => t[2] || (t[2] = [l(' Go Back ')])), _: 1 },
                          8,
                          ['onClick'],
                        ))
                      : V('', !0),
                  ]),
                  !e.showCreateNewPackageForm && !e.showDetailsPage && !e.showEditPackageForm
                    ? (u(),
                      C(
                        y,
                        { key: 0 },
                        {
                          default: r(() => [
                            d(
                              o,
                              {
                                class: 'px-2 py-2',
                                color: 'primary',
                                label: 'Add New Quota',
                                icon: 'add',
                                'border-color': 'primary',
                                round: '',
                                preset: 'secondary',
                                size: 'small',
                                onClick: e.showCreateNewPackaeListFormMethod,
                              },
                              { default: r(() => t[3] || (t[3] = [l(' Add a package ')])), _: 1 },
                              8,
                              ['onClick'],
                            ),
                          ]),
                          _: 1,
                        },
                      ))
                    : V('', !0),
                ]),
                d(P),
                e.showDetailsPage
                  ? (u(), C(w, { key: 0, item: e.selectItem }, null, 8, ['item']))
                  : e.showCreateNewPackageForm && !e.showDetailsPage
                    ? (u(), C(k, { key: 1 }))
                    : e.showEditPackageForm
                      ? (u(),
                        C(k, { key: 2, 'edit-mode': !0, 'edit-item': e.selectItem, onSaved: e.onEditSaved }, null, 8, [
                          'edit-item',
                          'onSaved',
                        ]))
                      : e.showPackageList
                        ? (u(),
                          C(
                            c,
                            {
                              key: 3,
                              items: e.packages,
                              columns: e.columns,
                              loading: e.loading,
                              hoverable: '',
                              striped: '',
                            },
                            {
                              'cell(actions)': r(({ rowData: m }) => [
                                s('div', ae, [
                                  d(
                                    o,
                                    {
                                      preset: 'plain',
                                      icon: 'visibility',
                                      title: 'View',
                                      onClick: (I) => e.showDetails(m),
                                    },
                                    null,
                                    8,
                                    ['onClick'],
                                  ),
                                  d(
                                    o,
                                    {
                                      preset: 'plain',
                                      icon: 'edit',
                                      color: 'warning',
                                      title: 'Edit',
                                      onClick: (I) => e.editPackage(m),
                                    },
                                    null,
                                    8,
                                    ['onClick'],
                                  ),
                                  d(
                                    o,
                                    {
                                      preset: 'plain',
                                      icon: 'delete',
                                      color: 'danger',
                                      title: 'Delete',
                                      onClick: (I) => e.confirmDelete(m),
                                    },
                                    null,
                                    8,
                                    ['onClick'],
                                  ),
                                ]),
                              ]),
                              _: 1,
                            },
                            8,
                            ['items', 'columns', 'loading'],
                          ))
                        : V('', !0),
              ]),
              _: 1,
            }),
          ]),
          _: 1,
        }),
        d(
          L,
          {
            modelValue: e.showDeleteModal,
            'onUpdate:modelValue': t[1] || (t[1] = (m) => (e.showDeleteModal = m)),
            'hide-default-actions': '',
          },
          {
            header: r(() => t[4] || (t[4] = [s('h3', { class: 'va-h6' }, 'Confirm Delete', -1)])),
            footer: r(() => [
              s('div', ie, [
                d(
                  o,
                  { preset: 'secondary', onClick: t[0] || (t[0] = (m) => (e.showDeleteModal = !1)) },
                  { default: r(() => t[7] || (t[7] = [l('Cancel')])), _: 1 },
                ),
                d(
                  o,
                  { color: 'danger', loading: e.deleting, onClick: e.deletePackage },
                  { default: r(() => t[8] || (t[8] = [l('Delete')])), _: 1 },
                  8,
                  ['loading', 'onClick'],
                ),
              ]),
            ]),
            default: r(() => {
              var m
              return [
                s('p', null, [
                  t[5] || (t[5] = l(' Are you sure you want to delete ')),
                  s('strong', null, n((m = e.itemToDelete) == null ? void 0 : m.name), 1),
                  t[6] || (t[6] = l('? ')),
                ]),
              ]
            }),
            _: 1,
          },
          8,
          ['modelValue'],
        ),
      ],
      64,
    )
  )
}
const fe = q(ee, [['render', oe]])
export { fe as default }
//# sourceMappingURL=ManageSalesPackage-DzPJaQov.js.map
