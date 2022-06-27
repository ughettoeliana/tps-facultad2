const cacheName = 'Peliz.com';

const assets = ['./',
                './index.html',
                './js/main.js',
                './styles.css',
                './detail.html',
                './assets/banner-phochoclos.jpg',
                './assets/no-wifi.png',
                './assets/portada-pelicula.jpeg',
                './assets/pochoclos-img.jpeg'
                ];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                cache.addAll(assets);
            })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches
            .match(event.request)
            .then(res => {
                if (res) {
                    return res;
                }
                let requestToCache = event.request.clone();
                return fetch(requestToCache)
                .then(res => {
                    if (!res || res.status !== 200) {
                        return res;
                    }
                    let responseToCache = res.clone();
                    caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(requestToCache, responseToCache)
                    })
                    return res;
                })
            })
    )
})


self.addEventListener('push', function(pushEvent) {
    let title = pushEvent.data.text();
    let options = {
        body: 'Pelicula en estreno esta semana',
        icon: './assets/portada-pelicula.jpeg',
        vibrate: [300,100,300],
        data: {id:1},
        actions: [
            {'action' : '1', 'title': 'Ver ahora', 'icon': './assets/portada-pelicula.jpeg'},
            {'action' : '2', 'title': 'Ver más tarde', 'icon': './assets/portada-pelicula.jpeg'}
        ]
    }
    pushEvent.waitUntil(self.registration.showNotification(title,options));
})

self.addEventListener('notificationclick', function(notificationEvent){
    if(notificationEvent.action === '1'){
        clients.openWindow('http://localhost/pwa-parcial-2-dwt3ah-ughetto-eliana/detail.html')
    } else if(notificationEvent.action === '2'){
        console.log('El usuario clickeo en "Ver más tarde"')
    }
    notificationEvent.notification.close();
})
