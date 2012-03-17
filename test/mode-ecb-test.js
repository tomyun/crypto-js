YUI.add('mode-ecb-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'ECB',

        testEncryptor: function () {
            var message = C.lib.WordArray.create([
                0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
                0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
            ]);
            var key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);

            // Compute expected
            var expected = message.clone();
            var aes = C.algo.AES.createEncryptor(key);
            aes._encryptBlock(expected.words, 0);
            aes._encryptBlock(expected.words, 4);

            // Compute actual
            var actual = C.AES.encrypt(message, key, { mode: C.mode.ECB, padding: C.pad.NoPadding }).ciphertext;

            // Test
            Y.Assert.areEqual(expected.toString(), actual);
        },

        testDecryptor: function () {
            var message = C.lib.WordArray.create([
                0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f,
                0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f
            ]);
            var key = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);

            var encrypted = C.AES.encrypt(message, key, { mode: C.mode.ECB, padding: C.pad.NoPadding });
            var decrypted = C.AES.decrypt(encrypted, key, { mode: C.mode.ECB, padding: C.pad.NoPadding });

            Y.Assert.areEqual(message.toString(), decrypted);
        }
    }));
}, '$Rev$');
