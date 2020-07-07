import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import css from "rollup-plugin-css-only";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";

const shared = {
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript(),
    css({ output: "dist/styles.css" }),
  ],
}

export default [{
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
      format: "iife",
      name: "PWD"
    },
    {
      file: pkg.umd.replace(".js", ".min.js"),
      format: "iife",
      name: "PWD",
      plugins: [terser()],
    },
  ],
  ...shared
},{
  input: "src/react.ts",
  output: [
    {
      file: pkg.mainReact,
      format: "cjs",
      exports: "named",
    },
  ],
  ...shared
}];

