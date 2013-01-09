YUI.add('lib-wordarray-test', function (Y) {
    var WordArray = CryptoJS.lib.WordArray;

    Y.CryptoJSTestSuite.add(new Y.Test.Case({
        name: 'WordArray',

        testConstructor: function () {
            Y.Assert.areEqual('', (new WordArray()).toString());
            Y.Assert.areEqual('12345678', (new WordArray([0x12345678])).toString());
            Y.Assert.areEqual('1234', (new WordArray([0x12345678], 2)).toString());
        },

        testToString: function () {
            Y.Assert.areEqual('12345678', (new WordArray([0x12345678])).toString());
            Y.Assert.areEqual('\x12\x34\x56\x78', (new WordArray([0x12345678])).toString(CryptoJS.enc.Latin1));
        },

        testConcat3: function () {
            var wordArray1 = new WordArray([0x12345678], 3);
            var wordArray2 = new WordArray([0x12345678], 3);

            Y.Assert.areEqual('123456123456', wordArray1.concat(wordArray2).toString());
            Y.Assert.areEqual('123456123456', wordArray1.toString());
        },

        testConcat4: function () {
            var wordArray1 = new WordArray([0x12345678], 4);
            var wordArray2 = new WordArray([0x12345678], 3);

            Y.Assert.areEqual('12345678123456', wordArray1.concat(wordArray2).toString());
            Y.Assert.areEqual('12345678123456', wordArray1.toString());
        },

        testConcat5: function () {
            var wordArray1 = new WordArray([0x12345678], 5);
            var wordArray2 = new WordArray([0x12345678], 3);

            Y.Assert.areEqual('1234567800123456', wordArray1.concat(wordArray2).toString());
            Y.Assert.areEqual('1234567800123456', wordArray1.toString());
        },

        testConcatLong: function () {
            var wordArray1 = new WordArray();
            var wordArray2 = WordArray.random(0x40000);

            Y.Assert.areEqual(wordArray2.toString(), wordArray1.concat(wordArray2).toString());
            Y.Assert.areEqual(wordArray2.toString(), wordArray1.toString());
        },

        testClamp: function () {
            var wordArray = new WordArray([0x12345678, 0x12345678], 3);
            wordArray.clamp();

            Y.Assert.areEqual([0x12345600].toString(), wordArray.words.toString());
        },

        testClone: function () {
            var wordArray1 = new WordArray([0x12345678]);
            var wordArray2 = wordArray1.clone();
            wordArray1.words[0] = 0;

            Y.Assert.areEqual('12345678', wordArray2.toString());
        },

        testRandom: function () {
            Y.Assert.areNotEqual(WordArray.random(8).toString(), WordArray.random(8).toString());
            Y.Assert.areEqual(8, WordArray.random(8).sigBytes);
        }
    }));
}, '$Rev$');
