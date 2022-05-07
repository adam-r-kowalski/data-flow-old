module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  framework: "@storybook/html",
  babel: async options => ({
    ...options,
    plugins: options.plugins.filter(x => !(typeof x === 'string' && x.includes('plugin-transform-classes'))),
  })
}
