const path = require("path");
import { Configuration, RuleSetQuery } from "webpack";

const overrideWebpackConfig = ({
  webpackConfig,
  context: { env },
  pluginOptions,
}: {
  webpackConfig: Configuration;
  context: { env: string };
  pluginOptions: any;
}) => {
  const {
    getLoader,
    loaderByName,
    throwUnexpectedConfigError
  } = require("@craco/craco");

  // This is mocked in Windows tests
  const pathSep = module.exports.pathSep;

  const throwError = (message: any, githubIssueQuery: any) =>
    throwUnexpectedConfigError({
      packageName: "craco-stylus-loader",
      githubRepo: "TheSixer/craco-stylus-loader",
      message,
      githubIssueQuery
    });

  const stylusExtension = /\.styl$/;
  const stylusModuleExtension = /\.module\.styl$/;

  pluginOptions = pluginOptions || {};

  const mode = env === "development" ? "dev" : "prod";
  const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
  // Need these for production mode, which are copied from react-scripts
  const publicPath = require("react-scripts/config/paths").servedPath;
  const shouldUseRelativeAssetPaths = publicPath === "./";
  const shouldUseSourceMap =
    mode === "prod" && process.env.GENERATE_SOURCEMAP !== "false";

  const getStylusLoader = (cssOptions: RuleSetQuery) => [
    mode === "dev"
      ? require.resolve("style-loader")
      : {
          loader: require("mini-css-extract-plugin").loader,
          options: shouldUseRelativeAssetPaths ? { publicPath: "../../" } : {}
        },
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          require("postcss-preset-env")({
            autoprefixer: {
              flexbox: "no-2009"
            },
            stage: 3
          })
        ],
        sourceMap: shouldUseSourceMap
      }
    },
    {
      loader: require.resolve("stylus-loader"),
      options: {
        sourceMap: shouldUseSourceMap
      }
    }
  ];

  const loaders = webpackConfig.module?.rules.find(rule =>
    Array.isArray(rule.oneOf)
  )?.oneOf;

  if (!loaders) {
    return webpackConfig;
  }

  // Insert stylus-loader as the penultimate item of loaders (before file-loader)
  loaders.splice(
    loaders.length - 1,
    0,
    {
      test: stylusExtension,
      exclude: stylusModuleExtension,
      use: getStylusLoader({
        importLoaders: 2
      }),
      sideEffects: mode === "prod"
    },
    {
      test: stylusModuleExtension,
      use: getStylusLoader({
        importLoaders: 2,
        modules: {
          getLocalIdent: getCSSModuleLocalIdent
        }
      })
    }
  );

  const { isFound, match: fileLoaderMatch } = getLoader(
    webpackConfig,
    loaderByName("file-loader")
  );

  if (!isFound) {
    throwError(
      `Can't find file-loader in the ${env} webpack config!`,
      "webpack+file-loader"
    );
  }
  fileLoaderMatch.loader.exclude.push(stylusExtension);

  return webpackConfig;
};

// pathSep is mocked in Windows tests
module.exports = {
  overrideWebpackConfig,
  pathSep: path.sep
};
