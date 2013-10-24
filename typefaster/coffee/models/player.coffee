
#global define
define ["jquery", "underscore", "backbone"], ($, _, Backbone) ->
    "use strict"

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
        entriesMapStatus: [] # For computing stats
        entriesLogs: [] # For ghost

        initialize: (options) ->
            @entries = options.entries

        typeEntry: (entry, elapsedTime) ->
            @entriesLogs.push { t: elapsedTime, v: entry }

            if entry is @entries[@currentIndex]
                console.log 'entry:is_correct', entry, @entries[@currentIndex]
                @correctEntries++
                @fixedMistakes++ if @entriesMapStatus[@currentIndex] is @ENTRY_TO_BE_FIXED
                @entriesMapStatus[@currentIndex] = @ENTRY_CORRECT
                @trigger 'entry:is_correct', @currentIndex
                @currentIndex++
                @trigger 'game:finished' if @entries.length is @currentIndex
            else
                console.log 'entry:is_incorrect', entry, @entries[@currentIndex]
                @incorrectEntries++
                @entriesMapStatus[@currentIndex] = @ENTRY_INCORRECT
                @trigger 'entry:is_incorrect', @currentIndex
                @currentIndex++

        deleteEntry: (elapsedTime) ->
            if @currentIndex > 0
                @entriesLogs.push { t: elapsedTime, v: -1 }
                @currentIndex--
                console.log 'entry:is_reset', @entries[@currentIndex]
                if @entriesMapStatus[@currentIndex] is @ENTRY_INCORRECT
                    @entriesMapStatus[@currentIndex] = @ENTRY_TO_BE_FIXED
                else
                    @entriesMapStatus[@currentIndex] = @ENTRY_DELETED
                @trigger 'entry:is_reset', @currentIndex

        getStats: (elapsedTime) ->
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

        getRecords: ->
            @entriesLogs

        isCheating: ->
            logs = _.pluck @entriesLogs, 't'
            logs = $.map logs, (val, i) ->
                return null  if i is 0
                val - logs[i - 1]
            console.log logs
            logs = _.uniq(logs)

            if logs.length

                # Check if intervals between each keystrokes are the same
                totalKeystrokes = @correctEntries + @incorrectEntries
                equalPercent = 100 - (parseInt logs.length / totalKeystrokes * 100, 10)

                # Check if the average interval between all keystrokes is not too insane
                sumIntervals = _.reduce logs, (memo, num) ->
                    return memo + num
                averageInterval  = parseInt sumIntervals / logs.length, 10

                console.log 'Intervals equal percentage: ' + equalPercent
                console.log 'Average interval : ' + averageInterval + 'ms'

            else
                equalPercent = 0
                averageInterval = NaN

            equalPercent > 70 or averageInterval < 30
