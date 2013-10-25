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
      entries = '®La grande porte s’ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s’enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d’une bombe atomique pensa David.';
      entries = 'bonjour les amis';
      entries = 'bonjour les amis comment allez vous moi je pense que je vais bien';
      $('#typezone-inner').text(entries);
      gameController = new GameController({
        entries: entries,
        duration: 60
      });
      gameController.startListening();
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
      return $(document).on('keypress', function(evt) {
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
    });
  });

}).call(this);
