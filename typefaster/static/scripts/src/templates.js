define(function(){return this.JST=this.JST||{},this.JST["typefaster/static/scripts/templates/statschart.ejs"]=function(obj){obj||(obj={});{var __t,__p="";_.escape,Array.prototype.join}with(obj)"undefined"!=typeof stats&&(__p+="\n    <pre>"+(null==(__t=JSON.stringify(stats,null,4))?"":__t)+"</pre>\n"),__p+="\n";return __p},this.JST["typefaster/static/scripts/templates/test.ejs"]=function(obj){obj||(obj={});var __p="",__e=_.escape;with(obj)__p+=__e($.i18n.sprintf($._("hello world : %s"),my_var));return __p},this.JST["typefaster/static/scripts/templates/typezone.ejs"]=function(obj){obj||(obj={});{var __p="",__e=_.escape;Array.prototype.join}with(obj){__p+='<div class="typezone-text">\n    ';var wordsArray=entries.split(" ");__p+="\n    ",_.each(wordsArray,function(a,b){__p+='\n        <span class="word">\n            ';var c=punycode.ucs2.decode(a).length;__p+="\n            ";var d=0;for(__p+="\n            ";c>d;)__p+='\n                <span class="entry',0===b&&0===d&&(__p+=" current"),__p+='">'+__e(a.at(d))+"</span>\n                ",d++,__p+="\n            ";__p+="\n            ",b<wordsArray.length-1&&(__p+='\n                <span class="entry">&nbsp;</span>\n            '),__p+='\n            <div class="clearfix"></div>\n        </span>\n    '}),__p+='\n    <div class="clearfix"></div>\n</div>\n<input type="text" class="typezone-input" />\n'}return __p},this.JST});