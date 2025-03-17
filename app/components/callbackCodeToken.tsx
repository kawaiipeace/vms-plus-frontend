'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getKeyCloakData } from '@/app/services/authService';

export default function CallbackCodeToken() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const getKeyData = async () => {
      if (code) {
        try {
          const response = await getKeyCloakData(code);
          if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            router.push('/vehicle-booking/request-list');
          }
        } catch (error) {
          console.error('Error fetching Keycloak data:', error);
        }
      }
    };

    getKeyData();
  }, [code, router]);

  return <div></div>;
}