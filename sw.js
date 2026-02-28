// The Table — Service Worker
// Handles push notifications and notification clicks

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('push', e => {
  try {
    const d = e.data ? e.data.json() : {};
    e.waitUntil(self.registration.showNotification(d.title || '♠ The Table', {
      body: d.body || '',
      icon: d.icon || '/icon-192.png',
      badge: d.badge || '/icon-192.png',
      data: d.url ? { url: d.url } : {}
    }));
  } catch(err) {
    e.waitUntil(self.registration.showNotification('♠ The Table', {
      body: 'New update from The Table'
    }));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      for (const c of cs) {
        if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
