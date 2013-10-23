require ['jquery', 'underscore', 'templates', 'globals', 'src/app', 'src/controllers/game', 'backbone', 'marionette'], ($, _, JST, globals, app, GameController, Backbone, Marionette) ->
    app.addInitializer () ->
        templates = JST['typefaster/static/scripts/templates/test.ejs']
        console.log $._('random page')
        console.log templates({ my_var: 'bonjour' })
        console.log globals

        entries = 'abcdefghijklmnopqrstuvwxyz'
        entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba'
        entries = 'bonjour les amis'
        entries = 'La grande porte s’ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s’enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d’une bombe atomique pensa David.'

        $('#typezone-inner').text entries

        gameController = new GameController(
            entries: entries
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
                evt.preventDefault()


        class GameCollection extends Backbone.Collection
            model: GameController

        myobj = new GameCollection()

        myobj.on 'all', (e) ->
            console.log 'event recu', e

        myobj.add gameController








###        $(window).focus () ->
            console.log 'focus'
        $(window).blur () ->
            console.log 'blur'###

###
        $(window).resize () ->
            $('#typezone-inner').scrollTop $('#typezone-inner').scrollTop() + $('#titi').position().top;
###