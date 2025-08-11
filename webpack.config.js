const { getDefaultConfig } = require('@nestjs/cli/lib/config/defaults');

// 获取NestJS默认Webpack配置
const defaultConfig = getDefaultConfig();

module.exports = {
  ...defaultConfig,
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve?.alias,
      '@': require('path').resolve(__dirname, 'src'),
    },
  },
};
