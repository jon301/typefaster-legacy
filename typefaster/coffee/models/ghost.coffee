#global define
define ["jquery", "underscore", "models/player", "controllers/timer"], ($, _, PlayerModel, TimerController) ->
    "use strict"

    class GhostModel extends PlayerModel

        elapsedTime: 0
        timeout: null

        initialize: (options) ->
            @entries = options.entries
            @entriesLogs = options.entriesLogs

            @timer = new TimerController()

        run: () ->
            @timer.start()
            @readEntries()

        stop: () ->
            console.log 'stop'
            clearTimeout @timeout

            if @.isCheating()
                console.log 'This ghost is a cheater'
            else
                console.log 'This ghost is not a cheater'

            console.log JSON.stringify @.getStats()

        readEntries: () ->
            unless @entryLog
                @entryLog = @entriesLogs.shift()

            if @timer.getElapsedTime() > @entryLog.t
                if @entryLog.v == -1
                    @deleteEntry()
                else
                    @typeEntry @entryLog.v
                @entryLog = @entriesLogs.shift()

            if @entryLog
                @timeout = setTimeout($.proxy(@readEntries, @), 1)

        typeEntry: (entry) ->
            if entry is @entries[@currentIndex]
                console.log 'entry:is_correct', entry, @entries[@currentIndex]
                @correctEntries++
                @fixedMistakes++ if @entriesMapStatus[@currentIndex] is @ENTRY_TO_BE_FIXED
                @entriesMapStatus[@currentIndex] = @ENTRY_CORRECT
                @trigger 'entry:is_correct', @currentIndex
                @currentIndex++
                @stop() if @entries.length is @currentIndex
            else
                console.log 'entry:is_incorrect', entry, @entries[@currentIndex]
                @incorrectEntries++
                @entriesMapStatus[@currentIndex] = @ENTRY_INCORRECT
                @trigger 'entry:is_incorrect', @currentIndex
                @currentIndex++

        deleteEntry: () ->
            if @currentIndex > 0
                @currentIndex--
                console.log 'entry:is_reset', @entries[@currentIndex]
                if @entriesMapStatus[@currentIndex] is @ENTRY_INCORRECT
                    @entriesMapStatus[@currentIndex] = @ENTRY_TO_BE_FIXED
                else
                    @entriesMapStatus[@currentIndex] = @ENTRY_DELETED
                @trigger 'entry:is_reset', @currentIndex

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

        isCheating: ->
            logs = _.keys @entriesLogs
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
