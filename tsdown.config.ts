import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["lib/index.ts"],
  outDir: "dist",
  platform: "neutral",
  dts: true,
});
