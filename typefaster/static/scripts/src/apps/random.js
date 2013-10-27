(function() {
  require(['jquery', 'underscore', 'templates', 'globals', 'app', 'views/item/typezone', 'views/item/statschart', 'controllers/game'], function($, _, JST, globals, app, TypeZoneView, StatsChartView, GameController) {
    return app.addInitializer(function() {
      var entries, gameController, statsChartView, typeZoneView;
      entries = 'abcdefghijklmnopqrstuvwxyz';
      entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba';
      entries = 'bonjour les amis comment allez vous moi je pense que je vais bien';
      entries = 'bonjour les amis';
      entries = 'La grande porte s\'ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s\'enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d\'une bombe atomique pensa David.';
      gameController = new GameController({
        entries: entries,
        duration: 60
      });
      gameController.startListen();
      typeZoneView = new TypeZoneView({
        entries: entries,
        gameController: gameController
      });
      typeZoneView.render();
      statsChartView = new StatsChartView({
        gameController: gameController
      });
      return statsChartView.render();
    });
  });

}).call(this);
