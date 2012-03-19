/**
 * Output Feedback block mode.
 */
CryptoJS.mode.OFB = (function () {
    var OFB = CryptoJS.lib.Cipher.Mode.extend();

    var Encryptor = OFB.Encryptor = OFB.extend({
        processBlock: function (data, offset) {
            // Shortcuts
            var dataWords = data.words;
            var cipher = this._cipher
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream;

            // Generate keystream
            if (iv) {
                keystream = this._keystream = iv.clone();

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            cipher.encryptBlock(keystream, 0);

            // Shortcut
            var keystreamWords = keystream.words;

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                dataWords[offset + i] ^= keystreamWords[i];
            }
        }
    });

    OFB.Decryptor = Encryptor;

    return OFB;
}());
