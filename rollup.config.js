import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  context: "window",
  input: "dist/prebuild/index.js",
  output: {
    file: "dist/gtm-bundle.js",
    format: "cjs",
  },
  plugins: [
    nodeResolve({
      extensions: [".ts", ".js", ".cjs"],
    }),
  ],
};
