import type { Config } from "tailwindcss";
import daisyUI from "daisyui";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          default: '#CF07AA',
          grayBorder: '#D0D5DD',
          grayText: '#98A2B3',

      },
      surface: {
        "secondary-subtle" : "#F9FAFB",
      },
      color: {
        primary: '#000000',
        secondary: '#475467'
      },
      secondary:{
        border: '#EAECFO,'
      },
        brand: {
          25: '#FFFAFE',
          50: '#FFF5FD',
          100: '#FEEBFB',
          200: '#FED8F6',
          300: '#FDBAF0',
          400: '#FB8EE7',
          500: '#FA6BDF',
          600: '#F835D3',
          700: '#F712CC',
          800: '#CF07AA',
          900: '#A80689',
          950: '#74045F'
        },
        grayDarkMode:{
        '25': '#FAFAFA',
        '50': '#F5F5F6',
        '100': '#F0F1F1',
        '200': '#ECECED',
        '300': '#CECFD2',
        '400': '#94969C',
        '500': '#85888E',
        '600': '#61646C',
        '700': '#333741',
        '800': '#1F242F',
        '900': '#161B26',
        '950': '#0C111D',
        },
        soft:{
          info: "bg-blue-100 text-blue-600 border-blue-300 hover:bg-blue-200",
          success: "bg-green-100 text-green-600 border-green-300 hover:bg-green-200",
          error: "bg-red-100 text-red-600 border-red-300 hover:bg-red-200",
          warning: "bg-yellow-100 text-yellow-600 border-yellow-300 hover:bg-yellow-200",
          default: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
        }
      },
      boxShadow: {
        customPurple: "0px 0px 0px 4px rgba(168, 6, 137, 0.12)", 
        customGray: "0px 0px 0px 4px #ECECED"
      },
      strokeDashOffset: {
        '1': '75px',
        '2': '50px',
        '3': '25px',
        '4': '0px',
    }
    },
  },
  plugins: [daisyUI],
} satisfies Config;
