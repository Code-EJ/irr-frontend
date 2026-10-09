/**
 * Keeps build-only content patterns explicit and controlled by repository code.
 * @type {import('tailwindcss').Config}
 * @author Enzo Ribas (https://github.com/oEnzoRibas)
 */
export default {
  content: ["./index.html", "./src/**/*.js", "./src/**/*.ts", "./src/**/*.jsx", "./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [],
};
