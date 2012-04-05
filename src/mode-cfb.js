/**
 * Cipher Feedback block mode.
 */
CryptoJS.mode.CFB = (function () {
    var CFB = CryptoJS.lib.Cipher.Mode.extend();

    CFB.Encryptor = CFB.extend({
        processBlock: function (data, offset) {
            // Shortcuts
            var dataWords = data.words;
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            generateKeystreamAndEncrypt.call(this, dataWords, offset, blockSize, cipher);

            // Remember this block to use with next block
            this._prevBlock = dataWords.slice(offset, offset + blockSize);
        }
    });

    CFB.Decryptor = CFB.extend({
        processBlock: function (data, offset) {
            // Shortcuts
            var dataWords = data.words;
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;

            // Remember this block to use with next block
            var thisBlock = dataWords.slice(offset, offset + blockSize);

            generateKeystreamAndEncrypt.call(this, dataWords, offset, blockSize, cipher);

            // This block becomes the previous block
            this._prevBlock = thisBlock;
        }
    });

    function generateKeystreamAndEncrypt(dataWords, offset, blockSize, cipher) {
        // Shortcut
        var iv = this._iv;

        // Generate keystream
        if (iv) {
            var keystream = iv.clone();

            // Remove IV for subsequent blocks
            this._iv = undefined;
        } else {
            var keystream = CryptoJS.lib.WordArray.create(this._prevBlock);
        }
        cipher.encryptBlock(keystream, 0);

        // Shortcut
        var keystreamWords = keystream.words;

        // Encrypt
        for (var i = 0; i < blockSize; i++) {
            dataWords[offset + i] ^= keystreamWords[i];
        }
    }

    return CFB;
}());
