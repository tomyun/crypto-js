YUI.add('lib-cipher-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'lib.Cipher',

        testUpdate: function () {
            Y.Assert.fail();
        },

        testStreamPartialBlock: function () {
            Y.Assert.fail();
        },

        testPlaintextInputIntegrity: function () {
            var plaintext = C.lib.WordArray.create([0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x01234567, 0x89abcdef]);

            var expectedPlaintext = plaintext.toString();
            var expectedKey = key.toString();

            C.algo.RC4.createEncryptor(key).compute(plaintext);

            Y.Assert.areEqual(expectedPlaintext, plaintext);
            Y.Assert.areEqual(expectedKey, key);
        },

        testCiphertextInputIntegrity: function () {
            var rawCiphertext = C.lib.WordArray.create([0x7494c2e7, 0x104b0879]);
            var key = C.lib.WordArray.create([0x01234567, 0x89abcdef]);

            var expectedRawCiphertext = rawCiphertext.toString();
            var expectedKey = key.toString();

            C.algo.RC4.createDecryptor(key).compute(ciphertext);

            Y.Assert.areEqual(expectedRawCiphertext, rawCiphertext);
            Y.Assert.areEqual(expectedKey, key);
        }
    }));
}, '$Rev$');
