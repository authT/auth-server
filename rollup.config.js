const commonjs = require("@rollup/plugin-commonjs");
const { terser } = require("rollup-plugin-terser");
const json = require("@rollup/plugin-json");
module.exports = {
  input: "./index.js",
  output: {
    format: "cjs",
    file: "dist/index.js",
  },
  plugins: [commonjs(), terser(), json()],
};
