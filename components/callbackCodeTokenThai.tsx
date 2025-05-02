'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getThaiIdData } from '@/services/authService';

export default function CallbackCodeTokenThai() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    const getKeyData = async () => {
      if (code) {
        try {
          const response = await getThaiIdData(code);
          if (response.status === 200) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            router.push('/vehicle-booking/request-list');
          }
        } catch (error) {
          console.error('Error fetching thai id data:', error);
        }
      }
    };

    getKeyData();
  }, [code, router]);

  return <div></div>;
}

