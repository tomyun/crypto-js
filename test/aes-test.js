YUI.add('algo-aes-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.AES',

        testEncryptKeySize128: function () {
            var message = C.lib.WordArray.create([0x00112233, 0x44556677, 0x8899aabb, 0xccddeeff]);
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('69c4e0d86a7b0430d8cdb78070b4c55a', actual);
        },

        testEncryptKeySize192: function () {
            var message = C.lib.WordArray.create([0x00112233, 0x44556677, 0x8899aabb, 0xccddeeff]);
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617]);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('dda97ca4864cdfe06eaf70a0ec0d7191', actual);
        },

        testEncryptKeySize256: function () {
            var message = C.lib.WordArray.create([0x00112233, 0x44556677, 0x8899aabb, 0xccddeeff]);
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617, 0x18191A1B, 0x1C1D1E1F]);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('8ea2b7ca516745bfeafc49904b496089', actual);
        },

        testDecryptKeySize128: function () {
            var ciphertext = '69c4e0d86a7b0430d8cdb78070b4c55a';
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);

            var actual = C.algo.AES.decrypt(ciphertext, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('00112233445566778899aabbccddeeff', actual);
        },

        testDecryptKeySize192: function () {
            var ciphertext = 'dda97ca4864cdfe06eaf70a0ec0d7191';
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617]);

            var actual = C.algo.AES.decrypt(ciphertext, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('00112233445566778899aabbccddeeff', actual);
        },

        testDecryptKeySize256: function () {
            var ciphertext = '8ea2b7ca516745bfeafc49904b496089';
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617, 0x18191A1B, 0x1C1D1E1F]);

            var actual = C.algo.AES.decrypt(ciphertext, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('00112233445566778899aabbccddeeff', actual);
        },

        testHelper: function () {
            // Save original random method
            var random_ = C.lib.WordArray.random;

            // Replace random method with one that returns a predictable value
            C.lib.WordArray.random = function (nBytes) {
                var words = [];
                for (var i = 0; i < nBytes; i += 4) {
                    words.push([0x11223344]);
                }

                return this.create(words, nBytes);
            };

            // Expected
            var message = 'Hi There';
            var password = 'Jefe';
            var expected = C.algo.PBE.encrypt(C.algo.AES, message, password).toString();

            // Test
            Y.Assert.areEqual(expected, C.AES.encrypt(message, password));

            // Restore random method
            C.lib.WordArray.random = random_;
        }
    }));
}, '$Rev$');
