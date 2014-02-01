#global define
define (require) ->
    'use strict';

    # Module dependencies
    $ = require('jquery');
    _ = require('underscore');
    JST = require('templates');
    Backbone = require('backbone');
    Marionette = require('marionette');
    require('highcharts');

    # Module definition
    class StatsChartView extends Marionette.ItemView
        el: '#statschart-view'
        template: JST['typefaster/static/scripts/templates/statschart.ejs']

        model: new Backbone.Model()

        modelEvents:
            "change:stats": () ->
                @render()

        initialize: (options) ->
            @gameController = options.gameController

            @listenTo @gameController, 'human:stats', (stats) =>
                @model.set('stats', stats)

            @listenTo @gameController, 'keyboard:escape', () ->
                @.$el.empty()

        onRender: () ->
