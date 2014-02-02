#global define
define [
    'jquery',
    'underscore',
    'templates',
    'backbone',
    'marionette'
    'app',
    'highcharts'
    ], ($, _, JST, Backbone, Marionette, app) ->
    'use strict'

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
