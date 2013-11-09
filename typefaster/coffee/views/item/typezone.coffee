#global define
define ['jquery', 'underscore', 'templates', 'marionette', 'punycode'], ($, _, JST, Marionette, punycode) ->
    'use strict'

    class TypeZoneView extends Marionette.ItemView
        el: '#typezone-view'
        template: JST['typefaster/static/scripts/templates/typezone.ejs']

        ui:
            entries: '.entry'
            textarea: '.typezone-text'
            input: '.typezone-input'

        events:
            'keydown .typezone-input': 'onKeydown'
            'keypress .typezone-input': 'onKeyPress'
            'compositionstart .typezone-input': 'onCompositionStart'
            'compositionend .typezone-input': 'onCompositionEnd'

        debugEvent: (evt) ->
            console.group(evt.type)
            if evt.originalEvent.constructor.name == 'KeyboardEvent'
                console.log 'keyCode=' + evt.keyCode + ' (' + String.fromCharCode(evt.keyCode) + ')'
                console.log 'charCode=' + evt.charCode+ ' (' + String.fromCharCode(evt.charCode) + ')'
                console.log 'which=' + evt.which + ' (' + String.fromCharCode(evt.which) + ')'
                console.log 'keyIdentifier=' + evt.originalEvent.keyIdentifier
            else if evt.originalEvent.constructor.name == 'CompositionEvent'
                console.log 'data=' + (evt.data || evt.originalEvent.data)
            console.groupEnd()

        onKeydown: (evt) ->
            @.debugEvent(evt)
            if @focused and evt.originalEvent isnt `undefined`
                keyCode = evt.which
                if keyCode == 8
                    @gameController.trigger 'entry:deleted'

        onKeyPress: (evt) ->
            @.debugEvent(evt)
            if @focused and evt.originalEvent isnt `undefined`
                keyCode = evt.which
                entry = String.fromCodePoint(keyCode);
                if entry
                    @gameController.start() unless @gameController.running
                    @gameController.trigger 'entry:typed', entry


        onCompositionStart: (evt) ->
            @.debugEvent(evt)
            @.ui.entries.filter('.focus').addClass('composition')

        onCompositionEnd: (evt) ->
            @.debugEvent(evt)
            @.ui.entries.filter('.focus').removeClass('composition')
            if @focused and evt.originalEvent isnt `undefined`
                entry = evt.data || evt.originalEvent.data
                if entry
                    @gameController.start() unless @gameController.running
                    @gameController.trigger 'entry:typed', entry

        initialize: (options) ->
            @entries = options.entries
            @gameController = options.gameController

        onRender: () ->
            @.$el.show()
            @.focus()

            $('#typezone-container').on 'click', $.proxy(@focus, @)

            $(window).resize () =>
                clearTimeout @resizingTimeout

                @resizingTimeout = setTimeout () =>
                    @scrollToEntry $('.current')
                , 200

            $(window).focus () =>
                @gameController.startListen()

            $(window).blur () =>
                @blur()
                @gameController.stopListen()

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
                @.ui.entries.removeClass('current focus')
                $entry.removeClass('correct incorrect').addClass('current focus')
                if index isnt 0
                    $prevEntry = @.ui.entries.eq(index - 1)
                    @scrollToEntry $prevEntry

            @.listenTo @gameController, 'human:stop', () =>
                @disable()

        scrollToEntry: ($entry) ->
            if $entry.length and $entry.parent().position().top != 0 and not @animating
                @animating = true
                @.ui.textarea.stop(true).animate({ scrollTop: @.ui.textarea.scrollTop() + $entry.parent().position().top }, () =>
                    @animating = false
                )

        disable: () ->
            @disabled = true
            @.ui.input.prop 'disabled', true
            @blur()

        focus: (evt) ->
            @.ui.input.focus()
            unless @focused or @disabled
                console.log 'focus typezone'
                @focused = true
                @.$('.current').addClass 'focus'
                $('#typezone-container').addClass 'focus'
                $('body').on 'click', $.proxy(@blur, @)

            if evt
                evt.preventDefault()
                evt.stopPropagation()

        blur: (e) ->
            @.ui.input.blur()
            if @focused
                console.log 'blur typezone'
                @focused = false
                @.$('.current').removeClass 'focus'
                $('#typezone-container').removeClass 'focus'
                $('body').off 'click', $.proxy(@blur, @)

        serializeData: () ->
            'entries': @entries
            'punycode': punycode
