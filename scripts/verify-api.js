const axios = require('axios')

const BASE = process.env.VITE_APP_BASE_URL || 'http://localhost/your-app-path/api/v1.0'
const PATHS = {
  permits: process.env.VITE_APP_ENTITY_CONTRACT_PERMIT_VSET_URL || '/settings/permits',
  quotas: process.env.VITE_APP_SALES_QUOTAS_URL || '/sales/quotas',
  areaSpecies: process.env.VITE_APP_SALES_QUOTAS_AREA_SPECIES_URL || '/sales/quotas/area-species',
  species: process.env.VITE_APP_SPECIES_URL || '/species',
  areas: process.env.VITE_APP_HUTING_AREAS_URL || '/areas',
}

function buildUrl(base, path, suffix = '') {
  const b = (base || '').replace(/\/$/, '')
  const p = (path || '').replace(/^\//, '').replace(/\/$/, '')
  const s = (suffix || '').toString().replace(/^\//, '')
  const url = [b, p].filter(Boolean).join('/')
  return s ? `${url}/${s}` : url
}

async function checkList(url, opts = {}) {
  try {
    const res = await axios.get(url, opts)
    if (res.status !== 200) {
      console.error(`FAIL ${url} — status ${res.status}`)
      return { ok: false, res }
    }

    const payload = res.data
    const arr = Array.isArray(payload) ? payload : payload?.data
    if (!Array.isArray(arr)) {
      console.warn(`WARN ${url} — response is not an array nor {data: []}.`, typeof payload)
      return { ok: true, res, note: 'not-array' }
    }

    if (arr.length === 0) {
      console.warn(`WARN ${url} — array is empty`)
      return { ok: true, res, note: 'empty' }
    }

    return { ok: true, res, sample: arr[0] }
  } catch (err) {
    console.error(`ERROR ${url} —`, err.message)
    return { ok: false, error: err }
  }
}

async function checkPermits() {
  const url = buildUrl(BASE, PATHS.permits)
  const list = await checkList(url)
  if (!list.ok) return list

  const sample =
    list.sample || (Array.isArray(list.res.data) && list.res.data[0]) || (list.res.data?.data && list.res.data.data[0])
  if (!sample) return list

  const hasFields = ['permit_number', 'dates', 'issued_date'].every(
    (k) => k in sample || (sample.selfitem && k in sample.selfitem),
  )
  console.log(`permits: ${hasFields ? 'OK' : 'MISSING_FIELDS'}`, url)

  // If list contains ids, try detail
  const id = sample.id || sample?.selfitem?.id || sample?.entity_contract_id
  if (id) {
    const detailUrl = buildUrl(BASE, PATHS.permits, `${id}`)
    try {
      const res = await axios.get(detailUrl)
      if (res.status === 200) {
        const obj = res.data
        const ok = obj && (obj.entity_contract || obj.dates)
        console.log(`permit detail ${detailUrl}: ${ok ? 'OK' : 'UNEXPECTED_SHAPE'}`)
      } else {
        console.warn(`permit detail ${detailUrl}: status ${res.status}`)
      }
    } catch (err) {
      console.error(`ERROR fetching permit detail ${detailUrl}:`, err.message)
    }
  } else {
    console.log('No id found in sample permit; skipping detail check')
  }

  return list
}

async function checkQuotas() {
  const url = buildUrl(BASE, PATHS.quotas)
  const res = await checkList(url)
  if (!res.ok) return res

  // store expects response.data.data to be array
  const top = res.res.data
  const hasDataArray = Array.isArray(top?.data)
  console.log(`quotas: ${hasDataArray ? 'OK (data array)' : 'CHECK (non-standard shape)'} ${url}`)
  return res
}

async function checkAreaSpecies() {
  // call with sample query params — adjust quota_id/area_id/species_id as needed
  const exampleQuery = '?quota_id=1&area_id=1&species_id=all'
  const url = buildUrl(BASE, PATHS.areaSpecies) + exampleQuery
  const res = await checkList(url)
  if (!res.ok) return res

  const sample =
    res.sample || (Array.isArray(res.res.data) && res.res.data[0]) || (res.res.data?.data && res.res.data.data[0])
  const okShape = sample && (sample.species || sample.area || sample.quantity !== undefined)
  console.log(`area-species: ${okShape ? 'OK' : 'UNEXPECTED_SHAPE'} ${url}`)
  return res
}

async function checkSpecies() {
  const url = buildUrl(BASE, PATHS.species)
  const res = await checkList(url)
  if (!res.ok) return res
  console.log(`species: OK ${url}`)
  return res
}

async function checkAreas() {
  const url = buildUrl(BASE, PATHS.areas)
  const res = await checkList(url)
  if (!res.ok) return res
  console.log(`areas: OK ${url}`)
  return res
}

async function main() {
  console.log('Using base:', BASE)
  console.log('Paths:', PATHS)
  console.log('---')

  await checkPermits()
  await checkQuotas()
  await checkAreaSpecies()
  await checkSpecies()
  await checkAreas()

  console.log('\nDone. Review warnings/ERRORs above. If shapes differ, update backend or frontend mapping.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
