define ["jquery", "backbone", "chai"], ($, Backbone, chai) ->
    "use strict"

    expect = chai.expect

    describe "random", ->
        it 'true is true', () ->
                expect(true).to.be.true
