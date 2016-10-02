module.exports = {
    mocha:true,
    watch: true,
    ddp: 'http://localhost:3000',
    path: './imports/ui/**/**/tests/',
    mochaTags: '@watch',
    mochaTimeout: 60000,
    mochaReporter: 'spec',
    mochaSlow: 10000,
    browser: 'phantomjs'
};