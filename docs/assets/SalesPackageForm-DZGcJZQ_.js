import { u as F } from './useForm-XQT-jLAz.js'
import {
  d as O,
  m as n,
  l as C,
  M as w,
  x as Q,
  y as $,
  z as B,
  A as E,
  B as v,
  s as r,
  _ as T,
  g as A,
  b as l,
  e as i,
  w as b,
  t as P,
  i as c,
  F as q,
  q as U,
  h as M,
  o as L,
} from './index-P4QeRV7n.js'
import { u as N } from './useToast-DVuIP6Z-.js'
import { h as _ } from './errorHandler-DijQ3xmc.js'
import { v as R } from './utils-BWc0LXoO.js'
import { u as g } from './quota-store-Bck9cnCu.js'
import { u as d } from './settings-store-BoS8g_yz.js'
import { u as D } from './price-list-store-CE2l0b9v.js'
import { u as H } from './regulatrory-store-DAcA9qfI.js'
const j = O({
    components: { VaForm: E, VaInput: B, VaSelect: $, VaButton: Q },
    props: { editMode: { type: Boolean, default: !1 }, editItem: { type: Object, default: null } },
    emits: ['saved'],
    setup() {
      const e = r(),
        { isValid: t, validate: a, resetValidation: o, reset: m } = F(e),
        { init: I } = N(),
        h = r(!1),
        p = v({ package_name: '', description: '', species: null, quantity: 1, area: null, licence: null }),
        f = v({ id: null, client_id: null, contact: '', contact_type: null, contactable: !1 }),
        y = r([]),
        S = r([]),
        V = r([]),
        k = r([]),
        s = r([]),
        u = r(0)
      return {
        formRef: e,
        form: p,
        contactForm: f,
        showEditForm: h,
        countries: y,
        nationality: S,
        categoryOptions: V,
        contactsTypes: k,
        clients: s,
        step: u,
        init: I,
        isValidForm: t,
        validateForm: a,
        resetValidationForm: o,
        resetForm: m,
        validators: R,
      }
    },
    data() {
      return {
        defaultColDef: { editable: !0 },
        settingsStore: d(),
        speciesOptions: [],
        areasOptions: [],
        saving: !1,
        regulatoryPackagesOptions: [],
        loadingLicenceOptions: !1,
        loading: !1,
        originalQuantities: v({}),
        quntityChangedsaved: !1,
      }
    },
    computed: { ...w(d, ['licenceAreaSpecies']), ...C(d, ['laodinglicenceAreaSpecies']) },
    mounted() {
      this.getLicencePackages(),
        this.getAreas(),
        (this.settingsStore.licenceAreaSpecies = []),
        this.editMode &&
          this.editItem &&
          ((this.form.package_name = this.editItem.name || ''),
          (this.form.description = this.editItem.description || ''),
          this.$nextTick(() => {
            this.editItem.regulatory_package &&
              (this.form.licence = {
                value: this.editItem.regulatory_package.id,
                text:
                  this.editItem.regulatory_package.name + '->' + this.editItem.regulatory_package.duration + ' days',
              }),
              this.editItem.area &&
                ((this.form.area = { value: this.editItem.area.id, text: this.editItem.area.name }),
                this.getLicenceAreaSpeciesList()),
              this.editItem.species &&
                this.editItem.species.length > 0 &&
                setTimeout(() => {
                  this.settingsStore.licenceAreaSpecies = this.editItem.species.map((e) => {
                    var t, a
                    return {
                      id: ((t = e.species) == null ? void 0 : t.id) || e.id,
                      name: ((a = e.species) == null ? void 0 : a.name) || e.name,
                      quantity: e.quantity || 1,
                    }
                  })
                }, 500)
          }))
    },
    methods: {
      ...n(g, ['getSpeciesList']),
      ...n(g, ['getAllSpeciesPerQuotaPerArea']),
      ...n(g, ['getAreaList']),
      ...n(d, ['getHuntingsTypes']),
      ...n(d, ['getCurrencies']),
      ...n(g, ['getQuotas']),
      ...n(D, ['createPriceList', 'createSalesPackage', 'getSalesPackageList', 'updateSalesPackage']),
      ...n(H, ['getRegulatoryPackages']),
      ...n(d, ['getHuntingLicenseAreaSpecies']),
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
          let a
          this.editMode && this.editItem
            ? ((a = await this.updateSalesPackage(this.editItem.id, t)),
              a.status === 200 &&
                ((this.saving = !1),
                this.init({ message: 'Package updated successfully.', color: 'success' }),
                this.$emit('saved')))
            : ((a = await this.createSalesPackage(t)),
              a.status === 201 &&
                ((this.saving = !1), this.init({ message: a.data.message, color: 'success' }), this.getSalesPackages()))
        } catch (a) {
          this.saving = !1
          const o = _(a.response)
          console.log(o), this.init({ message: a instanceof Error ? a.message : 'An error occurred', color: 'danger' })
        }
      },
      async getLicencePackages() {
        this.loadingLicenceOptions = !0
        try {
          const e = await this.getRegulatoryPackages()
          if (e.status === 200) {
            this.loadingLicenceOptions = !1
            const t = e.data
            this.regulatoryPackagesOptions = t.map((a) => ({
              value: a.id,
              text: a.name + '->' + a.duration + '  days',
            }))
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
            this.speciesOptions = a.map((o) => ({ value: o.id, text: o.name }))
          }
        } catch (t) {
          const a = _(t.response)
          console.log(a), this.init({ message: t instanceof Error ? t.message : 'An error occurred', color: 'danger' })
        }
      },
      async getSalesPackages() {
        this.loading = !0
        try {
          ;(await this.getSalesPackageList(!0)).status === 200 && (this.loading = !1)
        } catch (e) {
          console.log(e)
        }
      },
      onChange(e, t) {
        if (!(e in this.originalQuantities)) {
          const o = this.licenceAreaSpecies.find((m) => m.id === e)
          this.originalQuantities[e] = o.quantity
        }
        const a = this.licenceAreaSpecies.find((o) => o.id === e)
        a && ((a.quantity = t), (this.licenceAreaSpecies = [...this.licenceAreaSpecies])),
          this.init({
            message: `Quantity for ${a.name} has been updated to ${t} quantity(s).`,
            color: 'success',
            position: 'bottom-right',
          })
      },
    },
  }),
  z = { class: 'p-1' },
  W = { class: 'font-bold text-lg mb-4' },
  G = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4' },
  J = { class: 'grid grid-cols-1 md:grid-cols gap-4' },
  K = ['disabled'],
  X = { class: 'va-table' },
  Y = { class: 'mt-4 d-flex p-2' }
