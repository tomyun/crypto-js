(function (undefined) {
    /*global CryptoJS:true */

    'use strict';

    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var BlockCipherMode = C_lib.BlockCipherMode;
    var C_mode = C.mode;

    /**
     * Output Feedback mode.
     */
    C_mode.OFB = (function () {
        var OFB = BlockCipherMode.extend();

        OFB.Encryptor = OFB.Decryptor = OFB.extend({
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                var iv = this._iv;
                var keystream = this._keystream;

                // Generate keystream
                if (iv) {
                    keystream = this._keystream = iv.slice(0);

                    // Remove IV for subsequent blocks
                    this._iv = undefined;
                }
                cipher.encryptBlock(keystream, 0);

                // Encrypt
                for (var i = 0; i < blockSize; i++) {
                    words[offset + i] ^= keystream[i];
                }
            }
        });

        return OFB;
    }());
}());
