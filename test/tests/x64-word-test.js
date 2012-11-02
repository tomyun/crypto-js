YUI.add('x64-word-test', function (Y) {
    var C = CryptoJS;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'X64Word',

        testInit: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607);

            Y.Assert.areEqual(0x00010203, word.high, 'high');
            Y.Assert.areEqual(0x04050607, word.low, 'low');
        }

        /*
        testNot: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).not();

            Y.Assert.areEqual(~0x00010203, word.high, 'high');
            Y.Assert.areEqual(~0x04050607, word.low, 'low');
        },
        */

        /*
        testAnd: function () {
            var word1 = C.x64.Word.create(0x00010203, 0x04050607);
            var word2 = C.x64.Word.create(0x18191a1b, 0x1c1d1e1f);
            var anded = word1.and(word2);

            Y.Assert.areEqual(0x00010203 & 0x18191a1b, anded.high, 'high');
            Y.Assert.areEqual(0x04050607 & 0x1c1d1e1f, anded.low, 'low');
        },
        */

        /*
        testOr: function () {
            var word1 = C.x64.Word.create(0x00010203, 0x04050607);
            var word2 = C.x64.Word.create(0x18191a1b, 0x1c1d1e1f);
            var ored = word1.or(word2);

            Y.Assert.areEqual(0x00010203 | 0x18191a1b, ored.high, 'high');
            Y.Assert.areEqual(0x04050607 | 0x1c1d1e1f, ored.low, 'low');
        },
        */

        /*
        testXor: function () {
            var word1 = C.x64.Word.create(0x00010203, 0x04050607);
            var word2 = C.x64.Word.create(0x18191a1b, 0x1c1d1e1f);
            var xored = word1.xor(word2);

            Y.Assert.areEqual(0x00010203 ^ 0x18191a1b, xored.high, 'high');
            Y.Assert.areEqual(0x04050607 ^ 0x1c1d1e1f, xored.low, 'low');
        },
        */

        /*
        testShiftL25: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).shiftL(25);

            Y.Assert.areEqual(0x06080a0c, word.high, 'high');
            Y.Assert.areEqual(0x0e000000, word.low, 'low');
        },
        */

        /*
        testShiftL32: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).shiftL(32);

            Y.Assert.areEqual(0x04050607, word.high, 'high');
            Y.Assert.areEqual(0x00000000, word.low, 'low');
        },
        */

        /*
        testShiftR7: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).shiftR(7);

            Y.Assert.areEqual(0x00000204, word.high, 'high');
            Y.Assert.areEqual(0x06080a0c, word.low, 'low');
        },
        */

        /*
        testShiftR32: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).shiftR(32);

            Y.Assert.areEqual(0x00000000, word.high, 'high');
            Y.Assert.areEqual(0x00010203, word.low, 'low');
        },
        */

        /*
        testRotL: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).rotL(25);

            Y.Assert.areEqual(0x06080a0c, word.high, 'high');
            Y.Assert.areEqual(0x0e000204, word.low, 'low');
        },
        */

        /*
        testRotR: function () {
            var word = C.x64.Word.create(0x00010203, 0x04050607).rotR(7);

            Y.Assert.areEqual(0x0e000204, word.high, 'high');
            Y.Assert.areEqual(0x06080a0c, word.low, 'low');
        },
        */

        /*
        testAdd: function () {
            var word1 = C.x64.Word.create(0x00010203, 0x04050607);
            var word2 = C.x64.Word.create(0x18191a1b, 0x1c1d1e1f);
            var added = word1.add(word2);

            Y.Assert.areEqual(0x181a1c1e, added.high, 'high');
            Y.Assert.areEqual(0x20222426, added.low, 'low');
        }
        */
    }));
}, '$Rev$');
