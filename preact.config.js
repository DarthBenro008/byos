const purgeCSS = require("@fullhuman/postcss-purgecss");
const tailwindCSS = require("tailwindcss");

module.exports = (config, env, helpers) => {
  const postCssLoaders = helpers.getLoadersByName(config, "postcss-loader");
  postCssLoaders.forEach(({ loader }) => {
    const plugins = loader.options.postcssOptions.plugins;

    // Add tailwindcss to top of plugins list
    plugins.unshift(tailwindCSS);

    // Purging enabled only during production build
    if (env.production) {
      plugins.push(
        purgeCSS({
          content: [
            "./src/**/*.js",
            "./src/**/*.html",
            "./src/**/*.svg",
            "./src/**/*.jsx",
            "./src/**/*.css",
          ],
          keyframes: true,
          defaultExtractor: (content) =>
            content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
        })
      );
    }
  });

  return config;
};
