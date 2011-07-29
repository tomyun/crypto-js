(function (C, undefined) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var C_lib_Base = C_lib.Base;
    var C_enc = C.enc;
    var C_enc_Hex = C_enc.Hex;
    var C_enc_Utf8 = C_enc.Utf8;
    var C_enc_Base64 = C_enc.Base64;
    var C_hash = C.hash;
    var C_hash_formatter = C_hash.formatter;
    var C_hash_formatter_OpenSSLish = C_hash_formatter.OpenSSLish;

    // Cipher namespace
    var C_cipher = C.cipher = {};

    // Cipher formatter namespace
    var C_cipher_formatter = C_cipher.formatter = {};

    // OpenSSL cipher formatter
    var C_cipher_formatter_OpenSSL = C_cipher_formatter.OpenSSL = C_hash_formatter_OpenSSLish.extend({
        encoder: C_enc_Base64
    });

    // Cipher key derivation namespace
    var C_cipher_kdf = C_cipher.kdf = {};

    // OpenSSL cipher key derivation
    var C_cipher_kdf_OpenSSL = C_cipher_kdf.OpenSSL = {
        execute: function (cipher, password) {
            // Shortcuts
            var cfg = cipher.cfg;
            var keySize = cipher.keySize;
            var ivSize = cipher.ivSize;

            // Generate salt
            if (cfg.salt === undefined) {
                cfg.salt = C_enc_Hex.random(2);
            }

            // Derive key and IV
            var key = C.EvpKeyDerivation.compute(password, cfg.salt, { keySize: keySize + ivSize });

            // Separate key and IV
            if ( ! cfg.iv) {
                cfg.iv = key.$super.create(key.words.slice(keySize));
            }
            key.sigBytes = keySize * 4;

            cipher.key = key;
        }
    };

    // Base cipher
    var C_cipher_Base = C_cipher.Base = C_lib_Base.extend({
        // Config defaults
        cfg: C_lib_Base.extend({
            formatter: C_cipher_formatter_OpenSSL,
            kdf: C_cipher_kdf_OpenSSL
        }),

        encrypt: function (message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg = this.cfg.extend(cfg);

            // Convert string to WordArray, else assume WordArray already
            if (typeof message == 'string') {
                message = C_enc_Utf8.fromString(message);
            }

            this.message = message;

            // Convert string to key, else assume key already
            if (typeof password == 'string') {
                cfg.kdf.execute(this, password);
            } else {
                if (this.ivSize && ! cfg.iv) {
                    throw new Error('Missing IV');
                }

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
