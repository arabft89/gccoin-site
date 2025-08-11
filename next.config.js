/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@lib"] = require("path").resolve(__dirname, "lib");
    return config;
  },
};

module.exports = nextConfig;
