/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          a0: "var(--clr-primary-a0)",
          a10: "var(--clr-primary-a10)",
          a20: "var(--clr-primary-a20)",
          a30: "var(--clr-primary-a30)",
          a40: "var(--clr-primary-a40)",
          a50: "var(--clr-primary-a50)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
          a0: "var(--clr-danger-a0)",
          a10: "var(--clr-danger-a10)",
          a20: "var(--clr-danger-a20)",
          a30: "var(--clr-danger-a30)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          a0: "var(--clr-accent-a0)",
          a10: "var(--clr-accent-a10)",
          a20: "var(--clr-accent-a20)",
          a30: "var(--clr-accent-a30)",
          a40: "var(--clr-accent-a40)",
          a50: "var(--clr-accent-a50)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        success: {
          a0: "var(--clr-success-a0)",
          a10: "var(--clr-success-a10)",
          a20: "var(--clr-success-a20)",
          a30: "var(--clr-success-a30)",
        },
        warning: {
          a0: "var(--clr-warning-a0)",
          a10: "var(--clr-warning-a10)",
          a20: "var(--clr-warning-a20)",
          a30: "var(--clr-warning-a30)",
        },
        info: {
          a0: "var(--clr-info-a0)",
          a10: "var(--clr-info-a10)",
          a20: "var(--clr-info-a20)",
          a30: "var(--clr-info-a30)",
        },
        neutral: {
          a0: "var(--clr-neutral-a0)",
          a10: "var(--clr-neutral-a10)",
          a20: "var(--clr-neutral-a20)",
          a30: "var(--clr-neutral-a30)",
          a40: "var(--clr-neutral-a40)",
          a50: "var(--clr-neutral-a50)",
        },
        white: "#ffffff",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}