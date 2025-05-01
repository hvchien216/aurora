import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: {
    index: "src/index.ts",
    "icons/index": "src/icons/index.ts",
  },

  format: ["esm"],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  dts: true,
  minify: true,
  external: ["react", "react-dom", "react-hook-form"],
  ...options,
}));
