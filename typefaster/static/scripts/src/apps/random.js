(function() {
  require(['jquery', 'underscore', 'templates', 'globals', 'src/app', 'src/controllers/game'], function($, _, JST, globals, app, GameController) {
    return app.addInitializer(function() {
      var gameController, templates;
      templates = JST['typefaster/static/scripts/templates/test.ejs'];
      console.log($._('random page'));
      console.log(templates({
        my_var: 'bonjour'
      }));
      console.log(globals);
      gameController = new GameController({
        entries: "bonjour les amis comment allez vous moi je pense que je vais bien",
        timer: 60
      });
      $(document).on('keydown', function(evt) {
        var keyCode;
        if (evt.originalEvent !== undefined) {
          keyCode = evt.which;
          if (keyCode === 8) {
            gameController.trigger('entry:deleted', evt);
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
            return gameController.trigger('entry:typed', evt, entry);
          }
        }
      });
      $(window).focus(function() {
        return console.log('focus');
      });
      return $(window).blur(function() {
        return console.log('blur');
      });
    });
  });

  /*
          $(window).resize () ->
              $('#typezone-inner').scrollTop $('#typezone-inner').scrollTop() + $('#titi').position().top;
  */


}).call(this);
