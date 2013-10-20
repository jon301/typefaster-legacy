require ['jquery', 'underscore', 'templates', 'globals', 'src/app', 'src/controllers/game'], ($, _, JST, globals, app, GameController) ->
    app.addInitializer () ->
        templates = JST['typefaster/static/scripts/templates/test.ejs']
        console.log $._('random page')
        console.log templates({ my_var: 'bonjour' })
        console.log globals

        gameController = new GameController(
######            entries: "abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba"
######            entries: "abcdefghijklmnopqrstuvwxyz"
            entries: "bonjour les amis comment allez vous moi je pense que je vais bien"
            timer: 60
        )
        gameController.listen()
        window.gameController = gameController

        $(document).on 'keydown', (evt) ->
            if evt.originalEvent isnt `undefined`
                keyCode = evt.which
                if keyCode == 8
                    gameController.trigger 'entry:deleted'
                    evt.preventDefault()

        $(document).on 'keypress', (evt) ->
            if evt.originalEvent isnt `undefined`
                keyCode = evt.which
                entry = String.fromCharCode(keyCode);
                if (entry)
                    gameController.trigger 'entry:typed', entry

###        $(window).focus () ->
            console.log 'focus'
        $(window).blur () ->
            console.log 'blur'###

###
        $(window).resize () ->
            $('#typezone-inner').scrollTop $('#typezone-inner').scrollTop() + $('#titi').position().top;
###