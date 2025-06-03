'use client';

import { store } from '@/lib/store';
import { useEffect } from 'react';
import { Provider } from 'react-redux';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope',
            registration.scope,
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed', error);
        });
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
