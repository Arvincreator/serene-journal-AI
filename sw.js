const CACHE_NAME = 'ai-journal-v1';
// 列出需要被快取的核心檔案
const urlsToCache = [
  '/',
  '/index.html',
  // 注意：如果您有自己的 CSS 或 JS 檔案，也要加進來
  // '/css/style.css', 
  // '/js/app.js',
  // 注意：請將您專案用到的圖示、logo 等靜態圖片資源也加進來
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png'
];

// 事件：install
// 當 Service Worker 被安裝時觸發，快取核心檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // addAll 會一次請求所有資源並快取
        return cache.addAll(urlsToCache);
      })
  );
});

// 事件：fetch
// 當網頁發出請求時觸發，用來攔截請求並回傳快取內容
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取中有符合的資源，就直接回傳快取的版本
        if (response) {
          return response;
        }
        // 如果快取中沒有，就正常發出網路請求
        return fetch(event.request);
      })
  );
});

// 事件：activate
// 用來清理舊版本的快取
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
