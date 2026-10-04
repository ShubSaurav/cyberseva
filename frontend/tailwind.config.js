/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#071A52',
          royal: '#155EEF',
          bright: '#00AEEF',
          orange: '#FF6B00',
          golden: '#FFB000',
          bg: '#F6F8FC',
          dark: '#101828',
          muted: '#667085',
          border: '#E4E7EC',
          card: '#FFFFFF',
          success: '#12B76A',
          warning: '#F79009',
          error: '#F04438',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'clay-sm': '0 2px 4px rgba(7, 26, 82, 0.04), 0 1px 2px rgba(7, 26, 82, 0.06)',
        'clay-card': '0 10px 25px -5px rgba(7, 26, 82, 0.05), 0 8px 10px -6px rgba(7, 26, 82, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
        'clay-card-hover': '0 20px 30px -10px rgba(7, 26, 82, 0.09), 0 10px 15px -5px rgba(7, 26, 82, 0.04), inset 0 1px 2px rgba(255, 255, 255, 1)',
        'clay-btn': '0 4px 12px rgba(21, 94, 239, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        'clay-orange': '0 4px 12px rgba(255, 107, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
        'clay-inner': 'inset 0 2px 4px rgba(7, 26, 82, 0.06)',
      },
      borderRadius: {
        'clay': '18px',
        'clay-lg': '24px',
      }
    },
  },
  plugins: [],
}
