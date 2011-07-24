(function (C, undefined) {
    // Shortcuts
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var WordArrayHex = WordArray.Hex;
    var WordArrayLatin1 = WordArray.Latin1;
    var WordArrayUtf8 = WordArray.Utf8;
    var WordArrayBase64 = WordArray.Base64;
    var WordArrayBase64UrlSafe = WordArrayBase64.UrlSafe;
    var Event = C_lib.Event;
    var Formatter = C_lib.Formatter;
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var Base64UrlSafe = Base64.UrlSafe;

    // Cipher namespace
    var C_cipher = C.cipher = {};

    // Cipher formatter
    var CipherFormatter = C_cipher.Formatter = Formatter.extend({
        encoder: Base64
    });

    // Cipher base
    var CipherBase = C_cipher.Base = Base.extend({
        // Config defaults
        cfg: Base.extend({
            formatter: CipherFormatter,

            kdf: function (password) {
                var cipher = this;

                // Shortcuts
                var cfg = cipher.cfg;
                var keySize = cipher.keySize;
                var ivSize = cipher.ivSize;

                // Generate salt
                var salt = cfg.salt;
                if (salt === undefined) {
                    salt = cfg.salt = WordArrayHex.random(2);
                }

                // Derive key and IV
                password = C.EvpKeyDerivation.compute(password, salt, { keySize: keySize + ivSize });

                // Separate key and IV
                if ( ! cfg.iv) {
                    var iv = cfg.iv = password.clone();
                    iv.words.splice(0, keySize);
                    iv.sigBytes -= keySize * 4;
                }
                password.sigBytes = keySize * 4;

                this.key = password;
            }
        }),

        encrypt: function (message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg = this.cfg.extend(cfg);

            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                message = Utf8.decode(message);
            }
            this.message = message;

            // Shortcuts
            var keySize = this.keySize;
            var ivSize = this.ivSize;

            // Convert string to key, else assume key already
            if (typeof password == 'string') {
                cfg.kdf.call(this);
            } else {
                this.key = password;
            }

            this.doEncrypt();

            // Create formatter
            var formatter = cfg.formatter.create(message, cfg.salt);

            // Store extra data
            formatter.key = this.key;
            formatter.iv = cfg.iv;

            return formatter;
        },

        decrypt: function (ciphertext, password) {

        },

        // Defaults, because they're common
        keySize: 8,
        ivSize: 4
    });
}(CryptoJS));
