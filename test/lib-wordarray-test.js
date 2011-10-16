YUI.add('lib-wordarray-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'lib.WordArray',

        testInit0: function () {
            Y.Assert.areEqual('', C.lib.WordArray.create());
        },

        testInit1: function () {
            Y.Assert.areEqual('12345678', C.lib.WordArray.create([0x12345678]));
        },

        testInit2: function () {
            Y.Assert.areEqual('1234', C.lib.WordArray.create([0x12345678], 2));
        },

        testToStringPassedEncoder: function () {
            var wordArray = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            Y.Assert.areEqual('Hello, World!', wordArray.toString(C.enc.Latin1));
        },

        testToStringDefaultEncoder: function () {
            var wordArray = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            Y.Assert.areEqual('48656c6c6f2c20576f726c6421', wordArray);
        },

        testConcat: function () {
            var wordArray1 = C.lib.WordArray.create([0x61626364], 3);
            var wordArray2 = C.lib.WordArray.create([0x61626364], 3);

            Y.Assert.areEqual('616263616263', wordArray1.concat(wordArray2));
        },

        testClamp: function () {
            var wordArray = C.lib.WordArray.create([0x61626361, 0x62630000], 3);
            wordArray.clamp();

            Y.Assert.areEqual([0x61626300].toString(), wordArray.words);
        },

        testClone: function () {
            var wordArray = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var wordArrayClone = wordArray.clone();
            wordArrayClone.words[0] = 0;

            Y.Assert.areNotEqual(wordArray.toString(), wordArrayClone);
        },

        testRandom: function () {
            Y.Assert.areNotEqual(C.lib.WordArray.random(8).toString(), C.lib.WordArray.random(8).toString());
        },

        testRandomNBytes: function () {
            Y.Assert.areEqual(8, C.lib.WordArray.random(8).sigBytes);
        }
    }));
}, '$Rev$');
