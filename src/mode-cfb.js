/**
 * Cipher Feedback block mode.
 */
CryptoJS.mode.CFB = (function () {
    var CFB = CryptoJS.lib.Cipher.Mode.extend({
        toString: function () {
            return 'CFB';
        }
    });

    CFB.Encryptor = CFB.extend({
        processBlock: function (dataWords, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher._blockSize;

            generateKeystreamAndEncrypt.call(this, dataWords, offset, cipher, blockSize);

            // Remember this block to use with next block
            this._previousBlock = dataWords.slice(offset, blockSize);
        }
    });

    CFB.Decryptor = CFB.extend({
        processBlock: function (dataWords, offset) {
            // Shortcuts
            var cipher = this._cipher;
            var blockSize = cipher._blockSize;

            // Remember this block to use with next block
            var thisBlock = dataWords.slice(offset, blockSize);

            generateKeystreamAndEncrypt.call(this, dataWords, offset, cipher, blockSize);

            // This block becomes the previous block
            this._previousBlock = thisBlock;
        }
    });

    function generateKeystreamAndEncrypt(dataWords, offset, cipher, blockSize) {
        // Shortcut
        var iv = this._iv;

        // Generate keystream
        if (iv) {
            var keystream = iv.words.slice(0);

            // Remove IV for subsequent blocks
            this._iv = undefined;
        } else {
            var keystream = this._previousBlock;
        }
        cipher._encryptBlock(keystream, 0);

        // Encrypt
        for (var i = 0; i < blockSize; i++) {
            dataWords[offset + i] ^= keystream[i];
        }
    }

    return CFB;
}());
