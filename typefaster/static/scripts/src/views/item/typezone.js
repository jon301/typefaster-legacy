(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'templates', 'marionette', 'js_logger', 'punycode', 'app', 'string_fromcodepoint'], function($, _, JST, Marionette, Logger, punycode, app) {
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
        'click .typezone-panel': 'focus',
        'keydown .typezone-input': 'onKeydown',
        'keypress .typezone-input': 'onKeyPress',
        'compositionstart .typezone-input': 'onCompositionStart',
        'compositionend .typezone-input': 'onCompositionEnd'
      };

      TypeZoneView.prototype.debugEvent = function(evt) {
        if (evt.originalEvent.constructor.name === 'KeyboardEvent') {
          return this.logger.debug(evt.type, 'keyCode=' + evt.keyCode + ' (' + String.fromCharCode(evt.keyCode) + ')', 'charCode=' + evt.charCode + ' (' + String.fromCharCode(evt.charCode) + ')', 'which=' + evt.which + ' (' + String.fromCharCode(evt.which) + ')', 'keyIdentifier=' + evt.originalEvent.keyIdentifier);
        } else if (evt.originalEvent.constructor.name === 'CompositionEvent') {
          return this.logger.debug(evt.type, 'data=' + (evt.data || evt.originalEvent.data));
        }
      };

      TypeZoneView.prototype.onKeydown = function(evt) {
        var keyCode;
        this.debugEvent(evt);
        if (this.$el.hasClass('focus') && evt.originalEvent !== undefined) {
          keyCode = evt.which;
          if (keyCode === 8) {
            app.vent.trigger('keyboard:backspace');
          }
          if (keyCode === 27) {
            app.vent.trigger('keyboard:escape');
            return this.reset();
          }
        }
      };

      TypeZoneView.prototype.onKeyPress = function(evt) {
        var entry, keyCode;
        this.debugEvent(evt);
        if (this.$el.hasClass('focus') && evt.originalEvent !== undefined) {
          keyCode = evt.which;
          entry = String.fromCodePoint(keyCode);
          if (entry && keyCode && keyCode !== 8 && keyCode !== 27) {
            return app.vent.trigger('keyboard:char', entry);
          }
        }
      };

      TypeZoneView.prototype.onCompositionStart = function(evt) {
        this.debugEvent(evt);
        return this.ui.entries.filter('.current').addClass('composition');
      };

      TypeZoneView.prototype.onCompositionEnd = function(evt) {
        var entry;
        this.debugEvent(evt);
        this.ui.entries.filter('.current').removeClass('composition');
        if (this.$el.hasClass('focus') && evt.originalEvent !== undefined) {
          entry = evt.data || evt.originalEvent.data;
          if (entry) {
            return app.vent.trigger('keyboard:char', entry);
          }
        }
      };

      TypeZoneView.prototype.initialize = function(options) {
        this.entries = options.entries;
        this.logger = Logger.get('TypeZoneView');
        return this.initEventAggregator();
      };

      TypeZoneView.prototype.initEventAggregator = function() {
        var _this = this;
        this.listenTo(app.vent, 'entry:is_correct', function(player, index) {
          var $entry, $nextEntry;
          $entry = _this.ui.entries.eq(index);
          $nextEntry = _this.ui.entries.eq(index + 1);
          if (player.getType() === 'human') {
            $entry.removeClass('current').addClass('correct');
            if ($nextEntry) {
              $nextEntry.addClass('current');
              return _this.scrollToEntry($nextEntry);
            }
          } else {
            $entry.css('borderColor', 'transparent');
            if ($nextEntry) {
              return $nextEntry.css('borderColor', player.getColor());
            }
          }
        });
        this.listenTo(app.vent, 'entry:is_incorrect', function(player, index) {
          var $entry, $nextEntry;
          $entry = _this.ui.entries.eq(index);
          $nextEntry = _this.ui.entries.eq(index + 1);
          if (player.getType() === 'human') {
            $entry.removeClass('current').addClass('incorrect');
            if ($nextEntry) {
              $nextEntry.addClass('current');
              return _this.scrollToEntry($nextEntry);
            }
          } else {
            $entry.css('borderColor', 'transparent');
            if ($nextEntry) {
              return $nextEntry.css('borderColor', player.getColor());
            }
          }
        });
        this.listenTo(app.vent, 'entry:is_reset', function(player, index) {
          var $entry, $prevEntry;
          $entry = _this.ui.entries.eq(index);
          if (player.getType() === 'human') {
            _this.ui.entries.removeClass('current');
            $entry.removeClass('correct incorrect').addClass('current');
            if (index !== 0) {
              $prevEntry = _this.ui.entries.eq(index - 1);
              return _this.scrollToEntry($prevEntry, $entry);
            }
          } else {
            _this.ui.entries.css('borderColor', 'transparent');
            return $entry.css('borderColor', player.getColor());
          }
        });
        this.listenTo(app.vent, 'player:add', function(player) {
          var $entry;
          $entry = _this.ui.entries.eq(0);
          if (player.getType() === 'human') {
            return $entry.addClass('current');
          } else {
            return $entry.css('borderColor', player.getColor());
          }
        });
        return this.listenTo(app.vent, 'human:stop', function() {
          return _this.disable();
        });
      };

      TypeZoneView.prototype.onRender = function() {
        var _this = this;
        this.$el.show();
        this.focus();
        $(window).on('resize.typezone', function() {
          clearTimeout(_this.resizingTimeout);
          return _this.resizingTimeout = setTimeout(function() {
            return _this.scrollToEntry($('.current'));
          }, 200);
        });
        return $(window).on('blur.typezone', function() {
          return _this.blur();
        });
      };

      TypeZoneView.prototype.scrollToEntry = function($entry, $focusEntry) {
        var _this = this;
        if (!$focusEntry) {
          $focusEntry = $entry;
        }
        if ($entry.length && $entry.position().top !== 0 && !this.animating) {
          this.animating = true;
          return this.ui.textarea.stop(true).animate({
            scrollTop: this.ui.textarea.scrollTop() + $entry.position().top
          }, function() {
            _this.animating = false;
            return _this.ui.input.offset($focusEntry.offset());
          });
        } else {
          return this.ui.input.offset($focusEntry.offset());
        }
      };

      TypeZoneView.prototype.disable = function(evt) {
        this.undelegateEvents();
        return this.blur();
      };

      TypeZoneView.prototype.reset = function() {
        var firstEntry;
        this.delegateEvents();
        this.ui.entries.removeClass('correct incorrect current');
        this.ui.input.val('');
        firstEntry = this.ui.entries.eq(0);
        firstEntry.addClass('current');
        this.scrollToEntry(firstEntry);
        this.ui.entries.css('borderColor', 'transparent');
        firstEntry.css('borderColor', 'red');
        return this.focus();
      };

      TypeZoneView.prototype.focus = function(evt) {
        this.ui.input.focus();
        if (!this.$el.hasClass('focus')) {
          this.logger.debug('focus typezone');
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
        if (this.$el.hasClass('focus')) {
          this.logger.debug('blur typezone');
          this.$('.current').removeClass('focus');
          this.$el.removeClass('focus');
          return $('body').off('click.typezone', $.proxy(this.blur, this));
        }
      };

      TypeZoneView.prototype.serializeData = function() {
        return {
          'entries': this.entries,
          'punycode': punycode
        };
      };

      TypeZoneView.prototype.onClose = function() {
        $(window).off('.typezone');
        return $('body').off('.typezone');
      };

      return TypeZoneView;

    })(Marionette.ItemView);
  });

}).call(this);
