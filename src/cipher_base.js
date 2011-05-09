(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var BaseObj = C.oop.BaseObj;
    var Base64 = C.enc.Base64;
    var WordArray = C_lib.WordArray;
    var WordArray_Hex = WordArray.Hex;

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

        fromString: function () {}
    });

    /* Cipher
    ------------------------------------------------------------ */
    var Cipher = C_lib.Cipher = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({}),

        init: function (key, cfg) {
            // Apply config defaults
            cfg = this.cfg = this.cfg.extend(cfg);

            // Convert String to key, else assume key already
            if (typeof key == 'string') {
                key = C.algo.PBKDF2.compute(key, (cfg.salt = WordArray_Hex.random(8)), { keySize: this.keySize });
            }
            cfg.key = key;

            this.doInit();
        },

        getIV: function () {
            // Shortcut
            var iv = this.cfg.iv;

            // Use random IV if not defined
            if (iv === undefined) {
                iv = this.cfg.iv = WordArray_Hex.random(this.ivSize * 4);
            }

            return iv;
        },

        reset: function () {},

        update: function () {},

        compute: function () {}
    });
}(CryptoJS));
