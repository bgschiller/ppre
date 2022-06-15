const webpack = require("webpack");
const path = require("path");

module.exports = {
  stories: ["../app/**/*.stories.mdx", "../app/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/react",
  webpackFinal: async (config, { configType }) => {
    // Resolve absolute path alias
    config.resolve.alias = {
      "~": path.resolve(__dirname, "../app"),
    };
    // Replace node parts of remix with an empty mock so that webpack builds (otherwise it will fail looking for `fs` and other node modules)
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /\/@remix-run\/node/,
        require.resolve("./@remix-run/node.mock.js")
      )
    );
    return config;
  },
};
