(function() {
  define(['jquery', 'underscore', 'marionette', 'jed'], function($, _, Marionette, Jed) {
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
      }
      return app;
    })();
  });

}).call(this);
