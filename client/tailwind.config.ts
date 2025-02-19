import type { Config } from "tailwindcss";

export default {
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
        "alice-blue": "#EBF3FF",
        "uranian-blue": "#C1DAFF",
        "night-color": "#0A0C0E",
        foreground: "var(--foreground)",
        "jordy-blue": "#85B6FF",
        "brandeis-blue": "#0A6CFF",
        "marian-blue": "#00398F",
        "rich-black": "#000814",
        "platinum-gray": "#E7E7E7",
        'black-50': 'rgba(0, 0, 0, 0.1)',
        "Anti-flash-white": "#F0F0F0",
        "safety-orange": "#FA7601",
        // dark theme  (d-)
        "d-cadet-gray": "#A6ADBB",
        "d-rich-black": "#15191E",
        "d-charcoal": "#35404A",
        "d-gunmetal": "#232830 ",
      },
      borderRadius: {
        "basic-round": "15px",
        "more-rounded": "25px"
      }
    },
  },
  plugins: [],
} satisfies Config;
