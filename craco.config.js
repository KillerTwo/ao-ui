
const path = require('path');
const pathResolve = (pathUrl) => path.join(__dirname, pathUrl);
// const CracoAlias = require("craco-alias");
const CracoLessPlugin = require('craco-less');
const CracoAntDesignPlugin = require("craco-antd");

console.log('process.env: ', process.env);

module.exports = function ({
    env
}) {
  const apiBaseUrl = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : '/';

    return {
        webpack: {
            alias: {
                // "@": path.resolve(__dirname, "./src"),
                "@": pathResolve("src"),
                "@assets": pathResolve("src/assets"),
                "@components": pathResolve("src/components"),
                "@hooks": pathResolve("src/hooks"),
                "@pages": pathResolve("src/pages"),
                "@store": pathResolve("src/store"),
                "@utils": pathResolve("src/utils"),
            },
            plugins: [
                // {
                //     plugin: CracoAlias,
                //     options: {
                //         source: "tsconfig",
                //         baseUrl: "./src",
                //         tsConfigPath: "./tsconfig.json"
                //     }
                // }
            ],
            configure: {
                /* Any webpack configuration options: https://webpack.js.org/configuration */ },
            //configure: (webpackConfig, { env, paths }) => { return webpackConfig; }
        },
        devServer: {
            /* Any devServer configuration options: https://webpack.js.org/configuration/dev-server/#devserver. */
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            open: true,
            port: 5000,
            proxy: [{
              context: ['/auth', '/api'],
              target: apiBaseUrl,
              pathRewrite: {
                        '^/auth': 'auth',
                        '^/api': 'api'
                      }
            }]
        },
        // devServer: (devServerConfig, { env, paths, proxy, allowedHost }) => {
        //   console.log('devServer env: ', env);
        //   console.log('devServer proxy: ', proxy);
        //   return { ...devServerConfig, port: 5000 };
        //   },
        plugins: [
            {
                plugin: {
                    overrideCracoConfig: ({ cracoConfig, pluginOptions, context: { env, paths } }) => { return cracoConfig; },
                    overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => { return webpackConfig; },
                    overrideDevServerConfig: ({ devServerConfig, cracoConfig, pluginOptions, context: { env, paths, proxy, allowedHost } }) => { return devServerConfig; },
                    overrideJestConfig: ({ jestConfig, cracoConfig, pluginOptions, context: { env, paths, resolve, rootDir } }) => { return jestConfig },
                },
                options: {}
            },
            // {
            //         plugin: CracoAlias,
            //         options: {
            //             source: "tsconfig",
            //             baseUrl: "./src",
            //             tsConfigPath: "./tsconfig.extend.json",
            //             debug: true
            //         }
            //     },
            /* antd组件按需加载&样式覆盖等 */
    {
          plugin: CracoAntDesignPlugin,
          options: {
            customizeThemeLessPath: path.join(
              __dirname,
              "src/styles/antd.theme.less"
            ),
          },
        },
    // less
            {
                plugin: CracoLessPlugin,
                options: {
                  lessLoaderOptions: {
                    lessOptions: {
                      modifyVars: { '@primary-color': '#1DA57A' },
                      javascriptEnabled: true,
                    },
                  },
                },
              },
        ]
    };
}