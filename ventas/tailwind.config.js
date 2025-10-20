/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      colors: {
        // Colores primarios
        primary: {
          500: '#ea2a33',
        },
        // Colores neutros
        neutral: {
          100: '#f5f5f5',
          200: '#e5e5e5',
          400: '#a3a3a3',
          500: '#737373',
          800: '#181111',
          900: '#171717',
        },
        // Colores de estado
        success: {
          500: '#22c55e',
        },
        danger: {
          500: '#ef4444',
        },
        warning: {
          500: '#f97316',
        },
        info: {
          500: '#3b82f6',
        },
        // Colores adicionales para mejor compatibilidad
        green: {
          100: '#dcfce7',
          700: '#15803d',
        },
        red: {
          100: '#fee2e2',
          700: '#b91c1c',
        },
      },

      fontFamily: {
        'public-regular': ['PublicSans-Regular', "sans-serif"],
        'public-medium': ['PublicSans-Medium', "sans-serif"],
        'public-bold': ['PublicSans-Bold', "sans-serif"],
        'public-black': ['PublicSans-Black', "sans-serif"],
        'sans': ['PublicSans-Regular', "sans-serif"], // Esto sobrescribe la fuente sans por defecto
      }

    },
  },
  plugins: [],
}