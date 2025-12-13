const n = (e = 0) => new Promise((t) => setTimeout(t, e)),
  s = {
    email: (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) || 'Please enter a valid email address',
    required: (e) => !!e || 'This field is required',
    tell: (e) =>
      /^\+(\d{1,3})\s?(\d{1,4})?[\s.-]?(\d{1,4})[\s.-]?(\d{1,9})$/.test(e) ||
      'Please enter a valid international phone number',
  },
  a = (e) => {
    const t = new Date(e)
    if (isNaN(t.getTime())) return 'Error parsing date'
    const r = { year: 'numeric', month: 'long', day: 'numeric' }
    return t.toLocaleDateString('en-US', r)
  }
export { a as f, n as s, s as v }
//# sourceMappingURL=utils-BWc0LXoO.js.map
