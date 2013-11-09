define ['jquery', 'underscore', 'marionette', 'jed', 'bootstrap', 'string_at', 'string_fromcodepoint'], ($, _, Marionette, Jed) ->

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

        app
    )()
