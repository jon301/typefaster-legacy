(function() {
  require.config({
    baseUrl: '/static/scripts/src',
    paths: {
      jquery: '../../bower_components/jquery/jquery',
      underscore: '../../bower_components/underscore/underscore',
      backbone: '../../bower_components/backbone/backbone',
      chai: '../../bower_components/chai/chai',
      tests: '../tests'
    },
    shim: {
      underscore: {
        exports: '_'
      },
      backbone: {
        deps: ['jquery', 'underscore'],
        exports: 'Backbone'
      }
    },
    urlArgs: '_=' + (new Date().getTime())
  });

  require(['tests/apps/random'], function(tests) {
    if (window.mochaPhantomJS) {
      return mochaPhantomJS.run();
    } else {
      return mocha.run();
    }
  });

}).call(this);
