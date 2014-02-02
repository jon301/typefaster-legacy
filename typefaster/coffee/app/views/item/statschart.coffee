#global define
define (require) ->
    'use strict';

    # Module dependencies
    app = require 'app'

    $ = require 'jquery'
    _ = require 'underscore'
    JST = require 'templates'
    Backbone = require 'backbone'
    Marionette = require 'marionette'

    require 'highcharts'

    # Module definition
    class StatsChartView extends Marionette.ItemView
        el: '#statschart-view'
        template: JST['typefaster/static/scripts/templates/statschart.ejs']

        model: new Backbone.Model()

        modelEvents:
            "change:stats": () ->
                @render()

        initialize: (options) ->
            @initEventAggregator()

        initEventAggregator: ->
            @listenTo app.vent, 'human:stats', (stats) =>
                @model.set('stats', stats)

            @listenTo app.vent, 'keyboard:escape', () ->
                @$el.empty()

        onRender: () ->
