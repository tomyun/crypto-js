YUI.add('x64-word-test', function (Y) {
    var X64Word = CryptoJS.x64.Word;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'X64Word',

        testInit: function () {
            var word = new X64Word(0x00010203, 0x04050607);

            Y.Assert.areEqual(0x00010203, word.msw, 'msw');
            Y.Assert.areEqual(0x04050607, word.lsw, 'lsw');
        },

        testNot: function () {
            var word = new X64Word(0x00010203, 0x04050607).not();

            Y.Assert.areEqual(~0x00010203, word.msw, 'msw');
            Y.Assert.areEqual(~0x04050607, word.lsw, 'lsw');
        },

        testAnd: function () {
            var word1 = new X64Word(0x00010203, 0x04050607);
            var word2 = new X64Word(0x18191a1b, 0x1c1d1e1f);
            var anded = word1.and(word2);

            Y.Assert.areEqual(0x00010203 & 0x18191a1b, anded.msw, 'msw');
            Y.Assert.areEqual(0x04050607 & 0x1c1d1e1f, anded.lsw, 'lsw');
        },

        testOr: function () {
            var word1 = new X64Word(0x00010203, 0x04050607);
            var word2 = new X64Word(0x18191a1b, 0x1c1d1e1f);
            var ored = word1.or(word2);

            Y.Assert.areEqual(0x00010203 | 0x18191a1b, ored.msw, 'msw');
            Y.Assert.areEqual(0x04050607 | 0x1c1d1e1f, ored.lsw, 'lsw');
        },

        testXor: function () {
            var word1 = new X64Word(0x00010203, 0x04050607);
            var word2 = new X64Word(0x18191a1b, 0x1c1d1e1f);
            var xored = word1.xor(word2);

            Y.Assert.areEqual(0x00010203 ^ 0x18191a1b, xored.msw, 'msw');
            Y.Assert.areEqual(0x04050607 ^ 0x1c1d1e1f, xored.lsw, 'lsw');
        },

        testShiftL25: function () {
            var word = new X64Word(0x00010203, 0x04050607).shiftL(25);

            Y.Assert.areEqual(0x06080a0c, word.msw, 'msw');
            Y.Assert.areEqual(0x0e000000, word.lsw, 'lsw');
        },

        testShiftL32: function () {
            var word = new X64Word(0x00010203, 0x04050607).shiftL(32);

            Y.Assert.areEqual(0x04050607, word.msw, 'msw');
            Y.Assert.areEqual(0x00000000, word.lsw, 'lsw');
        },

        testShiftL0: function () {
            var word = new X64Word(0x00010203, 0x04050607).shiftL(0);

            Y.Assert.areEqual(0x00010203, word.msw, 'msw');
            Y.Assert.areEqual(0x04050607, word.lsw, 'lsw');
        },

        testShiftR7: function () {
            var word = new X64Word(0x00010203, 0x04050607).shiftR(7);

            Y.Assert.areEqual(0x00000204, word.msw, 'msw');
            Y.Assert.areEqual(0x06080a0c, word.lsw, 'lsw');
        },

        testShiftR32: function () {
            var word = new X64Word(0x00010203, 0x04050607).shiftR(32);

            Y.Assert.areEqual(0x00000000, word.msw, 'msw');
            Y.Assert.areEqual(0x00010203, word.lsw, 'lsw');
        },

        testShiftR0: function () {
            var word = new X64Word(0x00010203, 0x04050607).shiftR(0);

            Y.Assert.areEqual(0x00010203, word.msw, 'msw');
            Y.Assert.areEqual(0x04050607, word.lsw, 'lsw');
        },

        testRotL: function () {
            var word = new X64Word(0x00010203, 0x04050607).rotL(25);

            Y.Assert.areEqual(0x06080a0c, word.msw, 'msw');
            Y.Assert.areEqual(0x0e000204, word.lsw, 'lsw');
        },

        testRotR: function () {
            var word = new X64Word(0x00010203, 0x04050607).rotR(7);

            Y.Assert.areEqual(0x0e000204, word.msw, 'msw');
            Y.Assert.areEqual(0x06080a0c, word.lsw, 'lsw');
        },

        testAdd: function () {
            var word1 = new X64Word(0x00010203, 0x04050607);
            var word2 = new X64Word(0x18191a1b, 0x1c1d1e1f);
            var added = word1.add(word2);

            Y.Assert.areEqual(0x181a1c1e, added.msw, 'msw');
            Y.Assert.areEqual(0x20222426, added.lsw, 'lsw');
        }
    }));
}, '$Rev$');
