/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs');

/* Custom option to toggle console log in product */
const __SANDBOX__ = process.env.SANDBOX === 'enabled';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

 
  compiler: {
    removeConsole: __SANDBOX__
      ? false
      : {
          exclude: ['error'],
        },
  },

  /**
   * Lance DB, namespaced as vectordb's node binding (index.node) needs a plugin to be parsed by webpack when bundling.
   * You can either use that or simply ignore that file.
   *
   * @see https://github.com/lancedb/lancedb/issues/448
   *
   * @see https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config
   */
  webpack(config) {
    config.externals.push({ vectordb: 'vectordb' });
    return config;
  },
};

export default config;
