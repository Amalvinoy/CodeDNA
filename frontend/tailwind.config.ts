import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070a0f",
        foreground: "#f1f5f9",
        sidebar: {
          DEFAULT: "#090d16",
          active: "#131d2e",
          border: "#172033",
          hover: "#0f172a",
        },
        card: {
          DEFAULT: "#0b101b",
          foreground: "#f8fafc",
          border: "#162032",
          hover: "#101827",
        },
        popover: {
          DEFAULT: "#0b101b",
          foreground: "#f8fafc",
        },
        primary: {
          DEFAULT: "#38bdf8", // Sky blue from Stitch
          foreground: "#030712",
          hover: "#0ea5e9",
          glow: "rgba(56, 189, 248, 0.15)",
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#f8fafc",
        },
        muted: {
          DEFAULT: "#111827",
          foreground: "#94a3b8",
        },
        accent: {
          DEFAULT: "#172554",
          foreground: "#38bdf8",
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff",
          subtle: "rgba(239, 68, 68, 0.12)",
          border: "rgba(239, 68, 68, 0.3)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
          subtle: "rgba(245, 158, 11, 0.12)",
          border: "rgba(245, 158, 11, 0.3)",
        },
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
          subtle: "rgba(16, 185, 129, 0.12)",
          border: "rgba(16, 185, 129, 0.3)",
        },
        border: "#172235",
        input: "#162032",
        ring: "#38bdf8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: [
          "var(--font-jetbrains)",
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        "grid-dense": "linear-gradient(to right, rgba(56, 189, 248, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.04) 1px, transparent 1px)",
        "radial-glow": "radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
