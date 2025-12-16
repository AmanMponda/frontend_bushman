export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'dashboard',
      },
    },
    {
      name: 'sales',
      displayName: 'menu.sales',
      meta: {
        icon: 'real_estate_agent',
      },
      children: [
        {
          name: 'quotas',
          meta: {
            icon: 'star_half',
          },

          displayName: 'menu.sales-quotas',
        },
        {
          name: 'sales-calendar',
          meta: {
            icon: 'calendar_month',
          },

          displayName: 'menu.sales-calendar',
        },
        {
          name: 'sales-pipeline',
          meta: {
            icon: 'view_kanban',
          },
          displayName: 'menu.sales-pipeline',
        },
        {
          name: 'sales-documents',
          displayName: 'menu.sales-documents',
          meta: {
            icon: 'description',
          },
          children: [
            {
              name: 'price-list',
              meta: {
                icon: 'sell',
              },
              displayName: 'menu.price-list',
            },
            {
              name: 'sales-inquiry',
              meta: {
                icon: 'live_help',
              },
              displayName: 'menu.sales-quotations',
            },
            {
              name: 'sales-confirmation',
              meta: {
                icon: 'check_circle',
              },
              displayName: 'menu.sales-confirmations',
            },
            {
              name: 'sales-contracts',
              meta: {
                icon: 'verified',
              },
              displayName: 'menu.sales-contracts',
            },
          ],
        },
      ],
    },
    {
      name: 'operations',
      displayName: 'menu.operations',
      meta: {
        icon: 'group_work',
      },
      children: [
        {
          name: 'hunting-license',
          meta: {
            icon: 'workspace_premium',
          },

          displayName: 'menu.hunting-license',
        },

        {
          name: 'game',
          meta: {
            icon: 'pets',
          },

          displayName: 'menu.game-killed',
        },

        // game-requitions
        {
          name: 'game-requitions',
          meta: {
            icon: 'outgoing_mail',
          },
          displayName: 'menu.game-requitions',
        },
      ],
    },

    {
      name: 'accounts',
      displayName: 'menu.accounts',
      meta: {
        icon: 'monetization_on',
      },
      children: [
        // {
        //   name: 'hunting-license',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.hunting-license',
        // },
        // {
        //   name: 'game',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.game-killed',
        // },
      ],
    },

    {
      name: 'procurements',
      displayName: 'menu.procurements',
      meta: {
        icon: 'storefront',
      },
      children: [
        // {
        //   name: 'hunting-license',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.hunting-license',
        // },
        // {
        //   name: 'game',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.game-killed',
        // },
      ],
    },

    {
      name: 'hr',
      displayName: 'menu.hr',
      meta: {
        icon: 'supervisor_account',
      },
      children: [
        // {
        //   name: 'hunting-license',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.hunting-license',
        // },
        // {
        //   name: 'game',
        //   meta: {
        //     icon: 'list_alt',
        //   },
        //   displayName: 'menu.game-killed',
        // },
      ],
    },

    {
      name: 'module-settings',
      displayName: 'menu.module-settings',
      meta: {
        icon: 'settings',
      },
      children: [
        {
          name: 'area-settings',
          meta: {
            icon: 'area_chart',
          },

          displayName: 'menu.settings-area',
        },
        {
          name: 'hunting-types',
          meta: {
            icon: 'area_chart',
          },

          displayName: 'menu.hunting-types',
        },

        {
          name: 'species-settings',
          meta: {
            icon: 'cruelty_free',
          },

          displayName: 'menu.settings-species',
        },
        {
          name: 'qoutas-settings',
          meta: {
            icon: 'star_half',
          },

          displayName: 'menu.settings-qoutas',
        },
        // regulatory-package
        {
          name: 'regulatory-package',
          meta: {
            icon: 'local_police',
          },

          displayName: 'menu.regulatory-package',
        },

        // sales-package
        {
          name: 'sales-package',
          meta: {
            icon: 'inventory_2',
          },

          displayName: 'menu.sales-package',
        },

        {
          // sales-extra-services
          name: 'sales-extra-services',
          meta: {
            icon: 'browse_gallery',
          },
          displayName: 'menu.sales-extra-services',
        },

        // trophy-fees
        {
          name: 'trophy-fees',
          meta: {
            icon: 'military_tech',
          },
          displayName: 'menu.trophy-fees',
        },

        // companion-hunter-costs
        {
          name: 'companion-hunter-costs',
          meta: {
            icon: 'group_add',
          },
          displayName: 'menu.companion-hunter-costs',
        },

        // terms
        {
          name: 'terms',
          meta: {
            icon: 'description',
          },
          displayName: 'menu.terms',
        },

        // safari-fee-deposits
        {
          name: 'safari-fee-deposits',
          meta: {
            icon: 'payments',
          },
          displayName: 'menu.safari-fee-deposits',
        },

        // approval - chain,
        {
          name: 'approval-chain',
          meta: {
            icon: 'published_with_changes',
          },
          displayName: 'menu.approval-chain',
        },
      ],
    },
    // {
    //   name: 'users',
    //   displayName: 'menu.users',
    //   meta: {
    //     icon: 'group',
    //   },
    // },
    // {
    //   name: 'projects',
    //   displayName: 'menu.projects',
    //   meta: {
    //     icon: 'folder_shared',
    //   },
    // },
    // {
    //   name: 'payments',
    //   displayName: 'menu.payments',
    //   meta: {
    //     icon: 'credit_card',
    //   },
    //   children: [
    //     {
    //       name: 'payment-methods',
    //       displayName: 'menu.payment-methods',
    //     },
    //     {
    //       name: 'pricing-plans',
    //       displayName: 'menu.pricing-plans',
    //     },
    //     {
    //       name: 'billing',
    //       displayName: 'menu.billing',
    //     },
    //   ],
    // },
    // {
    //   name: 'auth',
    //   displayName: 'menu.auth',
    //   meta: {
    //     icon: 'login',
    //   },
    //   children: [
    //     {
    //       name: 'login',
    //       displayName: 'menu.login',
    //     },
    //     {
    //       name: 'signup',
    //       displayName: 'menu.signup',
    //     },
    //     {
    //       name: 'recover-password',
    //       displayName: 'menu.recover-password',
    //     },
    //   ],
    // },

    // {
    //   name: 'faq',
    //   displayName: 'menu.faq',
    //   meta: {
    //     icon: 'quiz',
    //   },
    // },
    // {
    //   name: '404',
    //   displayName: 'menu.404',
    //   meta: {
    //     icon: 'vuestic-iconset-files',
    //   },
    // },
    // {
    //   name: 'preferences',
    //   displayName: 'menu.preferences',
    //   meta: {
    //     icon: 'manage_accounts',
    //   },
    // },
    // {
    //   name: 'settings',
    //   displayName: 'menu.settings',
    //   meta: {
    //     icon: 'settings',
    //   },
    // },
  ] as INavigationRoute[],
}
