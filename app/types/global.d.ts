declare global {
    interface Window {
        __ENV__: {
            NEXT_PUBLIC_CLIENT_API_HOST: string;
            NEXT_PUBLIC_API_KEY: string;
            NEXT_PUBLIC_CLIENT_CALLBACK: string;
            NEXT_PUBLIC_PUSH_EMAIL: string;
            NEXT_PUBLIC_CLIENT: string;
            NEXT_PUBLIC_VAPID_PUBLIC_KEY: string;
            VAPID_PRIVATE_KEY: string;
        };
    }
}

export {};