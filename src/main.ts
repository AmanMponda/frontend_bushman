import './scss/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n'
import { createVuestic } from 'vuestic-ui'
import { createGtm } from '@gtm-support/vue-gtm'
// import axios from 'axios'
import stores from './stores'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import './services/interceptors/token_interceptors'
import '@vuestic/ag-grid-theme'
// import '@vuestic/ag-grid-theme/scss'

const app = createApp(App)

app.use(stores)
app.use(router)
app.use(i18n)
// Make BootstrapVue available throughout your project

app.use(createVuestic({ config: vuesticGlobalConfig }))
// App.config.globalProperties.$axios = axios

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
