import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
    },
    {
      file: pkg.module,
      format: "es",
    },
    {
      file: pkg.umd,
      format: "umd",
      name: "PWD",
    },
    {
      file: pkg.umd.replace(".js", ".min.js"),
      format: "umd",
      name: "PWD",
      plugins: [terser()],
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript(),
    css({ output: "dist/styles.css" }),
  ],
};
