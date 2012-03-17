/**
 * Electronic Codebook block mode.
 */
CryptoJS.mode.ECB = (function () {
    var ECB = CryptoJS.lib.Cipher.Mode.extend({
        toString: function () {
            return 'ECB';
        }
    });

    ECB.Encryptor = ECB.extend({
        processBlock: function (dataWords, offset) {
            this._cipher._encryptBlock(dataWords, offset);
        }
    });

    ECB.Decryptor = ECB.extend({
        processBlock: function (dataWords, offset) {
            this._cipher._decryptBlock(dataWords, offset);
        }
    });

    return ECB;
}());
