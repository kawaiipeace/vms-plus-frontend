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
