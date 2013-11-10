(function() {
  require.config({
    baseUrl: '/static/scripts/src',
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
      chai: '../../bower_components/chai/chai',
      tests: '../tests'
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
    urlArgs: '_=' + (new Date().getTime())
  });

  require(['tests/controllers/game', 'tests/models/player_human'], function() {
    if (window.mochaPhantomJS) {
      return mochaPhantomJS.run();
    } else {
      return mocha.run();
    }
  });

}).call(this);
