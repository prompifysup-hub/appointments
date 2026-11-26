import animatePlugin from "tailwindcss-animate";

import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        inter: "var(--font-sans)",
        sans: "var(--font-sans)",
      },
      fontWeight: {
        heading: "var(--heading-weight, 600)",
      },
      fontSize: {
        xxs: ["0.625rem", "1rem"],
      },
      maxWidth: {
        "8xl": "90rem",
      },
      screens: {
        xs: "460px",
        sm: "576px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
      spacing: {
        "18": "4.5rem",
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "8.5": "2.125rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "calendar-disabled-hour": "repeating-linear-gradient(-60deg, rgb(var(--border)) 0 0.5px, transparent 0.5px 8px)",
      },
      /*
       * Colours, radius and font come from CSS variables in src/theme.css ("R G B" channels).
       * shadcn names map onto the theme: secondary / popover reuse muted / card, `accent` is shadcn's
       * subtle hover (--hover), and `highlight` is the brand accent colour (--accent).
       */
      colors: {
        background: token("background"),
        foreground: token("foreground"),
        card: { DEFAULT: token("card"), foreground: token("foreground") },
        popover: { DEFAULT: token("card"), foreground: token("foreground") },
        primary: { DEFAULT: token("primary"), foreground: token("primary-foreground") },
        secondary: { DEFAULT: token("muted"), foreground: token("foreground") },
        muted: { DEFAULT: token("muted"), foreground: token("muted-foreground") },
        accent: { DEFAULT: token("hover"), foreground: token("hover-foreground") },
        highlight: { DEFAULT: token("accent"), foreground: token("accent-foreground"), strong: token("accent-strong") },
        // The brand's second colour (shadcn's own `secondary` above is the neutral button fill).
        "brand-secondary": { DEFAULT: token("secondary"), foreground: token("secondary-foreground") },
        destructive: { DEFAULT: token("destructive"), foreground: token("destructive-foreground") },
        success: token("success"),
        warning: token("warning"),
        border: token("border"),
        input: token("input"),
        ring: token("ring"),
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lg: "var(--shadow-lg)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animatePlugin],
} as const;

export default config;
