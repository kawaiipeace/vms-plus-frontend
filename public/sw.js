self.addEventListener('push', function (event) {
    if (event.data) {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || '/assets/img/favicon.png',
        badge: '/assets/img/favicon.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
        },
      };
      event.waitUntil(self.registration.showNotification(data.title, options));
    }
  });
  
  self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.');
    event.notification.close();
    // Dynamically get the client value from env.config.js
    const clientUrl = window.__ENV__.NEXT_PUBLIC_CLIENT || 'http://pntdev.ddns.net:28080';
    event.waitUntil(clients.openWindow(clientUrl));
  });