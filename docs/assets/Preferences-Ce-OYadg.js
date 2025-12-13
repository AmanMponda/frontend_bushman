import { u as le } from './user-store-66GuQgjY.js'
import {
  d as N,
  g as k,
  F as W,
  b as h,
  e as d,
  i as F,
  w as P,
  t as O,
  u as w,
  o as $,
  O as ce,
  c as v,
  P as V,
  s as E,
  Q as we,
  B as it,
  R as lt,
  S as ct,
  a as M,
  r as ut,
  v as j,
  h as R,
  U as dt,
  W as ft,
  C as ke,
  X as pt,
  Y as vt,
  D as _e,
  n as I,
  f as Ne,
  E as Se,
  Z as mt,
  G as q,
  $ as gt,
  J as ht,
  a0 as yt,
  a1 as bt,
  a2 as xt,
  a3 as ne,
} from './index-P4QeRV7n.js'
import { u as Ct } from './useForm-XQT-jLAz.js'
import { u as wt } from './useToast-DVuIP6Z-.js'
const _t = { class: 'flex flex-col justify-center' },
  St = { class: 'text-[28px] md:text-[32px] leading-10 font-bold' },
  Pt = { class: 'flex space-x-1 text-[13px] leading-4' },
  $t = N({
    __name: 'PreferencesHeader',
    setup(e) {
      const t = le()
      return (n, r) => {
        const o = F('VaAvatar')
        return (
          $(),
          k(
            W,
            null,
            [
              h(
                o,
                { size: 'large', color: 'warning' },
                { default: P(() => r[0] || (r[0] = [d('span', { class: 'text-4xl' }, ' 😍 ', -1)])), _: 1 },
              ),
              d('div', _t, [
                d('h2', St, O(w(t).userName), 1),
                d('div', Pt, [r[1] || (r[1] = d('p', null, 'Member since', -1)), d('p', null, O(w(t).memberSince), 1)]),
              ]),
            ],
            64,
          )
        )
      }
    },
  }),
  Pe = {
    light: {
      primary: '#154EC1',
      secondary: '#767C88',
      success: '#3D9209',
      info: '#158DE3',
      danger: '#E42222',
      warning: '#FFD43A',
      backgroundPrimary: '#f6f6f6',
      backgroundSecondary: '#FFFFFF',
      backgroundElement: '#ECF0F1',
      backgroundBorder: '#DEE5F2',
      textPrimary: '#262824',
      textInverted: '#FFFFFF',
      shadow: 'rgba(0, 0, 0, 0.12)',
      focus: '#49A8FF',
      transparent: 'rgba(0, 0, 0, 0)',
    },
    dark: {
      primary: '#3472F0',
      secondary: '#767C88',
      success: '#66BE33',
      info: '#3EAAF8',
      danger: '#F34030',
      warning: '#FFD952',
      backgroundPrimary: '#050A10',
      backgroundSecondary: '#1F262F',
      backgroundElement: '#131A22',
      backgroundBorder: '#3D4C58',
      textPrimary: '#F1F1F1',
      textInverted: '#0B121A',
      shadow: 'rgba(255, 255, 255, 0.12)',
      focus: '#49A8FF',
      transparent: 'rgba(0, 0, 0, 0)',
    },
  },
  Ft = { xs: 0, sm: 640, md: 1024, lg: 1440, xl: 1920 },
  zt = () => ({ enabled: !0, bodyClass: !0, thresholds: Ft }),
  Me = { preset: { type: [String, Array], default: void 0 } },
  Tt = 'VaLocalConfig',
  Vt = v(() => [])
function Ot() {
  return ce(Tt, Vt)
}
const J = (e) => e && typeof e == 'object' && !Array.isArray(e),
  U = (e, t) => (
    J(e) || (e = {}),
    Object.keys(t).forEach((n) => {
      const r = e[n],
        o = t[n]
      o instanceof RegExp || o instanceof Date
        ? (e[n] = o)
        : J(r) && J(o)
          ? (e[n] = U(Object.create(Object.getPrototypeOf(r), Object.getOwnPropertyDescriptors(r)), o))
          : (e[n] = o)
    }),
    e
  ),
  Rt = (e) => e !== null && typeof e == 'object',
  G = (e) =>
    e === null || typeof e != 'object'
      ? e
      : Array.isArray(e)
        ? e.map(G)
        : e instanceof Date
          ? new Date(e.getTime())
          : e instanceof RegExp
            ? new RegExp(e.source, e.flags)
            : e instanceof Map
              ? new Map(Array.from(e.entries()).map(([t, n]) => [t, G(n)]))
              : e instanceof Set
                ? new Set(Array.from(e.values()).map(G))
                : Rt(e)
                  ? Object.keys(e).reduce((t, n) => ((t[n] = G(e[n])), t), {})
                  : e,
  Et = (e) => ({
    ...e,
    get variables() {
      return this.presets[this.currentPresetName]
    },
    set variables(t) {
      this.presets[this.currentPresetName] = t
    },
  }),
  It = typeof process < 'u' ? process : {},
  At = It.env || {},
  kt = At.NODE_ENV || '',
  Nt = typeof __DEV__ < 'u' ? __DEV__ : !['prod', 'production'].includes(kt),
  oe = (...e) => (Nt && console.warn(...e), !1),
  Mt = (e) => {
    throw new Error(`[Vuestic] ${e}`)
  }
