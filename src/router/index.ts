import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import SimpleAuthLayout from '../layouts/SimpleAuthLayout.vue'
import RouteViewComponent from '../layouts/RouterBypass.vue'

const routes: Array<RouteRecordRaw> = [
  {
<<<<<<< HEAD
=======
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' },
  },
  {
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
    name: 'admin',
    path: '/',
    component: RouteViewComponent,
    redirect: { name: 'login' },
    children: [
      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/client/dashboard/Dashboard.vue'),
      },
      {
        name: 'sales',
        path: 'sales',
        // component: () => import('../pages/client/dashboard/Dashboard.vue'),
        component: RouteViewComponent,
        children: [
          {
            name: 'price-list',
            path: 'price-list',
            component: () => import('../pages/module-settings/ManagePriceList.vue'),
          },
          {
            name: 'sales-inquiry',
            path: 'sales-inquiry',
            component: () => import('../pages/client/dashboard/SalesInquiries.vue'),
          },
          {
            name: 'sales-pipeline',
            path: 'sales-pipeline',
            component: () => import('../pages/client/dashboard/SalesPipeline.vue'),
          },
          {
            name: 'pipeline-item-view',
            path: 'pipeline/view/:id',
            component: () => import('../pages/client/dashboard/PipelineItemView.vue'),
          },
          {
            name: 'quotas',
            path: 'quotas',
            component: () => import('../pages/client/dashboard/QuotaPage.vue'),
          },
          {
            name: 'client-docs',
            path: 'client-docs',
            component: () => import('../pages/client/dashboard/ClientDocs.vue'),
          },
          // SalesCalendar
          {
            name: 'sales-calendar',
            path: 'sales-calendar',
            component: () => import('../pages/client/dashboard/SalesCalendar.vue'),
          },

          // SalesConfirmation (Proposals)
          {
            name: 'sales-confirmation',
            path: 'sales-confirmation',
            component: () => import('../pages/client/dashboard/SalesConfirmationProposals.vue'),
          },

          // Contracts
          {
            name: 'sales-contracts',
            path: 'sales-contracts',
            component: () => import('../pages/client/dashboard/Contracts.vue'),
          },

          // SalesContractPermit
          {
            name: 'hunting-license',
            path: 'hunting-license',
            component: () => import('../pages/client/dashboard/SalesContractPermit.vue'),
          },

          // Game
        ],
      },

      {
        // Game
        name: 'operations',
        path: 'operations',
        component: RouteViewComponent,
        children: [
          {
            name: 'game',
            path: 'game',
            component: () => import('../pages/client/GameDashboard/Game.vue'),
          },
          // requitions
          {
            name: 'game-requitions',
            path: 'game-requitions',
            component: () => import('../pages/client/GameDashboard/Requitions.vue'),
          },
          // requisition-details
        ],
      },
      {
        name: 'settings',
        path: 'settings',
        component: () => import('../pages/settings/Settings.vue'),
      },
      {
        name: 'preferences',
        path: 'preferences',
        component: () => import('../pages/preferences/Preferences.vue'),
      },

      {
        name: 'payments',
        path: 'payments',
        component: RouteViewComponent,
        children: [
          {
            name: 'payment-methods',
            path: 'payment-methods',
            component: () => import('../pages/payments/PaymentsPage.vue'),
          },
          {
            name: 'billing',
            path: 'billing',
            component: () => import('../pages/billing/BillingPage.vue'),
          },
          {
            name: 'pricing-plans',
            path: 'pricing-plans',
            component: () => import('../pages/pricing-plans/PricingPlans.vue'),
          },
        ],
      },
      {
        name: 'faq',
        path: 'faq',
        component: () => import('../pages/faq/FaqPage.vue'),
      },

      {
        name: 'module-settings',
        path: 'module-settings',
        component: RouteViewComponent,
        children: [
          {
            name: 'qoutas-settings',
            path: 'qoutas-settings',
            component: () => import('../pages/module-settings/ManageQuota.vue'),
          },
          // manageRegulatoryPackage
          {
            name: 'regulatory-package',
            path: 'regulatory-package',
            component: () => import('../pages/module-settings/ManageRegulatoryPackage.vue'),
          },
          // manageRegulatoryPackage

          // ManageArea

          {
            name: 'area-settings',
            path: 'area-settings',
            component: () => import('../pages/module-settings/ManageArea.vue'),
          },

          {
            name: 'hunting-types',
            path: 'hunting-types',
            component: () => import('../pages/module-settings/ManageHuntingTypes.vue'),
          },

          {
            name: 'species-settings',
            path: 'species-settings',
            component: () => import('../pages/module-settings/ManageSpecies.vue'),
          },

          {
            name: 'sales-package',
            path: 'sales-package',
            component: () => import('../pages/module-settings/ManageSalesPackage.vue'),
          },
          {
            name: 'sales-extra-services',
            path: 'sales-extra-services',
            component: () => import('../pages/module-settings/ManageExtras.vue'),
          },

          // Trophy Fees
          {
            name: 'trophy-fees',
            path: 'trophy-fees',
            component: () => import('../pages/module-settings/ManageTrophyFees.vue'),
          },

          // Companion Hunter Costs
          {
            name: 'companion-hunter-costs',
            path: 'companion-hunter-costs',
            component: () => import('../pages/module-settings/ManageCompanionHunterCosts.vue'),
          },

          // Terms
          {
            name: 'terms',
            path: 'terms',
            component: () => import('../pages/module-settings/ManageTerms.vue'),
          },

          // Safari Fee Deposits
          {
            name: 'safari-fee-deposits',
            path: 'safari-fee-deposits',
            component: () => import('../pages/module-settings/ManageSafariFeeDeposits.vue'),
          },

          // PriceList (moved to sales section, keeping this for backward compatibility)
          // Note: The price-list route is now under sales section
          // {
          //   name: 'price-list',
          //   path: 'price-list',
          //   component: () => import('../pages/module-settings/ManagePriceList.vue'),
          // },
          // MangeApprovalChain
          {
            name: 'approval-chain',
            path: 'approval-chain',
            component: () => import('../pages/module-settings/MangeApprovalChain.vue'),
          },
        ],
      },

      // 26 july 2025
      {
        name: 'testing',
        path: 'testing',
        component: RouteViewComponent,
        children: [
          {
            name: 'test-price-list',
            path: 'test-price-list',
            component: () => import('../views/Testing/PriceList.vue'),
          },
        ],
      },
    ],
  },

  {
    path: '/auth',
    component: SimpleAuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/RecoverPassword.vue'),
      },
      {
        name: 'recover-password-email',
        path: 'recover-password-email',
        component: () => import('../pages/auth/CheckTheEmail.vue'),
      },
      {
<<<<<<< HEAD
        name: 'service-selection',
        path: 'service-selection',
        component: () => import('../pages/auth/ServiceSelection.vue'),
      },
      {
=======
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    name: '404',
    path: '/404',
    component: () => import('../pages/404.vue'),
  },
