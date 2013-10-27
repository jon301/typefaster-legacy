define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["typefaster/static/scripts/templates/statschart.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 if (typeof(stats) !== 'undefined') { ;
__p += '\n    <pre>' +
((__t = ( JSON.stringify(stats, null, 4) )) == null ? '' : __t) +
'</pre>\n';
 } ;
__p += '\n';

}
return __p
};

this["JST"]["typefaster/static/scripts/templates/test.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
__e( $.i18n.sprintf($._('hello world : %s'), my_var) );

}
return __p
};

this["JST"]["typefaster/static/scripts/templates/typezone.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {

 var wordsArray = entries.split(' ') ;
__p += '\n';
 _.each(wordsArray, function(word, wordIndex) { ;

 var entriesArray = word.split('') ;
__p += '<span class="word pull-left">';
 _.each(entriesArray, function(entry, entryIndex) { ;
__p += '<span class="entry';
 if (wordIndex === 0 && entryIndex === 0) { ;
__p += ' current';
 } ;
__p += '">' +
__e( entry ) +
'</span>';
 }) ;

 if (wordIndex < wordsArray.length - 1) { ;
__p += '<span class="entry">&nbsp;</span>';
 } ;
__p += '</span>';
 }) ;
__p += '\n<div class="clearfix"></div>\n';

}
return __p
};

  return this["JST"];

});