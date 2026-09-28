import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config: the react plugin enables JSX transform + fast refresh (HMR).
export default defineConfig({ plugins: [react()] });