let Bt = null
const ue = () => Bt,
  Be = (e, t = void 0) => {
    var n
    const r = (n = ue()) == null ? void 0 : n._context.provides[e]
    return V()
      ? ce(e, t)
      : r ??
          Mt(
            "You're using Vuestic composable outside Vue app. Since you registered Vuestic in multiple apps, composables can not be used outside setup function anymore.",
          )
  },
  Dt = [
    { prefix: 'bg', property: 'background-color' },
    { prefix: 'text', property: ['color', 'fill'] },
  ],
  Lt = () => Dt,
  Gt = () => Et({ threshold: 150, presets: { light: Pe.light, dark: Pe.dark }, currentPresetName: 'light' }),
  jt = (e) => e,
  Ht = jt([
    { name: 'va-unsorted', to: 'swap_vert' },
    { name: 'va-sort-asc', to: 'va-arrow-up' },
    { name: 'va-sort-desc', to: 'va-arrow-down' },
    { name: 'va-arrow-first', to: 'mi-first_page' },
    { name: 'va-arrow-last', to: 'mi-last_page' },
    { name: 'va-arrow-right', to: 'mi-chevron_right' },
    { name: 'va-arrow-left', to: 'mi-chevron_left' },
    { name: 'va-arrow-down', to: 'mi-expand_more' },
    { name: 'va-arrow-up', to: 'mi-expand_less' },
    { name: 'va-calendar', to: 'mi-calendar_today' },
    { name: 'va-delete', to: 'mi-delete_outline' },
    { name: 'va-check', to: 'mi-check' },
    { name: 'va-check-circle', to: 'mi-check_circle' },
    { name: 'va-warning', to: 'mi-warning' },
    { name: 'va-clear', to: 'mi-highlight_off' },
    { name: 'va-close', to: 'mi-close' },
    { name: 'va-loading', to: 'mi-loop' },
    { name: 'va-plus', to: 'mi-add' },
    { name: 'va-minus', to: 'mi-remove' },
  ]),
  Ut = [
    { name: 'mi-{icon}', class: 'material-icons', resolve: ({ icon: e }) => ({ content: e }) },
    { name: '{icon}', class: 'material-icons', resolve: ({ icon: e }) => ({ content: e }) },
  ],
  Kt = (e) => ((e.aliases = e.aliases || []), (e.fonts = e.fonts || []), [...e.aliases, ...Ht, ...e.fonts, ...Ut]),
  Xt = () => Kt({}),
  Yt = () => ({
    VaIcon: { sizesConfig: { defaultSize: 18, sizes: { small: 14, medium: 18, large: 24 } } },
    VaRating: { sizesConfig: { defaultSize: 18, sizes: { small: 14, medium: 18, large: 24 } } },
    all: {},
    presets: {
      VaButton: {
        default: {
          backgroundOpacity: 1,
          hoverBehavior: 'mask',
          hoverOpacity: 0.15,
          pressedBehavior: 'mask',
          pressedOpacity: 0.13,
        },
        primary: {
          backgroundOpacity: 0.1,
          hoverBehavior: 'opacity',
          hoverOpacity: 0.07,
          pressedBehavior: 'opacity',
          pressedOpacity: 0.13,
        },
        secondary: {
          backgroundOpacity: 0,
          hoverBehavior: 'opacity',
          hoverOpacity: 0.07,
          pressedBehavior: 'opacity',
          pressedOpacity: 0.13,
        },
        plain: { plain: !0, hoverBehavior: 'mask', hoverOpacity: 0.15, pressedBehavior: 'mask', pressedOpacity: 0.13 },
        plainOpacity: {
          plain: !0,
          textOpacity: 0.6,
          hoverBehavior: 'opacity',
          hoverOpacity: 1,
          pressedBehavior: 'opacity',
          pressedOpacity: 0.9,
        },
      },
      VaInputWrapper: {
        solid: { background: 'backgroundElement' },
        bordered: { class: 'va-input-wrapper--bordered', background: 'backgroundElement' },
      },
      VaCheckbox: { solid: { style: '--va-checkbox-background: var(--va-background-element)' } },
      VaRadio: { solid: { style: '--va-radio-background: var(--va-background-element)' } },
      VaMenu: { context: { cursor: !0, placement: 'right-start', trigger: 'right-click' } },
    },
  }),
  qt = () => ({
    search: 'Search',
    noOptions: 'Items not found',
    ok: 'OK',
    cancel: 'Cancel',
    uploadFile: 'Upload file',
    undo: 'Undo',
    dropzone: 'Drop files here to upload',
    fileDeleted: 'File deleted',
    closeAlert: 'close alert',
    backToTop: 'back to top',
    toggleDropdown: 'toggle dropdown',
    carousel: 'carousel',
    goPreviousSlide: 'go previous slide',
    goNextSlide: 'go next slide',
    goSlide: 'go slide {index}',
    slideOf: 'slide {index} of {length}',
    close: 'close',
    openColorPicker: 'open color picker',
    colorSelection: 'color selection',
    colorName: 'color {color}',
    decreaseCounter: 'decrease counter',
    increaseCounter: 'increase counter',
    selectAllRows: 'select all rows',
    sortColumnBy: 'sort column by {name}',
    selectRowByIndex: 'select row {index}',
    resetDate: 'reset date',
    nextPeriod: 'next period',
    switchView: 'switch view',
    previousPeriod: 'previous period',
    removeFile: 'remove file',
    reset: 'reset',
    pagination: 'pagination',
    goToTheFirstPage: 'go to the first page',
    goToPreviousPage: 'go to the previous page',
    goToSpecificPage: 'go to the {page} page',
    goToSpecificPageInput: 'enter the page number to go',
    goNextPage: 'go next page',
    goLastPage: 'go last page',
    currentRating: 'current rating {value} of {max}',
    voteRating: 'vote rating {value} of {max}',
    optionsFilter: 'options filter',
    splitPanels: 'split panels',
    movePaginationLeft: 'move pagination left',
    movePaginationRight: 'move pagination right',
    resetTime: 'reset time',
    closeToast: 'close toast',
    selectedOption: 'Selected option',
    noSelectedOption: 'Option is not selected',
    breadcrumbs: 'breadcrumbs',
    counterValue: 'counter value',
    selectedDate: 'selected date',
    selectedTime: 'selected time',
    progressState: 'progress state',
    color: 'color',
    next: 'Next',
    back: 'Previous',
    finish: 'Finish',
    step: 'step',
    progress: 'progress',
    loading: 'Loading',
    sliderValue: 'Current slider value is {value}',
    switch: 'Switch',
    inputField: 'Input field',
    fileTypeIncorrect: 'File type is incorrect',
    select: 'Select an option',
  }),
  De = Symbol('GLOBAL_CONFIG'),
  Wt = () => ({
    colors: Gt(),
    icons: Xt(),
    components: Yt(),
    breakpoint: zt(),
    i18n: qt(),
    colorsClasses: Lt(),
    routerComponent: void 0,
  }),
  Zt = (e = {}) => {
    const t = E(U(Wt(), e))
    return {
      getGlobalConfig: () => t.value,
      setGlobalConfig: (s) => {
        const a = typeof s == 'function' ? s(t.value) : s
        t.value = G(a)
      },
      mergeGlobalConfig: (s) => {
        const a = typeof s == 'function' ? s(t.value) : s
        t.value = U(G(t.value), a)
      },
      globalConfig: t,
    }
  },
  Jt = (e) => {
    var t, n
    const r =
      ((t = V()) == null ? void 0 : t.appContext.provides) || ((n = ue()) == null ? void 0 : n._context.provides)
    if (!r) throw new Error('Vue app not found for provide')
    return (r[De] = e), e
  }
