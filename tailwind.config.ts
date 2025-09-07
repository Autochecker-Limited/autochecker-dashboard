import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    content: [
        "./app/**/*.{ts,tsx,mdx}",
        "./components/**/*.{ts,tsx,mdx}",
        "./pages/**/*.{ts,tsx,mdx}",
    ],
    theme: { extend: {} },
    plugins: [],
} satisfies Config;

