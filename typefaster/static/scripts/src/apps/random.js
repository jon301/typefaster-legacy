(function() {
  require(['jquery', 'underscore', 'templates', 'globals', 'app', 'views/item/typezone', 'controllers/game'], function($, _, JST, globals, app, TypeZoneView, GameController) {
    return app.addInitializer(function() {
      var entries, gameController, typeZoneView;
      entries = 'abcdefghijklmnopqrstuvwxyz';
      entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba';
      entries = '®bonjour les amis';
      entries = '®La grande porte s’ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s’enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d’une bombe atomique pensa David.';
      entries = 'bonjour les amis';
      entries = 'bonjour les amis comment allez vous moi je pense que je vais bien';
      gameController = new GameController({
        entries: entries,
        duration: 60
      });
      gameController.startListening();
      typeZoneView = new TypeZoneView({
        entries: entries
      });
      typeZoneView.on('entry:typed', function(entry) {
        gameController.start();
        return gameController.trigger('entry:typed', entry);
      });
      typeZoneView.on('entry:deleted', function() {
        return gameController.trigger('entry:deleted');
      });
      typeZoneView.render();
      return window.typeZoneView = typeZoneView;
    });
  });

}).call(this);
