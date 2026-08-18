import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

export default defineConfig({
  plugins: [
    federation({
      name: "cart",
      filename: "remoteEntry.js",
      exposes: {
        "./Cart": "./src/App.tsx",
      },
      shared: {
        react: {
          singleton: true, // only one react instance in the browser
          requiredVersion: "^19.2.8",
        },
        "react/": {
          singleton: true, // subpaths imports like -> 'react/jsx-rumtime
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.2.8",
        },
      },
      dts: false,
    }),
    react(),
  ],

  base: "http://localhost:3002/",

  server: {
    port: 3002,

    strictPort: true,

    origin: "http://localhost:3002",
  },

  build: {
    target: "chrome89",
  },
});
