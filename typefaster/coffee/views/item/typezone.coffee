#global define
define ['jquery', 'underscore', 'templates', 'marionette'], ($, _, JST, Marionette) ->
    'use strict'

    class TypeZoneView extends Marionette.ItemView
        el: '#typezone-view'
        template: JST['typefaster/static/scripts/templates/typezone.ejs']

        ui:
            entries: '.entry'

        initialize: (options) ->
            @entries = options.entries
            @gameController = options.gameController

        onRender: () ->
            @.focus()

            @.$el.on 'click', $.proxy(@focus, @)

            $(document).on 'keydown', (evt) =>
                if @focused and evt.originalEvent isnt `undefined`
                    keyCode = evt.which
                    if keyCode == 8
                        @gameController.trigger 'entry:deleted'
                        evt.preventDefault()

            $(document).on 'keypress', (evt) =>
                if @focused and evt.originalEvent isnt `undefined`
                    keyCode = evt.which
                    entry = String.fromCharCode(keyCode);
                    if (entry)
                        @gameController.start() unless @gameController.running
                        @gameController.trigger 'entry:typed', entry
                    evt.preventDefault()

            $(window).resize () =>
                @.$el.scrollTop(@.$el.scrollTop() + $('.current').parent().position().top)

            @.listenTo @gameController, 'entry:is_correct', (index) =>
                $entry = @.ui.entries.eq(index)
                $nextEntry = @.ui.entries.eq(index + 1)
                $entry.removeClass('current focus').addClass('correct')
                if $nextEntry
                    $nextEntry.addClass('current focus')
                    @scrollToEntry $nextEntry

            @.listenTo @gameController, 'entry:is_incorrect', (index) =>
                $entry = @.ui.entries.eq(index)
                $nextEntry = @.ui.entries.eq(index + 1)
                $entry.removeClass('current focus').addClass('incorrect')
                if $nextEntry
                    $nextEntry.addClass('current focus')
                    @scrollToEntry $nextEntry

            @.listenTo @gameController, 'entry:is_reset', (index) =>
                $entry = @.ui.entries.eq(index)
                $prevEntry = @.ui.entries.eq(index - 1)
                @.ui.entries.removeClass('current focus')
                $entry.removeClass('correct incorrect').addClass('current focus')
                @scrollToEntry $prevEntry

        scrollToEntry: ($entry) ->
            if $entry.length and $entry.parent().position().top != 0 and not @animating
                @animating = true
                @.$el.stop(true).animate({ scrollTop: @.$el.scrollTop() + $entry.parent().position().top }, () =>
                    @animating = false
                )

        focus: (evt) ->
            unless @focused
                console.log 'focus typezone'
                @focused = true
                @.$('.current').addClass 'focus'
                $('body').on 'click', $.proxy(@blur, @)

            if evt
                evt.preventDefault()
                evt.stopPropagation()

        blur: (e) ->
            if @focused
                console.log 'blur typezone'
                @focused = false
                @.$('.current').removeClass 'focus'
                $('body').off 'click', $.proxy(@blur, @)

        serializeData: () ->
            'entries': @entries
