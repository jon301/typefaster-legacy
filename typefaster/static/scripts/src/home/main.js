(function() {
  require(['jquery', 'underscore', 'templates', 'globals', 'src/app', 'src/controllers/game'], function($, _, JST, globals, app, GameController) {
    return app.addInitializer(function() {
      var gameController, templates;
      templates = JST['typefaster/static/scripts/templates/test.ejs'];
      console.log($._('home main'));
      console.log(templates({
        my_var: 'bonjour'
      }));
      console.log(globals);
      gameController = new GameController({
        entries: "salut les amis comment allez vous moi je pense que je vais bien",
        timer: 60
      });
      $(document).keydown(function(e) {
        var keyCode;
        keyCode = e.which;
        if (keyCode === 8) {
          gameController.trigger('entry:deleted');
          return e.preventDefault();
        }
      });
      $(document).keypress(function(e) {
        var entry, keyCode;
        keyCode = e.which;
        entry = String.fromCharCode(keyCode);
        if (entry) {
          return gameController.trigger('entry:typed', entry);
        }
      });
      return $(window).resize(function() {
        return $('#type-inner').scrollTop($('#type-inner').scrollTop() + $('#titi').position().top);
      });
    });
  });

}).call(this);
