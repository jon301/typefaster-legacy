#global define
define (require) ->
    'use strict';

    # Module dependencies
    $ = require 'jquery'
    _ = require 'underscore'
    Marionette = require 'marionette'
    Jed = require 'jed'

    Logger = require 'js_logger'

    require 'bootstrap'

    # Singleton pattern
    app = null

    # Module definition
    (->
        if app is null
            app = new Marionette.Application()

            # i18n
            app.addInitializer (options) ->
                $.i18n = new Jed(
                    if typeof json_locale_data isnt "undefined" and json_locale_data isnt null
                        locale_data: json_locale_data
                        domain: 'messages'
                    else {}
                )
                $._ = $.proxy $.i18n.gettext, $.i18n # Helper

            # Logger
            app.addInitializer (options) ->
                Logger.useDefaults()
                # Logger.setLevel(Logger[options.config.JSLOGGER_LEVEL])
                # Logger.get('').setLevel(Logger[options.config.JSLOGGER_LEVEL]);
                Logger.setLevel(Logger.OFF)

        app
    )()
