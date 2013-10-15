requirejs.config
    baseUrl: '../static/scripts'
    paths:
        templates: 'src/templates',
        jquery: '../bower_components/jquery/jquery.min'
        underscore: '../bower_components/underscore/underscore-min'
        jed: '../bower_components/jed/jed'
    shim:
        underscore:
            exports: '_'

# Initialize the app
require ['jquery', 'jed'], ($, Jed) ->
    $.i18n = new Jed(
        if typeof json_locale_data isnt "undefined" and json_locale_data isnt null
            locale_data: json_locale_data
            domain: 'messages'
        else {}
    )
    $._ = $.proxy $.i18n.gettext, $.i18n # Helper
