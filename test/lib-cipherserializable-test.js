YUI.add('lib-cipherserializable-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'SerializableCipher',

        testEncrypt: function () {
            var message = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var key = C.lib.WordArray.create([0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f]);
            var iv = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);

            // Compute expected
            var aes = C.algo.AES.createEncryptor(key, { iv: iv });
            var ciphertext = aes.finalize(message);
            var expected = C.lib.Cipher.Params.create({
                ciphertext: ciphertext,
                key: key,
                iv: iv,
                algorithm: C.algo.AES,
                mode: aes._cfg.mode,
                padding: aes._cfg.padding,
                blockSize: aes._blockSize,
                formatter: C.format.OpenSSL
            });

            // Compute actual
            var actual = C.lib.Cipher.Serializable.encrypt(C.algo.AES, message, key, { iv: iv });

            // Test
            Y.Assert.areEqual(expected.toString(), actual);
            Y.Assert.areEqual(expected.ciphertext.toString(), actual.ciphertext);
            Y.Assert.areEqual(expected.key.toString(), actual.key);
            Y.Assert.areEqual(expected.iv.toString(), actual.iv);
            Y.Assert.areEqual(expected.algorithm.toString(), actual.algorithm);
            Y.Assert.areEqual(expected.mode.toString(), actual.mode);
            Y.Assert.areEqual(expected.padding.toString(), actual.padding);
            Y.Assert.areEqual(expected.blockSize.toString(), actual.blockSize);
        },

        testDecrypt: function () {
            var message = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);
            var key = C.lib.WordArray.create([0x10111213, 0x14151617, 0x18191a1b, 0x1c1d1e1f]);
            var iv = C.lib.WordArray.create([0x20212223, 0x24252627, 0x28292a2b, 0x2c2d2e2f]);

            var encrypted = C.lib.Cipher.Serializable.encrypt(C.algo.AES, message, key, { iv: iv }) + '';
            var decrypted = C.lib.Cipher.Serializable.decrypt(C.algo.AES, encrypted, key, { iv: iv });

            Y.Assert.areEqual(message.toString(), decrypted);
        }
    }));
}, '$Rev$');