function X() {
  let e = Be(De)
  return e || ((e = Zt()), Jt(e)), e
}
const Qt = Symbol('VaAppCachePlugin'),
  en = () => {
    const e = Be(Qt)
    return e || { colorContrast: {} }
  },
  tn = (e) => {
    const t = typeof e == 'function' ? v(e) : v(e),
      n = new Proxy(t, {
        get(r, o, s) {
          if (typeof t.value == 'object') return w(Reflect.get(t.value, o, s))
        },
        set(r, o, s) {
          return we(t.value[o]) && !we(s) ? (t.value[o].value = s) : (t.value[o] = s), !0
        },
        deleteProperty(r, o) {
          return Reflect.deleteProperty(t.value, o)
        },
        has(r, o) {
          return typeof t.value != 'object' ? !1 : Reflect.has(t.value, o)
        },
        ownKeys() {
          return typeof t.value != 'object' ? [] : Object.keys(t.value)
        },
        getOwnPropertyDescriptor() {
          return { enumerable: !0, configurable: !0 }
        },
      })
    return it(n)
  },
  nn = (e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase(),
  on = /[A-Z0-9]*(?:[^\-_|A-Z|\s.])*/gm,
  Le = (e) => {
    var t
    return (
      ((t = e.match(on)) == null
        ? void 0
        : t
            .map((n) => n.trim().split(/([0-9]+)|([a-zA-Z]+)/g))
            .flat()
            .filter(Boolean)) || []
    )
  },
  se = (e) =>
    Le(e)
      .map((t) => t.toLowerCase())
      .join('-'),
  sn = (e) =>
    Le(e)
      .map((t, n) => (n === 0 ? t.toLowerCase() : nn(t)))
      .join(''),
  Ge = /^#([A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6,8})$/,
  je = /^rgba?\(([\d.]+, ?){2}[\d.]+(, ?[\d.]+)?\)$/,
  He = /hsla?\([\d.]+(deg|rad|turn|grad)?(,?\s?[\d.]+%?){2}(,?\s?(\/\s?)?[\d.]+%?)?\)/,
  rn = (e) => Ge.test(e) || je.test(e) || He.test(e),
  de = (e) => (typeof e != 'object' || e === null ? !1 : 'h' in e && 's' in e && 'l' in e),
  fe = (e) => (typeof e != 'object' || e === null ? !1 : 'r' in e && 'g' in e && 'b' in e),
  Ue = (e) => {
    if (!Ge.test(e)) return null
    const t = e.replace('#', ''),
      n = t.length < 6,
      [r, o, s, a] = n ? t.split('').map((i) => parseInt(i + i, 16)) : t.match(/.{2}/g).map((i) => parseInt(i, 16))
    return { r, g: o, b: s, a: a ?? 1 }
  },
  Ke = (e) => {
    if (!je.test(e)) return null
    const [t, n, r, o = 1] = e.match(/[\d.]+/g).map(Number)
    return { r: t, g: n, b: r, a: o }
  },
  Xe = (e) => {
    if (!He.test(e)) return null
    const [t, n, r, o = '1'] = e.match(/[\d.]+%?/g)
    return {
      h: Number(t),
      s: Number(n.replace('%', '')),
      l: Number(r.replace('%', '')),
      a: o.endsWith('%') ? Number(o.replace('%', '')) / 100 : Number(o),
    }
  },
  $e = (e) => {
    const t = e.r / 255,
      n = e.g / 255,
      r = e.b / 255,
      o = Math.max(t, n, r),
      s = Math.min(t, n, r)
    let a = 0,
      i = 0
    const c = (o + s) / 2
    if (o !== s) {
      const l = o - s
      switch (((i = c > 0.5 ? l / (2 - o - s) : l / (o + s)), o)) {
        case t:
          a = (n - r) / l + (n < r ? 6 : 0)
          break
        case n:
          a = (r - t) / l + 2
          break
        case r:
          a = (t - n) / l + 4
          break
      }
      a *= 60
    }
    return { h: Math.round(a), s: Math.round(i * 100), l: Math.round(c * 100), a: e.a }
  },
  Q = (e, t, n) => (
    n < 0 && (n += 1),
    n > 1 && (n -= 1),
    n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * (2 / 3 - n) * 6 : e
  ),
  Fe = (e) => {
    const t = e.h / 360,
      n = e.s / 100,
      r = e.l / 100,
      o = r < 0.5 ? r * (1 + n) : r + n - r * n,
      s = 2 * r - o,
      a = Q(s, o, t + 1 / 3),
      i = Q(s, o, t),
      c = Q(s, o, t - 1 / 3)
    return { r: Math.round(a * 255), g: Math.round(i * 255), b: Math.round(c * 255), a: e.a }
  },
  Y = (e) => {
    if (de(e)) return { ...e }
    if (fe(e)) return $e(e)
    const t = Ue(e) ?? Ke(e)
    if (t) return $e(t)
    const n = Xe(e)
    if (n) return n
    throw new Error(`Color ${e} is not valid. Please, provide valid color.`)
  },
  pe = ({ h: e, s: t, l: n, a: r }) => `hsla(${e},${t}%,${n}%,${r ?? 1})`,
  ve = (e) => {
    if (fe(e)) return { ...e }
    if (de(e)) return Fe(e)
    const t = Xe(e)
    if (t) return Fe(t)
    const n = Ue(e) ?? Ke(e)
    if (n) return n
    throw new Error(`Color ${e} is not valid. Please, provide valid color.`)
  },
  Ye = ({ r: e, g: t, b: n, a: r }) => (r === 1 ? `rgb(${e},${t},${n})` : `rgba(${e},${t},${n},${r ?? 1})`),
  an = (e) => {
    if (de(e)) return pe(e)
    if (fe(e)) return Ye(e)
    if (typeof e == 'string') return e
    throw new Error(`Color ${e} is not valid. Please, provide valid color.`)
  },
  ln = (e, { h: t, s: n, l: r, a: o }) => {
    const s = Y(e)
    return (
      (s.a = s.a ?? 1),
      (s.h = t ?? s.h),
      (s.s = n ?? s.s),
      (s.l = r ?? s.l),
      (s.a = o ?? s.a),
      s.h < 0 && (s.h = 360 + s.h),
      s.h > 360 && (s.h = s.h - 360),
      (s.s = Math.max(0, Math.min(100, s.s))),
      (s.l = Math.max(0, Math.min(100, s.l))),
      (s.a = Math.max(0, Math.min(1, s.a))),
      s
    )
  },
  cn = (e, { h: t, s: n, l: r, a: o }) => {
    const s = Y(e)
    return (
      (s.a = s.a ?? 1),
      (s.h += t ?? 0),
      (s.s += n ?? 0),
      (s.l += r ?? 0),
      (s.a += o ?? 0),
      s.h < 0 && (s.h = 360 + s.h),
      s.h > 360 && (s.h = s.h - 360),
      (s.s = Math.max(0, Math.min(100, s.s))),
      (s.l = Math.max(0, Math.min(100, s.l))),
      (s.a = Math.max(0, Math.min(1, s.a))),
      s
    )
  },
  un = (e) => /var\(--.+\)/.test(e),
  dn = (e) => `--va-${se(e)}`,
  ze = (e) => sn(e),
  H = (e, t) => {
    const { r: n, g: r, b: o } = ve(e)
    return Ye({ r: n, g: r, b: o, a: t })
  },
  Te = (e) => {
    const { r: t, g: n, b: r } = ve(e)
    return Math.sqrt(t * t * 0.241 + n * n * 0.691 + r * r * 0.068)
  },
  fn = (e, t = 0.4) => H(e, t),
  pn = (e, t = 0.4) => H(e, t),
  vn = (e, t = 0.2) => H(e, t),
  mn = (e, t = 0.3) => H(e, t),
  D = (e, t) => pe(cn(Y(e), t)),
  gn = (e, t) => pe(ln(Y(e), t)),
  hn = (e) => {
    const t = Y(e)
    if (t.s < 10) return D(t, { h: 2, s: 5, l: 10 })
    if (t.s < 30) return D(t, { s: -14, l: 11 })
    if ((t.h >= 0 && t.h < 44) || t.h >= 285) return D(t, { h: 11, s: 27, l: 8 })
    if (t.h >= 44 && t.h < 85) return D(t, { h: 3, l: 9 })
    if (t.h >= 85 && t.h < 165) return D(t, { h: 16, l: 14 })
    if (t.h >= 165 && t.h < 285) return D(t, { h: -15, s: 3, l: 2 })
    throw new Error("This method should handle all colors. But it didn't for some reason.")
  },
  yn = (e) => `linear-gradient(to right, ${hn(e)}, ${an(e)})`,
  bn = (e, t, n) => {
    const r = H(t, n)
    return `linear-gradient(0deg, ${r}, ${r}), ${e}`
  },
  xn = (e) => (e ? (e === 'transparent' ? !0 : ve(e).a <= 0.1) : !1),
  me = () => {
    const e = X()
    if (!e) throw new Error('useColors must be used in setup function or Vuestic GlobalConfigPlugin is not registered!')
    const { globalConfig: t } = e,
      n = tn({
        get: () => t.value.colors.presets[t.value.colors.currentPresetName],
        set: (u) => {
          r(u)
        },
      }),
      r = (u) => {
        t.value.colors.presets[t.value.colors.currentPresetName] = { ...t.value.colors.variables, ...u }
      },
      o = () => n,
      s = (u, b, C) => {
        if ((b || (b = n.primary), u === 'transparent')) return '#ffffff00'
        if (u === 'currentColor') return u
        if (u != null && u.startsWith('on')) {
          const z = u.slice(2)
          if (n[ze(z)]) return s(p(s(z)), void 0, C)
        }
        u || (u = s(b))
        const S = n[u] || n[ze(u)]
        return S
          ? C
            ? `var(${dn(u)})`
            : S
          : rn(u) || (C && un(u))
            ? u
            : (oe(`'${u}' is not a proper color! Use HEX or default color themes
      names (https://vuestic.dev/en/styles/colors#default-color-themes)`),
              s(b))
      },
      a = (u) =>
        v({
          get() {
            return s(u)
          },
          set(b) {
            r({ [u]: b })
          },
        }),
      i = (u, b = 'va') =>
        Object.keys(u)
          .filter((C) => u[C] !== void 0)
          .reduce(
            (C, S) => (
              (C[`--${b}-${se(S)}`] = s(u[S], void 0, !0)), (C[`--${b}-on-${se(S)}`] = s(p(s(u[S])), void 0, !0)), C
            ),
            {},
          ),
      c = en(),
      l = (u) =>
        typeof u != 'string' ? Te(u) : (c.colorContrast[u] || (c.colorContrast[u] = Te(u)), c.colorContrast[u]),
      m = v(() => (l(s('textPrimary')) > 255 / 2 ? 'textInverted' : 'textPrimary')),
      g = v(() => (l(s('textPrimary')) > 255 / 2 ? 'textPrimary' : 'textInverted')),
      p = (u, b, C) => {
        const S = `on${lt(String(u))}`
        return n[S] ? n[S] : ((b = b || m.value), (C = C || g.value), l(u) > t.value.colors.threshold ? b : C)
      },
      f = v({
        get: () => t.value.colors.currentPresetName,
        set: (u) => {
          y(u)
        },
      }),
      _ = v(() => t.value.colors.presets),
      y = (u) => {
        if (((t.value.colors.currentPresetName = u), !t.value.colors.presets[u]))
          return oe(`Preset ${u} does not exist`)
      }
    return {
      colors: n,
      currentPresetName: f,
      presets: _,
      applyPreset: y,
      setColors: r,
      getColors: o,
      getColor: s,
      getComputedColor: a,
      getBoxShadowColor: fn,
      getBoxShadowColorFromBg: pn,
      getHoverColor: vn,
      getFocusColor: mn,
      getGradientBackground: yn,
      getTextColor: p,
      shiftHSLAColor: D,
      setHSLAColor: gn,
      colorsToCSSVariable: i,
      colorToRgba: H,
      getStateMaskGradientBackground: bn,
    }
  },
  ee = (e) => {
    const t = V().props
    return v(() => {
      const r = t == null ? void 0 : t[e]
      return r === void 0 ? r : Number(r)
    })
  },
  Cn = () => typeof window > 'u',
  wn = {},
  T = () => (Cn() ? (typeof globalThis > 'u' ? wn : globalThis) : window),
  _n = (e, t) => t.test(e),
  qe = (e, t) => {
    if (typeof t != 'string' && t.global) return [...e.matchAll(t)].map((r) => r.slice(1))
    const n = e.match(t) || []
    return n ? (n.length > 1 ? n.slice(1) : n) : []
  },
  We = /{[^}]*}/g,
  Ze = (e) => e.replace(We, '(.*)'),
  Sn = (e) => (e.match(We) || []).map((t) => t.replace(/{|}/g, '')),
  Pn = (e, t) => qe(e, Ze(t)),
  $n = (e, t) => {
    const n = Sn(t),
      r = Pn(e, t)
    return n.reduce((o, s, a) => ({ ...o, [s]: r[a] }), {})
  },
  Fn = (e, t) => (e.match(t) || [])[0] === e,
  zn = (e, t) => {
    const n = Ze(t)
    return Fn(e, new RegExp(n))
  },
  Je = (e) => typeof e.name == 'string',
  Qe = (e) => e.name instanceof RegExp,
  Tn = (e, t) => (Je(t) ? zn(e, t.name) : Qe(t) ? _n(e, t.name) : !1),
  Vn = (e, t) => {
    const n = $n(e, t.name)
    return t.resolve && t.resolve(n)
  },
  On = (e, t) => {
    if (t.name.global) throw new Error(`Bad icon config with name ${t.name}. Please, don't use global regex as name.`)
    const n = qe(e, t.name)
    return t.resolveFromRegex && t.resolveFromRegex(...n)
  },
  Rn = (e, t) => {
    if (Je(t)) return Vn(e, t)
    if (Qe(t)) return On(e, t)
    throw Error('Unknown icon config')
  },
  En = (e, t, n = []) => {
    const r = t.find((o) => (n.includes(o.name.toString()) ? !1 : Tn(e, o)))
    if (!r) throw new Error(`Can not find icon config from ${e}. Please provide default config.`)
    return r
  },
  et = (e, t, n = []) => {
    if (!e) return
    const r = En(e, t, n),
      o = U(Rn(e, r), r)
    return (n = [...n, r.name.toString()]), U(et(o.to, t, n), o)
  },
  In = (e) => {
    const t = ['name', 'to', 'resolve', 'resolveFromRegex'],
      n = e
    return (
      t.forEach((r) => {
        delete n[r]
      }),
      n
    )
  },
  An = (e, t) => {
    const n = et(e, t)
    return n === void 0 ? {} : In(n)
  },
  kn = () => {
    const { globalConfig: e } = X()
    return { getIcon: (t) => An(t, e.value.icons) }
  },
  tt = (e, t) =>
    Object.keys(e)
      .filter((n) => !t.includes(n))
      .reduce((n, r) => ((n[r] = e[r]), n), {}),
  Nn = [null, void 0, ''],
  Mn = (e) => Nn.includes(e),
  Ve = (e) => !Mn(e),
  Bn = { defaultSize: 48, sizes: { small: 32, medium: 48, large: 64 } },
  Dn = { defaultSize: 1, sizes: { small: 0.75, medium: 1, large: 1.25 } },
  Ln = {
    size: { type: [String, Number], default: '', validator: (e) => typeof e == 'string' || typeof e == 'number' },
    sizesConfig: { type: Object, default: () => Bn },
    fontSizesConfig: { type: Object, default: () => Dn },
  },
  Gn = /(?<fontSize>\d+)(?<extension>px|rem)/i,
  Oe = (e) => e / 16 - 0.5,
  jn = (e, t = ((n) => ((n = V()) == null ? void 0 : n.type.name))()) => {
    const { getGlobalConfig: n } = X(),
      r = v(() => {
        var i, c
        return t ? ((c = (i = n().components) == null ? void 0 : i[t]) == null ? void 0 : c.sizesConfig) : void 0
      }),
      o = v(() => {
        var i, c, l
        const { defaultSize: m, sizes: g } = e.sizesConfig,
          p = (i = r.value) == null ? void 0 : i.defaultSize
        if (!e.size) return `${m || p}px`
        if (typeof e.size == 'string') {
          const f = (l = (c = r.value) == null ? void 0 : c.sizes) == null ? void 0 : l[e.size],
            _ = g[e.size]
          return _ ? `${_}px` : f ? `${f}px` : e.size
        }
        return `${e.size}px`
      }),
      s = v(() => {
        const { defaultSize: i, sizes: c } = e.fontSizesConfig
        if (!e.size) return i
        if (typeof e.size == 'string') {
          if (e.size in c) return c[e.size]
          const l = e.size.match(Gn)
          if (!l || !l.groups) throw new Error('Size prop should be either valid string or number')
          const { extension: m, fontSize: g } = l.groups
          return m === 'rem' ? +g : Oe(+g)
        }
        return Oe(e.size)
      }),
      a = v(() => `${s.value}rem`)
    return { sizeComputed: o, fontSizeComputed: a, fontSizeInRem: s }
  },
  Hn = N({
    name: 'VaIcon',
    __name: 'VaIcon',
    props: {
      ...Ln,
      ...Me,
      name: { type: String, default: '' },
      tag: { type: String },
      component: { type: Object },
      color: { type: String },
      rotation: { type: [String, Number] },
      spin: { type: [String, Boolean] },
      flip: { type: String, default: 'off', validator: (e) => ['off', 'horizontal', 'vertical', 'both'].includes(e) },
    },
    setup(e) {
      const t = e,
        { getColor: n } = me(),
        { sizeComputed: r } = jn(t),
        { getIcon: o } = kn(),
        s = v(() => o(t.name)),
        a = v(() => t.component || t.tag || s.value.component || s.value.tag || 'i'),
        i = ct(),
        c = v(() => ({ ...s.value.attrs, ...tt(i, ['class']) })),
        l = (y) => {
          if (!(y === void 0 || y === !1)) return y === 'counter-clockwise' ? 'va-icon--spin-reverse' : 'va-icon--spin'
        },
        m = v(() => [s.value.class, l(t.spin ?? s.value.spin)]),
        g = v(() => {
          const y = t.rotation ? `rotate(${t.rotation}deg)` : '',
            u = t.flip === 'vertical' || t.flip === 'both' ? -1 : 1,
            b = t.flip === 'horizontal' || t.flip === 'both' ? -1 : 1
          return `${t.flip === 'off' ? '' : `scale(${u}, ${b})`} ${y}`.trim()
        }),
        p = v(() => ({
          transform: g.value,
          cursor: i.onClick ? 'pointer' : null,
          color: t.color ? n(t.color, void 0, !0) : s.value.color,
          fontSize: r.value,
          height: r.value,
          lineHeight: r.value,
        })),
        f = v(() => i.tabindex ?? -1),
        _ = v(() => i.role !== 'button' || f.value < 0)
      return (y, u) => (
        $(),
        M(
          ft(a.value),
          dt({ class: ['va-icon', m.value], style: p.value, 'aria-hidden': _.value, notranslate: '' }, c.value),
          {
            default: P(() => [
              ut(y.$slots, 'default', {}, () => [
                s.value.content ? ($(), k(W, { key: 0 }, [R(O(s.value.content), 1)], 64)) : j('', !0),
              ]),
            ]),
            _: 3,
          },
          16,
          ['class', 'style', 'aria-hidden'],
        )
      )
    },
  }),
  nt = (e, t) => {
    const n = e.__vccOpts || e
    for (const [r, o] of t) n[r] = o
    return n
  },
  Un = `:root,
:host {
  --va-icon-vertical-align: middle;
  --va-icon-user-select: none;
}
.va-icon {
  vertical-align: var(--va-icon-vertical-align);
  -webkit-user-select: var(--va-icon-user-select);
     -moz-user-select: var(--va-icon-user-select);
          user-select: var(--va-icon-user-select);
}
.va-icon[role^=button][tabindex]:not([tabindex^="-"]) {
  cursor: pointer;
}
.va-icon[role^=button][tabindex]:not([tabindex^="-"]):focus-visible {
  outline: 2px solid var(--va-focus) !important;
  border-radius: 2px;
}
.va-icon.va-icon {
  font-style: normal;
}
.va-icon--spin {
  animation: va-icon--spin-animation 1500ms linear infinite;
}
.va-icon--spin-reverse {
  animation: va-icon--spin-animation 1500ms linear infinite;
  animation-direction: reverse;
}
@keyframes va-icon--spin-animation {
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}
}
.va-icon svg {
  fill: currentColor;
  height: 100%;
}`,
  Kn = nt(Hn, [['styles', [Un]]]),
  Xn = 5,
  B = E([]),
  Yn = (e) => {
    var t
    return ((t = e.component) == null ? void 0 : t.props) || {}
  },
  qn = (e) => (e.el ? e.el.offsetHeight + Xn : 0),
  Wn = (e) => {
    const t = V(),
      n = v(() => {
        const r = B.value.findIndex((o) => o === t.vnode)
        return r === -1
          ? 0
          : B.value.slice(r + 1).reduce((o, s) => {
              const { position: a } = Yn(s),
                { position: i } = e
              return i === a ? qn(s) + o : o
            }, 0)
      })
    return (
      ke(() => {
        B.value.unshift(t.vnode)
      }),
      pt(() => {
        B.value = B.value.filter((r) => r !== t.vnode)
      }),
      {
        yOffset: n,
        updateYOffset: () => {
          B.value = B.value.filter((r) => r !== t.vnode)
        },
      }
    )
  },
  Zn = () => {
    let e
    return { start: (...r) => ((e = window.setTimeout(...r)), e), clear: () => e && window.clearTimeout(e) }
  },
  Jn = (e) => e.startsWith('$t:'),
  Qn = (e) => ({ type: String, default: e }),
  Re = (e, t) => (
    t &&
      Object.keys(t).forEach((n) => {
        e = e.replace(`{${n}}`, String(t[n]))
      }),
    e
  ),
  eo = () => {
    const { globalConfig: e } = X(),
      t = v(() => e.value.i18n)
    function n(o, s) {
      var a
      const i = (a = V()) == null ? void 0 : a.appContext.config.globalProperties.$t
      if (typeof i == 'function') {
        const l = i(`vuestic.${o}`, s)
        if (l) return l
      }
      const c = t.value[o]
      return c ? Re(c, s) || o : (oe(`${o} not found in VuesticUI i18n config`), o)
    }
    function r(o, s) {
      return o ? (Jn(o) ? n(o.slice(3), s) : Re(o, s) || o) : ''
    }
    return { tp: r, t: n }
  },
  to = (e, t = !1) => {
    const { props: n } = V(),
      { getColor: r, getTextColor: o } = me()
    return {
      textColorComputed: v(() => {
        if (n.textColor) return r(n.textColor)
        const a = e ? w(e) : n.color
        if (!a) return 'currentColor'
        const i = r(a)
        return xn(i) ? 'currentColor' : w(t) ? i : r(o(i))
      }),
    }
  },
  no = ['role', 'aria-live'],
  oo = { class: 'va-toast__group' },
  so = ['textContent'],
  ro = { class: 'va-toast__content' },
  ao = ['innerHTML'],
  io = ['textContent'],
  lo = { key: 1, class: 'va-toast__content' },
  co = N({
    name: 'VaToast',
    __name: 'VaToast',
    props: {
      ...Me,
      title: { type: String, default: '' },
      offsetY: { type: [Number, String], default: 16 },
      offsetX: { type: [Number, String], default: 16 },
      message: { type: [String, Function], default: '' },
      dangerouslyUseHtmlString: { type: Boolean, default: !1 },
      icon: { type: String, default: 'close' },
      customClass: { type: String, default: '' },
      duration: { type: [Number, String], default: 5e3 },
      color: { type: String, default: 'primary' },
      closeable: { type: Boolean, default: !0 },
      onClose: { type: Function },
      onClick: { type: Function },
      multiLine: { type: Boolean, default: !1 },
      position: {
        type: String,
        default: 'top-right',
        validator: (e) =>
          ['top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'].includes(e),
      },
      render: { type: Function },
      ariaCloseLabel: Qn('$t:close'),
      role: { type: String, default: void 0 },
      inline: { type: Boolean, default: !1 },
    },
    emits: ['on-click', 'on-close'],
    setup(e, { emit: t }) {
      const n = N({
          name: 'VaToastRenderer',
          props: { render: { type: Function, required: !0 } },
          setup: (x) => () => x.render(),
        }),
        { tp: r } = eo(),
        o = e,
        s = t,
        a = vt(),
        { getColor: i } = me(),
        { textColorComputed: c } = to(v(() => i(o.color))),
        l = ee('offsetY'),
        m = ee('offsetX'),
        g = ee('duration'),
        p = E(!1),
        { yOffset: f, updateYOffset: _ } = Wn(o),
        y = v(() => ({
          vertical: o.position.includes('top') ? 'top' : 'bottom',
          horizontal: o.position.includes('center') ? 'center' : o.position.includes('right') ? 'right' : 'left',
        })),
        u = () => {
          const x = y.value.vertical,
            A = y.value.horizontal
          return A === 'center'
            ? { [x]: `${l.value + f.value}px`, left: '50%', '--va-toast-x-shift': '-50%' }
            : { [x]: `${l.value + f.value}px`, [A]: `${m.value}px` }
        },
        b = v(() => [
          o.customClass,
          o.multiLine ? 'va-toast--multiline' : '',
          o.inline ? 'va-toast--inline' : '',
          [`va-toast--${o.position}`],
        ]),
        C = v(() => ({ ...u(), backgroundColor: i(o.color), color: c.value })),
        S = v(() => (o.role === 'status' ? 'polite' : 'assertive')),
        z = v(() => (typeof o.message == 'function' ? o.message() : o.message)),
        ye = () => {
          var x, A
          ;(x = a.value) == null || x.removeEventListener('transitionend', ye), (A = a.value) == null || A.remove()
        },
        st = () => {
          typeof o.onClick == 'function' ? o.onClick() : s('on-click')
        },
        Z = () => {
          ;(p.value = !1), _()
        },
        rt = () => {
          typeof o.onClose == 'function' ? o.onClose() : s('on-close'), ye()
        },
        be = Zn(),
        xe = be.clear,
        Ce = () => {
          g.value > 0 && be.start(() => p.value && Z(), g.value)
        }
      return (
        ke(() => {
          ;(p.value = !0), Ce()
        }),
        (x, A) => (
          $(),
          M(
            gt,
            { name: 'va-toast-fade', onAfterLeave: rt },
            {
              default: P(() => [
                _e(
                  d(
                    'div',
                    {
                      ref_key: 'rootElement',
                      ref: a,
                      role: x.$props.role ?? x.$props.closeable ? 'alertdialog' : 'alert',
                      'aria-live': S.value,
                      'aria-atomic': 'true',
                      class: Ne(['va-toast', b.value]),
                      style: I(C.value),
                      onMouseenter: A[0] || (A[0] = (...at) => w(xe) && w(xe)(...at)),
                      onMouseleave: Ce,
                      onClick: st,
                    },
                    [
                      d('div', oo, [
                        x.$props.title
                          ? ($(),
                            k('h2', { key: 0, class: 'va-toast__title', textContent: O(x.$props.title) }, null, 8, so))
                          : j('', !0),
                        _e(
                          d(
                            'div',
                            ro,
                            [
                              x.$props.dangerouslyUseHtmlString
                                ? ($(), k('div', { key: 0, innerHTML: z.value }, null, 8, ao))
                                : ($(), k('p', { key: 1, textContent: O(z.value) }, null, 8, io)),
                            ],
                            512,
                          ),
                          [[Se, x.$props.message]],
                        ),
                        x.$props.render
                          ? ($(), k('div', lo, [h(w(n), { render: x.$props.render }, null, 8, ['render'])]))
                          : j('', !0),
                        x.$props.closeable
                          ? ($(),
                            M(
                              Kn,
                              {
                                key: 2,
                                class: 'va-toast__close-icon',
                                role: 'button',
                                'aria-label': w(r)(x.$props.ariaCloseLabel),
                                tabindex: '0',
                                size: '1rem',
                                name: x.$props.icon,
                                onClick: q(Z, ['stop']),
                                onKeydown: mt(q(Z, ['stop']), ['enter']),
                              },
                              null,
                              8,
                              ['aria-label', 'name', 'onKeydown'],
                            ))
                          : j('', !0),
                      ]),
                    ],
                    46,
                    no,
                  ),
                  [[Se, p.value]],
                ),
              ]),
              _: 1,
            },
          )
        )
      )
    },
  }),
  uo = `:root,
:host {
  --va-toast-display: flex;
  --va-toast-width: 330px;
  --va-toast-padding: 14px 1.25rem 14px 1.25rem;
  --va-toast-border-radius: 8px;
  --va-toast-border-color: transparent;
  --va-toast-border: 1px solid var(--va-toast-border-color);
  --va-toast-background-color: var(--va-background-secondary);
  --va-toast-box-shadow: 0 2px 12px 0 var(--va-shadow);
  --va-toast-transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s, bottom 0.3s;
  --va-toast-z-index: calc(var(--va-z-index-teleport-overlay) + 100);
  /* Title */
  --va-toast-title-font-weight: bold;
  --va-toast-title-font-size: 1rem;
  --va-toast-title-color: #303133;
  --va-toast-title-margin: 0 0 6px;
  /* Content */
  --va-toast-content-font-size: 1rem;
  --va-toast-content-line-height: 1.3125;
  --va-toast-content-padding-right: 20px;
  /* Icon */
  --va-toast-icon-height: 24px;
  --va-toast-icon-width: 24px;
  --va-toast-icon-font-size: 24px;
  /* Icon Close */
  --va-toast-close-icon-top: 18px;
  --va-toast-close-icon-right: 15px;
  --va-toast-close-icon-font-size: 1rem;
}
.va-toast {
  --va-toast-x-shift: 0px;
  --va-toast-animation-x-shift: 0px;
  --va-toast-animation-y-shift: 100%;
  position: fixed;
  box-sizing: border-box;
  width: var(--va-toast-width);
  padding: var(--va-toast-padding);
  display: flex;
  align-items: center;
  border-radius: var(--va-toast-border-radius);
  border: var(--va-toast-border);
  background-color: var(--va-toast-background-color);
  box-shadow: var(--va-toast-box-shadow);
  transition: var(--va-toast-transition);
  overflow: hidden;
  z-index: var(--va-toast-z-index);
  font-family: var(--va-font-family);
  transform: translateX(var(--va-toast-x-shift));
}
.va-toast--top-right, .va-toast--bottom-right {
  --va-toast-animation-x-shift: 100%;
}
.va-toast--top-left, .va-toast--bottom-left {
  --va-toast-animation-x-shift: -100%;
}
.va-toast--top-left, .va-toast--top-center, .va-toast--top-right {
  --va-toast-animation-y-shift: -100%;
}
.va-toast--inline {
  position: static;
}
.va-toast--multiline {
  min-height: 70px;
}
.va-toast__title {
  font-weight: var(--va-toast-title-font-weight);
  font-size: var(--va-toast-title-font-size);
  margin: var(--va-toast-title-margin);
  font-size: 0.625rem;
  letter-spacing: 0.6px;
  line-height: 1.2;
  font-weight: 700;
  text-transform: uppercase;
}
.va-toast__content {
  font-size: var(--va-toast-content-font-size);
  line-height: var(--va-toast-content-line-height);
  padding-right: var(--va-toast-content-padding-right);
}
.va-toast__content p,
.va-toast__content div {
  margin: 0;
}
.va-toast__icon {
  height: var(--va-toast-icon-height);
  width: var(--va-toast-icon-width);
  font-size: var(--va-toast-icon-font-size);
}
.va-toast__close-icon {
  position: absolute;
  top: 50%;
  right: var(--va-toast-close-icon-right);
  cursor: pointer;
  transform: translateY(-50%);
  font-size: var(--va-toast-close-icon-font-siz);
  opacity: 0.7;
}
.va-toast__close-icon:hover {
  opacity: 1;
}
.va-toast-fade-enter-from {
  transform: translateX(calc(var(--va-toast-animation-x-shift) + var(--va-toast-x-shift)));
}
.va-toast-fade-leave-to {
  transform: translateY(var(--va-toast-animation-y-shift));
  opacity: 0;
}`,
  fo = nt(co, [['styles', [uo]]]),
  re = (e, t = null) => P(() => [e], t),
  Ee = (e) => (typeof e == 'string' ? ht(yt, e) : bt(e) ? e : M(e)),
  po = (e, t = null) =>
    Object.keys(e).reduce((n, r) => {
      const o = e[r]
      return (n[r] = typeof o == 'function' ? o : re(o, t)), n
    }, {}),
  vo = (e) => {
    const t = e.render || e.ssrRender
    if (!t) return
    const n = t.name === '_sfc_render' || t.name === '_sfc_ssrRender'
    return function (...r) {
      const o = r[0],
        s = o.$.slots,
        a = new Proxy(o, {
          get(c, l) {
            return l === '$slots' ? po(s) : c[l]
          },
        }),
        i = n ? void 0 : a
      return t.call(i, a, ...r.slice(1))
    }
  },
  mo = '$va:childComponents',
  ge = () => {
    var e
    const t = (e = V()) == null ? void 0 : e.attrs['va-child']
    if (!t) return null
    const n = ce(mo)
    return n != null && n.value ? v(() => n.value[t]) : null
  },
  go = /([a-z0-9])([A-Z])/g,
  ho = (e) => e.replace(go, '$1-$2').toLowerCase(),
  yo = (e, t) => (t in e ? e[t] : e[ho(t)]),
  bo = (e, t) => {
    const n = e.props,
      r = ge()
    return new Proxy(n, {
      get: (o, s) => {
        var a, i
        if (typeof s != 'string') return o[s]
        const c = (a = r == null ? void 0 : r.value) == null ? void 0 : a[s]
        if (c !== void 0) return c
        const l = e.vnode.props || {},
          m = o[s]
        if (yo(l, s) !== void 0) return m
        const p = (i = t.value) == null ? void 0 : i[s]
        return p !== void 0 ? p : m
      },
    })
  },
  xo = (e, t) => {
    const n = e.attrs
    return new Proxy(n, {
      get: (r, o) => {
        var s
        if (typeof o != 'string') return r[o]
        if (o === 'class') return Ne([t.value.class, n.class])
        if (o === 'style') return I([t.value.style, n.style])
        const a = (s = t.value) == null ? void 0 : s[o]
        return a !== void 0 ? a : r[o]
      },
      ownKeys(r) {
        return [...new Set([...Object.keys(n), ...Object.keys(t.value)])]
      },
      getOwnPropertyDescriptor(r, o) {
        return Reflect.getOwnPropertyDescriptor(t.value, o) ?? Reflect.getOwnPropertyDescriptor(n, o)
      },
    })
  },
  te = 'slot:',
  Co = (e, t) => {
    const n = e.slots,
      r = ge(),
      o = v(() =>
        Object.keys(t.value).reduce((s, a) => (a.startsWith(te) && (s[a.slice(te.length)] = t.value[a]), s), {}),
      )
    return new Proxy(n, {
      get: (s, a) => {
        var i, c
        if (typeof a != 'string') return s[a]
        const l = `${te}${a}`,
          m = (i = r == null ? void 0 : r.value) == null ? void 0 : i[l]
        if (m !== void 0) return re(Ee(m))
        const g = s[a]
        if (g !== void 0) return g
        const p = (c = o.value) == null ? void 0 : c[a]
        return p !== void 0 ? re(Ee(p)) : g
      },
      ownKeys(s) {
        return [...new Set([...Object.keys(n), ...Object.keys(o.value)])]
      },
      getOwnPropertyDescriptor(s, a) {
        return Reflect.getOwnPropertyDescriptor(o.value, a) ?? Reflect.getOwnPropertyDescriptor(n, a)
      },
    })
  },
  wo = (e) => 'preset' in e,
  Ie = (e) => (wo(e) ? e.preset : void 0),
  _o = (e, t) => {
    const n = Ot(),
      { globalConfig: r } = X(),
      o = e.name,
      s = (i) =>
        (i instanceof Array ? i : [i]).reduce((c, l) => {
          var m, g, p
          const f =
            (p = (g = (m = r.value.components) == null ? void 0 : m.presets) == null ? void 0 : g[o]) == null
              ? void 0
              : p[l]
          if (!f) return c
          const _ = Ie(f)
          return { ...c, ...(_ ? s(_) : void 0), ...f }
        }, {}),
      a = ge()
    return v(() => {
      var i, c
      const l = {
          ...((i = r.value.components) == null ? void 0 : i.all),
          ...((c = r.value.components) == null ? void 0 : c[o]),
        },
        m = n.value.reduce((f, _) => {
          const y = _[o]
          return y ? { ...f, ...y } : f
        }, {}),
        g = [t, a == null ? void 0 : a.value, m, l].filter(Ve).map(Ie).filter(Ve).at(0),
        p = g ? s(g) : void 0
      return { ...l, ...m, ...p }
    })
  },
  So = (e) => (t, n) => {
    var r
    const o = V(),
      s = _o(e, t),
      a = v(() => tt(s.value, Object.keys(t))),
      i = bo(o, s),
      c = xo(o, a),
      l = Co(o, s)
    ;(o.props = i), (o.attrs = c), (o.slots = l)
    const m = (r = e.setup) == null ? void 0 : r.call(e, xt(i), { ...n, attrs: c, slots: l })
    return typeof m == 'object' && !o.exposed && n.expose(m), m
  },
  ae = (e) => {
    const t = So(e),
      n = vo(e)
    return new Proxy(e, {
      get(r, o) {
        return o in e
          ? o === 'setup'
            ? t
            : o === 'render' || o === 'ssrRender'
              ? n
              : Reflect.get(r, o)
          : Reflect.get(r, o)
      },
    })
  },
  ie = '__c',
  Po = (e) => ((e[ie] = ae(e[ie])), e),
  $o = (e) => ('setup' in e ? ae(e) : ie in e ? Po(e) : ((e.setup = () => ({})), ae(e))),
  Fo = $o(fo)
