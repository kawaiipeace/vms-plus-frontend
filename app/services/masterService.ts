import axiosInstance from '@/app/utils/axiosInstance';

export const fetchVehicleUsers = async (search?: string) => {
    try {
        const response = await axiosInstance.get('mas/user-vehicle-users' + search);

        return response;

    } catch (error) {
        throw error;
    }
};

export const fetchCostTypes = async () => {
    try {
        const response = await axiosInstance.get('ref/cost-type');

        return response;

    } catch (error) {
        throw error;
    }
};