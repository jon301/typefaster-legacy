#global define
define [
    'jquery',
    'underscore',
    'templates',
    'marionette',
    'js_logger',
    'punycode',
    'string_fromcodepoint'
    ], ($, _, JST, Marionette, Logger, punycode) ->

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
            @logger.debug evt.type
            if evt.originalEvent.constructor.name == 'KeyboardEvent'
                @logger.debug 'keyCode=' + evt.keyCode + ' (' + String.fromCharCode(evt.keyCode) + ')'
                @logger.debug 'charCode=' + evt.charCode+ ' (' + String.fromCharCode(evt.charCode) + ')'
                @logger.debug 'which=' + evt.which + ' (' + String.fromCharCode(evt.which) + ')'
                @logger.debug 'keyIdentifier=' + evt.originalEvent.keyIdentifier
            else if evt.originalEvent.constructor.name == 'CompositionEvent'
                @logger.debug 'data=' + (evt.data || evt.originalEvent.data)


        onKeydown: (evt) ->
            @.debugEvent(evt)
            if @focused and evt.originalEvent isnt `undefined`
                keyCode = evt.which
                if keyCode == 8
                    @gameController.trigger 'keyboard:backspace'
                if keyCode == 27
                    @gameController.trigger 'keyboard:escape'
                    @reset()


        onKeyPress: (evt) ->
            @.debugEvent(evt)
            if @focused and evt.originalEvent isnt `undefined`
                keyCode = evt.which
                entry = String.fromCodePoint(keyCode);
                if entry and keyCode and keyCode != 8 and keyCode != 27
                    @gameController.trigger 'keyboard:char', entry


        onCompositionStart: (evt) ->
            @.debugEvent(evt)
            @.ui.entries.filter('.focus').addClass('composition')


        onCompositionEnd: (evt) ->
            @.debugEvent(evt)
            @.ui.entries.filter('.focus').removeClass('composition')
            if @focused and evt.originalEvent isnt `undefined`
                entry = evt.data || evt.originalEvent.data
                if entry
                    @gameController.trigger 'keyboard:char', entry


        initialize: (options) ->
            @logger = Logger.get 'TypeZoneView'
            @gameController = options.gameController


        onRender: () ->
            @.$el.show()

            $('#typezone-container').on 'click.typezone', $.proxy(@focus, @)

            $(window).on 'resize.typezone', () =>
                clearTimeout @resizingTimeout
                @resizingTimeout = setTimeout () =>
                    @scrollToEntry $('.current')
                , 200

            $(window).on 'blur.typezone', () =>
                @blur()

            @.listenTo @gameController, 'entry:is_correct', (player, index) =>
                $entry = @.ui.entries.eq(index)
                $nextEntry = @.ui.entries.eq(index + 1)
                if player.getType() == 'human'
                    $entry.removeClass('current focus').addClass('correct')
                    if $nextEntry
                        $nextEntry.addClass('current focus')
                        @scrollToEntry $nextEntry
                else
                    $entry.css 'borderColor', 'transparent'
                    if $nextEntry
                        $nextEntry.css 'borderColor', player.getColor()

            @.listenTo @gameController, 'entry:is_incorrect', (player, index) =>
                $entry = @.ui.entries.eq(index)
                $nextEntry = @.ui.entries.eq(index + 1)
                if player.getType() == 'human'
                    $entry.removeClass('current focus').addClass('incorrect')
                    if $nextEntry
                        $nextEntry.addClass('current focus')
                        @scrollToEntry $nextEntry
                else
                    $entry.css 'borderColor', 'transparent'
                    if $nextEntry
                        $nextEntry.css 'borderColor', player.getColor()

            @.listenTo @gameController, 'entry:is_reset', (player, index) =>
                $entry = @.ui.entries.eq(index)
                if player.getType() == 'human'
                    @.ui.entries.removeClass('current focus')
                    $entry.removeClass('correct incorrect').addClass('current focus')
                    if index isnt 0
                        $prevEntry = @.ui.entries.eq(index - 1)
                        @scrollToEntry $prevEntry
                else
                    @.ui.entries.css 'borderColor', 'transparent'
                    $entry.css 'borderColor', player.getColor()

            @.listenTo @gameController, 'player:add', (player) =>
                $entry = @.ui.entries.eq(0)
                if player.getType() == 'human'
                    $entry.addClass 'current'
                    @.focus()
                else
                    $entry.css 'borderColor', player.getColor()

            @.listenTo @gameController, 'human:stop', () =>
                @disable()


        scrollToEntry: ($entry) ->
            # if $entry.length and $entry.parent().position().top != 0 and not @animating
            if $entry.length and $entry.position().top != 0 and not @animating
                @animating = true
                @.ui.textarea.stop(true).animate({ scrollTop: @.ui.textarea.scrollTop() + $entry.position().top }, () =>
                    @animating = false
                )


        reset: () ->
            @.ui.entries.removeClass 'correct incorrect focus current'

            @.ui.input.val ''
            # @.ui.input.prop 'disabled', false
            @disabled = false
            @focused = false

            firstEntry = @.ui.entries.eq(0)
            firstEntry.addClass 'current'
            @.scrollToEntry firstEntry

            @focus()


        disable: () ->
            @disabled = true
            # @.ui.input.prop 'disabled', true
            @blur()


        focus: (evt) ->
            @.ui.input.focus()

            unless @focused or @disabled
                @logger.debug 'focus typezone'
                @focused = true
                @gameController.startListen()
                @.$('.current').addClass 'focus'
                $('#typezone-container').addClass 'focus'
                $('body').on 'click.typezone', $.proxy(@blur, @)

            if evt
                evt.preventDefault()
                evt.stopPropagation()


        blur: (evt) ->
            # @.ui.input.blur()
            if @focused
                @logger.debug 'blur typezone'
                @focused = false
                @gameController.stopListen()
                @.$('.current').removeClass 'focus'
                $('#typezone-container').removeClass 'focus'
                $('body').off 'click.typezone', $.proxy(@blur, @)


        serializeData: () ->
            'entries': @gameController.entries
            'punycode': punycode


        onClose: () ->
            $('#typezone-container').off '.typezone'
            $(window).off '.typezone'
            $('body').off '.typezone'
