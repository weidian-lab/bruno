module.exports = {
  eslint: {
    ignoreDuringBuilds: true
  },
  reactStrictMode: false,
  publicRuntimeConfig: {
    CI: process.env.CI,
    PLAYWRIGHT: process.env.PLAYWRIGHT,
    ENV: process.env.ENV
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  }
};
