(function() {
  define(["jquery", "backbone", "chai"], function($, Backbone, chai) {
    "use strict";
    var expect;
    expect = chai.expect;
    return describe("random", function() {
      return it('true is true', function() {
        return expect(true).to.be["true"];
      });
    });
  });

}).call(this);
