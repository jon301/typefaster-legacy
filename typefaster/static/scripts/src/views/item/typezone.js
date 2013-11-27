(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'templates', 'marionette', 'js_logger', 'punycode', 'string_fromcodepoint'], function($, _, JST, Marionette, Logger, punycode) {
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
        entries: '.entry',
        textarea: '.typezone-text',
        input: '.typezone-input'
      };

      TypeZoneView.prototype.events = {
        'keydown .typezone-input': 'onKeydown',
        'keypress .typezone-input': 'onKeyPress',
        'compositionstart .typezone-input': 'onCompositionStart',
        'compositionend .typezone-input': 'onCompositionEnd'
      };

      TypeZoneView.prototype.debugEvent = function(evt) {
        this.logger.debug(evt.type);
        if (evt.originalEvent.constructor.name === 'KeyboardEvent') {
          this.logger.debug('keyCode=' + evt.keyCode + ' (' + String.fromCharCode(evt.keyCode) + ')');
          this.logger.debug('charCode=' + evt.charCode + ' (' + String.fromCharCode(evt.charCode) + ')');
          this.logger.debug('which=' + evt.which + ' (' + String.fromCharCode(evt.which) + ')');
          return this.logger.debug('keyIdentifier=' + evt.originalEvent.keyIdentifier);
        } else if (evt.originalEvent.constructor.name === 'CompositionEvent') {
          return this.logger.debug('data=' + (evt.data || evt.originalEvent.data));
        }
      };

      TypeZoneView.prototype.onKeydown = function(evt) {
        var keyCode;
        this.debugEvent(evt);
        if (this.focused && evt.originalEvent !== undefined) {
          keyCode = evt.which;
          if (keyCode === 8) {
            this.gameController.trigger('keyboard:backspace');
          }
          if (keyCode === 27) {
            this.gameController.trigger('keyboard:escape');
            return this.reset();
          }
        }
      };

      TypeZoneView.prototype.onKeyPress = function(evt) {
        var entry, keyCode;
        this.debugEvent(evt);
        if (this.focused && evt.originalEvent !== undefined) {
          keyCode = evt.which;
          entry = String.fromCodePoint(keyCode);
          if (entry && keyCode && keyCode !== 8 && keyCode !== 27) {
            return this.gameController.trigger('keyboard:char', entry);
          }
        }
      };

      TypeZoneView.prototype.onCompositionStart = function(evt) {
        this.debugEvent(evt);
        return this.ui.entries.filter('.focus').addClass('composition');
      };

      TypeZoneView.prototype.onCompositionEnd = function(evt) {
        var entry;
        this.debugEvent(evt);
        this.ui.entries.filter('.focus').removeClass('composition');
        if (this.focused && evt.originalEvent !== undefined) {
          entry = evt.data || evt.originalEvent.data;
          if (entry) {
            return this.gameController.trigger('keyboard:char', entry);
          }
        }
      };

      TypeZoneView.prototype.initialize = function(options) {
        this.logger = Logger.get('TypeZoneView');
        return this.gameController = options.gameController;
      };

      TypeZoneView.prototype.onRender = function() {
        var _this = this;
        this.$el.show();
        $('#typezone-container').on('click.typezone', $.proxy(this.focus, this));
        $(window).on('resize.typezone', function() {
          clearTimeout(_this.resizingTimeout);
          return _this.resizingTimeout = setTimeout(function() {
            return _this.scrollToEntry($('.current'));
          }, 200);
        });
        $(window).on('blur.typezone', function() {
          return _this.blur();
        });
        this.listenTo(this.gameController, 'entry:is_correct', function(player, index) {
          var $entry, $nextEntry;
          $entry = _this.ui.entries.eq(index);
          $nextEntry = _this.ui.entries.eq(index + 1);
          if (player.getType() === 'human') {
            $entry.removeClass('current focus').addClass('correct');
            if ($nextEntry) {
              $nextEntry.addClass('current focus');
              return _this.scrollToEntry($nextEntry);
            }
          } else {
            $entry.css('borderColor', 'transparent');
            if ($nextEntry) {
              return $nextEntry.css('borderColor', player.getColor());
            }
          }
        });
        this.listenTo(this.gameController, 'entry:is_incorrect', function(player, index) {
          var $entry, $nextEntry;
          $entry = _this.ui.entries.eq(index);
          $nextEntry = _this.ui.entries.eq(index + 1);
          if (player.getType() === 'human') {
            $entry.removeClass('current focus').addClass('incorrect');
            if ($nextEntry) {
              $nextEntry.addClass('current focus');
              return _this.scrollToEntry($nextEntry);
            }
          } else {
            $entry.css('borderColor', 'transparent');
            if ($nextEntry) {
              return $nextEntry.css('borderColor', player.getColor());
            }
          }
        });
        this.listenTo(this.gameController, 'entry:is_reset', function(player, index) {
          var $entry, $prevEntry;
          $entry = _this.ui.entries.eq(index);
          if (player.getType() === 'human') {
            _this.ui.entries.removeClass('current focus');
            $entry.removeClass('correct incorrect').addClass('current focus');
            if (index !== 0) {
              $prevEntry = _this.ui.entries.eq(index - 1);
              return _this.scrollToEntry($prevEntry);
            }
          } else {
            _this.ui.entries.css('borderColor', 'transparent');
            return $entry.css('borderColor', player.getColor());
          }
        });
        this.listenTo(this.gameController, 'player:add', function(player) {
          var $entry;
          $entry = _this.ui.entries.eq(0);
          if (player.getType() === 'human') {
            $entry.addClass('current');
            return _this.focus();
          } else {
            return $entry.css('borderColor', player.getColor());
          }
        });
        return this.listenTo(this.gameController, 'human:stop', function() {
          return _this.disable();
        });
      };

      TypeZoneView.prototype.scrollToEntry = function($entry) {
        var _this = this;
        if ($entry.length && $entry.position().top !== 0 && !this.animating) {
          this.animating = true;
          return this.ui.textarea.stop(true).animate({
            scrollTop: this.ui.textarea.scrollTop() + $entry.position().top
          }, function() {
            _this.animating = false;
            return _this.ui.input.offset($entry.offset());
          });
        } else {
          return this.ui.input.offset($entry.offset());
        }
      };

      TypeZoneView.prototype.reset = function() {
        var firstEntry;
        this.ui.entries.removeClass('correct incorrect focus current');
        this.ui.input.val('');
        this.disabled = false;
        this.focused = false;
        firstEntry = this.ui.entries.eq(0);
        firstEntry.addClass('current');
        this.scrollToEntry(firstEntry);
        return this.focus();
      };

      TypeZoneView.prototype.disable = function() {
        this.disabled = true;
        return this.blur();
      };

      TypeZoneView.prototype.focus = function(evt) {
        this.ui.input.focus();
        if (!(this.focused || this.disabled)) {
          this.logger.debug('focus typezone');
          this.focused = true;
          this.gameController.startListen();
          this.$('.current').addClass('focus');
          this.$el.addClass('focus');
          this.ui.input.offset(this.$('.current').offset());
          $('body').on('click.typezone', $.proxy(this.blur, this));
        }
        if (evt) {
          evt.preventDefault();
          return evt.stopPropagation();
        }
      };

      TypeZoneView.prototype.blur = function(evt) {
        if (this.focused) {
          this.logger.debug('blur typezone');
          this.focused = false;
          this.gameController.stopListen();
          this.$('.current').removeClass('focus');
          this.$el.removeClass('focus');
          return $('body').off('click.typezone', $.proxy(this.blur, this));
        }
      };

      TypeZoneView.prototype.serializeData = function() {
        return {
          'entries': this.gameController.entries,
          'punycode': punycode
        };
      };

      TypeZoneView.prototype.onClose = function() {
        $('#typezone-container').off('.typezone');
        $(window).off('.typezone');
        return $('body').off('.typezone');
      };

      return TypeZoneView;

    })(Marionette.ItemView);
  });

}).call(this);
