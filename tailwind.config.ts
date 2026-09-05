import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: "#3dff9a",
        ink: "#e8f0ea",
        muted: "#8fa396",
        line: "#24302a",
        card: "#15201b",
      },
    },
  },
  plugins: [],
} satisfies Config;
