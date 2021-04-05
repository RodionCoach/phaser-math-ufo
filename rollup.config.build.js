import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy-assets";
import pkg from "./package.json";

export default {
  input: ["./src/index.ts"],

  output: {
    file: pkg.main,
    name: "math-ufo",
    format: "es",
    sourcemap: false,
    intro: "var global = window;",
  },

  plugins: [
    typescript(),

    resolve({
      extensions: [".js", ".ts", ".tsx"],
    }),

    commonjs({
      include: ["node_modules/eventemitter3/**", "node_modules/phaser/**", "node_modules/**"],
      sourceMap: false,
      ignoreGlobal: true,
    }),

    terser(),

    copy({
      assets: ["src/assets", "src/index.html"],
    }),
  ],
};
