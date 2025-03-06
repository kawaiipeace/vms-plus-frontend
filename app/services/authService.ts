import axiosInstance from '@/app/utils/axiosInstance';

const redirect_uri = "http://localhost/callback_code_token"

export const requestOTP = async (phone: string) => {
    try {
        const response = await axiosInstance.post('login/request-otp', { phone });
        return response;
    } catch (error) {
        throw error;
    }
};

export const requestThaiID = async () => {

    const redirect_uri = "http://localhost/callback_code_token"

    try {
        const response = await axiosInstance.post('login/request-thaiid', { redirect_uri });
        return response;
    } catch (error) {
        throw error;
    }
};

export const requestkeyCloak = async () => {

    try {
        const response = await axiosInstance.post('login/request-keycloak', { redirect_uri });
        return response;
    } catch (error) {
        throw error;
    }
};


export const verifyOTP = async ({ otp, otpId }: { otp: string; otpId: string }) => {
    try {
        const response = await axiosInstance.post('login/verify-otp', { otp, otpId });
        return response;
    } catch (error) {
        throw error;
    }
};



