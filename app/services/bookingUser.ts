
import axiosInstance from '@/app/utils/axiosInstance';
import Cookies from 'js-cookie'; 

const token = Cookies.get('accessToken')
console.log('token',token);

export const requests = async () => {
    try {
        const response = await axiosInstance.get('booking-user/requests', {
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};