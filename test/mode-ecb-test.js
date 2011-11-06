YUI.add('mode-ecb-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'mode.ECB',

        testEncrypt: function () {
            var message = C.lib.WordArray.create([
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210,
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210
            ]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);

            var expected = message.clone();
            C.algo.AES._init(key);
            C.algo.AES._encryptBlock(expected.words, 0);
            C.algo.AES._encryptBlock(expected.words, 4);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual(expected.toString(), actual);
        },

        testDecrypt: function () {
            var message = C.lib.WordArray.create([
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210,
                0x01234567, 0x89abcdef, 0xfedcba98, 0x76543210
            ]);
            var key = C.lib.WordArray.create([0x00000000, 0x00000000, 0x00000000, 0x00000000]);

            var encrypted = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });
            var decrypted = C.algo.AES.decrypt(encrypted, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual(message.toString(), decrypted);
        }
    }));
}, '$Rev$');