let K = 1
T().vaToastInstances = []
const he = (e) => {
    var t
    return ((t = e.component) == null ? void 0 : t.props) || {}
  },
  zo = (e, t) => {
    if (!e) return
    if (!T().vaToastInstances.length) {
      K = 1
      return
    }
    T().vaToastInstances.findIndex((r) => r === e) < 0 ||
      (t(),
      (T().vaToastInstances = T().vaToastInstances.reduce((r, o, s) => (o === e ? r : [...r, o]), [])),
      T().vaToastInstances.length || (K = 1))
  },
  To = (e, t) => {
    e && (ne(null, e), e.remove()), (e = null)
  },
  Vo = (e, { props: t, children: n, element: r, appContext: o } = {}) => {
    let s = r,
      a
    return (
      (a = h(
        e,
        {
          ...t,
          onClose: () => {
            zo(a, () => To(s)), t != null && t.onClose && t.onClose()
          },
        },
        n,
      )),
      o && (a.appContext = o),
      s ? ne(a, s) : typeof document < 'u' && ne(a, (s = document.createElement('div'))),
      { vNode: a, el: s }
    )
  },
  Oo = (e) => {
    if (!T().vaToastInstances.length) {
      K = 1
      return
    }
    T().vaToastInstances.forEach((t) => {
      ;(e && t.appContext !== e) || he(t).onClose()
    })
  },
  Ae = (e) => {
    const t = T().vaToastInstances.find((n) => {
      var r
      return ((r = n.el) == null ? void 0 : r.id) === e
    })
    t && he(t).onClose()
  },
  Ro = (e) => (typeof e == 'string' ? { message: e } : e),
  Eo = (e, t) => {
    const { vNode: n, el: r } = Vo(Fo, { appContext: t, props: Ro(e) }),
      o = he(n)
    return r && n.el && o
      ? (document.body.appendChild(r.childNodes[0]),
        (n.el.id = 'notification_' + K),
        (K += 1),
        T().vaToastInstances.push(n),
        n.el.id)
      : null
  },
  Io = () => {
    const e = V()
    return v(() => {
      var t
      return ((t = ue()) == null ? void 0 : t._context) || (e == null ? void 0 : e.appContext)
    })
  },
  ot = () => {
    const e = Io(),
      t = [],
      n = (i) => {
        const c = Eo(i, e.value)
        return c && t.push(c), c
      }
    return {
      init: (i) => n(i),
      notify: n,
      close: (i) => Ae(i),
      closeAll: (i = !1) => Oo(i ? void 0 : e.value),
      closeAllCreatedInThisHook: () => {
        t.forEach((i) => Ae(i))
      },
    }
  },
  L = { '--va-button-font-size': '14px', '--va-button-line-height': '20px' },
  Ao = {
    class: 'flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5',
  },
  ko = { class: 'flex-1' },
  No = { class: 'max-w-[748px]' },
  Mo = { class: 'flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5' },
  Bo = { class: 'flex-1' },
  Do = { class: 'max-w-[748px]' },
  Lo = { class: 'flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5' },
  Go = { class: 'flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5' },
  jo = { class: 'flex-1' },
  Ho = { class: 'max-w-[748px]' },
  Uo = { class: 'flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5' },
  Ko = { class: 'flex-1' },
  Xo = { class: 'max-w-[748px]' },
  Yo = { class: 'flex space-x-1 w-fit' },
  qo = N({
    __name: 'Settings',
    emits: ['openNameModal', 'openResetPasswordModal'],
    setup(e, { emit: t }) {
      const n = le(),
        { init: r } = ot(),
        o = v(() => (n.is2FAEnabled ? '2FA successfully enabled' : '2FA successfully disabled')),
        s = v(() =>
          n.is2FAEnabled
            ? {
                color: 'danger',
                button: 'Disable 2FA',
                content:
                  'Two-Factor Authentication (2FA) is now enabled for your account, adding an extra layer of security to your sign-ins.',
              }
            : {
                color: 'primary',
                button: 'Set up 2FA',
                content:
                  'Add an extra layer of security to your account. To sign in, you’ll need to provide a code along with your username and password.',
              },
        ),
        a = () => {
          n.toggle2FA(), r({ message: o.value, color: 'success' })
        },
        i = t
      return (c, l) => {
        const m = F('VaButton'),
          g = F('VaDivider'),
          p = F('RouterLink')
        return (
          $(),
          k(
            W,
            null,
            [
              d('div', Ao, [
                l[3] || (l[3] = d('p', { class: 'font-bold w-[200px]' }, 'Name', -1)),
                d('div', ko, [d('div', No, O(w(n).userName), 1)]),
                h(
                  m,
                  {
                    style: I(w(L)),
                    class: 'w-fit h-fit',
                    preset: 'primary',
                    onClick: l[0] || (l[0] = (f) => i('openNameModal')),
                  },
                  { default: P(() => l[2] || (l[2] = [R(' Edit ')])), _: 1 },
                  8,
                  ['style'],
                ),
              ]),
              h(g),
              d('div', Mo, [
                l[4] || (l[4] = d('p', { class: 'font-bold w-[200px]' }, 'Email', -1)),
                d('div', Bo, [d('div', Do, O(w(n).email), 1)]),
              ]),
              d('div', Lo, [
                l[6] || (l[6] = d('p', { class: 'font-bold w-[200px]' }, 'Password', -1)),
                l[7] ||
                  (l[7] = d('div', { class: 'flex-1' }, [d('div', { class: 'max-w-[748px]' }, '•••••••••••••')], -1)),
                h(
                  m,
                  {
                    style: I(w(L)),
                    class: 'w-fit h-fit',
                    preset: 'primary',
                    onClick: l[1] || (l[1] = (f) => i('openResetPasswordModal')),
                  },
                  { default: P(() => l[5] || (l[5] = [R(' Reset Password ')])), _: 1 },
                  8,
                  ['style'],
                ),
              ]),
              h(g),
              d('div', Go, [
                l[8] || (l[8] = d('p', { class: 'font-bold w-[200px]' }, 'Two-factor authentication', -1)),
                d('div', jo, [d('div', Ho, O(s.value.content), 1)]),
                h(
                  m,
                  { style: I(w(L)), class: 'w-fit h-fit', preset: 'primary', color: s.value.color, onClick: a },
                  { default: P(() => [R(O(s.value.button), 1)]), _: 1 },
                  8,
                  ['style', 'color'],
                ),
              ]),
              h(g),
              d('div', Uo, [
                l[11] || (l[11] = d('p', { class: 'font-bold w-[200px]' }, 'Email subscriptions', -1)),
                d('div', Ko, [
                  d('div', Xo, [
                    l[10] || (l[10] = d('p', null, 'To manage what emails you get, visit the', -1)),
                    d('div', Yo, [
                      h(
                        p,
                        { to: { name: 'settings' }, class: 'font-semibold text-primary' },
                        { default: P(() => l[9] || (l[9] = [R('Notification settings')])), _: 1 },
                      ),
                    ]),
                  ]),
                ]),
              ]),
            ],
            64,
          )
        )
      }
    },
  }),
  Wo = { class: 'flex flex-col-reverse md:flex-row md:items-center md:justify-end md:space-x-4' },
  Zo = N({
    __name: 'EditNameModal',
    emits: ['cancel'],
    setup(e, { emit: t }) {
      const n = le(),
        { init: r } = ot(),
        o = t,
        s = E(n.userName),
        a = () => {
          if (!s.value || s.value === n.userName) return o('cancel')
          n.changeUserName(s.value),
            r({ message: "You've successfully changed your name", color: 'success' }),
            o('cancel')
        }
      return (i, c) => {
        const l = F('VaInput'),
          m = F('VaButton'),
          g = F('VaForm'),
          p = F('VaModal')
        return (
          $(),
          M(
            p,
            {
              'mobile-fullscreen': !1,
              size: 'small',
              'hide-default-actions': '',
              'max-width': '380px',
              'model-value': '',
              'close-button': '',
              'onUpdate:modelValue': c[2] || (c[2] = (f) => o('cancel')),
            },
            {
              default: P(() => [
                c[5] || (c[5] = d('h1', { class: 'va-h5 mb-4' }, 'Reset password', -1)),
                h(
                  g,
                  { ref: 'form', onSubmit: q(a, ['prevent']) },
                  {
                    default: P(() => [
                      h(
                        l,
                        {
                          modelValue: s.value,
                          'onUpdate:modelValue': c[0] || (c[0] = (f) => (s.value = f)),
                          class: 'mb-4',
                          label: 'Name',
                          placeholder: 'Name',
                        },
                        null,
                        8,
                        ['modelValue'],
                      ),
                      d('div', Wo, [
                        h(
                          m,
                          {
                            style: I(w(L)),
                            preset: 'secondary',
                            color: 'secondary',
                            onClick: c[1] || (c[1] = (f) => o('cancel')),
                          },
                          { default: P(() => c[3] || (c[3] = [R(' Cancel')])), _: 1 },
                          8,
                          ['style'],
                        ),
                        h(
                          m,
                          { style: I(w(L)), class: 'mb-4 md:mb-0', type: 'submit', onClick: a },
                          { default: P(() => c[4] || (c[4] = [R(' Save')])), _: 1 },
                          8,
                          ['style'],
                        ),
                      ]),
                    ]),
                    _: 1,
                  },
                  512,
                ),
              ]),
              _: 1,
            },
          )
        )
      }
    },
  }),
  Jo = { class: 'grid grid-cols-1 md:grid-cols-2 gap-6' },
  Qo = { class: 'flex flex-col space-y-2' },
  es = { class: 'flex space-x-2 items-center' },
  ts = { class: 'flex space-x-2 items-center' },
  ns = { class: 'flex flex-col-reverse md:justify-end md:flex-row md:space-x-4' },
  os = N({
    __name: 'ResetPasswordModal',
    emits: ['cancel'],
    setup(e, { emit: t }) {
      const n = E(),
        r = E(),
        o = E(),
        { validate: s } = Ct('form'),
        { init: a } = wt(),
        i = t,
        c = () => {
          s() && (a({ message: "You've successfully changed your password", color: 'success' }), i('cancel'))
        },
        l = [(p) => !!p || 'Old password field is required'],
        m = [
          (p) => !!p || 'New password field is required',
          (p) => (p == null ? void 0 : p.length) >= 8 || 'Must be at least 8 characters long',
          (p) => new Set(p).size >= 6 || 'Must contain at least 6 unique characters',
          (p) => p !== n.value || 'New password cannot be the same',
        ],
        g = [
          (p) => !!p || 'Repeat new password field is required',
          (p) => p === r.value || 'Confirm password does not match new password',
        ]
      return (p, f) => {
        const _ = F('VaInput'),
          y = F('VaIcon'),
          u = F('VaButton'),
          b = F('VaForm'),
          C = F('VaModal')
        return (
          $(),
          M(
            C,
            {
              'max-width': '530px',
              'mobile-fullscreen': !1,
              'hide-default-actions': '',
              'model-value': '',
              'close-button': '',
              'onUpdate:modelValue': f[4] || (f[4] = (S) => i('cancel')),
            },
            {
              default: P(() => [
                f[10] || (f[10] = d('h1', { class: 'va-h5 mb-4' }, 'Reset password', -1)),
                h(
                  b,
                  { ref: 'form', class: 'space-y-6', onSubmit: q(c, ['prevent']) },
                  {
                    default: P(() => {
                      var S
                      return [
                        d('div', Jo, [
                          h(
                            _,
                            {
                              modelValue: n.value,
                              'onUpdate:modelValue': f[0] || (f[0] = (z) => (n.value = z)),
                              rules: l,
                              label: 'Old password',
                              placeholder: 'Old password',
                              'required-mark': '',
                              type: 'password',
                            },
                            null,
                            8,
                            ['modelValue'],
                          ),
                          f[5] || (f[5] = d('div', { class: 'hidden md:block' }, null, -1)),
                          h(
                            _,
                            {
                              modelValue: r.value,
                              'onUpdate:modelValue': f[1] || (f[1] = (z) => (r.value = z)),
                              rules: m,
                              label: 'New password',
                              placeholder: 'New password',
                              'required-mark': '',
                              type: 'password',
                            },
                            null,
                            8,
                            ['modelValue'],
                          ),
                          h(
                            _,
                            {
                              modelValue: o.value,
                              'onUpdate:modelValue': f[2] || (f[2] = (z) => (o.value = z)),
                              rules: g,
                              label: 'Repeat new password',
                              placeholder: 'Repeat new password',
                              'required-mark': '',
                              type: 'password',
                            },
                            null,
                            8,
                            ['modelValue'],
                          ),
                        ]),
                        d('div', Qo, [
                          d('div', es, [
                            d('div', null, [
                              h(
                                y,
                                {
                                  name: ((S = r.value) == null ? void 0 : S.length) >= 8 ? 'mso-check' : 'mso-close',
                                  color: 'secondary',
                                  size: '20px',
                                },
                                null,
                                8,
                                ['name'],
                              ),
                            ]),
                            f[6] || (f[6] = d('p', null, 'Must be at least 8 characters long', -1)),
                          ]),
                          d('div', ts, [
                            d('div', null, [
                              h(
                                y,
                                {
                                  name: new Set(r.value).size >= 6 ? 'mso-check' : 'mso-close',
                                  color: 'secondary',
                                  size: '20px',
                                },
                                null,
                                8,
                                ['name'],
                              ),
                            ]),
                            f[7] || (f[7] = d('p', null, 'Must contain at least 6 unique characters', -1)),
                          ]),
                        ]),
                        d('div', ns, [
                          h(
                            u,
                            {
                              style: I(w(L)),
                              preset: 'secondary',
                              color: 'secondary',
                              onClick: f[3] || (f[3] = (z) => i('cancel')),
                            },
                            { default: P(() => f[8] || (f[8] = [R(' Cancel')])), _: 1 },
                            8,
                            ['style'],
                          ),
                          h(
                            u,
                            { style: I(w(L)), class: 'mb-4 md:mb-0', type: 'submit', onClick: c },
                            { default: P(() => f[9] || (f[9] = [R(' Update Password')])), _: 1 },
                            8,
                            ['style'],
                          ),
                        ]),
                      ]
                    }),
                    _: 1,
                  },
                  512,
                ),
              ]),
              _: 1,
            },
          )
        )
      }
    },
  }),
  ss = { class: 'flex flex-col p-4 space-y-10 bg-backgroundSecondary rounded-lg' },
  rs = { class: 'flex space-x-5' },
  as = { class: 'space-y-4 md:space-y-6' },
  ds = N({
    __name: 'Preferences',
    setup(e) {
      const t = E(!1),
        n = E(!1)
      return (r, o) => (
        $(),
        k(
          W,
          null,
          [
            o[4] || (o[4] = d('h1', { class: 'page-title' }, 'Preferences', -1)),
            d('div', ss, [
              d('div', rs, [h($t)]),
              d('div', as, [
                h(qo, {
                  onOpenNameModal: o[0] || (o[0] = (s) => (t.value = !0)),
                  onOpenResetPasswordModal: o[1] || (o[1] = (s) => (n.value = !0)),
                }),
              ]),
            ]),
            t.value ? ($(), M(Zo, { key: 0, onCancel: o[2] || (o[2] = (s) => (t.value = !1)) })) : j('', !0),
            n.value ? ($(), M(os, { key: 1, onCancel: o[3] || (o[3] = (s) => (n.value = !1)) })) : j('', !0),
          ],
          64,
        )
      )
    },
  })
export { ds as default }
//# sourceMappingURL=Preferences-Ce-OYadg.js.map
