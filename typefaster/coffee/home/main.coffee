require ['jquery', 'underscore', 'templates', 'globals', 'src/app', 'src/controllers/game'], ($, _, JST, globals, app, GameController) ->
    app.addInitializer () ->
        templates = JST['typefaster/static/scripts/templates/test.ejs']
        console.log $._('home main')
        console.log templates({ my_var: 'bonjour' })
        console.log globals

        gameController = new GameController(
            entries: "salut les amis comment allez vous moi je pense que je vais bien"
            timer: 60
        )
        $(document).keydown (e) ->
            keyCode = e.which
            if keyCode == 8
                gameController.trigger 'entry:deleted'
                e.preventDefault()

        $(document).keypress (e) ->
            keyCode = e.which
            entry = String.fromCharCode(keyCode);
            if (entry)
                gameController.trigger 'entry:typed', entry

        $(window).resize () ->
            $('#type-inner').scrollTop $('#type-inner').scrollTop() + $('#titi').position().top;