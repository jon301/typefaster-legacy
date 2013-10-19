requirejs.config
    baseUrl: '/static/scripts'
    paths:
        templates: 'src/templates',
        jquery: '../bower_components/jquery/jquery.min'
        backbone: '../bower_components/backbone/backbone-min'
        underscore: '../bower_components/lodash/dist/lodash.min'
        marionette: '../bower_components/marionette/lib/backbone.marionette.min'
        jed: '../bower_components/jed/jed'
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap.min'
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

# Initialize the app
require ['src/app'], (app) ->
    app.start()
