/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    dirs: ['pages', 'src', 'library'],
  },
  webpack: (config, options) => {

    config.resolve.alias = {
      ...config.resolve?.alias,
      /**
       * Prevent using effector .mjs extension in "web" version of bundle
       * Otherwise, we can face different bugs when using effector
       */

      'effector-react/ssr': path.resolve('./node_modules/effector-react/effector-react.cjs.js'),
      'effector-react/scope': path.resolve(
        './node_modules/effector-react/effector-react.cjs.js',
      ),
      '^effector/effector.mjs$': './node_modules/effector/effector.cjs.js',
      '^effector/fork.mjs$': './node_modules/effector/effector.cjs.js',
      '^effector/fork.js$': './node_modules/effector/effector.cjs.js',
      '^effector/fork$': './node_modules/effector/effector.cjs.js',
      'effector-react': path.resolve('./node_modules/effector-react/effector-react.cjs.js'),
      '^effector$': './node_modules/effector/effector.cjs.js',
      effector: path.resolve('./node_modules/effector/effector.cjs.js'),

      // '^effector-react/effector-react.mjs$':
      //   './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react/ssr.mjs$': './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react/ssr.js$': './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react/ssr$': './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react/scope.mjs$': './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react/scope.js$': './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react/scope$': './node_modules/effector-react/effector-react.cjs.js',
      // '^effector-react$': './node_modules/effector-react/effector-react.cjs.js',
    };

    return config;
  },
}

module.exports = nextConfig
