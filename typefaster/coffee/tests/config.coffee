require.config
    baseUrl: '/static/scripts/src'
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

        chai: '../../bower_components/chai/chai'

        tests: '../tests'

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

    urlArgs: '_=' + (new Date().getTime())

require [
    'js_logger',
    'tests/controllers/game',
    'tests/models/player_human',
    'tests/views/item/typezone'
    ], (Logger) ->

    Logger.useDefaults()
    # Logger.setLevel(Logger.OFF)
    Logger.setLevel(Logger.DEBUG)

    if window.mochaPhantomJS
        mochaPhantomJS.run()
    else
        mocha.run()
