const y = async (r, s = 'price-list-report.pdf') => {
  if (!r) {
    console.warn('downloadPdf: no data provided')
    return
  }
  try {
    if (typeof r == 'string' && /^https?:\/\//i.test(r)) {
      const e = await fetch(r)
      if (!e.ok)
        throw (
          (console.error(`Failed to fetch PDF from URL (status ${e.status})`),
          new Error(
            `Failed to fetch PDF from URL (status ${e.status}). The PDF may not be generated yet or the server encountered an error.`,
          ))
        )
      const n = await e.blob(),
        t = URL.createObjectURL(n),
        o = document.createElement('a')
      ;(o.href = t), (o.download = s), document.body.appendChild(o), o.click(), o.remove(), URL.revokeObjectURL(t)
      return
    }
    const d = (r || '').replace(/^data:application\/pdf;base64,/, '')
    let c = null
    try {
      c = atob(d)
    } catch {
      c = null
    }
    if (c && (c.includes('<!DOCTYPE') || c.includes('<html'))) {
      const e = new Blob([c], { type: 'text/html' }),
        n = URL.createObjectURL(e),
        t = document.createElement('a')
      ;(t.href = n),
        (t.download = s.replace(/\.pdf$/i, '.html')),
        document.body.appendChild(t),
        t.click(),
        t.remove(),
        URL.revokeObjectURL(n)
      return
    }
    const i = d,
      b = 1024,
      p = []
    for (let e = 0; e < i.length; e += b) {
      const n = i.slice(e, e + b),
        t = atob(n),
        o = new Array(t.length)
      for (let l = 0; l < t.length; l++) o[l] = t.charCodeAt(l)
      const u = new Uint8Array(o)
      p.push(u)
    }
    const f = new Blob(p, { type: 'application/pdf' }),
      h = URL.createObjectURL(f),
      a = document.createElement('a')
    ;(a.href = h), (a.download = s), document.body.appendChild(a), a.click(), a.remove(), URL.revokeObjectURL(h)
  } catch (d) {
    console.error('downloadPdf error:', d)
  }
}
export { y as d }
//# sourceMappingURL=pdfDownloader-Cg_wDO9M.js.map
