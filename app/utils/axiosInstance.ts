import axios from 'axios';

// Type assertion to avoid TypeScript errors
const getApiConfig = () => {
  if (typeof window !== 'undefined') {
    const env = window as unknown as { __ENV__?: { NEXT_PUBLIC_CLIENT_API_HOST: string; NEXT_PUBLIC_API_KEY: string } };

    if (env.__ENV__) {
      return {
        baseURL: env.__ENV__.NEXT_PUBLIC_CLIENT_API_HOST,
        apiKey: env.__ENV__.NEXT_PUBLIC_API_KEY,
      };
    }
  }
  
  return {
    baseURL: 'http://pntdev.ddns.net:28080/api',
    apiKey: '2c5SF8BDhWKzdTY5MIFXEh9PummQMhK8w2TIUobJnYbAxaUmYo1sYTc2Hwo3xNWj',
  };
};

const { baseURL, apiKey } = getApiConfig();

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'accept': 'application/json',
    'X-ApiKey': apiKey,
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
