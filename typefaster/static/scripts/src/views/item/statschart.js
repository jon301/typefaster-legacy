(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['jquery', 'underscore', 'templates', 'backbone', 'marionette', 'app', 'highcharts'], function($, _, JST, Backbone, Marionette, app) {
    'use strict';
    var StatsChartView, _ref;
    return StatsChartView = (function(_super) {
      __extends(StatsChartView, _super);

      function StatsChartView() {
        _ref = StatsChartView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      StatsChartView.prototype.el = '#statschart-view';

      StatsChartView.prototype.template = JST['typefaster/static/scripts/templates/statschart.ejs'];

      StatsChartView.prototype.model = new Backbone.Model();

      StatsChartView.prototype.modelEvents = {
        "change:stats": function() {
          return this.render();
        }
      };

      StatsChartView.prototype.initialize = function(options) {
        return this.initEventAggregator();
      };

      StatsChartView.prototype.initEventAggregator = function() {
        var _this = this;
        this.listenTo(app.vent, 'human:stats', function(stats) {
          return _this.model.set('stats', stats);
        });
        return this.listenTo(app.vent, 'keyboard:escape', function() {
          return this.$el.empty();
        });
      };

      StatsChartView.prototype.onRender = function() {};

      return StatsChartView;

    })(Marionette.ItemView);
  });

}).call(this);
