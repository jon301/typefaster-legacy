#global define
define ['jquery', 'underscore', 'templates', 'marionette'], ($, _, JST, Marionette) ->
    'use strict'

    class TypeZoneView extends Marionette.ItemView
        el: '#typezone-view'
        template: JST['typefaster/static/scripts/templates/typezone.ejs']

        initialize: (options) ->
            @entries = options.entries

            @.$el.on 'click', $.proxy(@focus, @)

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

        focus: (e) ->
            unless @focused
                @focused = true
                console.log 'focus typezone'
                $('body').on 'click', $.proxy(@blur, @)
            e.preventDefault()
            e.stopPropagation()

        blur: (e) ->
            if @focused
                @focused = false
                console.log 'blur typezone'
                $('body').off 'click', $.proxy(@blur, @)

        serializeData: () ->
            'entries': @entries
