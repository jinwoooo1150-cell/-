const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Exclude .local and .git directories from file watching to prevent
// crashes when Replit creates/deletes temp files in these directories.
config.resolver = {
  ...config.resolver,
  blockList: [
    /[/\\]\.local([/\\]|$)/,
    /[/\\]\.git([/\\]|$)/,
  ],
};

module.exports = config;
