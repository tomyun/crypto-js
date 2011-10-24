YUI.add('algo-aes-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'algo.AES',

        testEncryptBlockWith128BitKey: function () {
            var message = C.lib.WordArray.create([0x00112233, 0x44556677, 0x8899aabb, 0xccddeeff]);
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('69c4e0d86a7b0430d8cdb78070b4c55a', actual);
        },

        testEncryptBlockWith192BitKey: function () {
            var message = C.lib.WordArray.create([0x00112233, 0x44556677, 0x8899aabb, 0xccddeeff]);
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617]);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('dda97ca4864cdfe06eaf70a0ec0d7191', actual);
        },

        testEncryptBlockWith256BitKey: function () {
            var message = C.lib.WordArray.create([0x00112233, 0x44556677, 0x8899aabb, 0xccddeeff]);
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617, 0x18191A1B, 0x1C1D1E1F]);

            var actual = C.algo.AES.encrypt(message, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('8ea2b7ca516745bfeafc49904b496089', actual);
        },

        testDecryptBlockWith128BitKey: function () {
            var ciphertext = '69c4e0d86a7b0430d8cdb78070b4c55a';
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f]);

            var actual = C.algo.AES.decrypt(ciphertext, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('00112233445566778899aabbccddeeff', actual);
        },

        testDecryptBlockWith192BitKey: function () {
            var ciphertext = 'dda97ca4864cdfe06eaf70a0ec0d7191';
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617]);

            var actual = C.algo.AES.decrypt(ciphertext, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('00112233445566778899aabbccddeeff', actual);
        },

        testDecryptBlockWith256BitKey: function () {
            var ciphertext = '8ea2b7ca516745bfeafc49904b496089';
            var key = C.lib.WordArray.create([0x00010203, 0x04050607, 0x08090a0b, 0x0c0d0e0f, 0x10111213, 0x14151617, 0x18191A1B, 0x1C1D1E1F]);

            var actual = C.algo.AES.decrypt(ciphertext, key, { padding: C.pad.NoPadding, mode: C.mode.ECB });

            Y.Assert.areEqual('00112233445566778899aabbccddeeff', actual);
        },

        testHelper: function () {
            var message = 'Hi There';
            var password = 'Jefe';

            var expected = C.algo.PBE.encrypt(C.algo.AES, message, password).toString();

            // Y.Assert.areEqual(expected, C.AES.encrypt(message, password));
        }
    }));
}, '$Rev$');
