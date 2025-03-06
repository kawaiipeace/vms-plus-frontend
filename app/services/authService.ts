import axiosInstance from '@/app/utils/axiosInstance';
import { NextResponse } from 'next/server';

export const requestOTP = async (phone: string) => {
    try {
        const response = await axiosInstance.post('login/request-otp', { phone });
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


export async function setToken(accessToken: string) {
    try {

        if (!accessToken) {
            return NextResponse.json({ error: 'No token provided' }, { status: 400 });
        }

        // Set HTTP-only cookie with 30 days expiration
        const response = NextResponse.json({ message: 'Token stored successfully' });

        // Setting the cookie with 30 days expiration
        response.cookies.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days expiration
        });

        return response;
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


