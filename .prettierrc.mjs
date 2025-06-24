/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  printWidth: 9999,
  htmlWhitespaceSensitivity: "strict",
  proseWrap: "preserve",
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "none",
  bracketSpacing: true,

  astroAllowShorthand: false,
};



// ORIG CODE
// /** @type {import("prettier").Config} */
// export default {
//   plugins: ["prettier-plugin-astro"],
// };