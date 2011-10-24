YUI.add('cipher-mode-cbc-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'cipher.mode.CBC',

        testVector: function () {
            var message = C.lib.WordArray.create([
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210,
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210
            ]);
            var iv = C.lib.WordArray.create([0x45670123, 0xcdef89ab, 0x45670123, 0xcdef89ab]);

            var expected = C.lib.WordArray.create([
                // First block xored with IV
                0x01234567 ^ 0x45670123,
                0x89abcdef ^ 0xcdef89ab,
                0xfedcba98 ^ 0x45670123,
                0x76543210 ^ 0xcdef89ab,

                // Subsequent blocks xored with previous block
                0x01234567 ^ (0x01234567 ^ 0x45670123),
                0x89abcdef ^ (0x89abcdef ^ 0xcdef89ab),
                0xfedcba98 ^ (0xfedcba98 ^ 0x45670123),
                0x76543210 ^ (0x76543210 ^ 0xcdef89ab)
            ]).toString();

            var actual = C.algo.Null.encrypt(message, null, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });

            Y.Assert.areEqual(expected, actual);
        }
    }));
}, '$Rev$');
