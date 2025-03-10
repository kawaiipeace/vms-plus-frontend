
import axiosInstance from '@/app/utils/axiosInstance';

const token = typeof window !== "undefined" && localStorage?.getItem("accessToken");

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

export const requestDetail = async (id: string) => {
    try {
        const response = await axiosInstance.get('booking-user/request/'+ id, {
            headers:{
                'Authorization': `Bearer ${token}`,
            }
        });

        return response;

    } catch (error) {
        throw error;
    }
};