// Minimal app-shell cache, hand-written.
//
// The split matters: HTML is fetched network-first, everything else
// cache-first. A cache-first document would pin a returning visitor to the
// build they first opened — the hashed asset it references is cached too, so
// no later deploy could ever reach them.
const CACHE = 'first-bite-v2'
const SHELL = ['./', './index.html']

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return

  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      // 'no-cache' forces revalidation against the server. Without it the
      // browser's own HTTP cache can hand back a stale document that points
      // at a hashed bundle the latest deploy has already replaced.
      fetch(new Request(req, { cache: 'no-cache' }))
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html')),
    )
    return
  }

  // Build output is content-hashed, so a hit is always the right bytes.
  e.respondWith(
    caches.match(req).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok && new URL(req.url).origin === self.location.origin) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(req, copy))
          }
          return res
        }),
    ),
  )
})
