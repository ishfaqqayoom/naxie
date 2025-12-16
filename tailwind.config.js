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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cognax specific colors
        // Cognax specific colors
        'primary-blue': {
          DEFAULT: 'hsl(var(--primary-blue))',
          foreground: 'hsl(var(--primary-blue-foreground))',
          50: 'hsl(var(--primary-blue--50))',
          60: 'hsl(var(--primary-blue--60))',
          70: 'hsl(var(--primary-blue--70))',
          80: 'hsl(var(--primary-blue--80))',
          90: 'hsl(var(--primary-blue--90))',
          100: 'hsl(var(--primary-blue--100))'
        },
        'neon-orange': {
          DEFAULT: 'hsl(var(--neon-orange))',
          foreground: 'hsl(var(--neon-orange-foreground))',
          50: 'hsl(var(--neon-orange--50))',
          60: 'hsl(var(--neon-orange--60))',
          70: 'hsl(var(--neon-orange--70))',
          80: 'hsl(var(--neon-orange--80))',
          90: 'hsl(var(--neon-orange--90))',
          100: 'hsl(var(--neon-orange--100))'
        },
        'plum-pink': {
          DEFAULT: 'hsl(var(--plum-pink))',
          foreground: 'hsl(var(--plum-pink-foreground))',
          50: 'hsl(var(--plum-pink--50))',
          60: 'hsl(var(--plum-pink--60))',
          70: 'hsl(var(--plum-pink--70))',
          80: 'hsl(var(--plum-pink--80))',
          90: 'hsl(var(--plum-pink--90))',
          100: 'hsl(var(--plum-pink--100))'
        },
        iris: {
          DEFAULT: 'hsl(var(--iris))',
          foreground: 'hsl(var(--iris-foreground))',
          60: 'hsl(var(--iris--60))',
          80: 'hsl(var(--iris--80))',
          100: 'hsl(var(--iris--100))'
        },
        charcoal: {
          DEFAULT: 'hsl(var(--charcoal))',
          foreground: 'hsl(var(--charcoal-foreground))'
        },
        black: {
          DEFAULT: 'hsl(var(--black))',
          foreground: 'hsl(var(--black-foreground))'
        },
        'card-background': {
          DEFAULT: 'hsl(var(--card-background))'
        },
        'card-background2': {
          DEFAULT: 'hsl(var(--card-background2))'
        },
        purple: {
          DEFAULT: 'hsl(var(--purple))',
          foreground: 'hsl(var(--purple-foreground))'
        },
        'background-light': 'hsl(var(--background-light))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-poppins)'],
        syneBold: ['var(--font-syne-bold)'],
        syneExtraBold: ['var(--font-syne-extra-bold)'],
        syneMedium: ['var(--font-syne-medium)'],
        syneRegular: ['var(--font-syne-regular)'],
        syneSemiBold: ['var(--font-syne-semi-bold)'],
        spaceGroteskBold: ['var(--font-space-grotesk-bold)'],
        spaceGroteskLight: ['var(--font-space-grotesk-light)'],
        spaceGroteskMedium: ['var(--font-space-grotesk-medium)'],
        spaceGroteskRegular: ['var(--font-space-grotesk-regular)'],
        spaceGroteskSemiBold: ['var(--font-space-grotesk-semi-bold)']
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
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
}
