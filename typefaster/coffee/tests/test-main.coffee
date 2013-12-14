tests = []
for file of window.__karma__.files
    if /scripts\/tests\/spec\//.test(file)
        if window.__karma__.files.hasOwnProperty(file)
            tests.push file

requirejs.config
    # Karma serves files from '/base'
    baseUrl: '/base/scripts/src'

    paths:
        jquery: '../../bower_components/jquery/jquery.min'
        backbone: '../../bower_components/backbone/backbone-min'
        underscore: '../../bower_components/lodash/dist/lodash.min'
        marionette: '../../bower_components/marionette/lib/backbone.marionette.min'
        jed: '../../bower_components/jed/jed'
        bootstrap: '../../bower_components/sass-bootstrap/dist/js/bootstrap.min'
        highcharts: '../../bower_components/highcharts.com/js/highcharts.src'
        punycode: '../../bower_components/punycode/punycode.min'
        string_at: '../../bower_components/String.prototype.at/at'
        string_fromcodepoint: '../../bower_components/String.fromCodePoint/fromcodepoint'
        js_logger: '../../bower_components/js-logger/src/logger.min'

    shim:
        backbone:
            deps: ['jquery', 'underscore']
            exports: 'Backbone'
        underscore:
            exports: '_'
        marionette:
            deps: ['jquery', 'underscore', 'backbone']
            exports: 'Marionette'
        bootstrap:
            deps: ['jquery']

    # Ask Require.js to load these files (all our tests)
    deps: tests

    #Start test run, once Require.js is done
    callback: window.__karma__.start
