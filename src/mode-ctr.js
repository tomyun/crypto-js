/**
 * Counter block mode.
 */
CryptoJS.mode.CTR = (function () {
    var CTR = CryptoJS.lib.Cipher.Mode.extend({
        toString: function () {
            return 'CTR';
        }
    });

    var Encryptor = CTR.Encryptor = CTR.extend({
        processBlock: function (dataWords, offset) {
            // Shortcuts
            var cipher = this._cipher
            var blockSize = cipher._blockSize;
            var iv = this._iv;
            var counter = this._counter;

            // Generate keystream
            if (iv) {
                counter = this._counter = iv.words.slice(0);

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            var keystream = counter.slice(0);
            cipher._encryptBlock(keystream, 0);
            counter[counter.length - 1]++;

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                dataWords[offset + i] ^= keystream[i];
            }
        }
    });

    CTR.Decryptor = Encryptor;

    return CTR;
}());
