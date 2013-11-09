require.config
    baseUrl: '/static/scripts/src'
    paths:
        jquery: '../../bower_components/jquery/jquery'
        underscore: '../../bower_components/underscore/underscore'
        backbone: '../../bower_components/backbone/backbone'
        chai: '../../bower_components/chai/chai'
        tests: '../tests'

    shim:
        underscore:
            exports: '_'

        backbone:
            deps: ['jquery', 'underscore']
            exports: 'Backbone'

    urlArgs: '_=' + (new Date().getTime())

require ['tests/apps/random'], (tests) ->
    if window.mochaPhantomJS
        mochaPhantomJS.run()
    else
        mocha.run()
