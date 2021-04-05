import commonjs from "rollup-plugin-commonjs";
import serve from "rollup-plugin-serve";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy-assets";
import livereload from "rollup-plugin-livereload";
import path from "path";
import pkg from "./package.json";

export default {
  input: ["./src/index.ts"],

  output: {
    file: pkg.main,
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
      sourceMap: true,
      ignoreGlobal: true,
    }),

    copy({
      assets: ["src/assets", "src/index.html"],
    }),

    serve({
      open: true,
      contentBase: "build",
      host: "localhost",
      port: 10005,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }),

    livereload({
      watch: path.resolve(__dirname, "build"),
      exts: ["html", "js"],
    }),
  ],
};
