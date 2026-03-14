/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF5200',
                    dark: '#E64A00',
                    light: '#FF7533',
                },
                secondary: {
                    DEFAULT: '#2B2B2B',
                    light: '#404040',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
            animation: {
                'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
            },
            keyframes: {
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'shake': {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
