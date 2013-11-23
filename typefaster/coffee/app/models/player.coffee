#global define
define [
    'jquery',
    'underscore',
    'backbone',
    'js_logger',
    'controllers/timer',
    'punycode',
    'string_at'
    ], ($, _, Backbone, Logger, TimerController, punycode) ->
    'use strict'

    class PlayerModel extends Backbone.Model

        ENTRY_CORRECT: 1
        ENTRY_INCORRECT: -1
        ENTRY_TO_BE_FIXED: 0
        ENTRY_DELETED: 2

        # Defaults
        entries: '' # String

        correctEntries: 0
        incorrectEntries: 0
        fixedMistakes: 0

        currentIndex: 0
        entriesMap: [] # For computing stats

        initialize: (options) ->
            @logger = Logger.get 'PlayerModel'
            @gameController = options.gameController
            @timer = new TimerController()

        play: () ->
            @reset()
            @timer.start()

        stop: () ->
            @timer.stop()
            if @.hasCheated()
                @logger.debug 'You are a cheater'
            else
                @logger.debug 'You are not a cheater'
            @logger.debug JSON.stringify @.getStats()

        reset: () ->
            @correctEntries = 0
            @incorrectEntries = 0
            @fixedMistakes = 0
            @currentIndex = 0
            @entriesMap = []

        typeEntry: (entry) ->
            if entry is @gameController.entries.at(@currentIndex)
                @logger.debug 'entry:is_correct', entry, @gameController.entries.at(@currentIndex)
                @correctEntries++
                @fixedMistakes++ if @entriesMap[@currentIndex] is @ENTRY_TO_BE_FIXED
                @entriesMap[@currentIndex] = @ENTRY_CORRECT
                @gameController.trigger 'entry:is_correct', @, @currentIndex
            else
                @logger.debug 'entry:is_incorrect', entry, @gameController.entries.at(@currentIndex)
                @incorrectEntries++
                @entriesMap[@currentIndex] = @ENTRY_INCORRECT
                @gameController.trigger 'entry:is_incorrect', @, @currentIndex
            @currentIndex++
            @stop() if punycode.ucs2.decode(@gameController.entries).length is @currentIndex

        deleteEntry: () ->
            if @currentIndex > 0
                @currentIndex--
                @logger.debug 'entry:is_reset', @gameController.entries.at(@currentIndex)
                if @entriesMap[@currentIndex] is @ENTRY_INCORRECT
                    @entriesMap[@currentIndex] = @ENTRY_TO_BE_FIXED
                else
                    @entriesMap[@currentIndex] = @ENTRY_DELETED
                @gameController.trigger 'entry:is_reset', @, @currentIndex
                return true
            return false

        getStats: () ->
            elapsedTime = @timer.getElapsedTime()
            elapsedTimeMinutes =  elapsedTime / 60000
            totalEntries = @correctEntries + @incorrectEntries
            errorRate = (@incorrectEntries - @fixedMistakes) / elapsedTimeMinutes
            rawSpeed = (totalEntries / elapsedTimeMinutes) / 5

            elapsedTime: elapsedTime
            correctEntries: @correctEntries
            incorrectEntries: @incorrectEntries
            fixedMistakes: @fixedMistakes
            totalEntries: totalEntries
            errorRate: errorRate
            rawSpeed: rawSpeed
            keySpeed: totalEntries / elapsedTimeMinutes
            speed: rawSpeed - errorRate
            accuracy: (if totalEntries then (@correctEntries / totalEntries) * 100 else 0)

        hasCheated: ->
            if @replayLogs
                intervals = _.pluck @replayLogs, 't'
                intervals = $.map intervals, (val, i) ->
                    return null  if i is 0 # Skip first keypress (no interval)
                    val - intervals[i - 1]
                @logger.debug intervals
                intervals = _.uniq(intervals)

                if intervals.length

                    # Check if intervals between each keystrokes are the same
                    totalKeystrokes = @correctEntries + @incorrectEntries
                    equalPercent = 100 - (parseInt intervals.length / totalKeystrokes * 100, 10)

                    # Check if the average interval between all keystrokes is not too insane
                    sumIntervals = _.reduce intervals, (memo, num) ->
                        return memo + num
                    averageInterval  = parseInt sumIntervals / intervals.length, 10

                    @logger.debug 'Intervals equal percentage: ' + equalPercent
                    @logger.debug 'Average interval : ' + averageInterval + 'ms'

                else
                    equalPercent = 0
                    averageInterval = NaN

                equalPercent > 70 or averageInterval < 50
