import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export const basename = "/NOS-fund-scanner";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: basename,
});
