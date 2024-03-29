// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: 'typefaster/static',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['requirejs', 'mocha', 'chai', 'sinon'],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'bower_components/**/*.js', included: false },
            { pattern: 'scripts/src/**/*.js', included: false },
            { pattern: 'scripts/tests/spec/**/*.js', included: false },

            'scripts/tests/test-main.js'
        ],

        // list of files / patterns to exclude
        exclude: [],

        // web server port
        port: 8080,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS', 'Chrome', 'Firefox', 'Opera', 'Safari', 'ChromeCanary'],


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
