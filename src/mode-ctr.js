/**
 * Counter block mode.
 */
CryptoJS.mode.CTR = (function () {
    var CTR = CryptoJS.lib.Cipher.Mode.extend();

    var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function (data, offset) {
            // Shortcuts
            var dataWords = data.words;
            var cipher = this._cipher
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;

            // Generate keystream
            if (iv) {
                counter = this._counter = iv.clone();

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            var keystream = counter.clone();
            cipher.encryptBlock(keystream, 0);

            // Shortcuts
            var counterWords = counter.words;
            var counterLastWordIndex = (counter.sigBytes - 1) >>> 2;

            // Increment counter
            counterWords[counterLastWordIndex] = (counterWords[counterLastWordIndex] + 1) | 0

            // Shortcut
            var keystreamWords = keystream.words;

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                dataWords[offset + i] ^= keystreamWords[i];
            }
        }
    });

    CTR.Decryptor = Encryptor;

    return CTR;
}());
