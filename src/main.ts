// #region agent log
fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.ts:1',
    message: 'Module load start - before any imports',
    data: { timestamp: performance.now() },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    hypothesisId: 'A',
  }),
}).catch(() => {})
// #endregion
import { createApp, computed as vueComputed } from 'vue'
// #region agent log
fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'main.ts:4',
    message: 'Vue imported - checking computed',
    data: { computedType: typeof vueComputed, computedExists: !!vueComputed },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    hypothesisId: 'A',
  }),
}).catch(() => {})
// #endregion
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar'
import mitt from 'mitt'
import 'vue3-perfect-scrollbar/style.css'
import '@marcoschulte/vue3-progress/dist/index.css'
import '@fortawesome/fontawesome-free/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free/scss/regular.scss'
import '@fortawesome/fontawesome-free/scss/solid.scss'
import '@fortawesome/fontawesome-free/scss/brands.scss'
import '@fortawesome/fontawesome-free/scss/v4-shims.scss'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Vue Studio SCSS (must come before main.scss)
import './scss/styles.scss'

// Existing styles (Vuestic, Tailwind, etc.)
import './scss/main.scss'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { createGtm } from '@gtm-support/vue-gtm'
import stores from './stores'
import './services/interceptors/token_interceptors'

// Bootstrap Components
import Card from '@/components/bootstrap/Card.vue'
import CardBody from '@/components/bootstrap/CardBody.vue'
import CardHeader from '@/components/bootstrap/CardHeader.vue'
import CardFooter from '@/components/bootstrap/CardFooter.vue'
import CardGroup from '@/components/bootstrap/CardGroup.vue'
import CardImgOverlay from '@/components/bootstrap/CardImgOverlay.vue'
import CardExpandToggler from '@/components/bootstrap/CardExpandToggler.vue'
import BootstrapInput from '@/components/bootstrap/Input.vue'
import BootstrapSelect from '@/components/bootstrap/Select.vue'
import BootstrapForm from '@/components/bootstrap/Form.vue'
import BootstrapButton from '@/components/bootstrap/Button.vue'
import BootstrapBadge from '@/components/bootstrap/Badge.vue'
import BootstrapChip from '@/components/bootstrap/Chip.vue'
import BootstrapModal from '@/components/bootstrap/Modal.vue'
import BootstrapCheckbox from '@/components/bootstrap/Checkbox.vue'
import BootstrapValue from '@/components/bootstrap/Value.vue'
import BootstrapInnerLoading from '@/components/bootstrap/InnerLoading.vue'
import ToastContainer from '@/components/bootstrap/ToastContainer.vue'

const emitter = mitt()
const app = createApp(App)

// Register Bootstrap components globally
app.component('Card', Card)
app.component('CardBody', CardBody)
app.component('CardHeader', CardHeader)
app.component('CardFooter', CardFooter)
app.component('CardGroup', CardGroup)
app.component('CardImgOverlay', CardImgOverlay)
app.component('CardExpandToggler', CardExpandToggler)
app.component('BootstrapInput', BootstrapInput)
app.component('BootstrapSelect', BootstrapSelect)
app.component('BootstrapForm', BootstrapForm)
app.component('BootstrapButton', BootstrapButton)
app.component('BootstrapBadge', BootstrapBadge)
app.component('BootstrapChip', BootstrapChip)
app.component('BootstrapModal', BootstrapModal)
app.component('BootstrapCheckbox', BootstrapCheckbox)
app.component('BootstrapValue', BootstrapValue)
app.component('BootstrapInnerLoading', BootstrapInnerLoading)
app.component('ToastContainer', ToastContainer)

// Use Pinia (stores is already a Pinia instance from stores/index.ts)
app.use(stores)
app.use(router)
app.use(i18n)
app.use(Vue3ProgressPlugin)
app.use(PerfectScrollbarPlugin)

// Also register with Va prefix for easier migration (only if not already registered by Vuestic)
const registerIfNotExists = (name: string, component: any) => {
  if (!app._context.components[name]) {
    app.component(name, component)
  }
}

registerIfNotExists('VaInput', BootstrapInput)
registerIfNotExists('VaSelect', BootstrapSelect)
registerIfNotExists('VaForm', BootstrapForm)
registerIfNotExists('VaButton', BootstrapButton)
registerIfNotExists('VaBadge', BootstrapBadge)
registerIfNotExists('VaChip', BootstrapChip)
registerIfNotExists('VaModal', BootstrapModal)
registerIfNotExists('VaCheckbox', BootstrapCheckbox)
registerIfNotExists('VaValue', BootstrapValue)
registerIfNotExists('VaInnerLoading', BootstrapInnerLoading)

// Set up emitter for Vue Studio components
app.config.globalProperties.emitter = emitter

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
