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

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  compiler: {
    removeConsole: __SANDBOX__
      ? false
      : {
          exclude: ['error'],
        },
  },
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.externals = [
  //       ...config.externals,
  //       function ({ context, request }, callback) {
  //         if (request.endsWith('.node') || request.includes('@lancedb/vectordb-darwin-x64/README.md')) {
  //           return callback(null, 'commonjs ' + request);
  //         }
  //         callback();
  //       },
  //     ];
  //   }

  //   return config;
  // },

  // webpack: (config, { isServer }) => {

  //   // Only add the file-loader in the client-side bundle
  //   if (!isServer) {
  //     config.module.rules.push({
  //       test: /\.node$/,
  //       include: /node_modules[\\/]@lancedb/, // Only include .node files within the @lancedb directory
  //       use: {
  //         loader: 'file-loader',
  //         options: {
  //           publicPath: '/_next/static/files/',
  //           outputPath: 'static/files/',
  //           name: '[name].[ext]',
  //         },
  //       },
  //     });
  //   }

  //     if (isServer) {
  //       config.externals = config.externals || [];
  //       config.externals.push({
  //         '@lancedb/vectordb-darwin-x64': 'commonjs @lancedb/vectordb-darwin-x64',
  //       });
  //     }

  //     return config;
  //   },
};

export default config;
