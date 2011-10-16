YUI.add('enc-latin1-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'enc.Latin1',

        testToString: function () {
            var wordArray = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);

            Y.Assert.areEqual('Hello, World!', C.enc.Latin1.toString(wordArray));
        },

        testFromString: function () {
            var expected = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13).toString();
            var actual = C.enc.Latin1.fromString('Hello, World!');

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
