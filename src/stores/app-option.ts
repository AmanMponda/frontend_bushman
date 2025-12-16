import { defineStore } from 'pinia'

export const useAppOptionStore = defineStore('appOption', {
  state: () => ({
    appMode: '',
    appThemeClass: '',
    appCoverClass: '',
    appBoxedLayout: false,
    appHeaderHide: false,
    appHeaderSearchToggled: false,
    appSidebarCollapsed: false,
    appSidebarMinified: false,
    appSidebarMobileToggled: false,
    appSidebarMobileClosed: false,
    appSidebarHide: false,
    appContentFullHeight: false,
    appContentClass: '',
    appTopNav: false,
    appFooter: false,
    appFooterFixed: false,
    appThemePanelToggled: false,
    appVh100: false,
    appDarkMode: false,
  }),
})
