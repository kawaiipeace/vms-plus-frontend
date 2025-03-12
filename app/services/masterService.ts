import axiosInstance from '@/app/utils/axiosInstance';

export const requestDetail = async (search?: string) => {
    try {
        const response = await axiosInstance.get('mas/user-vehicle-users' + search);

        return response;

    } catch (error) {
        throw error;
    }
};