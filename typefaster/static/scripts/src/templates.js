define(function(){

this["JST"] = this["JST"] || {};

this["JST"]["typefaster/static/scripts/templates/test.ejs"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p +=
__e( $.i18n.sprintf($._('hello world : %s'), my_var) );

}
return __p
};

  return this["JST"];

});