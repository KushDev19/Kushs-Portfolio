import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        deepBlue: '#0a192f',
        cyan: '#64ffda',
        orange: '#ff6b35',
        slate: '#8892b0',
        almostBlack: '#020c1b',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        display: ['Miguer Sans', 'system-ui', 'sans-serif'], // MVP headings (name, main titles) - MiguerSans-Regular from CDN
      },
    },
  },
  plugins: [],
};
export default config;
