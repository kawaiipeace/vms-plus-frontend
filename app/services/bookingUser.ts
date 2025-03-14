
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

export const fetchVehicles = async (params: {
    search?: string;
    vehicle_owner_dept?: string;
    car_type?: string;
    category_code?: string;
    page?: number;
    limit?: number;
  }) => {
    try {
      const response = await axiosInstance.get('vehicle/search', { params });
      return response;
    } catch (error) {
      throw error;
    }
  };

  export const fetchVehicleDetail = async (id:string) => {
    try {
      const response = await axiosInstance.get('vehicle/'+id);
      return response;
    } catch (error) {
      throw error;
    }
  };