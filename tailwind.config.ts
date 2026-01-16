import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obscura: {
          void: "#020205",
          deep: "#050508",
          charcoal: "#0a0a0f",
          mist: "#10101a",
          blue: "#00d4ff",
          arcane: "#0066ff",
          ghost: "#cbd5e1",
          smoke: "#94a3b8",
        },
      },
      fontFamily: {
        display: ["var(--font-unbounded)", "sans-serif"],
        body: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-fira)", "monospace"],
      },
      animation: {
        "glitch": "glitch 1s linear infinite",
        "pulse-blue": "pulseBlue 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        pulseBlue: {
          "0%, 100%": { opacity: "0.3", filter: "blur(40px)" },
          "50%": { opacity: "0.6", filter: "blur(60px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
