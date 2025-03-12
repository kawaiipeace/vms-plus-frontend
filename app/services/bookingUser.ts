
import axiosInstance from '@/app/utils/axiosInstance';

export const requests = async () => {
    try {
        const response = await axiosInstance.get('booking-user/requests');

        return response;

    } catch (error) {
        throw error;
    }
};

export const requestDetail = async (id: string) => {
    try {
        const response = await axiosInstance.get('booking-user/request/'+ id);

        return response;

    } catch (error) {
        throw error;
    }
};

export const createRequest = async (data:[]) => {
    try {
        const response = await axiosInstance.post('booking-user/create-request/', {
            body: {data},
        });

        return response;

    } catch (error) {
        throw error;
    }
}