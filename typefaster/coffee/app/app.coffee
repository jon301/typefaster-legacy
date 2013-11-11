#global define
define [
    'jquery',
    'underscore',
    'marionette',
    'js_logger',
    'jed',
    'bootstrap'
    ], ($, _, Marionette, Logger, Jed) ->

    app = null

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
                Logger.setLevel(Logger[options.config.JSLOGGER_LEVEL])

        app
    )()