<<<<<<< HEAD
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    beforeEnter: (to, from, next) => {
      // Check if user is authenticated
      const token = sessionStorage.getItem('access')
      if (token) {
        next({ name: 'dashboard' })
      } else {
        next({ name: 'login' })
      }
    },
  },
=======
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      window.scrollTo(0, 0)
    }
  },
  routes,
})

// Route guard to check authentication
router.beforeEach((to, from, next) => {
  // Check if user is logged in by checking if access token exists
  const token = sessionStorage.getItem('access')

<<<<<<< HEAD
  // Handle root path - redirect to login if not authenticated, dashboard if authenticated
  if (to.path === '/' || to.name === 'admin') {
    if (token) {
      next({ name: 'dashboard' })
    } else {
      next({ name: 'login' })
    }
    return
  }

  // Auth routes that don't require login
  const publicRoutes = ['login', 'signup', 'recover-password', 'recover-password-email', '404']

  // Service selection requires authentication but is part of auth flow
  if (to.name === 'service-selection') {
    if (token) {
      next()
    } else {
      next({ name: 'login' })
    }
    return
  }

  // Auth routes that don't require login
  if (publicRoutes.includes(to.name as string)) {
    // If trying to access auth page while already logged in, redirect to service selection
    if (token) {
      next({ name: 'service-selection' })
=======
  // Auth routes that don't require login
  const publicRoutes = ['login', 'signup', 'recover-password', 'recover-password-email', '404']

  // Auth routes that don't require login
  if (publicRoutes.includes(to.name as string)) {
    // If trying to access auth page while already logged in, redirect to dashboard
    if (token) {
      next({ name: 'dashboard' })
>>>>>>> 0a80d4f1b43396428b46b32448b1dd0100164c72
    } else {
      next()
    }
  } else {
    // Protected routes - require authentication
    if (token) {
      next()
    } else {
      // Redirect to login if not authenticated
      next({ name: 'login' })
    }
  }
})

export default router
