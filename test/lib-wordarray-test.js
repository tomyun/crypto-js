YUI.add('lib-wordarray-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'lib.WordArray',

        testInit0: function () {
            var expected = '';
            var actual = C.lib.WordArray.create();

            Y.Assert.areEqual(expected, actual);
        },

        testInit1: function () {
            var expected = '12345678';
            var actual = C.lib.WordArray.create([0x12345678]);

            Y.Assert.areEqual(expected, actual);
        },

        testInit2: function () {
            var expected = '1234';
            var actual = C.lib.WordArray.create([0x12345678], 2);

            Y.Assert.areEqual(expected, actual);
        },

        testToStringPassedEncoder: function () {
            var expected = 'Hello, World!';

            var wordArray = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var encoder = C.enc.Latin1;
            var actual = wordArray.toString(encoder);

            Y.Assert.areEqual(expected, actual);
        },

        testToStringDefaultEncoder: function () {
            var expected = '48656c6c6f2c20576f726c6421';
            var actual = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            Y.Assert.areEqual(expected, actual);
        },

        testConcat: function () {
            var expected = '616263616263';

            var wordArray1 = C.lib.WordArray.create([0x61626364], 3);
            var wordArray2 = C.lib.WordArray.create([0x61626364], 3);
            var actual = wordArray1.concat(wordArray2);

            Y.Assert.areEqual(expected, actual);
        },

        testClamp: function () {
            var expected = [0x61626300].toString();

            var wordArray = C.lib.WordArray.create([0x61626361, 0x62630000], 3);
            wordArray.clamp();
            var actual = wordArray.words;

            Y.Assert.areEqual(expected, actual);
        },

        testClone: function () {
            var wordArray = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            var unexpected = wordArray.toString();

            var wordArrayClone = wordArray.clone();
            wordArrayClone.words[0] = 0;

            Y.Assert.areNotEqual(unexpected, wordArrayClone);
        },

        testRandom: function () {
            var random1 = C.lib.WordArray.random(8).toString();
            var random2 = C.lib.WordArray.random(8).toString();

            Y.Assert.areNotEqual(random1, random2);
        },

        testRandomNBytes: function () {
            var expected = 8;
            var actual = C.lib.WordArray.random(8).sigBytes;

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
