(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'templates', 'marionette', 'punycode', 'string_fromcodepoint'], function($, _, JST, Marionette, punycode) {
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
        console.group(evt.type);
        if (evt.originalEvent.constructor.name === 'KeyboardEvent') {
          console.log('keyCode=' + evt.keyCode + ' (' + String.fromCharCode(evt.keyCode) + ')');
          console.log('charCode=' + evt.charCode + ' (' + String.fromCharCode(evt.charCode) + ')');
          console.log('which=' + evt.which + ' (' + String.fromCharCode(evt.which) + ')');
          console.log('keyIdentifier=' + evt.originalEvent.keyIdentifier);
        } else if (evt.originalEvent.constructor.name === 'CompositionEvent') {
          console.log('data=' + (evt.data || evt.originalEvent.data));
        }
        return console.groupEnd();
      };

      TypeZoneView.prototype.onKeydown = function(evt) {
        var keyCode;
        this.debugEvent(evt);
        if (this.focused && evt.originalEvent !== undefined) {
          keyCode = evt.which;
          if (keyCode === 8) {
            return this.gameController.trigger('entry:deleted');
          }
        }
      };

      TypeZoneView.prototype.onKeyPress = function(evt) {
        var entry, keyCode;
        this.debugEvent(evt);
        if (this.focused && evt.originalEvent !== undefined) {
          keyCode = evt.which;
          entry = String.fromCodePoint(keyCode);
          if (entry) {
            return this.gameController.trigger('entry:typed', entry);
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
            return this.gameController.trigger('entry:typed', entry);
          }
        }
      };

      TypeZoneView.prototype.initialize = function(options) {
        this.entries = options.entries;
        return this.gameController = options.gameController;
      };

      TypeZoneView.prototype.onRender = function() {
        var _this = this;
        this.$el.show();
        this.focus();
        $('#typezone-container').on('click', $.proxy(this.focus, this));
        $(window).resize(function() {
          clearTimeout(_this.resizingTimeout);
          return _this.resizingTimeout = setTimeout(function() {
            return _this.scrollToEntry($('.current'));
          }, 200);
        });
        $(window).focus(function() {
          return _this.gameController.startListen();
        });
        $(window).blur(function() {
          _this.blur();
          return _this.gameController.stopListen();
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
        this.listenTo(this.gameController, 'entry:is_reset', function(index) {
          var $entry, $prevEntry;
          $entry = _this.ui.entries.eq(index);
          _this.ui.entries.removeClass('current focus');
          $entry.removeClass('correct incorrect').addClass('current focus');
          if (index !== 0) {
            $prevEntry = _this.ui.entries.eq(index - 1);
            return _this.scrollToEntry($prevEntry);
          }
        });
        return this.listenTo(this.gameController, 'human:stop', function() {
          return _this.disable();
        });
      };

      TypeZoneView.prototype.scrollToEntry = function($entry) {
        var _this = this;
        if ($entry.length && $entry.parent().position().top !== 0 && !this.animating) {
          this.animating = true;
          return this.ui.textarea.stop(true).animate({
            scrollTop: this.ui.textarea.scrollTop() + $entry.parent().position().top
          }, function() {
            return _this.animating = false;
          });
        }
      };

      TypeZoneView.prototype.disable = function() {
        this.disabled = true;
        this.ui.input.prop('disabled', true);
        return this.blur();
      };

      TypeZoneView.prototype.focus = function(evt) {
        this.ui.input.focus();
        if (!(this.focused || this.disabled)) {
          console.log('focus typezone');
          this.focused = true;
          this.$('.current').addClass('focus');
          $('#typezone-container').addClass('focus');
          $('body').on('click', $.proxy(this.blur, this));
        }
        if (evt) {
          evt.preventDefault();
          return evt.stopPropagation();
        }
      };

      TypeZoneView.prototype.blur = function(e) {
        this.ui.input.blur();
        if (this.focused) {
          console.log('blur typezone');
          this.focused = false;
          this.$('.current').removeClass('focus');
          $('#typezone-container').removeClass('focus');
          return $('body').off('click', $.proxy(this.blur, this));
        }
      };

      TypeZoneView.prototype.serializeData = function() {
        return {
          'entries': this.entries,
          'punycode': punycode
        };
      };

      return TypeZoneView;

    })(Marionette.ItemView);
  });

}).call(this);
