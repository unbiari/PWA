const CACHE_NAME = 'pwa-demo-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const isApiRequest = request.url.includes('/api/') || request.url.includes('/auth/');

  if (isApiRequest) {
    // API 요청: 네트워크 우선, 실패 시 캐시
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  } else {
    // 정적 파일: 캐시 우선
    event.respondWith(
      caches.match(request).then(response => {
        return (
          response || fetch(request).then(fetchRes => {
            // 새로 받은 정적 파일도 캐시에 저장
            if (request.method === 'GET' && fetchRes.status === 200) {
              const fetchResClone = fetchRes.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, fetchResClone);
              });
            }
            return fetchRes;
          })
        );
      })
    );
  }
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'PWA 푸시 알림';
  const options = {
    body: data.body || '알림 내용이 없습니다.',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'demo-sync') {
    event.waitUntil(
      (async () => {
        // 실제 동기화 작업(예: 서버로 데이터 전송 등) 구현 가능
        console.log('백그라운드 동기화 실행됨: demo-sync');
      })()
    );
  }
}); 