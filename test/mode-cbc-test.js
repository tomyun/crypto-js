YUI.add('mode-cbc-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'CBC',

        testEncrypt: function () {
            // Set up
            var message = C.lib.WordArray.create([
                0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
                0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
            ]);
            var key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);
            var iv = C.lib.WordArray.create([0x30313233, 0x34353637, 0x38393a3b, 0x3c3d3e3f]);

            // Compute expected
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

            // Compute actual
            var actual = C.AES.encrypt(message, key, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });

            // Test
            Y.Assert.areEqual(expected.toString(), actual);
        },

        testDecrypt: function () {
            var message = C.lib.WordArray.create([
                0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
                0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
            ]);
            var key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);
            var iv = C.lib.WordArray.create([0x30313233, 0x34353637, 0x38393a3b, 0x3c3d3e3f]);

            var encrypted = C.AES.encrypt(message, key, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });
            var decrypted = C.AES.decrypt(encrypted, key, { iv: iv, padding: C.pad.NoPadding, mode: C.mode.CBC });

            Y.Assert.areEqual(message.toString(), decrypted);
        }
    }));
}, '$Rev$');
