YUI.add('cipher-base-test', function (Y) {
    var C = CryptoJS;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'cipher.Base',

        testPlaintextInputIntegrity: function () {
            var expectedPlaintext = '0000000000000000';
            var expectedKey = '0123456789abcdef';

            var plaintext = C.lib.WordArray.create([0x00000000, 0x00000000]);
            var key = C.lib.WordArray.create([0x01234567, 0x89abcdef]);
            C.RC4.encrypt(plaintext, key);

            Y.Assert.areEqual(expectedPlaintext, plaintext);
            Y.Assert.areEqual(expectedKey, key);
        },

        testCiphertextInputIntegrity: function () {
            var expectedRawCiphertext = '7494c2e7104b0879';
            var expectedKey = '0123456789abcdef';

            var rawCiphertext = C.lib.WordArray.create([0x7494c2e7, 0x104b0879]);
            var ciphertext = C.cipher.Ciphertext.create(rawCiphertext);
            var key = C.lib.WordArray.create([0x01234567, 0x89abcdef]);
            C.RC4.decrypt(ciphertext, key);

            Y.Assert.areEqual(expectedRawCiphertext, rawCiphertext);
            Y.Assert.areEqual(expectedKey, key);
        }
    }));
});
