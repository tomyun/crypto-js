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
    var C_enc = C.enc;
    var Hex = C_enc.Hex;
    var Latin1 = C_enc.Latin1;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var Base64UrlSafe = Base64.UrlSafe;

    // Cipher namespace
    var C_cipher = C.cipher = {};

    // Cipher formatter namespace
    var C_cipher_formatter = C_cipher.formatter = {};

    // OpenSSL cipher formatter
    var OpenSSLCipherFormatter = C_cipher_formatter.OpenSSL = C.hash.formatter.OpenSSLInspired.extend({
        encoder: Base64
    });

    // Cipher key derivation namespace
    var C_cipher_kdf = C_cipher.kdf = {};

    // OpenSSL cipher key derivation
    var OpenSSLCipherKeyDerivation = C_cipher_kdf.OpenSSL = function (password) {
        var cipher = this;

        // Shortcuts
        var cfg = cipher.cfg;
        var keySize = cipher.keySize;
        var ivSize = cipher.ivSize;

        // Generate salt
        if (cfg.salt === undefined) {
            cfg.salt = WordArrayHex.random(2);
        }

        // Derive key and IV
        var key = C.EvpKeyDerivation.compute(password, cfg.salt, { keySize: keySize + ivSize });

        // Separate key and IV
        if ( ! cfg.iv) {
            var iv = cfg.iv = key.clone();
            iv.words.splice(0, keySize);
            iv.sigBytes -= keySize * 4;
        }
        key.sigBytes = keySize * 4;

        this.key = key;
    };

    // Base cipher
    var BaseCipher = C_cipher.Base = Base.extend({
        // Config defaults
        cfg: Base.extend({
            formatter: OpenSSLCipherFormatter,
            kdf: OpenSSLCipherKeyDerivation
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
