import {nextui} from '@nextui-org/theme';
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#d9d9d9",
        secondary: "#f4f4f5"
      },
      boxShadow: {
        "outer-shadow": "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      },
      borderWidth: {
        3: '3px',
      },
      borderStyle: {
        dashed: 'dashed',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
export default config;
