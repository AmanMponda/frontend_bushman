import { defineStore } from 'pinia'

export const useAppSidebarMenuStore = defineStore('appSidebarMenu', () => {
  return [
    {
      url: '/auth/service-selection',
      icon: 'fa fa-home',
      text: 'Dashboard',
    },
    {
      text: 'Navigation',
      is_header: true,
    },
    {
      url: '/dashboard',
      icon: 'fa fa-laptop',
      text: 'Bushman',
    },
    {
      url: '/sales',
      icon: 'fa fa-shopping-cart',
      text: 'Sales',
      children: [
        { url: '/sales/quotas', icon: 'fa fa-percentage', text: 'Sales Quotas' },
        { url: '/sales/sales-calendar', icon: 'fa fa-calendar', text: 'Sales Calendar' },
        { url: '/sales/sales-pipeline', icon: 'fa fa-stream', text: 'Sales Pipeline' },
        {
          text: 'Sales',
          children: [
            { url: '/sales/price-list', icon: 'fa fa-list', text: 'Price Lists' },
            { url: '/sales/sales-inquiry', icon: 'fa fa-question-circle', text: 'Sales Quotations' },
            { url: '/sales/sales-confirmation', icon: 'fa fa-check-circle', text: 'Sales Confirmations' },
            { url: '/sales/sales-contracts', icon: 'fa fa-file-contract', text: 'Sales Contracts' },
          ],
        },
      ],
    },
    {
      url: '/operations',
      icon: 'fa fa-tasks',
      text: 'Operations',
      children: [
        { url: '/operations/hunting-license', text: 'Hunting License' },
        { url: '/operations/game', text: 'Game' },
        { url: '/operations/game-requitions', text: 'Game Requisitions' },
      ],
    },
    {
      url: '/accounts',
      icon: 'fa fa-dollar-sign',
      text: 'Accounts',
      children: [{ url: '/accounts/dashboard', text: 'Accounts Dashboard' }],
    },
    {
      url: '/procurement',
      icon: 'fa fa-shopping-bag',
      text: 'Procurement',
      children: [{ url: '/procurement/dashboard', text: 'Procurement Dashboard' }],
    },
    {
      url: '/hr',
      icon: 'fa fa-users',
      text: 'HR',
      children: [{ url: '/hr/dashboard', text: 'HR Dashboard' }],
    },
    {
      url: '/reports',
      icon: 'fa fa-chart-bar',
      text: 'Reports',
    },
    {
      is_divider: true,
    },
    {
      text: 'Settings',
      is_header: true,
    },
    {
      url: '/module-settings',
      icon: 'fa fa-cog',
      text: 'Module Settings',
      children: [
        { url: '/module-settings/area-settings', text: 'Area Settings' },
        { url: '/module-settings/hunting-types', text: 'Hunting Types' },
        { url: '/module-settings/species-settings', text: 'Species Settings' },
        { url: '/module-settings/qoutas-settings', text: 'Quotas Settings' },
        { url: '/module-settings/regulatory-package', text: 'Regulatory Package' },
        { url: '/module-settings/sales-package', text: 'Sales Package' },
        { url: '/module-settings/sales-extra-services', text: 'Sales Extra Services' },
        { url: '/module-settings/trophy-fees', text: 'Trophy Fees' },
        { url: '/module-settings/companion-hunter-costs', text: 'Companion Hunter Costs' },
        { url: '/module-settings/terms', text: 'Terms' },
        { url: '/module-settings/safari-fee-deposits', text: 'Safari Fee Deposits' },
        { url: '/module-settings/approval-chain', text: 'Approval Chain' },
      ],
    },
    {
      url: '/settings',
      icon: 'fa fa-wrench',
      text: 'Settings',
    },
    {
      url: '/preferences',
      icon: 'fa fa-sliders-h',
      text: 'Preferences',
    },
  ]
})
