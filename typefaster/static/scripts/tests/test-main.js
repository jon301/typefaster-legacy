(function() {
  var file, tests;

  tests = [];

  for (file in window.__karma__.files) {
    if (/scripts\/tests\/spec\//.test(file)) {
      if (window.__karma__.files.hasOwnProperty(file)) {
        tests.push(file);
      }
    }
  }

  requirejs.config({
    baseUrl: '/base/scripts/src',
    paths: {
      jquery: '../../bower_components/jquery/jquery.min',
      backbone: '../../bower_components/backbone/backbone-min',
      underscore: '../../bower_components/lodash/dist/lodash.min',
      marionette: '../../bower_components/marionette/lib/backbone.marionette.min',
      jed: '../../bower_components/jed/jed',
      bootstrap: '../../bower_components/sass-bootstrap/dist/js/bootstrap.min',
      highcharts: '../../bower_components/highcharts.com/js/highcharts.src',
      punycode: '../../bower_components/punycode/punycode.min',
      string_at: '../../bower_components/String.prototype.at/at',
      string_fromcodepoint: '../../bower_components/String.fromCodePoint/fromcodepoint',
      js_logger: '../../bower_components/js-logger/src/logger.min'
    },
    shim: {
      backbone: {
        deps: ['jquery', 'underscore'],
        exports: 'Backbone'
      },
      underscore: {
        exports: '_'
      },
      marionette: {
        deps: ['jquery', 'underscore', 'backbone'],
        exports: 'Marionette'
      },
      bootstrap: {
        deps: ['jquery']
      }
    },
    deps: tests,
    callback: window.__karma__.start
  });

}).call(this);
