import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/web-inspector.esm.js",
      format: "esm",
    },
    {
      file: "dist/web-inspector.umd.js",
      format: "umd",
      name: "HTMLInspector",
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    terser() // ← OK
  ]
};
