
#global define
define ['jquery', 'underscore', 'backbone', 'controllers/timer'], ($, _, Backbone, TimerController) ->
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
            @entries = options.entries
            @timer = new TimerController()

        play: () ->
            @timer.start()

        stop: () ->
            @timer.stop()
            if @.hasCheated()
                console.log 'You are a cheater'
            else
                console.log 'You are not a cheater'
            console.log JSON.stringify @.getStats()

        typeEntry: (entry) ->
            if entry is @entries[@currentIndex]
                console.log 'entry:is_correct', entry, @entries[@currentIndex]
                @correctEntries++
                @fixedMistakes++ if @entriesMap[@currentIndex] is @ENTRY_TO_BE_FIXED
                @entriesMap[@currentIndex] = @ENTRY_CORRECT
                @trigger 'entry:is_correct', @currentIndex
            else
                console.log 'entry:is_incorrect', entry, @entries[@currentIndex]
                @incorrectEntries++
                @entriesMap[@currentIndex] = @ENTRY_INCORRECT
                @trigger 'entry:is_incorrect', @currentIndex
            @currentIndex++
            @stop() if @entries.length is @currentIndex

        deleteEntry: () ->
            if @currentIndex > 0
                @currentIndex--
                console.log 'entry:is_reset', @entries[@currentIndex]
                if @entriesMap[@currentIndex] is @ENTRY_INCORRECT
                    @entriesMap[@currentIndex] = @ENTRY_TO_BE_FIXED
                else
                    @entriesMap[@currentIndex] = @ENTRY_DELETED
                @trigger 'entry:is_reset', @currentIndex
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
                console.log intervals
                intervals = _.uniq(intervals)

                if intervals.length

                    # Check if intervals between each keystrokes are the same
                    totalKeystrokes = @correctEntries + @incorrectEntries
                    equalPercent = 100 - (parseInt intervals.length / totalKeystrokes * 100, 10)

                    # Check if the average interval between all keystrokes is not too insane
                    sumIntervals = _.reduce intervals, (memo, num) ->
                        return memo + num
                    averageInterval  = parseInt sumIntervals / intervals.length, 10

                    console.log 'Intervals equal percentage: ' + equalPercent
                    console.log 'Average interval : ' + averageInterval + 'ms'

                else
                    equalPercent = 0
                    averageInterval = NaN

                equalPercent > 70 or averageInterval < 40
