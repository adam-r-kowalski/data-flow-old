export default null

declare var self: ServiceWorkerGlobalScope

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open("data-flow").then((cache) => cache.addAll([])))
})

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response
            } else {
                return fetch(event.request)
            }
        })
    )
})
