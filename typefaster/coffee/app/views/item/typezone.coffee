#global define
define (require) ->
    'use strict';

    # Module dependencies
    app = require 'app'

    $ = require 'jquery'
    _ = require 'underscore'
    JST = require 'templates'
    Marionette = require 'marionette'
    Logger = require 'js_logger'
    punycode = require 'punycode'

    require 'string_fromcodepoint'

    # Module definition
    class TypeZoneView extends Marionette.ItemView
        el: '#typezone-view'
        template: JST['typefaster/static/scripts/templates/typezone.ejs']

        ui:
            entries: '.entry'
            textarea: '.typezone-text'
            input: '.typezone-input'


        events:
            'click .typezone-panel': 'focus'
            'keydown .typezone-input': 'onKeydown'
            'keypress .typezone-input': 'onKeyPress'
            'compositionstart .typezone-input': 'onCompositionStart'
            'compositionend .typezone-input': 'onCompositionEnd'


        debugEvent: (evt) ->
            if evt.originalEvent.constructor.name == 'KeyboardEvent'
                @logger.debug evt.type, 'keyCode=' + evt.keyCode + ' (' + String.fromCharCode(evt.keyCode) + ')',
                    'charCode=' + evt.charCode+ ' (' + String.fromCharCode(evt.charCode) + ')',
                    'which=' + evt.which + ' (' + String.fromCharCode(evt.which) + ')',
                    'keyIdentifier=' + evt.originalEvent.keyIdentifier
            else if evt.originalEvent.constructor.name == 'CompositionEvent'
                @logger.debug evt.type, 'data=' + (evt.data || evt.originalEvent.data)


        onKeydown: (evt) ->
            @debugEvent(evt)
            if @$el.hasClass('focus') and evt.originalEvent isnt `undefined`
                keyCode = evt.which
                if keyCode == 8
                    app.vent.trigger 'keyboard:backspace'
                if keyCode == 27
                    app.vent.trigger 'keyboard:escape'
                    @reset()


        onKeyPress: (evt) ->
            @debugEvent(evt)
            if @$el.hasClass('focus') and evt.originalEvent isnt `undefined`
                keyCode = evt.which
                entry = String.fromCodePoint(keyCode);
                if entry and keyCode and keyCode != 8 and keyCode != 27
                    app.vent.trigger 'keyboard:char', entry


        onCompositionStart: (evt) ->
            @debugEvent(evt)
            @ui.entries.filter('.current').addClass('composition')


        onCompositionEnd: (evt) ->
            @debugEvent(evt)
            @ui.entries.filter('.current').removeClass('composition')
            if @$el.hasClass('focus') and evt.originalEvent isnt `undefined`
                entry = evt.data || evt.originalEvent.data
                if entry
                    app.vent.trigger 'keyboard:char', entry


        initialize: (options) ->
            @entries = options.entries
            @logger = Logger.get 'TypeZoneView'

            @initEventAggregator()

        initEventAggregator: ->
            @listenTo app.vent, 'entry:is_correct', (player, index) =>
                $entry = @ui.entries.eq(index)
                $nextEntry = @ui.entries.eq(index + 1)
                if player.getType() == 'human'
                    $entry.removeClass('current').addClass('correct')
                    if $nextEntry
                        $nextEntry.addClass('current')
                        @scrollToEntry $nextEntry
                else
                    $entry.css 'borderColor', 'transparent'
                    if $nextEntry
                        $nextEntry.css 'borderColor', player.getColor()

            @listenTo app.vent, 'entry:is_incorrect', (player, index) =>
                $entry = @ui.entries.eq(index)
                $nextEntry = @ui.entries.eq(index + 1)
                if player.getType() == 'human'
                    $entry.removeClass('current').addClass('incorrect')
                    if $nextEntry
                        $nextEntry.addClass('current')
                        @scrollToEntry $nextEntry
                else
                    $entry.css 'borderColor', 'transparent'
                    if $nextEntry
                        $nextEntry.css 'borderColor', player.getColor()

            @listenTo app.vent, 'entry:is_reset', (player, index) =>
                $entry = @ui.entries.eq(index)
                if player.getType() == 'human'
                    @ui.entries.removeClass('current')
                    $entry.removeClass('correct incorrect').addClass('current')
                    if index isnt 0
                        $prevEntry = @ui.entries.eq(index - 1)
                        @scrollToEntry $prevEntry, $entry
                else
                    @ui.entries.css 'borderColor', 'transparent'
                    $entry.css 'borderColor', player.getColor()

            @listenTo app.vent, 'player:add', (player) =>
                $entry = @ui.entries.eq(0)
                if player.getType() == 'human'
                    $entry.addClass 'current'
                else
                    $entry.css 'borderColor', player.getColor()

            @listenTo app.vent, 'human:stop', () =>
                @disable()


        onRender: () ->
            @$el.show()
            @focus()

            $(window).on 'resize.typezone', () =>
                clearTimeout @resizingTimeout
                @resizingTimeout = setTimeout () =>
                    @scrollToEntry $('.current')
                , 200

            $(window).on 'blur.typezone', () =>
                @blur()


        scrollToEntry: ($entry, $focusEntry) ->
            if not $focusEntry
                $focusEntry = $entry

            # if $entry.length and $entry.parent().position().top != 0 and not @animating
            if $entry.length and $entry.position().top != 0 and not @animating
                @animating = true
                @ui.textarea.stop(true).animate({ scrollTop: @ui.textarea.scrollTop() + $entry.position().top }, () =>
                    @animating = false
                    @ui.input.offset $focusEntry.offset()
                )
            else
                @ui.input.offset $focusEntry.offset()


        disable: (evt) ->
            @undelegateEvents()
            @blur()


        reset: () ->
            @delegateEvents()
            @ui.entries.removeClass 'correct incorrect current'

            @ui.input.val ''

            firstEntry = @ui.entries.eq(0)
            firstEntry.addClass 'current'
            @scrollToEntry firstEntry

            @ui.entries.css 'borderColor', 'transparent'
            firstEntry.css 'borderColor', 'red'

            @focus()



        focus: (evt) ->
            @ui.input.focus()

            unless @$el.hasClass('focus')
                @logger.debug 'focus typezone'
                @$el.addClass 'focus'
                @ui.input.offset @$('.current').offset()
                $('body').on 'click.typezone', $.proxy(@blur, @)

            if evt
                evt.preventDefault()
                evt.stopPropagation()


        blur: (evt) ->
            # @ui.input.blur()

            if @$el.hasClass('focus')
                @logger.debug 'blur typezone'
                @$('.current').removeClass 'focus'
                @$el.removeClass 'focus'
                $('body').off 'click.typezone', $.proxy(@blur, @)


        serializeData: () ->
            'entries': @entries
            'punycode': punycode


        onClose: () ->
            $(window).off '.typezone'
            $('body').off '.typezone'
