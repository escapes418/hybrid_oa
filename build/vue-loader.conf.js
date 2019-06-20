'use strict';
const utils = require('./utils');
const config = require('../config');
const isProduction =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'testing';
const sourceMapEnabled = isProduction
    ? config.build.productionSourceMap
    : config.dev.cssSourceMap;
const cssnext = require('postcss-cssnext');

module.exports = {
    // postcss: [cssnext()],
    loaders: {
        sourceMap: sourceMapEnabled,
        extract: isProduction
    },
    cssSourceMap: sourceMapEnabled,
    cacheBusting: config.dev.cacheBusting,
    transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
    }
    // usePostcss: true
};
