import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

//fixe port so remotes always know where ur host or shell lives
export default defineConfig({
  plugins: [
    federation({
      name: "host",
      remotes: {
        products: {
          type: "module",
          name: "products",
          entry: "http://localhost:3001/remoteEntry.js",
          entryGlobalName: "products",
          shareScope: "default",
        },
        cart: {
          type: "module",
          name: "cart",
          entry: "http://localhost:3002/remoteEntry.js",
          entryGlobalName: "cart",
          shareScope: "default",
        },
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

  server: {
    port: 3000, // keep this stable

    // if 3000 is busy, fail instead of jumping to 3001/3002
    strictPort: true,

    origin: "http://localhost:3000",
  },

  build: {
    target: "chrome89",
  },
});
