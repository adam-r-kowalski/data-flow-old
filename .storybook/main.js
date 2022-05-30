module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: "@storybook/html",
  babel: async options => ({
    ...options,
    presets: [
      ["@babel/preset-env", { shippedProposals: true }],
      "@babel/preset-typescript",
      ["@babel/preset-react", { runtime: "automatic" }],
    ],
    plugins: ["@babel/plugin-transform-typescript", ...options.plugins],
  })
}
