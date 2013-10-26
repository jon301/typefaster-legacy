#global define
define ['jquery', 'underscore', 'templates', 'marionette'], ($, _, JST, Marionette) ->
    'use strict'

    class TypeZoneView extends Marionette.ItemView
        el: '#typezone-view'
        template: JST['typefaster/static/scripts/templates/typezone.ejs']

        initialize: (options) ->
            @entries = options.entries

            $(document).on 'keydown', (evt) =>
                if evt.originalEvent isnt `undefined`
                    keyCode = evt.which
                    if keyCode == 8
                        @.trigger 'entry:deleted'
                        evt.preventDefault()

            $(document).on 'keypress', (evt) =>
                if evt.originalEvent isnt `undefined`
                    keyCode = evt.which
                    entry = String.fromCharCode(keyCode);
                    if (entry)
                        @.trigger 'entry:typed', entry
                    evt.preventDefault()


        serializeData: () ->
            'entries': @entries
