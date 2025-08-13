// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  // @ts-ignore
  extends: ['next/core-web-vitals'],
  rules: {
    'import/no-anonymous-default-export': 'warn',
  },
};

module.exports = config;
