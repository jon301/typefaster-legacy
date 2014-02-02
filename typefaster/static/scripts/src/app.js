(function() {
  define(['jquery', 'underscore', 'marionette', 'js_logger', 'jed', 'bootstrap'], function($, _, Marionette, Logger, Jed) {
    var app;
    app = null;
    return (function() {
      if (app === null) {
        app = new Marionette.Application();
        app.addInitializer(function(options) {
          $.i18n = new Jed(typeof json_locale_data !== "undefined" && json_locale_data !== null ? {
            locale_data: json_locale_data,
            domain: 'messages'
          } : {});
          return $._ = $.proxy($.i18n.gettext, $.i18n);
        });
        app.addInitializer(function(options) {
          Logger.useDefaults();
          return Logger.setLevel(Logger.OFF);
        });
      }
      return app;
    })();
  });

}).call(this);
