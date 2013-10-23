(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require(['jquery', 'underscore', 'templates', 'globals', 'src/app', 'src/controllers/game', 'backbone', 'marionette'], function($, _, JST, globals, app, GameController, Backbone, Marionette) {
    return app.addInitializer(function() {
      var GameCollection, entries, gameController, myobj, templates, _ref;
      templates = JST['typefaster/static/scripts/templates/test.ejs'];
      console.log($._('random page'));
      console.log(templates({
        my_var: 'bonjour'
      }));
      console.log(globals);
      entries = 'abcdefghijklmnopqrstuvwxyz';
      entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba';
      entries = 'bonjour les amis';
      entries = 'La grande porte s’ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s’enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d’une bombe atomique pensa David.';
      $('#typezone-inner').text(entries);
      gameController = new GameController({
        entries: entries,
        timer: 60
      });
      gameController.listen();
      window.gameController = gameController;
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
            gameController.trigger('entry:typed', entry);
          }
          return evt.preventDefault();
        }
      });
      GameCollection = (function(_super) {
        __extends(GameCollection, _super);

        function GameCollection() {
          _ref = GameCollection.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        GameCollection.prototype.model = GameController;

        return GameCollection;

      })(Backbone.Collection);
      myobj = new GameCollection();
      myobj.on('all', function(e) {
        return console.log('event recu', e);
      });
      return myobj.add(gameController);
    });
  });

  /*        $(window).focus () ->
              console.log 'focus'
          $(window).blur () ->
              console.log 'blur'
  */


  /*
          $(window).resize () ->
              $('#typezone-inner').scrollTop $('#typezone-inner').scrollTop() + $('#titi').position().top;
  */


}).call(this);
