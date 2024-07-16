import { type StorybookConfig } from '@storybook/react-webpack5'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-styling-webpack',
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          postcssOptions: {
            plugins: [require.resolve('tailwindcss')],
          },
          implementation: require('postcss'),
        },
      },
    },
  ],
  framework: '@storybook/react-webpack5',
  webpackFinal: async (config) => {
    config.resolve!.plugins = [...(config.resolve?.plugins || []), new TsconfigPathsPlugin()]

    return config
  },
}
export default config
