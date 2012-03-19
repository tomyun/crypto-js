/**
 * Electronic Codebook block mode.
 */
CryptoJS.mode.ECB = (function () {
    var ECB = CryptoJS.lib.Cipher.Mode.extend();

    ECB.Encryptor = ECB.extend({
        processBlock: function (data, offset) {
            this._cipher.encryptBlock(data, offset);
        }
    });

    ECB.Decryptor = ECB.extend({
        processBlock: function (data, offset) {
            this._cipher.decryptBlock(data, offset);
        }
    });

    return ECB;
}());
