(function(){var a={}.hasOwnProperty,b=function(b,c){function d(){this.constructor=b}for(var e in c)a.call(c,e)&&(b[e]=c[e]);return d.prototype=c.prototype,b.prototype=new d,b.__super__=c.prototype,b};define(["jquery","underscore","backbone","controllers/timer"],function(a,c,d,e){"use strict";var f,g;return f=function(d){function f(){return g=f.__super__.constructor.apply(this,arguments)}return b(f,d),f.prototype.ENTRY_CORRECT=1,f.prototype.ENTRY_INCORRECT=-1,f.prototype.ENTRY_TO_BE_FIXED=0,f.prototype.ENTRY_DELETED=2,f.prototype.entries="",f.prototype.correctEntries=0,f.prototype.incorrectEntries=0,f.prototype.fixedMistakes=0,f.prototype.currentIndex=0,f.prototype.entriesMap=[],f.prototype.initialize=function(a){return this.entries=a.entries,this.gameController=a.gameController,this.timer=new e},f.prototype.play=function(){return this.timer.start()},f.prototype.stop=function(){return this.timer.stop(),this.hasCheated()?console.log("You are a cheater"):console.log("You are not a cheater"),console.log(JSON.stringify(this.getStats()))},f.prototype.typeEntry=function(a){return a===this.entries[this.currentIndex]?(console.log("entry:is_correct",a,this.entries[this.currentIndex]),this.correctEntries++,this.entriesMap[this.currentIndex]===this.ENTRY_TO_BE_FIXED&&this.fixedMistakes++,this.entriesMap[this.currentIndex]=this.ENTRY_CORRECT,this.gameController.trigger("entry:is_correct",this.currentIndex)):(console.log("entry:is_incorrect",a,this.entries[this.currentIndex]),this.incorrectEntries++,this.entriesMap[this.currentIndex]=this.ENTRY_INCORRECT,this.gameController.trigger("entry:is_incorrect",this.currentIndex)),this.currentIndex++,this.entries.length===this.currentIndex?this.stop():void 0},f.prototype.deleteEntry=function(){return this.currentIndex>0?(this.currentIndex--,console.log("entry:is_reset",this.entries[this.currentIndex]),this.entriesMap[this.currentIndex]=this.entriesMap[this.currentIndex]===this.ENTRY_INCORRECT?this.ENTRY_TO_BE_FIXED:this.ENTRY_DELETED,this.gameController.trigger("entry:is_reset",this.currentIndex),!0):!1},f.prototype.getStats=function(){var a,b,c,d,e;return a=this.timer.getElapsedTime(),b=a/6e4,e=this.correctEntries+this.incorrectEntries,c=(this.incorrectEntries-this.fixedMistakes)/b,d=e/b/5,{elapsedTime:a,correctEntries:this.correctEntries,incorrectEntries:this.incorrectEntries,fixedMistakes:this.fixedMistakes,totalEntries:e,errorRate:c,rawSpeed:d,keySpeed:e/b,speed:d-c,accuracy:e?this.correctEntries/e*100:0}},f.prototype.hasCheated=function(){var b,d,e,f,g;return this.replayLogs?(e=c.pluck(this.replayLogs,"t"),e=a.map(e,function(a,b){return 0===b?null:a-e[b-1]}),console.log(e),e=c.uniq(e),e.length?(g=this.correctEntries+this.incorrectEntries,d=100-parseInt(e.length/g*100,10),f=c.reduce(e,function(a,b){return a+b}),b=parseInt(f/e.length,10),console.log("Intervals equal percentage: "+d),console.log("Average interval : "+b+"ms")):(d=0,b=0/0),d>70||50>b):void 0},f}(d.Model)})}).call(this);