function Z(e, t, a, o, m, I) {
  const h = c('VaInput'),
    p = c('VaSelect'),
    f = c('VaTextarea'),
    y = c('VaForm'),
    S = c('VaCounter'),
    V = c('VaInnerLoading'),
    k = c('VaButton')
  return (
    L(),
    A(
      q,
      null,
      [
        l(
          y,
          { ref: 'formRef' },
          {
            default: b(() => [
              i('div', z, [
                i('h3', W, P(e.editMode ? 'Edit Package' : 'Create New Package'), 1),
                i('div', G, [
                  l(
                    h,
                    {
                      modelValue: e.form.package_name,
                      'onUpdate:modelValue': t[0] || (t[0] = (s) => (e.form.package_name = s)),
                      type: 'text',
                      placeholder: 'Enter Package Name',
                      rules: [(s) => (s && s.length > 0) || 'Package name is required'],
                      label: 'Package name',
                      'required-mark': '',
                    },
                    null,
                    8,
                    ['modelValue', 'rules'],
                  ),
                  l(
                    p,
                    {
                      modelValue: e.form.licence,
                      'onUpdate:modelValue': t[1] || (t[1] = (s) => (e.form.licence = s)),
                      label: 'Licence',
                      options: e.regulatoryPackagesOptions,
                      placeholder: 'Select Licence',
                      'required-mark': '',
                      rules: [(s) => !!s || 'Licence is required'],
                      required: '',
                    },
                    null,
                    8,
                    ['modelValue', 'options', 'rules'],
                  ),
                  l(
                    p,
                    {
                      modelValue: e.form.area,
                      'onUpdate:modelValue': [t[2] || (t[2] = (s) => (e.form.area = s)), e.getLicenceAreaSpeciesList],
                      label: 'Area',
                      options: e.areasOptions,
                      placeholder: 'Select area',
                      'required-mark': '',
                      rules: [(s) => !!s || 'Area is required'],
                      required: '',
                      disabled: e.laodinglicenceAreaSpecies || e.form.licence === null,
                      loading: e.laodinglicenceAreaSpecies,
                    },
                    null,
                    8,
                    ['modelValue', 'options', 'rules', 'disabled', 'loading', 'onUpdate:modelValue'],
                  ),
                ]),
                i('div', J, [
                  l(
                    f,
                    {
                      modelValue: e.form.description,
                      'onUpdate:modelValue': t[3] || (t[3] = (s) => (e.form.description = s)),
                      'max-length': '120',
                      label: 'Description',
                      counter: '',
                      'required-mark': '',
                      placeholder: 'Enter Description',
                      rules: [
                        (s) => (s && s.length > 0) || 'Required',
                        (s) => (s && s.length < 60) || 'Maximum 120 characters',
                      ],
                    },
                    null,
                    8,
                    ['modelValue', 'rules'],
                  ),
                ]),
              ]),
            ]),
            _: 1,
          },
          512,
        ),
        t[6] || (t[6] = i('h3', { class: 'font-bold text-lg mb-2' }, 'Species', -1)),
        l(
          V,
          { loading: e.laodinglicenceAreaSpecies, size: 30 },
          {
            default: b(() => [
              i(
                'div',
                { class: 'va-table-responsive', disabled: e.laodinglicenceAreaSpecies },
                [
                  i('table', X, [
                    t[5] ||
                      (t[5] = i(
                        'thead',
                        null,
                        [i('tr', null, [i('th', null, 'Name'), i('th', null, 'Quantity')])],
                        -1,
                      )),
                    i('tbody', null, [
                      (L(!0),
                      A(
                        q,
                        null,
                        U(
                          e.licenceAreaSpecies,
                          (s) => (
                            L(),
                            A('tr', { key: s.id }, [
                              i('td', null, P(s.name), 1),
                              i('td', null, [
                                l(
                                  S,
                                  {
                                    modelValue: s.quantity,
                                    'onUpdate:modelValue': [(u) => (s.quantity = u), (u) => e.onChange(s.id, u)],
                                    'increase-icon': 'add_circle_outline',
                                    'decrease-icon': 'remove_circle_outline',
                                    class: 'w-100 p-0',
                                    success: e.quntityChangedsaved,
                                    'manual-input': '',
                                    color: '#6938D1',
                                    max: '100',
                                    min: '0',
                                    'max-length': '3',
                                  },
                                  null,
                                  8,
                                  ['modelValue', 'onUpdate:modelValue', 'success'],
                                ),
                              ]),
                            ])
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]),
                ],
                8,
                K,
              ),
            ]),
            _: 1,
          },
          8,
          ['loading'],
        ),
        i('div', Y, [
          l(
            k,
            {
              icon: 'save',
              loading: e.saving,
              class: 'mr-3 mb-2',
              disabled: !e.isValidForm,
              onClick: t[4] || (t[4] = (s) => e.validateForm() && e.submit()),
            },
            { default: b(() => [M(P(e.editMode ? 'Update' : 'Save'), 1)]), _: 1 },
            8,
            ['loading', 'disabled'],
          ),
        ]),
      ],
      64,
    )
  )
}
const le = T(j, [['render', Z]])
export { le as S }
//# sourceMappingURL=SalesPackageForm-DZGcJZQ_.js.map
