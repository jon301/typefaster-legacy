(function() {
  require(['jquery', 'underscore', 'templates', 'globals', 'app', 'views/item/typezone', 'views/item/statschart', 'controllers/game'], function($, _, JST, globals, app, TypeZoneView, StatsChartView, GameController) {
    return app.addInitializer(function() {
      var entries, gameController, statsChartView;
      entries = 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba';
      entries = 'ㅍㅊㅁㄷ러ㅐㅕ';
      entries = 'Iñtërnâtiônàlizætiøn☃💩';
      entries = 'bonjour comment allez vous moi je pense que je vais bien';
      entries = 'La grande porte s\'ouvrit lourdement en coulissant sur le côté gauche sans faire le moindre bruit. Derrière la porte, une nouvelle route, éclairée par de multiples projecteurs accrochés de chaque côtés, s\'enfonçait dans les profondeurs de cet ouvrage. Cette route était faite de zigzag incessant, certainement pour empêcher le souffle d\'une bombe atomique pensa David.';
      gameController = new GameController({
        entries: entries,
        duration: 60
      });
      gameController.startListen();
      gameController.addHuman();
      gameController.addGhost([
        {
          "t": 3,
          "v": "L"
        }, {
          "t": 191,
          "v": "a"
        }, {
          "t": 318,
          "v": " "
        }, {
          "t": 415,
          "v": "g"
        }, {
          "t": 581,
          "v": "r"
        }, {
          "t": 630,
          "v": "a"
        }, {
          "t": 663,
          "v": "n"
        }, {
          "t": 779,
          "v": "d"
        }, {
          "t": 926,
          "v": "e"
        }, {
          "t": 1009,
          "v": " "
        }, {
          "t": 1073,
          "v": "p"
        }, {
          "t": 1140,
          "v": "o"
        }, {
          "t": 1156,
          "v": "r"
        }, {
          "t": 1321,
          "v": "t"
        }, {
          "t": 1383,
          "v": "e"
        }, {
          "t": 1466,
          "v": " "
        }, {
          "t": 1580,
          "v": "s"
        }, {
          "t": 1727,
          "v": "'"
        }, {
          "t": 1793,
          "v": "o"
        }, {
          "t": 1858,
          "v": "u"
        }, {
          "t": 1942,
          "v": "v"
        }, {
          "t": 2070,
          "v": "r"
        }, {
          "t": 2141,
          "v": "i"
        }, {
          "t": 2260,
          "v": "t"
        }, {
          "t": 2343,
          "v": " "
        }, {
          "t": 2406,
          "v": "l"
        }, {
          "t": 2576,
          "v": "o"
        }, {
          "t": 2681,
          "v": "u"
        }, {
          "t": 2742,
          "v": "r"
        }, {
          "t": 2891,
          "v": "d"
        }, {
          "t": 3019,
          "v": "e"
        }, {
          "t": 3084,
          "v": "m"
        }, {
          "t": 3165,
          "v": "e"
        }, {
          "t": 3216,
          "v": "n"
        }, {
          "t": 3344,
          "v": "t"
        }, {
          "t": 3356,
          "v": " "
        }, {
          "t": 3481,
          "v": "e"
        }, {
          "t": 3558,
          "v": "n"
        }, {
          "t": 3623,
          "v": " "
        }, {
          "t": 3648,
          "v": "c"
        }, {
          "t": 3741,
          "v": "o"
        }, {
          "t": 3852,
          "v": "u"
        }, {
          "t": 4016,
          "v": "l"
        }, {
          "t": 4066,
          "v": "i"
        }, {
          "t": 4178,
          "v": "s"
        }, {
          "t": 4397,
          "v": "a"
        }, {
          "t": 4489,
          "v": "n"
        }, {
          "t": 4588,
          "v": "t"
        }, {
          "t": 4653,
          "v": " "
        }, {
          "t": 4735,
          "v": "s"
        }, {
          "t": 4784,
          "v": "u"
        }, {
          "t": 4866,
          "v": "r"
        }, {
          "t": 4964,
          "v": " "
        }, {
          "t": 4998,
          "v": "l"
        }, {
          "t": 5077,
          "v": "e"
        }, {
          "t": 5142,
          "v": " "
        }, {
          "t": 5852,
          "v": -1
        }, {
          "t": 5981,
          "v": -1
        }, {
          "t": 6142,
          "v": -1
        }, {
          "t": 6407,
          "v": -1
        }, {
          "t": 6536,
          "v": -1
        }, {
          "t": 6641,
          "v": -1
        }, {
          "t": 6777,
          "v": -1
        }, {
          "t": 6905,
          "v": -1
        }, {
          "t": 7033,
          "v": -1
        }, {
          "t": 7169,
          "v": -1
        }, {
          "t": 7303,
          "v": -1
        }, {
          "t": 7574,
          "v": " "
        }, {
          "t": 7732,
          "v": "s"
        }, {
          "t": 7871,
          "v": "a"
        }, {
          "t": 7910,
          "v": "n"
        }, {
          "t": 8016,
          "v": "t"
        }, {
          "t": 8047,
          "v": " "
        }, {
          "t": 8561,
          "v": -1
        }, {
          "t": 8706,
          "v": -1
        }, {
          "t": 8833,
          "v": -1
        }, {
          "t": 8960,
          "v": -1
        }, {
          "t": 9105,
          "v": -1
        }, {
          "t": 9234,
          "v": -1
        }, {
          "t": 9478,
          "v": "s"
        }, {
          "t": 9798,
          "v": "a"
        }, {
          "t": 9885,
          "v": "n"
        }, {
          "t": 9968,
          "v": "t"
        }, {
          "t": 10046,
          "v": " "
        }, {
          "t": 10149,
          "v": "s"
        }, {
          "t": 10213,
          "v": "u"
        }, {
          "t": 10304,
          "v": "r"
        }, {
          "t": 10366,
          "v": " "
        }, {
          "t": 10429,
          "v": "l"
        }, {
          "t": 10485,
          "v": "e"
        }, {
          "t": 10566,
          "v": " "
        }, {
          "t": 10670,
          "v": "c"
        }, {
          "t": 10886,
          "v": "ô"
        }, {
          "t": 10982,
          "v": "t"
        }, {
          "t": 11127,
          "v": "é"
        }, {
          "t": 11214,
          "v": " "
        }, {
          "t": 11318,
          "v": "g"
        }, {
          "t": 11381,
          "v": "a"
        }, {
          "t": 11428,
          "v": "u"
        }, {
          "t": 11535,
          "v": "c"
        }, {
          "t": 11605,
          "v": "h"
        }, {
          "t": 11671,
          "v": "e"
        }, {
          "t": 11745,
          "v": " "
        }, {
          "t": 11814,
          "v": "s"
        }, {
          "t": 11960,
          "v": "a"
        }, {
          "t": 12054,
          "v": "n"
        }, {
          "t": 12089,
          "v": "s"
        }, {
          "t": 12158,
          "v": " "
        }, {
          "t": 12245,
          "v": "f"
        }, {
          "t": 12310,
          "v": "a"
        }, {
          "t": 12351,
          "v": "i"
        }, {
          "t": 12469,
          "v": "r"
        }, {
          "t": 12490,
          "v": "e"
        }, {
          "t": 12527,
          "v": " "
        }, {
          "t": 12733,
          "v": "l"
        }, {
          "t": 12823,
          "v": "e"
        }, {
          "t": 12879,
          "v": " "
        }, {
          "t": 12973,
          "v": "m"
        }, {
          "t": 12978,
          "v": "o"
        }, {
          "t": 13045,
          "v": "i"
        }, {
          "t": 13174,
          "v": "n"
        }, {
          "t": 13246,
          "v": "d"
        }, {
          "t": 13415,
          "v": "r"
        }, {
          "t": 13437,
          "v": "e"
        }, {
          "t": 13519,
          "v": " "
        }, {
          "t": 13631,
          "v": "b"
        }, {
          "t": 13789,
          "v": "r"
        }, {
          "t": 13894,
          "v": "u"
        }, {
          "t": 14030,
          "v": "t"
        }, {
          "t": 14411,
          "v": -1
        }, {
          "t": 14638,
          "v": "i"
        }, {
          "t": 14734,
          "v": "t"
        }, {
          "t": 14839,
          "v": " "
        }, {
          "t": 15930,
          "v": -1
        }, {
          "t": 16288,
          "v": "."
        }, {
          "t": 16503,
          "v": " "
        }, {
          "t": 16686,
          "v": "D"
        }, {
          "t": 16855,
          "v": "e"
        }, {
          "t": 16893,
          "v": "r"
        }, {
          "t": 17035,
          "v": "r"
        }, {
          "t": 17110,
          "v": "i"
        }, {
          "t": 17254,
          "v": "è"
        }, {
          "t": 17322,
          "v": "r"
        }, {
          "t": 17341,
          "v": "e"
        }, {
          "t": 17416,
          "v": " "
        }, {
          "t": 17518,
          "v": "l"
        }, {
          "t": 17605,
          "v": "a"
        }, {
          "t": 17679,
          "v": " "
        }, {
          "t": 17822,
          "v": "p"
        }, {
          "t": 17914,
          "v": "o"
        }, {
          "t": 18029,
          "v": "r"
        }, {
          "t": 18230,
          "v": "t"
        }, {
          "t": 18278,
          "v": "e"
        }, {
          "t": 18497,
          "v": ","
        }, {
          "t": 18567,
          "v": " "
        }, {
          "t": 18719,
          "v": "u"
        }, {
          "t": 18903,
          "v": "n"
        }, {
          "t": 18976,
          "v": "e"
        }, {
          "t": 19063,
          "v": " "
        }, {
          "t": 19134,
          "v": "n"
        }, {
          "t": 19223,
          "v": "o"
        }, {
          "t": 19358,
          "v": "u"
        }, {
          "t": 19414,
          "v": "v"
        }, {
          "t": 19463,
          "v": "e"
        }, {
          "t": 19573,
          "v": "l"
        }, {
          "t": 19688,
          "v": "l"
        }, {
          "t": 19735,
          "v": "e"
        }, {
          "t": 19823,
          "v": " "
        }, {
          "t": 19895,
          "v": "r"
        }, {
          "t": 19951,
          "v": "o"
        }, {
          "t": 20035,
          "v": "u"
        }, {
          "t": 20098,
          "v": "t"
        }, {
          "t": 20148,
          "v": "e"
        }, {
          "t": 20263,
          "v": ","
        }, {
          "t": 20327,
          "v": " "
        }, {
          "t": 20527,
          "v": "e"
        }, {
          "t": 20812,
          "v": -1
        }, {
          "t": 20871,
          "v": "é"
        }, {
          "t": 21063,
          "v": "c"
        }, {
          "t": 21112,
          "v": "l"
        }, {
          "t": 21229,
          "v": "a"
        }, {
          "t": 21295,
          "v": "i"
        }, {
          "t": 21382,
          "v": "r"
        }, {
          "t": 21510,
          "v": "é"
        }, {
          "t": 21663,
          "v": "e"
        }, {
          "t": 21710,
          "v": " "
        }, {
          "t": 21812,
          "v": "p"
        }, {
          "t": 21902,
          "v": "a"
        }, {
          "t": 21963,
          "v": "r"
        }, {
          "t": 22064,
          "v": " "
        }, {
          "t": 22139,
          "v": "d"
        }, {
          "t": 22262,
          "v": "e"
        }, {
          "t": 22352,
          "v": " "
        }, {
          "t": 22407,
          "v": "m"
        }, {
          "t": 22629,
          "v": "l"
        }, {
          "t": 22735,
          "v": "t"
        }, {
          "t": 22997,
          "v": -1
        }, {
          "t": 23168,
          "v": -1
        }, {
          "t": 23532,
          "v": "u"
        }, {
          "t": 23550,
          "v": "l"
        }, {
          "t": 23709,
          "v": "t"
        }, {
          "t": 23774,
          "v": "i"
        }, {
          "t": 23910,
          "v": "p"
        }, {
          "t": 24045,
          "v": "l"
        }, {
          "t": 24133,
          "v": "e"
        }, {
          "t": 24282,
          "v": "s"
        }, {
          "t": 24326,
          "v": " "
        }, {
          "t": 24398,
          "v": "p"
        }, {
          "t": 24517,
          "v": "r"
        }, {
          "t": 24565,
          "v": "o"
        }, {
          "t": 24646,
          "v": "j"
        }, {
          "t": 24735,
          "v": "e"
        }, {
          "t": 24926,
          "v": "c"
        }, {
          "t": 25093,
          "v": "t"
        }, {
          "t": 25197,
          "v": "e"
        }, {
          "t": 25285,
          "v": "u"
        }, {
          "t": 25501,
          "v": "s"
        }, {
          "t": 25789,
          "v": -1
        }, {
          "t": 25901,
          "v": "r"
        }, {
          "t": 26062,
          "v": "s"
        }, {
          "t": 26221,
          "v": " "
        }, {
          "t": 26350,
          "v": "a"
        }, {
          "t": 26497,
          "v": "c"
        }, {
          "t": 26687,
          "v": "c"
        }, {
          "t": 26855,
          "v": "r"
        }, {
          "t": 26950,
          "v": "o"
        }, {
          "t": 27046,
          "v": "c"
        }, {
          "t": 27098,
          "v": "h"
        }, {
          "t": 27238,
          "v": "é"
        }, {
          "t": 27413,
          "v": "s"
        }, {
          "t": 27513,
          "v": " "
        }, {
          "t": 27574,
          "v": "d"
        }, {
          "t": 27727,
          "v": "e"
        }, {
          "t": 27800,
          "v": " "
        }, {
          "t": 27902,
          "v": "c"
        }, {
          "t": 27958,
          "v": "h"
        }, {
          "t": 28086,
          "v": "a"
        }, {
          "t": 28229,
          "v": "q"
        }, {
          "t": 28270,
          "v": "u"
        }, {
          "t": 28425,
          "v": "e"
        }, {
          "t": 28555,
          "v": " "
        }, {
          "t": 28646,
          "v": "c"
        }, {
          "t": 28909,
          "v": "ô"
        }, {
          "t": 29006,
          "v": "t"
        }, {
          "t": 29166,
          "v": "é"
        }, {
          "t": 29366,
          "v": "s"
        }, {
          "t": 29477,
          "v": ","
        }, {
          "t": 29571,
          "v": " "
        }, {
          "t": 29606,
          "v": "s"
        }, {
          "t": 29766,
          "v": "'"
        }, {
          "t": 29899,
          "v": "e"
        }, {
          "t": 29998,
          "v": "n"
        }, {
          "t": 30040,
          "v": "f"
        }, {
          "t": 30149,
          "v": "o"
        }, {
          "t": 30197,
          "v": "n"
        }, {
          "t": 30375,
          "v": "ç"
        }, {
          "t": 30469,
          "v": "a"
        }, {
          "t": 30558,
          "v": "i"
        }, {
          "t": 30655,
          "v": "t"
        }, {
          "t": 30734,
          "v": " "
        }, {
          "t": 30856,
          "v": "d"
        }, {
          "t": 30981,
          "v": "a"
        }, {
          "t": 31054,
          "v": "n"
        }, {
          "t": 31118,
          "v": "s"
        }, {
          "t": 31213,
          "v": " "
        }, {
          "t": 31258,
          "v": "l"
        }, {
          "t": 31342,
          "v": "e"
        }, {
          "t": 31478,
          "v": "s"
        }, {
          "t": 31534,
          "v": " "
        }, {
          "t": 31565,
          "v": "p"
        }, {
          "t": 31685,
          "v": "r"
        }, {
          "t": 31727,
          "v": "o"
        }, {
          "t": 31823,
          "v": "f"
        }, {
          "t": 31870,
          "v": "o"
        }, {
          "t": 31917,
          "v": "n"
        }, {
          "t": 32022,
          "v": "d"
        }, {
          "t": 32157,
          "v": "e"
        }, {
          "t": 32237,
          "v": "u"
        }, {
          "t": 32310,
          "v": "r"
        }, {
          "t": 32423,
          "v": "s"
        }, {
          "t": 32479,
          "v": " "
        }, {
          "t": 32592,
          "v": "d"
        }, {
          "t": 32717,
          "v": "e"
        }, {
          "t": 32789,
          "v": " "
        }, {
          "t": 32862,
          "v": "c"
        }, {
          "t": 32981,
          "v": "e"
        }, {
          "t": 33061,
          "v": "t"
        }, {
          "t": 33144,
          "v": " "
        }, {
          "t": 33229,
          "v": "o"
        }, {
          "t": 33278,
          "v": "u"
        }, {
          "t": 33326,
          "v": "v"
        }, {
          "t": 33477,
          "v": "r"
        }, {
          "t": 33518,
          "v": "a"
        }, {
          "t": 33638,
          "v": "g"
        }, {
          "t": 33697,
          "v": "E"
        }, {
          "t": 33760,
          "v": "."
        }, {
          "t": 33918,
          "v": " "
        }, {
          "t": 34029,
          "v": "c"
        }, {
          "t": 34569,
          "v": -1
        }, {
          "t": 34694,
          "v": "C"
        }, {
          "t": 34841,
          "v": "e"
        }, {
          "t": 34951,
          "v": "t"
        }, {
          "t": 35080,
          "v": "t"
        }, {
          "t": 35141,
          "v": "e"
        }, {
          "t": 35238,
          "v": " "
        }, {
          "t": 35325,
          "v": "r"
        }, {
          "t": 35357,
          "v": "o"
        }, {
          "t": 35429,
          "v": "u"
        }, {
          "t": 35507,
          "v": "t"
        }, {
          "t": 35550,
          "v": "e"
        }, {
          "t": 35623,
          "v": " "
        }, {
          "t": 35734,
          "v": "é"
        }, {
          "t": 35893,
          "v": "t"
        }, {
          "t": 35959,
          "v": "a"
        }, {
          "t": 36006,
          "v": "i"
        }, {
          "t": 36070,
          "v": "t"
        }, {
          "t": 36151,
          "v": " "
        }, {
          "t": 36293,
          "v": "f"
        }, {
          "t": 36327,
          "v": "a"
        }, {
          "t": 36406,
          "v": "i"
        }, {
          "t": 36486,
          "v": "t"
        }, {
          "t": 36533,
          "v": "e"
        }, {
          "t": 36605,
          "v": " "
        }, {
          "t": 36687,
          "v": "d"
        }, {
          "t": 36814,
          "v": "e"
        }, {
          "t": 36885,
          "v": " "
        }, {
          "t": 36998,
          "v": "z"
        }, {
          "t": 37107,
          "v": "i"
        }, {
          "t": 37205,
          "v": "g"
        }, {
          "t": 37359,
          "v": "a"
        }, {
          "t": 37677,
          "v": "g"
        }, {
          "t": 37862,
          "v": " "
        }, {
          "t": 38374,
          "v": "i"
        }, {
          "t": 38408,
          "v": "n"
        }, {
          "t": 38494,
          "v": "c"
        }, {
          "t": 38534,
          "v": "e"
        }, {
          "t": 38663,
          "v": "s"
        }, {
          "t": 38814,
          "v": "s"
        }, {
          "t": 39430,
          "v": "s"
        }, {
          "t": 39566,
          "v": "a"
        }, {
          "t": 39654,
          "v": "n"
        }, {
          "t": 39741,
          "v": "t"
        }, {
          "t": 39829,
          "v": ","
        }, {
          "t": 39925,
          "v": " "
        }, {
          "t": 40037,
          "v": "c"
        }, {
          "t": 40197,
          "v": "e"
        }, {
          "t": 40262,
          "v": "r"
        }, {
          "t": 40437,
          "v": "t"
        }, {
          "t": 40494,
          "v": "a"
        }, {
          "t": 40509,
          "v": "i"
        }, {
          "t": 40558,
          "v": "n"
        }, {
          "t": 40653,
          "v": "e"
        }, {
          "t": 40701,
          "v": "m"
        }, {
          "t": 40782,
          "v": "e"
        }, {
          "t": 40839,
          "v": "n"
        }, {
          "t": 40933,
          "v": "t"
        }, {
          "t": 40981,
          "v": " "
        }, {
          "t": 41061,
          "v": "p"
        }, {
          "t": 41109,
          "v": "o"
        }, {
          "t": 41189,
          "v": "u"
        }, {
          "t": 41285,
          "v": "r"
        }, {
          "t": 41358,
          "v": " "
        }, {
          "t": 41469,
          "v": "e"
        }, {
          "t": 41918,
          "v": "m"
        }, {
          "t": 42125,
          "v": "p"
        }, {
          "t": 42406,
          "v": "ê"
        }, {
          "t": 42533,
          "v": "c"
        }, {
          "t": 42605,
          "v": "h"
        }, {
          "t": 42702,
          "v": "e"
        }, {
          "t": 42797,
          "v": "r"
        }, {
          "t": 42839,
          "v": " "
        }, {
          "t": 42886,
          "v": "l"
        }, {
          "t": 43062,
          "v": " "
        }, {
          "t": 43351,
          "v": -1
        }, {
          "t": 43462,
          "v": "e"
        }, {
          "t": 43549,
          "v": " "
        }, {
          "t": 43658,
          "v": "s"
        }, {
          "t": 43710,
          "v": "o"
        }, {
          "t": 43774,
          "v": "u"
        }, {
          "t": 43901,
          "v": "f"
        }, {
          "t": 43990,
          "v": "l"
        }, {
          "t": 44038,
          "v": "f"
        }, {
          "t": 44396,
          "v": -1
        }, {
          "t": 44531,
          "v": -1
        }, {
          "t": 44654,
          "v": "f"
        }, {
          "t": 44717,
          "v": "l"
        }, {
          "t": 44805,
          "v": "e"
        }, {
          "t": 44885,
          "v": " "
        }, {
          "t": 44981,
          "v": "d"
        }, {
          "t": 45127,
          "v": "'"
        }, {
          "t": 45197,
          "v": "u"
        }, {
          "t": 45373,
          "v": "n"
        }, {
          "t": 45413,
          "v": "e"
        }, {
          "t": 45542,
          "v": " "
        }, {
          "t": 45597,
          "v": "b"
        }, {
          "t": 45685,
          "v": "o"
        }, {
          "t": 45765,
          "v": "m"
        }, {
          "t": 45909,
          "v": "b"
        }, {
          "t": 45973,
          "v": "e"
        }, {
          "t": 46110,
          "v": " "
        }, {
          "t": 46183,
          "v": "a"
        }, {
          "t": 46255,
          "v": "t"
        }, {
          "t": 46318,
          "v": "o"
        }, {
          "t": 46461,
          "v": "m"
        }, {
          "t": 46565,
          "v": "i"
        }, {
          "t": 47198,
          "v": "q"
        }, {
          "t": 47261,
          "v": "u"
        }, {
          "t": 47351,
          "v": "e"
        }, {
          "t": 47421,
          "v": " "
        }, {
          "t": 47470,
          "v": "p"
        }, {
          "t": 47638,
          "v": "e"
        }, {
          "t": 47654,
          "v": "n"
        }, {
          "t": 47781,
          "v": "s"
        }, {
          "t": 47949,
          "v": "a"
        }, {
          "t": 48069,
          "v": " "
        }, {
          "t": 48286,
          "v": "D"
        }, {
          "t": 48453,
          "v": "a"
        }, {
          "t": 48573,
          "v": "v"
        }, {
          "t": 48622,
          "v": "i"
        }, {
          "t": 48742,
          "v": "d"
        }, {
          "t": 48878,
          "v": "."
        }
      ]);
      statsChartView = new StatsChartView({
        gameController: gameController
      });
      return statsChartView.render();
    });
  });

}).call(this);
