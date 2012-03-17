/**
 * Output Feedback block mode.
 */
CryptoJS.mode.OFB = (function () {
    var OFB = CryptoJS.lib.Cipher.Mode.extend({
        toString: function () {
            return 'OFB';
        }
    });

    var Encryptor = OFB.Encryptor = OFB.extend({
        processBlock: function (dataWords, offset) {
            // Shortcuts
            var cipher = this._cipher
            var blockSize = cipher._blockSize;
            var iv = this._iv;
            var keystream = this._keystream;

            // Generate keystream
            if (iv) {
                keystream = this._keystream = iv.words.slice(0);

                // Remove IV for subsequent blocks
                this._iv = undefined;
            }
            cipher._encryptBlock(keystream, 0);

            // Encrypt
            for (var i = 0; i < blockSize; i++) {
                dataWords[offset + i] ^= keystream[i];
            }
        }
    });

    OFB.Decryptor = Encryptor;

    return OFB;
}());
