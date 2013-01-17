YUI.add('x64-wordarray-test', function (Y) {
    var X64WordArray = CryptoJS.x64.WordArray;
    var X64Word = CryptoJS.x64.Word;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'X64WordArray',

        testInit0: function () {
            Y.Assert.areEqual('', (new X64WordArray()).toX32().toString());
        },

        testInit1: function () {
            var wordArray = new X64WordArray([
                new X64Word(0x00010203, 0x04050607),
                new X64Word(0x18191a1b, 0x1c1d1e1f)
            ]);

            Y.Assert.areEqual('000102030405060718191a1b1c1d1e1f', wordArray.toX32().toString());
        },

        testInit2: function () {
            var wordArray = new X64WordArray([
                new X64Word(0x00010203, 0x04050607),
                new X64Word(0x18191a1b, 0x1c1d1e1f)
            ], 10);

            Y.Assert.areEqual('00010203040506071819', wordArray.toX32().toString());
        },

        testToX32: function () {
            var wordArray = new X64WordArray([
                new X64Word(0x00010203, 0x04050607),
                new X64Word(0x18191a1b, 0x1c1d1e1f)
            ], 10);

            Y.Assert.areEqual('00010203040506071819', wordArray.toX32().toString());
        },

        testClone: function () {
            var wordArray1 = new X64WordArray([
                new X64Word(0x00010203, 0x04050607),
                new X64Word(0x18191a1b, 0x1c1d1e1f)
            ]);
            var wordArray2 = wordArray1.clone();
            wordArray1.words[0] = new X64Word(0, 0);
            wordArray1.words[1].msw = 0;

            Y.Assert.areEqual('000102030405060718191a1b1c1d1e1f', wordArray2.toX32().toString());
        }
    }));
}, '$Rev$');
