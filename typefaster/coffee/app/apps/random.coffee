require [
    'jquery',
    'underscore',
    'templates',
    'globals',
    'app',
    'views/item/typezone'
    'views/item/statschart'
    'controllers/game'
    ], ($, _, JST, globals, app, TypeZoneView, StatsChartView, GameController) ->

    app.addInitializer () ->

        entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba'
        entries = 'ㅍㅊㅁㄷ러ㅐㅕ'
        entries = 'Iñtërnâtiônàlizætiøn☃💩'
        entries = 'La grande porte s\'ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s\'enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d\'une bombe atomique pensa David.'

        gameController = new GameController(
            entries: entries
            duration: 60
        )
        #gameController.addGhost([{"t":0,"v":"b"},{"t":117,"v":"o"},{"t":182,"v":"n"},{"t":393,"v":"j"},{"t":433,"v":"o"},{"t":573,"v":"u"},{"t":694,"v":"r"},{"t":749,"v":" "},{"t":839,"v":"l"},{"t":914,"v":"e"},{"t":1049,"v":"s"},{"t":1130,"v":" "},{"t":1235,"v":"a"},{"t":1300,"v":"m"},{"t":1360,"v":"i"},{"t":1430,"v":"s"},{"t":1515,"v":" "},{"t":1636,"v":"c"},{"t":1726,"v":"o"},{"t":1756,"v":"m"},{"t":1931,"v":"m"},{"t":2197,"v":"e"},{"t":2317,"v":"n"},{"t":2428,"v":"t"},{"t":2553,"v":" "},{"t":2643,"v":"a"},{"t":2734,"v":"l"},{"t":2869,"v":"l"},{"t":2939,"v":"e"},{"t":2984,"v":"z"},{"t":3079,"v":" "},{"t":3204,"v":"v"},{"t":3295,"v":"o"},{"t":3360,"v":"u"},{"t":3440,"v":"s"},{"t":3560,"v":" "},{"t":3721,"v":"m"},{"t":3756,"v":"o"},{"t":3806,"v":"i"},{"t":3946,"v":" "},{"t":4177,"v":"j"},{"t":4347,"v":"e"},{"t":4432,"v":" "},{"t":4512,"v":"p"},{"t":4628,"v":"e"},{"t":4678,"v":"n"},{"t":4808,"v":"s"},{"t":4943,"v":"e"},{"t":5059,"v":" "},{"t":5179,"v":"q"},{"t":5279,"v":"u"},{"t":5354,"v":"e"},{"t":5414,"v":" "},{"t":5510,"v":"j"},{"t":5585,"v":"e"},{"t":5680,"v":" "},{"t":5765,"v":"v"},{"t":5815,"v":"a"},{"t":5901,"v":"i"},{"t":5971,"v":"s"},{"t":6076,"v":" "},{"t":6136,"v":"b"},{"t":6231,"v":"i"},{"t":6337,"v":"e"},{"t":6387,"v":"n"}])
        gameController.startListen()

        typeZoneView = new TypeZoneView(
            gameController: gameController
        )
        typeZoneView.render()

        statsChartView = new StatsChartView(
            gameController: gameController
        )
        statsChartView.render()
