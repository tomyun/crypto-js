YUI.add('enc-hex-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'enc.Hex',

        testToString: function () {
            var expected = '48656c6c6f2c20576f726c6421';

            var data = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13);
            var actual = C.enc.Hex.toString(data);

            Y.Assert.areEqual(expected, actual);
        },

        testFromString: function () {
            var expected = C.lib.WordArray.create([0x48656c6c, 0x6f2c2057, 0x6f726c64, 0x21000000], 13).toString();

            var data = '48656c6c6f2c20576f726c6421';
            var actual = C.enc.Hex.fromString(data);

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
