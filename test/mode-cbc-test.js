YUI.add('cipher-mode-cbc-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'cipher.mode.CBC',

        testVector: function () {
            var Cipher = C.algo.Null.extend({
                _cfg: C.algo.Null._cfg.extend({
                    padding: C.pad.NoPadding,
                    mode: C.mode.CBC
                }),

                _keySize: 2,

                _ivSize: 2,

                _blockSize: 2
            });

            var message = C.lib.WordArray.create([0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000]);
            var iv = C.lib.WordArray.create([0x45670123, 0xcdef89ab]);

            var expected = C.lib.WordArray.create([
                0x01234567 ^ 0x45670123,
                0x89abcdef ^ 0xcdef89ab,
                0xfedcba98 ^ (0x01234567 ^ 0x45670123),
                0x76543210 ^ (0x89abcdef ^ 0xcdef89ab)
            ]).toString();

            var ciphertext = Cipher.encrypt(message, key, { iv: iv });

            Y.Assert.areEqual(expected, ciphertext);
        }
    }));
}, '$Rev$');
