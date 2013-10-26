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

      TypeZoneView.prototype.initialize = function(options) {
        var _this = this;
        this.entries = options.entries;
        $(document).on('keydown', function(evt) {
          var keyCode;
          if (evt.originalEvent !== undefined) {
            keyCode = evt.which;
            if (keyCode === 8) {
              _this.trigger('entry:deleted');
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
              _this.trigger('entry:typed', entry);
            }
            return evt.preventDefault();
          }
        });
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
