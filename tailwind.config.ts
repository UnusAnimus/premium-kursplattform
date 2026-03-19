import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          base: 'var(--bg-base)',
          DEFAULT: 'var(--bg-surface)',
          raised: 'var(--bg-surface-raised)',
          hover: 'var(--bg-surface-hover)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        'border-base': 'var(--border-base)',
        'border-strong': 'var(--border-strong)',
        brand: 'var(--primary)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
};
export default config;
