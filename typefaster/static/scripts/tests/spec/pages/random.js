(function() {
  define(['jquery', 'backbone'], function($, Backbone) {
    'use strict';
    return describe('random', function() {
      return it('1 should not equal 2', function() {
        var timer;
        1..should.not.equal(2);
        return timer = sinon.useFakeTimers();
      });
    });
  });

}).call(this);
