// #region agent log
fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'global-config.ts:1',
    message: 'global-config module loading',
    data: { timestamp: performance.now() },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    hypothesisId: 'D',
  }),
}).catch(() => {})
// #endregion
import iconsConfig from './icons-config/icons-config'
import colors from './themes'
// #region agent log
fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'global-config.ts:6',
    message: 'Before defineVuesticConfig import',
    data: {},
    timestamp: Date.now(),
    sessionId: 'debug-session',
    hypothesisId: 'D',
  }),
}).catch(() => {})
// #endregion
import { defineVuesticConfig } from 'vuestic-ui'
// #region agent log
fetch('http://127.0.0.1:7242/ingest/ab14651b-7c7c-4500-8f4c-553f5bb1f67b', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    location: 'global-config.ts:10',
    message: 'After defineVuesticConfig import',
    data: { defineVuesticConfigType: typeof defineVuesticConfig },
    timestamp: Date.now(),
    sessionId: 'debug-session',
    hypothesisId: 'D',
  }),
}).catch(() => {})
// #endregion

export default defineVuesticConfig({
  colors,
  icons: iconsConfig,
  breakpoint: {
    enabled: true,
    bodyClass: true,
    thresholds: {
      xs: 0,
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1440,
    },
  },
  components: {
    VaIcon: {
      sizesConfig: {
        defaultSize: 19,
        sizes: {
          small: 14,
          medium: 19,
          large: 26,
        },
      },
    },
    VaSelect: {
      searchable: true,
      bordered: false,
    },
    VaButton: {
      color: 'primary',
      colors: {
        default: 'primary',
        success: 'success',
        danger: 'error',
        warning: 'warning',
        info: 'info',
      },
    },

    VaModal: {
      mobileFullscreen: false,
      maxHeight: 'calc(100% - 2rem)',
      hideDefaultActions: true,
      closeButton: true,
    },
    VaPagination: {
      activeButtonProps: {
        preset: 'primary',
      },
    },
    VaDataTable: {
      disableClientSideSorting: false,
      striped: true,
      hoverable: true,
      // selectable: true,
      searchable: true,
      showSelectAll: true,
    },

    VaCard: {
      stripe: true,
      stripeColor: '#5C4033',
    },

    presets: {
      VaSelect: {
        small: {
          class: 'va-select--small',
          keepAnchorWidth: false,
          placement: 'bottom-end',
          width: 'min(100%, 150px)',
          style:
            '--va-input-wrapper-min-height: 24px; --va-input-wrapper-border-radius: 2px; --va-input-wrapper-width: 100px;',
        },
      },
    },
  },
})
