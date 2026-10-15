import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#CE3627',
          hover: '#B72E20',
          50: '#FEF1ED',
          100: '#F7D7D1',
          200: '#F0AEA4',
          300: '#E67F71',
          400: '#DE5344',
          500: '#CE3627',
          600: '#B72E20',
          700: '#8E2319',
          800: '#681A12',
          900: '#4A1512',
          light: '#FEF1ED',
          border: '#F7D7D1',
          dark: '#4A1512',
        },
        coral: '#FF7A6B',
        neutral: {
          50: '#F6F6F6',
          100: '#E2E2E2',
          200: '#D3D3D3',
          500: '#A0A0A0',
          600: '#71717A',
          900: '#000000',
        },
        semantic: {
          success: '#0E8F21',
          'success-light': '#E7F4E9',
          danger: '#FF0013',
          'danger-light': '#FFE6E7',
          warning: '#FF9500',
          'warning-light': '#FFF4E6',
          informative: '#0051FF',
          'informative-light': '#EBF1FF',
        },
      },
      fontFamily: {
        sans: ['Geist', 'var(--font-geist-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        pill: '9999px',
        card: '28px',
        'card-lg': '32px',
        dialog: '32px',
      },
      boxShadow: {
        card: '0px 2px 4px 0px rgba(39, 39, 39, 0.05)',
        hover: '0px 8px 16px 0px rgba(39, 39, 39, 0.08)',
        modal: '0px 20px 40px -15px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
