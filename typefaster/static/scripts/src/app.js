(function(){define(["jquery","underscore","marionette","js_logger","jed","bootstrap"],function(a,b,c,d,e){var f;return f=null,function(){return null===f&&(f=new c.Application,f.addInitializer(function(){return a.i18n=new e("undefined"!=typeof json_locale_data&&null!==json_locale_data?{locale_data:json_locale_data,domain:"messages"}:{}),a._=a.proxy(a.i18n.gettext,a.i18n)}),f.addInitializer(function(){return d.useDefaults(),d.setLevel(d.OFF)})),f}()})}).call(this);