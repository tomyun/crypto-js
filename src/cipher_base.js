(function (C, undefined) {
    // Core shortcuts
    var C_lib = C.lib;
    var BaseObj = C_lib.BaseObj;
    var WordArray = C_lib.WordArray;
    var WordArray_Hex = WordArray.Hex;
    var WordArray_Latin1 = WordArray.Latin1;
    var WordArray_Utf8 = WordArray.Utf8;
    var Event = C_lib.Event;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;

    // Base64 shortcuts
    var Base64 = C_enc.Base64;
    var Base64_UrlSafe = Base64.UrlSafe;
    var WordArray_Base64 = WordArray.Base64;
    var WordArray_Base64_UrlSafe = WordArray_Base64.UrlSafe;

    // Cipher namespace
    var C_cipher = C.cipher = {};

    // Formatter
    var Formatter = C_cipher.Formatter = C_lib.Formatter.extend({
        encoder: Base64
    });

    // Base
    var Base = C_cipher.Base = BaseObj.extend({
        // Config defaults
        cfg: BaseObj.extend({
            formatter: Formatter,
            kdf: C.EvpKeyDerivation
        }),

        encrypt: function (message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                message = Utf8.decode(message);
            }

            // Shortcuts
            var keySize = this.keySize;
            var ivSize = this.ivSize;

            // Convert string to key, else assume key already
            if (typeof password == 'string') {
                // Generate salt
                var salt = cfg.salt;
                if (salt === undefined) {
                    salt = WordArray_Hex.random(2);
                }

                // Derive key and IV
                password = cfg.kdf.compute(password, salt, { keySize: keySize + ivSize });

                // Separate key and IV
                var iv = cfg.iv;
                if (iv === undefined) {
                    iv = password.clone();
                    iv.words.splice(0, keySize);
                    iv.sigBytes -= keySize * 4;
                }
                password.sigBytes = keySize * 4;
            } else {
                // If this cipher uses an IV but one hasn't been provided,
                // then we've got a problem.
                if (ivSize && ! cfg.iv) {
                    throw new Error('If you specify the key, then you must also specify the IV.');
                }
            }

            this.doEncrypt(message, password, iv);

            // Create formatter
            var formatter = cfg.formatter.create(message, salt);

            // Store extra data
            formatter.key = password;
            formatter.iv = iv;

            return formatter;
        },

        decrypt: function (ciphertext, password) {

        },

        // Defaults, because they're common
        keySize: 8,
        ivSize: 4
    });
}(CryptoJS));
