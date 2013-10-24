(function() {
  require(['jquery', 'underscore', 'templates', 'globals', 'app', 'controllers/game', 'controllers/timer', 'backbone', 'marionette'], function($, _, JST, globals, app, GameController, TimerController, Backbone, Marionette) {
    return app.addInitializer(function() {
      var entries, gameController, templates;
      templates = JST['typefaster/static/scripts/templates/test.ejs'];
      console.log($._('random page'));
      console.log(templates({
        my_var: 'bonjour'
      }));
      console.log(globals);
      entries = 'abcdefghijklmnopqrstuvwxyz';
      entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba';
      entries = '®bonjour les amis';
      entries = 'bonjour les amis';
      entries = 'bonjour les amis comment allez vous moi je pense que je vais bien';
      $('#typezone-inner').text(entries);
      gameController = new GameController({
        entries: entries,
        timer: 60
      });
      gameController.listen();
      $(document).on('keydown', function(evt) {
        var keyCode;
        if (evt.originalEvent !== undefined) {
          keyCode = evt.which;
          if (keyCode === 8) {
            gameController.trigger('entry:deleted');
            return evt.preventDefault();
          }
        }
      });
      $(document).on('keypress', function(evt) {
        var entry, keyCode;
        if (evt.originalEvent !== undefined) {
          keyCode = evt.which;
          entry = String.fromCharCode(keyCode);
          if (entry) {
            gameController.start();
            gameController.trigger('entry:typed', entry);
          }
          return evt.preventDefault();
        }
      });
      return gameController.addGhost([
        {
          "t": 0,
          "v": "b"
        }, {
          "t": 117,
          "v": "o"
        }, {
          "t": 182,
          "v": "n"
        }, {
          "t": 393,
          "v": "j"
        }, {
          "t": 433,
          "v": "o"
        }, {
          "t": 573,
          "v": "u"
        }, {
          "t": 694,
          "v": "r"
        }, {
          "t": 749,
          "v": " "
        }, {
          "t": 839,
          "v": "l"
        }, {
          "t": 914,
          "v": "e"
        }, {
          "t": 1049,
          "v": "s"
        }, {
          "t": 1130,
          "v": " "
        }, {
          "t": 1235,
          "v": "a"
        }, {
          "t": 1300,
          "v": "m"
        }, {
          "t": 1360,
          "v": "i"
        }, {
          "t": 1430,
          "v": "s"
        }, {
          "t": 1515,
          "v": " "
        }, {
          "t": 1636,
          "v": "c"
        }, {
          "t": 1726,
          "v": "o"
        }, {
          "t": 1756,
          "v": "m"
        }, {
          "t": 1931,
          "v": "m"
        }, {
          "t": 2197,
          "v": "e"
        }, {
          "t": 2317,
          "v": "n"
        }, {
          "t": 2428,
          "v": "t"
        }, {
          "t": 2553,
          "v": " "
        }, {
          "t": 2643,
          "v": "a"
        }, {
          "t": 2734,
          "v": "l"
        }, {
          "t": 2869,
          "v": "l"
        }, {
          "t": 2939,
          "v": "e"
        }, {
          "t": 2984,
          "v": "z"
        }, {
          "t": 3079,
          "v": " "
        }, {
          "t": 3204,
          "v": "v"
        }, {
          "t": 3295,
          "v": "o"
        }, {
          "t": 3360,
          "v": "u"
        }, {
          "t": 3440,
          "v": "s"
        }, {
          "t": 3560,
          "v": " "
        }, {
          "t": 3721,
          "v": "m"
        }, {
          "t": 3756,
          "v": "o"
        }, {
          "t": 3806,
          "v": "i"
        }, {
          "t": 3946,
          "v": " "
        }, {
          "t": 4177,
          "v": "j"
        }, {
          "t": 4347,
          "v": "e"
        }, {
          "t": 4432,
          "v": " "
        }, {
          "t": 4512,
          "v": "p"
        }, {
          "t": 4628,
          "v": "e"
        }, {
          "t": 4678,
          "v": "n"
        }, {
          "t": 4808,
          "v": "s"
        }, {
          "t": 4943,
          "v": "e"
        }, {
          "t": 5059,
          "v": " "
        }, {
          "t": 5179,
          "v": "q"
        }, {
          "t": 5279,
          "v": "u"
        }, {
          "t": 5354,
          "v": "e"
        }, {
          "t": 5414,
          "v": " "
        }, {
          "t": 5510,
          "v": "j"
        }, {
          "t": 5585,
          "v": "e"
        }, {
          "t": 5680,
          "v": " "
        }, {
          "t": 5765,
          "v": "v"
        }, {
          "t": 5815,
          "v": "a"
        }, {
          "t": 5901,
          "v": "i"
        }, {
          "t": 5971,
          "v": "s"
        }, {
          "t": 6076,
          "v": " "
        }, {
          "t": 6136,
          "v": "b"
        }, {
          "t": 6231,
          "v": "i"
        }, {
          "t": 6337,
          "v": "e"
        }, {
          "t": 6387,
          "v": "n"
        }
      ]);
    });
  });

}).call(this);
