const CACHE_NAME = 'ai-journal-v2'; // 更新版本號以觸發更新
// 列出需要被快取的核心檔案
const urlsToCache = [
  '/',
  '/index.html'
  // 注意：我們不再快取外部的圖示 URL，以避免複雜的跨域快取問題。
  // 瀏覽器會用標準的 HTTP 快取來處理它們。
];

// 事件：install
// 當 Service Worker 被安裝時觸發，快取核心檔案
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
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
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
