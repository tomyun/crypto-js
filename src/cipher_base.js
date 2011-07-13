(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C.oop.BaseObj;
    var Base64 = C.enc.Base64;
    var WordArray = C_lib.WordArray;
    var WordArray_Base64 = WordArray.Base64;

    /* Ciphertext wrapper
    ------------------------------------------------------------ */
    var Ciphertext = C_lib.Ciphertext = BaseObj.extend({
        init: function (ciphertext, optional) {
            this.rawCiphertext = ciphertext;

            if (optional) {
                this.iv = optional.iv;
                this.salt = optional.salt;
            }
        },

        toString: function () {
            var ciphertextStr = '';

            if (this.iv) {
                ciphertextStr += 'iv_' + this.iv.toString(Base64) + '_';
            }
            if (this.salt) {
                ciphertextStr += 'salt_' + this.salt.toString(Base64) + '_';
            }

            return ciphertextStr + this.rawCiphertext.toString(Base64);
        },

        fromString: function (ciphertextStr) {
            var rawCiphertextBeginIndex = 0;

            // Get IV
            if (ciphertextStr.substr(0, 3) == 'iv_') {
                var ivEndIndex = ciphertextStr.indexOf('_', 3);
                var iv = WordArray_Base64.fromString(ciphertextStr.substring(3, ivEndIndex));

                rawCiphertextBeginIndex = ivEndIndex + 1;
            }

            // Get salt
            if (ciphertextStr.substr(rawCiphertextBeginIndex, 5) == 'salt_') {
                var saltEndIndex = ciphertextStr.indexOf('_', rawCiphertextBeginIndex + 5);
                var salt = WordArray_Base64.fromString(ciphertextStr.substring(rawCiphertextBeginIndex + 5, saltEndIndex));

                rawCiphertextBeginIndex = saltEndIndex + 1;
            }

            // Get raw ciphertext
            var rawCiphertext = WordArray_Base64.fromString(ciphertextStr.substr(rawCiphertextBeginIndex));

            return this.create(rawCiphertext, { iv: iv, salt: salt });
        }
    });

    /* Cipher
    ------------------------------------------------------------ */
    var Cipher = C_lib.Cipher = BaseObj.extend({
        encrypt: function (message, password, cfg) {
            // Convert Strings to WordArrays, else assume WordArrays already
            if (typeof message == 'string') {
                message = WordArray.fromString(message);
            }
            if (typeof password == 'string') {
                // Generate key
                var salt = this.salt = WordArray_Base64.random(2);
                password = C.PBKDF2(password, salt, { keySize: this.keySize });
            }

            this.message = message;
            this.key = password;

            this.doEncrypt();

            return Ciphertext.create(message, { salt: salt })
        },

        decrypt: function (ciphertext, password) {

        }
    });
}(CryptoJS));
