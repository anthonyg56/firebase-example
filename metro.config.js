const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname, { isCSSEnabled: true });

defaultConfig.resolver.sourceExts.push('cjs');

// Importing with native wind allows us to read the global.css file
module.exports = withNativeWind(defaultConfig, { input: './global.css' });
