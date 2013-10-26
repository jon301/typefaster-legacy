(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'templates', 'marionette'], function($, _, JST, Marionette) {
    'use strict';
    var TypeZoneView, _ref;
    return TypeZoneView = (function(_super) {
      __extends(TypeZoneView, _super);

      function TypeZoneView() {
        _ref = TypeZoneView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      TypeZoneView.prototype.el = '#typezone-view';

      TypeZoneView.prototype.template = JST['typefaster/static/scripts/templates/typezone.ejs'];

      TypeZoneView.prototype.ui = {
        entries: '.entry'
      };

      TypeZoneView.prototype.initialize = function(options) {
        this.entries = options.entries;
        return this.gameController = options.gameController;
      };

      TypeZoneView.prototype.onRender = function() {
        var _this = this;
        this.focus();
        this.$el.on('click', $.proxy(this.focus, this));
        $(document).on('keydown', function(evt) {
          var keyCode;
          if (_this.focused && evt.originalEvent !== undefined) {
            keyCode = evt.which;
            if (keyCode === 8) {
              _this.gameController.trigger('entry:deleted');
              return evt.preventDefault();
            }
          }
        });
        $(document).on('keypress', function(evt) {
          var entry, keyCode;
          if (_this.focused && evt.originalEvent !== undefined) {
            keyCode = evt.which;
            entry = String.fromCharCode(keyCode);
            if (entry) {
              if (!_this.gameController.running) {
                _this.gameController.start();
              }
              _this.gameController.trigger('entry:typed', entry);
            }
            return evt.preventDefault();
          }
        });
        $(window).resize(function() {
          return _this.$el.scrollTop(_this.$el.scrollTop() + $('.current').parent().position().top);
        });
        this.listenTo(this.gameController, 'entry:is_correct', function(index) {
          var $entry, $nextEntry;
          $entry = _this.ui.entries.eq(index);
          $nextEntry = _this.ui.entries.eq(index + 1);
          $entry.removeClass('current focus').addClass('correct');
          if ($nextEntry) {
            $nextEntry.addClass('current focus');
            return _this.scrollToEntry($nextEntry);
          }
        });
        this.listenTo(this.gameController, 'entry:is_incorrect', function(index) {
          var $entry, $nextEntry;
          $entry = _this.ui.entries.eq(index);
          $nextEntry = _this.ui.entries.eq(index + 1);
          $entry.removeClass('current focus').addClass('incorrect');
          if ($nextEntry) {
            $nextEntry.addClass('current focus');
            return _this.scrollToEntry($nextEntry);
          }
        });
        return this.listenTo(this.gameController, 'entry:is_reset', function(index) {
          var $entry, $prevEntry;
          $entry = _this.ui.entries.eq(index);
          $prevEntry = _this.ui.entries.eq(index - 1);
          _this.ui.entries.removeClass('current focus');
          $entry.removeClass('correct incorrect').addClass('current focus');
          return _this.scrollToEntry($prevEntry);
        });
      };

      TypeZoneView.prototype.scrollToEntry = function($entry) {
        var _this = this;
        if ($entry.length && $entry.parent().position().top !== 0 && !this.animating) {
          this.animating = true;
          return this.$el.stop(true).animate({
            scrollTop: this.$el.scrollTop() + $entry.parent().position().top
          }, function() {
            return _this.animating = false;
          });
        }
      };

      TypeZoneView.prototype.focus = function(evt) {
        if (!this.focused) {
          console.log('focus typezone');
          this.focused = true;
          this.$('.current').addClass('focus');
          $('body').on('click', $.proxy(this.blur, this));
        }
        if (evt) {
          evt.preventDefault();
          return evt.stopPropagation();
        }
      };

      TypeZoneView.prototype.blur = function(e) {
        if (this.focused) {
          console.log('blur typezone');
          this.focused = false;
          this.$('.current').removeClass('focus');
          return $('body').off('click', $.proxy(this.blur, this));
        }
      };

      TypeZoneView.prototype.serializeData = function() {
        return {
          'entries': this.entries
        };
      };

      return TypeZoneView;

    })(Marionette.ItemView);
  });

}).call(this);
