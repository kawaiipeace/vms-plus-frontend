import axiosInstance from '@/utils/axiosInstance';

export const requestOTP = async (phone: string) => {
    try {
        const response = await axiosInstance.post('login/request-otp', { phone });
        return response;
    } catch (error) {
        throw error;
    }
};

export const requestThaiID = async () => {
    try {
        const response = await axiosInstance.post('login/request-thaiid', {
            redirect_uri: `${window.location.origin}/callback_code_token`,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const requestkeyCloak = async () => {
    try {
        const response = await axiosInstance.post('login/request-keycloak', {
            redirect_uri: `${window.location.origin}/callback_code_token`,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getKeyCloakData = async (code: string) => {
    try {
        const response = await axiosInstance.post('login/authen-keycloak', {
            code,
            redirect_uri: `${window.location.origin}/callback_code_token`,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const getThaiIdData = async (code: string) => {
    try {
        const response = await axiosInstance.post('login/authen-thaiid', {
            code,
            redirect_uri: `${window.location.origin}/callback_code_token_thai`,
        });
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

export const fetchProfile = async () => {
    try {
        const response = await axiosInstance.get('/login/profile');

        return response;

    } catch (error) {
        throw error;
    }
};

export const logOut = async () => {
    try {
        const response = await axiosInstance.get('logout');

        return response;

    } catch (error) {
        throw error;
    }
};



