#global define
define [
    'jquery',
    'underscore',
    'templates',
    'backbone',
    'marionette'
    'highcharts'
    ], ($, _, JST, Backbone, Marionette) ->

    'use strict'

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
                console.log 'human:stats', stats
                @model.set('stats', stats)

        onRender: () ->
