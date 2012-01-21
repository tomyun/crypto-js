YUI.add('mode-cbc-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'mode.CBC',

        testEncrypt: function () {
            var message = C.lib.WordArray.create([
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210,
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210
            ]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var iv = C.lib.WordArray.create([0x45670123, 0xcdef89ab, 0x45670123, 0xcdef89ab]);

            var expected = message.clone();

            C.algo.AES._init(key);

            // First block XORed with IV, then encrypted
            for (var i = 0; i < 4; i++) {
                expected.words[i] ^= iv.words[i];
            }
            C.algo.AES._encryptBlock(expected.words, 0);

            // Subsequent blocks XORed with previous crypted block, then encrypted
            for (var i = 4; i < 8; i++) {
                expected.words[i] ^= expected.words[i - 4];
            }
            C.algo.AES._encryptBlock(expected.words, 4);

            var actual = C.algo.AES.encrypt(message, key, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });

            Y.Assert.areEqual(expected.toString(), actual.rawCiphertext);
        },

        testDecrypt: function () {
            var message = C.lib.WordArray.create([
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210,
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210
            ]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);
            var iv = C.lib.WordArray.create([0x45670123, 0xcdef89ab, 0x45670123, 0xcdef89ab]);

            var encrypted = C.algo.AES.encrypt(message, key, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });
            var decrypted = C.algo.AES.decrypt(encrypted, key, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });

            Y.Assert.areEqual(message.toString(), decrypted);
        }
    }));
}, '$Rev$');
