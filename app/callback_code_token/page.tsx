"use client";
import { useSearchParams, useRouter } from 'next/navigation'
import { getKeyCloakData } from '@/app/services/authService';

export default function CallbackCodeToken(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');

    if(code){
        const getKeyData = async () => {
              try {
                const response = await getKeyCloakData(code);
                if (response.status === 200) {
                  console.log('res',response);
                  router.push('/vehicle-booking/request-list');
                }
              } catch (error) {
                console.log(error);
              }
            };
            getKeyData();
    }

  
  
    return(
        <>
        </>
    );
}