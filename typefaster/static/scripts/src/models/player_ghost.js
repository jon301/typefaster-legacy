(function(){var a={}.hasOwnProperty,b=function(b,c){function d(){this.constructor=b}for(var e in c)a.call(c,e)&&(b[e]=c[e]);return d.prototype=c.prototype,b.prototype=new d,b.__super__=c.prototype,b};define(["jquery","underscore","models/player","controllers/timer"],function(a,c,d){"use strict";var e,f;return e=function(c){function d(){return f=d.__super__.constructor.apply(this,arguments)}return b(d,c),d.prototype.initialize=function(a){return d.__super__.initialize.call(this,a),this.replayLogs=a.replayLogs},d.prototype.play=function(){return d.__super__.play.call(this),this.replay()},d.prototype.stop=function(){return d.__super__.stop.call(this),clearTimeout(this.timeout)},d.prototype.replay=function(){return this.entryLog||(this.entryLog=this.replayLogs.shift()),this.timer.getElapsedTime()>=this.entryLog.t&&(-1===this.entryLog.v?this.deleteEntry():this.typeEntry(this.entryLog.v),this.entryLog=this.replayLogs.shift()),this.entryLog?this.timeout=setTimeout(a.proxy(this.replay,this),1):void 0},d}(d)})}).call(this);