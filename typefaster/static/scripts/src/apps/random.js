(function(){require(["jquery","underscore","templates","globals","app","views/item/typezone","views/item/statschart","controllers/game"],function(a,b,c,d,e,f,g,h){return e.addInitializer(function(){var a,b,c,d;return a="abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba",a="ㅍㅊㅁㄷ러ㅐㅕ",a="Iñtërnâtiônàlizætiøn☃💩",a="La grande porte s'ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s'enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d'une bombe atomique pensa David.",b=new h({entries:a,duration:60}),b.startListen(),d=new f({gameController:b}),d.render(),c=new g({gameController:b}),c.render()})})}).call(this);