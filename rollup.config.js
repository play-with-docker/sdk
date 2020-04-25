import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from "rollup-plugin-css-only";

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
      name:"PWD"
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    typescript({
      allowSyntheticDefaultImports: true
      
    }),
    css({ output: "dist/bundle.css" }),
  ],
};
