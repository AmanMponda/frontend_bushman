import {
  d as pe,
  m as J,
  s as G,
  _ as ge,
  g as v,
  e as s,
  b as a,
  i as x,
  w as i,
  t as l,
  h as b,
  F as B,
  o as u,
  l as xe,
  a as V,
  v as C,
  q as Q,
  x as $e,
  y as Ae,
  z as Pe,
  A as Ee,
  k as X,
  B as ce,
  c as Ne,
  C as Le,
  n as Fe,
  D as le,
  E as de,
  f as Oe,
} from './index-P4QeRV7n.js'
import { u as qe } from './useForm-XQT-jLAz.js'
import { u as ye } from './useToast-DVuIP6Z-.js'
import { h as Ue } from './errorHandler-DijQ3xmc.js'
import { v as ze } from './utils-BWc0LXoO.js'
import { u as ue } from './sales-store-XaWtEIlK.js'
import { u as me } from './settings-store-BoS8g_yz.js'
import { u as fe } from './quota-store-Bck9cnCu.js'
import { d as Te } from './pdfDownloader-Cg_wDO9M.js'
import { u as je } from './price-list-store-CE2l0b9v.js'
import './format-Cn4G_mmc.js'
const Be = pe({
    name: 'SalesInquiriesList',
    emits: ['download-btn-pressed', 'view-btn-pressed', 'edit-btn-pressed', 'delete-btn-pressed'],
    setup() {
      const { init: e } = ye()
      return { notify: e }
    },
    data() {
      return {
        loading: G(!1),
        deleting: !1,
        showDeleteModal: !1,
        deleteItemId: null,
        deleteItemName: '',
        columns: [
          { key: 'name', label: 'Client Name', sortable: !0 },
          { key: 'area', label: 'Area', sortable: !0 },
          { key: 'hunting_type', label: 'Hunting Type', sortable: !0 },
          { key: 'start_date', label: 'Start Date', sortable: !0 },
          { key: 'end_date', label: 'End Date', sortable: !0 },
          { key: 'season', label: 'Season', sortable: !0 },
          { key: 'species_count', label: 'Species', width: 80 },
          { key: 'status', label: 'Status', width: 100 },
          { key: 'actions', label: 'Actions', width: 150 },
        ],
        salesInquiryItems: [],
        perPage: 10,
        currentPage: 1,
        filter: '',
        filtered: [],
        seasonValue: null,
        seasonOptions: [],
        dateValue: null,
        mothValue: null,
      }
    },
    computed: {
      pages() {
        return this.perPage && this.perPage !== 0
          ? Math.ceil(this.filtered.length / this.perPage)
          : this.filtered.length
      },
    },
    mounted() {
      this.getSalesInquiryList(), this.getSeasonOptions()
    },
    methods: {
      ...J(ue, ['getSalesInquiries', 'deleteSalesInquiry']),
      ...J(me, ['getSeasons']),
      formatDate(e) {
        if (!e || e === 'N/A') return 'N/A'
        const t = new Date(e)
        return isNaN(t.getTime())
          ? 'N/A'
          : t.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      },
      async getSalesInquiryList() {
        var e
        this.loading = !0
        try {
          const t = await this.getSalesInquiries(
            ((e = this.seasonValue) == null ? void 0 : e.value) ?? '',
            this.dateValue ?? '',
          )
          if (t.status === 200) {
            this.loading = !1
            const m = Array.isArray(t.data) ? t.data : t.data.data || []
            ;(this.salesInquiryItems = m.map((n) => {
              var D, q, U, A, y, T, L, E, d, f, S, I, N, R, F, O, H, Y, j, P, z, Z, ee, te, se, ae, oe, ne, ie, re, o, k
              const p =
                  ((D = n == null ? void 0 : n.inquiry_species) == null ? void 0 : D.length) ||
                  ((q = n == null ? void 0 : n.species) == null ? void 0 : q.length) ||
                  0,
                w = n == null ? void 0 : n.reference_price_list,
                c =
                  (y =
                    (A = (U = n == null ? void 0 : n.price_lists) == null ? void 0 : U[0]) == null
                      ? void 0
                      : A.price_list) == null
                    ? void 0
                    : y.price_list_type,
                _ = (w == null ? void 0 : w.amount) || (c == null ? void 0 : c.amount) || '0.00',
                h = ((T = c == null ? void 0 : c.currency) == null ? void 0 : T.symbol) || '$',
                r =
                  (w == null ? void 0 : w.area_name) ||
                  ((E = (L = n == null ? void 0 : n.inquiry_areas) == null ? void 0 : L[0]) == null
                    ? void 0
                    : E.area_name) ||
                  ((S = (f = (d = n == null ? void 0 : n.areas) == null ? void 0 : d[0]) == null ? void 0 : f.area) ==
                  null
                    ? void 0
                    : S.name) ||
                  'N/A',
                g =
                  (w == null ? void 0 : w.hunting_type_name) ||
                  ((I = c == null ? void 0 : c.hunting_type) == null ? void 0 : I.name) ||
                  'N/A'
              return {
                id: n.id,
                selfitem: n,
                code: (n == null ? void 0 : n.code) || '',
                name: ((N = n == null ? void 0 : n.entity) == null ? void 0 : N.full_name) || 'N/A',
                area: r,
                hunting_type: g,
                price: `${h}${parseFloat(_).toFixed(2)}`,
                start_date:
                  ((R = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : R.start_date) || 'N/A',
                end_date: ((F = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : F.end_date) || 'N/A',
                season: ((O = n == null ? void 0 : n.season) == null ? void 0 : O.name) || 'N/A',
                species_count: p,
                status: (n == null ? void 0 : n.status) || 'PENDING',
                country:
                  ((Y = (H = n == null ? void 0 : n.entity) == null ? void 0 : H.country) == null ? void 0 : Y.name) ||
                  ((j = n == null ? void 0 : n.entity) == null ? void 0 : j.country_name) ||
                  'N/A',
                nationality:
                  ((z = (P = n == null ? void 0 : n.entity) == null ? void 0 : P.nationality) == null
                    ? void 0
                    : z.name) ||
                  ((Z = n == null ? void 0 : n.entity) == null ? void 0 : Z.nationality_name) ||
                  'N/A',
                contacts: ((ee = n == null ? void 0 : n.entity) == null ? void 0 : ee.contacts) || [],
                preference: {
                  no_of_hunters:
                    ((te = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : te.no_of_hunters) || 0,
                  no_of_observers:
                    ((se = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : se.no_of_observers) || 0,
                  no_of_days:
                    ((ae = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : ae.no_of_days) || 0,
                  no_of_companions:
                    ((oe = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : oe.no_of_companions) || 0,
                  special_requests:
                    ((ne = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : ne.special_requests) || '',
                  start_date:
                    ((ie = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : ie.start_date) || '',
                  end_date: ((re = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : re.end_date) || '',
                  budget_estimation:
                    ((o = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : o.budget_estimation) || '',
                  preferred_date:
                    ((k = n == null ? void 0 : n.formatted_preferences) == null ? void 0 : k.preferred_date) || '',
                },
                reference_price_list: w,
                inquiry_species: (n == null ? void 0 : n.inquiry_species) || [],
                inquiry_areas: (n == null ? void 0 : n.inquiry_areas) || [],
              }
            })),
              (this.filtered = this.salesInquiryItems)
          }
        } catch (t) {
          ;(this.loading = !1), console.log(t)
        }
      },
      async getSeasonOptions() {
        const e = await this.getSeasons()
        e.status === 200 && (this.seasonOptions = e.data.map((t) => ({ value: t.id, text: t.name })))
      },
      btnDownloadClicked(e) {
        console.log(e), this.$emit('download-btn-pressed', e)
      },
      downloadPdf(e) {
        const m = `https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/sales/sales-inquiries-pdf/${e.id}`
        window.open(m, '_blank')
      },
      async downloadInquiryPdf(e) {
        const t = e.id
        try {
          const n = await (
            await fetch(`https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/sales/sales-inquiries/${t}/pdf`, {
              headers: { 'Content-Type': 'application/json' },
            })
          ).json()
          if (n.success && n.pdf) {
            const p = atob(n.pdf),
              w = new Array(p.length)
            for (let g = 0; g < p.length; g++) w[g] = p.charCodeAt(g)
            const c = new Uint8Array(w),
              _ = new Blob([c], { type: 'application/pdf' }),
              h = window.URL.createObjectURL(_),
              r = document.createElement('a')
            ;(r.href = h),
              (r.download = `inquiry-${e.code || t}.pdf`),
              document.body.appendChild(r),
              r.click(),
              document.body.removeChild(r),
              window.URL.revokeObjectURL(h),
              this.notify({ message: 'PDF downloaded successfully', color: 'success' })
          } else this.notify({ message: 'Failed to generate PDF', color: 'danger' })
        } catch (m) {
          console.error('Error downloading PDF:', m), this.notify({ message: 'Error downloading PDF', color: 'danger' })
        }
      },
      btnViewClicked(e) {
        console.log(e), this.$emit('view-btn-pressed', e)
      },
      btnEditClicked(e) {
        console.log(e), this.$emit('edit-btn-pressed', e)
      },
      showDeleteConfirm(e) {
        ;(this.deleteItemId = e.id), (this.deleteItemName = e.name), (this.showDeleteModal = !0)
      },
      cancelDelete() {
        ;(this.showDeleteModal = !1), (this.deleteItemId = null), (this.deleteItemName = '')
      },
      async confirmDelete() {
        var e, t
        if (this.deleteItemId) {
          this.deleting = !0
          try {
            const m = await this.deleteSalesInquiry(this.deleteItemId)
            ;(m.status === 200 || m.status === 204) &&
              (this.notify({ message: 'Inquiry deleted successfully', color: 'success' }), this.getSalesInquiryList())
          } catch (m) {
            console.error('Error deleting inquiry:', m),
              this.notify({
                message:
                  ((t = (e = m.response) == null ? void 0 : e.data) == null ? void 0 : t.message) ||
                  'Failed to delete inquiry',
                color: 'danger',
              })
          } finally {
            ;(this.deleting = !1), (this.showDeleteModal = !1), (this.deleteItemId = null), (this.deleteItemName = '')
          }
        }
      },
    },
  }),
  Me = { class: 'grid sm:grid-cols-3 gap-6 mb-6' },
  Re = { class: 'font-semibold text-gray-900' },
  He = { class: 'flex items-center gap-1' },
  Qe = { class: 'text-gray-700' },
  Ye = { class: 'text-gray-700' },
  Ge = { class: 'text-gray-700' },
  We = { class: 'flex items-center gap-1' },
  Je = { colspan: '9' },
  Ke = { class: 'flex justify-center mt-4' },
  Xe = { class: 'flex gap-2 justify-end' }
function Ze(e, t, m, n, p, w) {
  const c = x('VaSelect'),
    _ = x('VaDateInput'),
    h = x('VaInput'),
    r = x('VaIcon'),
    g = x('VaBadge'),
    D = x('VaButton'),
    q = x('VaPagination'),
    U = x('VaDataTable'),
    A = x('VaModal')
  return (
    u(),
    v(
      B,
      null,
      [
        s('div', Me, [
          a(
            c,
            {
              modelValue: e.seasonValue,
              'onUpdate:modelValue': [t[0] || (t[0] = (y) => (e.seasonValue = y)), e.getSalesInquiryList],
              options: e.seasonOptions,
              placeholder: 'Filter By Season',
            },
            null,
            8,
            ['modelValue', 'options', 'onUpdate:modelValue'],
          ),
          a(
            _,
            {
              modelValue: e.dateValue,
              'onUpdate:modelValue': [t[1] || (t[1] = (y) => (e.dateValue = y)), e.getSalesInquiryList],
              placeholder: 'Filter By Date',
              clearable: '',
            },
            null,
            8,
            ['modelValue', 'onUpdate:modelValue'],
          ),
          a(
            h,
            {
              modelValue: e.filter,
              'onUpdate:modelValue': [t[2] || (t[2] = (y) => (e.filter = y)), e.getSalesInquiryList],
              placeholder: 'Search',
              clearable: '',
            },
            null,
            8,
            ['modelValue', 'onUpdate:modelValue'],
          ),
        ]),
        a(
          U,
          {
            striped: '',
            loading: e.loading,
            items: e.salesInquiryItems,
            columns: e.columns,
            'per-page': e.perPage,
            'current-page': e.currentPage,
            filter: e.filter,
            onFiltered: t[4] || (t[4] = (y) => (e.filtered = y.items)),
          },
          {
            'cell(name)': i(({ rowData: y }) => [s('span', Re, l(y.name), 1)]),
            'cell(area)': i(({ rowData: y }) => [
              s('div', He, [
                a(r, { name: 'location_on', size: 'small', color: 'primary' }),
                s('span', null, l(y.area), 1),
              ]),
            ]),
            'cell(start_date)': i(({ rowData: y }) => [s('span', Qe, l(e.formatDate(y.start_date)), 1)]),
            'cell(end_date)': i(({ rowData: y }) => [s('span', Ye, l(e.formatDate(y.end_date)), 1)]),
            'cell(season)': i(({ rowData: y }) => [s('span', Ge, l(y.season), 1)]),
            'cell(species_count)': i(({ rowData: y }) => [
              a(g, { text: String(y.species_count), color: 'success' }, null, 8, ['text']),
            ]),
            'cell(status)': i(({ rowData: y }) => [
              a(
                g,
                {
                  text: y.status,
                  color: y.status === 'ACTIVE' ? 'success' : y.status === 'PENDING' ? 'warning' : 'info',
                },
                null,
                8,
                ['text', 'color'],
              ),
            ]),
            'cell(actions)': i(({ rowData: y }) => [
              s('div', We, [
                a(
                  D,
                  { preset: 'plain', icon: 'visibility', size: 'small', onClick: (T) => e.btnViewClicked(y) },
                  null,
                  8,
                  ['onClick'],
                ),
                a(
                  D,
                  {
                    preset: 'plain',
                    icon: 'edit',
                    size: 'small',
                    color: 'warning',
                    onClick: (T) => e.btnEditClicked(y),
                  },
                  null,
                  8,
                  ['onClick'],
                ),
                a(
                  D,
                  {
                    preset: 'plain',
                    icon: 'delete',
                    size: 'small',
                    color: 'danger',
                    onClick: (T) => e.showDeleteConfirm(y),
                  },
                  null,
                  8,
                  ['onClick'],
                ),
              ]),
            ]),
            bodyAppend: i(() => [
              s('tr', null, [
                s('td', Je, [
                  s('div', Ke, [
                    a(
                      q,
                      {
                        modelValue: e.currentPage,
                        'onUpdate:modelValue': t[3] || (t[3] = (y) => (e.currentPage = y)),
                        pages: e.pages,
                      },
                      null,
                      8,
                      ['modelValue', 'pages'],
                    ),
                  ]),
                ]),
              ]),
            ]),
            _: 1,
          },
          8,
          ['loading', 'items', 'columns', 'per-page', 'current-page', 'filter'],
        ),
        a(
          A,
          {
            modelValue: e.showDeleteModal,
            'onUpdate:modelValue': t[5] || (t[5] = (y) => (e.showDeleteModal = y)),
            title: 'Delete Inquiry',
            size: 'small',
            onOk: e.confirmDelete,
            onCancel: e.cancelDelete,
          },
          {
            footer: i(() => [
              s('div', Xe, [
                a(
                  D,
                  { preset: 'secondary', onClick: e.cancelDelete },
                  { default: i(() => t[8] || (t[8] = [b('Cancel')])), _: 1 },
                  8,
                  ['onClick'],
                ),
                a(
                  D,
                  { color: 'danger', loading: e.deleting, onClick: e.confirmDelete },
                  { default: i(() => t[9] || (t[9] = [b('Delete')])), _: 1 },
                  8,
                  ['loading', 'onClick'],
                ),
              ]),
            ]),
            default: i(() => [
              s('p', null, [
                t[6] || (t[6] = b(' Are you sure you want to delete the inquiry for "')),
                s('strong', null, l(e.deleteItemName), 1),
                t[7] || (t[7] = b('"? ')),
              ]),
              t[10] || (t[10] = s('p', { class: 'text-sm text-gray-500 mt-2' }, 'This action cannot be undone.', -1)),
            ]),
            _: 1,
          },
          8,
          ['modelValue', 'onOk', 'onCancel'],
        ),
      ],
      64,
    )
  )
}
const et = ge(Be, [['render', Ze]]),
  tt = pe({
    name: 'SalesInquiryDetails',
    props: { item: { type: Object, required: !0 } },
    setup() {
      const { init: e } = ye()
      return { notify: e }
    },
    computed: { ...xe(ue, ['observers', 'companions', 'clientSafariExtras', 'accommodations', 'chartersPrices']) },
    mounted() {
      this.getObservers(this.item.id),
        this.getCompanions(this.item.id),
        this.getClienSafariExtras(this.item.id),
        this.getAccommodation(this.item.id),
        this.getChartersPrice(this.item.id)
    },
    methods: {
      ...J(ue, ['getObservers', 'getCompanions', 'getClienSafariExtras', 'getAccommodation', 'getChartersPrice']),
      async downloadInquiryPdf() {
        var t, m
        const e = (t = this.item) == null ? void 0 : t.id
        if (e)
          try {
            const p = await (
              await fetch(
                `https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/sales/sales-inquiries/${e}/pdf`,
                { headers: { 'Content-Type': 'application/json' } },
              )
            ).json()
            if (p.success && p.pdf) {
              const w = atob(p.pdf),
                c = new Array(w.length)
              for (let D = 0; D < w.length; D++) c[D] = w.charCodeAt(D)
              const _ = new Uint8Array(c),
                h = new Blob([_], { type: 'application/pdf' }),
                r = window.URL.createObjectURL(h),
                g = document.createElement('a')
              ;(g.href = r),
                (g.download = `inquiry-${((m = this.item) == null ? void 0 : m.code) || e}.pdf`),
                document.body.appendChild(g),
                g.click(),
                document.body.removeChild(g),
                window.URL.revokeObjectURL(r),
                this.notify({ message: 'PDF downloaded successfully', color: 'success' })
            } else this.notify({ message: 'Failed to generate PDF', color: 'danger' })
          } catch (n) {
            console.error('Error downloading PDF:', n),
              this.notify({ message: 'Error downloading PDF', color: 'danger' })
          }
      },
      formatDate(e) {
        return e ? new Date(e).toLocaleDateString() : 'Not provided'
      },
      formatCurrency(e) {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
          parseFloat(e) || 0,
        )
      },
      getContactIcon(e) {
        return { email: 'email', phone_number: 'phone', phone: 'phone', address: 'home' }[e] || 'info'
      },
      safeArray(e) {
        return e || []
      },
      safeString(e, t = 'Not provided') {
        return e || t
      },
    },
  }),
  st = { class: 'sales-inquiry-details' },
  at = { class: 'text-center' },
  ot = { class: 'va-h3 mb-2' },
  nt = { class: 'flex justify-center items-center gap-4 mb-3' },
  it = { class: 'text-secondary mb-3' },
  rt = { class: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-6' },
  lt = { class: 'text-3xl font-bold' },
  dt = { class: 'text-3xl font-bold' },
  mt = { class: 'text-3xl font-bold' },
  ut = { class: 'text-3xl font-bold' },
  ct = { class: 'grid grid-cols-1 md:grid-cols-3 gap-6' },
  ft = { class: 'text-lg font-semibold' },
  pt = { class: 'text-lg font-semibold' },
  gt = { class: 'text-lg font-semibold' },
  yt = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  ht = { class: 'font-medium' },
  _t = { class: 'grid grid-cols-1 md:grid-cols-4 gap-6' },
  bt = { class: 'text-lg font-semibold' },
  vt = { class: 'text-lg font-semibold' },
  kt = { class: 'text-lg font-semibold' },
  St = { class: 'text-lg font-semibold' },
  wt = { class: 'grid grid-cols-1 md:grid-cols-4 gap-4 mb-4' },
  Dt = { class: 'text-3xl font-bold text-primary' },
  It = { class: 'text-2xl font-bold' },
  Vt = { class: 'text-lg font-bold' },
  Ct = { class: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
  qt = { class: 'text-lg font-semibold' },
  xt = { class: 'text-lg font-semibold' },
  $t = { key: 0, class: 'mb-4' },
  At = { class: 'flex flex-wrap gap-2' },
  Pt = { key: 1 },
  Et = { class: 'grid grid-cols-1 md:grid-cols-3 gap-3' },
  Nt = { class: 'flex justify-between items-center' },
  Lt = { class: 'font-semibold' },
  Ft = { class: 'grid grid-cols-1 md:grid-cols-3 gap-3' },
  Ot = { class: 'flex justify-between items-start' },
  Ut = { class: 'flex-1' },
  zt = { class: 'font-semibold text-base' },
  Tt = { class: 'text-sm text-secondary italic' },
  jt = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  Bt = { class: 'font-semibold text-lg mb-2' },
  Mt = { class: 'grid grid-cols-2 gap-2 text-sm' },
  Rt = { class: 'ml-1 font-medium' },
  Ht = { class: 'ml-1 font-medium' },
  Qt = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  Yt = { class: 'font-semibold text-lg mb-2' },
  Gt = { class: 'grid grid-cols-2 gap-2 text-sm' },
  Wt = { class: 'ml-1 font-medium' },
  Jt = { class: 'ml-1 font-medium' },
  Kt = { class: 'va-table-responsive' },
  Xt = { class: 'va-table va-table--hoverable w-full' },
  Zt = { class: 'font-semibold' },
  es = { class: 'text-secondary' },
  ts = { class: 'va-table-responsive' },
  ss = { class: 'va-table va-table--hoverable w-full' },
  as = { class: 'font-semibold' },
  os = { class: 'text-secondary' },
  ns = { class: 'text-center' },
  is = { class: 'text-center' },
  rs = { class: 'va-table-responsive' },
  ls = { class: 'va-table va-table--hoverable w-full' },
  ds = { class: 'font-semibold' },
  ms = { class: 'text-secondary' },
  us = { class: 'text-right font-bold' }
function cs(e, t, m, n, p, w) {
  var A, y, T, L, E
  const c = x('VaIcon'),
    _ = x('VaChip'),
    h = x('VaButton'),
    r = x('VaCardContent'),
    g = x('VaCard'),
    D = x('VaCardTitle'),
    q = x('VaDivider'),
    U = x('VaBadge')
  return (
    u(),
    v('div', st, [
      a(
        g,
        { class: 'mb-6', stripe: '', 'stripe-color': 'primary' },
        {
          default: i(() => [
            a(r, null, {
              default: i(() => {
                var d, f, S
                return [
                  s('div', at, [
                    s('h1', ot, l((d = e.item) == null ? void 0 : d.code), 1),
                    s('div', nt, [
                      a(
                        _,
                        {
                          color: ((f = e.item) == null ? void 0 : f.inquiry_type) === 'standard' ? 'success' : 'info',
                          size: 'large',
                        },
                        {
                          default: i(() => {
                            var I, N
                            return [
                              a(
                                c,
                                {
                                  name:
                                    ((I = e.item) == null ? void 0 : I.inquiry_type) === 'standard'
                                      ? 'inventory_2'
                                      : 'tune',
                                  class: 'mr-1',
                                },
                                null,
                                8,
                                ['name'],
                              ),
                              b(
                                ' ' +
                                  l(
                                    ((N = e.item) == null ? void 0 : N.inquiry_type) === 'standard'
                                      ? 'Standard Package'
                                      : 'Custom Package',
                                  ),
                                1,
                              ),
                            ]
                          }),
                          _: 1,
                        },
                        8,
                        ['color'],
                      ),
                      a(
                        _,
                        { color: 'primary', size: 'large' },
                        {
                          default: i(() => {
                            var I, N
                            return [
                              a(c, { name: 'calendar_month', class: 'mr-1' }),
                              b(' ' + l((N = (I = e.item) == null ? void 0 : I.season) == null ? void 0 : N.name), 1),
                            ]
                          }),
                          _: 1,
                        },
                      ),
                    ]),
                    s('p', it, [
                      a(c, { name: 'event', size: 'small' }),
                      b(' Created: ' + l(e.formatDate((S = e.item) == null ? void 0 : S.create_date)), 1),
                    ]),
                    a(
                      h,
                      { color: 'secondary', round: '', icon: 'download', onClick: e.downloadInquiryPdf },
                      { default: i(() => t[0] || (t[0] = [b(' Download PDF ')])), _: 1 },
                      8,
                      ['onClick'],
                    ),
                  ]),
                ]
              }),
              _: 1,
            }),
          ]),
          _: 1,
        },
      ),
      s('div', rt, [
        a(
          g,
          { stripe: '', 'stripe-color': 'primary' },
          {
            default: i(() => [
              a(
                r,
                { class: 'text-center' },
                {
                  default: i(() => {
                    var d, f
                    return [
                      a(c, { name: 'schedule', size: 'large', color: 'primary', class: 'mb-2' }),
                      s(
                        'div',
                        lt,
                        l(
                          ((f = (d = e.item) == null ? void 0 : d.formatted_preferences) == null
                            ? void 0
                            : f.no_of_days) || 'N/A',
                        ),
                        1,
                      ),
                      t[1] || (t[1] = s('div', { class: 'text-sm text-secondary mt-1' }, 'Days Duration', -1)),
                    ]
                  }),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
        ),
        a(
          g,
          { stripe: '', 'stripe-color': 'success' },
          {
            default: i(() => [
              a(
                r,
                { class: 'text-center' },
                {
                  default: i(() => {
                    var d, f
                    return [
                      a(c, { name: 'person', size: 'large', color: 'success', class: 'mb-2' }),
                      s(
                        'div',
                        dt,
                        l(
                          ((f = (d = e.item) == null ? void 0 : d.formatted_preferences) == null
                            ? void 0
                            : f.no_of_hunters) || 0,
                        ),
                        1,
                      ),
                      t[2] || (t[2] = s('div', { class: 'text-sm text-secondary mt-1' }, 'Hunters', -1)),
                    ]
                  }),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
        ),
        a(
          g,
          { stripe: '', 'stripe-color': 'warning' },
          {
            default: i(() => [
              a(
                r,
                { class: 'text-center' },
                {
                  default: i(() => {
                    var d, f
                    return [
                      a(c, { name: 'groups', size: 'large', color: 'warning', class: 'mb-2' }),
                      s(
                        'div',
                        mt,
                        l(
                          ((f = (d = e.item) == null ? void 0 : d.formatted_preferences) == null
                            ? void 0
                            : f.no_of_companions) || 0,
                        ),
                        1,
                      ),
                      t[3] || (t[3] = s('div', { class: 'text-sm text-secondary mt-1' }, 'Companions', -1)),
                    ]
                  }),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
        ),
        a(
          g,
          { stripe: '', 'stripe-color': 'info' },
          {
            default: i(() => [
              a(
                r,
                { class: 'text-center' },
                {
                  default: i(() => {
                    var d, f
                    return [
                      a(c, { name: 'visibility', size: 'large', color: 'info', class: 'mb-2' }),
                      s(
                        'div',
                        ut,
                        l(
                          ((f = (d = e.item) == null ? void 0 : d.formatted_preferences) == null
                            ? void 0
                            : f.no_of_observers) || 0,
                        ),
                        1,
                      ),
                      t[4] || (t[4] = s('div', { class: 'text-sm text-secondary mt-1' }, 'Observers', -1)),
                    ]
                  }),
                  _: 1,
                },
              ),
            ]),
            _: 1,
          },
        ),
      ]),
      a(
        g,
        { class: 'mb-6', stripe: '', 'stripe-color': 'success' },
        {
          default: i(() => [
            a(
              D,
              { class: 'flex items-center gap-2' },
              { default: i(() => [a(c, { name: 'person' }), t[5] || (t[5] = b(' Client Information '))]), _: 1 },
            ),
            a(r, null, {
              default: i(() => {
                var d, f, S, I, N, R, F, O, H, Y
                return [
                  s('div', ct, [
                    s('div', null, [
                      t[6] || (t[6] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Full Name', -1)),
                      s(
                        'div',
                        ft,
                        l(e.safeString((f = (d = e.item) == null ? void 0 : d.entity) == null ? void 0 : f.full_name)),
                        1,
                      ),
                    ]),
                    s('div', null, [
                      t[7] || (t[7] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Nationality', -1)),
                      s(
                        'div',
                        pt,
                        l(
                          e.safeString(
                            (N = (I = (S = e.item) == null ? void 0 : S.entity) == null ? void 0 : I.nationality) ==
                              null
                              ? void 0
                              : N.name,
                          ),
                        ),
                        1,
                      ),
                    ]),
                    s('div', null, [
                      t[8] || (t[8] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Country', -1)),
                      s(
                        'div',
                        gt,
                        l(
                          e.safeString(
                            (O = (F = (R = e.item) == null ? void 0 : R.entity) == null ? void 0 : F.country) == null
                              ? void 0
                              : O.name,
                          ),
                        ),
                        1,
                      ),
                    ]),
                  ]),
                  a(q, { class: 'my-4' }),
                  t[9] || (t[9] = s('div', { class: 'text-sm text-secondary mb-2' }, 'Contacts', -1)),
                  s('div', yt, [
                    (u(!0),
                    v(
                      B,
                      null,
                      Q(
                        e.safeArray((Y = (H = e.item) == null ? void 0 : H.entity) == null ? void 0 : Y.contacts),
                        (j, P) => {
                          var z
                          return (
                            u(),
                            v('div', { key: P, class: 'flex items-center gap-2 p-3 bg-gray-50 rounded-lg' }, [
                              a(
                                c,
                                {
                                  name: e.getContactIcon((z = j.contact_type) == null ? void 0 : z.name),
                                  color: 'primary',
                                },
                                null,
                                8,
                                ['name'],
                              ),
                              s('span', ht, l(j.contact), 1),
                            ])
                          )
                        },
                      ),
                      128,
                    )),
                  ]),
                ]
              }),
              _: 1,
            }),
          ]),
          _: 1,
        },
      ),
      a(
        g,
        { class: 'mb-6', stripe: '', 'stripe-color': 'warning' },
        {
          default: i(() => [
            a(
              D,
              { class: 'flex items-center gap-2' },
              { default: i(() => [a(c, { name: 'event' }), t[10] || (t[10] = b(' Hunting Preferences '))]), _: 1 },
            ),
            a(r, null, {
              default: i(() => {
                var d, f, S, I, N, R, F, O
                return [
                  s('div', _t, [
                    s('div', null, [
                      t[11] || (t[11] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Preferred Date', -1)),
                      s(
                        'div',
                        bt,
                        l(
                          e.formatDate(
                            (f = (d = e.item) == null ? void 0 : d.formatted_preferences) == null
                              ? void 0
                              : f.preferred_date,
                          ),
                        ),
                        1,
                      ),
                    ]),
                    s('div', null, [
                      t[12] || (t[12] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Start Date', -1)),
                      s(
                        'div',
                        vt,
                        l(
                          e.formatDate(
                            (I = (S = e.item) == null ? void 0 : S.formatted_preferences) == null
                              ? void 0
                              : I.start_date,
                          ),
                        ),
                        1,
                      ),
                    ]),
                    s('div', null, [
                      t[13] || (t[13] = s('div', { class: 'text-sm text-secondary mb-1' }, 'End Date', -1)),
                      s(
                        'div',
                        kt,
                        l(
                          e.formatDate(
                            (R = (N = e.item) == null ? void 0 : N.formatted_preferences) == null ? void 0 : R.end_date,
                          ),
                        ),
                        1,
                      ),
                    ]),
                    s('div', null, [
                      t[14] || (t[14] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Duration', -1)),
                      s(
                        'div',
                        St,
                        l(
                          ((O = (F = e.item) == null ? void 0 : F.formatted_preferences) == null
                            ? void 0
                            : O.no_of_days) || 'N/A',
                        ) + ' days',
                        1,
                      ),
                    ]),
                  ]),
                ]
              }),
              _: 1,
            }),
          ]),
          _: 1,
        },
      ),
      ((A = e.item) == null ? void 0 : A.inquiry_type) === 'standard' && (y = e.item) != null && y.package_details
        ? (u(),
          V(
            g,
            { key: 0, class: 'mb-6', stripe: '', 'stripe-color': 'success' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [
                      a(c, { name: 'inventory_2' }),
                      t[15] || (t[15] = b(' Standard Package Details ')),
                    ]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => {
                    var d, f, S, I, N, R
                    return [
                      s('div', wt, [
                        a(
                          g,
                          { stripe: '', 'stripe-color': 'primary', class: 'col-span-1 md:col-span-2' },
                          {
                            default: i(() => [
                              a(
                                r,
                                { class: 'text-center' },
                                {
                                  default: i(() => {
                                    var F, O, H, Y
                                    return [
                                      a(c, { name: 'attach_money', size: 'large', color: 'primary', class: 'mb-2' }),
                                      s(
                                        'div',
                                        Dt,
                                        l(
                                          (O = (F = e.item) == null ? void 0 : F.package_details) == null
                                            ? void 0
                                            : O.currency_name,
                                        ) +
                                          ' ' +
                                          l(
                                            e.formatCurrency(
                                              (Y = (H = e.item) == null ? void 0 : H.package_details) == null
                                                ? void 0
                                                : Y.amount,
                                            ),
                                          ),
                                        1,
                                      ),
                                      t[16] ||
                                        (t[16] = s(
                                          'div',
                                          { class: 'text-sm text-secondary mt-1' },
                                          'Package Amount',
                                          -1,
                                        )),
                                    ]
                                  }),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                        a(
                          g,
                          { stripe: '', 'stripe-color': 'info' },
                          {
                            default: i(() => [
                              a(
                                r,
                                { class: 'text-center' },
                                {
                                  default: i(() => {
                                    var F, O
                                    return [
                                      a(c, { name: 'schedule', size: 'large', color: 'info', class: 'mb-2' }),
                                      s(
                                        'div',
                                        It,
                                        l(
                                          (O = (F = e.item) == null ? void 0 : F.package_details) == null
                                            ? void 0
                                            : O.duration,
                                        ),
                                        1,
                                      ),
                                      t[17] || (t[17] = s('div', { class: 'text-sm text-secondary mt-1' }, 'Days', -1)),
                                    ]
                                  }),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                        a(
                          g,
                          { stripe: '', 'stripe-color': 'warning' },
                          {
                            default: i(() => [
                              a(
                                r,
                                { class: 'text-center' },
                                {
                                  default: i(() => {
                                    var F, O
                                    return [
                                      a(c, { name: 'category', size: 'large', color: 'warning', class: 'mb-2' }),
                                      s(
                                        'div',
                                        Vt,
                                        l(
                                          (O = (F = e.item) == null ? void 0 : F.package_details) == null
                                            ? void 0
                                            : O.hunting_type_name,
                                        ),
                                        1,
                                      ),
                                      t[18] ||
                                        (t[18] = s(
                                          'div',
                                          { class: 'text-sm text-secondary mt-1' },
                                          'Hunting Type',
                                          -1,
                                        )),
                                    ]
                                  }),
                                  _: 1,
                                },
                              ),
                            ]),
                            _: 1,
                          },
                        ),
                      ]),
                      s('div', Ct, [
                        s('div', null, [
                          t[19] || (t[19] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Hunting Area', -1)),
                          s(
                            'div',
                            qt,
                            l((f = (d = e.item) == null ? void 0 : d.package_details) == null ? void 0 : f.area_name),
                            1,
                          ),
                        ]),
                        s('div', null, [
                          t[20] || (t[20] = s('div', { class: 'text-sm text-secondary mb-1' }, 'Package Period', -1)),
                          s(
                            'div',
                            xt,
                            l(
                              e.formatDate(
                                (I = (S = e.item) == null ? void 0 : S.package_details) == null ? void 0 : I.start_date,
                              ),
                            ) +
                              ' - ' +
                              l(
                                e.formatDate(
                                  (R = (N = e.item) == null ? void 0 : N.package_details) == null ? void 0 : R.end_date,
                                ),
                              ),
                            1,
                          ),
                        ]),
                      ]),
                    ]
                  }),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      ((T = e.item) == null ? void 0 : T.inquiry_type) === 'custom' && (L = e.item) != null && L.custom_details
        ? (u(),
          V(
            g,
            { key: 1, class: 'mb-6', stripe: '', 'stripe-color': 'info' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [a(c, { name: 'tune' }), t[21] || (t[21] = b(' Custom Package Details '))]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => {
                    var d, f, S, I, N, R, F, O
                    return [
                      e.safeArray((f = (d = e.item) == null ? void 0 : d.custom_details) == null ? void 0 : f.areas)
                        .length > 0
                        ? (u(),
                          v('div', $t, [
                            t[22] || (t[22] = s('div', { class: 'text-sm text-secondary mb-2' }, 'Hunting Areas', -1)),
                            s('div', At, [
                              (u(!0),
                              v(
                                B,
                                null,
                                Q(
                                  (I = (S = e.item) == null ? void 0 : S.custom_details) == null ? void 0 : I.areas,
                                  (H, Y) => (
                                    u(),
                                    V(
                                      _,
                                      { key: Y, color: 'info', size: 'large' },
                                      {
                                        default: i(() => [
                                          a(c, { name: 'location_on', class: 'mr-1' }),
                                          b(' ' + l(H.area_name), 1),
                                        ]),
                                        _: 2,
                                      },
                                      1024,
                                    )
                                  ),
                                ),
                                128,
                              )),
                            ]),
                          ]))
                        : C('', !0),
                      e.safeArray((R = (N = e.item) == null ? void 0 : N.custom_details) == null ? void 0 : R.species)
                        .length > 0
                        ? (u(),
                          v('div', Pt, [
                            t[23] ||
                              (t[23] = s('div', { class: 'text-sm text-secondary mb-2' }, 'Requested Species', -1)),
                            s('div', Et, [
                              (u(!0),
                              v(
                                B,
                                null,
                                Q(
                                  (O = (F = e.item) == null ? void 0 : F.custom_details) == null ? void 0 : O.species,
                                  (H, Y) => (
                                    u(),
                                    V(
                                      g,
                                      { key: Y, color: '#f0f9ff' },
                                      {
                                        default: i(() => [
                                          a(
                                            r,
                                            null,
                                            {
                                              default: i(() => [
                                                s('div', Nt, [
                                                  s('div', Lt, l(H.species_name), 1),
                                                  a(
                                                    U,
                                                    { color: 'success' },
                                                    { default: i(() => [b('Qty: ' + l(H.quantity), 1)]), _: 2 },
                                                    1024,
                                                  ),
                                                ]),
                                              ]),
                                              _: 2,
                                            },
                                            1024,
                                          ),
                                        ]),
                                        _: 2,
                                      },
                                      1024,
                                    )
                                  ),
                                ),
                                128,
                              )),
                            ]),
                          ]))
                        : C('', !0),
                    ]
                  }),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      e.safeArray((E = e.item) == null ? void 0 : E.species).length > 0
        ? (u(),
          V(
            g,
            { key: 2, class: 'mb-6', stripe: '', 'stripe-color': 'warning' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => {
                      var d, f, S
                      return [
                        a(c, { name: 'pets' }),
                        b(
                          ' ' +
                            l(
                              ((d = e.item) == null ? void 0 : d.inquiry_type) === 'custom'
                                ? 'Additional Species'
                                : 'Package Species',
                            ) +
                            ' (' +
                            l(((S = (f = e.item) == null ? void 0 : f.species) == null ? void 0 : S.length) || 0) +
                            ') ',
                          1,
                        ),
                      ]
                    }),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => {
                    var d
                    return [
                      s('div', Ft, [
                        (u(!0),
                        v(
                          B,
                          null,
                          Q(
                            (d = e.item) == null ? void 0 : d.species,
                            (f, S) => (
                              u(),
                              V(
                                g,
                                { key: S, color: f.quantity > 0 ? '#f0f9ff' : '#fef2f2' },
                                {
                                  default: i(() => [
                                    a(
                                      r,
                                      null,
                                      {
                                        default: i(() => {
                                          var I, N
                                          return [
                                            s('div', Ot, [
                                              s('div', Ut, [
                                                s('div', zt, l((I = f.species) == null ? void 0 : I.name), 1),
                                                s(
                                                  'div',
                                                  Tt,
                                                  l((N = f.species) == null ? void 0 : N.scientific_name),
                                                  1,
                                                ),
                                              ]),
                                              a(
                                                U,
                                                { color: f.quantity > 0 ? 'success' : 'danger', class: 'ml-2' },
                                                { default: i(() => [b(' Qty: ' + l(f.quantity), 1)]), _: 2 },
                                                1032,
                                                ['color'],
                                              ),
                                            ]),
                                          ]
                                        }),
                                        _: 2,
                                      },
                                      1024,
                                    ),
                                  ]),
                                  _: 2,
                                },
                                1032,
                                ['color'],
                              )
                            ),
                          ),
                          128,
                        )),
                      ]),
                    ]
                  }),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      e.observers && e.observers.length > 0
        ? (u(),
          V(
            g,
            { key: 3, class: 'mb-6', stripe: '', 'stripe-color': 'info' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [
                      a(c, { name: 'visibility' }),
                      b(' Observers (' + l(e.observers.length) + ') ', 1),
                    ]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => [
                    s('div', jt, [
                      (u(!0),
                      v(
                        B,
                        null,
                        Q(
                          e.observers,
                          (d, f) => (
                            u(),
                            V(
                              g,
                              { key: f, color: '#f0f9ff' },
                              {
                                default: i(() => [
                                  a(
                                    r,
                                    null,
                                    {
                                      default: i(() => {
                                        var S, I
                                        return [
                                          s('div', Bt, l(d.full_name), 1),
                                          s('div', Mt, [
                                            s('div', null, [
                                              t[24] ||
                                                (t[24] = s('span', { class: 'text-secondary' }, 'Nationality:', -1)),
                                              s(
                                                'span',
                                                Rt,
                                                l(((S = d.nationality) == null ? void 0 : S.name) || 'N/A'),
                                                1,
                                              ),
                                            ]),
                                            s('div', null, [
                                              t[25] || (t[25] = s('span', { class: 'text-secondary' }, 'Country:', -1)),
                                              s('span', Ht, l(((I = d.country) == null ? void 0 : I.name) || 'N/A'), 1),
                                            ]),
                                          ]),
                                        ]
                                      }),
                                      _: 2,
                                    },
                                    1024,
                                  ),
                                ]),
                                _: 2,
                              },
                              1024,
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      e.companions && e.companions.length > 0
        ? (u(),
          V(
            g,
            { key: 4, class: 'mb-6', stripe: '', 'stripe-color': 'success' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [a(c, { name: 'groups' }), b(' Companions (' + l(e.companions.length) + ') ', 1)]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => [
                    s('div', Qt, [
                      (u(!0),
                      v(
                        B,
                        null,
                        Q(
                          e.companions,
                          (d, f) => (
                            u(),
                            V(
                              g,
                              { key: f, color: '#f0fdf4' },
                              {
                                default: i(() => [
                                  a(
                                    r,
                                    null,
                                    {
                                      default: i(() => {
                                        var S, I
                                        return [
                                          s('div', Yt, l(d.full_name), 1),
                                          s('div', Gt, [
                                            s('div', null, [
                                              t[26] ||
                                                (t[26] = s('span', { class: 'text-secondary' }, 'Nationality:', -1)),
                                              s(
                                                'span',
                                                Wt,
                                                l(((S = d.nationality) == null ? void 0 : S.name) || 'N/A'),
                                                1,
                                              ),
                                            ]),
                                            s('div', null, [
                                              t[27] || (t[27] = s('span', { class: 'text-secondary' }, 'Country:', -1)),
                                              s('span', Jt, l(((I = d.country) == null ? void 0 : I.name) || 'N/A'), 1),
                                            ]),
                                          ]),
                                        ]
                                      }),
                                      _: 2,
                                    },
                                    1024,
                                  ),
                                ]),
                                _: 2,
                              },
                              1024,
                            )
                          ),
                        ),
                        128,
                      )),
                    ]),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      e.clientSafariExtras && e.clientSafariExtras.length > 0
        ? (u(),
          V(
            g,
            { key: 5, class: 'mb-6', stripe: '', 'stripe-color': 'primary' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [
                      a(c, { name: 'add_circle' }),
                      b(' Safari Extras (' + l(e.clientSafariExtras.length) + ') ', 1),
                    ]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => [
                    s('div', Kt, [
                      s('table', Xt, [
                        t[28] ||
                          (t[28] = s(
                            'thead',
                            null,
                            [
                              s('tr', null, [
                                s('th', { class: 'text-left' }, 'Service'),
                                s('th', { class: 'text-left' }, 'Description'),
                              ]),
                            ],
                            -1,
                          )),
                        s('tbody', null, [
                          (u(!0),
                          v(
                            B,
                            null,
                            Q(e.clientSafariExtras, (d, f) => {
                              var S, I
                              return (
                                u(),
                                v('tr', { key: f }, [
                                  s('td', Zt, l(((S = d.safari_extra) == null ? void 0 : S.name) || d.name), 1),
                                  s(
                                    'td',
                                    es,
                                    l(
                                      ((I = d.safari_extra) == null ? void 0 : I.description) || d.description || 'N/A',
                                    ),
                                    1,
                                  ),
                                ])
                              )
                            }),
                            128,
                          )),
                        ]),
                      ]),
                    ]),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      e.accommodations && e.accommodations.length > 0
        ? (u(),
          V(
            g,
            { key: 6, class: 'mb-6', stripe: '', 'stripe-color': 'warning' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [
                      a(c, { name: 'hotel' }),
                      b(' Accommodations (' + l(e.accommodations.length) + ') ', 1),
                    ]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => [
                    s('div', ts, [
                      s('table', ss, [
                        t[29] ||
                          (t[29] = s(
                            'thead',
                            null,
                            [
                              s('tr', null, [
                                s('th', { class: 'text-left' }, 'Accommodation'),
                                s('th', { class: 'text-left' }, 'Type'),
                                s('th', { class: 'text-center' }, 'Check-in'),
                                s('th', { class: 'text-center' }, 'Check-out'),
                              ]),
                            ],
                            -1,
                          )),
                        s('tbody', null, [
                          (u(!0),
                          v(
                            B,
                            null,
                            Q(e.accommodations, (d, f) => {
                              var S, I
                              return (
                                u(),
                                v('tr', { key: f }, [
                                  s(
                                    'td',
                                    as,
                                    l(d.name || ((S = d.accommodation_type) == null ? void 0 : S.name) || 'N/A'),
                                    1,
                                  ),
                                  s('td', os, l(((I = d.accommodation_type) == null ? void 0 : I.name) || 'N/A'), 1),
                                  s('td', ns, l(e.formatDate(d.check_in_date)), 1),
                                  s('td', is, l(e.formatDate(d.check_out_date)), 1),
                                ])
                              )
                            }),
                            128,
                          )),
                        ]),
                      ]),
                    ]),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
      e.chartersPrices && e.chartersPrices.length > 0
        ? (u(),
          V(
            g,
            { key: 7, class: 'mb-6', stripe: '', 'stripe-color': 'info' },
            {
              default: i(() => [
                a(
                  D,
                  { class: 'flex items-center gap-2' },
                  {
                    default: i(() => [
                      a(c, { name: 'flight' }),
                      b(' Charter Costs (' + l(e.chartersPrices.length) + ') ', 1),
                    ]),
                    _: 1,
                  },
                ),
                a(r, null, {
                  default: i(() => [
                    s('div', rs, [
                      s('table', ls, [
                        t[30] ||
                          (t[30] = s(
                            'thead',
                            null,
                            [
                              s('tr', null, [
                                s('th', { class: 'text-left' }, 'Charter'),
                                s('th', { class: 'text-left' }, 'Description'),
                                s('th', { class: 'text-right' }, 'Amount'),
                              ]),
                            ],
                            -1,
                          )),
                        s('tbody', null, [
                          (u(!0),
                          v(
                            B,
                            null,
                            Q(e.chartersPrices, (d, f) => {
                              var S
                              return (
                                u(),
                                v('tr', { key: f }, [
                                  s(
                                    'td',
                                    ds,
                                    l(d.name || ((S = d.charter) == null ? void 0 : S.name) || 'Charter ' + (f + 1)),
                                    1,
                                  ),
                                  s('td', ms, l(d.description || 'N/A'), 1),
                                  s('td', us, l(e.formatCurrency(d.amount || d.price)), 1),
                                ])
                              )
                            }),
                            128,
                          )),
                        ]),
                      ]),
                    ]),
                  ]),
                  _: 1,
                }),
              ]),
              _: 1,
            },
          ))
        : C('', !0),
    ])
  )
}
const fs = ge(tt, [
    ['render', cs],
    ['__scopeId', 'data-v-f901150b'],
  ]),
  ps = pe({
    components: {
      Salesinquirieslist: et,
      VaForm: Ee,
      VaInput: Pe,
      VaSelect: Ae,
      VaButton: $e,
      SalesInquiryDetails: fs,
    },
    setup() {
      const e = G(),
        t = G(),
        m = G(!1),
        n = G('add'),
        { isValid: p, validate: w, resetValidation: c, reset: _ } = qe(e),
        { isValid: h, validate: r, resetValidation: g, reset: D } = qe(t),
        { init: q } = ye(),
        U = G(!1),
        A = ce({
          id: null,
          full_name: '',
          nick_name: '',
          country: null,
          nationality: null,
          category: null,
          email: '',
          phone: '',
          phone_additional: '',
          address: '',
          no_of_hunters: 1,
          no_of_observers: 0,
          priceListId: null,
          no_of_days: 0,
          no_of_companions: 0,
          species: null,
          quantity: 0,
          area: null,
          season: null,
          preferred_date: null,
          start_date: null,
          end_date: null,
        }),
        y = ce({ id: null, client_id: null, contact: '', contact_type: null, contactable: !1 }),
        T = () => {
          m.value = !0
        },
        L = () => {
          ;(m.value = !1), (U.value = !1)
        },
        E = G([]),
        d = G([]),
        f = G([]),
        S = G([]),
        I = G([]),
        N = G(0),
        R = async () => {
          const j = {
              method: 'get',
              maxBodyLength: 1 / 0,
              url: 'https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/settings/countries',
              headers: { 'Content-Type': 'application/json' },
            },
            P = await X.request(j)
          P.status === 200 && E.value.push(...P.data.map((z) => ({ value: z.id, text: z.name })))
        },
        F = async () => {
          try {
            const j = {
                method: 'get',
                maxBodyLength: 1 / 0,
                url: 'https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/settings/entity-categories-vset/',
              },
              P = await X.request(j)
            P.status === 200 && f.value.push(...P.data.map((z) => ({ value: z.id, text: z.name })))
          } catch {
            console.warn('Categories endpoint not available')
          }
        },
        O = async () => {
          const j = {
              method: 'get',
              maxBodyLength: 1 / 0,
              url: 'https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/settings/nationalities',
              headers: { 'Content-Type': 'application/json' },
            },
            P = await X.request(j)
          P.status === 200 && d.value.push(...P.data.map((z) => ({ value: z.id, text: z.name })))
        },
        H = async () => {
          try {
            const j = {
                method: 'get',
                maxBodyLength: 1 / 0,
                url: 'https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/settings/contact-types/',
                headers: { 'Content-Type': 'application/json' },
              },
              P = await X.request(j)
            P.status === 200 && S.value.push(...P.data.map((z) => ({ value: z.id, text: z.name })))
          } catch {
            console.warn('Contact types endpoint not available')
          }
        },
        Y = Ne(() => {
          var z
          let j = ''
          const P = (z = y.contact_type) == null ? void 0 : z.value
          return P === 'email' ? (j = 'email') : P === 'phone_number' ? (j = 'phone') : (j = ''), j
        })
      return (
        Le(() => {
          R(), F(), O(), H()
        }),
        {
          formRef: e,
          contactFormRef: t,
          showAddSalesInquiriesForm: m,
          btnIcon: n,
          form: A,
          contactForm: y,
          showDetailsPage: U,
          countries: E,
          nationality: d,
          categoryOptions: f,
          contactsTypes: S,
          clients: I,
          step: N,
          init: q,
          toggleAddSalesInquiriesForm: T,
          isValidForm: p,
          validateForm: w,
          resetValidationForm: c,
          resetForm: _,
          isValidContactForm: h,
          validateContactForm: r,
          resetValidationContactForm: g,
          resetContactForm: D,
          validators: ze,
          getCountries: R,
          getCategories: F,
          getNationalities: O,
          getContactTypes: H,
          contactFieldType: Y,
          gotBack: L,
        }
      )
    },
    data() {
      return {
        speciesOptions: [],
        speciesObjects: [],
        areasOptions: [],
        seasonsOptions: [],
        selectedInquiryItem: null,
        downloadPdf: Te,
        saving: !1,
        packagesOptions: [],
        originalQuantities: ce({}),
        seasonMinDate: null,
        seasonMaxDate: null,
        isEditMode: !1,
        editingInquiryId: null,
        customerType: 'new',
        selectedExistingCustomer: null,
        existingCustomersOptions: [],
        loadingCustomers: !1,
        currentStep: 0,
        wizardSteps: [
          { label: 'Personal Info' },
          { label: 'Season, Package, Dates & Species' },
          { label: 'Safari Extras & Trophy Fees' },
          { label: 'Review' },
        ],
        selectedSafariExtras: [],
        bookedDates: [],
        loadingBookedDates: !1,
        dateConflictWarning: '',
        createQuotation: !1,
        quotationForm: { confirmation_date: null, hunting_license: '', remarks: '', installments: [] },
        dueDaysTypeOptions: [
          { value: 'upon_booking', text: 'Upon Booking' },
          { value: 'before_arrival', text: 'Before Arrival' },
          { value: 'on_arrival', text: 'On Arrival' },
          { value: 'after_hunt', text: 'After Hunt' },
        ],
      }
    },
    computed: {
      ...xe(me, ['logo', 'salesPackagesSpecies']),
      bookedDatesForSelectedSeason() {
        return this.bookedDates
      },
      isStep1Complete() {
        return !!(
          this.form.full_name &&
          this.form.country &&
          this.form.nationality &&
          this.form.email &&
          this.form.phone &&
          this.form.address
        )
      },
      isStep2Complete() {
        return !!(
          this.form.season &&
          this.form.preferred_date &&
          this.form.start_date &&
          this.form.end_date &&
          this.form.no_of_days &&
          this.speciesObjects.length > 0
        )
      },
      isStep3Complete() {
        return this.currentStep >= 3
      },
      canProceedToNextStep() {
        const e = (t) => (typeof t == 'string' ? t.trim().length > 0 : !!t)
        switch (this.currentStep) {
          case 0:
            return (
              e(this.form.full_name) &&
              e(this.form.country) &&
              e(this.form.nationality) &&
              e(this.form.email) &&
              e(this.form.phone) &&
              e(this.form.address) &&
              (this.customerType === 'existing' ? e(this.selectedExistingCustomer) : !0)
            )
          case 1:
            return (
              e(this.form.season) &&
              e(this.form.preferred_date) &&
              e(this.form.start_date) &&
              e(this.form.end_date) &&
              e(this.form.area) &&
              !!(this.form.no_of_days && this.form.no_of_days > 0) &&
              this.speciesObjects.length > 0
            )
          case 2:
            return !0
          default:
            return !1
        }
      },
      maxPackageDays() {
        var e, t, m
        return (m =
          (t = (e = this.form.priceListId) == null ? void 0 : e.selfItem) == null ? void 0 : t.price_list_type) !=
          null && m.duration
          ? this.form.priceListId.selfItem.price_list_type.duration
          : 365
      },
      maxEndDate() {
        if (!this.form.start_date || this.maxPackageDays >= 365) return null
        const e = new Date(this.form.start_date),
          t = new Date(e)
        return t.setDate(e.getDate() + this.maxPackageDays - 1), t
      },
      formatMaxEndDate() {
        return this.maxEndDate
          ? this.maxEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : ''
      },
      huntDuration() {
        if (!this.form.start_date || !this.form.end_date) return 0
        const e = new Date(this.form.start_date),
          m = new Date(this.form.end_date).getTime() - e.getTime(),
          n = Math.ceil(m / (1e3 * 60 * 60 * 24)) + 1
        return n > 0 ? n : 0
      },
      quotationTotalAmount() {
        return this.quotationForm.installments.reduce((e, t) => e + (Number(t.amount_due) || 0), 0)
      },
      filteredPackagesOptions() {
        var t
        if (!((t = this.form.season) != null && t.value)) return []
        const e = this.form.season.value
        return this.packagesOptions.filter((m) => {
          var p, w, c, _
          return (
            (((p = m.selfItem) == null ? void 0 : p.season_id) ||
              ((_ = (c = (w = m.selfItem) == null ? void 0 : w.price_list_type) == null ? void 0 : c.price_list) == null
                ? void 0
                : _.season_id)) === e
          )
        })
      },
      speciesList() {
        return this.salesPackagesSpecies
      },
      seasonStartMonth() {
        return this.seasonMinDate ? this.seasonMinDate.getMonth() : new Date().getMonth()
      },
      seasonStartYear() {
        return this.seasonMinDate ? this.seasonMinDate.getFullYear() : new Date().getFullYear()
      },
    },
    watch: {
      customerType(e) {
        e === 'new'
          ? ((this.selectedExistingCustomer = null), this.clearCustomerInformation())
          : e === 'existing' && ((this.selectedExistingCustomer = null), this.clearCustomerInformation())
      },
      selectedExistingCustomer(e) {
        !e && this.customerType === 'existing' && this.clearCustomerInformation()
      },
    },
    mounted() {
      this.getSpecies(), this.getAreas(), this.getSeasonList(), this.getPL(), this.getExistingCustomers()
    },
    methods: {
      ...J(fe, ['getSpeciesList']),
      ...J(fe, ['getAreaList']),
      ...J(fe, ['getAllSpeciesPerQuotaPerArea']),
      ...J(ue, ['createSalesInquiry', 'updateSalesInquiry', 'getSalesInquiries']),
      ...J(me, ['getSeasons', 'getSalespackagesSpecies']),
      ...J(je, ['getPriceList', 'getPriceListById']),
      async getExistingCustomers() {
        this.loadingCustomers = !0
        try {
          const e = await this.getSalesInquiries('', '')
          if (e.status === 200) {
            const t = Array.isArray(e.data) ? e.data : e.data.data || [],
              m = new Map()
            t.forEach((n) => {
              var w, c, _, h
              const p = n.entity
              if (p && p.id && !m.has(p.id)) {
                let r = '',
                  g = '',
                  D = ''
                p.contacts &&
                  Array.isArray(p.contacts) &&
                  p.contacts.forEach((q) => {
                    var U, A, y
                    ;((U = q.contact_type) == null ? void 0 : U.name) === 'email' || q.contact_type_id === 1
                      ? (r = q.contact || '')
                      : ((A = q.contact_type) == null ? void 0 : A.name) === 'phone_number' || q.contact_type_id === 2
                        ? (g = q.contact || '')
                        : (((y = q.contact_type) == null ? void 0 : y.name) === 'address' || q.contact_type_id === 3) &&
                          (D = q.contact || '')
                  }),
                  m.set(p.id, {
                    value: p.id,
                    text: p.full_name,
                    selfItem: {
                      id: p.id,
                      full_name: p.full_name,
                      country: ((w = p.country) == null ? void 0 : w.name) || p.country_name || '',
                      country_id: ((c = p.country) == null ? void 0 : c.id) || p.country_id,
                      nationality: ((_ = p.nationality) == null ? void 0 : _.name) || p.nationality_name || '',
                      nationality_id: ((h = p.nationality) == null ? void 0 : h.id) || p.nationality_id,
                      email: r,
                      phone: g,
                      address: D,
                    },
                  })
              }
            }),
              (this.existingCustomersOptions = Array.from(m.values()))
          }
        } catch (e) {
          console.error('Error fetching existing customers:', e)
        } finally {
          this.loadingCustomers = !1
        }
      },
      populateFormFromCustomer(e) {
        if (this.customerType !== 'existing') return
        if (!e || !e.selfItem) {
          this.clearCustomerInformation()
          return
        }
        const t = e.selfItem
        if (((this.form.full_name = t.full_name || ''), t.country_id)) {
          const m = this.countries.find((n) => n.value === t.country_id)
          m && (this.form.country = m)
        } else if (t.country) {
          const m = this.countries.find((n) => n.text === t.country)
          m && (this.form.country = m)
        }
        if (t.nationality_id) {
          const m = this.nationality.find((n) => n.value === t.nationality_id)
          m && (this.form.nationality = m)
        } else if (t.nationality) {
          const m = this.nationality.find((n) => n.text === t.nationality)
          m && (this.form.nationality = m)
        }
        ;(this.form.email = t.email || ''),
          (this.form.phone = t.phone || ''),
          (this.form.address = t.address || ''),
          this.init({ message: `Customer "${t.full_name}" information loaded successfully`, color: 'success' })
      },
      clearCustomerInformation() {
        ;(this.form.full_name = ''),
          (this.form.country = null),
          (this.form.nationality = null),
          (this.form.email = ''),
          (this.form.phone = ''),
          (this.form.address = '')
      },
      async submit() {
        var p, w, c, _, h
        if (
          ((this.saving = !0), !this.form.full_name || !this.form.country || !this.form.nationality || !this.form.email)
        ) {
          this.init({
            message: 'Please fill in all required fields (Name, Country, Nationality, Email).',
            color: 'warning',
          }),
            (this.saving = !1)
          return
        }
        if (this.speciesObjects.length === 0) {
          this.init({ message: 'Please add at least one species.', color: 'warning' }), (this.saving = !1)
          return
        }
        if (!this.form.area) {
          this.init({ message: 'Please select a hunting area.', color: 'warning' }), (this.saving = !1)
          return
        }
        if (!this.form.season) {
          this.init({ message: 'Please select a season.', color: 'warning' }), (this.saving = !1)
          return
        }
        if (!this.form.no_of_days || this.form.no_of_days <= 0) {
          this.init({ message: 'Please enter the number of days.', color: 'warning' }), (this.saving = !1)
          return
        }
        const e = {
            full_name: this.form.full_name,
            country_id: (p = this.form.country) == null ? void 0 : p.value,
            nationality_id: (w = this.form.nationality) == null ? void 0 : w.value,
          },
          t = [
            { contact_type_id: 1, contact: this.form.email, contactable: !0 },
            { contact_type_id: 2, contact: this.form.phone, contactable: !0 },
            { contact_type_id: 3, contact: this.form.address, contactable: !1 },
          ],
          m = {
            preferred_date: this.form.preferred_date,
            start_date: this.form.start_date,
            end_date: this.form.end_date,
            no_of_observers: this.form.no_of_observers || 0,
            no_of_companions: this.form.no_of_companions || 0,
            no_of_hunters: this.form.no_of_hunters || 1,
            no_of_days: this.form.no_of_days,
          },
          n = {
            entity: e,
            contacts: t,
            preferences: m,
            species: this.speciesObjects,
            area_id: (c = this.form.area) == null ? void 0 : c.value,
            season_id: (_ = this.form.season) == null ? void 0 : _.value,
            safari_extras: this.selectedSafariExtras.map((r) => r.safari_extras_id || r.id),
          }
        ;(h = this.form.priceListId) != null && h.value && (n.reference_price_list_id = this.form.priceListId.value),
          this.createQuotation &&
            this.quotationForm.installments.length > 0 &&
            ((n.create_quotation = !0),
            (n.quotation = {
              confirmation_date: this.quotationForm.confirmation_date,
              hunting_license: this.quotationForm.hunting_license,
              remarks: this.quotationForm.remarks,
              installments: this.quotationForm.installments.map((r) => ({
                narration: r.narration,
                amount_due: Number(r.amount_due),
                due_days_type: r.due_days_type,
                due_days: Number(r.due_days) || 0,
              })),
            })),
          console.log('Request payload:', JSON.stringify(n, null, 2))
        try {
          let r
          this.isEditMode && this.editingInquiryId
            ? ((r = await this.updateSalesInquiry(this.editingInquiryId, n)),
              r.status === 200 &&
                ((this.saving = !1),
                this.init({ message: 'Sales inquiry updated successfully', color: 'success' }),
                this.resetForm(),
                this.resetValidationContactForm(),
                (this.speciesObjects = []),
                (this.selectedSafariExtras = []),
                this.resetQuotationForm(),
                (this.isEditMode = !1),
                (this.editingInquiryId = null),
                (this.customerType = 'new'),
                (this.selectedExistingCustomer = null),
                (this.currentStep = 0),
                (this.showAddSalesInquiriesForm = !1)))
            : ((r = await this.createSalesInquiry(n)),
              r.status === 201 &&
                ((this.saving = !1),
                this.init({ message: r.data.message, color: 'success' }),
                this.resetForm(),
                this.resetValidationContactForm(),
                (this.speciesObjects = []),
                (this.selectedSafariExtras = []),
                this.resetQuotationForm(),
                (this.customerType = 'new'),
                (this.selectedExistingCustomer = null),
                (this.currentStep = 0)))
        } catch (r) {
          if (((this.saving = !1), console.error('Error saving sales inquiry:', r), r.response)) {
            const g = Ue(r.response)
            this.init({
              message:
                `
` +
                g.map((D, q) => `${q + 1}. ${D}`).join(`
`),
              color: 'danger',
            })
          } else
            r.request
              ? this.init({
                  message: 'No response from server. Please check your network connection.',
                  color: 'danger',
                })
              : this.init({ message: r.message || 'An unexpected error occurred', color: 'danger' })
        }
      },
      viewInquiries(e) {
        ;(this.showDetailsPage = !0), (this.selectedInquiryItem = e.selfitem)
      },
      resetEditMode() {
        ;(this.isEditMode = !1),
          (this.editingInquiryId = null),
          (this.speciesObjects = []),
          (this.selectedSafariExtras = []),
          this.resetQuotationForm(),
          (this.customerType = 'new'),
          (this.selectedExistingCustomer = null),
          (this.currentStep = 0)
      },
      handleGoBack() {
        this.resetEditMode(), (this.currentStep = 0), this.gotBack()
      },
      nextStep() {
        this.currentStep < this.wizardSteps.length - 1 && this.canProceedToNextStep
          ? this.currentStep++
          : this.canProceedToNextStep || this.showStepValidationError()
      },
      previousStep() {
        this.currentStep > 0 && this.currentStep--
      },
      goToStep(e) {
        e <= this.currentStep && (this.currentStep = e)
      },
      showStepValidationError() {
        const e = {
          0: 'Please fill in all customer information fields (Name, Country, Nationality, Email, Phone, Address).',
          1: 'Please select season, dates, hunting area, enter the number of days, and add at least one species.',
        }
        this.init({ message: e[this.currentStep] || 'Please complete all required fields.', color: 'warning' })
      },
      formatReviewDate(e) {
        if (!e) return 'N/A'
        try {
          const t = new Date(e)
          return isNaN(t.getTime())
            ? 'N/A'
            : t.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        } catch {
          return 'N/A'
        }
      },
      getSpeciesNameById(e) {
        if (!e) return null
        const t = this.speciesOptions.find((m) => m.value === e)
        return t ? t.text : null
      },
      editInquiry(e) {
        var h, r, g, D, q, U, A, y, T, L, E
        ;(this.isEditMode = !0), (this.editingInquiryId = e.id), (this.showAddSalesInquiriesForm = !0)
        const t = e.selfitem || e
        this.form.full_name = ((h = t.entity) == null ? void 0 : h.full_name) || e.name || ''
        const m =
          ((g = (r = t.entity) == null ? void 0 : r.country) == null ? void 0 : g.name) ||
          ((D = t.entity) == null ? void 0 : D.country_name)
        if (m) {
          const d = this.countries.find((f) => f.text === m)
          d && (this.form.country = d)
        }
        const n =
          ((U = (q = t.entity) == null ? void 0 : q.nationality) == null ? void 0 : U.name) ||
          ((A = t.entity) == null ? void 0 : A.nationality_name)
        if (n) {
          const d = this.nationality.find((f) => f.text === n)
          d && (this.form.nationality = d)
        }
        ;(y = t.entity) != null &&
          y.contacts &&
          Array.isArray(t.entity.contacts) &&
          t.entity.contacts.forEach((d) => {
            var f, S, I
            ;((f = d.contact_type) == null ? void 0 : f.name) === 'email' || d.contact_type_id === 1
              ? (this.form.email = d.contact || '')
              : ((S = d.contact_type) == null ? void 0 : S.name) === 'phone_number' || d.contact_type_id === 2
                ? (this.form.phone = d.contact || '')
                : (((I = d.contact_type) == null ? void 0 : I.name) === 'address' || d.contact_type_id === 3) &&
                  (this.form.address = d.contact || '')
          })
        const p = t.formatted_preferences || e.preference || {}
        ;(this.form.no_of_hunters = p.no_of_hunters || 1),
          (this.form.no_of_observers = p.no_of_observers || 0),
          (this.form.no_of_days = p.no_of_days || 0),
          (this.form.no_of_companions = p.no_of_companions || 0),
          p.preferred_date && (this.form.preferred_date = new Date(p.preferred_date)),
          p.start_date && (this.form.start_date = new Date(p.start_date)),
          p.end_date && (this.form.end_date = new Date(p.end_date))
        const w =
          ((E = (L = (T = t.inquiry_areas) == null ? void 0 : T[0]) == null ? void 0 : L.area) == null
            ? void 0
            : E.name) || e.area
        if (w) {
          const d = this.areasOptions.find((f) => f.text === w)
          d && (this.form.area = d)
        }
        if (t.season) {
          const d = this.seasonsOptions.find((f) => f.value === t.season.id || f.text === t.season.name)
          d && (this.form.season = d)
        }
        if (t.reference_price_list) {
          const d = this.packagesOptions.find((f) => f.value === t.reference_price_list.id)
          d && (this.form.priceListId = d)
        }
        this.speciesObjects = []
        const c = t.inquiry_species || e.inquiry_species || []
        console.log('Species array from API:', JSON.stringify(c, null, 2)),
          c.forEach((d) => {
            var S, I
            const f =
              d.species_name ||
              ((S = d.species) == null ? void 0 : S.name) ||
              d.name ||
              this.getSpeciesNameById(d.species_id) ||
              'Unknown'
            this.speciesObjects.push({
              species_id: d.species_id || ((I = d.species) == null ? void 0 : I.id) || d.id,
              name: f,
              quantity: d.quantity || 1,
              fromPackage: !1,
            })
          }),
          (this.selectedSafariExtras = [])
        const _ = t.safari_extras || t.sales_confirmation_safari_extras || []
        console.log('Safari extras from API:', JSON.stringify(_, null, 2)),
          _.forEach((d) => {
            const f = d.safari_extra || d.safary_extra || d
            this.selectedSafariExtras.push({
              id: f.id || d.safari_extras_id || d.safary_extras_id,
              safari_extras_id: f.id || d.safari_extras_id || d.safary_extras_id,
              name: f.name || 'Unknown',
              description: f.description || '',
              amount: f.amount || 0,
              charges_per: f.charges_per || '',
              currency: f.currency,
            })
          }),
          this.init({ message: 'Loaded inquiry data for editing', color: 'info' })
      },
      async downloadAllInquiriesPdf() {
        try {
          const e = await X.get(
            'https://backend-bushman-master-kxhmlj.laravel.cloud/api/v1.0/sales/sales-inquiries-pdf',
            { headers: { 'Content-Type': 'application/json' } },
          )
          if (e.data.success && e.data.pdf) {
            const t = e.data.pdf,
              m = atob(t),
              n = new Array(m.length)
            for (let h = 0; h < m.length; h++) n[h] = m.charCodeAt(h)
            const p = new Uint8Array(n),
              w = new Blob([p], { type: 'application/pdf' }),
              c = window.URL.createObjectURL(w),
              _ = document.createElement('a')
            ;(_.href = c),
              (_.download = `sales-inquiries-${new Date().toISOString().split('T')[0]}.pdf`),
              document.body.appendChild(_),
              _.click(),
              document.body.removeChild(_),
              window.URL.revokeObjectURL(c),
              this.init({
                message: `PDF downloaded successfully. Total records: ${e.data.total_records}`,
                color: 'success',
              })
          } else this.init({ message: 'Failed to generate PDF', color: 'danger' })
        } catch (e) {
          console.error('Error downloading PDF:', e), this.init({ message: 'Error downloading PDF', color: 'danger' })
        }
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
              species_id: this.form.species.value,
              name: this.form.species.text,
              quantity: this.form.quantity,
              fromPackage: !1,
            })
      },
      deleteFromStorage(e) {
        this.speciesObjects.splice(e, 1), console.log('Species item deleted:', e)
      },
      removeSafariExtra(e) {
        const t = this.selectedSafariExtras.splice(e, 1)
        t.length > 0 && this.init({ message: `Removed "${t[0].name}" from safari extras`, color: 'info' })
      },
      addQuotationInstallment() {
        this.quotationForm.installments.push({
          narration: '',
          amount_due: 0,
          due_days_type: 'upon_booking',
          due_days: 0,
        })
      },
      removeQuotationInstallment(e) {
        this.quotationForm.installments.splice(e, 1)
      },
      resetQuotationForm() {
        ;(this.createQuotation = !1),
          (this.quotationForm = { confirmation_date: null, hunting_license: '', remarks: '', installments: [] })
      },
      validateAndLimitDays(e) {
        const t = parseInt(e, 10)
        t > this.maxPackageDays
          ? ((this.form.no_of_days = this.maxPackageDays),
            this.init({
              message: `Number of days limited to ${this.maxPackageDays} (package maximum)`,
              color: 'warning',
            }))
          : t < 1 && t !== 0 && (this.form.no_of_days = 1)
      },
      incrementQuantity(e) {
        this.speciesObjects[e] && this.speciesObjects[e].quantity++
      },
      decrementQuantity(e) {
        this.speciesObjects[e] && this.speciesObjects[e].quantity > 1 && this.speciesObjects[e].quantity--
      },
      async getSpecies() {
        try {
          const e = await this.getSpeciesList()
          e.status === 200 && (this.speciesOptions = e.data.map((t) => ({ value: t.id, text: t.name })))
        } catch (e) {
          console.error('Error loading species:', e)
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
      async getSeasonList() {
        try {
          const e = await this.getSeasons(),
            t = new Date()
          t.setHours(0, 0, 0, 0),
            (this.seasonsOptions = e.data
              .filter((m) => {
                if (!m.end_at) return !0
                const n = new Date(m.end_at)
                return n.setHours(23, 59, 59, 999), n >= t
              })
              .map((m) => ({ value: m.id, text: m.name, selfItem: m })))
        } catch (e) {
          console.log(e)
        }
      },
      async onSeasonSelected(e) {
        if (
          ((this.dateConflictWarning = ''),
          (this.form.preferred_date = null),
          (this.form.start_date = null),
          (this.form.end_date = null),
          !e || !e.selfItem)
        ) {
          ;(this.seasonMinDate = null), (this.seasonMaxDate = null), (this.bookedDates = [])
          return
        }
        const t = e.selfItem
        t.start_at && (this.seasonMinDate = new Date(t.start_at)),
          t.end_at && (this.seasonMaxDate = new Date(t.end_at)),
          await this.fetchBookedDates(e.value)
      },
      async fetchBookedDates(e, t) {
        ;(this.loadingBookedDates = !0), (this.bookedDates = [])
        try {
          const m = new URLSearchParams()
          e && m.append('season_id', e.toString()), t && m.append('area_id', t.toString())
          const n = m.toString() ? `?${m.toString()}` : '',
            p = await X.get(`/sales/booked-dates${n}`)
          if (p.status === 200) {
            const w = Array.isArray(p.data) ? p.data : p.data.data || []
            this.bookedDates = w.map((c) => {
              var _
              return {
                start_date: c.start_date,
                end_date: c.end_date,
                client_name: c.client_name || ((_ = c.entity) == null ? void 0 : _.full_name) || 'Unknown Client',
                area_id: c.area_id,
              }
            })
          }
        } catch (m) {
          console.error('Error fetching booked dates:', m)
        } finally {
          this.loadingBookedDates = !1
        }
      },
      checkBookedDateConflict() {
        this.dateConflictWarning = ''
        const e = this.form.start_date ? new Date(this.form.start_date) : null,
          t = this.form.end_date ? new Date(this.form.end_date) : null,
          m = this.form.preferred_date ? new Date(this.form.preferred_date) : null
        if (!(!e && !t && !m))
          for (const n of this.bookedDates) {
            const p = new Date(n.start_date),
              w = new Date(n.end_date)
            p.setHours(0, 0, 0, 0), w.setHours(23, 59, 59, 999)
            const c = (h) => {
                if (!h) return !1
                const r = new Date(h)
                return r.setHours(12, 0, 0, 0), r >= p && r <= w
              },
              _ = (h, r) => {
                if (!h || !r) return !1
                const g = new Date(h),
                  D = new Date(r)
                return g.setHours(0, 0, 0, 0), D.setHours(23, 59, 59, 999), g <= w && D >= p
              }
            if (c(m) || c(e) || c(t) || _(e, t)) {
              const h = new Date(n.start_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
                r = new Date(n.end_date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              this.dateConflictWarning = `The selected dates overlap with a confirmed hunt for "${n.client_name}" (${h} - ${r}). Please inform the client that this time slot may not be available.`
              return
            }
          }
      },
      formatBookingDateRange(e) {
        const t = new Date(e.start_date),
          m = new Date(e.end_date),
          n = { month: 'short', day: 'numeric' }
        return t.getFullYear() !== m.getFullYear()
          ? `${t.toLocaleDateString('en-US', { ...n, year: 'numeric' })} - ${m.toLocaleDateString('en-US', {
              ...n,
              year: 'numeric',
            })}`
          : `${t.toLocaleDateString('en-US', n)} - ${m.toLocaleDateString('en-US', n)}`
      },
      calculateAdditionalCost() {
        var m, n, p
        let e = 0
        const t = (m = this.form.priceListId) == null ? void 0 : m.selfItem
        return t
          ? (this.form.no_of_companions > 0 &&
              ((n = t.companion_hunter_costs) == null ? void 0 : n.length) > 0 &&
              (e += this.form.no_of_companions * t.companion_hunter_costs[0].amount),
            this.form.no_of_observers > 0 &&
              ((p = t.observer) == null ? void 0 : p.length) > 0 &&
              (e += this.form.no_of_observers * t.observer[0].amount),
            e)
          : 0
      },
      async getPL() {
        const e = await this.getPriceList()
        e.status === 200
          ? ((this.packagesOptions = e.data.data.map((t) => ({
              value: t.id,
              text: `${t.package_name || `Package ${t.id}`} - ${t.hunting_type || 'N/A'} (${
                t.season_name || 'No Season'
              })`,
              selfItem: t,
            }))),
            console.log('packagesOptions:', this.packagesOptions))
          : console.log('Error getting price list')
      },
      async populateFormFromPackage() {
        var t, m, n, p, w
        const e = me()
        if (!this.form.priceListId || !this.form.priceListId.value) {
          e.salesPackagesSpecies = []
          return
        }
        try {
          const c = await this.getPriceListById(this.form.priceListId.value)
          if ((console.log('Price list detail response:', c), c.status === 200 && c.data.success)) {
            const _ = c.data.data
            if (
              ((this.form.priceListId.selfItem = _),
              (m = (t = _.sales_package) == null ? void 0 : t.area) != null && m.name)
            ) {
              const h = this.areasOptions.find((r) => r.text === _.sales_package.area.name)
              h && (this.form.area = h)
            }
            if (
              ((n = _.price_list_type) != null && n.duration && (this.form.no_of_days = _.price_list_type.duration),
              (p = _.price_list_type) != null && p.price_list)
            ) {
              const h = _.price_list_type.price_list
              h.start_date && (this.seasonMinDate = new Date(h.start_date)),
                h.end_date && (this.seasonMaxDate = new Date(h.end_date))
              const r = new Date(h.start_date),
                g = new Date(h.end_date),
                D = `${r.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${g.toLocaleDateString(
                  'en-US',
                  { month: 'short', year: 'numeric' },
                )}`,
                q = _.season_id
              let U = this.seasonsOptions.find((A) => {
                var y
                return (y = A.selfItem) != null && y.start_at
                  ? new Date(A.selfItem.start_at).getFullYear() === r.getFullYear()
                  : !1
              })
              if (
                (U ||
                  ((U = { value: q, text: D, selfItem: { start_at: h.start_date, end_at: h.end_date } }),
                  this.seasonsOptions.push(U)),
                (this.form.season = U),
                h.start_date)
              ) {
                const A = new Date(h.start_date)
                ;(this.form.preferred_date = A), (this.form.start_date = A), (this.form.end_date = A)
              }
            }
            if ((w = _.sales_package) != null && w.species && Array.isArray(_.sales_package.species)) {
              console.log('Raw species data:', JSON.stringify(_.sales_package.species, null, 2)),
                (this.speciesObjects = _.sales_package.species.map((r) => {
                  var D, q
                  const g = r.species_id || ((D = r.species) == null ? void 0 : D.id) || r.id
                  return (
                    console.log('Species item:', r, 'Using species_id:', g),
                    {
                      species_id: g,
                      name: ((q = r.species) == null ? void 0 : q.name) || r.name || 'Unknown',
                      quantity: r.quantity || 0,
                      fromPackage: !0,
                    }
                  )
                }))
              const h = _.sales_package.species.map((r) => {
                var g, D, q
                return {
                  id: r.species_id || ((g = r.species) == null ? void 0 : g.id) || r.id,
                  name: ((D = r.species) == null ? void 0 : D.name) || r.name || 'Unknown',
                  scientific_name: ((q = r.species) == null ? void 0 : q.scientific_name) || r.scientific_name || 'N/A',
                  quantity: r.quantity || 0,
                  requested_quantity: 0,
                }
              })
              ;(e.salesPackagesSpecies = h),
                console.log('Populated species:', this.speciesObjects),
                this.init({
                  message: `Loaded ${h.length} species from the selected package. You can now customize all fields.`,
                  color: 'success',
                  position: 'bottom-right',
                })
            } else
              console.log('No species array found. Response structure:', _.sales_package),
                (e.salesPackagesSpecies = []),
                this.init({
                  message: 'No species found in the selected package.',
                  color: 'warning',
                  position: 'bottom-right',
                })
            _.safari_extras && Array.isArray(_.safari_extras)
              ? ((this.selectedSafariExtras = _.safari_extras.map((h) => ({
                  id: h.id,
                  safari_extras_id: h.id,
                  name: h.name,
                  description: h.description || '',
                  amount: h.amount,
                  charges_per: h.charges_per,
                  currency: h.currency,
                  fromPackage: !0,
                }))),
                console.log('Populated safari extras:', this.selectedSafariExtras))
              : (this.selectedSafariExtras = [])
          }
        } catch (c) {
          console.error('Error fetching price list details:', c),
            this.init({
              message: 'Failed to load package details. Please try again.',
              color: 'danger',
              position: 'bottom-right',
            }),
            (e.salesPackagesSpecies = [])
        }
      },
      onChange(e, t) {
        console.log('Quantity changed:', e, t)
        const m = this.salesPackagesSpecies.find((n) => n.id === e)
        m &&
          ((m.requested_quantity = t),
          (this.salesPackagesSpecies = [...this.salesPackagesSpecies]),
          t > m.quantity
            ? this.init({
                message: `Warning: Requested quantity (${t}) exceeds available quantity (${m.quantity}) for ${m.name}.`,
                color: 'warning',
                position: 'bottom-right',
              })
            : t > 0 &&
              this.init({
                message: `Quantity for ${m.name} has been set to ${t}.`,
                color: 'success',
                position: 'bottom-right',
              }))
      },
      checkDateAllowed(e) {
        if (!this.seasonMinDate && !this.seasonMaxDate) return !0
        const t = new Date(e)
        t.setHours(0, 0, 0, 0)
        let m = !0
        if (this.seasonMinDate) {
          const n = new Date(this.seasonMinDate)
          n.setHours(0, 0, 0, 0), t < n && (m = !1)
        }
        if (this.seasonMaxDate && m) {
          const n = new Date(this.seasonMaxDate)
          n.setHours(0, 0, 0, 0), t > n && (m = !1)
        }
        return m
      },
      checkEndDateAllowed(e) {
        if (!this.checkDateAllowed(e)) return !1
        if (!this.form.start_date) return !0
        const t = new Date(e)
        t.setHours(0, 0, 0, 0)
        const m = new Date(this.form.start_date)
        if ((m.setHours(0, 0, 0, 0), t < m)) return !1
        if (this.maxPackageDays < 365 && this.maxEndDate) {
          const n = new Date(this.maxEndDate)
          if ((n.setHours(0, 0, 0, 0), t > n)) return !1
        }
        return !0
      },
      exceedsMaxDays(e) {
        if (!this.form.start_date || !e || this.maxPackageDays >= 365) return !1
        const t = new Date(this.form.start_date),
          n = new Date(e).getTime() - t.getTime()
        return Math.ceil(n / (1e3 * 60 * 60 * 24)) + 1 > this.maxPackageDays
      },
      onStartDateChange() {
        this.checkBookedDateConflict(),
          this.form.end_date &&
            this.exceedsMaxDays(this.form.end_date) &&
            ((this.form.end_date = null),
            this.$vaToast.init({
              message: `End date cleared - it exceeded the ${this.maxPackageDays} day package limit`,
              color: 'warning',
              position: 'bottom-right',
            }))
      },
      onEndDateChange(e) {
        if ((this.checkBookedDateConflict(), this.form.start_date && e)) {
          const t = this.huntDuration
          t > 0 && t !== this.form.no_of_days && (this.form.no_of_days = t)
        }
      },
      formatDate(e) {
        return e ? new Date(e).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
      },
      isDateInSeasonRange(e) {
        if (!this.seasonMinDate && !this.seasonMaxDate) return !0
        const t = new Date(e)
        if ((t.setHours(0, 0, 0, 0), this.seasonMinDate)) {
          const m = new Date(this.seasonMinDate)
          if ((m.setHours(0, 0, 0, 0), t < m)) return !1
        }
        if (this.seasonMaxDate) {
          const m = new Date(this.seasonMaxDate)
          if ((m.setHours(0, 0, 0, 0), t > m)) return !1
        }
        return !0
      },
      formatDateRange(e, t) {
        if (!e || !t) return 'N/A'
        const m = new Date(e),
          n = new Date(t),
          p = m.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          w = n.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        return `${p} - ${w}`
      },
      formatCurrency(e) {
        return e ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(e) : '$0.00'
      },
      formatChargesPer(e) {
        return e
          ? e
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, (t) => t.toUpperCase())
          : ''
      },
      getSequenceLabel(e) {
        return { 1: '1st', 2: '2nd', 3: '3rd' }[e] || `${e}th`
      },
    },
  }),
  gs = { class: 'flex flex-col md:flex-row gap-3 mb-6 justify-between items-center py-4 px-2 bg-gray-50 rounded-lg' },
  ys = { class: 'flex flex-col md:flex-row gap-3 justify-start' },
  hs = { key: 0, class: 'flex gap-3' },
  _s = { key: 1, class: 'p-6 bg-white rounded-lg sales-inquiry-wizard' },
  bs = { class: 'flex items-center justify-between mb-4' },
  vs = { class: 'flex items-center gap-2' },
  ks = { class: 'text-2xl font-bold text-gray-800' },
  Ss = { class: 'flex items-center gap-2' },
  ws = { class: 'text-sm text-gray-600 hidden md:inline' },
  Ds = { class: 'w-full bg-gray-200 rounded-full h-2 mb-6' },
  Is = { class: 'relative' },
  Vs = { class: 'relative' },
  Cs = { class: 'relative' },
  qs = { class: 'animate-fade-in' },
  xs = { class: 'mb-6' },
  $s = { class: 'flex items-center gap-2 mb-4' },
  As = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  Ps = { key: 0, class: 'mt-4' },
  Es = { key: 0, class: 'flex flex-col' },
  Ns = { class: 'font-semibold' },
  Ls = { class: 'text-sm text-gray-500' },
  Fs = { class: 'mb-6' },
  Os = { class: 'flex items-center gap-2 mb-4' },
  Us = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4' },
  zs = { class: 'mb-6' },
  Ts = { class: 'flex items-center gap-2 mb-4' },
  js = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4' },
  Bs = { class: 'animate-fade-in' },
  Ms = { class: 'mb-6' },
  Rs = { class: 'flex items-center gap-2 mb-4' },
  Hs = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' },
  Qs = { key: 0, class: 'flex flex-col' },
  Ys = { class: 'font-semibold' },
  Gs = { key: 0, class: 'text-sm text-gray-500' },
  Ws = { key: 0, class: 'flex flex-col' },
  Js = { class: 'font-semibold' },
  Ks = { class: 'text-sm text-gray-500' },
  Xs = { class: 'grid grid-cols-2 md:grid-cols-4 gap-3 text-sm' },
  Zs = { class: 'ml-1 font-medium' },
  ea = { class: 'ml-1 font-medium' },
  ta = { class: 'ml-1 font-medium' },
  sa = { class: 'ml-1 font-medium' },
  aa = { class: 'mb-6' },
  oa = { class: 'flex items-center gap-2 mb-4' },
  na = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4' },
  ia = { key: 2, class: 'mt-4' },
  ra = { class: 'text-sm font-semibold text-gray-700 mb-2' },
  la = { class: 'flex flex-wrap gap-2' },
  da = { class: 'mb-6' },
  ma = { class: 'flex items-center gap-2 mb-4' },
  ua = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' },
  ca = { class: 'flex items-center gap-2 py-2 px-3 bg-gray-50 rounded-lg border border-gray-200' },
  fa = { key: 0, class: 'font-semibold text-lg' },
  pa = { key: 1, class: 'text-gray-400 italic' },
  ga = { key: 0, class: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' },
  ya = { class: 'flex items-center gap-2 mb-2' },
  ha = { class: 'text-2xl font-bold text-success' },
  _a = { key: 0, class: 'mt-2 pt-2 border-t' },
  ba = { class: 'font-bold' },
  va = { class: 'flex items-center gap-2 mb-2' },
  ka = { class: 'text-2xl font-bold text-primary' },
  Sa = { key: 0, class: 'mt-2 pt-2 border-t' },
  wa = { class: 'font-bold' },
  Da = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4' },
  Ia = { key: 0, class: 'mb-6' },
  Va = { class: 'flex items-center gap-2 mb-4' },
  Ca = { class: 'va-table-responsive' },
  qa = { class: 'va-table va-table--hoverable w-full text-sm' },
  xa = { class: 'font-medium' },
  $a = { class: 'text-right font-semibold text-warning' },
  Aa = { class: 'mb-6' },
  Pa = { class: 'flex items-center gap-2 mb-4' },
  Ea = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-4' },
  Na = { class: 'col-span-1 md:col-span-1' },
  La = { class: 'flex items-end' },
  Fa = { class: 'mt-4' },
  Oa = { class: 'text-sm font-semibold mb-3' },
  Ua = { class: 'flex items-center gap-2' },
  za = { class: 'font-semibold' },
  Ta = { class: 'flex items-center gap-2' },
  ja = { class: 'text-sm font-medium min-w-[30px] text-center' },
  Ba = { class: 'animate-fade-in' },
  Ma = { class: 'mb-6' },
  Ra = { class: 'flex items-center gap-2 mb-4' },
  Ha = { class: 'space-y-3' },
  Qa = { class: 'flex items-center gap-3' },
  Ya = { class: 'font-semibold text-base capitalize' },
  Ga = { class: 'text-xs text-gray-600' },
  Wa = { class: 'flex items-center gap-2' },
  Ja = { class: 'text-sm text-gray-600 mr-3' },
  Ka = { key: 0, class: 'mb-6' },
  Xa = { class: 'flex items-center gap-2 mb-4' },
  Za = { class: 'va-table-responsive' },
  eo = { class: 'va-table va-table--hoverable w-full' },
  to = { class: 'font-medium' },
  so = { class: 'text-center' },
  ao = { class: 'text-right font-semibold' },
  oo = { class: 'mb-6' },
  no = { class: 'flex items-center gap-2 mb-4' },
  io = { class: 'flex items-center justify-between mb-4' },
  ro = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4 mb-4' },
  lo = { class: 'mb-4' },
  mo = { class: 'mb-4' },
  uo = { class: 'flex items-center justify-between mb-3' },
  co = { class: 'flex justify-between items-start mb-3' },
  fo = { class: 'font-semibold text-gray-700' },
  po = { class: 'grid grid-cols-1 md:grid-cols-4 gap-3' },
  go = { key: 1, class: 'p-4 bg-primary rounded-lg text-white' },
  yo = { class: 'flex justify-between items-center' },
  ho = { class: 'text-2xl font-bold' },
  _o = { class: 'animate-fade-in' },
  bo = { class: 'mb-6' },
  vo = { class: 'flex items-center gap-2 mb-4' },
  ko = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm' },
  So = { class: 'ml-2 font-medium' },
  wo = { class: 'ml-2 font-medium' },
  Do = { class: 'ml-2 font-medium' },
  Io = { class: 'ml-2 font-medium' },
  Vo = { class: 'ml-2 font-medium' },
  Co = { class: 'ml-2 font-medium' },
  qo = { class: 'md:col-span-3' },
  xo = { class: 'ml-2 font-medium' },
  $o = { class: 'grid grid-cols-1 md:grid-cols-2 gap-4 text-sm' },
  Ao = { class: 'ml-2 font-medium' },
  Po = { class: 'ml-2 font-medium' },
  Eo = { class: 'grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4' },
  No = { class: 'ml-2 font-medium' },
  Lo = { class: 'ml-2 font-medium' },
  Fo = { class: 'ml-2 font-medium' },
  Oo = { class: 'grid grid-cols-2 md:grid-cols-5 gap-4 text-sm' },
  Uo = { class: 'ml-2 font-medium' },
  zo = { class: 'ml-2 font-medium' },
  To = { class: 'ml-2 font-medium' },
  jo = { class: 'ml-2 font-medium' },
  Bo = { class: 'ml-2 font-medium' },
  Mo = { key: 0, class: 'flex flex-wrap gap-2' },
  Ro = { key: 1, class: 'text-gray-500' },
  Ho = { class: 'flex flex-wrap gap-2' },
  Qo = { class: 'va-table-responsive' },
  Yo = { class: 'va-table va-table--hoverable w-full text-sm' },
  Go = { class: 'font-medium' },
  Wo = { class: 'text-center' },
  Jo = { class: 'text-right font-semibold' },
  Ko = { class: 'sticky bottom-0 bg-white border-t border-gray-200 mt-6 -mx-6 px-6 py-4 shadow-lg z-10' },
  Xo = { class: 'flex justify-between items-center gap-3' },
  Zo = { class: 'flex items-center gap-2' },
  en = { class: 'text-sm text-gray-500 hidden sm:inline' },
  tn = { class: 'flex gap-3' }
function sn(e, t, m, n, p, w) {
  const c = x('VaButton'),
    _ = x('SalesInquiryDetails'),
    h = x('Salesinquirieslist'),
    r = x('VaIcon'),
    g = x('VaBadge'),
    D = x('VaStepper'),
    q = x('VaAlert'),
    U = x('VaRadio'),
    A = x('VaSelect'),
    y = x('VaInput'),
    T = x('VaCardTitle'),
    L = x('VaCardContent'),
    E = x('VaCard'),
    d = x('VaDateInput'),
    f = x('VaChip'),
    S = x('VaCounter'),
    I = x('VaDivider'),
    N = x('VaListItemLabel'),
    R = x('VaListItemSection'),
    F = x('VaListItem'),
    O = x('VaList'),
    H = x('VaSwitch'),
    Y = x('VaTextarea'),
    j = x('VaForm')
  return (
    u(),
    V(
      E,
      { class: 'w-full' },
      {
        default: i(() => [
          a(L, null, {
            default: i(() => [
              s('div', gs, [
                s('div', ys, [
                  e.showAddSalesInquiriesForm || e.showDetailsPage
                    ? (u(),
                      V(
                        c,
                        { key: 0, class: 'px-6', icon: 'arrow_back', size: 'large', onClick: e.handleGoBack },
                        { default: i(() => t[31] || (t[31] = [b(' Go Back ')])), _: 1 },
                        8,
                        ['onClick'],
                      ))
                    : C('', !0),
                ]),
                !e.showAddSalesInquiriesForm && !e.showDetailsPage
                  ? (u(),
                    v('div', hs, [
                      a(
                        c,
                        {
                          class: 'px-6',
                          color: 'secondary',
                          round: '',
                          icon: 'download',
                          size: 'large',
                          onClick: t[0] || (t[0] = (P) => e.downloadAllInquiriesPdf()),
                        },
                        { default: i(() => t[32] || (t[32] = [b('Download PDF')])), _: 1 },
                      ),
                      a(
                        c,
                        {
                          class: 'px-6',
                          color: 'primary',
                          round: '',
                          icon: 'add',
                          size: 'large',
                          onClick: t[1] || (t[1] = (P) => e.toggleAddSalesInquiriesForm()),
                        },
                        { default: i(() => t[33] || (t[33] = [b('Create Enquiry')])), _: 1 },
                      ),
                    ]))
                  : C('', !0),
              ]),
              e.showDetailsPage
                ? (u(), V(_, { key: 0, item: e.selectedInquiryItem }, null, 8, ['item']))
                : (u(),
                  v(
                    B,
                    { key: 1 },
                    [
                      e.showAddSalesInquiriesForm
                        ? (u(),
                          v('div', _s, [
                            s('div', bs, [
                              s('div', vs, [
                                a(r, { name: 'edit_note', color: 'primary', size: 'large' }),
                                s('h2', ks, l(e.isEditMode ? 'Edit Enquiry' : 'Create New Enquiry'), 1),
                              ]),
                              s('div', Ss, [
                                a(
                                  g,
                                  { color: 'primary', text: `Step ${e.currentStep + 1} of ${e.wizardSteps.length}` },
                                  null,
                                  8,
                                  ['text'],
                                ),
                                s('span', ws, l(e.wizardSteps[e.currentStep].label), 1),
                              ]),
                            ]),
                            s('div', Ds, [
                              s(
                                'div',
                                {
                                  class: 'bg-primary h-2 rounded-full transition-all duration-300',
                                  style: Fe({ width: `${((e.currentStep + 1) / e.wizardSteps.length) * 100}%` }),
                                },
                                null,
                                4,
                              ),
                            ]),
                            a(
                              D,
                              {
                                modelValue: e.currentStep,
                                'onUpdate:modelValue': t[3] || (t[3] = (P) => (e.currentStep = P)),
                                steps: e.wizardSteps,
                                color: 'primary',
                                class: 'mb-6',
                                'navigation-disabled': '',
                                'controls-hidden': '',
                              },
                              {
                                'step-button-0': i(() => [
                                  s('div', Is, [
                                    a(r, { name: 'person' }),
                                    e.isStep1Complete
                                      ? (u(),
                                        V(r, {
                                          key: 0,
                                          name: 'check_circle',
                                          color: 'success',
                                          size: 'small',
                                          class: 'absolute -top-1 -right-1',
                                        }))
                                      : C('', !0),
                                  ]),
                                ]),
                                'step-button-1': i(() => [
                                  s('div', Vs, [
                                    a(r, { name: 'event' }),
                                    e.isStep2Complete
                                      ? (u(),
                                        V(r, {
                                          key: 0,
                                          name: 'check_circle',
                                          color: 'success',
                                          size: 'small',
                                          class: 'absolute -top-1 -right-1',
                                        }))
                                      : C('', !0),
                                  ]),
                                ]),
                                'step-button-2': i(() => [
                                  s('div', Cs, [
                                    a(r, { name: 'hiking' }),
                                    e.isStep3Complete
                                      ? (u(),
                                        V(r, {
                                          key: 0,
                                          name: 'check_circle',
                                          color: 'success',
                                          size: 'small',
                                          class: 'absolute -top-1 -right-1',
                                        }))
                                      : C('', !0),
                                  ]),
                                ]),
                                'step-button-3': i(() => [a(r, { name: 'fact_check' })]),
                                _: 1,
                              },
                              8,
                              ['modelValue', 'steps'],
                            ),
                            a(
                              j,
                              { ref: 'formRef', class: 'space-y-6' },
                              {
                                default: i(() => {
                                  var P, z, Z, ee, te, se, ae, oe, ne, ie, re
                                  return [
                                    le(
                                      s(
                                        'div',
                                        qs,
                                        [
                                          s('div', xs, [
                                            s('div', $s, [
                                              a(r, { name: 'person_search', color: 'primary', size: 'large' }),
                                              t[34] ||
                                                (t[34] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Customer Selection',
                                                  -1,
                                                )),
                                              e.customerType
                                                ? (u(),
                                                  V(r, {
                                                    key: 0,
                                                    name: 'check_circle',
                                                    color: 'success',
                                                    size: 'small',
                                                  }))
                                                : C('', !0),
                                            ]),
                                            a(
                                              q,
                                              { color: 'info', class: 'mb-4', border: 'left' },
                                              {
                                                title: i(() => t[35] || (t[35] = [b('New or Existing Customer?')])),
                                                default: i(() => [
                                                  t[36] ||
                                                    (t[36] = b(
                                                      ' Select an existing customer to auto-fill their information, or choose "New Customer" to enter details manually. ',
                                                    )),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            s('div', As, [
                                              a(
                                                U,
                                                {
                                                  modelValue: e.customerType,
                                                  'onUpdate:modelValue': t[4] || (t[4] = (o) => (e.customerType = o)),
                                                  option: 'new',
                                                  label: 'New Customer',
                                                  name: 'customerType',
                                                },
                                                null,
                                                8,
                                                ['modelValue'],
                                              ),
                                              a(
                                                U,
                                                {
                                                  modelValue: e.customerType,
                                                  'onUpdate:modelValue': t[5] || (t[5] = (o) => (e.customerType = o)),
                                                  option: 'existing',
                                                  label: 'Existing Customer',
                                                  name: 'customerType',
                                                },
                                                null,
                                                8,
                                                ['modelValue'],
                                              ),
                                            ]),
                                            e.customerType === 'existing'
                                              ? (u(),
                                                v('div', Ps, [
                                                  a(
                                                    A,
                                                    {
                                                      modelValue: e.selectedExistingCustomer,
                                                      'onUpdate:modelValue': [
                                                        t[6] || (t[6] = (o) => (e.selectedExistingCustomer = o)),
                                                        e.populateFormFromCustomer,
                                                      ],
                                                      placeholder: 'Search and select an existing customer',
                                                      label: 'Select Customer',
                                                      options: e.existingCustomersOptions,
                                                      loading: e.loadingCustomers,
                                                      searchable: '',
                                                      'highlight-matched-text': '',
                                                      clearable: '',
                                                    },
                                                    {
                                                      content: i(({ value: o }) => {
                                                        var k, $
                                                        return [
                                                          o
                                                            ? (u(),
                                                              v('div', Es, [
                                                                s('span', Ns, l(o.text), 1),
                                                                s(
                                                                  'span',
                                                                  Ls,
                                                                  l(
                                                                    ((k = o.selfItem) == null ? void 0 : k.email) ||
                                                                      'N/A',
                                                                  ) +
                                                                    ' • ' +
                                                                    l(
                                                                      (($ = o.selfItem) == null ? void 0 : $.country) ||
                                                                        'N/A',
                                                                    ),
                                                                  1,
                                                                ),
                                                              ]))
                                                            : C('', !0),
                                                        ]
                                                      }),
                                                      _: 1,
                                                    },
                                                    8,
                                                    ['modelValue', 'options', 'loading', 'onUpdate:modelValue'],
                                                  ),
                                                ]))
                                              : C('', !0),
                                          ]),
                                          s('div', Fs, [
                                            s('div', Os, [
                                              a(r, { name: 'person', color: 'primary', size: 'large' }),
                                              t[37] ||
                                                (t[37] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Basic Information',
                                                  -1,
                                                )),
                                              e.form.full_name && e.form.country && e.form.nationality
                                                ? (u(),
                                                  V(r, {
                                                    key: 0,
                                                    name: 'check_circle',
                                                    color: 'success',
                                                    size: 'small',
                                                  }))
                                                : C('', !0),
                                            ]),
                                            s('div', Us, [
                                              a(
                                                y,
                                                {
                                                  modelValue: e.form.full_name,
                                                  'onUpdate:modelValue': t[7] || (t[7] = (o) => (e.form.full_name = o)),
                                                  type: 'text',
                                                  placeholder: 'Enter your Full name',
                                                  rules: [(o) => (o && o.length > 0) || 'Full name is required'],
                                                  label: 'Full name',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'rules'],
                                              ),
                                              a(
                                                A,
                                                {
                                                  modelValue: e.form.country,
                                                  'onUpdate:modelValue': t[8] || (t[8] = (o) => (e.form.country = o)),
                                                  placeholder: 'Select Country',
                                                  label: 'Country',
                                                  rules: [(o) => o || 'Country is required'],
                                                  options: e.countries,
                                                  searchable: '',
                                                  'highlight-matched-text': '',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'rules', 'options'],
                                              ),
                                              a(
                                                A,
                                                {
                                                  modelValue: e.form.nationality,
                                                  'onUpdate:modelValue':
                                                    t[9] || (t[9] = (o) => (e.form.nationality = o)),
                                                  placeholder: 'Select Client nationality',
                                                  label: 'Client Nationality',
                                                  rules: [(o) => o || 'Nationality is required'],
                                                  options: e.nationality,
                                                  searchable: '',
                                                  'highlight-matched-text': '',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'rules', 'options'],
                                              ),
                                            ]),
                                          ]),
                                          s('div', zs, [
                                            s('div', Ts, [
                                              a(r, { name: 'contact_mail', color: 'primary', size: 'large' }),
                                              t[38] ||
                                                (t[38] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Contact Information',
                                                  -1,
                                                )),
                                              e.form.email && e.form.phone && e.form.address
                                                ? (u(),
                                                  V(r, {
                                                    key: 0,
                                                    name: 'check_circle',
                                                    color: 'success',
                                                    size: 'small',
                                                  }))
                                                : C('', !0),
                                            ]),
                                            s('div', js, [
                                              a(
                                                y,
                                                {
                                                  modelValue: e.form.email,
                                                  'onUpdate:modelValue': t[10] || (t[10] = (o) => (e.form.email = o)),
                                                  type: 'email',
                                                  placeholder: 'Enter your email',
                                                  rules: [e.validators.required, e.validators.email],
                                                  label: 'Email',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'rules'],
                                              ),
                                              a(
                                                y,
                                                {
                                                  modelValue: e.form.phone,
                                                  'onUpdate:modelValue': t[11] || (t[11] = (o) => (e.form.phone = o)),
                                                  type: 'text',
                                                  placeholder: 'eg: +971501234567',
                                                  rules: [e.validators.required, e.validators.tell],
                                                  label: 'Primary Phone',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'rules'],
                                              ),
                                              a(
                                                y,
                                                {
                                                  modelValue: e.form.phone_additional,
                                                  'onUpdate:modelValue':
                                                    t[12] || (t[12] = (o) => (e.form.phone_additional = o)),
                                                  type: 'text',
                                                  placeholder: 'eg: +971501234567 (Optional)',
                                                  label: 'Additional Phone',
                                                },
                                                null,
                                                8,
                                                ['modelValue'],
                                              ),
                                              a(
                                                y,
                                                {
                                                  modelValue: e.form.address,
                                                  'onUpdate:modelValue': t[13] || (t[13] = (o) => (e.form.address = o)),
                                                  type: 'text',
                                                  'max-length': 30,
                                                  placeholder: 'Enter your address',
                                                  rules: [(o) => (o && o.length > 0) || 'Address is required'],
                                                  label: 'Address',
                                                },
                                                null,
                                                8,
                                                ['modelValue', 'rules'],
                                              ),
                                            ]),
                                          ]),
                                        ],
                                        512,
                                      ),
                                      [[de, e.currentStep === 0]],
                                    ),
                                    le(
                                      s(
                                        'div',
                                        Bs,
                                        [
                                          s('div', Ms, [
                                            s('div', Rs, [
                                              a(r, { name: 'event', color: 'primary', size: 'large' }),
                                              t[39] ||
                                                (t[39] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Season & Package',
                                                  -1,
                                                )),
                                              e.form.season && e.form.priceListId
                                                ? (u(),
                                                  V(r, {
                                                    key: 0,
                                                    name: 'check_circle',
                                                    color: 'success',
                                                    size: 'small',
                                                  }))
                                                : C('', !0),
                                            ]),
                                            s('div', Hs, [
                                              s('div', null, [
                                                t[40] ||
                                                  (t[40] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Season',
                                                    -1,
                                                  )),
                                                a(
                                                  A,
                                                  {
                                                    modelValue: e.form.season,
                                                    'onUpdate:modelValue': [
                                                      t[14] || (t[14] = (o) => (e.form.season = o)),
                                                      e.onSeasonSelected,
                                                    ],
                                                    placeholder: 'Select Season',
                                                    rules: [(o) => o || 'Season is required'],
                                                    options: e.seasonsOptions,
                                                    searchable: '',
                                                    'highlight-matched-text': '',
                                                  },
                                                  {
                                                    content: i(({ value: o }) => [
                                                      o
                                                        ? (u(),
                                                          v('div', Qs, [
                                                            s('span', Ys, l(o.text), 1),
                                                            o.selfItem
                                                              ? (u(),
                                                                v(
                                                                  'span',
                                                                  Gs,
                                                                  l(
                                                                    e.formatDateRange(
                                                                      o.selfItem.start_at,
                                                                      o.selfItem.end_at,
                                                                    ),
                                                                  ),
                                                                  1,
                                                                ))
                                                              : C('', !0),
                                                          ]))
                                                        : C('', !0),
                                                    ]),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ['modelValue', 'rules', 'options', 'onUpdate:modelValue'],
                                                ),
                                              ]),
                                              s('div', null, [
                                                t[41] ||
                                                  (t[41] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Hunting Package',
                                                    -1,
                                                  )),
                                                a(
                                                  A,
                                                  {
                                                    modelValue: e.form.priceListId,
                                                    'onUpdate:modelValue': [
                                                      t[15] || (t[15] = (o) => (e.form.priceListId = o)),
                                                      e.populateFormFromPackage,
                                                    ],
                                                    placeholder: 'Select a Hunting Package',
                                                    options: e.filteredPackagesOptions,
                                                    searchable: '',
                                                    'highlight-matched-text': '',
                                                    clearable: '',
                                                    disabled: !e.form.season || e.filteredPackagesOptions.length === 0,
                                                  },
                                                  {
                                                    content: i(({ value: o }) => {
                                                      var k, $, M, W
                                                      return [
                                                        o
                                                          ? (u(),
                                                            v('div', Ws, [
                                                              s('span', Js, l(o.text), 1),
                                                              s(
                                                                'span',
                                                                Ks,
                                                                l(
                                                                  ((k = o.selfItem) == null ? void 0 : k.area) ||
                                                                    (($ = o.selfItem) == null
                                                                      ? void 0
                                                                      : $.area_package) ||
                                                                    'N/A',
                                                                ) +
                                                                  ' • ' +
                                                                  l(
                                                                    ((M = o.selfItem) == null
                                                                      ? void 0
                                                                      : M.hunting_type) || 'N/A',
                                                                  ) +
                                                                  ' • ' +
                                                                  l(
                                                                    ((W = o.selfItem) == null ? void 0 : W.duration) ||
                                                                      0,
                                                                  ) +
                                                                  ' days ',
                                                                1,
                                                              ),
                                                            ]))
                                                          : C('', !0),
                                                      ]
                                                    }),
                                                    _: 1,
                                                  },
                                                  8,
                                                  ['modelValue', 'options', 'disabled', 'onUpdate:modelValue'],
                                                ),
                                              ]),
                                            ]),
                                            e.form.priceListId && e.form.priceListId.selfItem
                                              ? (u(),
                                                V(
                                                  E,
                                                  { key: 0, outlined: '', class: 'mb-4 bg-gray-50' },
                                                  {
                                                    default: i(() => [
                                                      a(
                                                        T,
                                                        { class: 'text-sm font-semibold flex items-center gap-2' },
                                                        {
                                                          default: i(() => {
                                                            var o, k
                                                            return [
                                                              a(r, { name: 'info', size: 'small', color: 'info' }),
                                                              b(
                                                                ' Package Details - ' +
                                                                  l(
                                                                    ((k =
                                                                      (o = e.form.priceListId.selfItem) == null
                                                                        ? void 0
                                                                        : o.sales_package) == null
                                                                      ? void 0
                                                                      : k.name) || e.form.priceListId.text,
                                                                  ),
                                                                1,
                                                              ),
                                                            ]
                                                          }),
                                                          _: 1,
                                                        },
                                                      ),
                                                      a(L, null, {
                                                        default: i(() => {
                                                          var o,
                                                            k,
                                                            $,
                                                            M,
                                                            W,
                                                            K,
                                                            he,
                                                            _e,
                                                            be,
                                                            ve,
                                                            ke,
                                                            Se,
                                                            we,
                                                            De,
                                                            Ie,
                                                            Ve,
                                                            Ce
                                                          return [
                                                            s('div', Xs, [
                                                              s('div', null, [
                                                                t[42] ||
                                                                  (t[42] = s(
                                                                    'span',
                                                                    { class: 'text-gray-600' },
                                                                    'Area:',
                                                                    -1,
                                                                  )),
                                                                s(
                                                                  'span',
                                                                  Zs,
                                                                  l(
                                                                    (($ =
                                                                      (k =
                                                                        (o = e.form.priceListId.selfItem) == null
                                                                          ? void 0
                                                                          : o.sales_package) == null
                                                                        ? void 0
                                                                        : k.area) == null
                                                                      ? void 0
                                                                      : $.name) ||
                                                                      ((M = e.form.priceListId.selfItem) == null
                                                                        ? void 0
                                                                        : M.area) ||
                                                                      'N/A',
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              s('div', null, [
                                                                t[43] ||
                                                                  (t[43] = s(
                                                                    'span',
                                                                    { class: 'text-gray-600' },
                                                                    'Hunting Type:',
                                                                    -1,
                                                                  )),
                                                                s(
                                                                  'span',
                                                                  ea,
                                                                  l(
                                                                    ((he =
                                                                      (K =
                                                                        (W = e.form.priceListId.selfItem) == null
                                                                          ? void 0
                                                                          : W.price_list_type) == null
                                                                        ? void 0
                                                                        : K.hunting_type) == null
                                                                      ? void 0
                                                                      : he.name) ||
                                                                      ((_e = e.form.priceListId.selfItem) == null
                                                                        ? void 0
                                                                        : _e.hunting_type) ||
                                                                      'N/A',
                                                                  ),
                                                                  1,
                                                                ),
                                                              ]),
                                                              s('div', null, [
                                                                t[44] ||
                                                                  (t[44] = s(
                                                                    'span',
                                                                    { class: 'text-gray-600' },
                                                                    'Duration:',
                                                                    -1,
                                                                  )),
                                                                s(
                                                                  'span',
                                                                  ta,
                                                                  l(
                                                                    ((ve =
                                                                      (be = e.form.priceListId.selfItem) == null
                                                                        ? void 0
                                                                        : be.price_list_type) == null
                                                                      ? void 0
                                                                      : ve.duration) ||
                                                                      ((ke = e.form.priceListId.selfItem) == null
                                                                        ? void 0
                                                                        : ke.duration) ||
                                                                      0,
                                                                  ) + ' days',
                                                                  1,
                                                                ),
                                                              ]),
                                                              s('div', null, [
                                                                t[45] ||
                                                                  (t[45] = s(
                                                                    'span',
                                                                    { class: 'text-gray-600' },
                                                                    'Base Amount:',
                                                                    -1,
                                                                  )),
                                                                s(
                                                                  'span',
                                                                  sa,
                                                                  l(
                                                                    ((De =
                                                                      (we =
                                                                        (Se = e.form.priceListId.selfItem) == null
                                                                          ? void 0
                                                                          : Se.price_list_type) == null
                                                                        ? void 0
                                                                        : we.currency) == null
                                                                      ? void 0
                                                                      : De.symbol) || '$',
                                                                  ) +
                                                                    l(
                                                                      ((Ve =
                                                                        (Ie = e.form.priceListId.selfItem) == null
                                                                          ? void 0
                                                                          : Ie.price_list_type) == null
                                                                        ? void 0
                                                                        : Ve.amount) ||
                                                                        ((Ce = e.form.priceListId.selfItem) == null
                                                                          ? void 0
                                                                          : Ce.amount) ||
                                                                        'N/A',
                                                                    ),
                                                                  1,
                                                                ),
                                                              ]),
                                                            ]),
                                                          ]
                                                        }),
                                                        _: 1,
                                                      }),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : C('', !0),
                                          ]),
                                          s('div', aa, [
                                            s('div', oa, [
                                              a(r, { name: 'calendar_month', color: 'primary', size: 'large' }),
                                              t[46] ||
                                                (t[46] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Hunt Dates',
                                                  -1,
                                                )),
                                              e.form.preferred_date && e.form.start_date && e.form.end_date
                                                ? (u(),
                                                  V(r, {
                                                    key: 0,
                                                    name: 'check_circle',
                                                    color: 'success',
                                                    size: 'small',
                                                  }))
                                                : C('', !0),
                                            ]),
                                            s('div', na, [
                                              s('div', null, [
                                                t[47] ||
                                                  (t[47] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Preferred Date',
                                                    -1,
                                                  )),
                                                a(
                                                  d,
                                                  {
                                                    modelValue: e.form.preferred_date,
                                                    'onUpdate:modelValue': [
                                                      t[16] || (t[16] = (o) => (e.form.preferred_date = o)),
                                                      e.checkBookedDateConflict,
                                                    ],
                                                    placeholder: 'Select Preferred Date',
                                                    rules: [(o) => o || 'Preferred Date is required'],
                                                    'allowed-days': e.checkDateAllowed,
                                                    disabled: !e.form.season,
                                                    'first-weekday': 'Monday',
                                                    required: '',
                                                  },
                                                  null,
                                                  8,
                                                  [
                                                    'modelValue',
                                                    'rules',
                                                    'allowed-days',
                                                    'disabled',
                                                    'onUpdate:modelValue',
                                                  ],
                                                ),
                                              ]),
                                              s('div', null, [
                                                t[48] ||
                                                  (t[48] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Start Date',
                                                    -1,
                                                  )),
                                                a(
                                                  d,
                                                  {
                                                    modelValue: e.form.start_date,
                                                    'onUpdate:modelValue': [
                                                      t[17] || (t[17] = (o) => (e.form.start_date = o)),
                                                      e.onStartDateChange,
                                                    ],
                                                    placeholder: 'Select Start Date',
                                                    rules: [(o) => o || 'Start Date is required'],
                                                    'allowed-days': e.checkDateAllowed,
                                                    disabled: !e.form.season,
                                                    'first-weekday': 'Monday',
                                                    required: '',
                                                  },
                                                  null,
                                                  8,
                                                  [
                                                    'modelValue',
                                                    'rules',
                                                    'allowed-days',
                                                    'disabled',
                                                    'onUpdate:modelValue',
                                                  ],
                                                ),
                                              ]),
                                              s('div', null, [
                                                t[49] ||
                                                  (t[49] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'End Date',
                                                    -1,
                                                  )),
                                                a(
                                                  d,
                                                  {
                                                    modelValue: e.form.end_date,
                                                    'onUpdate:modelValue': [
                                                      t[18] || (t[18] = (o) => (e.form.end_date = o)),
                                                      e.onEndDateChange,
                                                    ],
                                                    placeholder: 'Select End Date',
                                                    rules: [
                                                      (o) => o || 'End Date is required',
                                                      (o) =>
                                                        !e.form.start_date ||
                                                        new Date(o) >= new Date(e.form.start_date) ||
                                                        'End date must be after start date',
                                                    ],
                                                    'allowed-days': e.checkDateAllowed,
                                                    disabled: !e.form.season || !e.form.start_date,
                                                    'first-weekday': 'Monday',
                                                    required: '',
                                                  },
                                                  null,
                                                  8,
                                                  [
                                                    'modelValue',
                                                    'rules',
                                                    'allowed-days',
                                                    'disabled',
                                                    'onUpdate:modelValue',
                                                  ],
                                                ),
                                              ]),
                                            ]),
                                            e.form.start_date && e.form.end_date && e.huntDuration > 0
                                              ? (u(),
                                                V(
                                                  q,
                                                  { key: 0, color: 'info', class: 'mb-4', border: 'left' },
                                                  {
                                                    title: i(() => [
                                                      a(r, { name: 'date_range', class: 'mr-1' }),
                                                      b(' Hunt Duration: ' + l(e.huntDuration) + ' days ', 1),
                                                    ]),
                                                    default: i(() => [
                                                      b(
                                                        ' From ' +
                                                          l(e.formatDate(e.form.start_date)) +
                                                          ' to ' +
                                                          l(e.formatDate(e.form.end_date)),
                                                        1,
                                                      ),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : C('', !0),
                                            e.dateConflictWarning
                                              ? (u(),
                                                V(
                                                  q,
                                                  { key: 1, color: 'warning', class: 'mt-4 mb-4', border: 'left' },
                                                  {
                                                    title: i(() => [
                                                      a(r, { name: 'warning', class: 'mr-1' }),
                                                      t[50] || (t[50] = b(' Date Conflict Detected ')),
                                                    ]),
                                                    default: i(() => [b(' ' + l(e.dateConflictWarning), 1)]),
                                                    _: 1,
                                                  },
                                                ))
                                              : C('', !0),
                                            e.bookedDatesForSelectedSeason.length > 0
                                              ? (u(),
                                                v('div', ia, [
                                                  s('div', ra, [
                                                    a(r, { name: 'event_busy', size: 'small', class: 'mr-1' }),
                                                    t[51] || (t[51] = b(' Already Booked Dates (Not Available): ')),
                                                  ]),
                                                  s('div', la, [
                                                    (u(!0),
                                                    v(
                                                      B,
                                                      null,
                                                      Q(
                                                        e.bookedDatesForSelectedSeason,
                                                        (o, k) => (
                                                          u(),
                                                          V(
                                                            f,
                                                            { key: k, color: 'danger', size: 'small', outline: '' },
                                                            {
                                                              default: i(() => [
                                                                b(
                                                                  l(e.formatBookingDateRange(o)) +
                                                                    ' - ' +
                                                                    l(o.client_name),
                                                                  1,
                                                                ),
                                                              ]),
                                                              _: 2,
                                                            },
                                                            1024,
                                                          )
                                                        ),
                                                      ),
                                                      128,
                                                    )),
                                                  ]),
                                                ]))
                                              : C('', !0),
                                          ]),
                                          s('div', da, [
                                            s('div', ma, [
                                              a(r, { name: 'groups', color: 'primary', size: 'large' }),
                                              t[52] ||
                                                (t[52] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Hunt Party Details',
                                                  -1,
                                                )),
                                              e.huntDuration > 0 && e.form.no_of_hunters
                                                ? (u(),
                                                  V(r, {
                                                    key: 0,
                                                    name: 'check_circle',
                                                    color: 'success',
                                                    size: 'small',
                                                  }))
                                                : C('', !0),
                                            ]),
                                            s('div', ua, [
                                              s('div', null, [
                                                t[53] ||
                                                  (t[53] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Hunting Days',
                                                    -1,
                                                  )),
                                                s('div', ca, [
                                                  a(r, { name: 'event', color: 'primary' }),
                                                  e.huntDuration > 0
                                                    ? (u(), v('span', fa, l(e.huntDuration) + ' days', 1))
                                                    : (u(), v('span', pa, 'Select dates above')),
                                                ]),
                                              ]),
                                              s('div', null, [
                                                t[54] ||
                                                  (t[54] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Hunting Area',
                                                    -1,
                                                  )),
                                                a(
                                                  A,
                                                  {
                                                    modelValue: e.form.area,
                                                    'onUpdate:modelValue': t[19] || (t[19] = (o) => (e.form.area = o)),
                                                    placeholder: 'Select Area',
                                                    rules: [(o) => o || 'Hunting area is required'],
                                                    options: e.areasOptions,
                                                    disabled: '',
                                                    readonly: '',
                                                  },
                                                  null,
                                                  8,
                                                  ['modelValue', 'rules', 'options'],
                                                ),
                                              ]),
                                            ]),
                                            (P = e.form.priceListId) != null && P.selfItem
                                              ? (u(),
                                                v('div', ga, [
                                                  ((z = e.form.priceListId.selfItem.observer) == null
                                                    ? void 0
                                                    : z.length) > 0
                                                    ? (u(),
                                                      V(
                                                        E,
                                                        { key: 0, outlined: '', class: 'bg-green-50' },
                                                        {
                                                          default: i(() => [
                                                            a(
                                                              L,
                                                              { class: 'p-4' },
                                                              {
                                                                default: i(() => {
                                                                  var o, k, $, M
                                                                  return [
                                                                    s('div', ya, [
                                                                      a(r, { name: 'visibility', color: 'success' }),
                                                                      t[55] ||
                                                                        (t[55] = s(
                                                                          'span',
                                                                          { class: 'font-semibold' },
                                                                          'Observer Rate',
                                                                          -1,
                                                                        )),
                                                                    ]),
                                                                    s(
                                                                      'div',
                                                                      ha,
                                                                      l(
                                                                        ((k =
                                                                          (o =
                                                                            e.form.priceListId.selfItem
                                                                              .price_list_type) == null
                                                                            ? void 0
                                                                            : o.currency) == null
                                                                          ? void 0
                                                                          : k.symbol) || '$',
                                                                      ) +
                                                                        l(
                                                                          e.form.priceListId.selfItem.observer[0]
                                                                            .amount,
                                                                        ),
                                                                      1,
                                                                    ),
                                                                    t[57] ||
                                                                      (t[57] = s(
                                                                        'div',
                                                                        { class: 'text-sm text-gray-600 mt-1' },
                                                                        'per observer',
                                                                        -1,
                                                                      )),
                                                                    e.form.no_of_observers > 0
                                                                      ? (u(),
                                                                        v('div', _a, [
                                                                          t[56] ||
                                                                            (t[56] = s(
                                                                              'span',
                                                                              { class: 'text-sm' },
                                                                              'Subtotal: ',
                                                                              -1,
                                                                            )),
                                                                          s(
                                                                            'span',
                                                                            ba,
                                                                            l(
                                                                              ((M =
                                                                                ($ =
                                                                                  e.form.priceListId.selfItem
                                                                                    .price_list_type) == null
                                                                                  ? void 0
                                                                                  : $.currency) == null
                                                                                ? void 0
                                                                                : M.symbol) || '$',
                                                                            ) +
                                                                              l(
                                                                                (
                                                                                  e.form.no_of_observers *
                                                                                  e.form.priceListId.selfItem
                                                                                    .observer[0].amount
                                                                                ).toLocaleString(),
                                                                              ),
                                                                            1,
                                                                          ),
                                                                        ]))
                                                                      : C('', !0),
                                                                  ]
                                                                }),
                                                                _: 1,
                                                              },
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ))
                                                    : C('', !0),
                                                  ((Z = e.form.priceListId.selfItem.companion_hunter_costs) == null
                                                    ? void 0
                                                    : Z.length) > 0
                                                    ? (u(),
                                                      V(
                                                        E,
                                                        { key: 1, outlined: '', class: 'bg-blue-50' },
                                                        {
                                                          default: i(() => [
                                                            a(
                                                              L,
                                                              { class: 'p-4' },
                                                              {
                                                                default: i(() => {
                                                                  var o, k, $, M
                                                                  return [
                                                                    s('div', va, [
                                                                      a(r, { name: 'group', color: 'primary' }),
                                                                      t[58] ||
                                                                        (t[58] = s(
                                                                          'span',
                                                                          { class: 'font-semibold' },
                                                                          'Companion Hunter Rate',
                                                                          -1,
                                                                        )),
                                                                    ]),
                                                                    s(
                                                                      'div',
                                                                      ka,
                                                                      l(
                                                                        ((k =
                                                                          (o =
                                                                            e.form.priceListId.selfItem
                                                                              .price_list_type) == null
                                                                            ? void 0
                                                                            : o.currency) == null
                                                                          ? void 0
                                                                          : k.symbol) || '$',
                                                                      ) +
                                                                        l(
                                                                          e.form.priceListId.selfItem
                                                                            .companion_hunter_costs[0].amount,
                                                                        ),
                                                                      1,
                                                                    ),
                                                                    t[60] ||
                                                                      (t[60] = s(
                                                                        'div',
                                                                        { class: 'text-sm text-gray-600 mt-1' },
                                                                        'per companion hunter',
                                                                        -1,
                                                                      )),
                                                                    e.form.no_of_companions > 0
                                                                      ? (u(),
                                                                        v('div', Sa, [
                                                                          t[59] ||
                                                                            (t[59] = s(
                                                                              'span',
                                                                              { class: 'text-sm' },
                                                                              'Subtotal: ',
                                                                              -1,
                                                                            )),
                                                                          s(
                                                                            'span',
                                                                            wa,
                                                                            l(
                                                                              ((M =
                                                                                ($ =
                                                                                  e.form.priceListId.selfItem
                                                                                    .price_list_type) == null
                                                                                  ? void 0
                                                                                  : $.currency) == null
                                                                                ? void 0
                                                                                : M.symbol) || '$',
                                                                            ) +
                                                                              l(
                                                                                (
                                                                                  e.form.no_of_companions *
                                                                                  e.form.priceListId.selfItem
                                                                                    .companion_hunter_costs[0].amount
                                                                                ).toLocaleString(),
                                                                              ),
                                                                            1,
                                                                          ),
                                                                        ]))
                                                                      : C('', !0),
                                                                  ]
                                                                }),
                                                                _: 1,
                                                              },
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ))
                                                    : C('', !0),
                                                ]))
                                              : C('', !0),
                                            s('div', Da, [
                                              s('div', null, [
                                                t[61] ||
                                                  (t[61] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Number of Hunters',
                                                    -1,
                                                  )),
                                                a(
                                                  y,
                                                  {
                                                    modelValue: e.form.no_of_hunters,
                                                    'onUpdate:modelValue':
                                                      t[20] || (t[20] = (o) => (e.form.no_of_hunters = o)),
                                                    placeholder: 'Enter Number of Hunters',
                                                    type: 'number',
                                                    min: 1,
                                                  },
                                                  null,
                                                  8,
                                                  ['modelValue'],
                                                ),
                                              ]),
                                              s('div', null, [
                                                t[62] ||
                                                  (t[62] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Number of Observers',
                                                    -1,
                                                  )),
                                                a(
                                                  y,
                                                  {
                                                    modelValue: e.form.no_of_observers,
                                                    'onUpdate:modelValue':
                                                      t[21] || (t[21] = (o) => (e.form.no_of_observers = o)),
                                                    placeholder: 'Enter Number of Observers',
                                                    type: 'number',
                                                    min: 0,
                                                  },
                                                  null,
                                                  8,
                                                  ['modelValue'],
                                                ),
                                              ]),
                                              s('div', null, [
                                                t[63] ||
                                                  (t[63] = s(
                                                    'div',
                                                    { class: 'text-xs font-semibold text-gray-700 uppercase mb-1' },
                                                    'Number of Companions',
                                                    -1,
                                                  )),
                                                a(
                                                  y,
                                                  {
                                                    modelValue: e.form.no_of_companions,
                                                    'onUpdate:modelValue':
                                                      t[22] || (t[22] = (o) => (e.form.no_of_companions = o)),
                                                    placeholder: 'Enter Number of Companions',
                                                    type: 'number',
                                                    min: 0,
                                                  },
                                                  null,
                                                  8,
                                                  ['modelValue'],
                                                ),
                                              ]),
                                            ]),
                                          ]),
                                          (te = (ee = e.form.priceListId) == null ? void 0 : ee.selfItem) != null &&
                                          te.upgrade_fees &&
                                          e.form.priceListId.selfItem.upgrade_fees.length > 0
                                            ? (u(),
                                              v('div', Ia, [
                                                s('div', Va, [
                                                  a(r, { name: 'upgrade', color: 'warning', size: 'large' }),
                                                  t[64] ||
                                                    (t[64] = s(
                                                      'h3',
                                                      { class: 'text-xl font-bold text-gray-800' },
                                                      'Upgrade Fees',
                                                      -1,
                                                    )),
                                                ]),
                                                a(
                                                  E,
                                                  { outlined: '', class: 'bg-amber-50' },
                                                  {
                                                    default: i(() => [
                                                      a(L, null, {
                                                        default: i(() => [
                                                          s('div', Ca, [
                                                            s('table', qa, [
                                                              t[65] ||
                                                                (t[65] = s(
                                                                  'thead',
                                                                  null,
                                                                  [
                                                                    s('tr', null, [
                                                                      s('th', { class: 'text-left' }, 'Species'),
                                                                      s('th', { class: 'text-right' }, 'Upgrade Fee'),
                                                                    ]),
                                                                  ],
                                                                  -1,
                                                                )),
                                                              s('tbody', null, [
                                                                (u(!0),
                                                                v(
                                                                  B,
                                                                  null,
                                                                  Q(e.form.priceListId.selfItem.upgrade_fees, (o) => {
                                                                    var k, $, M
                                                                    return (
                                                                      u(),
                                                                      v('tr', { key: o.id }, [
                                                                        s(
                                                                          'td',
                                                                          xa,
                                                                          l(
                                                                            o.species_name ||
                                                                              ((k = o.species) == null
                                                                                ? void 0
                                                                                : k.name) ||
                                                                              'Unknown',
                                                                          ),
                                                                          1,
                                                                        ),
                                                                        s(
                                                                          'td',
                                                                          $a,
                                                                          l(
                                                                            o.currency_symbol ||
                                                                              ((M =
                                                                                ($ =
                                                                                  e.form.priceListId.selfItem
                                                                                    .price_list_type) == null
                                                                                  ? void 0
                                                                                  : $.currency) == null
                                                                                ? void 0
                                                                                : M.symbol) ||
                                                                              '$',
                                                                          ) + l(o.amount),
                                                                          1,
                                                                        ),
                                                                      ])
                                                                    )
                                                                  }),
                                                                  128,
                                                                )),
                                                              ]),
                                                            ]),
                                                          ]),
                                                        ]),
                                                        _: 1,
                                                      }),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ),
                                              ]))
                                            : C('', !0),
                                          s('div', Aa, [
                                            s('div', Pa, [
                                              a(r, { name: 'pets', color: 'primary', size: 'large' }),
                                              t[66] ||
                                                (t[66] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Species Selection',
                                                  -1,
                                                )),
                                            ]),
                                            a(
                                              E,
                                              { outlined: '', class: 'mb-4' },
                                              {
                                                default: i(() => [
                                                  a(L, null, {
                                                    default: i(() => [
                                                      s('div', Ea, [
                                                        s('div', Na, [
                                                          t[67] ||
                                                            (t[67] = s(
                                                              'div',
                                                              {
                                                                class:
                                                                  'text-xs font-semibold text-gray-700 uppercase mb-1',
                                                              },
                                                              'Species',
                                                              -1,
                                                            )),
                                                          a(
                                                            A,
                                                            {
                                                              modelValue: e.form.species,
                                                              'onUpdate:modelValue':
                                                                t[23] || (t[23] = (o) => (e.form.species = o)),
                                                              options: e.speciesOptions,
                                                              placeholder: 'Select Species',
                                                              searchable: '',
                                                              'highlight-matched-text': '',
                                                            },
                                                            null,
                                                            8,
                                                            ['modelValue', 'options'],
                                                          ),
                                                        ]),
                                                        a(
                                                          S,
                                                          {
                                                            modelValue: e.form.quantity,
                                                            'onUpdate:modelValue':
                                                              t[24] || (t[24] = (o) => (e.form.quantity = o)),
                                                            label: 'Quantity',
                                                            'manual-input': '',
                                                            min: 1,
                                                            max: 100,
                                                          },
                                                          null,
                                                          8,
                                                          ['modelValue'],
                                                        ),
                                                        s('div', La, [
                                                          a(
                                                            c,
                                                            {
                                                              color: 'primary',
                                                              icon: 'add',
                                                              onClick:
                                                                t[25] ||
                                                                (t[25] = (o) => e.addNewSpeciesItemToStorage()),
                                                            },
                                                            {
                                                              default: i(() => t[68] || (t[68] = [b(' Add Species ')])),
                                                              _: 1,
                                                            },
                                                          ),
                                                        ]),
                                                      ]),
                                                      a(I, { class: 'my-4' }),
                                                      s('div', Fa, [
                                                        s(
                                                          'div',
                                                          Oa,
                                                          'Selected Species (' + l(e.speciesObjects.length) + ')',
                                                          1,
                                                        ),
                                                        e.speciesObjects.length > 0
                                                          ? (u(),
                                                            V(
                                                              O,
                                                              { key: 0, class: 'space-y-2' },
                                                              {
                                                                default: i(() => [
                                                                  (u(!0),
                                                                  v(
                                                                    B,
                                                                    null,
                                                                    Q(
                                                                      e.speciesObjects,
                                                                      (o, k) => (
                                                                        u(),
                                                                        V(
                                                                          F,
                                                                          {
                                                                            key: k,
                                                                            class:
                                                                              'border rounded-lg p-3 hover:shadow-md transition-shadow',
                                                                          },
                                                                          {
                                                                            default: i(() => [
                                                                              a(
                                                                                R,
                                                                                null,
                                                                                {
                                                                                  default: i(() => [
                                                                                    a(
                                                                                      N,
                                                                                      {
                                                                                        class:
                                                                                          'flex justify-between items-center',
                                                                                      },
                                                                                      {
                                                                                        default: i(() => [
                                                                                          s('div', Ua, [
                                                                                            s('span', za, l(o.name), 1),
                                                                                            o.fromPackage
                                                                                              ? (u(),
                                                                                                V(g, {
                                                                                                  key: 0,
                                                                                                  color: 'info',
                                                                                                  size: 'small',
                                                                                                  text: 'from Package',
                                                                                                }))
                                                                                              : C('', !0),
                                                                                          ]),
                                                                                          s('div', Ta, [
                                                                                            a(
                                                                                              c,
                                                                                              {
                                                                                                preset: 'plain',
                                                                                                icon: 'remove',
                                                                                                color: 'primary',
                                                                                                size: 'small',
                                                                                                disabled:
                                                                                                  o.quantity <= 1,
                                                                                                onClick: ($) =>
                                                                                                  e.decrementQuantity(
                                                                                                    k,
                                                                                                  ),
                                                                                              },
                                                                                              null,
                                                                                              8,
                                                                                              ['disabled', 'onClick'],
                                                                                            ),
                                                                                            s(
                                                                                              'span',
                                                                                              ja,
                                                                                              l(o.quantity),
                                                                                              1,
                                                                                            ),
                                                                                            a(
                                                                                              c,
                                                                                              {
                                                                                                preset: 'plain',
                                                                                                icon: 'add',
                                                                                                color: 'primary',
                                                                                                size: 'small',
                                                                                                onClick: ($) =>
                                                                                                  e.incrementQuantity(
                                                                                                    k,
                                                                                                  ),
                                                                                              },
                                                                                              null,
                                                                                              8,
                                                                                              ['onClick'],
                                                                                            ),
                                                                                            a(
                                                                                              c,
                                                                                              {
                                                                                                preset: 'plain',
                                                                                                icon: 'delete',
                                                                                                color: 'danger',
                                                                                                size: 'small',
                                                                                                class: 'ml-2',
                                                                                                onClick: ($) =>
                                                                                                  e.deleteFromStorage(
                                                                                                    k,
                                                                                                  ),
                                                                                              },
                                                                                              null,
                                                                                              8,
                                                                                              ['onClick'],
                                                                                            ),
                                                                                          ]),
                                                                                        ]),
                                                                                        _: 2,
                                                                                      },
                                                                                      1024,
                                                                                    ),
                                                                                  ]),
                                                                                  _: 2,
                                                                                },
                                                                                1024,
                                                                              ),
                                                                            ]),
                                                                            _: 2,
                                                                          },
                                                                          1024,
                                                                        )
                                                                      ),
                                                                    ),
                                                                    128,
                                                                  )),
                                                                ]),
                                                                _: 1,
                                                              },
                                                            ))
                                                          : (u(),
                                                            V(
                                                              q,
                                                              {
                                                                key: 1,
                                                                color: 'secondary',
                                                                border: 'left',
                                                                class: 'mb-0',
                                                              },
                                                              {
                                                                default: i(
                                                                  () =>
                                                                    t[69] ||
                                                                    (t[69] = [
                                                                      b(
                                                                        ' No species selected yet. Add species using the form above or select a package. ',
                                                                      ),
                                                                    ]),
                                                                ),
                                                                _: 1,
                                                              },
                                                            )),
                                                      ]),
                                                    ]),
                                                    _: 1,
                                                  }),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                          ]),
                                        ],
                                        512,
                                      ),
                                      [[de, e.currentStep === 1]],
                                    ),
                                    le(
                                      s(
                                        'div',
                                        Ba,
                                        [
                                          s('div', Ma, [
                                            s('div', Ra, [
                                              a(r, { name: 'hiking', color: 'primary', size: 'large' }),
                                              t[70] ||
                                                (t[70] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Safari Extras',
                                                  -1,
                                                )),
                                            ]),
                                            e.selectedSafariExtras.length === 0
                                              ? (u(),
                                                V(
                                                  q,
                                                  { key: 0, color: 'secondary', class: 'mb-4', border: 'left' },
                                                  {
                                                    title: i(() => t[71] || (t[71] = [b('No Safari Extras Selected')])),
                                                    default: i(() => [
                                                      t[72] ||
                                                        (t[72] = b(
                                                          ' Safari extras will be populated when you select a package. You can also add them manually later. ',
                                                        )),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : (u(),
                                                v(
                                                  B,
                                                  { key: 1 },
                                                  [
                                                    a(
                                                      q,
                                                      { color: 'info', class: 'mb-4', border: 'left' },
                                                      {
                                                        title: i(() => [
                                                          b(
                                                            'Customize Safari Extras (' +
                                                              l(e.selectedSafariExtras.length) +
                                                              ' selected)',
                                                            1,
                                                          ),
                                                        ]),
                                                        default: i(() => [
                                                          t[73] ||
                                                            (t[73] = b(
                                                              ' Remove any safari extras that your client does not require by clicking the remove button. ',
                                                            )),
                                                        ]),
                                                        _: 1,
                                                      },
                                                    ),
                                                    a(
                                                      E,
                                                      { outlined: '', class: 'mb-4 bg-gray-50' },
                                                      {
                                                        default: i(() => [
                                                          a(L, null, {
                                                            default: i(() => [
                                                              s('div', Ha, [
                                                                (u(!0),
                                                                v(
                                                                  B,
                                                                  null,
                                                                  Q(e.selectedSafariExtras, (o, k) => {
                                                                    var $
                                                                    return (
                                                                      u(),
                                                                      v(
                                                                        'div',
                                                                        {
                                                                          key: o.id,
                                                                          class:
                                                                            'p-3 border rounded-lg bg-white flex justify-between items-center',
                                                                        },
                                                                        [
                                                                          s('div', Qa, [
                                                                            s('div', Ya, l(o.name), 1),
                                                                            o.fromPackage
                                                                              ? (u(),
                                                                                V(g, {
                                                                                  key: 0,
                                                                                  color: 'info',
                                                                                  size: 'small',
                                                                                  text: 'FROM PACKAGE',
                                                                                }))
                                                                              : C('', !0),
                                                                            s('div', Ga, l(o.description), 1),
                                                                          ]),
                                                                          s('div', Wa, [
                                                                            s(
                                                                              'div',
                                                                              Ja,
                                                                              l(
                                                                                (($ = o.currency) == null
                                                                                  ? void 0
                                                                                  : $.symbol) || '$',
                                                                              ) + l(o.amount),
                                                                              1,
                                                                            ),
                                                                            a(
                                                                              c,
                                                                              {
                                                                                preset: 'plain',
                                                                                color: 'danger',
                                                                                size: 'small',
                                                                                icon: 'delete',
                                                                                title: 'Remove this safari extra',
                                                                                onClick: (M) => e.removeSafariExtra(k),
                                                                              },
                                                                              null,
                                                                              8,
                                                                              ['onClick'],
                                                                            ),
                                                                          ]),
                                                                        ],
                                                                      )
                                                                    )
                                                                  }),
                                                                  128,
                                                                )),
                                                              ]),
                                                            ]),
                                                            _: 1,
                                                          }),
                                                        ]),
                                                        _: 1,
                                                      },
                                                    ),
                                                  ],
                                                  64,
                                                )),
                                          ]),
                                          ((oe =
                                            (ae = (se = e.form.priceListId) == null ? void 0 : se.selfItem) == null
                                              ? void 0
                                              : ae.trophy_fees) == null
                                            ? void 0
                                            : oe.length) > 0
                                            ? (u(),
                                              v('div', Ka, [
                                                s('div', Xa, [
                                                  a(r, { name: 'emoji_events', color: 'primary', size: 'large' }),
                                                  t[74] ||
                                                    (t[74] = s(
                                                      'h3',
                                                      { class: 'text-xl font-bold text-gray-800' },
                                                      'Trophy Fees',
                                                      -1,
                                                    )),
                                                ]),
                                                a(
                                                  q,
                                                  { color: 'info', class: 'mb-4', border: 'left' },
                                                  {
                                                    title: i(() => [
                                                      b(
                                                        'Trophy Fees Included (' +
                                                          l(e.form.priceListId.selfItem.trophy_fees.length) +
                                                          ' species)',
                                                        1,
                                                      ),
                                                    ]),
                                                    default: i(() => [
                                                      t[75] ||
                                                        (t[75] = b(
                                                          ' These trophy fees are included in the selected package and will be shown in the final review. ',
                                                        )),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ),
                                                a(
                                                  E,
                                                  { outlined: '', class: 'mb-4 bg-gray-50' },
                                                  {
                                                    default: i(() => [
                                                      a(L, null, {
                                                        default: i(() => [
                                                          s('div', Za, [
                                                            s('table', eo, [
                                                              t[76] ||
                                                                (t[76] = s(
                                                                  'thead',
                                                                  null,
                                                                  [
                                                                    s('tr', null, [
                                                                      s('th', { class: 'text-left' }, 'Species'),
                                                                      s('th', { class: 'text-center' }, 'Sequence'),
                                                                      s('th', { class: 'text-right' }, 'Price'),
                                                                    ]),
                                                                  ],
                                                                  -1,
                                                                )),
                                                              s('tbody', null, [
                                                                (u(!0),
                                                                v(
                                                                  B,
                                                                  null,
                                                                  Q(e.form.priceListId.selfItem.trophy_fees, (o, k) => {
                                                                    var $, M, W, K
                                                                    return (
                                                                      u(),
                                                                      v('tr', { key: `trophy-${o.id}-${k}` }, [
                                                                        s(
                                                                          'td',
                                                                          to,
                                                                          l(
                                                                            (($ = o.species) == null
                                                                              ? void 0
                                                                              : $.name) || 'Unknown',
                                                                          ),
                                                                          1,
                                                                        ),
                                                                        s('td', so, [
                                                                          a(
                                                                            g,
                                                                            {
                                                                              text: e.getSequenceLabel(
                                                                                o.sequence_order,
                                                                              ),
                                                                              color: 'primary',
                                                                              size: 'small',
                                                                            },
                                                                            null,
                                                                            8,
                                                                            ['text'],
                                                                          ),
                                                                        ]),
                                                                        s(
                                                                          'td',
                                                                          ao,
                                                                          l(
                                                                            ((K =
                                                                              (W =
                                                                                (M = e.form.priceListId.selfItem) ==
                                                                                null
                                                                                  ? void 0
                                                                                  : M.price_list_type) == null
                                                                                ? void 0
                                                                                : W.currency) == null
                                                                              ? void 0
                                                                              : K.symbol) || '$',
                                                                          ) + l(o.amount),
                                                                          1,
                                                                        ),
                                                                      ])
                                                                    )
                                                                  }),
                                                                  128,
                                                                )),
                                                              ]),
                                                            ]),
                                                          ]),
                                                        ]),
                                                        _: 1,
                                                      }),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ),
                                              ]))
                                            : C('', !0),
                                          s('div', oo, [
                                            s('div', no, [
                                              a(r, { name: 'request_quote', color: 'primary', size: 'large' }),
                                              t[77] ||
                                                (t[77] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Quotation',
                                                  -1,
                                                )),
                                            ]),
                                            a(
                                              E,
                                              { outlined: '', class: 'mb-4' },
                                              {
                                                default: i(() => [
                                                  a(L, null, {
                                                    default: i(() => [
                                                      s('div', io, [
                                                        t[78] ||
                                                          (t[78] = s(
                                                            'div',
                                                            null,
                                                            [
                                                              s(
                                                                'h4',
                                                                { class: 'font-semibold text-lg' },
                                                                'Create Quotation for this Inquiry?',
                                                              ),
                                                              s(
                                                                'p',
                                                                { class: 'text-sm text-gray-600' },
                                                                ' Enable this option to generate a quotation with payment installments for the client. ',
                                                              ),
                                                            ],
                                                            -1,
                                                          )),
                                                        a(
                                                          H,
                                                          {
                                                            modelValue: e.createQuotation,
                                                            'onUpdate:modelValue':
                                                              t[26] || (t[26] = (o) => (e.createQuotation = o)),
                                                            color: 'primary',
                                                            size: 'medium',
                                                          },
                                                          null,
                                                          8,
                                                          ['modelValue'],
                                                        ),
                                                      ]),
                                                      e.createQuotation
                                                        ? (u(),
                                                          v(
                                                            B,
                                                            { key: 0 },
                                                            [
                                                              a(I, { class: 'mb-4' }),
                                                              s('div', ro, [
                                                                s('div', null, [
                                                                  t[79] ||
                                                                    (t[79] = s(
                                                                      'div',
                                                                      {
                                                                        class:
                                                                          'text-xs font-semibold text-gray-700 uppercase mb-1',
                                                                      },
                                                                      'Confirmation Date',
                                                                      -1,
                                                                    )),
                                                                  a(
                                                                    d,
                                                                    {
                                                                      modelValue: e.quotationForm.confirmation_date,
                                                                      'onUpdate:modelValue':
                                                                        t[27] ||
                                                                        (t[27] = (o) =>
                                                                          (e.quotationForm.confirmation_date = o)),
                                                                      placeholder: 'Select confirmation date',
                                                                      'first-weekday': 'Monday',
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ['modelValue'],
                                                                  ),
                                                                ]),
                                                                s('div', null, [
                                                                  t[80] ||
                                                                    (t[80] = s(
                                                                      'div',
                                                                      {
                                                                        class:
                                                                          'text-xs font-semibold text-gray-700 uppercase mb-1',
                                                                      },
                                                                      ' Hunting License (Optional) ',
                                                                      -1,
                                                                    )),
                                                                  a(
                                                                    y,
                                                                    {
                                                                      modelValue: e.quotationForm.hunting_license,
                                                                      'onUpdate:modelValue':
                                                                        t[28] ||
                                                                        (t[28] = (o) =>
                                                                          (e.quotationForm.hunting_license = o)),
                                                                      placeholder: 'Enter license number',
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ['modelValue'],
                                                                  ),
                                                                ]),
                                                              ]),
                                                              s('div', lo, [
                                                                t[81] ||
                                                                  (t[81] = s(
                                                                    'div',
                                                                    {
                                                                      class:
                                                                        'text-xs font-semibold text-gray-700 uppercase mb-1',
                                                                    },
                                                                    'Remarks (Optional)',
                                                                    -1,
                                                                  )),
                                                                a(
                                                                  Y,
                                                                  {
                                                                    modelValue: e.quotationForm.remarks,
                                                                    'onUpdate:modelValue':
                                                                      t[29] ||
                                                                      (t[29] = (o) => (e.quotationForm.remarks = o)),
                                                                    placeholder:
                                                                      'Add any additional notes or remarks...',
                                                                    'min-rows': 2,
                                                                  },
                                                                  null,
                                                                  8,
                                                                  ['modelValue'],
                                                                ),
                                                              ]),
                                                              s('div', mo, [
                                                                s('div', uo, [
                                                                  t[83] ||
                                                                    (t[83] = s(
                                                                      'div',
                                                                      {
                                                                        class:
                                                                          'text-xs font-semibold text-gray-700 uppercase',
                                                                      },
                                                                      'Payment Installments',
                                                                      -1,
                                                                    )),
                                                                  a(
                                                                    c,
                                                                    {
                                                                      preset: 'secondary',
                                                                      size: 'small',
                                                                      icon: 'add',
                                                                      onClick: e.addQuotationInstallment,
                                                                    },
                                                                    {
                                                                      default: i(
                                                                        () =>
                                                                          t[82] || (t[82] = [b(' Add Installment ')]),
                                                                      ),
                                                                      _: 1,
                                                                    },
                                                                    8,
                                                                    ['onClick'],
                                                                  ),
                                                                ]),
                                                                e.quotationForm.installments.length === 0
                                                                  ? (u(),
                                                                    V(
                                                                      q,
                                                                      {
                                                                        key: 0,
                                                                        color: 'warning',
                                                                        class: 'mb-3',
                                                                        border: 'left',
                                                                      },
                                                                      {
                                                                        title: i(
                                                                          () => t[84] || (t[84] = [b('Required')]),
                                                                        ),
                                                                        default: i(() => [
                                                                          t[85] ||
                                                                            (t[85] = b(
                                                                              ' At least one payment installment is required to create a quotation. ',
                                                                            )),
                                                                        ]),
                                                                        _: 1,
                                                                      },
                                                                    ))
                                                                  : C('', !0),
                                                                (u(!0),
                                                                v(
                                                                  B,
                                                                  null,
                                                                  Q(
                                                                    e.quotationForm.installments,
                                                                    (o, k) => (
                                                                      u(),
                                                                      v(
                                                                        'div',
                                                                        {
                                                                          key: k,
                                                                          class:
                                                                            'p-4 border rounded-lg mb-3 bg-gray-50',
                                                                        },
                                                                        [
                                                                          s('div', co, [
                                                                            s('span', fo, 'Installment ' + l(k + 1), 1),
                                                                            a(
                                                                              c,
                                                                              {
                                                                                preset: 'plain',
                                                                                color: 'danger',
                                                                                size: 'small',
                                                                                icon: 'delete',
                                                                                onClick: ($) =>
                                                                                  e.removeQuotationInstallment(k),
                                                                              },
                                                                              null,
                                                                              8,
                                                                              ['onClick'],
                                                                            ),
                                                                          ]),
                                                                          s('div', po, [
                                                                            a(
                                                                              y,
                                                                              {
                                                                                modelValue: o.narration,
                                                                                'onUpdate:modelValue': ($) =>
                                                                                  (o.narration = $),
                                                                                placeholder:
                                                                                  'e.g., Deposit Due upon booking',
                                                                                label: 'Description',
                                                                              },
                                                                              null,
                                                                              8,
                                                                              ['modelValue', 'onUpdate:modelValue'],
                                                                            ),
                                                                            a(
                                                                              y,
                                                                              {
                                                                                modelValue: o.amount_due,
                                                                                'onUpdate:modelValue': ($) =>
                                                                                  (o.amount_due = $),
                                                                                label: 'Amount (USD)',
                                                                                type: 'number',
                                                                                placeholder: '5000',
                                                                              },
                                                                              null,
                                                                              8,
                                                                              ['modelValue', 'onUpdate:modelValue'],
                                                                            ),
                                                                            a(
                                                                              A,
                                                                              {
                                                                                modelValue: o.due_days_type,
                                                                                'onUpdate:modelValue': ($) =>
                                                                                  (o.due_days_type = $),
                                                                                options: e.dueDaysTypeOptions,
                                                                                label: 'Due Type',
                                                                                placeholder: 'Select when due',
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                'modelValue',
                                                                                'onUpdate:modelValue',
                                                                                'options',
                                                                              ],
                                                                            ),
                                                                            a(
                                                                              y,
                                                                              {
                                                                                modelValue: o.due_days,
                                                                                'onUpdate:modelValue': ($) =>
                                                                                  (o.due_days = $),
                                                                                label:
                                                                                  o.due_days_type === 'before_arrival'
                                                                                    ? 'Days Before Arrival'
                                                                                    : 'Due Days',
                                                                                type: 'number',
                                                                                placeholder: 'e.g., 90',
                                                                                disabled:
                                                                                  o.due_days_type === 'upon_booking',
                                                                              },
                                                                              null,
                                                                              8,
                                                                              [
                                                                                'modelValue',
                                                                                'onUpdate:modelValue',
                                                                                'label',
                                                                                'disabled',
                                                                              ],
                                                                            ),
                                                                          ]),
                                                                        ],
                                                                      )
                                                                    ),
                                                                  ),
                                                                  128,
                                                                )),
                                                                e.quotationForm.installments.length > 0
                                                                  ? (u(),
                                                                    v('div', go, [
                                                                      s('div', yo, [
                                                                        t[86] ||
                                                                          (t[86] = s(
                                                                            'span',
                                                                            { class: 'text-lg font-semibold' },
                                                                            'TOTAL',
                                                                            -1,
                                                                          )),
                                                                        s(
                                                                          'span',
                                                                          ho,
                                                                          '$' +
                                                                            l(e.quotationTotalAmount.toLocaleString()),
                                                                          1,
                                                                        ),
                                                                      ]),
                                                                    ]))
                                                                  : C('', !0),
                                                              ]),
                                                            ],
                                                            64,
                                                          ))
                                                        : C('', !0),
                                                    ]),
                                                    _: 1,
                                                  }),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                          ]),
                                        ],
                                        512,
                                      ),
                                      [[de, e.currentStep === 2]],
                                    ),
                                    le(
                                      s(
                                        'div',
                                        _o,
                                        [
                                          s('div', bo, [
                                            s('div', vo, [
                                              a(r, { name: 'fact_check', color: 'primary', size: 'large' }),
                                              t[87] ||
                                                (t[87] = s(
                                                  'h3',
                                                  { class: 'text-xl font-bold text-gray-800' },
                                                  'Review Your Enquiry',
                                                  -1,
                                                )),
                                            ]),
                                            a(
                                              q,
                                              { color: 'info', class: 'mb-4', border: 'left' },
                                              {
                                                title: i(() => t[88] || (t[88] = [b('Please Review')])),
                                                default: i(() => [
                                                  t[89] ||
                                                    (t[89] = b(
                                                      ' Review all the information below before submitting your enquiry. ',
                                                    )),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            a(
                                              E,
                                              { outlined: '', class: 'mb-4' },
                                              {
                                                default: i(() => [
                                                  a(
                                                    T,
                                                    { class: 'flex items-center gap-2' },
                                                    {
                                                      default: i(() => [
                                                        a(r, { name: 'person', size: 'small', color: 'primary' }),
                                                        t[90] || (t[90] = b(' Customer Information ')),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  a(L, null, {
                                                    default: i(() => {
                                                      var o, k
                                                      return [
                                                        s('div', ko, [
                                                          s('div', null, [
                                                            t[91] ||
                                                              (t[91] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Full Name:',
                                                                -1,
                                                              )),
                                                            s('span', So, l(e.form.full_name || 'N/A'), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[92] ||
                                                              (t[92] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Country:',
                                                                -1,
                                                              )),
                                                            s(
                                                              'span',
                                                              wo,
                                                              l(
                                                                ((o = e.form.country) == null ? void 0 : o.text) ||
                                                                  'N/A',
                                                              ),
                                                              1,
                                                            ),
                                                          ]),
                                                          s('div', null, [
                                                            t[93] ||
                                                              (t[93] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Nationality:',
                                                                -1,
                                                              )),
                                                            s(
                                                              'span',
                                                              Do,
                                                              l(
                                                                ((k = e.form.nationality) == null ? void 0 : k.text) ||
                                                                  'N/A',
                                                              ),
                                                              1,
                                                            ),
                                                          ]),
                                                          s('div', null, [
                                                            t[94] ||
                                                              (t[94] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Email:',
                                                                -1,
                                                              )),
                                                            s('span', Io, l(e.form.email || 'N/A'), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[95] ||
                                                              (t[95] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Primary Phone:',
                                                                -1,
                                                              )),
                                                            s('span', Vo, l(e.form.phone || 'N/A'), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[96] ||
                                                              (t[96] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Additional Phone:',
                                                                -1,
                                                              )),
                                                            s('span', Co, l(e.form.phone_additional || 'N/A'), 1),
                                                          ]),
                                                          s('div', qo, [
                                                            t[97] ||
                                                              (t[97] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Address:',
                                                                -1,
                                                              )),
                                                            s('span', xo, l(e.form.address || 'N/A'), 1),
                                                          ]),
                                                        ]),
                                                      ]
                                                    }),
                                                    _: 1,
                                                  }),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            a(
                                              E,
                                              { outlined: '', class: 'mb-4' },
                                              {
                                                default: i(() => [
                                                  a(
                                                    T,
                                                    { class: 'flex items-center gap-2' },
                                                    {
                                                      default: i(() => [
                                                        a(r, { name: 'inventory_2', size: 'small', color: 'primary' }),
                                                        t[98] || (t[98] = b(' Season & Package ')),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  a(L, null, {
                                                    default: i(() => {
                                                      var o, k
                                                      return [
                                                        s('div', $o, [
                                                          s('div', null, [
                                                            t[99] ||
                                                              (t[99] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Season:',
                                                                -1,
                                                              )),
                                                            s(
                                                              'span',
                                                              Ao,
                                                              l(
                                                                ((o = e.form.season) == null ? void 0 : o.text) ||
                                                                  'N/A',
                                                              ),
                                                              1,
                                                            ),
                                                          ]),
                                                          s('div', null, [
                                                            t[100] ||
                                                              (t[100] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Package:',
                                                                -1,
                                                              )),
                                                            s(
                                                              'span',
                                                              Po,
                                                              l(
                                                                ((k = e.form.priceListId) == null ? void 0 : k.text) ||
                                                                  'No package selected',
                                                              ),
                                                              1,
                                                            ),
                                                          ]),
                                                        ]),
                                                      ]
                                                    }),
                                                    _: 1,
                                                  }),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            a(
                                              E,
                                              { outlined: '', class: 'mb-4' },
                                              {
                                                default: i(() => [
                                                  a(
                                                    T,
                                                    { class: 'flex items-center gap-2' },
                                                    {
                                                      default: i(() => [
                                                        a(r, { name: 'event', size: 'small', color: 'primary' }),
                                                        t[101] || (t[101] = b(' Schedule & Hunt Party ')),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  a(L, null, {
                                                    default: i(() => {
                                                      var o
                                                      return [
                                                        s('div', Eo, [
                                                          s('div', null, [
                                                            t[102] ||
                                                              (t[102] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Preferred Date:',
                                                                -1,
                                                              )),
                                                            s(
                                                              'span',
                                                              No,
                                                              l(e.formatReviewDate(e.form.preferred_date)),
                                                              1,
                                                            ),
                                                          ]),
                                                          s('div', null, [
                                                            t[103] ||
                                                              (t[103] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Start Date:',
                                                                -1,
                                                              )),
                                                            s('span', Lo, l(e.formatReviewDate(e.form.start_date)), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[104] ||
                                                              (t[104] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'End Date:',
                                                                -1,
                                                              )),
                                                            s('span', Fo, l(e.formatReviewDate(e.form.end_date)), 1),
                                                          ]),
                                                        ]),
                                                        a(I, { class: 'my-3' }),
                                                        s('div', Oo, [
                                                          s('div', null, [
                                                            t[105] ||
                                                              (t[105] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Hunting Area:',
                                                                -1,
                                                              )),
                                                            s(
                                                              'span',
                                                              Uo,
                                                              l(((o = e.form.area) == null ? void 0 : o.text) || 'N/A'),
                                                              1,
                                                            ),
                                                          ]),
                                                          s('div', null, [
                                                            t[106] ||
                                                              (t[106] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Days:',
                                                                -1,
                                                              )),
                                                            s('span', zo, l(e.form.no_of_days || 'N/A'), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[107] ||
                                                              (t[107] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Hunters:',
                                                                -1,
                                                              )),
                                                            s('span', To, l(e.form.no_of_hunters || 1), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[108] ||
                                                              (t[108] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Observers:',
                                                                -1,
                                                              )),
                                                            s('span', jo, l(e.form.no_of_observers || 0), 1),
                                                          ]),
                                                          s('div', null, [
                                                            t[109] ||
                                                              (t[109] = s(
                                                                'span',
                                                                { class: 'text-gray-600' },
                                                                'Companions:',
                                                                -1,
                                                              )),
                                                            s('span', Bo, l(e.form.no_of_companions || 0), 1),
                                                          ]),
                                                        ]),
                                                      ]
                                                    }),
                                                    _: 1,
                                                  }),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            a(
                                              E,
                                              { outlined: '', class: 'mb-4' },
                                              {
                                                default: i(() => [
                                                  a(
                                                    T,
                                                    { class: 'flex items-center gap-2' },
                                                    {
                                                      default: i(() => [
                                                        a(r, { name: 'pets', size: 'small', color: 'primary' }),
                                                        b(' Selected Species (' + l(e.speciesObjects.length) + ') ', 1),
                                                      ]),
                                                      _: 1,
                                                    },
                                                  ),
                                                  a(L, null, {
                                                    default: i(() => [
                                                      e.speciesObjects.length > 0
                                                        ? (u(),
                                                          v('div', Mo, [
                                                            (u(!0),
                                                            v(
                                                              B,
                                                              null,
                                                              Q(
                                                                e.speciesObjects,
                                                                (o, k) => (
                                                                  u(),
                                                                  V(
                                                                    g,
                                                                    {
                                                                      key: k,
                                                                      text: `${o.name} (x${o.quantity})`,
                                                                      color: o.fromPackage ? 'info' : 'primary',
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ['text', 'color'],
                                                                  )
                                                                ),
                                                              ),
                                                              128,
                                                            )),
                                                          ]))
                                                        : (u(), v('span', Ro, 'No species selected')),
                                                    ]),
                                                    _: 1,
                                                  }),
                                                ]),
                                                _: 1,
                                              },
                                            ),
                                            e.selectedSafariExtras.length > 0
                                              ? (u(),
                                                V(
                                                  E,
                                                  { key: 0, outlined: '', class: 'mb-4' },
                                                  {
                                                    default: i(() => [
                                                      a(
                                                        T,
                                                        { class: 'flex items-center gap-2' },
                                                        {
                                                          default: i(() => [
                                                            a(r, { name: 'hiking', size: 'small', color: 'primary' }),
                                                            b(
                                                              ' Safari Extras (' +
                                                                l(e.selectedSafariExtras.length) +
                                                                ') ',
                                                              1,
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ),
                                                      a(L, null, {
                                                        default: i(() => [
                                                          s('div', Ho, [
                                                            (u(!0),
                                                            v(
                                                              B,
                                                              null,
                                                              Q(e.selectedSafariExtras, (o) => {
                                                                var k
                                                                return (
                                                                  u(),
                                                                  V(
                                                                    g,
                                                                    {
                                                                      key: o.id,
                                                                      text: `${o.name} - ${
                                                                        ((k = o.currency) == null
                                                                          ? void 0
                                                                          : k.symbol) || '$'
                                                                      }${o.amount}`,
                                                                      color: 'success',
                                                                    },
                                                                    null,
                                                                    8,
                                                                    ['text'],
                                                                  )
                                                                )
                                                              }),
                                                              128,
                                                            )),
                                                          ]),
                                                        ]),
                                                        _: 1,
                                                      }),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : C('', !0),
                                            ((re =
                                              (ie = (ne = e.form.priceListId) == null ? void 0 : ne.selfItem) == null
                                                ? void 0
                                                : ie.trophy_fees) == null
                                              ? void 0
                                              : re.length) > 0
                                              ? (u(),
                                                V(
                                                  E,
                                                  { key: 1, outlined: '', class: 'mb-4' },
                                                  {
                                                    default: i(() => [
                                                      a(
                                                        T,
                                                        { class: 'flex items-center gap-2' },
                                                        {
                                                          default: i(() => [
                                                            a(r, {
                                                              name: 'emoji_events',
                                                              size: 'small',
                                                              color: 'primary',
                                                            }),
                                                            b(
                                                              ' Trophy Fees (' +
                                                                l(e.form.priceListId.selfItem.trophy_fees.length) +
                                                                ') ',
                                                              1,
                                                            ),
                                                          ]),
                                                          _: 1,
                                                        },
                                                      ),
                                                      a(L, null, {
                                                        default: i(() => [
                                                          s('div', Qo, [
                                                            s('table', Yo, [
                                                              t[110] ||
                                                                (t[110] = s(
                                                                  'thead',
                                                                  null,
                                                                  [
                                                                    s('tr', null, [
                                                                      s('th', { class: 'text-left' }, 'Species'),
                                                                      s('th', { class: 'text-center' }, 'Sequence'),
                                                                      s('th', { class: 'text-right' }, 'Price'),
                                                                    ]),
                                                                  ],
                                                                  -1,
                                                                )),
                                                              s('tbody', null, [
                                                                (u(!0),
                                                                v(
                                                                  B,
                                                                  null,
                                                                  Q(e.form.priceListId.selfItem.trophy_fees, (o, k) => {
                                                                    var $, M, W, K
                                                                    return (
                                                                      u(),
                                                                      v('tr', { key: `trophy-review-${o.id}-${k}` }, [
                                                                        s(
                                                                          'td',
                                                                          Go,
                                                                          l(
                                                                            (($ = o.species) == null
                                                                              ? void 0
                                                                              : $.name) || 'Unknown',
                                                                          ),
                                                                          1,
                                                                        ),
                                                                        s('td', Wo, [
                                                                          a(
                                                                            g,
                                                                            {
                                                                              text: e.getSequenceLabel(
                                                                                o.sequence_order,
                                                                              ),
                                                                              color: 'primary',
                                                                              size: 'small',
                                                                            },
                                                                            null,
                                                                            8,
                                                                            ['text'],
                                                                          ),
                                                                        ]),
                                                                        s(
                                                                          'td',
                                                                          Jo,
                                                                          l(
                                                                            ((K =
                                                                              (W =
                                                                                (M = e.form.priceListId.selfItem) ==
                                                                                null
                                                                                  ? void 0
                                                                                  : M.price_list_type) == null
                                                                                ? void 0
                                                                                : W.currency) == null
                                                                              ? void 0
                                                                              : K.symbol) || '$',
                                                                          ) + l(o.amount),
                                                                          1,
                                                                        ),
                                                                      ])
                                                                    )
                                                                  }),
                                                                  128,
                                                                )),
                                                              ]),
                                                            ]),
                                                          ]),
                                                        ]),
                                                        _: 1,
                                                      }),
                                                    ]),
                                                    _: 1,
                                                  },
                                                ))
                                              : C('', !0),
                                          ]),
                                        ],
                                        512,
                                      ),
                                      [[de, e.currentStep === 3]],
                                    ),
                                  ]
                                }),
                                _: 1,
                              },
                              512,
                            ),
                            s('div', Ko, [
                              s('div', Xo, [
                                s('div', null, [
                                  e.currentStep > 0
                                    ? (u(),
                                      V(
                                        c,
                                        { key: 0, preset: 'secondary', icon: 'arrow_back', onClick: e.previousStep },
                                        { default: i(() => t[111] || (t[111] = [b(' Previous ')])), _: 1 },
                                        8,
                                        ['onClick'],
                                      ))
                                    : C('', !0),
                                ]),
                                s('div', Zo, [
                                  s('span', en, ' Step ' + l(e.currentStep + 1) + ' of ' + l(e.wizardSteps.length), 1),
                                ]),
                                s('div', tn, [
                                  a(
                                    c,
                                    { preset: 'secondary', onClick: e.handleGoBack },
                                    { default: i(() => t[112] || (t[112] = [b(' Cancel ')])), _: 1 },
                                    8,
                                    ['onClick'],
                                  ),
                                  e.currentStep < e.wizardSteps.length - 1
                                    ? (u(),
                                      V(
                                        c,
                                        {
                                          key: 0,
                                          color: 'primary',
                                          'icon-right': 'arrow_forward',
                                          disabled: !e.canProceedToNextStep,
                                          'aria-disabled': !e.canProceedToNextStep,
                                          class: Oe({ 'opacity-60 pointer-events-none': !e.canProceedToNextStep }),
                                          onClick: e.nextStep,
                                        },
                                        { default: i(() => t[113] || (t[113] = [b(' Next ')])), _: 1 },
                                        8,
                                        ['disabled', 'aria-disabled', 'class', 'onClick'],
                                      ))
                                    : (u(),
                                      V(
                                        c,
                                        {
                                          key: 1,
                                          loading: e.saving,
                                          icon: 'save',
                                          color: 'success',
                                          disabled: !e.isValidForm,
                                          onClick: t[30] || (t[30] = (P) => e.validateForm() && e.submit()),
                                        },
                                        {
                                          default: i(() => [
                                            b(l(e.isEditMode ? 'Update Enquiry' : 'Submit Enquiry'), 1),
                                          ]),
                                          _: 1,
                                        },
                                        8,
                                        ['loading', 'disabled'],
                                      )),
                                ]),
                              ]),
                            ]),
                          ]))
                        : (u(),
                          V(
                            h,
                            {
                              key: 0,
                              onDownloadBtnPressed: t[2] || (t[2] = (P) => e.downloadPdf(P.selfitem.pdf)),
                              onViewBtnPressed: e.viewInquiries,
                              onEditBtnPressed: e.editInquiry,
                            },
                            null,
                            8,
                            ['onViewBtnPressed', 'onEditBtnPressed'],
                          )),
                    ],
                    64,
                  )),
            ]),
            _: 1,
          }),
        ]),
        _: 1,
      },
    )
  )
}
const gn = ge(ps, [
  ['render', sn],
  ['__scopeId', 'data-v-73ad24c5'],
])
export { gn as default }
//# sourceMappingURL=SalesInquiries-CurhFx5A.js.map
