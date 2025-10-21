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
        // Colores del design system de clientes
        primary: "#1193d4",
        "background-light": "#f6f7f8",
        success: "#22c55e",
        error: "#ef4444",
        info: "#3b82f6",
        warning: "#eab308",
        
        // Colores adicionales para compatibilidad
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
        
        // Estados específicos para la app
        blue: {
          100: "#dbeafe",
          500: "#3b82f6",
        },
        red: {
          100: "#fee2e2",
          500: "#ef4444",
        },
        yellow: {
          100: "#fef3c7",
          600: "#d97706",
        },
        green: {
          100: "#dcfce7",
        }
      },
      fontFamily: {
        // Fuentes del design system (usando Inter como fallback)
        "display": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
        
        // Fuentes nativas si las tienes disponibles
        'public-regular': ['PublicSans-Regular', "Inter", "sans-serif"],
        'public-medium': ['PublicSans-Medium', "Inter", "sans-serif"],
        'public-bold': ['PublicSans-Bold', "Inter", "sans-serif"],
        'public-black': ['PublicSans-Black', "Inter", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        // Espaciados específicos del design system
        '14': '3.5rem', // Para inputs de altura h-14
      },
      height: {
        '14': '3.5rem', // Para inputs
      },
      boxShadow: {
        // Sombras específicas del design system
        'blue-500/20': '0 25px 50px -12px rgba(59, 130, 246, 0.2)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}